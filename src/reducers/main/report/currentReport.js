import types from '@constants/actions';
import { EditorState, convertFromRaw } from 'draft-js';
import simpleTemplate from 'pages/Reports/simpleTemplate';

const initialState = {
  id: 'tmp',
  name: '',
  description: '',
  content: EditorState.createWithContent(convertFromRaw(simpleTemplate)),
}

const currentReport = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_USER_REPORT_CURRENT_REPORT: {
      return {
        ...state,
        ...action.data,
      }
    }
    case types.INIT_CURRENT_USER_REPORT: {
      return initialState;
    }
    default: return state;
  }
}

export default currentReport;
