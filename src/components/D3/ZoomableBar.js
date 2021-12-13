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
  xAxis: {
    fontSize: 18,
    '& g text': {
      color: 'red',
    }
  },
  xTest: {
    
  }
}));

const d3Data = [
  {
    name: 'E',
    value: '0.045',
  },
  {
    name: 'T',
    value: '0.047',
  },
  {
    name: 'O',
    value: '0.052',
  },
  {
    name: 'I',
    value: '0.070',
  },
  {
    name: 'D',
    value: '0.075',
  },
  {
    name: 'L',
    value: '0.078',
  },
]

const zoomed = ({x, xAxis, svg, margin, width, classes}) => function () {
  x.range([margin.left, width - margin.right].map(d => d3.event.transform.applyX(d)));
  svg.selectAll(".bars rect").attr("x", d => x(d.name)).attr("width", x.bandwidth());
  svg.selectAll(`.${classes.xAxis}`).call(xAxis);
}

const zoom = ({ x, xAxis, margin, width, height, classes }) => function(svg) {
  const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];  
  svg.call(d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent(extent)
    .extent(extent)
    .on("zoom", zoomed({ x, xAxis, svg, margin, width, classes })));
}

const onMouseOver = ({ xScale, yScale, canvasHeight, classes }) => function (d, i) {
  d3.select(this).attr('class', classes.highlight);
  console.log('over', this);
  d3.select(this)
    .transition()     // adds animation
    .duration(400)
    .attr('width', xScale.bandwidth() + 5)

  d3.select(this).append("text")
    .attr('class', 'val') 
    .attr('x', function() {
        return xScale(d.name);
    })
    .attr('y', function() {
        return yScale(d.value) - 15;
    })
    .text(function() {
        return [ '$' +d.value];  // Value of the text
    });
}

const onMouseOut = ({ xScale, yScale, canvasHeight, classes }) => function (d, i) {
  // use the text label class to remove label on mouseout
  d3.select(this).attr('class', classes.bar);
  d3.select(this)
    .transition()     // adds animation
    .duration(400)
    .attr('width', xScale.bandwidth())

  d3.selectAll('.val')
    .remove()
}


const ZoomableBar = (props) => {
  const { data = d3Data } = props;
  const canvas = useRef(null);
  const classes = useStyles();
  const canvasHeight = 500;
  const canvasWidth = 600;
  const margin = ({ top: 20, right: 0, bottom: 30, left: 40 });

  useEffect(() => {
    // add svg ele.
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, canvasWidth - margin.right])
      .padding(0.1);
    const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([canvasHeight - margin.bottom, margin.top]);

    const xAxis = g => g
      .attr("transform", `translate(0,${canvasHeight - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0));
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .call(g => g.select(".domain").remove())

    const svgCanvas = d3.select(canvas.current)
      .append("svg")
      .attr("viewBox", [0, 0, canvasWidth, canvasHeight])
      .attr("class", classes.canvas)
      .call(zoom({ x: xScale, xAxis, margin, width: canvasWidth, height: canvasHeight, classes }));
    // prepare x,y axis
    
    svgCanvas.append("g")
      .attr("class", "bars")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(data)
      .join("rect")
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.value))
        .attr("height", d => yScale(0) - yScale(d.value))
        .attr("width", xScale.bandwidth());
        // .on("mouseover", onMouseOver({ xScale, yScale, canvasHeight, classes })) //Add listener for the mouseover event
        // .on("mouseout", onMouseOut({ xScale, yScale, canvasHeight, classes }))   //Add listener for the mouseout event
        // .transition()
        //   .ease(d3.easeLinear)
        //   .duration(400)
        //   .delay(function (d, i) {
        //       return i * 50;
        //   })


    svgCanvas.append("g")
      .attr("class", classes.xAxis)
      .call(xAxis);
    svgCanvas.append("g")
      .attr("class", classes.yAxis)
      .call(yAxis);
    // svgCanvas.select(`.${classes.xAxis}`)
    // .selectAll('.tick')
    // .attr('class', classes.xTest)
  }, []);

  return (
    <div ref={canvas}></div>
  )
}

export default ZoomableBar;
