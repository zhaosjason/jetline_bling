var ObjectID = require('mongodb').ObjectID;
var db;

CollectionDriver = function(db) {
	this.db = db;
};

CollectionDriver.prototype.getCollection = function(collectionName, callback) {
	this.db.collection(collectionName, function(error, the_collection) {
		if( error ) callback(error);
		else callback(null, the_collection);
	});
};

// For dev testing purposes only
CollectionDriver.prototype.findAll = function(collectionName, callback) {
	this.getCollection(collectionName, function(error, the_collection) {
	  if( error ) callback(error);
	  else {
		the_collection.find().toArray(function(error, results) {
			if( error ) callback(error);
			else callback(null, results);
		});
	  }
	});
};

// Get more cards
CollectionDriver.prototype.get = function(collectionName, loc, entityId, callback) {
	this.getCollection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else {
			var findProjection = {"Destination": false, "Hotel Check Out Date": false, "Origin": false,
				"Expedia Package Price/Person": false, "Month": false, "Advance_weeks": false};
			the_collection.find({Origin: loc}, findProjection).toArray(function(error, doc) {
				if (error) callback(error);
				else{ callback(null, doc); } 
			});
		}
	});
};

// Find all friends, check to see if they are have liked any of your spots
CollectionDriver.prototype.crossref = function(collectionName, doc, entityId, callback){
	this.getCollection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else {
			console.log("begin...");
			var fbids = the_collection.find({"fbid": entityId})[0].friends.map(function(user){
				return user.fbid;
			});

			console.log(fbids);

			the_collection.find({fbid: {$in: fbids}}).forEach(function(user){
				doc.forEach(function(trip){
					user[0].likes.forEach(function(like){
						if(trip._id == like){
							trip.count = trip.count + 1;
						}
					});
				});
			});

			doc.sort({ "count": -1, "% Savings (Compared to Expedia)": -1 })
			callback(null, doc);
		}
	});
};

// Add liked trips to user model
CollectionDriver.prototype.save = function(collectionName, obj, entityId, callback) {
	this.getCollection(collectionName, function(error, the_collection) { 
		if (error) callback(error);
		else {
			the_collection.update({fbid: entityId}, {$push: {likes: obj._id}}, function() { 
				callback(null, obj);
			});
		}
	});
};

// Update facebook friends list in users collection
CollectionDriver.prototype.update = function(collectionName, obj, entityId, callback) {
	this.getCollection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else {
			the_collection.update({fbid: entityId}, {$set: {friends: JSON.parse(obj.friends)}}, function(error,doc) {
				if (error) callback(error);
				else callback(null, obj);
			});
		}
	});
};

exports.CollectionDriver = CollectionDriver;