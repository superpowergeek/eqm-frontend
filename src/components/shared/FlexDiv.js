import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
  },
  containerRowMode: theme.div.flexContainerHorizontal,
  containerColumnMode: theme.div.flexContainerVertical,
  mainAxisAlignStart: {
    justifyContent: 'flex-start',
  },
  mainAxisAlignCenter: {
    justifyContent: 'center',
  },
  mainAxisAlignEnd: {
    justifyContent: 'flex-end',
  },
  mainAxisAlignBetween: {
    justifyContent: 'space-between',
  },
  mainAxisAlignAround: {
    justifyContent: 'space-around',
  },
  mainAxisAlignEvenly: {
    justifyContent: 'space-evenly',
  },
  crossAxisAlignStart: {
    alignItems: 'flex-start',
  },
  crossAxisAlignCenter: {
    alignItems: 'center',
  },
  crossAxisAlignEnd: {
    alignItems: 'flex-end',
  },
  crossAxisAlignStretch: {
    alignItems: 'stretch',
  },
  crossAxisAlignBaseline: {
    alignItems: 'baseline',
  },
  noWrap: {
    flexWrap: 'nowrap',
  },
  wrap: {
    flexWrap: 'wrap',
  },
  wrapReverse: {
    flexWrap: 'wrap-reverse',
  },
  itemRoot: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  itemNoGrow: {
    flexGrow: 0,
  },
  itemNoShrink: {
    flexShrink: 0,
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  fullSize: {
    width: '100%',
    height: '100%',
  }
}))


const FlexDiv = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const {
    // container styles
    container,
    item,
    row,
    column,
    mainAlign,
    crossAlign,
    wrap,

    // item styles
    grow,
    shrink,
    basis,

    // others
    className: classNameProp,
    children,
    style,
    width,
    height,
    fullWidth,
    fullHeight,
    fullSize,
    ...others
  } = props;
  return (
    <div
        className={clsx(
          classes.root,
          {
            // container styles
            [classes.containerRowMode]: container && !column,
            [classes.containerColumnMode]: container && column,
            [classes.mainAxisAlignStart]: container && mainAlign === 'start',
            [classes.mainAxisAlignCenter]: container && mainAlign === 'center',
            [classes.mainAxisAlignEnd]: container && mainAlign === 'end',
            [classes.mainAxisAlignBetween]: container && mainAlign === 'between',
            [classes.mainAxisAlignAround]: container && mainAlign === 'around',
            [classes.mainAxisAlignEvenly]: container && mainAlign === 'evenly',
            [classes.crossAxisAlignStart]: container && crossAlign === 'start',
            [classes.crossAxisAlignCenter]: container && crossAlign === 'center',
            [classes.crossAxisAlignEnd]: container && crossAlign === 'end',
            [classes.crossAxisAlignStretch]: container && crossAlign === 'stretch',
            [classes.crossAxisAlignBaseline]: container && crossAlign === 'baseline',
            [classes.noWrap]: container && wrap === 'nowrap',
            [classes.wrap]: container && wrap === 'wrap',
            [classes.wrapReverse]: container && wrap === 'wrap-reverse',

            // item styles
            [classes.itemRoot]: item,
            [classes.itemNoGrow]: item && !grow,
            [classes.itemNoShrink]: item && !shrink,

            // other styles
            [classes.fullWidth]: fullWidth,
            [classes.fullHeight]: fullHeight,
            [classes.fullSize]: fullSize,
          },
          classNameProp,
        )}
        style={{
          boxSizing: 'border-box', // some suggested props?
          minWidth: 0, // some suggested props?
          minHeight: 0, // some suggested props?
          width,
          height,
          ...(item && grow && { flexGrow: (typeof grow === 'number' && grow) || 1 }),
          ...(item && shrink && { flexShrink: (typeof shrink === 'number' && shrink) || 1 }),
          ...(item && basis && { flexBasis: basis }),
          ...style,
        }}
        ref={ref}
        {...others}
      >
        {children}
      </div>
  )
})

FlexDiv.defaultProps = {
  // container styles
  container: true,
  column: false,
  mainAlign: 'start',
  crossAlign: 'stretch',
  wrap: 'nowrap',

  // item styles
  item: false,
  grow: 0,
  shrink: 1,
  basis: 'auto',
};

FlexDiv.propTypes = {
  // basic props
  classes: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fullWidth: PropTypes.bool,
  fullHeight: PropTypes.bool,
  fullSize: PropTypes.bool,

  // container styles
  container: PropTypes.bool,
  column: PropTypes.bool,
  mainAlign: PropTypes.oneOf(['start', 'center', 'end', 'between', 'around', 'evenly']),
  crossAlign: PropTypes.oneOf(['start', 'center', 'end', 'stretch', 'baseline']),
  wrap: PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),

  // item styles
  item: PropTypes.bool,
  grow: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  shrink: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  basis: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default FlexDiv;