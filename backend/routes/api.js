const express=require("express");
const authRouter = require("./Auth");
const carRouter = require("./Car");
const userRouter = require("./user");
const reservationRoutes = require("./reservationRoutes");

const app = express();

app.use("/auth/", authRouter);
app.use("/car/", carRouter);
app.use("/user/", userRouter);
app.use("/reservation/", reservationRoutes);

module.exports=app;