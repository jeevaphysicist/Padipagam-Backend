const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const AuthRoutes = require('./routes/UserCollection');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8080 ;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Database connection 
mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once("open", () => {
  console.log("database connected successfully");
});

mongoose.connection.on("connected", () => {
  console.log("mongodb connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("mongodb disconnected");
});


app.get('/',(req,res)=>{
        res.send("hey server is running ");
})


// API Paths
app.use('/api/auth',AuthRoutes);



app.listen(PORT,()=>{
   console.log("server running on port ",PORT);
})