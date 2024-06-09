const express = require("express");
const app =  express() ;
const mongoose= require("mongoose");
const dotenv=require("dotenv");
dotenv.config();
const cors = require('cors');
//access cors 
var corsOptions = {
    origin:'http://localhost:4200',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET,POST,DELETE,PUT"
}
app.use(cors(corsOptions));
//app.use('/uploads', express.static('../../uploads'));

//connect to 
mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log('MongoDB connection successful');
       
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
//Midleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//import router
const apiRouter = require("./routes/api");
app.use("/api/", apiRouter)

app.listen(3000,()=>console.log("server Up and runing" ));
