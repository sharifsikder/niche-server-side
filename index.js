const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zbufa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        console.log('connected to database')

        const database = client.db('car_sales');
        const productsCollection = database.collection('products')
        const orderCollection = database.collection('orders')
        const reviewCollection = database.collection('review')


        app.post('/products', async(req, res) => {
            const item = req.body;
            console.log('hit the post api', item);
            const result = await productsCollection.insertOne(item);
            console.log(result)
            res.send (result)
        })
        // get api 
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

        // get single api

        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query ={ _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product)
        })

        // order post api 
        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })
        // get review
        app.post('/review', async(req, res) => {
            const item = req.body;
            console.log('hit the post api', item);
            const result = await reviewCollection.insertOne(item);
            console.log(result)
            res.send (result)
        })

         //GET API ALL DATA  
        app.get('/review', async(req, res) => {
        const cursor = reviewCollection.find({});
        const items = await cursor.toArray();
        res.send(items)
    });

        // order get api 
        app.get('/orders', async(req, res) => {
        const cursor = orderCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders)
    })


     // delete api 
     app.delete('/orders/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await orderCollection.deleteOne(query)
        res.json(result)

    })

     //get my orders 
        app.get('/orders/:email', async (req, res) => {
        const result = await orderCollection
        .find({email:req.params.email})
        .toArray();
        res.send(result);
     })
   
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})