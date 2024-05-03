const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.codechef.com/contests');

  await page.waitForSelector("._flex__container_ioa8k_502");

  const grabContests = await page.evaluate(() => {

    const contests = document.querySelectorAll("._flex__container_ioa8k_502");
    

    const matchingContests = [];
    
    contests.forEach(contest => {
        if (contest.querySelector('._timer__container_ioa8k_561')) {
            
            matchingContests.push(contest.innerHTML);
          }
    });
    

    return matchingContests;
  });

  console.log(grabContests)
  await browser.close();
})();
