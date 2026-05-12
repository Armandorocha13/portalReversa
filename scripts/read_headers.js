const xlsx = require('xlsx');
const workbook = xlsx.readFile('FFA - REVERSA_ETER_XXX_BAIXO_GIRO.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, {header: 1});
console.log(JSON.stringify(data[0]));
