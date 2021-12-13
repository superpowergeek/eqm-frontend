import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import * as Selectors from 'selectors';
import types from '@constants/actions';
import FlexDiv from 'components/shared/FlexDiv';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import SubTabs from 'components/shared/SubTabs';
import SoldProductTable from './SoldProductTable';
import ProductTable from './ProductTable';
import TableTabs from "../TableTabs";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'rgb(244,247,249)'
  },
  content: {
    padding: 24,
  },
  paperContent: {
    minHeight: '100%'
  }
}))

const ProductTab = () => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const productsByCompanyId = useSelector(Selectors.selectProducts) || {};
  const materialsById = useSelector(Selectors.selectMaterials) || {};
  const products = productsByCompanyId[companyId] || {};

  const [subTabValue, setSubTabValue] = React.useState(0);

  React.useEffect(() => {
    if (products.ids) return;
    dispatch({type: types.GET_COMPANY_PRODUCT});
  }, [products.ids, dispatch]);

  React.useEffect(() => {
    if (Object.keys(materialsById).length !== 0) return;
    dispatch({type: types.GET_MATERIAL});
  }, [materialsById, dispatch]);


  const handleSubTabChange = (e, value) => setSubTabValue(value);

  const classes = useStyles();
  const labels = ['Sold Product', 'Product'];
  return (
    <FlexDiv container column crossAlign="center" fullWidth className={classes.root} style={{minHeight: '100%'}}>
      <AppBar/>
      <PageHeader title="Manage Data"></PageHeader>
      <FlexDiv fullWidth style={{minHeight: '100%'}} className={classes.content} column>
        <Paper square variant="outlined" elevation={0} className={classes.paperContent}>
          <TableTabs value={8}/>
          <Paper square variant="outlined" elevation={0} style={{margin: 12}}>
            <SubTabs labels={labels} value={subTabValue} handleChange={handleSubTabChange}/>
            {subTabValue === 0 &&
            <SoldProductTable products={products}/>
            }
            {subTabValue === 1 &&
            <ProductTable products={products} materialsById={materialsById}/>
            }
          </Paper>

        </Paper>
      </FlexDiv>
    </FlexDiv>
  )
}

export default ProductTab;