import { expect } from 'chai';
import request from 'supertest';
import createTestApp from '../testApp.js';
import FAQ from '../../models/faq.js';
import { setupDB, teardownDB, clearDatabase } from '../testHelper.js';
import { getFromCache, initializeRedis } from '../../utils/cache.js';

describe('FAQ API Tests', () => {
  let app;

  before(async () => {
    process.env.NODE_ENV = 'test';
    await setupDB();
    await initializeRedis(true);
    app = createTestApp();
  });

  after(async () => {
    process.env.NODE_ENV = 'development';
    await teardownDB();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/faqs', () => {
    it('should create a new FAQ', async () => {
      const payload = {
        question: 'Test Question',
        answer: 'Test Answer',
        translations: {
          hi: { question: 'टेस्ट प्रश्न', answer: 'टेस्ट उत्तर' },
        },
      };

      const response = await request(app)
        .post('/api/faqs')
        .send(payload)
        .expect(201);

      // Check that the translations were saved properly.
      expect(response.body.translations).to.have.property('hi');
      expect(response.body.translations.hi).to.have.property(
        'question',
        'टेस्ट प्रश्न',
      );
      expect(response.body.translations.hi).to.have.property(
        'answer',
        'टेस्ट उत्तर',
      );
    });

    it('should return 400 for invalid input', async () => {
      const payload = {};
      const response = await request(app)
        .post('/api/faqs')
        .send(payload)
        .expect(400);
      expect(response.body.error).to.equal(
        'Question and answer are required fields',
      );
    });
  });

  describe('GET /api/faqs', () => {
    beforeEach(async () => {
      await FAQ.create({
        question: 'Test Question',
        answer: 'Test Answer',
        translations: new Map([
          ['hi', { question: 'टेस्ट प्रश्न', answer: 'टेस्ट उत्तर' }],
        ]),
      });
    });

    it('should get FAQs in default language and verify cache', async function test() {
      this.timeout(5000);

      const response = await request(app).get('/api/faqs').expect(200);

      expect(response.body).to.be.an('array');
      expect(response.body[0].question).to.equal('Test Question');

      // Wait briefly to allow cache to be set.
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });

      const cachedData = await getFromCache('faqs:en');
      expect(cachedData).to.be.an(
        'array',
        'Cache should contain an array of FAQs',
      );
      expect(cachedData[0].question).to.equal('Test Question');
    });

    it('should get FAQs in Hindi', async () => {
      const response = await request(app)
        .get('/api/faqs')
        .query({ lang: 'hi' })
        .expect(200); // Add expect for better error messages

      expect(response.body).to.be.an('array');
      expect(response.body[0].question).to.equal('टेस्ट प्रश्न');
    });
  });
});
