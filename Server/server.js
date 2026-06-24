import app from "./src/app.js";
import dbConnect from "./src/config/db.js";
import config from "./src/config/config.js";


async function startServer() {
    try {
        await dbConnect();
        app.listen(config.PORT, () => {
            console.log(`Server is running on port ${config.PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed", error);
        process.exit(1);
    }
}

startServer();
