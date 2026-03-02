# 🌱 Krishi Mitra — AI Agricultural Scheme Assistant

An AI-powered chatbot that helps Indian farmers discover, understand, and apply for government agricultural schemes. Powered by **Google Gemini** via Google AI Studio.

---

## Quick Start

### 1. Get a Google AI Studio API Key
1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a new API key (free tier available)
3. Copy the key

### 2. Configure Your API Key
Open `.env` and replace the placeholder:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Install & Run
```bash
npm install        # already done if you followed setup
npm start          # starts server at http://localhost:3000
```

Then open your browser at **http://localhost:3000**

---

## Features

- **10 Indian Languages**: Hindi, English, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Punjabi, Malayalam
- **Multi-turn conversations**: Remembers context within a session
- **Complete Scheme Knowledge**:
  - PM-KISAN (₹6,000/year income support)
  - Kisan Credit Card (KCC)
  - PM Fasal Bima Yojana (crop insurance)
  - e-NAM (electronic mandi trading)
  - Soil Health Card Scheme
  - PM-AASHA, PKVY, NMSA, RKVY
- **Quick topic chips** for instant access to common queries
- **Fraud prevention warnings** built in
- **Eligibility checks, application guides, status checks**

---

## Project Structure

```
krishi-mitra/
├── server.js          # Express server + Gemini API integration
├── .env               # Your API key (never commit this)
├── .env.example       # Template for .env
├── package.json
└── public/
    ├── index.html     # Chat UI
    ├── style.css      # Styles
    └── app.js         # Frontend logic
```

---

## Development (auto-reload)
```bash
npm run dev    # uses nodemon
```

## Change Port
Edit `.env`:
```
PORT=8080
```
