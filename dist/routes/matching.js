"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Dummy matching route for now
router.get('/', (req, res) => {
    res.json({ message: 'Matching route works!' });
});
exports.default = router;
