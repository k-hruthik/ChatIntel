# ChatIntel: AI-Powered Chat Transcript Analysis

Welcome to ChatIntel, a web application designed to provide deep insights into conversations by analyzing chat transcripts. Using the power of generative AI, this tool can summarize discussions, extract key information, and analyze the sentiment of the participants.

This project was created by [Hruthik Varma](https://github.com/k-hruthik).

## ✨ Features

- **Transcript Selection**: Easily load and select from a dataset of chat transcripts.
- **AI-Powered Summary**: Get a concise summary of any chat conversation with a single click.
- **Article Link Extraction**: Automatically identifies and extracts URLs for articles mentioned in the chat.
- **Agent-Specific Metrics**:
    - Calculates the number of messages sent by each agent.
    - Determines the overall sentiment (Positive, Negative, Neutral) for each agent.
- **Modern & Responsive UI**: A clean, intuitive, and mobile-friendly interface built with modern web technologies.
- **Modular AI Architecture**: Utilizes separate, specialized AI flows for each analysis task (summary, sentiment, link extraction) for better maintainability and accuracy.

## 🛠️ Tech Stack

This project is built with a modern, full-stack JavaScript approach:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (with Google's Gemini models)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later recommended)
- `npm` or `yarn`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/k-hruthik/ChatIntel.git
    cd ChatIntel
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    This project uses Genkit to connect to Google's AI services. You'll need a Google AI API key.

    - Create a file named `.env` in the root of the project.
    - Add your API key to the file:
      ```
      GOOGLE_API_KEY=YOUR_API_KEY_HERE
      ```
    - You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## 📁 Project Structure

- `src/app/`: Contains the main page and layout of the application.
- `src/ai/flows/`: Home to the modular Genkit AI flows (`summarize-chat.ts`, `analyze-agent-sentiment.ts`, `extract-article-link.ts`).
- `src/components/`: Reusable React components, including the UI elements from ShadCN.
- `public/data/`: Contains the `dataset.json` file used for loading chat transcripts.
- `src/lib/`: Shared utilities and type definitions.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
