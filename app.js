const { Cluster } = require('puppeteer-cluster');
const puppeteer = require("puppeteer")

let collectedPubs = new Array()
let collectedAddress = new Array()


let pubs = []
let hotels = []
let cottages = []

const filterPubs = () => {


    if (pubs !== []) {

        collectedAddress = collectedAddress[0]
        collectedPubs = collectedPubs[0]

        for (let i = 0; i < collectedPubs.length; i ++) {
  
            let pub = {
              pub_name: collectedPubs[i],
              pub_title: collectedAddress[i]
            }
      
            pubs.push(pub)
      
        }

    }

  }

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 100,
        puppeteerOptions: {
            headless: false,
            defaultViewport: false,
            // userDataDir: "./tmp",
          },
    });

    // We don't define a task and instead queue individual functions

    cluster.on("taskerror", (err, data) => {
        console.log(`Error crawling ${data}: ${err.message}`);
      });

    // Make a screenshot
    cluster.task(async ({ page, data: url }) => {
        await page.goto('https://stayinapub.co.uk/search/');

        // const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    //   const page = await browser.newPage();
    //   const url = 'https://stayinapub.co.uk/search/'

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

                console.log(pubs.length,"pubs")

            } catch (err) {

                console.error('No variation element could be found.');
                await browser.close();

            }

        await browser.close();
                
            }).then(() => filterPubs());

    // Extract a title
    cluster.queue(async ({ page }) => {

        // const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
       
        for (let i = 1; i <= 31; i ++) {


            let index = String(i)
        
        
            let url = 'https://www.petspyjamas.com/s/travel/dog-friendly-hotels?page=' + index + '&sort=-search_ranking&ds=1'
        
             console.log('Visiting ' + url);
             await page.goto(url, { waitUntil: 'networkidle2' });
             console.log('Visiting ' + url);
        
            try {
        
                const collected_hotels = await page.evaluate(() => {
                    return Array.from( document.querySelectorAll(".item-title")).map(x => x.textContent)
                   })
        
          
        
                   console.log(hotels.length, "hotels") 
        
                   hotels.push(collected_hotels)
        
        
            } catch (err) {
        
            console.error('No hotels could be found');
        
            await browser.close();
        
            }
        
        }
        
          await browser.close();

    });


    // And do more stuff...
    cluster.queue(async ({ page }) => {
        
        // const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        // const page = await browser.newPage();
      
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

    });

    await cluster.idle();
    await cluster.close();
})();