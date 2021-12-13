import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import FlexDiv from '../components/shared/FlexDiv';
import AppBar from '../containers/AppBar';

const useStyles = makeStyles(theme => ({
  itemIsDragging: {
    border: '1px dashed grey',
  },
  // containerIsDragging: {
  //   background: 'grey',
  // },
}));

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const Dashboard = (props) => {
  const classes = useStyles();
  const [items, setItems] = useState(getItems(6));
  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log('result', result);
    if (!result.destination) {
      return;
    }
    
    // if destination is empty, just move.
    // if destination has item, swap them.
    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(newItems);
  };
  return (
    <FlexDiv container column>
      <AppBar />
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container>
          <Droppable droppableId={`droppable`}>
            {(provided, snapshot) => (
              <Grid
                item
                xs={12} 
                sm={8} 
                md={6}
                lg={6} 
                className={clsx(classes.form, { [classes.containerIsDragging]: snapshot.isDraggingOver })}
                ref={provided.innerRef}
              >
                {items.map((item, index) => (
                  <Droppable droppableId={`droppable-${index}`}>
                    {(provided, snapshot) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => {
                        return (<div
                          className={clsx(classes.form, { [classes.itemIsDragging]: snapshot.isDragging })}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {index !== 5 && item.content}
                        </div>
                      )}}
                      {provided.placeholder}
                    </Draggable>)}
                  </Droppable>
                ))}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </Grid>
      </DragDropContext>
    </FlexDiv>
  )
}

export default Dashboard;
