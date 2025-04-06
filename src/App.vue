<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link to="/">Home</router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link to="/auth">Auth</router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-domain</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link to="/organizations">Organizations</router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account-group</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link to="/teams">Teams</router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="authenticate">Authenticate</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <error-dialog ref="errorDialog" />
  </v-app>
</template>

<script>
import ErrorDialog from '@/components/ErrorDialog.vue';


export default {
  data() {
    return {
      drawer: false, 
    };
  },
  components: {
    ErrorDialog,
  },
  methods: {
    authenticate() {
      this.$router.push('/auth'); 
    },

    showError(message) {
      this.$refs.ErrorDialog.show(message);
    },
  },

  provide: {
    showError: function() {
      return this.showError;
    },
  }
};
</script>

<style>

</style>