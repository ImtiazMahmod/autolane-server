const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

///middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zbwte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        
        const database = client.db('autolane');
        const mechanicsCollection = database.collection('mechanics');
        const servicesCollection = database.collection('services');
        ///GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});

            const services = await cursor.toArray()
            // console.log(services);
            res.json(services)
        })
        //GET API SINGLE 
        app.get('/services/:id',async (req, res) => {
            const id = req.params.id;
            // console.log('serviceID', id);

            const query = { _id: ObjectId(id) };

            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        ///POST API for mechanics
        app.post('/mechanics',async (req, res) => {
            const result = await mechanicsCollection.insertOne(docs)
            console.log('inserted', result,);
            res.send(result)
        })

        ///POST API for services
        app.post('/services',async (req, res) => {
            const newService = req.body;
            console.log('post hitted',newService);
             const result = await servicesCollection.insertOne(newService)
            console.log('services inserted', result,);
            res.json(result)
        })

        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            console.log('deleted',result);
            res.json(result);
        })
    }
    finally {
        // client.close()
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(port,'connected');
})