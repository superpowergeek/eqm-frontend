/* xlsx.js (C) 2013-present  SheetJS -- http://sheetjs.com */
/* Notes:
   - usage: `ReactDOM.render( <SheetJSApp />, document.getElementById('app') );`
   - xlsx.full.min.js is loaded in the head of the HTML page
   - this script should be referenced with type="text/babel"
   - babel.js in-browser transpiler should be loaded before this script
*/
// source url https://github.com/SheetJS/js-xlsx/blob/master/demos/react/sheetjs.jsx

import XLSX from 'xlsx';

// input: React state (Array)
//        column names to include (Array)
//        column value extractor (Object)
// output: ws compatible React state (Object)
export function toXlsx(rows, colNames, colExtractor = {}) {
  const merges = [];
  const data = [];

  // NOTE currentDataRow starts from 1 because 0 is for header
  for (let i = 0, len = rows.length, currentDataRow = 1; i < len; ++i) {
    const row = rows[i];
    let maxLen = 1;

    // 1. find max len of arrays
    Object.entries(row).forEach(([key, value]) => {
      if (colNames.indexOf(key) < 0) return;
      if (!Array.isArray(value)) return;

      maxLen = Math.max(maxLen, value.length);
    });

    // 2. generate merges
    if (maxLen > 1) {
      colNames.forEach((key, index) => {
        if (Array.isArray(row[key])) return;

        merges.push({
          s: { c: index, r: currentDataRow + (i) },
          e: { c: index, r: currentDataRow + (i + maxLen - 1) },
        });
      });
    }

    // 3. generate real data for export
    // 3.1 first row contains every property
    const firstDataRow = {};
    colNames.forEach((key, index) => {
      const value = Array.isArray(row[key]) ? row[key][0] : row[key];
      firstDataRow[key] = parse(key, colExtractor, value);
    });
    data.push(firstDataRow);
    // 3.2 other rows contain only array values (so start from j=1)
    for (let j = 1; j < maxLen; ++j) {
      const dataRow = {};
      colNames.forEach((key, index) => {
        if (Array.isArray(row[key]) && row[key].length > j) {
          const value = row[key][j];
          dataRow[key] = parse(key, colExtractor, value);
        }
      });
      data.push(dataRow);
    }

    // Final. update currentDataRow to jump to next hunk
    currentDataRow += (maxLen - 1);
  }

  // colNames is like [{ name: 'A', key: 0 }, { name: 'B', key: 1 } ...]
  const cols = colNames.map((col, index) => ({
    name: String.fromCharCode('A'.charCodeAt(0) + index),
    key: index,
  }));

  return {
    cols,
    merges,
    data,
  };
}

// input: ws compatible React state (Object)
// output: nothing
// https://stackoverflow.com/questions/56364421/compress-multiple-blob-excel-files-into-a-zip-file-javascript
export function exportFile({ data, merges }, fileName = 'sheetjs') {
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!merges'] = merges;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export function writeFile({ data , merges }, fileName = 'sheetjs') {
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!merges'] = merges;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
  XLSX.write(wb, `${fileName}.xlsx`);
}

function parse(key, extractor, value) {
  if (extractor[key]) {
    return extractor[key](value);
  } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  } else if (value == null) {
    return '';
  } else {
    return JSON.stringify(value);
  }
}