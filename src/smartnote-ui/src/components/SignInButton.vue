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
      const currentUrl = window.location.origin;
      const loginUrl = `https://${isLocal ? "localhost:47053" : "portal.coded-by-danil.dev"}/welcome/login?SsoUrl=${currentUrl}/login`;
      const portalTab = window.open(loginUrl, '_blank');

      const checkAuth = setInterval(() => {
        if (localStorage.getItem('token')) {
          clearInterval(checkAuth);
          portalTab.close();
          this.login(localStorage.getItem('token'));
          this.$router.push('/note');
        }
      }, 2000);
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