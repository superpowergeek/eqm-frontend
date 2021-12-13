import React from 'react';
import { useSelector } from 'react-redux';
import * as Selectors from 'selectors';
import FlexDiv from 'components/shared/FlexDiv';
import ImageComp from 'draft-js-image-plugin/lib/Image';
import { renderMap, renderPropsCreator, customTypes } from '@constants/editor';
import { Divider, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  alignLeft: {
    marginLeft: 0,
    marginRight: 12,
  },
  alignRight: {
    marginLeft: 12,
    marginRight: 0,
  }
}))
// compose focus plugin
const AtomicComponent = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const {
    block,
    contentState,
    className,
    // eslint-disable-next-line no-unused-vars
    onClick,
  } = props;
  const analyticReportIdMap = useSelector(Selectors.selectAnalyticReportIdMap);
  const analyticDatas = useSelector(Selectors.selectAnalyticData);
  // get current entityKey 
  const entityKey = block.getEntityAt(0);
  if (!entityKey) return null; // sometimes will unexpected crash for no clear warning message
  // get current entity;
  const entity = contentState.getEntity(entityKey);
  // get current entity data;
  const entityType = entity.getType();
  if (entityType === customTypes.DIVIDER) {
    return (
      <FlexDiv fullWidth column className={className}>
        <Divider />
      </FlexDiv>
    )
  }
  const RenderComp = renderMap[entityType];
  if (!RenderComp) {
    const {
      alignment,
    } = entity.getData();
    const { preventScroll, className, ...others } = props;
    return (
      <ImageComp
        className={clsx(classes.img, {
          [classes.alignLeft]: alignment === 'left',
          [classes.alginRight]: alignment === 'right',
        }, className)} 
        {...others} 
      />
    )
  }
  const {
    chartId,
    parentHeight,
  } = entity.getData();

  const renderProps = renderPropsCreator(entityType)({
    config: analyticReportIdMap[chartId]?.config,
    dataSet: analyticDatas[chartId],
  })
  return (
    <FlexDiv fullWidth column height={parentHeight} className={className}>
      <RenderComp {...renderProps} />
    </FlexDiv>
  )
});

export default AtomicComponent;
