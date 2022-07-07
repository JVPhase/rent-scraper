const scraperObject = {
  async scraper(input) {
    const {
      browser,
      srcUrl,
      wrapperSelector,
      itemSelector,
      itemLinkSelector,
      objectProperties,
      nextButtonSelector = false,
    } = input;
    let page = await browser.newPage();
    console.log(`Navigating to ${srcUrl}...`);
    await page.goto(srcUrl);
    let scrapedData = [];
    // Wait for the required DOM to be rendered
    const scrapeCurrentPage = async (
      _browser,
      _srcUrl,
      _wrapperSelector,
      _itemSelector,
      _itemLinkSelector,
      _objectProperties,
      _nextButtonSelector
    ) => {
      await page.waitForSelector(_wrapperSelector);
      // Get the link to all the required items
      let urls = await page.$$eval(
        _itemSelector,
        (links, __itemLinkSelector) => {
          // Extract the links from the data
          return links.map((el) => {
            return el.querySelector(__itemLinkSelector).href;
          });
        },
        _itemLinkSelector
      );
      // Loop through each of those links, open a new page instance and get the relevant data from them
      let pagePromise = (link) =>
        new Promise(async (resolve) => {
          let dataObj = {};
          let newPage = await browser.newPage();
          await newPage.goto(link);
          dataObj.link = link;
          for (prop of _objectProperties) {
            dataObj[prop.name] = await newPage.$eval(
              prop.selector,
              prop.callback
            );
          }
          resolve(dataObj);
          await newPage.close();
        });

      for (link in urls) {
        let currentPageData = await pagePromise(urls[link]);
        scrapedData.push(currentPageData);
      }
      // When all the data on this page is done, click the next button and start the scraping of the next page
      // You are going to check if this button exist first, so you know if there really is a next page.
      let nextButtonExist = false;
      if (_nextButtonSelector) {
        try {
          const nextButton = await page.$eval(
            _nextButtonSelector,
            (a) => a.textContent
          );
          nextButtonExist = true;
        } catch (err) {
          nextButtonExist = false;
        }
      }
      if (nextButtonExist) {
        await page.click(_nextButtonSelector);
        return scrapeCurrentPage(
          _browser,
          _srcUrl,
          _wrapperSelector,
          _itemSelector,
          _itemLinkSelector,
          _objectProperties,
          _nextButtonSelector
        ); // Call this function recursively
      }
      await page.close();
      return scrapedData;
    };
    let data = await scrapeCurrentPage(
      browser,
      srcUrl,
      wrapperSelector,
      itemSelector,
      itemLinkSelector,
      objectProperties,
      nextButtonSelector
    );
    console.log(data);
    return data;
  },
};

module.exports = scraperObject;
