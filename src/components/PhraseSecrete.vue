<template>
    <v-card class="pa-4">
      <v-card-title>Enter Secret Phrase</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="secretPhrase"
          label="Secret Phrase"
          outlined
          clearable
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveSecret">Save</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  export default {
    data() {
      return {
        secretPhrase: '',
      };
    },
    methods: {
      saveSecret() {
        if (this.secretPhrase.trim() === '') {
          this.$emit('error', 'Secret phrase cannot be empty.');
          return;
        }
        this.$store.dispatch('updateOrgPassword', this.secretPhrase);
        this.$emit('success', 'Secret phrase saved successfully.');
      },
    },
  };
  </script>
  