// ===================================================
// Storica Architects — backend server
// Node.js + Express
// ===================================================

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Make sure the data folder + file exist before the server starts handling requests
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, '[]');
}

// ---------------------------------------------------
// Middleware
// ---------------------------------------------------
app.use(express.json());                         // parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // serve index.html, gallery.html, styles/, images/, main.js, etc.

// ---------------------------------------------------
// Helpers
// ---------------------------------------------------
function readMessages() {
  const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ---------------------------------------------------
// API ROUTES
// ---------------------------------------------------

// Receive a new contact form submission
app.post('/api/contact', function (req, res) {
  const { name, email, message } = req.body || {};

  // Server-side validation — never trust the client alone
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }
  if (!email || !isValidEmail(email.trim())) {
    return res.status(400).json({ success: false, error: 'A valid email is required.' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Message is required.' });
  }

  const newMessage = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString()
  };

  const messages = readMessages();
  messages.push(newMessage);
  saveMessages(messages);

  console.log('New contact message from', newMessage.email);

  res.json({ success: true, message: 'Thanks! Your message has been received.' });
});

// View all submitted messages (simple admin-style endpoint — no auth yet, just for learning)
app.get('/api/messages', function (req, res) {
  res.json(readMessages());
});

// ---------------------------------------------------
// Start the server
// ---------------------------------------------------
app.listen(PORT, function () {
  console.log(`Storica Architects server running at http://localhost:${PORT}`);
});
