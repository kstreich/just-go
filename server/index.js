var express = require('express')
var bp = require('body-parser')
var server = express()
var cors = require('cors')
var port = process.env.PORT || 3000
// server.use(express.static(__dirname + '/../client/dist'))

var whitelist = ['http://localhost:8080', "https://go-justgo.herokuapp.com/"];
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
};
server.use(express.static(__dirname + "/../client/dist"))


//Fire up database connection
require('./server-assets/db/mlab-config')


//REGISTER MIDDLEWEAR
server.use(bp.json({ limit: '3mb' }))
server.use(bp.urlencoded({
  extended: true
}))

//REGISTER YOUR AUTH ROUTES BEFORE YOUR GATEKEEPER, OTHERWISE YOU WILL NEVER GET LOGGED IN
let auth = require('./server-assets/auth/routes')
server.use(auth.session)
server.use(auth.router)


//Gate Keeper Must login to access any route below this code
server.use((req, res, next) => {
  if (req.method == "GET") {
    return next()
  }
  if (!req.session.uid) {
    return res.status(401).send({
      error: 'please login to continue'
    })
  }
  next()
})

//YOUR ROUTES HERE!!!!!!
let albumRoutes = require('./server-assets/routes/album')
server.use('/api/albums', albumRoutes)

let commentRoutes = require('./server-assets/routes/comment')
server.use('/api/comments', commentRoutes)

let postRoutes = require('./server-assets/routes/post')
server.use('/api/posts', postRoutes)

let profileRoutes = require('./server-assets/routes/users')
server.use('/api/users', profileRoutes)


//Catch all
server.get('*', (req, res, next) => {
  res.status(404).send({
    error: 'No matching routes'
  })
})


server.listen(port, () => {
  console.log('server running on port', port)
})