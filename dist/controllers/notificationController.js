"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getNotifications = void 0;
const paginationService_1 = require("../services/paginationService");
const getNotifications = async (req, res, next) => {
    try {
        const result = await (0, paginationService_1.getPaginatedData)(Notification, req.query);
        res.sendSuccess(result, 'Notifications fetched');
    }
    catch (err) {
        next(err);
    }
};
exports.getNotifications = getNotifications;
const markAsRead = (req, res, next) => {
    // TODO: Implement mark as read logic
    res.sendSuccess(null, 'markAsRead not implemented');
};
exports.markAsRead = markAsRead;
