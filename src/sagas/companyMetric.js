import moment from 'moment';
import { all, call, put, takeEvery, cancelled, select } from 'redux-saga/effects';
import types from '@constants/actions';

import { addCompanyMetric, updateCompanyMetric, getCompanyMetrics, getCompanyMetricsCalculated } from './apis';
import * as Selectors from 'selectors';

function* watchGetCompanyMetrics() {
  yield takeEvery(types.GET_COMPANY_METRICS, function* foo(action) {
    try {
      const { companyId, calculated, frameworkId } = action.data;
      let result;
      const beginDate = moment().subtract(1, 'years').startOf('month').format('x');
      const endDate = moment().format('x');
      if (calculated) {
        result = yield call(getCompanyMetricsCalculated, companyId, {
          beginDate,
          endDate,
          frameworkId,
        });
      } else {
        result = yield call(getCompanyMetrics, companyId, {
          beginDate,
          endDate,
        });
      }
      const { data } = result;
      yield put({ type: types.GET_COMPANY_METRICS_SUCCESS, data: { collection: data, companyId }});
    } catch (e) {
      yield put({ type: types.GET_COMPANY_METRICS_ERROR, error: e });
    }
  })
}

function* watchUpdateCompanyMetric() {
  yield takeEvery(types.UPDATE_COMPANY_METRIC, function* foo(action) {
    try {
      let result;
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { metricId, value, companyMetricId } = action.data;
      const payload = {
        metricId,
        value,
        companyId,
        time: moment().format('x'),
      }
      if (companyMetricId) {
        result = yield call(updateCompanyMetric, companyMetricId, payload);
      } else {
        result = yield call(addCompanyMetric, payload);
      }
      yield put({ type: types.UPDATE_COMPANY_METRIC_SUCCESS, data: { companyMetric: result.data, companyId }});
    } catch (e) {
      yield put({ type: types.UPDATE_COMPANY_METRIC_ERROR, error: e });
    }
  })
}

export default function* companyMetricRoot() {
  yield all([
    call(watchGetCompanyMetrics),
    call(watchUpdateCompanyMetric),
  ])
}