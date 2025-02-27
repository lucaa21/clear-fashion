const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);
  return $('.productList-container .productList')
    .map((i, element) => {
      const brand = 'dedicated';
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const material = $(element)
      .find('.productList-image-materialInfo')
      .text()
      .trim()
      .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );
      
      return {brand, name, price, material};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
const scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};


/**
 * Scrape all the products across all pages
 * @param  {[type]}  baseUrl
 * @param  {[type]}  pageCount
 * @return {Array}
 */
module.exports.scrapeAll = async (baseUrl, pageCount) => {
  let products = [];

  for (let i = 1; i <= pageCount; i++) {
    const url = `${baseUrl}&page=${i}`;
    const pageProducts = await scrape(baseUrl);

    if (pageProducts) {
      products = [...products, ...pageProducts];
    }
  }

  return products;
};
