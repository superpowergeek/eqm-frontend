import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import moment from "moment";

import FlexDiv from 'components/shared/FlexDiv';
import Table from 'components/shared/Table';
import { usePrevious } from 'utils/hooks';
import * as Selectors from 'selectors';

const useStyles = makeStyles(theme => ({
  content: {
    width: 'calc(100% - 72px)',
    margin: 24,
    marginLeft: 36,
    marginRight: 36,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
  },
  paper: {
    maxWidth: '100%',
    width: '80%',
  }
}));

const ChartDialog = React.memo((props) => {
  const classes = useStyles();
  const { open, onClose, selectItem } = props;
  const dispatch = useDispatch();
  const prevSelectItem = usePrevious(selectItem);
  const analyticReportIds = useSelector(Selectors.selectAnalyticReportIds);
  const analyticReportIdMap = useSelector(Selectors.selectAnalyticReportIdMap);
  const analyticDatas = useSelector(Selectors.selectAnalyticData);
  const [radioItem, setRadioItem] = React.useState(selectItem);
  React.useEffect(() => {
    if (!selectItem) return;
    if (selectItem !== prevSelectItem) {
      setRadioItem(selectItem);
    }
  }, [prevSelectItem, selectItem])

  const handleClick = React.useCallback((id) => () => {
    setRadioItem(id);
  }, []);

  const tableData = {
    rows: analyticReportIds.filter(id => id !== 'tmp').map(id => analyticReportIdMap[id]),
    columnSettings: [
      { key: 'radio', label: ' ', sortable: false, disablePadding: false, align: 'left', 
        renderElement: row => <Radio
          checked={radioItem === row.id}
          color="primary"
          onClick={handleClick(row.id)}
        />,
      },
      { key: 'name', label: 'TITLE', sortable: true, disablePadding: false, align: 'left', 
        renderElement: row => row.name,
      },
      { key: 'description', label: 'DESCRIPTION', sortable: false, disablePadding: false, align: 'left', bodyCellProps: { useEllipsis: true }, },
      { key: 'lastUpdate', label: 'UPDATE DATE', sortable: true, disablePadding: false, align: 'center', renderElement: row => moment(row.lastUpdate).format('ll HH:mm') },
    ],
  };

  const onApply = () => {
    if (props.onApply) props.onApply(radioItem);
  };

  const onClickRow = (id, row) => {
    setRadioItem(id);
  }
  return (
    <Dialog open={open} classes={{ paperWidthSm: classes.paper }} onClose={onClose}>
      <FlexDiv container column fullHeight fullWidth crossAlign="center" style={{ position: 'relative' }}>
        <Table
          data={tableData}
          toolbarConfig={{
            title: `Import ${props.mode} from Analytics`,
          }}
          selectMode="single"
          events={{
            onClickRow,
          }}
          defaultRowsPerPage={5}
        />
        <FlexDiv item row fullWidth mainAlign="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Button color="primary" variant="outlined" onClick={onClose} style={{ marginRight: 24 }}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={onApply}>Apply</Button>
        </FlexDiv>
      </FlexDiv>
    </Dialog>
  )
});

export default ChartDialog;
