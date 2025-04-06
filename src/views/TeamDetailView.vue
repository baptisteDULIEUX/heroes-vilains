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
              <td>{{ item.publicName }}</td>
              <td>{{ item.realName }}</td>
              <td>{{ item.powers }}</td>
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
      const team = this.$store.getters.getCurrentTeam;
      console.log('getter currentTeam:', team);
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
      console.log('availableHeroes: ', this.availableHeroesData);
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
  },
  methods: {
    async fetchHeroes() {
      try {
        const heroes = await this.$store.dispatch('fetchHeroes');
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
                const hero = await this.$store.dispatch('fetchHeroById', heroId);
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
        this.$store.dispatch('addHeroToTeam', { teamId, heroId })
            .then(() => {
              this.showAddMemberDialog = false;
              this.selectedHero = null;
              this.availableHeroesData.push(newHero);
              this.fetchTeamHeroes();
            })
            .catch(error => {
              console.error('Error adding hero to team:', error);
            });
      } else if (this.addMemberType === 'existing') {
        this.$store.dispatch('addHeroToTeam', { teamId, heroId })
            .then(() => {
              const existingHero = this.availableHeroesData.find(hero => hero._id === heroId);
              if (existingHero) {
                this.availableHeroesData.push(existingHero); // Ajouter l'objet complet du héros
              }
              this.showAddMemberDialog = false;
              this.selectedHero = null;
              this.fetchTeamHeroes();
            })
            .catch(error => {
              console.error('Error adding hero to team:', error);
            });
      }
    },

    deleteMember(item) {
      const teamId = this.currentTeam._id;
      const heroId = item._id;

      this.$store.dispatch('removeHeroFromTeam', { teamId, heroId })
          .then(() => {
            this.availableHeroesData = this.availableHeroesData.filter(hero => hero._id !== heroId);
            this.teamHeroes = this.teamHeroes.filter(hero => hero._id !== heroId);
            this.fetchTeamHeroes();
          })
          .catch(error => {
            console.error('Error deleting hero:', error);
          });
    },
  },
  mounted() {
    this.fetchHeroes();
    this.fetchTeamHeroes();
  },
};
</script>