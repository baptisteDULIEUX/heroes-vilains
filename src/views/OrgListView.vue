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

    <PhraseSecrete @success="handleSecretSuccess" @error="handleSecretError" />

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
import { mapGetters, mapActions } from 'vuex';

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
      dialog: false,
      newOrg: {
        name: '',
        secret: '',
      },
    };
  },
  computed: {
    ...mapGetters('app', ['getOrgNames', 'getCurrentOrg']),
    ...mapGetters('secret', ['getOrgPassword']),

    orgNames() {
      return this.getOrgNames;
    },
  },
  methods: {
    ...mapActions('app', ['fetchOrgNames', 'createOrg', 'fetchOrgById', 'selectOrganization']),
    ...mapActions('secret', ['updateOrgPassword']),

    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.newOrg = { name: '', secret: '' };
    },
    async createOrganization() {
      if (!this.newOrg.name || !this.newOrg.secret) {
        alert('Both fields are required.');
        return;
      }
      try {
        await this.createOrg(this.newOrg);
        this.closeDialog();
        await this.fetchOrgNames();
      } catch (error) {
        console.error('Error creating organization:', error);
      }
    },
    selectOrganization(org) {
      this.$router.push({
        name: 'orgDetail',
        params: {
          id: org._id
        }
      }).catch(err => {
        if (!err.message.includes('Avoided redundant navigation')) {
          console.error('Navigation error:', err)
        }
      })
    },
    handleSecretSuccess(message) {
      console.log(message);
    },
    handleSecretError(message) {
      console.error(message);
    },
  },
  async mounted() {
    await this.fetchOrgNames();
  },
};
</script>