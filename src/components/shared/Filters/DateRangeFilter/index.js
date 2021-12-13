import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import clsx from 'clsx';

import FlexDiv from '../../FlexDiv';
import TextButton from '../../TextButton';
import DateRangePicker from '../../DateRagePicker';
import RangeTypeSelect from './RangeTypeSelect';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 24,
  },
  selector: {
    width: '60%'
  },
  label: {
    paddingTop: 26
  }
}))

const DateRange = React.memo((props) => {
  const classes = useStyles();
  const { className, disabled } = props;
  const { onBeginChange, direction = 'column', onEndChange, beginDate, endDate, rangeType, setRangeType } = props;
  

  const onClickClear = () => setRangeType("__EMPTY__");

  return (
    <FlexDiv column={direction === 'column'} container className={clsx(classes.root, className)}>
      <FlexDiv container>
        <InputLabel style={{marginTop: 26}}>Date Range</InputLabel>
        <FlexDiv item grow />
        <div className={classes.selector}>
          <FlexDiv>
            <FlexDiv item grow />
            {rangeType !== "__EMPTY__" && <TextButton onClick={onClickClear}>Clear</TextButton>}
          </FlexDiv>
          <RangeTypeSelect
            rangeType={rangeType}
            setRangeType={setRangeType}
            disabled={disabled}
          />
          <DateRangePicker 
            disabled={disabled}
            onEndChange={onEndChange}
            onBeginChange={onBeginChange}
            beginDate={beginDate}
            endDate={endDate}
            rangeType={rangeType}
          />
        </div>
      </FlexDiv>
    </FlexDiv>
  )
})

export default DateRange;