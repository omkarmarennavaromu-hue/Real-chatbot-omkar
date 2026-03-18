const chatBox = document.getElementById("chat-box");

// Add chat message with animation
function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = "chat-message " + className;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to AI
async function sendMessage() {
  const message = document.getElementById("userMessage").value;
  if (!message) return;
  addMessage(message, "user-message");
  document.getElementById("userMessage").value = "";

  // Show typing animation bubble
  const typingBubble = document.createElement("div");
  typingBubble.className = "chat-message ai-message";
  typingBubble.innerText = "Typing...";
  chatBox.appendChild(typingBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  const res = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  typingBubble.remove();
  addMessage(data.reply, "ai-message");
  speak(data.reply);
}

// Voice input
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.onresult = (e) => {
  document.getElementById("userMessage").value = e.results[0][0].transcript;
  sendMessage();
};
function startListening() { recognition.start(); }

// Voice output
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utter);
}
