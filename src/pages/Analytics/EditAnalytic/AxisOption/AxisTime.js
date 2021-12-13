import React from 'react';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import { Divider } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import types from '@constants/actions';
import FlexDiv from 'components/shared/FlexDiv';
import * as Selectors from 'selectors';

const useStyles = makeStyles((theme) => ({
  leftList: {
    padding: 24,
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  rightList: {
    overflowY: 'auto',
  },
  picker: {
    height: 16,
  },
}));

const AxisTime = React.memo((props) => {
  const { subItems } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { xAxisItems, time } = useSelector(Selectors.selectAnalyticCurrentConfig);
  const [beginDate, setBeginDate] = React.useState(time.begin);
  const [endDate, setEndDate] = React.useState(time.end);
  
  const handleReflectItem = (event) => {
    const { value } = event.target;
    dispatch({
      type: types.UPDATE_CURRENT_CONFIG,
      data: {
        xAxisItems: [{ value }],
      }
    })
  }

  const beginCallBack = (date) => {
    dispatch({
      type: types.UPDATE_CURRENT_TIME,
      data: {
        time: {
          begin: date,
        },
      }
    })
  }

  const endCallBack = (date) => {
    dispatch({
      type: types.UPDATE_CURRENT_TIME,
      data: {
        time: {
          end: date,
        },
      }
    })
  }

  const handleChange = (setter, cb) => date => {
    setter(date);
    if (cb) {
      cb(date);
    }
  }
  return (
    <React.Fragment>
      <FlexDiv item className={classes.leftList} column width={'50%'}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <InputLabel >From</InputLabel>
          <DatePicker
            id="inline-start"
            autoOk
            disableToolbar
            disableFuture
            format="YYYY/MM/DD"
            variant="inline"
            inputVariant="outlined"
            placeholder="Start Date"
            margin="normal"
            value={beginDate}
            onChange={handleChange(setBeginDate, beginCallBack)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <DateRangeIcon />
                  </IconButton>
                </InputAdornment>
              ),
              classes: {
                input: classes.picker
              },
            }}
          />
          <InputLabel style={{ paddingTop: 12, paddingBottom: 12 }}>To</InputLabel>
          <DatePicker
            id="inline-end"
            autoOk
            disableToolbar
            disableFuture
            format="YYYY/MM/DD"
            variant="inline"
            inputVariant="outlined"
            placeholder="End Date"
            margin="normal"
            minDate={beginDate !== null ? beginDate : undefined}
            value={endDate}
            onChange={handleChange(setEndDate, endCallBack)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <DateRangeIcon />
                  </IconButton>
                </InputAdornment>
              ),
              classes: {
                input: classes.picker
              },
            }}
          />
         </MuiPickersUtilsProvider>
      </FlexDiv>
      <Divider orientation="vertical" flexItem />
      <FlexDiv item className={classes.rightList} column width={'50%'}>
        <InputLabel style={{ padding: 12 }}>Category</InputLabel>
        <Divider />
        <FlexDiv style={{ padding: 12 }}>
          <RadioGroup name="reflectItem" value={(xAxisItems[0] && xAxisItems[0].value) || ''} onChange={handleReflectItem}>
            {subItems.map((option) => {
              return (
                <FormControlLabel
                  key={option}
                  control={
                    <Radio 
                      color="primary"
                    />
                  }
                  value={option}
                  label={option}
                  labelPlacement="end"
                />
              )
            })}
          </RadioGroup>
        </FlexDiv>
      </FlexDiv>
    </React.Fragment>
  )
})

export default AxisTime;