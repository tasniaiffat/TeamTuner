const puppeteer = require('puppeteer');

(async (url) => { 

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const timeout = 2000; 

  let hasNextPage = true;
  let grabContests = [];
  count  = 0;

  while (hasNextPage) {
    try {
  
      await page.waitForSelector("._scored-problems__body_1pljm_199", { timeout });

      // Scrape the content from the current page
      const contests = await page.evaluate(() => {
        const contests = document.querySelectorAll("._scored-problems__body_1pljm_199");
        return Array.from(contests).map(contest => contest.innerHTML);
      });

      grabContests = grabContests.concat(contests); // Merge the scraped content
      
      // Click on the next button
      const nextButton = await page.$('.MuiButtonBase-root.MuiIconButton-root._scroll__button_1pljm_137._next__scroll-button_1pljm_152', {timeout});
      if (nextButton) {
       
        try{
            // console.log(nextButton);
            await nextButton.evaluate(button => button.click());
            count++;
        }
        catch(error){
            console.error("No press");
        }

      } else {
        // If next button not found, stop pagination
        console.log('No more pages to navigate');
        hasNextPage = false;
      }

      // Add any additional delay if needed
      // await page.waitForTimeout(2000); // Wait for 2 seconds before navigating to the next page
    } catch (error) {
      console.error("Timeout occurred while waiting for selector or next button.");
      hasNextPage = false; // Stop pagination on error
    }
  }

  console.log(grabContests);
  // console.log(count)
  await browser.close();
  return grabContests
 
})(process.argv[2]);
