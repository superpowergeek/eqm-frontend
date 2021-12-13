import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';

const useStyles = makeStyles(theme => ({
  bar: {
    fill: 'steelblue',
  },
  highlight: {
    fill: 'orange',
  },
  canvas: {
    maxHeight: 500,
    maxWidth: 600,
  },
}));

const d3Data = [
  {
    year: '2011',
    value: '45',
  },
  {
    year: '2012',
    value: '47',
  },
  {
    year: '2013',
    value: '52',
  },
  {
    year: '2014',
    value: '70',
  },
  {
    year: '2015',
    value: '75',
  },
  {
    year: '2016',
    value: '78',
  },
];

const onMouseOver = ({ g, xScale, yScale, canvasHeight, margin, classes }) => function (d, i) {
  d3.select(this).attr('class', classes.highlight);
  d3.select(this)
    .transition()     // adds animation
    .duration(400)
    .attr('width', xScale.bandwidth() + 5)
    .attr("y", function(d) { return yScale(d.value) - 10; })
    .attr("height", function(d) { return canvasHeight - margin - yScale(d.value) + 10; });
  g.append("text")
  .attr('class', 'val') 
  .attr('x', function() {
      return xScale(d.year);
  })
  .attr('y', function() {
      return yScale(d.value) - 15;
  })
  .text(function() {
      return [ '$' +d.value];  // Value of the text
  });
}

const onMouseOut = ({ xScale, yScale, canvasHeight, margin, classes }) => function (d, i) {
  // use the text label class to remove label on mouseout
  d3.select(this).attr('class', classes.bar);
  d3.select(this)
    .transition()     // adds animation
    .duration(400)
    .attr('width', xScale.bandwidth())
    .attr("y", function(d) { return yScale(d.value); })
    .attr("height", function(d) { return canvasHeight - margin - yScale(d.value); });

  d3.selectAll('.val')
    .remove()
}

const Bar = (props) => {
  const { data = d3Data } = props;
  const canvas = useRef(null);
  const classes = useStyles();
  const canvasHeight = 500;
  const canvasWidth = 600;
  const margin = 200;

  useEffect(() => {
    // add svg ele.
    const svgCanvas = d3.select(canvas.current)
      .append("svg")
      .attr("width", canvasWidth)
      .attr("height", canvasHeight);
    // prepare x,y axis
    const xScale = d3.scaleBand().range([0, canvasWidth - margin]).padding(0.4);
    const yScale = d3.scaleLinear().range([canvasHeight - margin, 0]);

    // prepare a group ele.
    const g = svgCanvas.append('g')
    .attr("transform", "translate(" + 60 + "," + 30 + ")");

    // declare domain value
    xScale.domain(data.map(function(d) { return d.year; }));
    yScale.domain([0, d3.max(data, function(d) { return d.value; })]);

    // add a group for x axis label and style (in bottom)
    g.append("g")
      .attr("transform", "translate(0," + (canvasHeight - margin) + ")")
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("y", canvasHeight - margin - 250)
      .attr("x", canvasWidth - margin - 100)
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Year");
    // add a group for y axis label and style (in left)
    g.append("g")
      .call(d3.axisLeft(yScale).tickFormat(function(d){
          return "$" + d;
      })
      .ticks(10))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-5.1em")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Stock Price");
    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", classes.bar)
      .on("mouseover", onMouseOver({ g, xScale, yScale, canvasHeight, margin, classes })) //Add listener for the mouseover event
      .on("mouseout", onMouseOut({ xScale, yScale, canvasHeight, margin, classes }))   //Add listener for the mouseout event
      .attr("x", function(d) { return xScale(d.year); })
      .attr("y", function(d) { return yScale(d.value); })
      .attr("width", xScale.bandwidth())
      .transition()
         .ease(d3.easeLinear)
         .duration(400)
         .delay(function (d, i) {
             return i * 50;
         })
      .attr("height", function(d) { return canvasHeight - margin - yScale(d.value); });
  }, [canvas, classes, data]);

  return (
    <div ref={canvas}></div>
  )
}

export default Bar;
