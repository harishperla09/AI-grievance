const chatbotAnswers = [
  {
    test: /(submit|file).*complaint|how.*submit/i,
    answer: 'Go to the Submit Complaint page, enter issue details, location, and optionally upload an image/video. Then click Submit Complaint.'
  },
  {
    test: /(garbage|waste|trash|sanitation)/i,
    answer: 'Garbage and waste issues are handled by the Sanitation Department.'
  },
  {
    test: /(water|leak|pipeline|supply)/i,
    answer: 'Water leakage and supply issues are routed to the Water Department.'
  },
  {
    test: /(street light|electrical|power|electricity)/i,
    answer: 'Street light and power issues are handled by the Electrical Department.'
  },
  {
    test: /(road|pothole|bridge|public works)/i,
    answer: 'Road damage and pothole issues are handled by the Public Works Department.'
  },
  {
    test: /(reward|points|badge)/i,
    answer: 'You earn +10 points for submitting complaints, +5 when resolved, and +2 for upvoting. Badges unlock at milestones.'
  },
  {
    test: /(priority|red|yellow|green)/i,
    answer: 'Priority colors: Red = urgent/high risk, Yellow = medium/important, Green = resolved/closed.'
  }
];

function toggleChatbot() {
  document.getElementById('chatbot-container').classList.toggle('hidden');
}

function appendChatMessage(text, sender = 'bot') {
  const messages = document.getElementById('chatbot-messages');
  const wrapper = document.createElement('div');
  wrapper.className = `chat-message ${sender}`;

  wrapper.innerHTML = `
    <div class="chat-avatar"><i class="fas ${sender === 'bot' ? 'fa-robot' : 'fa-user'}"></i></div>
    <div class="chat-bubble">${text}</div>
  `;

  messages.appendChild(wrapper);
  messages.scrollTop = messages.scrollHeight;
}

function getBotAnswer(text) {
  const match = chatbotAnswers.find((item) => item.test.test(text));
  return match ? match.answer : 'I can help with complaint submission, departments, priorities, rewards, and dashboard usage.';
}

function sendChatMessage(text) {
  if (!text?.trim()) return;
  appendChatMessage(text, 'user');

  setTimeout(() => {
    appendChatMessage(getBotAnswer(text), 'bot');
  }, 400);
}

function sendChatFromInput() {
  const input = document.getElementById('chatbot-input');
  const value = input.value.trim();
  if (!value) return;
  input.value = '';
  sendChatMessage(value);
}
