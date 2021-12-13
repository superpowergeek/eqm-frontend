import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';

import types from '@constants/actions';
import { postCompanyApi, getCompanyApi, getChildrenCompanyApi, getParentsCompanyApi, getAllCompanyApi } from './apis';

export function* watchGetParentsCompany() {
  yield takeEvery(types.GET_PARENTS_COMPANY, function* foo(action) {
    let result;
    const { companyId } = action.data;
    try {
      result = yield call(getParentsCompanyApi, companyId);
      yield put({ type: types.GET_PARENTS_COMPANY_SUCCESS, data: { collection: result.data, companyId }});
    } catch (e) {
      console.error('get parents company', e.response, e);
      yield put({ type: types.GET_PARENTS_COMPANY_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

// export function* watchGetChildrenCompany() {
//   yield takeEvery(types.GET_CHILDREN_COMPANY, function* foo(action) {
//     let result;
//     const { companyId } = action.data;
//     try {
//       result = yield call(getChildrenCompanyApi, companyId);
//       console.log('children', result.data);
//       yield put({ type: types.GET_CHILDREN_COMPANY_SUCCESS, data: { collection: result.data, companyId }});
//     } catch (e) {
//       console.error('get children company', e.response, e);
//       yield put({ type: types.GET_CHILDREN_COMPANY_ERROR, error: e });
//     } finally {
//       if (yield cancelled()) {
//         //result[CANCEL]();
//       }
//     }
//   })
// } 

export function* wathcGetCompany() {
  yield takeEvery(types.GET_COMPANY, function* foo(action) {
    let result;
    const { companyId } = action.data;
    try {
      result = yield call(getCompanyApi, companyId);
      const children = yield call(getChildrenCompanyApi, companyId);
      yield put({ type: types.GET_COMPANY_SUCCESS, data: { company: result.data, children: children.data }});
    } catch (e) {
      console.error('get company', e.response, e);
      yield put({ type: types.GET_COMPANY_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

// export function* watchGetAllCompany() {
//   yield takeEvery(types.GET_ALL_COMPANY, function* foo(action) {
//     let result;
//     try {
//       result = yield call(getAllCompanyApi);
//       yield put({ type: types.GET_ALL_COMPANY_SUCCESS, data: { collection: result.data } });
//     } catch (e) {
//       console.warn('get all company', e.response);
//       yield put({ type: types.GET_ALL_COMPANY_ERROR, error: e });
//     } finally {
//       if (yield cancelled()) {
//         //result[CANCEL]();
//       }
//     }
//   })
// }

export function* watchPostCompnay() {
  yield takeEvery(types.POST_COMPANY, function* foo(action) {
    let result;
    try {
      result = yield call(postCompanyApi, action.data);
      yield put({ 
        type: types.POST_COMPANY_SUCCESS,
        data: result.data,
      });
    } catch (e) {
      console.warn('post company', e.response);
      yield put({ 
        type: types.POST_COMPANY_ERROR,
        error: e,
      });
    }
  })
}

export default function* companyRoot() {
  yield all([
    // call(watchGetAllCompany),
    call(watchPostCompnay),
    call(wathcGetCompany),
    call(watchGetParentsCompany),
    // call(watchGetChildrenCompany),
  ]);
}

