var express = require("express");
const path = require("path");

const CarController = require("../controllers/CarController");
const app = express()
var router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'C:/Users/nayre/OneDrive/Bureau/Gestion_Agence/frontend/src/uploads');
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname)
    }
  })

   
 const upload = multer({ storage: storage })


router.get("/:id",CarController.getCar);
router.get("/", CarController.CarList);
router.post("/",upload.single('myFile'), CarController.CarStore);
router.put("/:id",CarController.carUpdate);
router.delete("/:id", CarController.carDelete);
router.get("/all/o",CarController.getAllCars)

module.exports = router;