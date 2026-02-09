"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const profileController_1 = require("../controllers/profileController");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.post('/', profileController_1.createProfile);
router.get('/', profileController_1.getProfiles);
router.get('/:id', profileController_1.getProfileById);
router.put('/:id', profileController_1.updateProfile);
router.delete('/:id', profileController_1.deleteProfile);
// Avatar upload (requires authentication)
router.post('/avatar', auth_1.default, upload_1.uploadAvatar.single('avatar'), profileController_1.uploadAvatar);
exports.default = router;
