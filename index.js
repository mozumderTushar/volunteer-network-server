const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jos17.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteer").collection("events");
  const volunteerCollection = client.db("volunteer").collection("registeredVolunteer");

  console.log('db connected')

  //post all fakeData to server
  app.post('/addEvents', (req, res) => {
    const event = req.body;
    eventCollection.insertMany(event)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
      })
  })

  // post single event to server
  app.post('/singleEvent', (req, res) => {
    const event = req.body;
    eventCollection.insertOne(event)
      .then(result => {
        console.log(result)
        res.send(result)
      })
  })

  //get all events from server
  app.get('/allEvents', (req, res) => {
    eventCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  //add volunteer info from register
  app.post('/addVolunteer', (req, res) => {
    const volunteer = req.body;
    volunteerCollection.insertOne(volunteer)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  //get registered volunteer through email
  app.get('/volunteer', (req, res) => {
    volunteerCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  //get all registered volunteer
  app.get('/allVolunteer', (req, res) => {
    volunteerCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  //delete 
  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id)
    volunteerCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)