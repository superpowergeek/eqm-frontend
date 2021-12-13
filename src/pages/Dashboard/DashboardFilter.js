import React, { useCallback, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Search from '@material-ui/icons/Search';
import Close from '@material-ui/icons/Close';

import FlexDiv from 'components/shared/FlexDiv';
import TextButton from 'components/shared/TextButton';
import OptionButton from "components/shared/OptionButton";
import { chartTypes } from "@constants";
// import SupplierFilter from 'components/shared/Filters/SupplierFiler';
// import { useMultiSelectState } from 'utils/hooks';

const useStyles = makeStyles(theme => ({
  filterRoot: {
    width: 360,
    padding: 4,
  },
  filterTitle: {
    paddingLeft: 16,
    paddingTop: 16,
  },
  section: {
    paddingTop: 16,
    paddingLeft: 16,
  },
  container: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  optionBtn: {
    marginLeft: 4,
    marginRight: 4,
  }
}));

const defaultSuppliers = [
  'Supplier A',
  'Supplier B',
  'Internal',
];

const categories = [
  'Carbon',
  'Sludge',
  'Bilge',
]

const tempChartTypes = [
  'Bar Chart',
  'Pie Chart',
  'Line Chart'
]
const DashboardFilter = (props) => {
  const { suppliers = defaultSuppliers, onApply } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleClick = useCallback((event) => {
    // setDialogOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setDialogOpen(false);
  }, []);
  
  const onHandleClear = () => {

    handleClose();
  }
  const onHandleApply = () => {
    if (onApply) {
      onApply({
        suppliers: selectedSuppliers,
        categories: selectedCatrgories,
        charts: selectedCharts,
      })
    }
    handleClose();
  }

  const [selectedCatrgories, setSelectedCategories] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectedCharts, setSelectedCharts] = useState([]);
  const handleClear = (setOptions) => () => setOptions([]);
  const handleOptions = (options, setOptions) => (type) => () => {
    const getIndex = options.indexOf(type);
    if (getIndex > -1) {
      options.splice(getIndex, 1);
    } else {
      options.push(type);
    }
    setOptions([...options]);
  }
  
  const classes = useStyles();
  return (
    <FlexDiv item>
      <IconButton onClick={handleClick} color="secondary">
        <Search />
      </IconButton>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
      >
        <FlexDiv container column className={classes.filterRoot}>
          <FlexDiv item>
            <InputLabel className={classes.filterTitle}>
              Filter Sections
            </InputLabel>
            <FlexDiv item grow />
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </FlexDiv>
          <Divider />
          <FlexDiv item column className={classes.section}>
            <FlexDiv item>
              <InputLabel>Category</InputLabel>
              <FlexDiv item grow />
              {true && <TextButton onClick={handleClear(setSelectedCategories)}>Clear</TextButton>}
            </FlexDiv>
            <FlexDiv item fullWidth className={classes.container}>
              {categories.map(value => (
                <OptionButton key={value} className={classes.optionBtn} checked={selectedCatrgories.indexOf(value) > -1} onClick={handleOptions(selectedCatrgories, setSelectedCategories)(value)}>
                  {value}
                </OptionButton>
              ))}
            </FlexDiv>
          </FlexDiv>
          <FlexDiv item column className={classes.section}>
            <FlexDiv item>
              <InputLabel>Source</InputLabel>
              <FlexDiv item grow />
              {true && <TextButton onClick={handleClear(setSelectedSuppliers)}>Clear</TextButton>}
            </FlexDiv>
            <FlexDiv item fullWidth className={classes.container}>
              {suppliers.map(value => (
                <OptionButton key={value} className={classes.optionBtn} checked={selectedSuppliers.indexOf(value) > -1} onClick={handleOptions(selectedSuppliers, setSelectedSuppliers)(value)}>
                  {value}
                </OptionButton>
              ))}
            </FlexDiv>
          </FlexDiv>
          <FlexDiv item column className={classes.section}>
            <FlexDiv item>
              <InputLabel>Diagram Type</InputLabel>
              <FlexDiv item grow />
              {true && <TextButton onClick={handleClear(setSelectedCharts)}>Clear</TextButton>}
            </FlexDiv>
            <FlexDiv item fullWidth className={classes.container}>
              {tempChartTypes.map(value => (
                <OptionButton key={value} className={classes.optionBtn} checked={selectedCharts.indexOf(value) > -1} onClick={handleOptions(selectedCharts, setSelectedCharts)(value)}>
                  {value}
                </OptionButton>
              ))}
            </FlexDiv>
          </FlexDiv>
          <FlexDiv item fullWidth mainAlign="end" className={classes.section}>
            <Button variant="contained" color="inherit" onClick={onHandleClear}>Clear</Button>
            <Button variant="contained" color="primary" onClick={onHandleApply}>Apply</Button>
          </FlexDiv>
        </FlexDiv>
        
      </Dialog>
    </FlexDiv>
  )
}

export default DashboardFilter;
