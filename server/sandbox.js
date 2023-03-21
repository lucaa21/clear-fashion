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


async function mongoDB(products, eshop){
  const {MongoClient} = require('mongodb');
  const MONGODB_URI = 'mongodb+srv://ringuetluca:mdpmdpmdp@Cluster0.nxupqlp.mongodb.net/test';
  const MONGODB_DB_NAME = 'Cluster0';
  // Connecting to the MongoDB database and inserting the sample data
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME)
  const collection = db.collection(eshop) //create a database in the clearfashion collection
  const result = await collection.insertMany(products);
  console.log(`${result.insertedCount} documents were inserted into the ${eshop} database`);
}


async function sandbox(eshop) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    let products;
    let json_name;
    let big_json = 'big_json';
    if (eshop === 'https://www.dedicatedbrand.com/en/men/news') {
      const pageCount = 17; // or whatever the total number of pages is
      products = await dedicatedbrand.scrapeAll(eshop, pageCount);
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
    writeFile(products,big_json)
    console.log('done for the BIG json')
    mongoDB(products, json_name);
    console.log('done for mongoDB for ', json_name)
    mongoDB(products, 'general');
    console.log('done for mongoDB for the general database')
    process.exit(0);
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
