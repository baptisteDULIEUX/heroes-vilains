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
                <v-btn color="primary" small @click.stop="selectTeam(team)">Select</v-btn>
                <v-btn color="red" small @click.stop="confirmDeleteTeam(team)">Delete</v-btn>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      noOrgDialog: false,
      showAddTeam: false,
      selectedTeam: null,
      filteredTeams: [],
      teamHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    ...mapGetters('app', ['getCurrentOrg', 'getTeams']),
    ...mapGetters('secret', ['getOrgPassword']),

    currentOrg() {
      return this.getCurrentOrg
    },
    recruitableTeams() {
      return this.filteredTeams
    }
  },
  watch: {
    // Réagit aux changements d'ID dans l'URL
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.loadOrganizationData()
        }
      }
    }
  },
  methods: {
    ...mapActions('app', ['fetchOrgById', 'fetchTeams', 'selectTeam']),
    ...mapActions('secret', ['addTeamToOrg', 'deleteTeamFromOrg']),

    async loadOrganizationData() {
      try {
        const orgId = this.$route.params.id
        const orgSecret = this.getOrgPassword

        if (!orgId || !orgSecret) {
          throw new Error('Missing required parameters')
        }

        await this.fetchOrgById({ orgId, orgSecret })

        if (!this.currentOrg) {
          this.noOrgDialog = true
        }

        await this.fetchTeams()
        this.filterTeams()
      } catch (error) {
        console.error('Error loading organization:', error)
        this.noOrgDialog = true
      }
    },

    filterTeams() {
      this.filteredTeams = this.getTeams
          ? this.getTeams.filter(team => team.nbAffiliations === 0)
          : []
    },

    goBackToList() {
      this.$router.push('/organizations')
    },

    async selectTeam(team) {
      try {
        // Sauvegarde dans le store
        await this.$store.dispatch('app/selectTeam', team);

        // Navigation
        if (this.$route.params.id !== team._id) {
          await this.$router.push(`/teams/${team._id}`);
        }
      } catch (error) {
        console.error('Failed to select team:', error);
        this.$store.dispatch('errors/setError', 'Cette équipe n\'existe pas');
      }
    },

    async confirmDeleteTeam(team) {
      if (confirm(`Delete team "${team.name}"?`)) {
        try {
          await this.deleteTeamFromOrg({
            orgId: this.currentOrg._id,
            orgSecret: this.getOrgPassword,
            teamId: team._id
          })
          await this.fetchTeams()
          this.filterTeams()
        } catch (error) {
          console.error('Delete failed:', error)
        }
      }
    },

    toggleAddTeam() {
      this.showAddTeam = !this.showAddTeam
      if (this.showAddTeam) {
        this.filterTeams()
      }
    },

    async addTeam() {
      try {
        await this.addTeamToOrg({
          orgId: this.currentOrg._id,
          orgSecret: this.getOrgPassword,
          teamId: this.selectedTeam
        })

        this.selectedTeam = null
        this.showAddTeam = false
        await this.fetchTeams()
        this.filterTeams()
      } catch (error) {
        console.error('Add team failed:', error)
      }
    },

    cancelAddTeam() {
      this.selectedTeam = null
      this.showAddTeam = false
    }
  },
  async created() {
    await this.loadOrganizationData()
  }
}
</script>