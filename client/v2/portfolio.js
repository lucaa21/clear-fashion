// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/
Search for specific products
This endpoint accepts the following optional query string parameters:
- `page` - page of products to return
- `size` - number of products to return
GET https://clear-fashion-api.vercel.app/brands
Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');
const selectPrice = document.querySelector('#price-select');
const selectRecently = document.querySelector('#recently-select');
const selectSort = document.querySelector('#sort-select');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the page of products to display
 */
selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value),currentPagination.pageSize);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the brand of products to display
 */
selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  var marque = event.target.value;
  let listeOfPdts=[];
  for(let i = 0;i<currentPagination.pageSize;i++){ //Create a list of price
    if(marque!='all'){
      if(products['result'][i]['brand']==marque){
        listeOfPdts.push(products['result'][i]);
      }
    }
    else{
      listeOfPdts.push(products['result'][i]);
    }
  }
  products['result']=listeOfPdts;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the price of products to display
 */
selectPrice.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  var price = event.target.value;
  console.log(products)
  let listeOfPdts=[];
  for(let i = 0;i<currentPagination.pageSize;i++){ //Create a list of price
    if(price!='all'){
      if(products['result'][i]['price']<=price){
        listeOfPdts.push(products['result'][i]);
      }
    }
    else{
      listeOfPdts.push(products['result'][i]);
    }
  }
  products['result']=listeOfPdts;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the released date of products to display
 */
selectRecently.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  var today = new Date();
  console.log(products)
  let difference;
  let TotalDays;
  let dayReleased;
  let newReleased = event.target.value;

  console.log(`Affichage des produits dont la date de sortie est inférieure à ${newReleased} jours:`);
  let listeOfPdts=[];
  for(let i=0;i<currentPagination.pageSize;i++){
    dayReleased = new Date(products['result'][i]['released']);
    let difference = today.getTime() - dayReleased.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    if(TotalDays<newReleased){
      listeOfPdts.push(products['result'][i]);
    }
  }

  products['result']=listeOfPdts;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the sort to display
 */
selectSort.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  var sortType = event.target.value;
  let listeOfPdts=[];

  if(sortType!='none'){
    let tempDict = products['result'];

    if(sortType=='price-asc'){
      listeOfPdts = tempDict.sort(function(first, second) {
        return first['price'] - second['price'];
      });
    }
    else if(sortType=='price-desc'){
      listeOfPdts = tempDict.sort(function(first, second) {
        return second['price'] - first['price'];
      });
    }
    else if(sortType=='date-asc'){
      listeOfPdts = tempDict.sort(function(first, second) {
        return first['released'] - second['released'];
      });
    }
    else if(sortType=='date-desc'){
      listeOfPdts = tempDict.sort(function(first, second) {
        return second['released'] - first['released'];
      });
    }

  }
  else{
    listeOfPdts = products['result'];
  }
  
  products['result']=listeOfPdts;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});