const puppeteer = require("puppeteer")

let hotels = []

const print = async () => {

  console.log(...hotels)
}

const collectHotels = async () => {

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();


  for (let i = 1; i <= 31; i ++) {


    let index = String(i)


    let url = 'https://www.petspyjamas.com/s/travel/dog-friendly-hotels?page=' + index + '&sort=-search_ranking&ds=1'

     console.log('Visiting ' + url);
     await page.goto(url, { waitUntil: 'networkidle2' });
     console.log('Visiting ' + url);

    try {

        const collectedHotels = await page.evaluate(() => {
            return Array.from( document.querySelectorAll(".item-title")).map(x => x.textContent)
           })

       

           for (let j = 0; j < collectedHotels.length; j++) {

            console.log(hotels.length, "hotels") 
    
            hotels.push(collectedHotels[j])
    
            }   


    } catch (err) {

    console.error('No hotels could be found');

    await browser.close();

    }

}

console.log(hotels.length)

  await browser.close();

};

collectHotels().then(() => print())

module.exports = {
    collectHotels, hotels
};