<template>
    <v-container>
      <v-card v-if="currentOrg" class="pa-4">
        <v-card-title>
          <span class="text-h5">Organization Details</span>
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Name:</v-list-item-title>
                <v-list-item-subtitle>{{ currentOrg.name }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>ID:</v-list-item-title>
                <v-list-item-subtitle>{{ currentOrg._id }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Description:</v-list-item-title>
                <v-list-item-subtitle>{{ currentOrg.description || 'No description available' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
      <v-alert v-else type="warning" dismissible>
        No organization selected. Please select an organization from the list.
      </v-alert>
    </v-container>
  </template>
  
  <script>
  export default {
    computed: {
      currentOrg() {
        return this.$store.getters.getCurrentOrg;
      },
    },
  };
  </script>