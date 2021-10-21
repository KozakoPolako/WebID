import express, {Request,Response,Application} from 'express';
import cors  from "cors";
import dokuments from "./api/routes/dokuments"

const app:Application = express();

app.use(cors());
app.use('/dokuments', dokuments)

export default app;

