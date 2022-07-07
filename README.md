# rent-scraper

## Example

Call scrapper in pageController.js

```
scrapedData['NameOfCollection'] = await pageScraper.scraper({ // name your collection
  browser,
  srcUrl:
    'https://url-to-list',
  wrapperSelector: '#products', // parent element of list
  itemSelector: '#products > .item-prod', // item of list
  itemLinkSelector: '.product-item > .row > .col-xs-12 > .gbtn', // link to detail
  objectProperties: [
    {
      name: 'title',
      selector: '#content > div > .product-header',
      callback: (text) => text.textContent,
    },
    {
      name: 'image',
      selector: '.figure-large > a',
      callback: (a) => a.href,
    },
    {
      name: 'price',
      selector: '.main-price',
      callback: (text) => text.textContent,
    },
    {
      name: 'description',
      selector: '#tab-description > p',
      callback: (text) => text.textContent,
    },
  ],
  nextButtonSelector: 'li > a', // button for next page of list
});
```
