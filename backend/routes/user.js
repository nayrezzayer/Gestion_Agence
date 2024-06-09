var express = require("express");
const userController = require("../controllers/adminController");
var router = express.Router();
router.get("/", userController.UserList);
router.get("/:id", userController.getUser);
router.delete("/:id", userController.userDelete);
router.get("/CarList",userController.CarList)
router.put("/:id",userController.userUpdate);

module.exports = router;