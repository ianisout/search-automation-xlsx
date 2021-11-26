const puppeteer = require('puppeteer');
const ReportController = require('../controllers/ReportController')
const fs = require('fs');

function delay() {
  return new Promise(function(resolve) { 
      setTimeout(resolve, 150)
  });
}

exports.runSearch = async () => {
  const browser = await puppeteer.launch({headless: false});
  const jsonFile = require('../fileSystem/jsonFile.json');
  const page = await browser.newPage('')
  await page.goto('http://localhost:3000/users/login');
  const currentPage = await browser.targets()[browser.targets().length-1].page();
  const newJson = []

  await page.type('input[type="email"]', 'test@test.test');
  await page.type('input[type="password"]', 'test@test.test');
  await Promise.all([
      page.waitForNavigation(),
      page.click('button')
  ]);

  const searchPage = currentPage;

  for (let i = 0; i < jsonFile.length; i++) {
    const idInput = await searchPage.waitForXPath('/html/body/form/input');
    await delay();
    await idInput.type(String(jsonFile[i]["ID"]));
    await delay();
    const btnSearch = await searchPage.$x('/html/body/form/button')
    await btnSearch[0].click();

    const resultPage = currentPage;
    const getXpath = await resultPage.waitForXPath('/html/body/table/tbody/tr[2]/td[3]');
    const amountFromPage = await resultPage.evaluate(amount => amount.innerText, getXpath);

    const changeSearch = await searchPage.$x('/html/body/ul/form/input');
    await changeSearch[0].click();
  
    const difference = Number((amountFromPage - jsonFile[i]['First Amount']).toFixed(2));

    newJson.push({
      'User-or-merchant-name': jsonFile[i]['User-or-merchant-name'],
      "First Amount": jsonFile[i]["First Amount"],
      ID: jsonFile[i].ID,
      "Amount from secondary website": Number(amountFromPage),
      Status: difference >= 0 && difference < 1 ? "Success" : "Mismatch",
      Difference: difference,
      Other: jsonFile[i].Other
    })

    if (i >= jsonFile.length) await browser.close();
  }
  
  fs.writeFileSync('./fileSystem/jsonFile.json', JSON.stringify(newJson));

  await ReportController.writeXLSX();
}
