function toggleChat() {
  const chat = document.getElementById("chatbot");
  chat.classList.toggle("hidden");
}

async function sendMessage() {
  const input = document.getElementById("input");
  const msg = input.value.trim();
  if (!msg) return;

  const messages = document.getElementById("messages");

  // user message
  const userDiv = document.createElement("div");
  userDiv.className = "message user";
  userDiv.textContent = msg;
  messages.appendChild(userDiv);

  try {
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();

    const botDiv = document.createElement("div");
    botDiv.className = "message bot";
    botDiv.textContent = data.reply;
    messages.appendChild(botDiv);

  } catch (err) {
    const botDiv = document.createElement("div");
    botDiv.className = "message bot";
    botDiv.textContent = "Server not responding.";
    messages.appendChild(botDiv);
  }

  input.value = "";
  messages.scrollTop = messages.scrollHeight;
}
function scrollToClasses() {
  document.getElementById("classes").scrollIntoView({
    behavior: "smooth"
  });
}

function quickBook(className) {
  toggleChat(); // open chatbot
  document.getElementById("input").value = "Book " + className;
  sendMessage();
}
