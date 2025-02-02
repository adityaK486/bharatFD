import express from 'express';
import mongoose from 'mongoose';
import faqRoutes from './routes/faqRoutes.js';
import { initializeRedis } from './utils/cache.js';
import adminRouter from './admin/adminConfig.js';

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/faq-db')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

await initializeRedis();

app.use('/api/faqs', faqRoutes);
app.use('/admin', adminRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;
