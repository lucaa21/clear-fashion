const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const fs = require('fs');
const { Console } = require('console');

function getClient() {
  const uri = "mongodb+srv://tatouti:MongoDB6@clusterclearfashion.iyacjoa.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  return client;
}

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': false});
});

app.get('/brands', async (request, response) => {
  try{
    const client = getClient();
    const collection = client.db("ClusterClearFashion").collection("GENERAL");
    const found = await collection.distinct('brand');
    //response.send({brands: found});
    response.json(found);
  }
  catch{
    response.send({error : "Couldn't fetch brands"}); 
  }
});

app.get('/products', async (request, response) => {
  const client = getClient();
  const collection = client.db("ClusterClearFashion").collection("GENERAL");

  const result = await collection.find({}).toArray();

  response.json(result);
});

app.get('/sort', async (request, response) => {
  const client = getClient();
  const collection = client.db("ClusterClearFashion").collection("GENERAL");
  var sortVal = request.query.sort;

  const sortType ={};
  if(sortVal==1){
    sortType.price = 1;
  }
  else if(sortVal==-1){
    sortType.price = -1;
  }
  else{
    sortType.price = 0;
  }

  const result = await collection.find({}).sort(sortType).toArray();

  response.json(result);
});

app.get('/products/search', async (request, response) => {
  try{
    const client = getClient();
    const collection = client.db("ClusterClearFashion").collection("GENERAL");

    var script ={};
    var page = request.query.page;
    var limit = request.query.limit;
    var price = request.query.price;
    var brand = request.query.brand;

    if(page == undefined){
      page = 1;
    }
    else{
      page = parseInt(page);
    }

    if(limit == undefined){
      limit = 12;
    }
    else{
      limit = parseInt(limit);
    }
    const skip = (page - 1) * limit;

    if((brand!="")){
      script.brand = brand;
    }

    if(price!=""){
      script.price = {$lte: parseFloat(price)};
    }

    const count = await collection.countDocuments(script);
    const totalPages = Math.ceil(count / limit);

    const result = await collection.find(script).skip(skip).limit(limit).toArray();

    response.json({
      currentPage: page,
      totalPages: totalPages,
      totalCount: count,
      data: result
    });
  }
  catch{
    response.send({error : "Couldn't fetch searchs"}); 
  }
});

app.get('/products/id', async (request, response) => {
  try{
    const productId = request.params.id;
    const script = {_id: ObjectId(productId)};
    const client = getClient();
    const collection = client.db("ClusterClearFashion").collection("GENERAL");
    const found = await collection.find(script).toArray();
    
    response.send({ids: found});

  } catch(err) {
	  response.send({error : "ID not found"});  
  }
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);