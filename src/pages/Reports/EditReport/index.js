/* eslint-disable eqeqeq */
import React from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { replace } from 'connected-react-router';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import types from '@constants/actions';
import * as Selectors from 'selectors';
import FlexDiv from 'components/shared/FlexDiv';
import ProgressModal from 'components/shared/ProgressModal';
import AppBar from 'containers/AppBar';

import DraftEditor from '../DraftEditor';
import OutlineEditor from './OutlineEditor';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'rgb(244,247,249)',
  },
  a4paper: {
    marginTop: 24,
    margin: 60,
    width: '21cm',
    minHeight: '29.7cm',
    alignSelf: 'center',
    boxSizing: 'border-box',
  },
  paperContent: {
    padding: '25mm',
    position: 'relative',
  },
  rightPanel: {
    position: 'fixed',
    width: '33%',
    height: '100vh',
    overflowY: 'auto',
    right: 0,
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
    },
  }
}))

const ReportEditor = (props) => {
  const { id } = props.match.params;
  
  const classes = useStyles();
  const dispatch = useDispatch();
  const reportRecordIdMap = useSelector(Selectors.selectReportRecordIdMap);
  const currentReport = useSelector(Selectors.selectReportCurrentReport);

  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    if (!reportRecordIdMap) {
      dispatch({ type: types.GET_USER_REPORTS });
    }
  }, [dispatch, reportRecordIdMap]);
  
  React.useEffect(() => {
    if (currentReport.id == id) return;
    dispatch({
      type: types.GET_SINGLE_USER_REPORT,
      [WAIT_FOR_ACTION]: types.GET_SINGLE_USER_REPORT_SUCCESS,
      [ERROR_ACTION]: types.GET_SINGLE_USER_REPORT_ERROR,
      data: { id },
    }).then(({ report }) => {
      const { content, ...others } = report;
      dispatch({ 
        type: types.UPDATE_USER_REPORT_CURRENT_REPORT,
        data: {
          ...others,
          content: EditorState.createWithContent(convertFromRaw(content)),
        }
        })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, currentReport.id]);

  React.useEffect(() => {
    return () => {
      dispatch({ type: types.INIT_CURRENT_USER_REPORT });
    }
  }, [dispatch]);

  const editRef = React.useRef(null);
  return (
    <Grid container className={classes.root}>
      <AppBar />
      <ProgressModal open={currentReport.id != id}/>
      {currentReport.id == id && <Grid item xs={12} md={8} lg={9}>
        <FlexDiv fullWidth fullHeight column>
          <FlexDiv row crossAlign="end">
            <FlexDiv column style={{ paddingLeft: 60, paddingTop: 84 }}>
              <Typography variant="h4" >
                {currentReport.name || 'Title'}
              </Typography>
              <Breadcrumbs aria-label="breadcrumb">
                <Link component="button" variant="subtitle1" onClick={() => dispatch(replace('/reports'))}>
                  Reports
                </Link>
                <Typography color="textPrimary">{currentReport.name}</Typography>
              </Breadcrumbs>
            </FlexDiv>
            <FlexDiv item grow />
            <FlexDiv item style={{ paddingRight: '10rem' }}>
              <InputLabel>
                {isEditing ? 'Editing ... ' : 'Saved' }
              </InputLabel>
            </FlexDiv>
          </FlexDiv>
          <Paper className={classes.a4paper} elevation={0}>
            <FlexDiv fullWidth fullHeight column className={clsx(classes.paperContent)} ref={editRef}>
              <DraftEditor setIsEditing={setIsEditing} />
            </FlexDiv>
          </Paper>
        </FlexDiv>
      </Grid>}
      {currentReport.id == id && <Grid item xs={12} sm={12} md={4} lg={3} className={classes.rightPanel}>
        <OutlineEditor paperRef={editRef} />
      </Grid>}
    </Grid>
  )
}

export default ReportEditor;
