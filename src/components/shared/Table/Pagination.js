import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import Grid from "@material-ui/core/Grid";
import { Typography, IconButton, Select, MenuItem } from "@material-ui/core";

import FlexDiv from "../FlexDiv";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 24,
    fontFamily: "Helvetica Neue",
  },
  btnContainer: {
    cursor: "pointer",
    width: 32,
    height: 32,
    borderRadius: 16,
    boxShadow: "0 1px 4px 1px rgba(45, 62, 80, 0.24)",
    "&:hover": {
      boxShadow: "0 1px 8px 1px rgba(45, 62, 80, 0.48)",
    },
  },
  pagesContainer: {
    marginLeft: 12,
    marginRight: 12,
  },
  pageBtn: {
    fontSize: "1rem",
    padding: 12,
    cursor: "pointer",
    color: "#4db6ac",
  },

  pageBtnDisabled: {
    fontSize: "1rem",
    padding: 12,
    cursor: "pointer",
    color: "gray",
  },
  select: {
    marginTop: 7,
    '&:before': {
      borderBottom: 'none!important'
    },
    '&:after': {
      borderBottom: 'none!important'
    }
  }
}));

const Pagination = (props) => {
  const { count, page, rowsPerPage=10, onPageChange, onRowsChange } = props;

  const [visiblePages, setVisiblePages] = React.useState(null);
  const [activePage, setActivePage] = React.useState(null);
  const [pages, setPages] = React.useState(null);

  React.useEffect(() => {
    changePage(page + 1);
    setActivePage(page + 1);
  }, [page]);

  React.useEffect(() => { 
    setPages(Math.ceil(count / rowsPerPage));
    setVisiblePages(getVisiblePages(null, Math.ceil(count / rowsPerPage)));
  }, [count, rowsPerPage]);

  const filterPages = (visiblePages, totalPages) => {
    return visiblePages.filter((page) => page <= totalPages);
  };

  const getVisiblePages = (page, total) => {
    if (total < 7) {
      return filterPages([1, 2, 3, 4, 5, 6], total);
    } else {
      if (page % 5 >= 0 && page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    }
  };

  const changePage = (page) => {
    const activePage = page + 1;
    if (page === activePage) {
      return;
    }
    const visiblePages = getVisiblePages(page, pages);
    setVisiblePages(filterPages(visiblePages, pages));
    onPageChange(page - 1);
  };

  const classes = useStyles();

  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      justify="center"
      onScroll={(e) => {
        console.log(e);
        e.preventDefault();
      }}
    >
      <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
        <FlexDiv
          mainAlign="center"
          style={{ paddingTop: 10, justifyContent: "flex-start" }}
        >
          <Typography>{`Showing ${page * rowsPerPage + 1} to ${
            activePage === pages ? count : (page + 1) * rowsPerPage
          } of ${count} elements`}</Typography>
        </FlexDiv>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        <FlexDiv row crossAlign="center" mainAlign="center">
          <FlexDiv
            mainAlign="center"
            crossAlign="center"
            className={classes.btnContainer}
            onClick={() => {
              if (activePage === 1) return;
              changePage(activePage - 1);
            }}
          >
            <NavigateBeforeIcon
              style={{ opacity: activePage === 1 ? 0.5 : 1 }}
            />
          </FlexDiv>
          <FlexDiv className={classes.pagesContainer} crossAlign="center">
            {visiblePages?.map((page, index, array) => {
              return (
                <IconButton
                  key={page}
                  className={
                    activePage === page
                      ? classes.pageBtn
                      : classes.pageBtnDisabled
                  }
                  onClick={() => changePage(page)}
                >
                  {array[index - 1] + 2 < page ? `... ${page}` : page}
                </IconButton>
              );
            })}
          </FlexDiv>
          <FlexDiv
            mainAlign="center"
            crossAlign="center"
            className={classes.btnContainer}
            onClick={() => {
              if (activePage === pages) return;
              changePage(activePage + 1);
            }}
          >
            <NavigateNextIcon
              style={{ opacity: activePage === pages ? 0.5 : 1 }}
            />
          </FlexDiv>
        </FlexDiv>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={3} xl={3} style={{ height: 0 }}>
        <FlexDiv row>
          <FlexDiv item grow />
          <Typography style={{paddingTop: 10, marginRight: 12}}>Rows per page: </Typography>
          <Select value={rowsPerPage} onChange={onRowsChange} className={classes.select}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
        </FlexDiv>
      </Grid>
    </Grid>
  );
};

export default Pagination;
