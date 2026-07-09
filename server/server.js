import { app } from "./src/app.js";
import { connectDB } from "./src/config/auth.database.js";
import { config_ENV } from "./src/config/auth.config.js";
import { verifyMailConnection } from "./src/config/mail.config.js";

const startServer = async () => {
    try {
        await connectDB();
        await verifyMailConnection();
        app.listen(config_ENV.PORT, () => {
            console.log(`Server is running on port ${config_ENV.PORT}`);
        });
    }catch(error){
        console.log('Failed to start the server:', error);
        process.exit(1);
    }
}

startServer();