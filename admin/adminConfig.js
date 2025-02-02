import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSMongoose from '@adminjs/mongoose';
import FAQ from '../models/faq.js';

// Register the adapter
AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({
  resources: [
    {
      resource: FAQ,
      options: {
        properties: {
          _id: {
            isVisible: {
              list: false,
              filter: true,
              show: true,
              edit: false,
            },
          },
          question: { isTitle: true },
          answer: { type: 'richtext' },
          'translations.hi.question': {
            label: 'Hindi Question',
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
            },
          },
          'translations.hi.answer': {
            label: 'Hindi Answer',
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
            },
          },
          'translations.bn.question': {
            label: 'Bengali Question',
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
            },
          },
          'translations.bn.answer': {
            label: 'Bengali Answer',
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
            },
          },
          translations: {
            type: 'mixed',
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
            },
          },
        },
      },
    },
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'FAQ Management',
    logo: false,
    softwareBrothers: false,
  },
});

// Build the router and export it as default
const adminRouter = AdminJSExpress.buildRouter(adminJs);

export default adminRouter;
