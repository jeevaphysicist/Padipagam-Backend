const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const PORT  = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.get('/',(req,res)=>{
           res.send(`Default API is Running Perfectly`);

});
app.get('/first',(req,res)=>{
    res.send(`First API is Running Perfectly`);
})



app.listen(PORT,()=>{
    console.log("Server Running On http://localhost:",PORT);
})