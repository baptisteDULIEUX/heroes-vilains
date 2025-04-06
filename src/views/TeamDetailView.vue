<template>
  <v-container>
    <v-card v-if="currentTeamWithHeroes">
      <v-card-title>
        <span class="text-h5" v-if="currentTeamWithHeroes && currentTeamWithHeroes.name">Team: {{ currentTeamWithHeroes.name }}</span>
        <span class="text-h5" v-else>Team: Loading...</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="showAddMemberDialog = true">Add Member</v-btn>
      </v-card-title>

      <v-card-text>
        <v-data-table :headers="memberHeaders" :items="currentTeamWithHeroes.members" item-key="_id">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item[0].publicName }}</td>
              <td>{{ item[0].realName }}</td>
              <td>{{ item[0].powers ? item[0].powers.map(power => power.name).join(', ') : 'Aucun pouvoir' }}</td>
              <td>
                <v-btn color="primary" small @click="editMember(item)">Edit</v-btn>
                <v-btn color="red" small @click="deleteMember(item)">Delete</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-card v-else>
      <v-card-text>
        No team selected.
      </v-card-text>
    </v-card>

    <v-dialog v-model="showAddMemberDialog" max-width="500px">
      <v-card>
        <v-card-title>Add Member</v-card-title>
        <v-card-text>
          <v-radio-group v-model="addMemberType">
            <v-radio label="New Hero" value="new"></v-radio>
            <v-radio label="Existing Hero" value="existing"></v-radio>
          </v-radio-group>

          <div v-if="addMemberType === 'new'">
            <v-text-field v-model="newMember.name" label="Name"></v-text-field>
            <v-text-field v-model="newMember.alias" label="Alias"></v-text-field>
            <v-text-field v-model="newMember.power" label="Power"></v-text-field>
          </div>

          <v-select v-if="addMemberType === 'existing'" v-model="selectedHero" :items="availableHeroes" item-text="publicName" item-value="_id" label="Select Hero"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addMember">Add</v-btn>
          <v-btn @click="showAddMemberDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      showAddMemberDialog: false,
      addMemberType: 'new',
      newMember: { name: '', alias: '', power: '' },
      selectedHero: null,
      availableHeroesData: [],
      teamHeroes: [],
    };
  },
  computed: {
    currentTeam() {
      const team = this.$store.getters['app/getCurrentTeam'];
      console.log('Current team:', team);
      return team;
    },
    memberHeaders() {
      return [
        { text: 'Nom Public', value: 'publicName' },
        { text: 'Nom Réel', value: 'realName' },
        { text: 'Pouvoirs', value: 'powers' },
        { text: 'Actions', value: 'actions', sortable: false },
      ];
    },
    availableHeroes() {
      return this.availableHeroesData;
    },
    currentTeamWithHeroes() {
      if (!this.currentTeam) {
        return null;
      }
      return {
        ...this.currentTeam,
        members: this.teamHeroes,
      };
    },
    currentOrg() {
      const currentOrg = this.$store.getters['app/getCurrentOrg'];
      console.log("currentOrg:", currentOrg);
      return currentOrg;
    },
  },
  methods: {
    saveState() {
      console.log('Saving state:', this.currentOrg, this.currentTeam);

      if (this.currentOrg) {
        Cookies.set('currentOrg', JSON.stringify(this.currentOrg));
      } else {
        console.warn('currentOrg is null, not saving.');
      }

      if (this.currentTeam) {
        Cookies.set('currentTeam', JSON.stringify(this.currentTeam));
      } else {
        console.warn('currentTeam is null, not saving.');
      }
    },

    loadState() {
      try {
        const savedOrg = Cookies.get('currentOrg');
        const savedTeam = Cookies.get('currentTeam');

        console.log('Loading state:', savedOrg, savedTeam);

        if (savedOrg) {
          this.currentOrg = JSON.parse(savedOrg);
        }
        if (savedTeam) {
          this.currentTeam = JSON.parse(savedTeam);
        }

        console.log('Loaded state:', this.currentOrg, this.currentTeam);
      } catch (error) {
        console.error('Error loading state:', error);
      }
    },


    async getHeroedIdFromOrg() {
      let heroInfoList = [];

      if (this.currentOrg && this.currentOrg[0] && this.currentOrg[0].teams && this.currentTeam && this.currentTeam._id) {
        const team = this.currentOrg[0].teams.find(team => team._id === this.currentTeam._id);
        if (team && team.members) {
          for (const heroId of team.members) {
            try {
              const hero = await this.$store.dispatch('heroes/fetchHeroById', heroId);
              if (hero) {
                heroInfoList.push(hero);
              } else {
                console.error(`Héros avec l'ID ${heroId} non trouvé.`);
              }
            } catch (error) {
              console.error(`Erreur lors de la récupération du héros avec l'ID ${heroId}:`, error);
            }
          }
        } else {
          console.error("Équipe non trouvée ou membres non définis.");
        }
      } else {
        console.error("currentOrg, currentTeam ou une de leurs propriétés est undefined ou null.");
      }

      console.log("heroInfo list: ", heroInfoList);
      this.teamHeroes = heroInfoList;
      return heroInfoList;
    },

    async fetchHeroes() {
      try {
        const heroes = await this.$store.dispatch('heroes/fetchHeroes');
        this.availableHeroesData = heroes;
      } catch (error) {
        console.error('Error fetching heroes:', error);
      }
    },

    async fetchTeamHeroes() {
      try {
        if (!this.currentTeam || !this.currentTeam.members) {
          return;
        }

        const heroIds = this.currentTeam.members;

        const heroes = await Promise.all(
            heroIds.map(async heroId => {
              try {
                const hero = await this.$store.dispatch('heroes/fetchHeroById', heroId);
                if (Array.isArray(hero) && hero.length > 0) {
                  const heroData = hero[0];
                  const powers = heroData.powers.map(power => power.name).join(', ');
                  return { ...heroData, powers };
                } else if (hero) {
                  const powers = hero.powers.map(power => power.name);
                  return { ...hero, powers };
                }
                return null;
              } catch (error) {
                console.error(`Error fetching hero with ID ${heroId}:`, error);
                return null;
              }
            })
        );

        this.teamHeroes = heroes.filter(hero => hero !== null);
      } catch (error) {
        console.error('Error fetching team heroes:', error);
      }
    },

    addMember() {
      const teamId = this.currentTeam._id;
      let heroId = this.selectedHero;

      if (this.addMemberType === 'new') {
        heroId = uuidv4();
        const newHero = {
          _id: heroId,
          name: this.newMember.name,
          alias: this.newMember.alias,
          powers: [this.newMember.power],
        };
        this.$store.dispatch('heroes/addHeroToTeam', { teamId, heroId })
            .then(() => {
              this.showAddMemberDialog = false;
              this.selectedHero = null;
              this.availableHeroesData.push(newHero);
              this.getHeroedIdFromOrg();
            })
            .catch(error => {
              console.error('Error adding hero to team:', error);
            });
      } else if (this.addMemberType === 'existing') {
        this.$store.dispatch('heroes/addHeroToTeam', { teamId, heroId })
            .then(() => {
              const existingHero = this.availableHeroesData.find(hero => hero._id === heroId);
              if (existingHero) {
                console.log('Hero found:', existingHero);
                this.availableHeroesData.push(existingHero);
              }
              this.showAddMemberDialog = false;
              this.selectedHero = null;
              this.getHeroedIdFromOrg();
            })
            .catch(error => {
              console.error('Error adding hero to team:', error);
            });
      }
    },

    deleteMember(item) {
      const teamId = this.currentTeam._id;
      const heroId = item[0]._id;

      this.$store.dispatch('heroes/removeHeroFromTeam', { teamId, heroId })
          .then(() => {
            this.availableHeroesData = this.availableHeroesData.filter(hero => hero._id !== heroId);
            this.teamHeroes = this.teamHeroes.filter(hero => hero._id !== heroId);
            this.getHeroedIdFromOrg();
          })
          .catch(error => {
            console.error('Error deleting hero:', error);
          });
    },
  },
  mounted() {
    this.loadState();
    this.getHeroedIdFromOrg();
    console.log('Route params teamId:', this.$route.params.id);
    if (this.$route.params.id) {
      this.$store.dispatch('app/selectTeam', this.$route.params.id);
      this.fetchHeroes();
      this.fetchTeamHeroes();
    } else {
      console.error('Team ID is undefined.');
    }
  },
  watch: {
    currentOrg: 'saveState',
    currentTeam: 'saveState',
  },
};
</script>