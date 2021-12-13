import { all, call, put, select, takeEvery, cancelled } from 'redux-saga/effects';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import types from '@constants/actions';
import HeaderManager from 'utils/HeaderManager';
import { promiseWait } from 'utils/functions';
import * as Selectors from 'selectors';
import { signUpApi, authApi } from './apis';
import companySagas from './company';
import companyTravelSagas from './companyTravel';
import companyPurchasesSagas from './companyPurchases';
import companyEmployeeSagas from './companyEmployee';
import companyUserSagas from './companyUser';
import spendCostSagas from './spendCost';
import emissionSagas from './emission';
import companyCommuteSagas from './companyCommute';
import companyProductSagas from './companyProduct';
import companySoldProductSagas from './companySoldProduct';
import companyProductMaterialSagas from './companyProductMaterial';
import materialSagas from './material';
import companyUtilitySagas from './companyUtility';
import companyWasteSagas from './companyWaste';
import companyMetricSagas from './companyMetric';
import companyUserInvitationSagas from './companyUserInvitation';
import userSagas from './user';
import summarySagas from './summary';
import assetGroupSagas from './assetGroups';
import assetSagas from './assets';
import leaseAssetSagas from './leaseAssets';
import assignSagas from './assign';
import assignedSagas from './assigned';
import assetEngineSagas from './assetEngine';
import assetRefrigeratorSagas from './assetRefrigerator';
import engineSagas from './engine';
import forgotPasswordSagas from './forgotPassword';
import resetPasswordSagas from './resetPassword';
import fuelSagas from './fuel';
import analyticSagas from './analytic';
import reportSagas from './report';
import frameworkSagas from './framework';
import tmpSagas from './tmp';

export function* clearAuthorizationHeaderAfterClearSession() {
  yield takeEvery([types.CLEAR_SESSION_CACHE, types.AUTH_USER_ERROR], function* foo(action) {
    HeaderManager.delete('Authorization');
    yield put({ type: types.CLEAR_SENSITIVE_DATA });
  });
}

export function* watchSuccessAuth() {
  yield takeEvery([types.AUTH_USER_SUCCESS], function* foo(action) {
    const { token } = action.data;
    yield put({ type: types.SESSION_VERIFIED, data: { token }});
  });
}

export function* watchSessionVerified() {
  yield takeEvery([types.SESSION_VERIFIED], function* foo(action, getState) {
    const { 
      token, 
    } = action.data;
    try {
      HeaderManager.set('Authorization', `Bearer ${token}`);
      // select user.dashboard (which means reports)
      // get all needs reports data
      // dispatch all required restful
      yield promiseWait(1000);
      const userId = yield select(Selectors.selectUserId);
      const companyId = yield select(Selectors.selectUserCompanyId);
      yield all([
        yield put({ type: types.GET_PARENTS_COMPANY, data: { companyId }}),
        // yield put({ type: types.GET_CHILDREN_COMPANY, data: { companyId }}),
        yield put({ type: types.GET_COMPANY, data: { companyId }}),
        yield put({ type: types.GET_COMPANY_ALL_ASSETGROUPS, data: { companyId }}),
        yield put({ type: types.GET_ANALYTIC_REPORTS, data: { userId } }), // auto get analytic report data after get list
        yield put({ type: types.GET_COMPANY_METRICS, data: { companyId } }),
        yield put({
          type: types.GET_FRAMEWORKS,
          data: { companyId },
          [WAIT_FOR_ACTION]: types.GET_FRAMEWORKS_SUCCESS,
          [ERROR_ACTION]: types.GET_FRAMEWORKS_ERROR,
        })
      ])
      const frameworks = yield select(Selectors.selectFrameworks)
      const frameworkId = frameworks[0].id;
      yield put({ type: types.GET_FRAMEWORK_CATEGORIES, data: { frameworkId, companyId }});
      // TODO: maybe should bottleneck this process before access.
    } catch (e) {
      console.warn('Initial Error', e);
    }
    
  });
}

export function* autoProcessAfterRegistered() {
  yield takeEvery(types.REGIST_USER_SUCCESS, function* foo(action) {
    const { email, password, ...others } = action.data;
    try {
      yield all(
        yield put({ type: types.UPDATE_REMEMBER_ME, data: { value: true }}),
        yield put({ type: types.AUTH_USER, data: { email, password }}),
        yield put({ type: types.POST_COMPANY, data: others }),
      )
    } catch (e) {
      console.warn('process after registed', e);
    }
    
  })
}

export function* watchRegistRequest() {
  yield takeEvery(types.REGIST_USER, function* foo(action) {
    let result;
    const {
      email,
      password,
      // companyDomain,
      // companyName,
      // role,
      // headCount,
      // name,
    } = action.data;
    try {
      result = yield call(signUpApi, email, password);
      HeaderManager.set('Authorization', `Bearer ${result.data.token}`);
      yield put({ 
        type: types.REGIST_USER_SUCCESS,
        data: action.data,
      });
    } catch (e) {
      console.warn('signUp', e.response);
      yield put({ type: types.REGIST_USER_ERROR, error: e })
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export function* watchLoginRequest() {
  yield takeEvery(types.AUTH_USER, function* foo(action) {
    let result;
    try {
      result = yield call(authApi, action.data.email, action.data.password);
      yield put({ 
        type: types.AUTH_USER_SUCCESS,
        data: {
          user: result.data.user,
          token: result.data.token,
        },
      });
    } catch (e) {
      console.warn('auth', e.response, e);
      yield put({ type: types.AUTH_USER_ERROR, error: e })
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export default function* root() {
  yield all([
    call(watchLoginRequest),
    call(watchSuccessAuth),
    call(watchSessionVerified),
    call(watchRegistRequest),
    call(autoProcessAfterRegistered),
    call(clearAuthorizationHeaderAfterClearSession),
    call(companySagas),
    call(companyTravelSagas),
    call(companyCommuteSagas),
    call(companyProductSagas),
    call(companySoldProductSagas),
    call(companyProductMaterialSagas),
    call(materialSagas),
    call(companyUtilitySagas),
    call(companyPurchasesSagas),
    call(companyEmployeeSagas),
    call(companyWasteSagas),
    call(companyUserInvitationSagas),
    call(spendCostSagas),
    call(emissionSagas),
    call(summarySagas),
    call(userSagas),
    call(assetGroupSagas),
    call(assetSagas),
    call(leaseAssetSagas),
    call(assignSagas),
    call(assignedSagas),
    call(assetEngineSagas),
    call(assetRefrigeratorSagas),
    call(engineSagas),
    call(forgotPasswordSagas),
    call(resetPasswordSagas),
    call(fuelSagas),
    call(analyticSagas),
    call(reportSagas),
    call(frameworkSagas),
    call(companyMetricSagas),
    call(companyUserSagas),
    call(tmpSagas),
  ]);
}