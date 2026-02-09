"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadController_1 = require("../controllers/uploadController");
const router = express_1.default.Router();
// CRUD for uploads
router.get('/', uploadController_1.getFile);
router.get('/:id', uploadController_1.getFile);
router.post('/', uploadController_1.uploadFile);
router.put('/:id', uploadController_1.uploadFile);
router.delete('/:id', uploadController_1.uploadFile);
exports.default = router;
