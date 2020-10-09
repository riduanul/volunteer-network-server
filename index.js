const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4xssl.mongodb.net/${process.env.DB_NAME
  }?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const dataCollection = client.db('volunteerdb').collection('data');
  const activityCollection = client.db('volunteerdb').collection('activity');

  app.post('/addData', (req, res) => {
    const data = req.body;
    dataCollection.insertMany(data).then(result => {
      res.send(result);
    });
  });

  app.post('/addActivity', (req, res) => {
    const newActivity = req.body;
    activityCollection.insertOne(newActivity).then(result => {
      console.log(result);
    });
  });

  app.get('/data', (req, res) => {
    dataCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get('/registrationDetails', (req, res) => {
    const details = req.query.email;
    activityCollection.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get('/imgRegistration', (req, res) => {
    dataCollection.find({ desc: req.query.title }).toArray((err, documents) => {
      console.log(documents);
      res.send(documents[0]);
    });
  });

  app.delete(`/delete/:id`, (req, res) => {
    activityCollection.deleteOne({ _id: ObjectId(req.params.id) }).then(result => {
      res.send(result);
    });
  });

  app.get('/activityData', (req, res) => {
    activityCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get('/', (req, res) => {
    res.send("Hello from db it's working");
  });
});

app.listen(process.env.PORT || port);