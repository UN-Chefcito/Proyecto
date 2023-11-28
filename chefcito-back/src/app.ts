import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import recipeRoutes from './routes/recipe.routes';

const app: Express = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(userRoutes);
app.use(authRoutes);
app.use(recipeRoutes); 

app.get('/', (_, response: Response) => {
  response.send('UN-Chefcito API');
});

export default app;
