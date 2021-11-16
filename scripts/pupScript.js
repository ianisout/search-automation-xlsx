const puppeteer = require('puppeteer');
const ReportController = require('../controllers/ReportController')
const fs = require('fs');

exports.runSearch = async () => {
  const browser = await puppeteer.launch({headless: false});
  const jsonFile = require('../fileSystem/jsonFile.json');
  const page = await browser.newPage('')
  await page.goto('http://localhost:3000/users/login');
  const currentPage = await browser.targets()[browser.targets().length-1].page();
  const newJson = []

  await page.type('input[type="email"]', 'user1@asd');
  await page.type('input[type="password"]', 'user1@asd');
  await Promise.all([
      page.waitForNavigation(),
      page.click('button')
  ]);

  const searchPage = currentPage;

  for (let i = 0; i < jsonFile.length; i++) {
    const idInput = await searchPage.waitForXPath('/html/body/form/input');
    await idInput.type(String(jsonFile[i]["MID"]));
    const btnSearch = await searchPage.$x('/html/body/form/button')
    await btnSearch[0].click();

    const resultPage = currentPage;
    const getXpath = await resultPage.waitForXPath('/html/body/table/tbody/tr[2]/td[3]');
    const amountFromPage = await resultPage.evaluate(amount => amount.innerText, getXpath);

    const changeSearch = await searchPage.$x('/html/body/ul/form/input')
    await changeSearch[0].click();
  
    const difference = Number((amountFromPage - jsonFile[i]['Payout Amount']).toFixed(2));

    newJson.push({
      BTest: jsonFile[i].BTest,
      "Payout Amount": jsonFile[i]["Payout Amount"],
      MID: jsonFile[i].MID,
      "Amount from secondary website": Number(amountFromPage),
      Status: difference >= 0 && difference < 1 ? "Success" : "Mismatch",
      Difference: difference,
      Other: jsonFile[i].Other
    })

  }
  
  fs.writeFileSync('./fileSystem/jsonFile.json', JSON.stringify(newJson));

  await ReportController.writeXLSX();

  await browser.close();
}
