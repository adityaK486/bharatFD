import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

const translate = new Translate();

const translateText = async (text, targetLang) => {
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (error) {
    throw new Error(`Translation failed: ${error.message}`);
  }
};

export default translateText;
