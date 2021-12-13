import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {makeStyles} from "@material-ui/core";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Typography from "@material-ui/core/Typography";
import * as Selectors from 'selectors';
import types from '@constants/actions';
import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import AddableRowInput from "components/shared/AddableRowInput";

const useStyles = makeStyles((theme) => ({
  main: {
    width: '70%',
    boxSizing: 'border-box',
    padding: 24,
    alignSelf: 'center',
  },
  root: {},
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
  radioGroup: {
    width: '70%',
    textAlign: 'right'
  },
  radioContainer: {
    justifyContent: 'space-between',
    marginTop: 24
  }
}));

const ProductDialog = (props) => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const materialNameById = Object.keys(props.materialsById).reduce((obj, id) => {
    obj[id] = props.materialsById[id].name;
    return obj
  }, {});

  const [editName, setEditName] = React.useState('');
  const [editDesc, setEditDesc] = React.useState('');
  const [editMonthlyCo2, setEditMonthlyCo2] = React.useState('0');
  const [editLifeTime, setEditLifeTime] = React.useState('0');
  const [editAdditionalProcessingCo2, setEditAdditionalProcessingCo2] = React.useState('0');
  const [editMaterials, setEditMaterials] = React.useState([]);
  const [isEdit, setIsEdit] = React.useState(false);
  const classes = useStyles();

  React.useEffect(() => {
    if (props.open && props.product) {
      setIsEdit(true);
      setEditName(props.product.name);
      setEditDesc(props.product?.description || '');
      setEditMonthlyCo2(props.product.monthlyCo2);
      setEditLifeTime(props.product.lifetime);
      setEditAdditionalProcessingCo2(props.product.additionalProcessingCo2);
    } else {
      setIsEdit(false);
      setEditName('');
      setEditDesc('');
      setEditMonthlyCo2(0);
      setEditLifeTime(0);
      setEditAdditionalProcessingCo2(0);
    }
  }, [props.open, props.product]);

  const submit = () => {
    if (isEdit) {
      const data = {
        id: props.product.id,
        name: editName,
        monthlyCo2: editMonthlyCo2,
        lifetime: editLifeTime,
        description: editDesc,
        companyId,
        additionalProcessingCo2: editAdditionalProcessingCo2,
      };
      dispatch({type: types.UPDATE_COMPANY_PRODUCT, data});
    } else {
      const productMaterials = editMaterials.filter(material => material['0'] && material['1']).map(material => {
        return {
          materialId: material['0'],
          kg: material['1']
        };
      });

      const data = {
        name: editName,
        monthlyCo2: editMonthlyCo2,
        lifetime: editLifeTime,
        description: editDesc,
        companyId,
        additionalProcessingCo2: editAdditionalProcessingCo2,
        productMaterials,
      };
      dispatch({type: types.ADD_COMPANY_PRODUCT, data});
    }

    props.onClose();

  };

  const addableOnChange = (data) => {
    setEditMaterials(data);
  };

  const onChange = (setter) => (e) => {
    if (e.persist) e.persist();
    setter(e.target.value);
  };

  const onAmountChange = (setter) => (e) => {
    const {value} = e.target;
    const amount = Number(value);
    if (Number.isFinite(amount) && !Number.isNaN(amount)) {
      setter(value);
    }
  };

  const setAmount = (setter) => (e) => {
    const {value} = e.target;
    const amount = Number(value);
    if (Number.isFinite(amount) && !Number.isNaN(amount)) {
      setter(amount.toString());
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} className={classes.root} classes={{paperWidthSm: classes.paper}}>
      <FlexDiv column>
        <FlexDiv column className={classes.main}>
          <Typography variant="h5" className={classes.formTitle}>{isEdit ? "Edit Product" : "Add Product"}</Typography>
          <FormInput
            direction="row"
            compProps={{inputContainer: {crossAlign: 'center'}}}
            label="Product Name"
            classes={{container: classes.container, inputContainer: classes.inputContainer}}
          >
            <FlexDiv item grow/>
            <OutlinedInput
              value={editName}
              type='text'
              onChange={onChange(setEditName)}
              className={classes.input}
            />
          </FormInput>
          <FormInput
            direction="row"
            compProps={{inputContainer: {crossAlign: 'center'}}}
            label="Description"
            classes={{container: classes.container, inputContainer: classes.inputContainer}}
          >
            <FlexDiv item grow/>
            <OutlinedInput
              value={editDesc}
              type='text'
              onChange={onChange(setEditDesc)}
              className={classes.input}
            />
          </FormInput>
          <FormInput
            direction="row"
            compProps={{inputContainer: {crossAlign: 'center'}}}
            label="Monthly CO2 (Kg)"
            classes={{container: classes.container, inputContainer: classes.inputContainer}}
          >
            <FlexDiv item grow/>
            <OutlinedInput
              value={editMonthlyCo2}
              type='text'
              onChange={onAmountChange(setEditMonthlyCo2)}
              onBlur={setAmount(setEditMonthlyCo2)}
              className={classes.input}
            />
          </FormInput>
          <FormInput
            direction="row"
            compProps={{inputContainer: {crossAlign: 'center'}}}
            label="Life Time (Months)"
            classes={{container: classes.container, inputContainer: classes.inputContainer}}
          >
            <FlexDiv item grow/>
            <OutlinedInput
              value={editLifeTime}
              type='text'
              onChange={onAmountChange(setEditLifeTime)}
              onBlur={setAmount(setEditLifeTime)}
              className={classes.input}
            />
          </FormInput>
          <FormInput
            direction="row"
            compProps={{inputContainer: {crossAlign: 'center'}}}
            label="Additional Processing CO2 (Kg)"
            classes={{container: classes.container, inputContainer: classes.inputContainer}}
          >
            <FlexDiv item grow/>
            <OutlinedInput
              value={editAdditionalProcessingCo2}
              type='text'
              onChange={onAmountChange(setEditAdditionalProcessingCo2)}
              onBlur={setAmount(setEditAdditionalProcessingCo2)}
              className={classes.input}
            />
          </FormInput>
          {!isEdit &&
          <FormInput
            direction="row"
            compProps={{inputContainer: {crossAlign: 'center'}}}
            label="Materials"
            classes={{container: classes.container, inputContainer: classes.inputContainer}}
          >
            <FlexDiv item grow/>
            <FlexDiv item row mainAlign="end"
                     style={{marginBottom: 32, marginTop: 78, clear: "both", minHeight: "unset"}}>
              <AddableRowInput
                options={Object.keys(materialNameById)}
                enableTextField={true}
                optionsMap={materialNameById}
                onChange={addableOnChange}
                defaultValues={props.product?.productMaterials?.map(productMaterial => {
                  return {0: productMaterial.materialId, 1: productMaterial.kg}
                }) || []}
                textFieldProps={{type: 'number'}}
              />
            </FlexDiv>
          </FormInput>
          }
          <FlexDiv item row fullWidth mainAlign="center"
                   style={{marginBottom: 32, marginTop: 78, clear: "both", minHeight: "unset"}}>
            <Button color="primary" variant="outlined" onClick={props.onClose} style={{marginRight: 24}}>Cancel</Button>
            <Button color="primary" variant="contained" onClick={submit}>Submit</Button>
          </FlexDiv>
        </FlexDiv>
      </FlexDiv>
    </Dialog>
  )
}

export default ProductDialog;
