var ObjectID = require('mongodb').ObjectID;

CollectionDriver = function(db) {
	this.db = db;
};

CollectionDriver.prototype.getCollection = function(collectionName, callback) {
	this.db.collection(collectionName, function(error, the_collection) {
		if( error ) callback(error);
		else callback(null, the_collection);
	});
};


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

CollectionDriver.prototype.get = function(collectionName, cmd, q, callback) {
	this.getCollection(collectionName, function(error, the_collection) {
		if (error) callback(error);
		else {
			if(cmd == 'loc'){
				the_collection.distinct('Hotel Property', {'Origin':q}, function(error,doc) {
					if (error) callback(error);
					else callback(null, doc);
				});
			}
			else if(cmd == 'friends'){
				the_collection.find({},{'Location':q}).toArray(function(error,doc) {
					if (error) callback(error);
					else callback(null, doc);
				});
			}
		}
	});
};

// Add liked trips to user model
CollectionDriver.prototype.save = function(collectionName, obj, entityId, callback) {
	this.getCollection(collectionName, function(error, the_collection) { 
		if (error) callback(error);
		else {
			the_collection.update(fbid:'entityId', {$push: {likes: obj._id}}, function() { 
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
			the_collection.update({fbid: entityId}, {$set: {friends: obj.friends}}, function(error,doc) {
				if (error) callback(error);
				else callback(null, obj);
			});
		}
	});
};

//delete a specific object
/*
CollectionDriver.prototype.delete = function(collectionName, entityId, callback) {
	this.getCollection(collectionName, function(error, the_collection) { //A
		if (error) callback(error);
		else {
			the_collection.remove({'_id':ObjectID(entityId)}, function(error,doc) { //B
				if (error) callback(error);
				else callback(null, doc);
			});
		}
	});
};*/

exports.CollectionDriver = CollectionDriver;