import React from 'react';
import MomentUtils from '@date-io/moment';
import useControlled from '@material-ui/core/utils/useControlled';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ArrowRight from '@material-ui/icons/ArrowRightAlt';
import FlexDiv from './FlexDiv';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  picker: {
    height: 40,
    boxSizing: 'border-box',
  }
}));

const DateRangePicker = React.memo((props) => {
  const { rangeType, onBeginChange, onEndChange, beginDate: defaultBegin, endDate: defaultEnd, disabled, classes: classNames = {} } = props;
  const classes = useStyles();
  const [beginDate, setBeginDate] = useControlled({
    controlled: defaultBegin,
    default: null,
    name: 'BeginDate',
    state: 'begin',
  })
  const [endDate, setEndDate] = useControlled({
    controlled: defaultEnd,
    default: null,
    name: 'EndDate',
    state: 'endDate',
  })

  const handleChange = (cb, propChange) => date => {
    cb(date);
    if (propChange) {
      propChange(date);
    }
  }

  React.useEffect(() => {
    if (rangeType === '__EMPTY__') {
      handleChange(setBeginDate, onBeginChange)(null);
      handleChange(setEndDate, onEndChange)(null);
    }
  }, [onBeginChange, onEndChange, rangeType, setBeginDate, setEndDate]);

  if (rangeType !== '__RANGE__') return null;
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <FlexDiv container crossAlign="center" mainAlign="between">
        <DatePicker
          id="inline-start"
          autoOk
          disableToolbar
          disableFuture
          disabled={disabled}
          format="YYYY/MM/DD"
          variant="inline"
          inputVariant="outlined"
          placeholder="Start Date"
          margin="normal"
          value={beginDate}
          onChange={handleChange(setBeginDate, onBeginChange)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <DateRangeIcon />
                </IconButton>
              </InputAdornment>
            ),
            classes: { input: clsx(classes.picker, classNames.input) },
          }}
          className={classNames.container}
        />
        <Icon style={{ marginLeft: 8, marginRight: 8 }}>
          <ArrowRight />
        </Icon>
        <DatePicker
          id="inline-end"
          autoOk
          disableToolbar
          disableFuture
          disabled={disabled}
          format="YYYY/MM/DD"
          variant="inline"
          inputVariant="outlined"
          placeholder="End Date"
          margin="normal"
          minDate={beginDate !== null ? beginDate : undefined}
          value={endDate}
          onChange={handleChange(setEndDate, onEndChange)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <DateRangeIcon />
                </IconButton>
              </InputAdornment>
            ),
            classes: { input: clsx(classes.picker, classNames.input) },
          }}
          className={classNames.container}
        />
      </FlexDiv>
    </MuiPickersUtilsProvider>
  )
});

export default DateRangePicker;