import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(42, 55, 70)',
    },
    secondary: {
      main: '#fff',
    },
    background: {
      cardBg: 'rgb(59, 60, 67)',
    }
  },
  table: {
    header: {
      // backgroundColor: 'red',
      // color: 'black',
    },
  },
  div: {
    flexContainerHorizontal: {
      display: 'flex',
      flexDirection: 'row',
    },
    flexContainerVertical: {
      display: 'flex',
      flexDirection: 'column',
    },
    scrollableVertical: {
      overflowX: 'hidden',
      overflowY: 'auto',
    },
    ellipsisText: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    breakAllText: {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all'
    },
  }
});