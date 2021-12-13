import React, { useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import { makeStyles } from '@material-ui/core/styles';
import Gird from '@material-ui/core/Grid';
import update from "immutability-helper";
import { Motion, spring } from 'react-motion';
import Card from "./DnDCard";
import { boardItemTypes } from "@constants";
import { getLocationFromOrder } from 'utils/locationHelper';
import { useWidth } from 'utils/hooks';

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: 'rgb(245, 248, 250)',
    boxSizing: 'border-box',
    width: '100%',
    height: 1970,
    position: 'relative',
  },
}));

const ITEMS = [
  {
    id: 1,
    order: 0,
    content: <div>"Write a cool JS library"</div>,
  },
  {
    id: 2,
    order: 1,
    content: <div>"Make it generic enough"</div>,
  },
  {
    id: 3,
    order: 2,
    content: <div>"Write README"</div>,
  },
  {
    id: 4,
    order: 3,
    content: <div>"Create some examples"</div>,
  },
  {
    id: 5,
    order: 4,
    content: <div>"Spam in Twitter and IRC to promote it"</div>,
  },
  {
    id: 6,
    order: 5,
    content: <div>"???"</div>,
  },
  {
    id: 7,
    order: 6,
    content: <div>"PROFIT"</div>,
  }
];
const Container = () => {
  const [cards, setCards] = useState(ITEMS);
  const classes = useStyles();
  const width = useWidth();
  const findCard = useCallback(id => {
    const card = cards.filter(c => `${c.id}` === id)[0];
    return {
      card,
      index: cards.indexOf(card)
    };
  }, [cards]);
  const moveCard = useCallback((dragIndex, hoverIndex) => {
    const dragCardOrder = cards[dragIndex].order;
    const hoverCardOrder = cards[hoverIndex].order;
    setCards(
      update(cards, {
        [dragIndex]: { order: { $set: hoverCardOrder } },
        [hoverIndex]: { order: { $set: dragCardOrder } }
      })
    );
  }, [cards, setCards]);
  const [, drop] = useDrop({ accept: boardItemTypes.CHART_CARD });
  return (
    <Gird
      container
      className={classes.root}
      ref={drop}
      spacing={2}
    >
      {cards.map((card, i) => {
        const { x: locationX, y: locationY } = getLocationFromOrder(card.order, width);
        return (
          <Motion
            key={`motion-${i}`}
            style={{ 
              x: spring(locationX, { stiffness: 500, damping: 32 }),
              y: spring(locationY, { stiffness: 500, damping: 32 }) 
            }}
          >
            {({ x, y }) => (
              <Card
                key={card.id}
                id={`${card.id}`}
                itemIndex={i}
                content={card.content}
                moveCard={moveCard}
                findCard={findCard}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              />
            )}
          </Motion>
        );
      })}
    </Gird>
  );
};
export default Container;
