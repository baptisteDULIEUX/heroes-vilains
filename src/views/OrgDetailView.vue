<template>
    <v-container>
      <!-- Boîte de dialogue pour signaler qu'il n'y a rien à afficher -->
      <v-dialog v-model="noOrgDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">No Organization Found</span>
          </v-card-title>
          <v-card-text>
            The organization could not be loaded. Please check the secret or try again.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="goBackToList">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Affichage des détails de l'organisation -->
      <v-card v-if="currentOrg" class="pa-4">
        <v-card-title>
          <span class="text-h5">Organization: {{ currentOrg[0].name }}</span>
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>ID:</v-list-item-title>
                <v-list-item-subtitle>{{ currentOrg[0]._id}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
  
        <!-- Liste des équipes -->
        <v-card-subtitle>Teams</v-card-subtitle>
        <v-data-table
          :headers="teamHeaders"
          :items="currentOrg[0].teams"
          item-value="_id"
          class="elevation-1"
        >
          <template v-slot:body="{ items }">
            <tr v-for="team in items" :key="team._id">
              <td>{{ team.name }}</td>
              <td>
                <v-btn color="primary" small @click="selectTeam(team)">Select</v-btn>
                <v-btn color="red" small @click="confirmDeleteTeam(team)">Delete</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
  
        <!-- Bouton pour ajouter une équipe -->
        <v-card-actions>
          <v-btn color="primary" @click="toggleAddTeam">Add Team</v-btn>
        </v-card-actions>
  
        <!-- Liste déroulante pour ajouter une équipe -->
        <v-card v-if="showAddTeam" class="pa-4">
          <v-select
            v-model="selectedTeam"
            :items="recruitableTeams"
            item-text="name"
            item-value="_id"
            label="Select a team to add"
            outlined
          ></v-select>
          <v-card-actions>
            <v-btn :disabled="!selectedTeam" color="primary" @click="addTeam">Validate</v-btn>
            <v-btn color="red" @click="cancelAddTeam">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-container>
  </template>

<script>
export default {
  data() {
    return {
      noOrgDialog: false,
      showAddTeam: false,
      selectedTeam: null,
      filteredTeams: [], // Variable pour stocker les équipes filtrées
    };
  },
  computed: {
    currentOrg() {
      console.log(`getter orgDetail: ${this.$store.getters.getCurrentOrg}`);
      return this.$store.getters.getCurrentOrg;
    },
    recruitableTeams() {
      console.log('filteredTeams: ', this.filteredTeams);
      return this.filteredTeams; // Utilise la variable locale
    },
    teamHeaders() {
      return [
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ];
    },
  },
  methods: {
    async fetchOrganization() {
      try {
        const orgId = this.$store.getters.getCurrentOrg.orgId;
        const orgSecret = this.$store.getters.getOrgPassword;
        console.log('secret fetchOrg: ' + orgId);
        await this.$store.dispatch('fetchOrgById', { orgId, orgSecret });
        if (!this.currentOrg) {
          this.noOrgDialog = true;
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
        this.noOrgDialog = true;
      }
    },
    async fetchTeams() {
      try {
        await this.$store.dispatch('fetchTeams');
        // Filtre les équipes et met à jour filteredTeams
        if (this.$store.getters.getTeams) {
          this.filteredTeams = this.$store.getters.getTeams.filter(team => team.nbAffiliations == 0);
        } else {
          this.filteredTeams = [];
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    },
    goBackToList() {
      this.$router.push('/organizations');
    },
    selectTeam(team) {
      console.log('team: ' + team);
      this.$store.dispatch('selectTeam', team);
      this.$router.push(`/teams/${team._id}`);
    },
    confirmDeleteTeam(team) {
      if (confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
        this.$store.dispatch('deleteTeamFromOrg', {
          orgId: this.currentOrg[0]._id,
          orgSecret: this.$store.getters.getOrgPassword,
          teamId: team._id,
        });
      }
    },
    toggleAddTeam() {
      this.showAddTeam = !this.showAddTeam;
    },
    addTeam() {
      this.$store.dispatch('addTeamToOrg', {
        orgId: this.currentOrg[0]._id,
        orgSecret: this.$store.getters.getOrgPassword,
        teamId: this.selectedTeam,
      }).then(() => {
        this.selectedTeam = null;
        this.showAddTeam = false;
        this.fetchTeams(); // Met à jour les équipes après l'ajout
      });
    },
    cancelAddTeam() {
      this.selectedTeam = null;
      this.showAddTeam = false;
    },
  },
  mounted() {
    this.fetchTeams(); // Appel initial de fetchTeams
    this.fetchOrganization();
  },
};
</script>