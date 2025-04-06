<template>
  <div>
    <h2>Connexion</h2>
    <input v-model="login" type="text" placeholder="Login" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button @click="loginUser">Se connecter</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import AuthService from '@/services/auth.service';

export default {
  name: 'UserLogin',
  data() {
    return {
      login: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await AuthService.login(this.login, this.password);
        console.log('UserLogin successful:', response);
        localStorage.setItem('xsrfToken', response.data.xsrfToken);
        // Gérer le rafraîchissement du JWT si nécessaire
        this.$router.push('/'); // Rediriger vers la page d'accueil
      } catch (error) {
        console.error('UserLogin failed:', error);
        this.error = error.response.data.data;
      }
    },

    async getUserInfo() {
      try {
        const response = await AuthService.getUser(this.login);
        console.log('User info:', response);
      } catch (error) {
        console.error('Error getting user info:', error);
      }
    },
  },
};
</script>