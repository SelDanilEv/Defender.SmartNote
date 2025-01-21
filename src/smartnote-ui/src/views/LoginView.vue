<template>
  <SignInButton />
</template>

<script>
import SignInButton from '@/components/SignInButton.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    SignInButton,
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.login(token);
      window.close();
    }

    if (localStorage.getItem('token')) {
      this.login(localStorage.getItem('token'));
    }
  },
  methods: {
    ...mapActions(['login']),
  },
};
</script>
