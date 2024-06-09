const Reservation = require("../models/ReservationModel");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");

// Function to format reservation data
function reservationData(data) {
	this.id = data._id;
	this.mark = data.mark;
	this.firstName = data.firstName;
	this.lastName = data.lastName;
	this.useradmin = data.useradmin;
	this.dateDebut = data.dateDebut;
	this.dateFin = data.dateFin;
	this.tel = data.tel;
	this.adresse = data.adresse;
}

exports.createReservation = [

	async (req, res) => {
		try {
			// Validate request
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}

			// Create reservation object
			const reservation = new Reservation({
				mark: req.body.mark,
				useradmin: req.body.useradmin,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				dateDebut: req.body.dateDebut,
				dateFin: req.body.dateFin,
				tel: req.body.tel,
				adresse: req.body.adresse,
			});

			// Save reservation to database
			await reservation.save();

			// Format the response data
			const reservationDataObj = new reservationData(reservation);

			// Send success response
			return apiResponse.successResponseWithData(res, "Reservation added successfully.", reservationDataObj);
		} catch (err) {
			// Send error response
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
exports.ReservationList = [
	
	function (req, res) {
		try {
			Reservation.find().then((Reservations)=>{
				if(Reservations){
								
			return apiResponse.successResponseWithData(res, "Operation success", Reservations);
				
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
