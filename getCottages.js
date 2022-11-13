const puppeteer = require("puppeteer")
const fs = require("fs/promises")

let cottages = []

const collectCottages = async () => {

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  for (let i = 1; i <= 31; i ++) {

    let index = String(i)

    let url = 'https://www.petspyjamas.com/s/travel/dog-friendly-cottages?page=' + index + '&sort=-search_ranking&ds=1'
 

     console.log('Visiting ' + url);
     await page.goto(url, { waitUntil: 'networkidle2' });
     console.log('Visiting ' + url);

    try {

        const collected_cottages = await page.evaluate(() => {
            return Array.from( document.querySelectorAll(".item-title")).map(x => x.textContent)
           })

           for (let j = 0; j < collected_cottages.length; j++) {
    
            console.log(cottages.length, "cottages") 
    
            cottages.push(collected_cottages[j])
    
            }   


    } catch (err) {

    console.error('No cottages could be found');

    await browser.close();

    }

}

  await browser.close();

};

collectCottages()

module.exports = {
    collectCottages, cottages
};