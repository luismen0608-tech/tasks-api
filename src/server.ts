import { app } from "./app.js";
import { initDatabase } from "./db/init.js";

const port = 3000;

async function startServer() {
    await initDatabase();

    app.listen(port, ()=>{
        console.log(`El servidor esta corriendo en el puerto ${port}`)
    });
}

startServer();