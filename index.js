const express = require('express');
const app = express();
const bp = require('body-parser');
const config = require('config');
const cors = require('cors');
const mongoose    = require('mongoose');
const bodyParser  = require('body-parser');
const router = new express.Router();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_HOST); // connect to database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bp.json())

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(cors());

app.use('/api', require("./router"));

app.listen(PORT, "0.0.0.0", function() {
  console.log('Listening on ' + PORT);
});
