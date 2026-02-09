"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const router = express_1.default.Router();
// CRUD for notifications
router.get('/', notificationController_1.getNotifications);
router.get('/:id', notificationController_1.markAsRead);
router.post('/', notificationController_1.markAsRead);
router.put('/:id', notificationController_1.markAsRead);
router.delete('/:id', notificationController_1.markAsRead);
exports.default = router;
