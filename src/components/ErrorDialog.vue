<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Erreur
      </v-card-title>
      <v-card-text>
        {{ errorMessage }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      errorMessage: '',
    };
  },
  methods: {
    show(message) {
      this.errorMessage = message;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>