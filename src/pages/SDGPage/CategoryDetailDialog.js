import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import { updateStateComposer } from 'utils/functions';
import { usePrevious } from 'utils/hooks';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  img: {
    width: 52,
    height: 52,
    borderRadius: 4,
  },
  main: {
    padding: 24,
  },
  content: {
    alignSelf: 'center',
    marginTop: 24,
    overflow: 'auto',
    width: '60%',
  },
  container: {
    width: '100%',
  },
  input: {
    display: 'flex',
  },
  paper: {
    maxWidth: '100%',
    width: '60%', 
  }
}));
const CategoryDetailDialog = (props) => {
  const { category, metricMap, updateMetric } = props;
  const classes = useStyles();
  const [inputs, setInputs] = React.useState({});

  const prevCategory = usePrevious(category);
  React.useEffect(() => {
    if (prevCategory === category || !category) return;
    category.categoryMetrics.forEach(categoryMetric => {
      const { metric } = categoryMetric;
      const metricId = metric.id;
      const value = metricMap[metricId]?.value;
      const companyMetricId = metricMap[metricId]?.id;
      const companyId = metricMap[metricId]?.companyId;
      const object = {
        companyMetricId,
        metricId,
        companyId,
        value,
        onChanged: false,
      }
      setInputs(updateStateComposer(metricId, object));
    })
  }, [metricMap, prevCategory, category]);

  const onChange = (metricId) => (event) => {
    if (event.persist) event.persist();
    const object = {
      ...inputs[metricId],
      onChanged: true,
      value: event.target.value
    };
    setInputs(updateStateComposer(metricId, object))
  }

  const save = async () => {
    try {
      await Promise.all(Object.values(inputs).filter(row => row.onChanged).map((object) => {
        return updateMetric(object)
      }))
      console.log('Update Success');
      props.onClose();
    } catch (e) {
      console.log('Update Error', e);
    }
    
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} className={classes.root} classes={{ paperWidthSm: classes.paper }}>
      <FlexDiv column className={classes.main}>
        <FlexDiv crossAlign="center" style={{ paddingBottom: 16 }}>
          <img src={category?.imageUrl} alt={category?.name} className={classes.img} />
          <FlexDiv item grow mainAlign="center">
            <Typography variant="h5" className={classes.formTitle}>{`${category?.name} - ${category?.description}`}</Typography>
          </FlexDiv>
        </FlexDiv>
        <FlexDiv column container className={classes.content} fullWidth>
          {category?.categoryMetrics.sort((a, b) => a.id - b.id).map((categoryMetric, index) => {
            const { metric } = categoryMetric;
            const metricId = metric.id;
            // const name = categoryMetric.name || metric.name;
            const description = categoryMetric.description || metric.description;
            // const answer = categoryMetric.answer || metric.answer;
            const placeholder = categoryMetric.placeholder || metric.placeholder;
            return (
              <FormInput
                key={`c-metric${index}`}
                direction="column"
                compProps={{ container: { fullWidth: true, style: { minHeight: 'none' }},inputContainer: { crossAlign: 'start' }}}
                label={`${index + 1}. ${description}`}
                classes={{ container: classes.container, inputContainer: classes.inputContainer }}
                >
                <FlexDiv item grow />
                <TextField
                  value={inputs[categoryMetric.id]?.value || ''} 
                  type='text'
                  fullWidth
                  placeholder={placeholder}
                  onChange={onChange(metricId)}
                  className={classes.input} 
                />
              </FormInput>
            )
          })}
        </FlexDiv>
        <FlexDiv item row fullWidth mainAlign="center" style={{ marginBottom: 12, marginTop: 48, clear: "both", minHeight: "unset"}}>
          <Button color="primary" variant="outlined" onClick={props.onClose} style={{ marginRight: 24 }}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={save}>Save</Button>
        </FlexDiv>
      </FlexDiv>
    </Dialog>
  )
}

export default CategoryDetailDialog;
