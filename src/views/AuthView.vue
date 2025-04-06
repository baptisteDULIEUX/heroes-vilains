<template>
  <div class="auth-container">
    <h1>Authentification</h1>
    <UserLogin />
  </div>
</template>

<script>
import UserLogin from '@/components/UserLogin.vue';

export default {
  components: {
    UserLogin: UserLogin,
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>