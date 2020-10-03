const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jos17.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteer").collection("events");
  const volunteerCollection = client.db("volunteer").collection("registeredVolunteer");
  console.log('database connected');

  app.post('/addEvents', (req, res) => {
    const event = req.body;
   eventCollection.insertMany(event)
   .then(result => {
       console.log(result.insertedCount)
       res.send(result.insertedCount)
   })
})

app.get('/allEvents',(req, res) => {
    eventCollection.find({})
    .toArray( (err, documents) => {
        res.send(documents)
    })
})

app.post('/addVolunteer', (req, res) => {
  const volunteer = req.body;
  volunteerCollection.insertOne(volunteer)
 .then(result => {
     res.send(result.insertedCount > 0)
 })
})


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)