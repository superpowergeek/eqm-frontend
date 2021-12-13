import React from 'react';
import Typography from '@material-ui/core/Typography';

import FlexDiv from 'components/shared/FlexDiv';

const EmptyChart = () => (
  <FlexDiv fullHeight container mainAlign="center" crossAlign="center">
    <Typography variant="body1" color="primary">
      There is no data in selected time interval
    </Typography>
  </FlexDiv>
)

export default EmptyChart;
