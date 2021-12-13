import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import moment from 'moment';
import {makeStyles} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import types from '@constants/actions';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import ProductTableDialog from "./ProductTableDialog";
import ConfirmContent from 'components/shared/ConfirmContent';
import ExpandedProductDetail from "./ExpandedProductDetail";


const useStyles = makeStyles((theme) => ({
  content: {
    padding: 24,
  },
}));

const ProductTable = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [productRows, setProductRows] = React.useState([]);
  const [productDialogOpen, setProductDialogOpen] = React.useState(false);
  const [productDetail, setProductDetail] = useState(undefined);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  React.useEffect(() => {
    if (Object.keys(props.products).length === 0 || Object.keys(props.materialsById).length === 0) return;

    setProductRows(props.products.ids.map(id => {
      const product = props.products.idMap[id];
      product.productMaterials = product.productMaterials.map(productMaterial => {
        return {
          ...productMaterial,
          name: props.materialsById[productMaterial.materialId].name,
          disposalCo2: props.materialsById[productMaterial.materialId].disposalCo2,
        }
      });

      return product;
    }));
  }, [props.products, props.materialsById]);

  const onAdd = () => {
    setProductDetail(undefined);
    setProductDialogOpen(true);
  }

  const closeProductDialog = React.useCallback(() => {
    setProductDialogOpen(false);
  }, []);

  const closeConfirmDeleteDialog = React.useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  const onClickRemove = React.useCallback(() => {
    setConfirmDialogOpen(false);
    dispatch({
      type: types.DELETE_COMPANY_PRODUCT,
      data: {
        recordId: selectedId
      }
    })
  }, [dispatch, selectedId]);

  const handleDelete = (rowId) => () => {
    setSelectedId(rowId);
    setConfirmDialogOpen(true);
  };

  const handleEdit = (row) => () => {
    setProductDetail(row);
    setProductDialogOpen(true);
  };

  const tableData = {
    rows: productRows,
    columnSettings: [
      {
        key: 'lastModifiedAt',
        label: 'Update Time',
        sortable: true,
        disablePadding: false,
        align: 'left',
        renderElement: row => moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm')
      },
      {
        key: 'name', label: 'Product Name', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          return row.name;
        }
      },
      {
        key: 'desc', label: 'Description', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          return row.description;
        }
      },
      {
        key: 'monthlyCo2', label: 'Monthly CO2', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          return `${row.monthlyCo2}(KG)`;
        }
      },
      {
        key: 'lifetime', label: 'Life Time', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          return `${row.lifetime}(Months)`;
        }
      },
      {
        key: 'additionalProcessingCo2',
        label: 'Additional Processing CO2',
        sortable: true,
        disablePadding: false,
        align: 'left',
        renderElement: row => {
          return `${row.additionalProcessingCo2}(KG)`;
        }
      },
      {
        key: '__ACTION__',
        label: 'Manipulation', sortable: false, disablePadding: true, align: 'center', renderElement: row => {
          return (
            <React.Fragment>
              <Tooltip title="Delete">
                <IconButton aria-label="delete" onClick={handleDelete(row.id)}>
                  <DeleteIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton aria-label="edit" onClick={handleEdit(row)}>
                  <EditIcon/>
                </IconButton>
              </Tooltip>
            </React.Fragment>
          )
        },
      },
    ]
  };

  return (
      <FlexDiv row fullWidth fullHeight>
        <FlexDiv item fullHeight style={{flex: 3}}>
          <Table
            toolbarConfig={{
              title: 'Product Items',
              onAdd: onAdd,
            }}
            data={tableData}
            expand={{
              position: 'left',
              renderExpand: ExpandedProductDetail,
              isComp: true,
            }}
            selectMode="single"
          />
        </FlexDiv>
        <ProductTableDialog open={productDialogOpen} onClose={closeProductDialog} product={productDetail}
                            materialsById={props.materialsById}></ProductTableDialog>
        <Dialog open={confirmDialogOpen} onClose={closeConfirmDeleteDialog}>
          <ConfirmContent
            title={"Are you sure to delete selected product record ?"}

            onCancel={closeConfirmDeleteDialog}
            onConfirm={onClickRemove}
            confirmLabel={"Remove"}
          />
        </Dialog>
      </FlexDiv>
  )
}

export default ProductTable;