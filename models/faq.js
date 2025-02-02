import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  translations: {
    type: Map,
    of: {
      question: String,
      answer: String,
    },
    default: new Map(),
  },
});

// Convert translations Map to a plain object when converting to JSON
faqSchema.set('toJSON', {
  transform: (doc, ret) => {
    const output = { ...ret };
    if (output.translations && output.translations instanceof Map) {
      output.translations = Object.fromEntries(output.translations);
    }
    return output;
  },
});

// eslint-disable-next-line func-names
faqSchema.methods.getTranslation = function (lang) {
  if (lang === 'en') {
    return {
      question: this.question,
      answer: this.answer,
    };
  }
  return (
    this.translations.get(lang) || {
      question: this.question,
      answer: this.answer,
    }
  );
};

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;
