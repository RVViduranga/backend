"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobPostController_1 = require("../controllers/jobPostController");
const router = express_1.default.Router();
// CRUD for job posts
router.get('/', jobPostController_1.getJobs);
router.get('/:id', jobPostController_1.getJobs);
router.post('/', jobPostController_1.createJob);
router.put('/:id', jobPostController_1.updateJob);
router.delete('/:id', jobPostController_1.deleteJob);
exports.default = router;
