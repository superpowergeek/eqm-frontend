import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, lighten, Typography } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import clsx from 'clsx';
import { numberWithCommas } from 'utils/functions';
import StyledLinearProgress from './StyledLinearProgress';
import FlexDiv from './FlexDiv';

const useStyles = makeStyles(theme => ({
  root: props => ({
    backgroundColor: props.color ? lighten(props.color, 0.3) : lighten(theme.palette.primary.light, 0.8),
    marginBottom: 4,
    height: 108,
    width: 720,
  }),
  content: {
    padding: 0,
    '&:last-child': {
      padding: 0,
    },
  },
  rightContent: {
    height: 108,
    width: 'calc(100% - 108px)',
    padding: 16,
  },
  progressRoot: {
    height: 20,
    width: '100%',
    backgroundColor: theme.palette.common.white,
    borderRadius: 4,
  },
  imgContainer: {
  },
  img: {
    width: 108,
    height: 108,
  },
  title: props => ({
    lineHeight: 1.3,
    color: props.color ? theme.palette.getContrastText(props.color) : theme.palette.common.black,
  }),
  subtitle2: props => ({
    lineHeight: 1,
    color: props.color ? theme.palette.getContrastText(props.color) : theme.palette.common.black,
  }),
  barColorPrimary: props => ({
    height: 20,
    backgroundColor: props.color ? props.color : theme.palette.primary.main,
    borderRadius: 4,
  }),
}));

const ProgressMetric = React.memo(React.forwardRef((props, ref) => {
  const classes = useStyles(props);
  const { color, onClick, imageUrl, title, subtitle, value, unit, total, className, classes: parentClasses = {} } = props;
  const percent = (value && Number((value / total * 100).toFixed(2))) || 0;
  return (
    <Card className={clsx(classes.root, className)} ref={ref}>
      <CardActionArea onClick={onClick}>
        <CardContent className={classes.content}>
          <FlexDiv row container crossAlign="center" fullHeight fullWidth>
            <FlexDiv item className={classes.imgContainer}>
              <img src={imageUrl} alt="tmp" className={classes.img}/>
            </FlexDiv>
            <FlexDiv item grow column fullHeight className={classes.rightContent} mainAlign="center" >
              <FlexDiv row crossAlign="center" style={{ marginBottom: 8 }}>
                <FlexDiv column style={{ flexBasis: '55%', flexGrow: 1 }}>
                  <Typography variant="h6" className={classes.title}>{title}</Typography>
                  {subtitle && <Typography variant="subtitle2" className={classes.subtitle2}>{subtitle}</Typography>}
                </FlexDiv>
                <FlexDiv item grow />
                <FlexDiv item row style={{ alignSelf: 'flex-end' }}>
                  {!!value && unit && <Typography variant="subtitle2" className={classes.subtitle2}>{numberWithCommas(value)} {unit}</Typography>}
                  <Typography variant="subtitle2" className={classes.subtitle2} style={{ marginLeft: 16 }}>{`${percent} %`}</Typography>
                </FlexDiv>
              </FlexDiv>
              <StyledLinearProgress
                color={color}
                value={percent}
                classes={parentClasses}
              />
            </FlexDiv>
          </FlexDiv>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}));

export default ProgressMetric;
