import { 
  genKey,
} from 'draft-js';
import { numberWithCommas } from './functions';
/*
  {
    "key": genKey(),
    "text": mappinResult,
    "type": "header-three",
    "depth": 0,
    "inlineStyleRanges": [],
    "entityRanges": [],
    "data": {}
  }
*/

const blockCreator = (arg) => {
  return {
    key: genKey(),
    type: 'header-two',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: {},
    ...arg
  }
}

const frameworkHeaderMap = {
  1: 'Sustainable Goals Development',
  2: 'Green House Gas Emission Scope 1 and 2',
  3: 'Green House Gas Emission Scope 1,2 and 3',
}

const tagParser = (answer, value) => {
  const replaceValue = (value && numberWithCommas(value.toFixed(2))) || ' ';
  const middleAns = answer.replace('%s', replaceValue);
  const startOffset = 3;
  const endOffset = 4;
  const startIndex = middleAns.indexOf('<h>');
  const endIndex = middleAns.indexOf('</h>') + endOffset;
  const targetString = middleAns.substr(startIndex, endIndex - startIndex);
  const clearString = targetString.substr(startOffset, targetString.length - startOffset - endOffset);

  const output = middleAns.replace(targetString, clearString);
  return {
    output,
    offset: output.indexOf(clearString),
    length: clearString.length,
  }
}

export const draftObjectConvertor = (frameworkId, { ids = [], idMap = {} }, metricMap) => {
  
  const draftContent = {
    blocks: [],
    entityMap: {},
  }
  const header = frameworkHeaderMap[frameworkId];
  draftContent.blocks.push(blockCreator({
    text: header,
    type: 'header-one',
  }));
  ids.forEach((id, i) => {
    const category = idMap[id];
    i !== 0 && draftContent.blocks.push(blockCreator({
      text: " ",
    }));
    draftContent.blocks.push(blockCreator({
      text: " ",
      type: 'atomic',
      entityRanges: [{offset: 0, length: 1, key: i}],
    }))
    if (category.imageUrl) {
      draftContent.entityMap[i] = {
        type: "IMAGE",
        mutability: "IMMUTABLE",
        data: {
          src: category.imageUrl,
          alignment: "left",
          width: 18,
        }
      }
    }
    draftContent.blocks.push(blockCreator({
      text: `${category.name}`,
    }));
    draftContent.blocks.push(blockCreator({
      text: `${category.description}`,
      type: 'unstyled',
    }));
    draftContent.blocks.push(blockCreator({
      text: ' ',
      type: 'unstyled',
    }));
    category.categoryMetrics.forEach(categoryMetric => {
      const { metric } = categoryMetric;
      const name = categoryMetric.name || metric.name;
      // const description = categoryMetric.description || metric.description;
      const answer = categoryMetric.answer || metric.answer;
      const value = metricMap[metric.id]?.value;
      draftContent.blocks.push(blockCreator({
        text: name,
        type: 'header-three'
      }));

      const { output, offset, length } = tagParser(answer, value);
      draftContent.blocks.push(blockCreator({
        key: `metric-${categoryMetric.id}`,
        text: output,
        type: 'unstyled',
        inlineStyleRanges: [{
          offset,
          length,
          style: "HIGHLIGHT",
        }]
      }));
    })
  })
  console.log(draftContent);
  return draftContent;
}