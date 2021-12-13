import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: '1rem',
    color: 'white',
  },
  btnPrimary: {
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    }
  },
  btnSecondary: {
    backgroundColor: '#2a3746',
    '&:hover': {
      backgroundColor: '#1d2631',
    }
  }
}));

const StyledButton = (props) => {
  const { type, className, onClick } = props
  const classes = useStyles();
  return (
    <Button
      variant="contained" 
      className={
        clsx(
          classes.root,
          { 
            [classes.btnPrimary]: type === 'primary',
            [classes.btnSecondary]: type === 'secondary'
          }, 
          className
        )}
      onClick={onClick}
    />
  );
};

export default StyledButton;
