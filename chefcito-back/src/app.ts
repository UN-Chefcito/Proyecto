import express, { Express, Request, Response} from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app: Express = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.use(userRoutes);
app.use(authRoutes);

// Base API Endpoint
app.get('/', ( _ , response: Response) => {
  response.send('UN-Chefcito API')
})


export default app;
