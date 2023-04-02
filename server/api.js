const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const fs = require('fs');
const { Console } = require('console');

function getClient() {
  const uri = "mongodb+srv://ringuetluca:mdpmdpmdp@cluster0.nxupqlp.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  return client;
}

app.get('/', (request, response) => {
  response.send({'ack': true});
});


app.get('/brands', async (request, response) => {
  try{
    const client = getClient();
    const collection = client.db("Cluster0").collection("general");
    const found = await collection.distinct('brand');
    response.send({brands: found});
  }
  catch{
    response.send({error : "Couldn't fetch brands"}); 
  }
});

app.get('/products/:id', async (request, response) => {
  try{
    const productId = request.params.id;
    const script = {_id: ObjectId(productId)};
    const client = getClient();
    const collection = client.db("Cluster0").collection("general");
    const found = await collection.find(script).toArray();
    const metadata = {pageSize: found.length};
    response.send({result: found, meta: metadata});

  } catch(err) {
	  response.send({error : "ID not found"});  
  }
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);