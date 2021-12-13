import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete'; 
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField'; 
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import FlexDiv from 'components/shared/FlexDiv';

const getOnchangeItemByIdMap = (idMap) => {
  const onChangeItems = Object.keys(idMap).map(id => {
    return Object.keys(idMap[id]).reduce((acc, cur) => {
      acc[cur] = idMap[id][cur]
      return acc;
    }, {});
  });
  return onChangeItems; 
}

const useStyles = makeStyles((theme) => ({
  root: {
  },
  paper: {
    maxWidth: '100%',
    width: '100%',
  },
  title: {
    flex: '1 1 100%',
    padding: 16,
  },
  formControl: {
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
  },
}));

const AddableRowInput = (props) => {
  const { title, onChange, options, defaultValues = [],  optionsMap , enableTextField = false } = props;
  const classes = useStyles();
  const [ids, setIds] = React.useState([uuidv4()]);
  const [idMap, setIdMap] = React.useState({});
  
  React.useEffect(() => {
    if (defaultValues.length === 0) return;
    const ids = [];
    const idMap = {};
    defaultValues.forEach(object => {
      const tmpId = uuidv4();
      ids.push(tmpId);
      idMap[tmpId] = object;
    })
    setIds(ids);
    setIdMap(idMap);
  }, []);

  const handleAdd = React.useCallback(() => {
    setIds(prev => [...prev,uuidv4()]);
  }, []);

  const handleChange = (rowId) => (event) => {
    const newIdMap = {
      ...idMap,
      [rowId]: {
        ...idMap[rowId],
        0: event.target.value,
      }
    };
    setIdMap(newIdMap);
    if (onChange) onChange(getOnchangeItemByIdMap(newIdMap));
  }

  const handleDelete = (rowId) => () => {
    const newIds = ids.filter(id => id !== rowId);
    const newIdMap = idMap;
    delete newIdMap[rowId];
    setIds(newIds);
    setIdMap(newIdMap);
    if (onChange) onChange(getOnchangeItemByIdMap(newIdMap));
  }
  
  const handleTextFieldChange = (rowId) => (event) => {
    if (event.persist) event.persist();
    const newIdMap = {
      ...idMap,
      [rowId]: {
        ...idMap[rowId],
        1: event.target.value,
      }
    }
    setIdMap(newIdMap);
    if (onChange) onChange(getOnchangeItemByIdMap(newIdMap));
  }
  return (
      <FlexDiv fullWidth column>
        <FlexDiv fullWidth row>
          <InputLabel className={classes.title}>
            {title}
          </InputLabel>
          <Tooltip title="Add">
            <IconButton aria-label="add" onClick={handleAdd}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </FlexDiv>
        <FlexDiv column fullWidth style={{ paddingTop: 12 }}>
        { ids.map(id => {
          return (
            <FormControl className={classes.formControl} key={id}>
              <FlexDiv row fullWidth>
                <Select
                  labelId={id}
                  id={id}
                  value={(idMap[id] && idMap[id][0]) || ''}
                  onChange={handleChange(id)}
                  label="Age"
                  style={{ display: 'flex', flexGrow: 1 }}
                >
                  {options.map((option) => {
                    return (
                      <MenuItem key={option} value={option}>
                        {optionsMap[option]}
                      </MenuItem>
                    );
                  })}
                </Select>
                {enableTextField &&
                  <TextField
                    type="text"
                    value={(idMap[id] && idMap[id][1]) || ''}
                    onChange={handleTextFieldChange(id)}
                    {...props.textFieldProps}
                  />
                }
                {id !== ids[0] &&
                  <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={handleDelete(id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>}
              </FlexDiv>
            </FormControl>
          )}) 
        }
        </FlexDiv>
      </FlexDiv>
  )
}

export default AddableRowInput;