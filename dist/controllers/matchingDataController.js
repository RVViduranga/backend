"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMatchingData = exports.getMatchingData = void 0;
const MatchingData_1 = __importDefault(require("../models/MatchingData"));
const getMatchingData = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const filters = { ...req.query };
        delete filters.page;
        delete filters.pageSize;
        delete filters.sortBy;
        delete filters.sortOrder;
        Object.keys(filters).forEach(key => {
            if (filters[key] === '' || filters[key] === undefined)
                delete filters[key];
        });
        const query = MatchingData_1.default.find(filters)
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const [data, total] = await Promise.all([
            query,
            MatchingData_1.default.countDocuments(filters)
        ]);
        res.sendSuccess({ data, total }, 'Matching data fetched');
    }
    catch (err) {
        next(err);
    }
};
exports.getMatchingData = getMatchingData;
const createMatchingData = (req, res, next) => {
    // TODO: Implement create matching data logic
    res.sendSuccess(null, 'createMatchingData not implemented');
};
exports.createMatchingData = createMatchingData;
