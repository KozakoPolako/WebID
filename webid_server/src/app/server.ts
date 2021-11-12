import http from "http";
import app from "./app"

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, ():void => {
    console.log(`app listen on ports ${PORT}`);
})