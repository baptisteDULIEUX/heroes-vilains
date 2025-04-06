<template>
    <v-container>
        <v-card>
            <v-card-title>
                <span class="text-h5">Liste des Héros</span>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="openCreateHeroDialog">Créer un Héros</v-btn>
            </v-card-title>
            <v-card-text>
                <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
                <v-data-table
                        v-else
                        :headers="headers"
                        :items="heroAliases"
                        item-value="_id"
                        class="elevation-1"
                >
                    <template v-slot:item="{ item }">
                        <tr @click="selectHero(item)">
                            <td>{{ item.publicName }}</td>
                            <td>{{ item._id }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <v-dialog v-model="createHeroDialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Créer un nouveau Héros</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                            v-model="newHero.publicName"
                            label="Nom Public"
                            outlined
                            required
                    ></v-text-field>
                    <v-text-field
                            v-model="newHero.realName"
                            label="Nom Réel"
                            outlined
                    ></v-text-field>

                    <v-subheader>Pouvoirs (Optionnel)</v-subheader>
                    <v-row v-for="(power, index) in newHero.powers" :key="index" align="center">
                        <v-col cols="4">
                            <v-text-field
                                    v-model="power.name"
                                    label="Nom du Pouvoir"
                                    outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-select
                                    v-model="power.type"
                                    :items="powerTypes"
                                    label="Type"
                                    outlined
                            ></v-select>
                        </v-col>
                        <v-col cols="3">
                            <v-slider
                                    v-model="power.level"
                                    label="Niveau"
                                    min="0"
                                    max="100"
                                    thumb-label="always"
                            ></v-slider>
                        </v-col>
                        <v-col cols="2">
                            <v-btn icon @click="removePower(index)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-btn color="primary" @click="addPower">Ajouter un Pouvoir</v-btn>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="createHero">Créer</v-btn>
                    <v-btn color="red darken-1" text @click="closeCreateHeroDialog">Annuler</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
export default {
    name: 'HeroListView',
    data() {
        return {
            loading: true,
            headers: [
                { text: 'Nom Public', value: 'publicName' },
                { text: 'ID', value: '_id' },
            ],
            createHeroDialog: false,
            newHero: {
                publicName: '',
                realName: '',
                powers: [],
            },
            powerTypes: [
                { value: 1, text: 'force' },
                { value: 2, text: 'vitesse' },
                { value: 3, text: 'endurance' },
                { value: 4, text: 'magie' },
                { value: 5, text: 'effrayant' },
                { value: 6, text: 'furtivité' },
                { value: 7, text: 'stupidité' },
            ],
        };
    },
    computed: {
        heroAliases() {
            return this.$store.getters.getHeroAliases;
        },
    },
    methods: {
        async fetchHeroes() {
            try {
                await this.$store.dispatch('fetchHeroes');
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        openCreateHeroDialog() {
            this.createHeroDialog = true;
            this.resetNewHeroForm();
        },

        closeCreateHeroDialog() {
            this.createHeroDialog = false;
            this.resetNewHeroForm();
        },

        resetNewHeroForm() {
            this.newHero = {
                publicName: '',
                realName: '',
                powers: [],
            };
        },

        addPower() {
            this.newHero.powers.push({ name: '', type: null, level: 50 });
        },

        removePower(index) {
            this.newHero.powers.splice(index, 1);
        },

        async createHero() {
            try {
                await this.$store.dispatch('createHero', this.newHero);
                this.closeCreateHeroDialog();
                await this.fetchHeroes();
                this.$router.push('/heroes/' + this.newHero._id); // Rediriger vers les détails (si vous avez une route)
            } catch (error) {
                console.error('Erreur lors de la création du héros:', error);
                // Gérer l'erreur (afficher un message à l'utilisateur, etc.)
            }
        },

        selectHero(hero) {
            this.$router.push('/heroes/' + hero._id); // Naviguer vers la page de détails du héros
        },
    },
    mounted() {
        this.fetchHeroes();
    },
};
</script>