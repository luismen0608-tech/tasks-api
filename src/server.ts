import { app } from "./app.js";

const port = 3000;

app.listen(port, ()=>{
    console.log(`El servidor esta corriendo en el puerto ${port}`)
});