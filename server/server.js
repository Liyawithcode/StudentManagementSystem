import { app } from "./src/app.js";
import { connectDB } from "./src/config/auth.database.js";
import { config_ENV } from "./src/config/auth.config.js";
import { verifyMailConnection } from "./src/config/mail.config.js";

const startServer = async () => {
    try {
        await connectDB();
        await verifyMailConnection();
        const PORT = config_ENV.PORT || 5000;
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running successfully on http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error('Server startup error:', error.message);
    }
}

startServer();