const puppeteer = require('puppeteer');

runSearch = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage('')
  await page.goto('http://localhost:3000/users/login');
  const currentPage = await browser.targets()[browser.targets().length-1].page();

  await page.type('input[type="email"]', 'user1@asd');
  await page.type('input[type="password"]', 'user1@asd');
  await Promise.all([
      page.waitForNavigation(),
      page.click('button')
  ]);

  const searchPage = currentPage;

  const idInput = await searchPage.waitForXPath('/html/body/form/input');
  await idInput.type('123456');
  const btnSearch = await searchPage.$x('/html/body/form/button')
  await btnSearch[0].click();

  const resultPage = currentPage;
  
  const getXpath = await resultPage.waitForXPath('/html/body/table/tbody/tr[2]/td[3]');
  // console.log(getXpath)
  const getAmount = await resultPage.evaluate(amount => amount.innerText, getXpath);
  console.log(getAmount);

  // await browser.close();
}

runSearch();