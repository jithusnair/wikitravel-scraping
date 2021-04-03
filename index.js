import fs, { writeFile } from 'fs';
import { chromium } from "playwright";
import {remove, convertLinkToText} from './cleanUp.js';
import {getEverythingElse, getNav} from './getHtml.js';

(async () => {
  const browser = await chromium.launch({headless: true});
  // Create pages, interact with UI elements, assert values
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://wikitravel.org/en/Paris');
  // wait for scripts to execute 
  // (css classes/ids seem to change after scripts are loaded, hence the wait)
  await page.waitForSelector("#toc ul.tocUl>li>a");
  // remove pictures, replace anchor tags with textcontent etc.
  await cleanUp(page);
  // get the core html as arrays
  let htmlArr = await getHTML(page);
  // write to a file (temporary requirement).
  writeHTMLFile(htmlArr);
  setTimeout(async ()=> {
    await browser.close();
  }, 60000);
})();

async function cleanUp(page) {
  await page.evaluate(remove);
  await page.evaluate(convertLinkToText);
}

async function getHTML(page) {
  let pageHTMLArray = await page.evaluate(getEverythingElse);
  return pageHTMLArray;
}

function writeHTMLFile(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i].length);
  }
  fs.writeFile('city.html', arr.join(''), function (err) {
    if(err) {
      console.error(err);
    }
  });
}