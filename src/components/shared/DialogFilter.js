import React, { useState, useCallback } from 'react';
import { Dialog, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Close from '@material-ui/icons/Close';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';
import clsx from 'clsx';

import { useDateRangeState, useMultiSelectState } from 'utils/hooks';
import DateRangeFilter from './Filters/DateRangeFilter';
import MultiSelects from './MultiSelects';
import FlexDiv from './FlexDiv';
import TextButton from './TextButton';


const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 100,
  },
  dateRangeText: {
    marginRight: 16,
  },
  hidden: {
    visibility: 'hidden',
  },
  chip: {
    marginRight: 8,
  },
  flexRoot: {
    width: 420,
    boxSizing: 'border-box',
    // padding: 24,
  },
  titleContainer: {
    paddingRight: 12,
    paddingLeft: 24,
    height: 48,
  },
  title: {
    paddingTop: 16,
  },
  applyBtn: {
    marginTop: 24,
    marginTop: 16,
    marginBottom: 16,
    textTransform: 'none',
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    },
  }
}))

const defaultSuppliers = [
  'Supplier A',
  'Supplier B',
  'Internal',
];

const DialogFilter = (props) => {
  const { 
    onApply, isHidden = false, 
    actionText, values = {}, 
    multiOptions = defaultSuppliers, 
    multiOptionsMap = undefined,
    optionsNameMap = {},
    multiItems = [],
    multiItemsMap = undefined,
    className, 
    withMultiSource = true,
    withMultiItem = true,
  } = props;
  const { beginDate, endDate, selectedMultiOptions = [] } = values;
  const [rangeType, setRangeType] = useState("__EMPTY__");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selfBeginDate, selfEndDate, setBeginDate, setEndDate] = useDateRangeState(beginDate, endDate);
  const [isAll, setIsAll, selectedOptions, setSelectedOptions] = useMultiSelectState(false, selectedMultiOptions);
  const [itemIsAll, setItemIsAll, selectedItems, setSelectedItems] = useMultiSelectState(false, []);
  const handleClick = useCallback((event) => {
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const classes = useStyles();

  const handleDeleteDateRange = useCallback(() => {
    setBeginDate(null);
    setEndDate(null);
    onApply({
      beginDate: null,
      endDate: null,
    })
  }, [setEndDate, setBeginDate, onApply]);

  const renderDateRange = useCallback((beginDate, endDate) => {
    if (beginDate === null || endDate === null) return null;
    const label = `Date Range: ${moment(beginDate).format('YYYY/MM/DD')} ~ ${moment(endDate).format('YYYY/MM/DD')}`;
    return (
      <Chip
        key="dateRange"
        className={classes.chip} 
        label={label}
        onDelete={handleDeleteDateRange}
      />
    )
  }, [classes.chip, handleDeleteDateRange]);

  const handleDeleteOptions = useCallback((value) => () => {
    // NOTE: impossible use selectedOptions in this function call, no instance
    setSelectedOptions(options => {
      if (options.indexOf(value) > -1) {
        options.splice(options.indexOf(value), 1);
        onApply({
          multiOptions: [...options],
        })
        return [...options];
      }
      onApply({
        multiOptions: options,
      })
      return options;
    })
  }, [onApply, setSelectedOptions])

  const handleDeleteItems = useCallback((value) => () => {
    // NOTE: impossible use selectedOptions in this function call, no instance
    setSelectedItems(items => {
      if (items.indexOf(value) > -1) {
        items.splice(items.indexOf(value), 1);
        onApply({
          multiItems: [...items],
        })
        return [...items];
      }
      onApply({
        multiItems: items,
      })
      return items;
    })
  }, [onApply, setSelectedItems])

  const renderSelectedOptions = useCallback((selectedOptions) => {
    if (selectedOptions.length === 0) return null;
    return (
      <React.Fragment>
        {selectedOptions.map((value) => (
          optionsNameMap 
          ?
          <Chip key={value} label={optionsNameMap[value]} className={classes.chip} onDelete={handleDeleteOptions(value)} />
          : 
           <Chip key={value} label={value} className={classes.chip} onDelete={handleDeleteOptions(value)} />
        ))}
      </React.Fragment>
    )
  }, [classes.chip, handleDeleteOptions])

  const renderSelectedItems = useCallback((selectedItems) => {
    if (selectedItems.length === 0) return null;
    return (
      <React.Fragment>
        {selectedItems.map((value) => (
          <Chip key={value} label={value} className={classes.chip} onDelete={handleDeleteItems(value)} />
        ))}
      </React.Fragment>
    )
  }, [classes.chip, handleDeleteItems])
  
  const onHandleApply = () => {
    onApply({
      beginDate: selfBeginDate,
      endDate: selfEndDate,
      multiOptions: isAll ? multiOptions : selectedOptions,
      multiItems: itemIsAll ? multiItems : selectedItems,
    })

    handleClose();
  }

  return (
    <FlexDiv item className={clsx(classes.root, className)} crossAlign="center">
      <FlexDiv>
        <FlexDiv item className={classes.chipsDiv}>
          {renderDateRange(beginDate, endDate)}
          {renderSelectedOptions(selectedOptions)}
          {renderSelectedItems(selectedItems)}
        </FlexDiv>
        <TextButton onClick={handleClick} className={clsx({ [classes.hidden]: isHidden } )}>
          {actionText}
        </TextButton>
      </FlexDiv>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
      >
        <FlexDiv container column className={classes.flexRoot}>
          <FlexDiv item className={classes.titleContainer}>
            <InputLabel className={classes.title}>
              Filter Sections
            </InputLabel>
            <FlexDiv item grow />
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </FlexDiv>
          <Divider />
          <DateRangeFilter
            onBeginChange={setBeginDate}
            onEndChange={setEndDate}
            beginDate={selfBeginDate}
            endDate={selfEndDate}
            rangeType={rangeType}
            setRangeType={setRangeType}
            handleClose={handleClose}
          />
          {multiOptions.length > 1 && withMultiSource && <MultiSelects
            label="Source"
            isAll={isAll}
            setIsAll={setIsAll}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            options={multiOptions}
            optionsMap={multiOptionsMap}
          />}
          {multiItems.length > 1 && withMultiItem && <MultiSelects
            label="Item"
            isAll={isAll}
            setIsAll={setItemIsAll}
            selectedOptions={selectedItems}
            setSelectedOptions={setSelectedItems}
            options={multiItems}
            optionsMap={multiItemsMap}
          />}
          <Divider />
          <Button
            variant="contained"
            className={classes.applyBtn}
            color="primary"
            onClick={onHandleApply}>
            Apply
          </Button>
        </FlexDiv>

      </Dialog>
    </FlexDiv>
  );  
}

export default DialogFilter;
