"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = ResponseHandler;
// import { ErrorLogger } from '../common/logging'; // Uncomment and adjust if you have a logger
function ResponseHandler(req, res, next) {
    const resAny = res;
    resAny.sendSuccess = (data, message = null) => {
        res.send({ success: true, data, message });
    };
    resAny.sendError = (error, errorCode = 0, errorData = undefined) => {
        if (typeof error === 'string') {
            res.send({ success: false, error, errorCode, errorData });
        }
        else {
            if (!error) {
                error = { stack: null, message: "Unknown Error" };
            }
            // ErrorLogger.error((error as Error).stack); // Uncomment if you have a logger
            res.send({ success: false, error: error.message, errorData: error, errorCode });
        }
    };
    next();
}
