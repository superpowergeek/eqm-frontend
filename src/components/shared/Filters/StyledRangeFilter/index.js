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
    width: '100%'
  },
  label: {
    paddingTop: 26
  },
  typeSelector: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f2f6f4',
    fontSize: '1rem'
  },
  input: {
    fontSize: '1rem'
  },
  container: {
    backgroundColor: '#f2f6f4'
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
        <div className={classes.selector}>
          <FlexDiv>
            <FlexDiv item grow />
            {rangeType !== "__EMPTY__" && <TextButton onClick={onClickClear}>Clear</TextButton>}
          </FlexDiv>
          <RangeTypeSelect
            rangeType={rangeType}
            setRangeType={setRangeType}
            disabled={disabled}
            classes={{ select: classes.typeSelector }}
          />
          <DateRangePicker 
            disabled={disabled}
            onEndChange={onEndChange}
            onBeginChange={onBeginChange}
            beginDate={beginDate}
            endDate={endDate}
            rangeType={rangeType}
            classes={{ input: classes.input, container: classes.container }}
          />
        </div>
      </FlexDiv>
    </FlexDiv>
  )
})

export default DateRange;