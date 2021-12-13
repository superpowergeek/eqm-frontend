import React from 'react';
import { Modifier, SelectionState, EditorState, convertToRaw } from 'draft-js';
import ReactToPrint from 'react-to-print';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import { useDispatch, useSelector } from 'react-redux';
import { replace } from 'connected-react-router';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import Unchecked from 'components/Icons/CircleUnchecked';
import Checked from 'components/Icons/CircleChecked';
import types from '@constants/actions';
import * as Selectors from 'selectors';
import { Typography } from '@material-ui/core';
import StyledLinearProgress from 'components/shared/StyledLinearProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: '100%',
    paddingTop: 84,
    boxSizing: 'border-box',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  input: {
    height: 40,
  },
  container: {
    width: '100%',
  },
  body2: {
    paddingRight: 8,
  },
  btn: {
    height: 40,
    fontSize: '1rem',
    textTransform: 'unset',
    color: 'white',
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    },
  },
}));

const marginMap = {
  'header-one': 0,
  'header-two': 12,
  'header-three': 20,
}
const OutlineEditor = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id, name, description, content } = useSelector(Selectors.selectReportCurrentReport)
  const rawContent = convertToRaw(content.getCurrentContent());
  // console.log(rawContent);
  const { total, checked } = rawContent.blocks.reduce((prev, curr) => {
    if (curr.type === 'header-three') {
      if (curr.data.checked) {
        prev.checked = prev.checked + 1;
      }
      prev.total = prev.total + 1;
    }
    return prev;
  }, { total: 0, checked: 0 });
  const outlineHeaders = rawContent.blocks.filter((row) => {
    if (row.type === 'header-one' || row.type === 'header-two' || row.type === 'header-three') return true;
    return false;
  });
  
  const onApply = () => {
    const stringContent = JSON.stringify(rawContent);
    dispatch({ 
      type: types.UPDATE_USER_REPORT,
      [WAIT_FOR_ACTION]: types.UPDATE_USER_REPORT_SUCCESS,
      [ERROR_ACTION]: types.UPDATE_USER_REPORT_ERROR,
      data: {
        id,
        name,
        description,
        content: stringContent,
      }
    }).then(result => {
      dispatch(replace('/reports'));
    }).catch(error => {
      console.warn('error', error);
    })
  }


  
  const onCheckBlock = React.useCallback((anchorKey) => (event) => {
    const editorState = content;
    const selection = new SelectionState({
      anchorKey: anchorKey,
      anchorOffset: 0,
      focusKey: anchorKey,
      focusOffset: 0,
      isBackward: false,
      hasFocus: true,
    })

    const data = {
      checked: event.target.checked,
    };

    const newContentState = Modifier.setBlockData(
      editorState.getCurrentContent(),
      selection,
      data
    );

    dispatch({
      type: types.UPDATE_USER_REPORT_CURRENT_REPORT,
      data: {
        content: EditorState.push(editorState, newContentState, 'change-block-data'),
      },
    })
  }, [content, dispatch]);

  return (
    <Paper className={classes.root}>
      <Typography variant="h6">
        {description}
      </Typography>
      <FlexDiv crossAlign="center" style={{ paddingBottom: 16 }}>
        <Typography variant="body2" className={classes.body2}>
          Progress
        </Typography>
        <StyledLinearProgress 
          height={8}
          value={checked/total * 100}
          color="#F04A23"
        />
      </FlexDiv>
      <FlexDiv item grow>
        <FormInput
          direction="column"
          classes={{ container: classes.container }}
        >
          <FlexDiv container column fullWidth>
            {outlineHeaders.map(object => {
              const marginLeft = marginMap[object.type];
              if (object.type === 'header-three') {
                return (
                  <FlexDiv key={object.key} item row style={{ marginLeft, minHeight: 'unset' }} crossAlign="start">
                    <Checkbox
                      icon={<Unchecked style={{ width: 16, height: 16 }}/>}
                      checkedIcon={<Checked style={{ width: 16, height: 16 }}/>}
                      checked={object.data?.checked || false}
                      color="primary"
                      style={{ width: 16, height: 16, padding: 4, marginRight: 4 }}
                      onChange={onCheckBlock(object.key)} />
                    <Link href={`#${object.key}`} variant="subtitle1">{object.text}</Link>
                  </FlexDiv>
                )
              }
              return (
                <FlexDiv key={object.key} item row style={{ marginLeft, minHeight: 'unset' }} crossAlign="start">
                  <Link href={`#${object.key}`} variant="subtitle1">{object.text}</Link>
                </FlexDiv>
                
              )
            })}
          </FlexDiv>
        </FormInput>
      </FlexDiv>
      <FlexDiv item row fullWidth mainAlign="center" style={{ marginTop: 24, marginBottom: 24 }}>
        <ReactToPrint
          trigger={() => {
            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
            // to the root node of the returned component as it will be overwritten.
            return <Button color="primary" variant="outlined" style={{ marginRight: 24 }}>Export</Button>;
          }}
          content={() => props.paperRef.current}
        />
        <Button className={classes.btn} variant="contained" onClick={onApply}>Save</Button>
      </FlexDiv>
    </Paper>
  )
}

export default OutlineEditor;