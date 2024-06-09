const express = require("express");
var router = express.Router();

const ReservationController = require("../controllers/ReservationController");


router.post("/reserve", ReservationController.createReservation);
router.get("/reserve", ReservationController.ReservationList);

module.exports = router;
