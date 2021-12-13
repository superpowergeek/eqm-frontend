import React, {useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MenuItem from '@material-ui/core/MenuItem'; 
import Select from '@material-ui/core/Select';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete'; 
import { makeStyles, OutlinedInput, Typography, FormControl, FormLabel, FormControlLabel, RadioGroup, InputLabel, Tooltip, IconButton, TextField } from "@material-ui/core";

import AutoComplete from 'components/shared/AsyncAutoComplete';
import FormInput from 'components/shared/FormInput';
import StyledRadio from 'components/shared/StyledRadio';
import FlexDiv from 'components/shared/FlexDiv';
import types from '@constants/actions';
import * as Selectors from 'selectors';
import { emissionTypesMap } from '@constants';

const useStyles = makeStyles((theme) => ({
  main: {
    width: '70%',
    boxSizing: 'border-box',
    padding: 24,
    alignSelf: 'center',
  },
  root: {
    
  },
  paper: {
    maxWidth: '100%',
    width: '80%', 
  },
  formTitle: {
    marginTop: 24,
    
  },
  input: {
    height: 36,
    marginLeft: 24,
    width: '70%',
  },
  container: {
    width: '100%',
    marginTop: 32
  },
  autocomplete: {
    width: '70%!important',
    maxHeight: 36,
    height: 36, 
  },
  autocompleteInput: {
    '& input': {
      padding: '0!important' 
    } 
  },
  tag: {
    width: '100%!important',
    maxHeight: 36,
    height: 36, 
  },
  tagInput: {
    '& input': {
      padding: '0!important' 
    } 
  },
  radioGroup: {
    width: '70%',
    textAlign: 'right'
  },
  radioContainer: {
    justifyContent: 'space-between',
    marginTop: 24
  },
  btn: {
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    }
  }
}));

