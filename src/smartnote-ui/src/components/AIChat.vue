<template>
  <div class="ai-chat">
    <h2>Ask AI</h2>
    <form @submit.prevent="askAI">
      <textarea v-model="prompt" placeholder="Ask AI anything..." required></textarea>
      <button type="submit" :disabled="loading">Ask</button>
    </form>
    <div v-if="loading" class="progress-bar">
      <div class="progress"></div>
    </div>
    <div v-if="response" class="response-panel">
      <p>{{ response }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      prompt: "",
      response: "",
      loading: false,
    };
  },
  methods: {
    async askAI() {
      this.loading = true;
      const userId = "user123"; // Replace with actual user ID
      const result = await axios.post(`/api/notes/askAI`, {
        userId,
        prompt: this.prompt,
      });
      this.response = result.data.text;
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.ai-chat {
  background-color: var(--primary-color);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ai-chat h2 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--accent-color);
}

.ai-chat form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-chat textarea {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--secondary-color);
  color: var(--text-color);
  resize: vertical;
}

.ai-chat button {
  background-color: var(--accent-color);
  color: var(--primary-color);
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.ai-chat button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

.ai-chat button:hover:enabled {
  background-color: var(--link-hover-color);
}

.progress-bar {
  margin-top: 10px;
  height: 4px;
  background-color: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  width: 100%;
  height: 100%;
  background-color: var(--accent-color);
  animation: progress-animation 2s infinite;
}

@keyframes progress-animation {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.response-panel {
  margin-top: 20px;
  padding: 15px;
  background-color: var(--secondary-color);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.response-panel p {
  margin: 0;
  color: var(--text-color);
}
</style>
