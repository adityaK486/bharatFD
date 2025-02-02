import { expect } from 'chai';
import FAQ from '../../models/faq.js';
import { setupDB, teardownDB } from '../testHelper.js';

describe('FAQ Model Tests', () => {
  before(async () => {
    await setupDB();
  });

  after(async () => {
    await teardownDB();
  });

  it('should create a new FAQ', async () => {
    const faq = new FAQ({
      question: 'Test Question',
      answer: 'Test Answer',
    });
    const savedFAQ = await faq.save();
    expect(savedFAQ.question).to.equal('Test Question');
    expect(savedFAQ.answer).to.equal('Test Answer');
  });

  it('should handle translations', async () => {
    const faq = new FAQ({
      question: 'Test Question',
      answer: 'Test Answer',
      translations: new Map([
        ['hi', { question: 'टेस्ट प्रश्न', answer: 'टेस्ट उत्तर' }],
      ]),
    });
    const savedFAQ = await faq.save();
    const hiTranslation = savedFAQ.getTranslation('hi');
    expect(hiTranslation).to.have.property('question', 'टेस्ट प्रश्न');
    expect(hiTranslation).to.have.property('answer', 'टेस्ट उत्तर');
    expect(savedFAQ.getTranslation('en')).to.deep.equal({
      question: 'Test Question',
      answer: 'Test Answer',
    });
  });
});
