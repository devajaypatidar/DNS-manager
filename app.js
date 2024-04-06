const express =  require('express');
const app = express();
const bodyParser = require('body-parser');
const Port = 3000 || process.env.PORT 


app.get("/", function(req, res){
    res.send("Server Started");
})

app.listen(Port,()=>{
    console.log("listening on port http://localhost:%d",Port);
})