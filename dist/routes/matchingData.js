"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const matchingDataController_1 = require("../controllers/matchingDataController");
const router = express_1.default.Router();
// CRUD for matching data
router.get('/', matchingDataController_1.getMatchingData);
router.get('/:id', matchingDataController_1.getMatchingData);
router.post('/', matchingDataController_1.createMatchingData);
router.put('/:id', matchingDataController_1.createMatchingData);
router.delete('/:id', matchingDataController_1.createMatchingData);
exports.default = router;
