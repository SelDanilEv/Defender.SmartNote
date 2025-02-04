<template>
  <div class="login-page">
    <button @click="signIn" :disabled="isSigningIn">Sign in with Defender Portal</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import isLocal from '@/utils/isLocalHost';

export default {
  data() {
    return {
      isSigningIn: false,
    };
  },
  methods: {
    ...mapActions(['login']),
    signIn() {
      this.isSigningIn = true;

      setInterval(() => {
        if (portalTab.closed) {
          this.isSigningIn = false;
        }
      }, 1000);

      const currentUrl = window.location.origin;
      const basePortalUrl = isLocal ? "http://localhost:47053" : "https://portal.coded-by-danil.dev";
      const loginUrl = `${basePortalUrl}/welcome/login?SsoUrl=${currentUrl}`;
      const portalTab = window.open(loginUrl, '_blank');

      if (portalTab) {
        window.addEventListener("message", (event) => {
          if (event.origin !== basePortalUrl) return;

          const { token } = event.data;
          if (token) {

            this.login(token);

            portalTab.close();
            this.$router.push('/note');
          }
        });
      } else {
        console.error("Popup blocked! Allow popups for authentication.");
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  background-color: var(--primary-color);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

button {
  background-color: var(--accent-color);
  color: var(--primary-color);
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
}

button:disabled {
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: var(--link-hover-color);
}
</style>