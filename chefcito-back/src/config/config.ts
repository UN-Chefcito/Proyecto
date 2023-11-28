import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_PRIVATE = process.env.JWT_PRIVATE || 'private';
const JWT_PUBLIC = process.env.JWT_PUBLIC || 'public';

export { PORT, JWT_SECRET, JWT_PRIVATE, JWT_PUBLIC};