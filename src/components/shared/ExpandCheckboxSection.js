import React from 'react';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import FlexDiv from 'components/shared/FlexDiv';

const useStyles = makeStyles(theme =>({
  root: {

  },
  summary: {
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
  },
  summaryContent: {
    alignItems: 'center',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '40%',
    flexShrink: 0,
  },
  secondHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const ExpandCheckboxSection = (props) => {
  const classes = useStyles();
  const { title='default title', subTitle, square, children, className, classes: parentClasses = {}, 
        options, onChange, disabled = true , checkedItems, indexGetter = null, labelGetter = null, keyGetter = null, ...others } = props;

  const [expand , setExpand] = React.useState(false);
  
  const handlExpandClick = React.useCallback(() => {
    setExpand(prevExpand => !prevExpand);
  }, []);

  const itemIsCheck = React.useCallback((row) => {
    return checkedItems.findIndex(indexGetter(row)) > -1;
  }, [checkedItems, indexGetter]);

  const handleToggleAll = React.useCallback(() => {
    if (checkedItems.length === options.length) {
      onChange([])();
    } else {
      onChange([...options])();
    }
  }, [checkedItems, onChange, options]);
  
  const getUpdateItems = React.useCallback((row) => {
    const prevItems = [...checkedItems];
    const itemIndex  = prevItems.findIndex(indexGetter(row));
    if ( itemIndex > -1) {
      prevItems.splice(itemIndex, 1);
      return prevItems;
    } else {
      return [...prevItems, row];
    }
  }, [checkedItems, indexGetter]);

  const onCheckChange = React.useCallback((value) => {
    return onChange(getUpdateItems(value));
  }, [getUpdateItems, onChange]);
  
  return (
    <ExpansionPanel 
      expanded={expand}
      onChange={handlExpandClick}
      square={square}
      className={clsx(classes.root, className)}
      {...others}
    > 
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary} classes={{ content: classes.summaryContent }}>
        <FormControlLabel 
          onClick={(event) => event.stopPropagation()}
          onFocus={(event) => event.stopPropagation()}
          control={ 
            <Checkbox 
              checked={options.length === checkedItems.length && checkedItems.length !== 0}
              onChange={handleToggleAll}
              color="primary"
              indeterminate={options.length !== checkedItems.length && checkedItems.length !== 0}
            />}
        />
        <Typography className={clsx(classes.heading, parentClasses.heading)}>{title}</Typography>
        {subTitle && <Typography className={clsx(classes.secondHeading, parentClasses.secondHeading)}>{subTitle}</Typography>}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <FlexDiv container column>
          {options.map((row) =>{
            return (
              <FormControlLabel 
                key={keyGetter(row)}
                disabled={disabled}
                control={
                  <Checkbox 
                    color="primary"
                    checked={itemIsCheck(row)}
                    onChange={onCheckChange(row)}
                  />                    
                }
                label={labelGetter(row)}
                labelPlacement="end"
              />
            )  
          })}
        </FlexDiv>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default ExpandCheckboxSection;