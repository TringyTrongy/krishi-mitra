// ── Session ID (persists for the browser tab lifetime) ──────────────────────
const SESSION_ID = "session_" + Math.random().toString(36).slice(2, 11);

// ── DOM refs ─────────────────────────────────────────────────────────────────
const chatWindow      = document.getElementById("chatWindow");
const userInput       = document.getElementById("userInput");
const sendBtn         = document.getElementById("sendBtn");
const clearBtn        = document.getElementById("clearBtn");
const typingIndicator = document.getElementById("typingIndicator");
const apiStatus       = document.getElementById("apiStatus");
const chipList        = document.getElementById("chipList");

// ── Configure marked for safe rendering ──────────────────────────────────────
marked.setOptions({ breaks: true, gfm: true });

// ── Helpers ───────────────────────────────────────────────────────────────────
function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendMessage(role, text) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("msg", role);

  const avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.textContent = role === "bot" ? "🌱" : "👤";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  if (role === "bot") {
    bubble.innerHTML = marked.parse(text);
  } else {
    bubble.textContent = text;
  }

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  chatWindow.appendChild(wrapper);
  scrollToBottom();
}

function appendError(msg) {
  const el = document.createElement("div");
  el.classList.add("error-banner");
  el.textContent = "⚠️ " + msg;
  chatWindow.appendChild(el);
  scrollToBottom();
}

function setLoading(loading) {
  sendBtn.disabled = loading;
  typingIndicator.classList.toggle("hidden", !loading);
  scrollToBottom();
}

// ── API health check ──────────────────────────────────────────────────────────
async function checkApiStatus() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    if (data.apiKeyConfigured) {
      apiStatus.textContent = "✅ API Ready";
      apiStatus.classList.add("ok");
    } else {
      apiStatus.textContent = "⚠️ API Key Missing";
      apiStatus.classList.add("fail");
      appendError(
        "GEMINI_API_KEY is not set in your .env file. " +
        "Please add your Google AI Studio key and restart the server."
      );
    }
  } catch {
    apiStatus.textContent = "❌ Server error";
    apiStatus.classList.add("fail");
  }
}

// ── Send message ──────────────────────────────────────────────────────────────
async function sendMessage(text) {
  const trimmed = (text || userInput.value).trim();
  if (!trimmed) return;

  userInput.value = "";
  autoResizeTextarea();
  appendMessage("user", trimmed);
  setLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: trimmed, sessionId: SESSION_ID }),
    });

    const data = await res.json();

    if (!res.ok) {
      appendError(data.error || "Something went wrong. Please try again.");
    } else {
      appendMessage("bot", data.reply);
    }
  } catch (err) {
    appendError("Could not reach the server. Is it running?");
  } finally {
    setLoading(false);
  }
}

// ── Clear conversation ────────────────────────────────────────────────────────
async function clearConversation() {
  await fetch("/api/clear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: SESSION_ID }),
  }).catch(() => {});

  chatWindow.innerHTML = "";
  showWelcome();
}

// ── Welcome message ───────────────────────────────────────────────────────────
function showWelcome() {
  appendMessage(
    "bot",
    "🙏 **नमस्ते! Welcome to Krishi Mitra!**\n\n" +
    "मैं Krishi Mitra हूं — your AI Agricultural Scheme Assistant.\n\n" +
    "I can help you with:\n" +
    "- 💰 **PM-KISAN** — ₹6,000/year income support\n" +
    "- 🏦 **Kisan Credit Card (KCC)** — crop loans at 4%\n" +
    "- 🛡️ **PMFBY** — crop insurance\n" +
    "- 🏪 **e-NAM** — sell produce at best prices\n" +
    "- 🌿 **Soil Health Card** & many more schemes\n\n" +
    "**Ask me anything in any language!**\n" +
    "_किसी भी भाषा में पूछें · Ask in Hindi, Tamil, Telugu, Kannada, and more._"
  );
}

// ── Auto-resize textarea ──────────────────────────────────────────────────────
function autoResizeTextarea() {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 140) + "px";
}

// ── Event listeners ───────────────────────────────────────────────────────────
sendBtn.addEventListener("click", () => sendMessage());

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

userInput.addEventListener("input", autoResizeTextarea);

clearBtn.addEventListener("click", clearConversation);

chipList.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => sendMessage(chip.textContent));
});

// ── Init ──────────────────────────────────────────────────────────────────────
showWelcome();
checkApiStatus();
