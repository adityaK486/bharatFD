import FAQ from '../models/faq.js';
import { cache, getFromCache, clearCache } from '../utils/cache.js';
import translateText from '../services/translationService.js';

export const getFAQs = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const cacheKey = `faqs:${lang}`;

    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const faqs = await FAQ.find();
    const translatedFAQs = faqs.map((faq) => faq.getTranslation(lang));

    await cache(cacheKey, translatedFAQs);
    return res.json(translatedFAQs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createFAQ = async (req, res) => {
  try {
    if (req.body.translations && typeof req.body.translations === 'object') {
      req.body.translations = new Map(Object.entries(req.body.translations));
    }
    const faq = await FAQ.create(req.body);
    await clearCache('faqs:*');
    return res.status(201).json(faq);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(400)
        .json({ error: 'Question and answer are required fields' });
    }
    return res.status(400).json({ error: error.message });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, targetLang } = req.body;

    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    if (targetLang && targetLang !== 'en') {
      const translatedQuestion = await translateText(question, targetLang);
      const translatedAnswer = await translateText(answer, targetLang);

      faq.translations.set(targetLang, {
        question: translatedQuestion,
        answer: translatedAnswer,
      });
    } else {
      faq.question = question;
      faq.answer = answer;
    }

    await faq.save();
    await clearCache('faqs:*');
    return res.json(faq);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    await clearCache('faqs:*');
    return res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
