import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; // we'll create this next
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// default route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// auth routes
app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
