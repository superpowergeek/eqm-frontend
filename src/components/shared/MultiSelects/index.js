import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import TextButton from '../TextButton';
import FlexDiv from '../FlexDiv';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 24,
    paddingTop: 0,
  },
  formControl: {
    marginTop: 16,
    marginBottom: 16,
  },
  select: {
    height: 40,
  }
}))

const MultiSelects = (props) => {
  const { label, isAll, setIsAll, selectedOptions, setSelectedOptions, options, optionsMap, className} = props;
  const classes = useStyles();
  const [optionOpen, setOptionOpen] = React.useState(false);
  
  const handleChange = (event, child) => {
    if (child.props.value === '__ALL__') {
      setIsAll(true);
      setOptionOpen(false);
      return;
    }
    if (isAll) setIsAll(false);
    // [HotFix] when options include 'ALL'
    const { value } = event.target;
    if (value.indexOf('ALL') > -1) {
      const index = value.indexOf('ALL');
      value.splice(index, 1);
      setSelectedOptions(value);
      return;
    }
    setSelectedOptions(event.target.value);
  };

  const onClickClear = () => {
    setSelectedOptions([]);
    setIsAll(false);
  };

  const onOpen = React.useCallback(() => setOptionOpen(true), []);
  const onClose = React.useCallback(() => setOptionOpen(false), []);
  return (
    <FlexDiv column container className={ clsx(classes.root, className) }>
      <FlexDiv container>
        <InputLabel>{label}</InputLabel>
        <FlexDiv item grow />
        {(selectedOptions.length !== 0 || isAll) && <TextButton onClick={onClickClear}>Clear</TextButton>}
      </FlexDiv>
      <FormControl variant="outlined" className={classes.formControl}>
        <Select
          multiple
          value={isAll ? ['ALL'] : selectedOptions}
          onChange={handleChange}
          open={optionOpen}
          onOpen={onOpen}
          onClose={onClose}
          className={classes.select}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected[0] === 'ALL' && selected[0]}
              {selected[0] !== 'ALL' && selected.map((value) => {
                if (optionsMap) return (<Chip key={value} label={optionsMap[value]} className={classes.chip} />)
                return (
                  <Chip key={value} label={value} className={classes.chip} />
                )
              })}
            </div>
          )}
        >
          <MenuItem key={"__ALL__"} value={"__ALL__"}>
            ALL
          </MenuItem>
          {options && options.map((option) => {
            if (optionsMap) return (
              <MenuItem key={option} value={option}>
                {optionsMap[option]}
              </MenuItem>
            )
            return (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </FlexDiv>
  )
}

export default MultiSelects;
