import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {v4 as uuidv4} from "uuid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import * as Selectors from 'selectors';
import {updateStateComposer} from 'utils/functions';
import types from '@constants/actions';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';


const initialProductMaterial = {
  materialId: 0,
  kg: 0,
  isEdit: true,
}

const ExpandedProductDetail = ({ row }) => {
  const dispatch = useDispatch();

  const materialsById = useSelector(Selectors.selectMaterials) || {};
  const productId = row.id;
  const [editProductMaterials, setEditProductMaterials] = React.useState([]);
  const [editMaterialIds, setEditMaterialIds] = React.useState({});
  const [editDisposalCo2s, setEditDisposalCo2s] = React.useState({});
  const [editKGs, setEditKGs] = React.useState({});

  React.useEffect(() => {
    if (Object.keys(materialsById).length !== 0) return;
    dispatch({ type: types.GET_MATERIAL });
  }, [materialsById]);

  React.useEffect(() => {
    if (!row) return;
    setEditProductMaterials(row.productMaterials);
  }, [row.productMaterials]);

  const onAdd = () => {
    const tmpObject = {
      ...initialProductMaterial,
      id: `tmp-${uuidv4()}`,
    }
    setEditMaterialIds(updateStateComposer(tmpObject.id, tmpObject.materialId));
    setEditKGs(updateStateComposer(tmpObject.id, tmpObject.kg));
    setEditProductMaterials(prev => [...prev, tmpObject]);
  }

  const onChange = (setter, id) => (e) => {
    if (e.persist) e.persist();
    setter(updateStateComposer(id, e.target.value));
  };

  const onSelectChange = (setter, id) => (e) => {
    if (e.persist) e.persist();
    setEditDisposalCo2s(updateStateComposer(id, materialsById[e.target.value].disposalCo2));
    setter(updateStateComposer(id, e.target.value));
  };

  const handleCheck = (rowId) => () => {
    const materialId = editMaterialIds[rowId];
    const kg = editKGs[rowId];

    setEditProductMaterials(rows => rows.filter(row => {
      if (String(rowId).includes('tmp') && row.id === rowId) {
        row.materialId = materialId;
        row.kg = kg;
        row.isEdit = false;
      }
      return true;
    }));

    dispatch({
      type: types.ADD_COMPANY_PRODUCT_MATERIAL,
      data: {
        kg,
        materialId,
        productId
      }
    });

  };

  const handleCancel = (rowId) => () => {
    setEditProductMaterials(rows => rows.filter(row => {
      if (String(rowId).includes('tmp')) {
        return row.id !== rowId;
      }
      row.isEdit = false;
      return true;
    }));
  };

  const handleDelete = (rowId) => () => {
    dispatch({
      type: types.DELETE_COMPANY_PRODUCT_MATERIAL,
      data: {
        recordId: rowId,
        productId: productId
      },
    });
  };

  const expandedTableData = {
    rows: editProductMaterials,
    columnSettings: [
      {
        key: 'name',
        label: 'Material Name',
        sortable: false,
        disablePadding: false,
        align: 'left',
        bodyCellProps: {useEllipsis: true},
        renderElement: item => {
          if(!item.isEdit) return item.name;
          return (
            <FlexDiv container row>
              <Select onChange={onSelectChange(setEditMaterialIds, item.id)}>
                {Object.values(materialsById).map(material => (
                  <MenuItem key={material.id} value={material.id}>{material.name}</MenuItem>))}
              </Select>
            </FlexDiv>
          )
        }
      },
      {
        key: 'disposalCo2',
        label: 'Disposal CO2',
        sortable: false,
        disablePadding: false,
        align: 'left',
        bodyCellProps: {useEllipsis: true},
        renderElement: item => {
          if(!item.isEdit) return item.disposalCo2;
          return editDisposalCo2s[item.id];
        }
      },
      {
        key: 'kg',
        label: 'Kg',
        sortable: false,
        disablePadding: false,
        align: 'left',
        bodyCellProps: {useEllipsis: true},
        renderElement: item => {
          if(!item.isEdit) return item.kg;
          return (
            <TextField
              type="Number"
              value={editKGs[item.id]}
              onChange={onChange(setEditKGs, item.id)}
            />
          )
        }
      },
      {
        key: '__ACTION__',
        label: 'Manipulation', sortable: false, disablePadding: true, align: 'center', renderElement: item => {
          if (!item.isEdit) {
            return (
              <React.Fragment>
                <Tooltip title="Delete">
                  <IconButton aria-label="delete" onClick={handleDelete(item.id)}>
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment>
              <Tooltip title="Cancel">
                <IconButton aria-label="cancel" onClick={handleCancel(item.id)}>
                  <CancelIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Check">
                <IconButton aria-label="check" onClick={handleCheck(item.id)}>
                  <CheckIcon/>
                </IconButton>
              </Tooltip>
            </React.Fragment>
          )
        },
      },
    ],
  }
  return (
    <FlexDiv>
      <Table
        toolbarConfig={{
          title: 'Material Items',
          onAdd: onAdd,
        }}
        data={expandedTableData}
        selectMode="single"
        defaultRowsPerPage={5}
      />
    </FlexDiv>
  )
}

export default ExpandedProductDetail;