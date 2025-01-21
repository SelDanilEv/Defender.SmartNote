<template>
  <div class="ai-chat">
    <div class="header">
      <h2>Ask AI</h2>
      <label v-if="isLocal">
        <input type="checkbox" v-model="debugMode" />
        Debug Mode
      </label>
    </div>
    <form @submit.prevent="askAI">
      <textarea v-model="prompt" placeholder="Ask AI anything related to your notes ..." required></textarea>
      <button type="submit" :disabled="loading">Ask</button>
    </form>
    <div v-if="loading" class="progress-bar">
      <div class="progress"></div>
    </div>
    <div v-if="response" class="response-panel">
      <p>{{ response }}</p>
    </div>
    <div v-if="debugMode && debugInfo" class="response-panel">
      <p>{{ debugInfo }}</p>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import isLocal from "@/utils/isLocalHost";

export default {
  data() {
    return {
      prompt: "",
      response: "",
      loading: false,
      debugMode: false,
      debugInfo: null,
      isLocal: isLocal,
    };
  },
  methods: {
    async askAI() {

      let backendUrl = `/note/askAI`;
      if (this.debugMode) {
        backendUrl += "/debug";
      }

      this.loading = true;
      const result = await axiosInstance.post(backendUrl, {
        prompt: this.prompt,
      });
      if (this.debugMode) {
        this.debugInfo = result.data;
      }
      else {
        this.response = result.data.answer;
      }
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
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.ai-chat h2 {
  margin: 0;
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

.debug-panel {
  margin-top: 20px;
  padding: 15px;
  background-color: var(--secondary-color);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: var(--text-color);
  white-space: wrap;
}
</style>
