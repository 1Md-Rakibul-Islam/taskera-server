const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { query } = require('express');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



// Mongodb database setup
const dbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gksews0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try{
        // db all collections
        const tasksCollection = client.db('TaskEra').collection('tasks');


        // all user data insert on databse
        app.post('/tasks', async(req, res) => {
            const user = req.body;
            const result = await tasksCollection.insertOne(user);
            res.send(result);
        })

        //delete a user api

        app.delete('/tasks/:_id', async(req, res) => {
            const id = req.params._id;
            console.log(id);
            const filter = { _id: ObjectId(id) }
            const result = await tasksCollection.deleteOne(filter);
            res.send(result);
        })

        // buyer role email send to client side
        app.get('/tasks', async(req, res) => {
            const tasks = await tasksCollection.find({}).toArray();
            res.send(tasks);
        })
 
        //advetising update
        app.put('/seller/advertising/product/:_id', async(req, res) => {
            const id = req.params._id;
            const filter = { _id: ObjectId(id) };
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    advertising: true
                }
            }
            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })



    }

    finally{

    }
    
}
run().catch(console.log())


app.get('/', async(req, res) => {
    res.send('Server server is running');
})

app.listen(port, () => {
    console.log(`Server runnin on: ${port}`);
})