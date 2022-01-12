const express = require("express");

// experimentRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const experimentRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This will help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the records.
experimentRoutes.route("/experiment").get(function (req, res) {
  let db_connect = dbo.getDb("dmc-db");
  db_connect
    .collection("experiments")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log("1 document retrieved");
      res.json(result);
    });
});

// This section will help you get a single record by id
experimentRoutes.route("/experiment/:id").get(function (req, res) {
  let db_connect = dbo.getDb("dmc-db");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("experiments").findOne(myquery, function (err, result) {
    if (err) throw err;
    console.log("1 document retrieved");
    res.json(result);
  });
});

// This section will help you create a new record.
experimentRoutes.route("/experiment/add").post(function (req, response) {
  let db_connect = dbo.getDb("dmc-db");
  let myobj = {
    machine: req.body.machine,
    experimentName: req.body.experimentName,
    positions: req.body.positions,
    frequency: req.body.frequency,
    begDate: null,
    endDate: req.body.endDate,
    status: true,
    confirmation: req.body.confirmation,
  };
  db_connect.collection("experiments").insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document added");
    response.json(res);
  });
});

// This section will help you update a record by id.
experimentRoutes.route("/experiment/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb("dmc-db");
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      machine: req.body.machine,
      experimentName: req.body.experimentName,
      positions: req.body.positions,
      frequency: req.body.frequency,
      begDate: null,
      endDate: req.body.endDate,
      status: true,
      confirmation: req.body.confirmation,
    },
  };
  db_connect
    .collection("experiment")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// This section will help you delete a record
// experimentRoutes.route("/:id").delete((req, response) => {
//   let db_connect = dbo.getDb("dmc-db");
//   let myquery = { _id: ObjectId(req.params.id) };
//   db_connect.collection("records").deleteOne(myquery, function (err, obj) {
//     if (err) throw err;
//     console.log("1 document deleted");
//     response.status(obj);
//   });
// });

module.exports = experimentRoutes;
