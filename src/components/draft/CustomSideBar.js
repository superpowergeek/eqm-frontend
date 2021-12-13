import 'draft-js-side-toolbar-plugin/lib/plugin.css';
import React from 'react';
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import {
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  ItalicButton,
  BoldButton,
  OrderedListButton,
  UnderlineButton,
  UnorderedListButton,
} from 'draft-js-buttons';
import BarChartIcon from '@material-ui/icons/BarChart';
import ListIcon from '@material-ui/icons/List';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import withPluginTheme from 'components/hoc/withPluginTheme';
import DividerIcon from '@material-ui/icons/LinearScale';
import { makeStyles } from '@material-ui/core';

export const sideToolbarPlugin = createSideToolbarPlugin();

const { SideToolbar } = sideToolbarPlugin;

const BarButton = withPluginTheme(BarChartIcon);
const ListButton = withPluginTheme(ListIcon);
const DividerButton = withPluginTheme(DividerIcon);
const useStyles = makeStyles((theme) => ({
  file: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0,
  }
}))
const CustomSideBar = (props) => {
  const { onAddChart, onAddTable, onAddImage, onAddDivider } = props;
  
  const classes = useStyles();
  return (
    <SideToolbar>
      {(externalProps) => {
        return (
          <React.Fragment>
            <HeadlineOneButton {...externalProps} />
            <HeadlineTwoButton {...externalProps} />
            <HeadlineThreeButton {...externalProps} />
            <UnorderedListButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <BoldButton {...externalProps} />
            <OrderedListButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <DividerButton {...externalProps} onClick={onAddDivider} />
            <BarButton {...externalProps} onClick={onAddChart}/>
            <ListButton {...externalProps} onClick={onAddTable}/>
            <div className={externalProps.theme.buttonWrapper} style={{ position: 'relative' }}>
              <button className={externalProps.theme.button}>
                <label>
                  <InsertPhotoIcon />
                  <input type="file" accept="image/*" className={classes.file} onChange={onAddImage} />
                </label>
              </button>
            </div>
          </React.Fragment>
        )
    }}
    </SideToolbar>
  )
}
export default CustomSideBar;
