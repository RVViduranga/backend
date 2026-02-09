"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
// Routes
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const companies_1 = __importDefault(require("./routes/companies"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const applications_1 = __importDefault(require("./routes/applications"));
const matching_1 = __importDefault(require("./routes/matching"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const profiles_1 = __importDefault(require("./routes/profiles"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)()); // Enable CORS for all routes
app.use(express_1.default.json());
const response_handler_1 = require("./middleware/response-handler");
app.use(response_handler_1.ResponseHandler);
// Serve static files from uploads directory
const path_1 = __importDefault(require("path"));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Handle invalid JSON error gracefully
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON in request body. Please check your input.'
        });
    }
    next(err);
});
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
app.use(errorHandler_1.default);
// Routes (✅ must be BEFORE listen)
app.use("/api/users", users_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/companies", companies_1.default);
app.use("/api/jobs", jobs_1.default);
app.use("/api/applications", applications_1.default);
app.use("/api/matching", matching_1.default);
app.use("/api/notifications", notifications_1.default);
app.use("/api/uploads", uploads_1.default);
app.use("/api/profiles", profiles_1.default);
// Connect DB & start server
const startServer = async () => {
    try {
        await (0, db_1.default)();
        console.log("[INFO] MongoDB connected");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`[INFO] Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("[ERROR] Failed to connect MongoDB:", error);
        process.exit(1);
    }
};
startServer();
