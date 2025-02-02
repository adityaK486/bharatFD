 # FAQ Management API

FAQ Management API is a RESTful service built with Node.js, MongoDB, and Redis that manages frequently asked questions (FAQs) with multilingual support. It also comes with an admin panel powered by AdminJS to manage FAQs visually.

## Table of Contents

- [Installation](#installation)
- [API Usage](#api-usage)
  - [GET /api/faqs](#get-apifaqs)
  - [POST /api/faqs](#post-apifaqs)
  - [PUT /api/faqs/:id](#put-apifaqsid)
  - [DELETE /api/faqs/:id](#delete-apifaqsid)
- [Admin Panel](#admin-panel)
- [Contribution Guidelines](#contribution-guidelines)
- [Running Tests](#running-tests)
- [License](#license)

## Installation

### Prerequisites

- **Node.js** (>= 14.x)
- **npm** (>= 6.x)
- **MongoDB** (local or remote; for testing an in-memory MongoDB is used)
- **Redis** (optional; if not available, cache will fall back to an in-memory implementation)

### Steps

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies:**

   Run the following command to install all required packages:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   Create a `.env` file in the project root (if not already provided) and add your configuration. For example:

   ```bash
   MONGODB_URI=mongodb://localhost:27017/faq-db
   PORT=3000
   REDIS_URL=redis://127.0.0.1:6379/0
   ```

4. **Start the Server:**

   ```bash
   npm start
   ```

   The API server will start on [http://localhost:3000](http://localhost:3000).

5. **Access the Admin Panel:**

   The admin panel is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## API Usage

### GET /api/faqs

Retrieve all FAQs in the default language (English) or a specified language using the `lang` query parameter.

**Request Examples:**

- Default (English):
  ```bash
  curl http://localhost:3000/api/faqs
  ```
- Hindi:
  ```bash
  curl "http://localhost:3000/api/faqs?lang=hi"
  ```

**Response Example (English):**
json
[
{
"question": "What is FAQ?",
"answer": "Frequently Asked Questions.",
"translations": {
"hi": {
"question": "यह FAQ क्या है?",
"answer": "अक्सर पूछे जाने वाले प्रश्न।"
}
}
}
]

### POST /api/faqs

Create a new FAQ.

**Request Example:**
bash
curl -X POST http://localhost:3000/api/faqs \
-H "Content-Type: application/json" \
-d '{
"question": "What is FAQ?",
"answer": "Frequently Asked Questions.",
"translations": {
"hi": { "question": "यह FAQ क्या है?", "answer": "अक्सर पूछे जाने वाले प्रश्न।" }
}
}'

**Successful Response:**
json
{
"id": "603e2fc334d1d25c18e7f9a0",
"question": "What is FAQ?",
"answer": "Frequently Asked Questions.",
"translations": {
"hi": {
"question": "यह FAQ क्या है?",
"answer": "अक्सर पूछे जाने वाले प्रश्न।"
}
},
"v": 0
}

In case of invalid input (e.g., missing question or answer), the API will respond with a 400 status and an error message:
json
{
"error": "Question and answer are required fields"
}

### PUT /api/faqs/:id

Update an existing FAQ. You can update either the English version or supply a `targetLang` to update the translation.

**Request Example:**
bash
curl -X PUT http://localhost:3000/api/faqs/<faq-id> \
-H "Content-Type: application/json" \
-d '{
"question": "Updated Question?",
"answer": "Updated Answer.",
"targetLang": "hi"
}'

### DELETE /api/faqs/:id

Delete an existing FAQ.

**Request Example:**

curl -X DELETE http://localhost:3000/api/faqs/<faq-id>


## Admin Panel

Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin) to manage FAQs. The panel provides a visual interface to view, edit, and update FAQ records including multilingual details.

## Contribution Guidelines

Contributions are welcome! Please follow these guidelines to ensure a smooth collaboration:

### Git Workflow & Commit Messages

- **Branching:** Create a new branch for each change using a descriptive name. For example:  
  - For new features: `feat/multilingual-faq-model`
  - For bug fixes: `fix/translation-caching`
  - For documentation updates: `docs/api-examples`

- **Atomic Commits:** Ensure each commit is atomic (i.e., contains changes related to a single purpose). Use [Conventional Commits](https://www.conventionalcommits.org/) format:

  ```bash
  git commit -m "feat: Add multilingual FAQ model"
  git commit -m "fix: Improve translation caching"
  git commit -m "docs: Update README with API examples"
  ```

### Development and Testing

- **Code Style:** Run ESLint before committing:
  ```bash
  npm run lint -- --fix
  ```
- **Tests:** Write tests for new features/fixes. Run tests using:
  ```bash
  npm test
  ```

### Steps to Contribute

1. **Fork the Repository**
2. **Clone your fork and create a new branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Commit your changes with clear, conventional commit messages.**
4. **Push your branch to your fork:**
   ```bash
   git push origin feat/your-feature-name
   ```
5. **Open a Pull Request** with a detailed description of your changes and reference any related issues.

## Running Tests

The project utilizes Mocha, Chai, and Supertest for testing. To run all tests, execute:


npm test


Test files are located in the `tests/` directory and cover models, controllers, and integration routes.

## License

This project is licensed under the MIT License.

---

Happy coding and thank you for contributing!