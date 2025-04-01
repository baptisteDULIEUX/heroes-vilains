<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Organizations</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openDialog">Create Organization</v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="orgNames"
          item-value="_id"
          class="elevation-1"
          @click:row="selectOrganization"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Organizations</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Composant pour saisir la phrase secrète -->
    <PhraseSecrete @success="handleSecretSuccess" @error="handleSecretError" />

    <!-- Dialog for creating a new organization -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Create New Organization</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newOrg.name"
            label="Organization Name"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="newOrg.secret"
            label="Secret Phrase"
            outlined
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="createOrganization">Create</v-btn>
          <v-btn color="red darken-1" text @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PhraseSecrete from '@/components/PhraseSecrete.vue';

export default {
  components: {
    PhraseSecrete,
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'ID', value: '_id' },
      ],
      dialog: false, // Contrôle la visibilité de la boîte de dialogue
      newOrg: {
        name: '',
        secret: '',
      },
    };
  },
  computed: {
    orgNames() {
      return this.$store.getters.getOrgNames; // Récupère la liste des organisations depuis le store
    },
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.newOrg.name = '';
      this.newOrg.secret = '';
    },
    async createOrganization() {
      if (!this.newOrg.name || !this.newOrg.secret) {
        alert('Both fields are required.');
        return;
      }
      try {
        await this.$store.dispatch('createOrg', this.newOrg); // Crée une nouvelle organisation via le store
        this.closeDialog();
        await this.$store.dispatch('fetchOrgNames'); // Rafraîchit la liste des organisations
      } catch (error) {
        console.error('Error creating organization:', error);
      }
    },
    async selectOrganization(org) {
      try {
        const secret = this.$store.getters.getOrgPassword; // Récupère la phrase secrète de l'organisation
        console.log('Secret:', secret);
        await this.$store.dispatch('fetchOrgById', {orgId: org._id,orgSecret: secret}); // Récupère les détails de l'organisation sélectionnée
        this.$router.push(`/organizations/${org._id}`); // Navigue vers la page de détails de l'organisation
      } catch (error) {
        console.error('Error fetching organization details:', error);
      }
    },
    handleSecretSuccess(message) {
      console.log(message); // Affiche un message de succès
    },
    handleSecretError(message) {
      console.error(message); // Affiche un message d'erreur
    },
  },
  mounted() {
    this.$store.dispatch('fetchOrgNames'); // Récupère la liste des organisations lors du montage du composant
  },
};
</script>