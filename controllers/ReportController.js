const fs = require('fs');
const XLSX = require('xlsx');

exports.generateJson = async () => {
  const folder = fs.readdirSync('./fileSystem/');
  const file = `./fileSystem/${folder[0]}`;
  const newJson = [];
  const workBook = XLSX.readFile(file);
  const jsonFile = XLSX.utils.sheet_to_json(
    workBook.Sheets[workBook.SheetNames[0]]
  );

  for (let i = 0; i < jsonFile.length; i++) {
    newJson.push({
      BTest: jsonFile[i].BTest,
      'Payout Amount': jsonFile[i].amount1,
      MID: jsonFile[i].ID,
      'Amount from secondary website': null,
      Status: null,
      Difference: null,
      'Other': jsonFile[i].other,
    });
  }

  const xlsxData = JSON.stringify(newJson);

  fs.writeFile('./fileSystem/jsonFile.json', xlsxData, 'utf8', (err) => {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }
  });

  return xlsxData;
}

exports.updateJson = (inputAmount) => {
  const jsonFile = require('../fileSystem/jsonFile.json');
  
  jsonFile.forEach((entry) => {
    const difference = Number((inputAmount - entry['Payout Amount']).toFixed(2));
    entry['Amount from secondary website'] = inputAmount;
    entry.Difference = difference;
    entry.Status = difference >= 0 && difference < 1 ? "Success" : "Mismatch";
  });

  fs.writeFileSync('./fileSystem/jsonFile.json', JSON.stringify(jsonFile));
};

exports.writeXLSX = async () => {
  const jsonFile = fs.readFileSync('./fileSystem/jsonFile.json', 'utf8',
    (err, data) => {
      if (err) console.log(err);
    }
  );

  const jsonFileParsed = JSON.parse(jsonFile);

  const newWorkBook = XLSX.utils.book_new();
  const dataSheet = XLSX.utils.json_to_sheet(jsonFileParsed);
  XLSX.utils.book_append_sheet(newWorkBook, dataSheet);

  XLSX.writeFile(newWorkBook, `./fileSystem/TodaysReport-Verified.xlsx`);
};

exports.downloadReport = async () => {
  const file = require('./fileSystem/TodaysReport-Verified.xlsx');
  console.log(file)

  return file;
}