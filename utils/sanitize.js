import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOM window for DOMPurify
const window = new JSDOM('').window;
const domPurify = DOMPurify(window);

// Sanitize HTML content
const sanitize = (dirty) => {
  return domPurify.sanitize(dirty);
};

export default sanitize;
