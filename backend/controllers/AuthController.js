const UserModel = require("../models/UserModel");
const { body,validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const jwt = require("jsonwebtoken");


exports.register = [
    async (req, res) => {
        try {
            // Create a new user instance
            const user = new UserModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                admin: req.body.admin,
                locataire: req.body.locataire,
                password: req.body.password // Enregistrer le mot de passe directement, sans le hacher
            });

            // Save the user to the database
            await user.save();

            // Prepare response data
            const userData = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                admin: user.admin,
                locataire: user.locataire
                // Ajoutez d'autres champs utilisateur au besoin
            };

            // Send success response
            return apiResponse.successResponseWithData(res, "Registration Success.", userData);
        } catch (err) {
            // Log and send error response
            console.error(err);
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

exports.login = [
    (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            } else {
                UserModel.findOne({ email: req.body.email }).then(user => {
                    if (user) {
                        // Check if user access is refused
                        if (user.access === "refused") {
                            return apiResponse.unauthorizedResponse(res, "Access refused. Please contact admin for assistance.");
                        }

                        // Compare given password with db's password (assuming it's stored in plain text)
                        if (req.body.password === user.password) {
                            // Prepare user data for JWT payload
                            let userData = {
                                _id: user._id,
                                admin: user.admin,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                            };

                            // Prepare JWT token for authentication
                            const jwtPayload = userData;
                            const jwtData = {
                                expiresIn: process.env.JWT_TIMEOUT_DURATION,
                            };
                            const secret = process.env.JWT_SECRET;
                            // Generate JWT token with Payload and secret
                            userData.token = jwt.sign(jwtPayload, secret, jwtData);
                            return apiResponse.successResponseWithData(res, "Login Success.", userData);
                        } else {
                            return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
                        }
                    } else {
                        return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
                    }
                });
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