const AddAssetDialog = (props) => {

  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const emissionOptions = useSelector(Selectors.selectEmission) || [];
  const { editAsset, assetGroupId } = props;
  const classes = useStyles(); 
  const [name, setName] = useState('');
  const [description, setDesc] = useState('');
  const [country, setCountry] = useState({ id: '', name: '' });
  const [owned, setOwned] = useState('3');
  const [payment, setPayment] = useState('');
  const [emissionType, setEmissionType] = useState('');
  const [amount, setAmount] = useState('');
  const [emission, setEmission] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [tags, setTags] = useState([]);

  React.useEffect(() => {
    if (emissionOptions.length > 0) return;
    dispatch({ type: types.GET_EMISSIONS });
  }, [dispatch, emissionOptions]);

  React.useEffect(() => {
    if (props.open) {
      setName(editAsset?.name || '');
      setDesc(editAsset?.description || '');
      setCountry({id: editAsset?.country?.id || '', name: editAsset?.country?.name || ''});
      setOwned(editAsset?.status?.toString() || '3');
      setTags(editAsset?.tags || []);
      setIsEdit(Object.keys(editAsset).length ? true : false);
      
      setPayment(editAsset?.leasedAsset ? 'no' : '');
      setEmissionType(editAsset?.leasedAsset?.emission?.type || '');
      setEmission(editAsset?.leasedAsset?.emission?.id || '');
      setAmount(editAsset?.leasedAsset?.amount || '');
      let tmpTags = [];
      (editAsset?.tags || []).forEach(tag => {
        tmpTags.push(tag);
      })
      setTags(tmpTags.length ? tmpTags : ['']);
    }
  }, [props.open, editAsset]);

  const cancel = () => { 
    props.onClose();
  };

  const submit = () => {
    let action;
    if (payment === 'no') {
      const data = {
        groupId: assetGroupId,
        industryId: 1,
        fuelTypes: 1,
        employees: 10,
        name,
        country,
        description,
        companyId,
        status: parseInt(owned),
        amount,
        emissionId: emission,
        recordId: editAsset?.id,
        leaseAssetId: editAsset?.leasedAsset?.id
      };
      if (isEdit) {
        action = {
          type: types.UPDATE_LEASE_ASSET,
          data
        }
      } else {
        action = {
          type: types.ADD_LEASE_ASSET,
          data
        }
      } 
    } else {
      const data = {
        groupId: assetGroupId,
        industryId: 1,
        fuelTypes: 1,
        employees: 10,
        name,
        country,
        description,
        status: parseInt(owned),
        recordId: editAsset?.id,
        tags: tags.toString()
      };
      if (isEdit) {
        action = {
          type: types.UPDATE_ASSET,
          data
        }
      } else {
        action = {
          type: types.ADD_ASSET,
          data
        }
      }
    }
    dispatch(action);
    props.onClose();
  };

  const onChange = (setter) => (e) => {
    if (e.persist) e.persist();
    setter(e.target.value);
  };

  const onAmountChange = (setter) => (e) => {
    if (e.persist) e.persist(); 
    const { value } = e.target;
    if (value.match('.')) { 
      setter(parseInt(value)); 
    }
    return null; 
  };

  const handleAdd = React.useCallback(() => {
    let tmpTags = [ ...tags];
    tmpTags.push('');
    setTags(tmpTags);
  }, [setTags, tags]);

  const handleDelete = (rowId) => () => {
    let tmpTags = tags.filter((tag, id) => rowId !== id);
    setTags(tmpTags);
  }
  
  const handleTagsInputChange = (rowId) => (event) => {
    let tmpTags = tags.map((tag, id) => {
      if (id === rowId) {
        return event.target.value
      } else {
        return tag
      }
    })
    setTags(tmpTags);
  }

  const handleTagsChange = (rowId) => (name) => {
    let tmpTags = tags.map((tag, id) => {
      if (id === rowId) {
        return name
      } else {
        return tag
      }
    })
    setTags(tmpTags);
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} className={classes.root} classes={{ paperWidthSm: classes.paper }}>
      <FlexDiv column>
        <FlexDiv column className={classes.main}>
          <Typography variant="h5" className={classes.formTitle}>{isEdit ? "Edit Asset" : "Add Asset"}</Typography>
          <FormInput
            direction="row"
            compProps={{ inputContainer: { crossAlign: 'center' }}}
            label="Assets Name"
            classes={{ container: classes.container, inputContainer: classes.inputContainer }}
            >
            <FlexDiv item grow />
            <OutlinedInput
              value={name} 
              type='text'
              onChange={onChange(setName)}
              className={classes.input} 
            />
          </FormInput>
          <FormInput
            direction="row"
            compProps={{ inputContainer: { crossAlign: 'center' }}}
            label="Description"
            classes={{ container: classes.container, inputContainer: classes.inputContainer }}
            >
            <FlexDiv item grow /> 
            <OutlinedInput
              value={description}
              type='text'
              onChange={onChange(setDesc)}
              className={classes.input}
            />
          </FormInput>
          <FormInput
            direction="row"
            compProps={{ inputContainer: { crossAlign: 'center' }}}
            label="Country"
            classes={{ container: classes.container, inputContainer: classes.inputContainer }}
            >
            <FlexDiv item grow />
            <AutoComplete
              variant='outlined'
              classes={{ container: classes.autocomplete, inputContainer: classes.autocompleteInput }}
              searchUrl={`/country?name=${country.name || ''}`}
              inputValue={country.name}
              onInputChange={(e) => {
                e.persist();
                setCountry(prev => ({...prev, name: e.target.value}));
              }}
              onChange={(e, value) => {
                const {name = '', id = ''} = value || {};
                setCountry({
                  name,
                  id,
                }); 
              }}
              getOptionLabel={(option) => {
                return `${option.name}`;
              }}
              className={classes.input}
            />
          </FormInput>
          <FormControl component="fieldset">
            <FlexDiv className={classes.radioContainer}>
              <FormLabel component="legend" style={{marginTop: 10}}>Asset Owned Condition</FormLabel>
              <RadioGroup
                className={classes.radioGroup}
                aria-label="owned" 
                name="owned"
                value={owned}
                onChange={onChange(setOwned)}>
                <FormControlLabel value="1" disabled={isEdit} control={<StyledRadio />} label="I have leased this asset from another entity." />
                <FormControlLabel value="2" disabled={isEdit} control={<StyledRadio />} label="I have leased this to another entity." />
                <FormControlLabel value="3" disabled={isEdit} control={<StyledRadio />} label="I am the owner." />
              </RadioGroup>
            </FlexDiv>
          </FormControl>
          {(owned === "1" || owned === "2") && 
            <FormControl column component="fieldset">
              <FlexDiv className={classes.radioContainer}>
                <FormLabel row component="legend" style={{marginTop: 10}}>Payments</FormLabel>
                <RadioGroup
                  className={classes.radioGroup}
                  aria-label="payment"
                  name="payment"
                  value={payment}
                  onChange={onChange(setPayment)}>
                  <FormControlLabel value="no" disabled={isEdit} control={<StyledRadio />} label="I don't pay for fuel &amp; utility" />
                  <FormControlLabel value="yes" disabled={isEdit} control={<StyledRadio />} label="I pay for fuel &amp; utility" />
                </RadioGroup>
              </FlexDiv>
            </FormControl>
          }
          {(owned === "3" || payment === "yes") && 
            <FlexDiv fullWidth row style={{minHeight: 'unset!important'}}>
              <InputLabel className={classes.formTitle}>
                Asset Tags
              </InputLabel>
              <FlexDiv item grow />
              <FlexDiv column style={{ width: '70%' }}>
                <FlexDiv row>
                  <FlexDiv item grow />
                  <Tooltip title="Add">
                    <IconButton aria-label="add" onClick={handleAdd} style={{justifyContent:'flex-end'}}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </FlexDiv>
                {tags.map((tag, id) => {
                  return (
                    <FlexDiv style={{paddingTop: 24, minHeight: 'unset!important'}}>
                      <AutoComplete
                        variant='outlined'
                        classes={{ container: classes.tag, inputContainer: classes.tagInput }}
                        searchUrl={`/tag?name=${tag || ''}`}
                        inputValue={tag || ''}
                        onInputChange={ handleTagsInputChange(id) }
                        onChange={(e, value) => {
                          const { name = '' } = value || {};
                          handleTagsChange(id, name);
                        }}
                        getOptionLabel={(option) => {
                          return `${option.name}`;
                        }}
                      />
                      {id !== 0 &&
                        <Tooltip title="Delete">
                          <IconButton aria-label="delete" onClick={handleDelete(id)} size="small">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>}
                    </FlexDiv> 
                    )
                })}
              </FlexDiv>
            </FlexDiv>
          }
          { ((owned === "1" || owned === "2") && (payment === "no")) &&
          <div>
            <FormInput
              direction="row"
              compProps={{ inputContainer: { crossAlign: 'center' }}}
              label="Category of asset"
              classes={{ container: classes.container, inputContainer: classes.inputContainer }}
              >
              <FlexDiv item grow /> 
              <Select 
              value={emissionType} 
              onChange={onChange(setEmissionType)}
              variant='outlined'
              className={classes.input}>
                {Object.entries(emissionTypesMap).map(([typeId, name]) => (<MenuItem key={typeId} value={typeId}>{name}</MenuItem>))}
              </Select>
            </FormInput>
            <FormInput
              direction="row"
              compProps={{ inputContainer: { crossAlign: 'center' }}}
              label="Category of asset"
              classes={{ container: classes.container, inputContainer: classes.inputContainer }}
              >
              <FlexDiv item grow />
              <Select 
              value={emission} 
              onChange={onChange(setEmission)}
              variant='outlined'
              className={classes.input}>
                {(emissionOptions.filter((emissionObject) => emissionObject.type == emissionType) || []).map((obj) => (<MenuItem key={obj.id} value={obj.id}>{obj.name}</MenuItem>))}
              </Select>
            </FormInput>
            <FormInput
              direction="row"
              compProps={{ inputContainer: { crossAlign: 'center' }}}
              label="Size(cubic meter)/Amount"
              classes={{ container: classes.container, inputContainer: classes.inputContainer }}
              >
              <FlexDiv item grow /> 
              <OutlinedInput
                value={amount}
                type='number'
                onChange={onAmountChange(setAmount)}
                className={classes.input}
              />
            </FormInput>
          </div> }
          <FlexDiv item row fullWidth mainAlign="center" style={{ marginBottom: 32, marginTop: 78, clear: "both", minHeight: "unset"}}>
            <Button color="primary" variant="outlined" onClick={cancel} style={{ marginRight: 24 }}>Cancel</Button>
            <Button color="primary" variant="contained" className={classes.btn} onClick={submit}>Submit</Button>
          </FlexDiv>
        </FlexDiv>
      </FlexDiv>
    </Dialog>
  )
}

export default AddAssetDialog;
