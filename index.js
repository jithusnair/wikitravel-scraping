import fs from 'fs';
import { chromium } from "playwright";
import objectsToCSV from 'objects-to-csv';
import {remove, convertLinkToText} from './wikivoyage/cleanUp.js';
import {getEverythingElse, getNav} from './wikivoyage/getHtml.js';

let links = [
  {url: 'https://wikivoyage.org/wiki/Paris', city: 'Paris'},
  // {url: 'https://wikivoyage.org/wiki/London', city: 'London'},
  // {url: 'https://wikivoyage.org/wiki/Edinburgh', city: 'Edinburgh'},
  // {url: 'https://wikivoyage.org/wiki/Dublin', city: 'Dublin'},
  // {url: 'https://wikivoyage.org/wiki/Prague', city: 'Prague'},
  // {url: 'https://wikivoyage.org/wiki/Rome', city: 'Rome'},
  // {url: 'https://wikivoyage.org/wiki/Milan', city: 'Milan'},
  // {url: 'https://wikivoyage.org/wiki/Venice', city: 'Venice'},
  // {url: 'https://wikivoyage.org/wiki/Florence', city: 'Florence'},
  // {url: 'https://wikivoyage.org/wiki/Vienna', city: 'Vienna'},
];

(async () => {
  const browser = await chromium.launch({headless: true});
  // Create pages, interact with UI elements, assert values
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let csvArr = await caspioCsv(page, links)

  //make a csv file that can be imported into Caspio 
  await writeCSV(csvArr);

  setTimeout(async ()=> {
    await browser.close();
  }, 60000);
})();

async function caspioCsv(page, links) {
  let csvArray = []

  for (let i = 0; i < links.length; i++) {    
    await page.goto(links[i].url);

    // wait for scripts to execute 
    // (css classes/ids seem to change after scripts are loaded, hence the wait)
    // await page.waitForSelector("#toc ul.tocUl>li>a");
    try {
      await page.waitForSelector(".routeBox", {timeout: 10000});
    } catch (error) {
      console.error(error);
    }
    // await page.waitForSelector("#omid_v1_present", {state:"hidden"});

    // remove pictures, replace anchor tags with textcontent etc.
    await cleanUp(page);

    // get the core html as arrays
    let htmlArr = await getHTML(page);

    writeHTMLFile(htmlArr);

    // convert to object to work with 'objects-to-csv' package
    let objectifiedArr = objectifyArrForCSV(htmlArr, links[i].city);

    csvArray.push(objectifiedArr);
  }
  return csvArray;
}

async function cleanUp(page) {
  await page.evaluate(remove);
  await page.evaluate(convertLinkToText);
}

async function getHTML(page) {
  let pageHTMLArray = [];
  // first get the nav
  pageHTMLArray.push(await page.evaluate(getNav));
  // then get the other contents
  pageHTMLArray = pageHTMLArray.concat(await page.evaluate(getEverythingElse));

  // if some pages only have 4 arrays after dividing html into 60,000 character
  // chunks, just add one more empty chunk. Just for uniformity in number of columns
  if(pageHTMLArray.length < 6) {
    for (let i = pageHTMLArray.length; i < 6; i++) {
      pageHTMLArray.push('');
    }
  }

  return pageHTMLArray;
}

function writeHTMLFile(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i].length);
  }
  // console.log(arr[1]);
  fs.writeFile('city.html', arr.join(''), function (err) {
    if(err) {
      console.error(err);
    }
  });
}

function objectifyArrForCSV(arr, city) {
  // for some reason Caspio only imports csv with all the fields in it
  // even if the fields are blank. Using just the required fields 
  // to create csv doesn't seem to work because caspio throws error.
  // (might be a mistake on my dev side, but it works for now)
  return {
    MemberId:"",
    What_to_see_must_do_1:"",
    What_to_see_must_do_2:"",
    What_to_do_local_gems:"",
    Staying_safe_ph_limitations:"None",
    Getting_around_locl_transprt_1:"None",
    Overview_wifi:"",
    Side_trips_day_trips:"",
    Staying_safe_scams:"",
    What_to_eat_street_food:"",
    What_to_eat_specialities_1:"",
    Location_info_closing_hours:"",
    What_to_eat_restaurants_1:"",
    What_to_eat_restaurants_2:"",
    What_to_eat_restaurants_3:"",
    What_to_eat_restaurants_4:"",
    What_to_eat_specialities_2:"",
    Drink_local_beers_wine:"",
    Drink_locl_recomdd_drinks:"",
    What_to_eat_restaurants_5:"",
    What_to_eat_restaurants_6:"",
    Speciality_drinks_coffee_shops:"",
    Nightlife_bars_winery_brewery:"",
    Nightlife_nightlife_clubs_bars:"",
    Nightlife_entrtnmnt_clubs_actvts:"",
    Travel_tips_links_url_blogs:"",
    Getting_around_rideshare:"",
    Getting_around_locl_transprt_2:"",
    Getting_around_locl_transpt_scdl:"",
    Getting_around_locl_transprt_map:"",
    Getting_around_locl_transprt_3:"",
    Getting_around_locl_transprt_4:"",
    overview_local_blogs_news:"",
    city: city,
    Name:"",
    Email:"",
    Phone:"",
    Country:"",
    Company_Name:"",
    URL:"",
    Position_Title:"",
    Travel_Specialty:"",
    Date:"",
    Source: 'internal',
    Nav: arr[0],
    html1: arr[1],
    html2: arr[2],
    html3: arr[3],
    html4: arr[4],
  };
}

async function writeCSV(arrOfObj) {
  const csv = new objectsToCSV(arrOfObj);
  await csv.toDisk('./city.csv');
}