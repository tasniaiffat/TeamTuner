const puppeteer = require('puppeteer');

(async (url) => { 
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const timeout = 2000; // Set your desired timeout in milliseconds
  
  try {
    await page.waitForSelector(".last", { timeout });
  } catch (error) {
    console.error("Timeout occurred while waiting for selector '.last'.");
    await browser.close();
    return;
  }

  const grabContests = await page.evaluate(() => {
    const contests = document.querySelectorAll(".last");
    const matchingContests = [];
    
    contests.forEach(contest => {
        matchingContests.push(contest.innerHTML);
    });
    return matchingContests;
  });

  console.log(grabContests);
  await browser.close();
})(process.argv[2]);
