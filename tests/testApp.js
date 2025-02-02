import express from 'express';
import bodyParser from 'body-parser';
import faqRoutes from '../routes/faqRoutes.js';

const createTestApp = (mockServices = {}) => {
  const app = express();
  app.use(bodyParser.json());

  // Attach mock services to app for route access
  app.locals.services = mockServices;

  app.use('/api/faqs', faqRoutes);
  return app;
};

export default createTestApp;
