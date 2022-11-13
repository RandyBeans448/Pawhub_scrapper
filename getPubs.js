const puppeteer = require("puppeteer")

let collectedPubs = new Array()
let collectedAddress = new Array()

let pubs = []

//Get pubs

const collectPubs = async () => {

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const url = 'https://stayinapub.co.uk/search/'

  console.log('Visiting ' + url);
  await page.goto(url, { waitUntil: 'networkidle2' });
  console.log('Visiting ' + url);
  
    try {

      const pub_name = await page.evaluate(() => {
        return Array.from( document.querySelectorAll(".article__title")).map(x => x.textContent)
       })

       const pub_address = await page.evaluate(() => {
        return Array.from( document.querySelectorAll(".article__subtitle")).map(x => x.textContent)
       })

          collectedPubs.push(pub_address)
          collectedAddress.push(pub_name)

    } catch (err) {

        console.error('No variation element could be found.');
        await browser.close();

    }

  await browser.close();

};


const filterPubs = async() => {

  collectedAddress = collectedAddress[0]
  collectedPubs = collectedPubs[0]

  for (let i = 0; i < collectedPubs.length; i ++) {

      let pub = {
        pub_name: collectedPubs[i],
        pub_title: collectedAddress[i]
      }

      pubs.push(pub)

  }

  console.log(pubs.length,"pubs")

}


const createPubs = async() => {

  collectPubs().then(() => filterPubs())


}

createPubs()


module.exports = {
  createPubs, pubs
};



