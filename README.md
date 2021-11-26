# Excel file automation with Puppeteer and SheetJs
<img width="600px" src="https://user-images.githubusercontent.com/76042262/143578965-f849477f-dab7-47e0-9ce4-00cf13c99b5b.png"><br>

Autofilling a boring excel sheet with values gathered from a secondary platform.<br>
Column creation | value comparison | export for download
<br><br>
<hr>

## How it works
It accesses a mockup website and autofills and updates an existing excel file.<br>
- Upload and excel file. It reads csv, xlsx, etc. and creates a JSON file with extra fields, pre-set
- Run the script
- The script:
    - Logs into the secondary website
    - Inputs the field **ID** for each line of the uploaded file, compares amounts with the results from secondary website, and writes it down.
    - Creates a secondary file, .xlsx, with updated columns and comparisons, ready for download
<br>
<hr>

## How to use it

⚠ For this project to work as is, you will need to run a secondary project at the same time, where the info from the excel file matches the info on the automated search. It can be found <a href="https://github.com/ianisout/mockup-entrysearch"> <strong>here</strong></a>.<br>
<br><i>Note: This project will only work with the current settings on the above website. Other changes can be made, <a href="#inner-workings">check here</a>.</i><br><br>

### Once you got that project up and running:<br>

Go to a folder of your choosing and clone this repository via terminal with <br>
`git clone https://github.com/ianisout/search-automation-xlsx .`<br>
<sub>The dot will make sure that you're cloning it directly into the chosen folder and not create a subfolder.</sub>

Run:<br>
`npm install`<br><br>
Wait for until all dependencies are updated, then create a <strong>folder</strong> on the <strong>root folder</strong> of the project called:<br>
`fileSystem`<br>
<sub>The folder is not automatically uploaded because the scrip deletes previous files as they're manipulated</sub><br>

Then run:<br>
`npx nodemon`<br>

Your project should be up and running, access it on the url<br>
`http://localhost:3030/`<br>

👉 An excel file for testing can be found on the folder:<br>
`test_file`<br>
<br>
### Running the script
Upload the file `inputSpreadSheet.csv` into the script → run the script → Wait while the script is at work → A browser will open up and run the automated gathering of info → Download your new and updated file:<br><br>
<img width="800px" src="https://user-images.githubusercontent.com/76042262/143592655-10a03b6c-2ed4-423f-ab5f-de738726fc09.gif"><br>

<h4>💫 <strong>Magic result</strong>💫 </h4>
<img width="500px" src="https://user-images.githubusercontent.com/76042262/143580126-4cd7699e-8788-4726-b717-543dcfc7e5b8.png">
<img width="755px" src="https://user-images.githubusercontent.com/76042262/143580132-764b84e5-9923-47a3-944a-31cc895774f1.png"><br>
<hr>

<h2 id="inner-workings">Inner Workings</h2>

The script currently runs while displaying its action on the browser. You can choose to run a headless browser by changing this line, on the `pupScript` file to `true`:<br><br>
<img width="500px" src="https://user-images.githubusercontent.com/76042262/143580914-b2e526df-7abd-4745-a30f-3385725b78ff.png"><br><br>

## Changing the script to interact with other websites:
Here's where the fun beings.<br><br>
On the `pupScript` file, line 15, you can change it to any website you want:<br>
`await page.goto('http://whatever-website.com');`<br>

The interaction with the page must also be altered by changing the elements with which the script looks for, as in the lines:<br>
29: `const idInput = await searchPage.waitForXPath('/html/body/form/input')`<br>
33: `const btnSearch = await searchPage.$x('/html/body/form/button')`<br>
37: `const getXpath = await resultPage.waitForXPath('/html/body/table/tbody/tr[2]/td[3]')`<br>
...and so on.

🌟 TIP 🌟<br>
To get the XPath of an element, simply inspect the page, right-click the element of choice, and go to copy > Copy full XPath.<br>

For greater usability of these features, refer to Puppeteer documentation <a href="https://pptr.dev/">here<a>.<br><br>

👉 PS.: There are no error handlers in this project so far. If the script can't find an element on page or if the inserted value does not return a valid entry, <strong>it will crash.</strong>
Issues must get get fixed as problems arise. It is not a one-fits-all solution.

<br><hr>

Created using <a href="https://expressjs.com/en/api.html">Express<a>, <a href="https://pptr.dev/">Puppeteer<a>, and <a href="https://github.com/SheetJS/sheetjs">SheetJS<a>. Because I was bored as heck to do the grunt work on excel files. Cheers
