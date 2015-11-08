var http = require('http'), express = require('express'), path = require('path');
MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server,
CollectionDriver = require('./collectionDriver').CollectionDriver;

var app = express();
app.set('port', process.env.PORT || 3000); 
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'jade'); 

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

// Begin Mongo stuff
var mongoHost = 'localhost'; 
var mongoPort = 27017; 
var collectionDriver;
 
var mongoClient = new MongoClient(new Server(mongoHost, mongoPort)); 
mongoClient.open(function(err, mongoClient) { 
	if (!mongoClient) {
		console.error("Error! Exiting... Must start MongoDB first");
		process.exit(1); 
	}
	var db = mongoClient.db("mongodb");  
	collectionDriver = new CollectionDriver(db); 
});
 
/***************** Routes Begin *****************/

// Get entire database *dev purposes only*
app.get('/:collection', function(req, res) {
	var params = req.params;
	collectionDriver.findAll(req.params.collection, function(error, objs) {
		if (error) { res.send(400, error); }
		else { 
			if (req.accepts('html')) {
				res.render('data',{objects: objs, collection: req.params.collection});
			} else {
			res.set('Content-Type','application/json');
				res.send(200, objs);
			}
		}
	});
});

/** 
 *	Get more cards (returns 15 at a time)
 *	HTTP Request: GET /getaways/[fbid]/[airport code]
 */
app.get('/:collection/:entity/:loc', function(req, res) {
	var params = req.params;
	var loc = params.loc;
	var entity = params.entity;
	var collection = params.collection;
	if (entity) {
		collectionDriver.get(collection, loc, entity, function(error, objs) {
			if (error) { res.send(400, error); }
			else { 
				collectionDriver.crossref("users", objs, entity, function(error, objs) {
					if (error) { res.send(400, error); }
					else { res.send(200, objs); }
				});
			}
		});
	} else {
		res.send(400, {error: 'bad url', url: req.url});
	}
});

/** 
 *	Send liked trips to server
 *	HTTP Request: POST /users/[fbid]
 *	HTTP Body:    { "_id": "[trip id]" }
 */
app.post('/:collection/:entity', function(req, res) {
	var params = req.params;
	var collection = params.collection;
	var entity = params.entity;
	collectionDriver.save(collection, req.body, entity, function(err,docs) {
		if (err) { res.send(400, err); } 
		else { res.send(201, docs); } 
	});
});

/** 
 *	Update friends list every time a user connects
 *	HTTP Request: PUT /users/[fbid]
 *	HTTP Body:    { "friends": [{"fbid":"[fbid]"},...] }
 */
app.put('/:collection/:entity', function(req, res) { 
	var params = req.params;
	var collection = params.collection;
	var entity = params.entity;
	collectionDriver.update(collection, req.body, entity, function(error, objs) { 
		if (error) { res.send(400, error); }
		else { res.send(200, objs); } 
	});
});

/****************** Routes End ******************/
 
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
