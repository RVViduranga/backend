"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const router = (0, express_1.Router)();
// Public
router.get('/search', jobController_1.searchJobs); // <-- must be before /:id
router.get('/', jobController_1.getJobs);
router.post('/:id/apply', jobController_1.applyToJob);
router.get('/:id/related', jobController_1.getRelatedJobs);
router.get('/:id', jobController_1.getJobById);
router.post('/', jobController_1.createJob);
router.put('/:id', jobController_1.updateJob);
router.delete('/:id', jobController_1.deleteJob);
exports.default = router;
