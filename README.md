# 📝 AI-Powered Cover Letter Generator

An intelligent, resume-aware web application built with **React**, **TypeScript**, and **Vite**. This tool bridges the gap between your professional background and job requirements by generating tailored, high-impact cover letters with AI-powered polishing.

---

## 🚀 Features

* **📄 Dual Input Modes:** Upload your resume (PDF, DOCX, TXT) or manually enter your professional details.
* **🧠 Smart Skill Matching:** Intelligently identifies overlaps between your resume and the job description.
* **🎯 Automated Relevance:** Prioritizes and selects the most impactful skills for the specific role.
* **✍️ Dynamic Templates:** Choose from various writing styles (Professional, Technical, Creative, Career Change, Executive, Entry-Level).
* **� AI-Powered Polishing:** Advanced LLM-based grammar and tone enhancement while maintaining factual accuracy.
* **🛠 Interactive Editor:** Refine the generated text directly within the app.
* **📥 Instant Export:** Download your customized cover letter in multiple formats (PDF, DOCX).

---

## 🧩 How It Works

1. **Input:** Upload your resume or fill in your details manually.
2. **Context:** Paste the target company's job description.
3. **Analysis:** The app extracts text, parses resume data, and matches skills to JD requirements.
4. **Template Generation:** Select your preferred professional tone and generate the initial draft.
5. **AI Polishing:** LLM automatically enhances grammar, tone, and job description alignment.
6. **Output:** Edit the result and download in your preferred format.

---

## 🖥️ Tech Stack

* **Frontend Framework:** [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **UI Components:** [Radix UI](https://www.radix-ui.com/) + [Tailwind CSS](https://tailwindcss.com/)
* **PDF Processing:** [pdfjs-dist](https://mozilla.github.io/pdf.js/)
* **Document Parsing:** [mammoth](https://www.npmjs.com/package/mammoth) (for DOCX)
* **AI Polishing:** [OpenRouter API](https://openrouter.ai/) with Llama 3, Mistral, and Gemma models
* **Export:** [jsPDF](https://github.com/parallax/jsPDF) and [docx](https://www.npmjs.com/package/docx)
* **State Management:** React Hooks + [TanStack Query](https://tanstack.com/query/latest)

---

## 📂 Project Structure

```text
infosys-coverletter/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (buttons, inputs, etc.)
│   │   ├── CoverLetterPreview.tsx
│   │   ├── ResumeUpload.tsx
│   │   ├── SkillAnalysis.tsx
│   │   └── TemplateSelector.tsx
│   ├── lib/                  # Core business logic
│   │   ├── coverLetterGenerator.ts  # Template generation engine
│   │   ├── coverLetterPolisher.ts   # AI polishing module
│   │   ├── resumeParser.ts          # Resume text extraction
│   │   ├── skillMatcher.ts          # Skill matching algorithm
│   │   └── exportUtils.ts           # PDF/DOCX export utilities
│   ├── pages/                # Main application pages
│   │   └── Generator.tsx     # Main cover letter generator interface
│   ├── hooks/                # Custom React hooks
│   └── App.tsx              # Main application component
├── .env                     # Environment variables (API keys)
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhinav-123457/infosys-coverletter.git
   cd infosys-coverletter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Add your OpenRouter API key to `.env`:
   ```
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

### Build for Production
```bash
npm run build
```

---

## 🔧 Configuration

### AI Polishing Setup

1. Get a free API key from [OpenRouter.ai](https://openrouter.ai/keys)
2. Add it to your `.env` file:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```
3. Restart the development server

The AI polishing will work automatically after template generation when the API key is configured.

---

## 🎯 Templates Available

* **Professional Classic** - Traditional tone for corporate environments
* **Technical Expert** - Emphasizes technical skills and engineering mindset  
* **Creative & Bold** - Personality-forward with storytelling
* **Career Changer** - Highlights transferable skills for industry transitions
* **Executive Leadership** - Strategic, results-driven for senior roles
* **Fresh Graduate** - Enthusiastic tone for entry-level positions

---

## 🛠️ Development

### Available Scripts
* `npm run dev` - Start development server
* `npm run build` - Build for production
* `npm run preview` - Preview production build
* `npm run lint` - Run ESLint
* `npm run test` - Run tests

### Project Architecture

The application follows a clean architecture with:
* **Separation of Concerns:** UI components separated from business logic
* **Type Safety:** Full TypeScript implementation
* **Modular Design:** Each feature in its own module
* **Error Handling:** Graceful fallbacks for AI failures
* **Responsive Design:** Mobile-first approach with Tailwind CSS

---

## 📄 License

This project is licensed under the MIT License.

