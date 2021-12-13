import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const usePrevious = (value) => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export const useWidth = () => {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}

export const useDateRangeState = (begin, end) => {
  const [beginDate, setBeginDate] = useState(begin);
  const [endDate, setEndDate] = useState(end);

  return [beginDate, endDate, setBeginDate, setEndDate];
}

export const useMultiSelectState = (initIsAll = false, initSelected = []) => {
  const [isAll, setIsAll] = useState(initIsAll);
  const [selectedOptions, setSelectedOptions] = useState(initSelected);

  return [isAll, setIsAll, selectedOptions, setSelectedOptions];
}