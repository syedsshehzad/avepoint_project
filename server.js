//	DBTEST.JS

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = "mongodb://ariadna:ariadna1@ds030719.mlab.com:30719/avepoint";

// Database Name
const dbName = 'avepoint';

const BANNED_WORDS = ["of", "with", "at", "from", "on", "by", "in", "to", "for",
"the", "a", "an", "these", "those", "it", "all"];

var arr = [];
var used = [];

// Use connect method to connect to the server
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const collection = client.db(dbName).collection("issues");
  collection.find().toArray(function(err, docs) {
  	assert.equal(err, null);
  	docs.forEach(doc => {
  		var title = doc.Title;
  		title.split(/\s|\[|\]|\(|\)|\:|\||\\|\//g).forEach(Word => {
  			var word = Word.toLowerCase();
  			if (BANNED_WORDS.indexOf(word) < 0 && word.length > 0) {
  				if (used.indexOf(word) < 0) {
  					arr.push({term: word, occurences: [doc.ID]});
  					used.push(word);
  				} else {
  					arr[used.indexOf(word)].occurences.push(doc.ID);
  				}
  				/*var index = client.db(dbName).collection("index");
  				index.find({term: word}).toArray(function(error, results) {
  					assert.equal(error, null);
  					if (results.length < 1) {
  						index.insert({term: {name: word}, {occ: doc.ID}})
  					}
  				})*/

  			}
  		});
  	});
  	/* THIS CODE SHOULD ONLY BE RUN ONCE TO POPULATE THE DATABASE:
  	const index = client.db(dbName).collection("index");
  	index.insertMany(arr, function(error, result) {
  		assert.equal(error, null);
  	});
  	*/
  	
  	//console.log(arr)
  	//for (var i = 0; i < 10; i++) {
  	//console.log(arr[i].term)
  //}
  	client.close();
  });

  // insertDocuments(documents, function() {
  // 	client.close();
  // });
  var stuffs = [];


  	
  	
});
/*
const index = function(word, id) {

}

const insertDocuments = function(c, callback) {
  // Get the documents collection
  const collection = db.collection(c);
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

const findDocuments = function(c, query, callback) {
  // Get the documents collection
  const collection = db.collection(c);
  // Find some documents
  collection.find({ID: query}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

const findAll = function(c, callback) {
  // Get the documents collection
  const collection = db.collection(c);
  // Find some documents
  collection.find().toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}
*/

var express = require("express");
var port = process.env.PORT || 3000;
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/*
var mongoose = require("mongoose");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://ariadna:ariadna1@ds030719.mlab.com:30719/avepoint";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
var db = require("./models");
*/
var path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// var exphbs = require("express-handlebars");
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

app.get("/", (req, res) => {
	res.sendFile("index.html", err => {if (err) throw err})
});

app.post("/search", (req, res) => {
	MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  assert.equal(null, err);
	var query = req.body.query;
	console.log(query)
	var index = client.db(dbName).collection("index");
	index.find({term: query}).toArray(function(err, docs) {
		assert.equal(err, null);
		console.log("Found the following records");
		console.log(docs)
		if (docs.length) {
			var array = [];
			console.log("DOCS[0]")
			console.log(docs[0].occurences)
			docs[0].occurences.forEach(occurence => {
				
				MongoClient.connect(url, {useNewUrlParser: true}, function(e,c) {
					var issues = client.db(dbName).collection("issues");
					issues.find({ID: occurence}).toArray(function(a,b) {
						console.log("BBBBBB")
						console.log(b)
						array.push(b[0]);
						
			if (array.length > 0 && array.length == docs[0].occurences.length) {
							res.json(array);
						} 
					});

				});
			});
			
		}
	});
});
});
			

app.listen(port, () => {console.log("listening on port " + port)});