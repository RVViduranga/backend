"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role = function (roles = []) {
    if (typeof roles === 'string')
        roles = [roles];
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    };
};
exports.default = role;
