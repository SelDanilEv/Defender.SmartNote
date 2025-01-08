<template>
  <AIChat />
</template>

<script>
import AIChat from "../components/AIChat.vue";

export default {
  components: { AIChat },
};
</script>

<style scoped>
.ai-view {
  padding: 20px;
  background-color: var(--secondary-color);
  color: var(--text-color);
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ai-view h1 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--accent-color);
}
</style>
