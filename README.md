# Priceline Bling
### Server
Node.js backend with Express framework to expose a Mongo database in a RESTful manner.  

To setup, make sure you have Node.js and MongoDB installed on your machine.  I recommend Homebrew for installation on macs.
To start the mongo daemon:
`mongod --config /usr/local/etc/mongod.conf`
Import the data from the provided csv into Mongo:
`mongoimport -d mongodb -c getaways --type csv --file [path_to_csv] --headerline`
Start the Express server:
`node index.js`


### iOS App


