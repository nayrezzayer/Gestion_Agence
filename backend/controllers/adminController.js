const User = require("../models/UserModel");
const Car = require("../models/CarModel");
const { body,validationResult } = require("express-validator");

const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");

exports.CarList = [
	function (req, res) {
		try {
			Car.find().then((cars)=>{
				if(cars){
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

exports.UserList = [
	
	function (req, res) {
		try {
			User.find().then((users)=>{
				if(users){
								
			return apiResponse.successResponseWithData(res, "Operation success", users);
				
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
exports.getUser = [
	
	function (req, res) {
		try {
			User.findOne({_id:req.params.id}).then((user)=>{
				if(user){
					return apiResponse.successResponseWithData(res, "Operation success", user);
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

exports.userDelete = async function (req, res) {
	try {
	  // Valider si l'ID est un ObjectID valide
	  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return apiResponse.validationErrorWithData(res, 'Erreur invalide.', 'ID invalide');
	  }
  
	  // Rechercher l'utilisateur par ID
	  const foundUser = await User.findById(req.params.id);
	  if (!foundUser) {
		return apiResponse.notFoundResponse(res, 'L\'utilisateur n\'existe pas avec cet ID');
	  }
  
	  // Supprimer l'utilisateur
	  await User.findOneAndDelete({ _id: req.params.id });
	  return apiResponse.successResponse(res, 'Utilisateur supprimé avec succès.');
	} catch (err) {
	  // Gérer les erreurs
	  return apiResponse.ErrorResponse(res, err.message);
	}
  };
  
  exports.userUpdate = async (req, res) => {
	try {
		const user = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			access: req.body.access,
			locataire:req.body.locataire,		};

		const updatedUser = await User.findByIdAndUpdate(req.params.id, user, { new: true });
		if (!updatedUser) {
			return apiResponse.ErrorResponse(res, "User not found.");
		}

		return apiResponse.successResponseWithData(res, "User update success.", updatedUser);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
};