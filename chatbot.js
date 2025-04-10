class Chatbot {
    constructor() {
      this.initialized = false
      this.open = false
      this.messages = []
      this.suggestions = [
        "Tell me about your skills",
        "What projects have you worked on?",
        "How can I contact you?",
        "What is your experience in AI?",
      ]
      this.botResponses = {
        greeting: "Hi there! I'm Elmir's virtual assistant. How can I help you today?",
        skills:
          "Elmir specializes in Machine Learning, Deep Learning, NLP, Computer Vision, and Data Science. He's proficient in Python, TensorFlow, PyTorch, and various data analysis tools.",
        projects:
          "Elmir has worked on several projects including Anomaly Detection Systems, Predictive Maintenance, NLP Customer Feedback Analysis, and Vision-Based Quality Control. Would you like to know more about any specific project?",
        contact:
          "You can reach Elmir via email at elmirabbasov002@gmail.com or phone at +994 (50) 490-57-79. You can also use the contact form on this website.",
        experience:
          "Elmir has over 2 years of experience in Data Science and AI, with expertise in building and deploying machine learning models for various applications.",
        default:
          "I'm not sure I understand. Could you rephrase your question? Or you can ask me about Elmir's skills, projects, or how to contact him.",
      }
      this.initChatbot()
    }
  
    initChatbot() {
      if (this.initialized) return
  
      // Create chatbot container
      this.container = document.createElement("div")
      this.container.className = "chatbot-container"
      document.body.appendChild(this.container)
  
      // Create chatbot button
      this.button = document.createElement("div")
      this.button.className = "chatbot-button"
      this.button.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <div class="chatbot-notification">1</div>
      `
      this.container.appendChild(this.button)
  
      // Create chatbot window
      this.window = document.createElement("div")
      this.window.className = "chatbot-window"
      this.window.innerHTML = `
        <div class="chatbot-header">
          <div class="chatbot-title">
            <div class="chatbot-avatar">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
            <div class="chatbot-info">
              <div class="chatbot-name">Elmir's Assistant</div>
              <div class="chatbot-status">
                <span class="status-indicator"></span>
                <span>Online</span>
              </div>
            </div>
          </div>
          <div class="chatbot-actions">
            <div class="chatbot-action" id="chatbot-refresh">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
              </svg>
            </div>
            <div class="chatbot-action" id="chatbot-close">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </div>
        </div>
        <div class="chatbot-messages"></div>
        <div class="chatbot-suggestions"></div>
        <div class="chatbot-input">
          <input type="text" class="chatbot-input-field" placeholder="Type your message...">
          <div class="chatbot-send">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </div>
        </div>
      `
      this.container.appendChild(this.window)
  
      // Get elements
      this.messagesContainer = this.window.querySelector(".chatbot-messages")
      this.inputField = this.window.querySelector(".chatbot-input-field")
      this.sendButton = this.window.querySelector(".chatbot-send")
      this.suggestionsContainer = this.window.querySelector(".chatbot-suggestions")
      this.refreshButton = this.window.querySelector("#chatbot-refresh")
      this.closeButton = this.window.querySelector("#chatbot-close")
      this.notification = this.button.querySelector(".chatbot-notification")
  
      // Add event listeners
      this.button.addEventListener("click", () => this.toggleChatbot())
      this.sendButton.addEventListener("click", () => this.sendMessage())
      this.inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.sendMessage()
      })
      this.refreshButton.addEventListener("click", () => this.resetChat())
      this.closeButton.addEventListener("click", () => this.toggleChatbot())
  
      // Show notification after a delay
      setTimeout(() => {
        this.notification.classList.add("active")
      }, 3000)
  
      // Add initial bot message after a delay
      setTimeout(() => {
        this.addBotMessage(this.botResponses.greeting)
        this.renderSuggestions()
      }, 1000)
  
      this.initialized = true
    }
  
    toggleChatbot() {
      this.open = !this.open
      this.window.classList.toggle("active", this.open)
      this.button.classList.toggle("active", this.open)
  
      if (this.open) {
        this.notification.classList.remove("active")
        this.inputField.focus()
        this.scrollToBottom()
      }
    }
  
    addMessage(content, isUser = false) {
      const message = {
        content,
        isUser,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
  
      this.messages.push(message)
      this.renderMessage(message)
      this.scrollToBottom()
    }
  
    addBotMessage(content) {
      // Show typing indicator
      const typingIndicator = document.createElement("div")
      typingIndicator.className = "message bot"
      typingIndicator.innerHTML = `
        <div class="message-avatar">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </div>
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      `
  
      this.messagesContainer.appendChild(typingIndicator)
      this.scrollToBottom()
  
      // Remove typing indicator and add actual message after a delay
      setTimeout(() => {
        this.messagesContainer.removeChild(typingIndicator)
        this.addMessage(content, false)
      }, 1500)
    }
  
    renderMessage(message) {
      const messageElement = document.createElement("div")
      messageElement.className = `message ${message.isUser ? "user" : "bot"}`
  
      const avatar = message.isUser
        ? `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
             <circle cx="12" cy="7" r="4"></circle>
           </svg>`
        : `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
             <circle cx="12" cy="12" r="10"></circle>
             <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
             <line x1="9" y1="9" x2="9.01" y2="9"></line>
             <line x1="15" y1="9" x2="15.01" y2="9"></line>
           </svg>`
  
      messageElement.innerHTML = `
        <div class="message-avatar">
          ${avatar}
        </div>
        <div class="message-bubble">
          <div class="message-content">${message.content}</div>
          <div class="message-time">${message.time}</div>
        </div>
      `
  
      this.messagesContainer.appendChild(messageElement)
    }
  
    renderSuggestions() {
      this.suggestionsContainer.innerHTML = ""
  
      this.suggestions.forEach((suggestion) => {
        const chip = document.createElement("div")
        chip.className = "suggestion-chip"
        chip.textContent = suggestion
        chip.addEventListener("click", () => {
          this.inputField.value = suggestion
          this.sendMessage()
        })
  
        this.suggestionsContainer.appendChild(chip)
      })
    }
  
    sendMessage() {
      const content = this.inputField.value.trim()
      if (!content) return
  
      this.addMessage(content, true)
      this.inputField.value = ""
  
      // Process the message and get a response
      const response = this.processMessage(content)
      this.addBotMessage(response)
    }
  
    processMessage(message) {
      message = message.toLowerCase()
  
      if (message.includes("skill") || message.includes("know") || message.includes("do")) {
        return this.botResponses.skills
      } else if (message.includes("project") || message.includes("work") || message.includes("portfolio")) {
        return this.botResponses.projects
      } else if (
        message.includes("contact") ||
        message.includes("email") ||
        message.includes("phone") ||
        message.includes("reach")
      ) {
        return this.botResponses.contact
      } else if (message.includes("experience") || message.includes("background") || message.includes("history")) {
        return this.botResponses.experience
      } else if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
        return this.botResponses.greeting
      } else {
        return this.botResponses.default
      }
    }
  
    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight
    }
  
    resetChat() {
      this.messages = []
      this.messagesContainer.innerHTML = ""
      this.addBotMessage(this.botResponses.greeting)
      this.renderSuggestions()
    }
  }
  
  // Initialize chatbot when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    window.chatbot = new Chatbot()
  })
  