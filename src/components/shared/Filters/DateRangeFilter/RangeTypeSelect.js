import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: 16,
    marginBottom: 16,
    width: '100%'
  },
  select: {
    height: 40,
  }
}))

const SelectRange = React.memo((props) => {
  const classes = useStyles();
  const { rangeType, setRangeType, disabled } = props;
  const handleChange = useCallback((event) => setRangeType(event.target.value), [setRangeType]);
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <Select
        id="select-outlined"
        value={rangeType}
        onChange={handleChange}
        className={classes.select}
        disabled={disabled}
      >
        <MenuItem value="__EMPTY__">
          No Filter
        </MenuItem>
        <MenuItem value={"__RANGE__"}>Custom Range</MenuItem>
        <MenuItem value={"all"}>All data</MenuItem> {/* TODO: Should it need filter ? */}
      </Select>
    </FormControl>
  )
})

export default SelectRange;
