const Car = require("../models/CarModel");
const { body,validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const path = require("path");
var mongoose = require("mongoose");

// Car Schema
function CarData(data) {
	this.id = data._id;
	this.mark= data.mark;
	this.user=data.user;
	this.description = data.description;
	this.imm = data.imm;
	this.imageCar=data.imageCar;
	this.price = data.price;
	this.location = data.location;
	this.createdAt = data.createdAt;
}

exports.CarList = [
	auth,
	function (req, res) {
		try {
			Car.find({user: req.user._id},
				"_id mark imm price location user description imageCar isActive createdAt").then((cars)=>{
				if(cars.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", cars);
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


exports.CarStore = [
	auth,
	body("mark", "mark must not be empty.").isLength({ min: 1 }).trim(),
	body("price", "price must not be empty.").isLength({ min: 1 }).trim(),
	body("location", "location must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("imm", "Immatricule must not be empty").isLength({ min: 1 }).trim().custom((value, { req }) => {
	  return Car.findOne({ imm: value, user: req.user._id }).then(car => {
		if (car) {
		  return Promise.reject("car already exist with this Immatricule no.");
		}
	  });
	}),
  
	async (req, res) => {
	  try {
		const errors = validationResult(req);
		const file = req.file;
  
		if (!file) {
		  return apiResponse.validationError(res, "Please upload a file");
		}
  
		if (!errors.isEmpty()) {
		  return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
		}
		console.log(file)
		const car = new Car({
		  mark: req.body.mark,
		  user: req.user,
		  description: req.body.description,
		  price: req.body.price,
		  location: req.body.location,
		  imm: req.body.imm,
		  imageCar: file.filename // Utilisez simplement le nom du fichier, pas besoin de path.parse()
		});
  
		await car.save(); // Utilisation de await pour attendre la sauvegarde du modèle
  
		const carData = new CarData(car);
		return apiResponse.successResponseWithData(res, "Car add Success.", carData);
	  } catch (err) {
		return apiResponse.ErrorResponse(res, err);
	  }
	}
  ];
  exports.carUpdate = [
	auth,
	async (req, res) => {
		try {
			const file = req.file;
			console.log(file);

			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}

			if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
				return apiResponse.validationErrorWithData(res, "Invalid ID.", "Invalid ID");
			}

			let foundCar = await Car.findById(req.params.id).exec();
			if (!foundCar) {
				return apiResponse.notFoundResponse(res, "Car not found with this ID");
			}

			// Check authorized user
			if (foundCar.user.toString() !== req.user._id) {
				return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
			}

			// Create car object with updated data
			let car = {
				mark: req.body.mark,
				imm: req.body.imm,
				description: req.body.description,
				price: req.body.price
			};

			// Update car
			await Car.findByIdAndUpdate(req.params.id, car, { new: true }).exec();
			let carData = new Car(car);
			return apiResponse.successResponseWithData(res, "Car update success.", carData);

		} catch (err) {
			// Throw error in JSON response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
//delete 
exports.carDelete = [
	auth,
	async (req, res) => {
		try {
			if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
				return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
			}

			const foundCar = await Car.findById(req.params.id);

			if (!foundCar) {
				return apiResponse.notFoundResponse(res, "Car does not exist with this id");
			}

			// Vérifier si l'utilisateur est autorisé à effectuer cette opération
			if (foundCar.user.toString() !== req.user._id) {
				return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
			}

			// Supprimer la voiture
			await Car.findByIdAndDelete(req.params.id);

			return apiResponse.successResponse(res, "Car delete Success.");
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
exports.getCar = [
	
	function (req, res) {
		try {
		Car.findOne({_id:req.params.id}).then((car)=>{
				if(car){
					return apiResponse.successResponseWithData(res, "Operation success", car);
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

exports.getAllCars = function(req, res) {
	Car.find()
	  .then((cars) => {
		res.status(200).json(cars); // Renvoie toutes les voitures sous forme de réponse JSON
	  })
	  .catch((err) => {
		console.error("Error fetching cars:", err);
		res.status(500).json({ message: "Internal server error" }); // Gestion des erreurs
	  });
  };