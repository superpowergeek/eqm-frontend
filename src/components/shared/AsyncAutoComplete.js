import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import RequestApi from 'utils/RequestApi';
import { usePrevious } from 'utils/hooks';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

export default function Asynchronous(props) {
  const { value, onChange, onInputChange, inputValue, getOptionSelected, searchUrl, getOptionLabel, variant, classes: classNames = {} } = props;
  const [open, setOpen] = React.useState(false);
  const prevValue = usePrevious(value);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  const useStyles = makeStyles(theme => ({
    container: {
      width: 120
    },
    inputContainer: {
      height: 40,
      maxHeight: 40
    }
  }))

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }
    (async () => {
      const response = await RequestApi({
        url: searchUrl,
        method: 'get',
      });
      const options = response.data;
      if (active) {
        setOptions(options);
      }
    })()

    return () => {
      active = false;
    };
  }, [loading, searchUrl, value, prevValue]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const classes = useStyles(); 

  return (
    <Autocomplete
      className={clsx(classes.container, classNames.container)}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={getOptionSelected ? getOptionSelected : (option, value) => option.name === value.name}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      value={value}
      onChange={onChange}
      inputValue={inputValue}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            value={inputValue}
            className={clsx(classes.inputContainer, classNames.inputContainer)}
            onChange={onInputChange}
            variant={variant}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
          )
        }
      }
    />
  );
}