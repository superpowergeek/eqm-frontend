import React from "react";
// import { makeStyles } from '@material-ui/core/styles';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import { useDispatch, useSelector } from 'react-redux';
import FlexDiv from 'components/shared/FlexDiv';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import ProgressMetric from "components/shared/ProgressMetric";

import types from '@constants/actions';
import * as Selectors from 'selectors';
import CategoryDetailDialog from './CategoryDetailDialog';

// const useStyles = makeStyles(theme => ({
// }));

const SDGPage = () => {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = React.useState(undefined);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);

  const SDGframeworkCategories = useSelector(Selectors.selectSDGFrameworkCategories) || {};
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const metrics = useSelector(Selectors.selectMetric);
  const metricIdMap = metrics[companyId]?.metricIdMap || {};
  const onCloseForm = () => setDetailDialogOpen(false);

  const onClickCategory = (category) => ()=> {
    setSelectedCategory(category);
    setDetailDialogOpen(true);
  }

  const updateMetric = React.useCallback((data) => {
    return dispatch({
      type: types.UPDATE_COMPANY_METRIC,
      [WAIT_FOR_ACTION]: types.UPDATE_COMPANY_METRIC_SUCCESS,
      [ERROR_ACTION]: types.UPDATE_COMPANY_METRIC_ERROR,
      data,
    })
  },[dispatch]);

  return (
    <FlexDiv container column fullHeight fullWidth crossAlign="center" style={{ position: 'relative' }}>
      <AppBar />
      <PageHeader title="SDG">
      </PageHeader>
      <FlexDiv column>
        {SDGframeworkCategories.ids?.map(categoryId => {
          const category = SDGframeworkCategories.idMap[categoryId];
          const total = category.categoryMetrics.length;
          const filled = category.categoryMetrics.reduce((prev, curr) => {
            if (metricIdMap[curr.id]) return prev + 1;
            return prev;
          }, 0)
          return (
            <ProgressMetric
              key={category.name}
              title={category.name}
              subtitle={category.description}
              imageUrl={category.imageUrl}
              total={total}
              value={filled}
              onClick={onClickCategory(category)}
            />
          )
        })}
        <CategoryDetailDialog
          open={detailDialogOpen}
          onClose={onCloseForm} 
          category={selectedCategory}
          metricMap={metricIdMap}
          updateMetric={updateMetric}
        />
      </FlexDiv>
    </FlexDiv>
  )
}

export default SDGPage;
