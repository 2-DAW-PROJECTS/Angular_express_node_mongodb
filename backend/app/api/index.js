const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");


// Load environment variables
dotenv.config();

// console.log('MONGO_URI:', process.env.MONGO_URI);
// console.log('PORT:', process.env.PORT);
// console.log('CORSURL:', process.env.CORSURL);
// console.log('DUMMY_PRODUCTS:', process.env.DUMMY_PRODUCTS);

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORSURL || 'http://localhost:4200',  // Usa variable de entorno o una URL por defecto
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database configuration
const dbConfig = require('../config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Routes setup
require('../routes/category.routes')(app);
require('../routes/offerts.routes')(app);
require('../routes/enterprises.routes')(app);
// require('../routes/carousel.routes')(app);
require('../routes/user.routes')(app);
// require('../routes/profile.routes')(app);
require('../routes/comments.routes')(app);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Servidor Express en el puerto ${process.env.PORT}`);
});
