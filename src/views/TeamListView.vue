<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Liste des Équipes</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openCreateTeamDialog">Créer une équipe</v-btn>
      </v-card-title>
      <v-card-text>
        <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
        <v-data-table
            v-else
            :headers="headers"
            :items="teams"
            item-value="id"
            class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item._id }}</td>
              <td>{{ item.nbAffiliations }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="createTeamDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Créer une nouvelle équipe</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="newTeam.name"
              label="Nom de l'équipe"
              outlined
              required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="createTeam">Créer</v-btn>
          <v-btn color="red darken-1" text @click="closeCreateTeamDialog">Annuler</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'TeamListView',
  data() {
    return {
      loading: true,
      headers: [
        { text: 'Nom de l\'équipe', value: 'name' },
        { text: 'ID de l\'équipe', value: 'id' },
        { text: 'Nombre affiliations', value: 'nbAffiliations' },
      ],
      createTeamDialog: false,
      newTeam: {
        name: '',
      },
    };
  },
  computed: {
    teams() {
      console.log("teams: " + this.$store.getters.getTeams.data);
      return this.$store.getters.getTeams;
    },
  },
  methods: {
    async fetchTeams() {
      try {
        await this.$store.dispatch('fetchTeams');
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    openCreateTeamDialog() {
      this.createTeamDialog = true;
    },

    closeCreateTeamDialog() {
      this.createTeamDialog = false;
      this.newTeamName = '';
    },

    async createTeam() {
      try{
        await this.$store.dispatch('createTeam', this.newTeam);
        this.closeCreateTeamDialog();
        await this.fetchTeams();
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    this.fetchTeams();
  },
};
</script>