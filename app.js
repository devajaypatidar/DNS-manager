require('dotenv').config();
const express =  require('express');
const app = express();
const bodyParser = require('body-parser');
const Port = 3000 || process.env.PORT 
const AWS = require('aws-sdk');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
})

app.use(bodyParser.json());


const domainRoutes = require('./routes/domainRoute')
const dnsRoutes = require('./routes/dnsRoute')
app.get("/", function(req, res){
    res.send("Server Started");
})

app.use("/domain",domainRoutes);
app.use("/dns",dnsRoutes);

app.listen(Port,()=>{
    console.log("listening on port http://localhost:%d",Port);
})