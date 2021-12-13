import React, { useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useDrag, useDrop } from "react-dnd";
import Gird from '@material-ui/core/Grid';
import clsx from 'clsx';
import { boardItemTypes } from "@constants";

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'grab',
    boxSizing: 'border-box',
    boxShadow: 'rgba(45, 62, 80, 0.12) 0px 1px 5px 0px',
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: 'rgb(255, 255, 255)',
    position: 'absolute',
    height: "460px",
    width: "897px",
    marginBottom: "10px",
    padding: "10px",
    '&.isDragging': {
      border: '1px dashed gray',
      backgroundColor: 'transparent'
    },
  },
}));

const DnDCard = ({ id, content, moveCard, findCard, style }) => {
  const dndRef = useRef(null)
  const itemIndex = findCard(id).index;
  const classes = useStyles();
  const [{ isDragging }, drag] = useDrag({
    item: { type: boardItemTypes.CHART_CARD, id, itemIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
  });

  const droppableHover = (item, monitor) => {
    if (!dndRef.current) return;
    const dragIndex = item.itemIndex;
    const hoverIndex = itemIndex;

    // Don't replace items with self
    if (dragIndex === hoverIndex) return;
    // Determine rectangle on screen
    const hoverBoundingRect = dndRef.current.getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY =
      (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

    // Time to actually perform the action
    moveCard(dragIndex, hoverIndex);

    // This is only process vertical hover, not horizontal
  }

  const [, drop] = useDrop({
    accept: boardItemTypes.CHART_CARD,
    canDrop: (item) => item.itemIndex !== itemIndex,
    hover: droppableHover,
    collect: monitor => ({
      canDrop: monitor.canDrop()
    })
  });


  drag(drop(dndRef))
  if (isDragging) {
    return (
      <Gird
        item
        xs={12} sm={5} md={5} lg={6}
        ref={dndRef}
        className={clsx(classes.root, { isDragging })}
        style={style}
      />
    );
  }
  return (
    <Gird
      item
      xs={12} sm={5} md={5} lg={6}
      ref={dndRef}
      className={clsx(classes.root)}
      style={style}
      >
      {content}
    </Gird>
  );
};
export default DnDCard;
