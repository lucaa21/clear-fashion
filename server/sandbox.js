/* eslint-disable no-console, no-process-exit */

const fs = require('fs');
const path = require('path');
const { json } = require('express');
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimart = require('./eshops/montlimart');
const circlesportswear = require('./eshops/circlesportswear');

async function writeFile(products,nameFile){
  jsonData = JSON.stringify(products);
  var path = `./Json_Files/${nameFile}.json`;
    fs.writeFileSync(path, jsonData, err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Successfully wrote file')
      }
    })
    console.log('done');
}


async function mongoDB(){
  
}

async function sandbox(eshop) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    let products;
    let json_name;
    if (eshop === 'https://www.dedicatedbrand.com/en/men/news') {
      products = await dedicatedbrand.scrape(eshop);
      json_name = "dedicated";
    } else if (eshop === 'https://www.montlimart.com/99-vetements') {
      products = await montlimart.scrape(eshop);
      json_name = "montlimart";
    } else if (eshop === 'https://shop.circlesportswear.com/collections/collection-homme') {
      products = await circlesportswear.scrape(eshop);
      json_name = "circlesportswear";
    } else {
      throw new Error('Unsupported website!');
    }

    console.log(products);
    console.log('done for scrapping');
    writeFile(products, json_name)
    console.log('done for json');
  } 
  catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const eshop1 = 'https://www.dedicatedbrand.com/en/men/news';
const eshop2 = 'https://www.montlimart.com/99-vetements';
const eshop3 = 'https://shop.circlesportswear.com/collections/collection-homme'

sandbox(eshop1);
sandbox(eshop2);
sandbox(eshop3);