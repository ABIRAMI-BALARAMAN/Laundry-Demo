import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import todoRoutes from './routes/todos.js';

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB once and reuse the connection.
// On Vercel, the same serverless instance can handle many requests,
// so we avoid opening a new connection on every request.
let connectionPromise = null;
function connectDB() {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
      connectionPromise = null; // allow a retry on the next request
      throw err;
    });
  }
  return connectionPromise;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/todos', todoRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

// Vercel imports this module and uses the exported app.
// Running `node server.js` locally starts a normal server.
const isMain = process.argv[1] && process.argv[1].endsWith('server.js');
if (isMain) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

export default app;
