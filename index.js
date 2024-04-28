const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 2000;

// Middleware
app.use(cors());
app.use(express.json());

// URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcso25z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //collection
    const userItemCollection = client.db('userItemDB').collection('userItem');

    //Post a item
    app.post('/userItem', async (req, res) => {
      const userItems = req.body;
      console.log(userItems);

      const result = await userItemCollection.insertOne(userItems);
      res.send(result);
    })

    //Read item
    app.get('/userItem', async (req, res) => {
      const cursor = userItemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
      
    app.get('/userItem/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userItemCollection.findOne(query);
      res.send(result)
  })

    // Update a document
    app.put('/userItem/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedItem = req.body;
      const item = {
        $set: {
          itemName: updatedItem.itemName,
          imageUrl: updatedItem.imageUrl,
          subCategory: updatedItem.subCategory,
          description: updatedItem.description,
          price: updatedItem.price,
          rating: updatedItem.rating,
          customization: updatedItem.customization,
          processingTime: updatedItem.processingTime,
          stockStutus: updatedItem.stockStutus,
        }
      }
     
      const result = await userItemCollection.updateOne(filter, item, options);
      res.send(result)
    })


    //Delete document
    app.delete('/userItem/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userItemCollection.deleteOne(query);
      res.send(result);
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('SIMPLE CRUD IS RUNNING SUCCESSFULLY..!')
})

app.listen(port, () => {
  console.log(`Simple CRUD is running on port: ${port}`)
})
