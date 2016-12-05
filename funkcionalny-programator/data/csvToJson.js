const fs = require('fs');

const csvContent = fs.readFileSync('us-500.csv', 'utf8');
const headerIndex = csvContent.indexOf('\n');
const header = csvContent.substring(0, headerIndex);
const body = csvContent.substring(headerIndex + 1);

const headerEntries = header.split(',');

const lines = body.split('\n');
result = lines.map((line) => {
   const entries = line.split(',');
   const obj = {};
   entries.forEach((entry, index) => {
      if (entry !== '') {
         obj[header[index]] = entry;
      }
   });
   return obj;
});

fs.writeFileSync('us-500.json', JSON.stringify(result), 'utf8');