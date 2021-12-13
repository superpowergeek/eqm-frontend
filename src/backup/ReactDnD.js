import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5backend from "react-dnd-html5-backend";
import FlexDiv from '../components/shared/FlexDiv';
import AppBar from '../containers/AppBar';
import BoardContainer from '../containers/DnDBoard/Container';
const Dashboard = (props) => {
  return (
    <FlexDiv container column crossAlign="center">
      <AppBar />
      <DndProvider backend={HTML5backend}>
        <BoardContainer />
      </DndProvider>
    </FlexDiv>
  )
}

export default Dashboard;
