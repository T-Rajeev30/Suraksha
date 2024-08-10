const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;

app.get('/ping' , (res,res)=>{
    res.send('Pong');
})
app.listen(PORT,()=>{
    console.log("Server is runnig on ${PORT}")
})