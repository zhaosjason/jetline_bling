# Priceline Bling
### Server
Node.js backend with Express framework to expose a Mongo database in a RESTful manner.  

To setup, make sure you have Node.js and MongoDB installed on your machine.  I recommend Homebrew for installation on macs.
Start the mongo daemon, import the data from the provided csv into Mongo, and start the Express server:
```
mongod --config /usr/local/etc/mongod.conf
mongoimport -d mongodb -c getaways --type csv --file [path_to_csv] --headerline
node index.js
```

Express and Mongo help from: http://www.raywenderlich.com/61078/write-simple-node-jsmongodb-web-service-ios-app

### iOS App


