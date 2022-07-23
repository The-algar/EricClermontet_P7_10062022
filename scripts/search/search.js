import Recipe from "../model/Recipe.js";

export default class RecipeService {
    constructor() {
        this.recipes = [];
        this.filteredRecipes = [];
    }

    /* Récupération data fetch: tableau recette -> tableau instance recette  */
    async fetchData() {
        return fetch("data/recipes.json")  // Promise résolue: serveur répond
            .then((response) => {        // Promise résolue: data chargée  
                return response.json();
            })
            .then(({ recipes }) => {      // Promise résolue: retourne data
                // Recipes ->  [{..}, {..},] 50 objets recette
                // Mise à jour propriété class -> 50 instance de class Recipe
                this.recipes = recipes.map((objRecipe) => {
                    const recipesInst = new Recipe(objRecipe);
                    return recipesInst;
                });
            })
    }

    // Extrait liste ingrédients du tableau recette complet ou filtré
    // Si recherche filtre -> filte ingrédients qui match avec saisie
    getIngredientsList(filteredRecipes, exclusionList, entryIngredient) {

        // Transformation array d'objet recette -> array de liste d'ingrédients
        // map sur filteredRecipes si existe, sinon sur tableau recettes non modifié
        let listIngredients = (filteredRecipes || this.recipes).map((objRecette) => {
            return objRecette.ingredients.map((objIngredient) => {
                return objIngredient.ingredient.toLowerCase()
            });
        });
        // Array d'array liste -> array string liste, supprime 1 imbrication    
        listIngredients = listIngredients.flat();

        // Obj Set -> supprime doublons, spread [... set] conversion set -> array
        listIngredients = [... new Set(listIngredients)];

        //Filtre l'array de string ingrédients en fonction de la recherche saisie
        /*if (entryIngredient) {
            listIngredients = listIngredients.filter((el) => {
                return el.indexOf(entryIngredient.toLowerCase()) > -1
            });
        } */

        // Formatage liste
        listIngredients = this.formateList(listIngredients);

        // Supression des noms tags de la liste via liste d'exclusion
        if (exclusionList) {
            exclusionList.forEach((el) => {
                listIngredients.splice(listIngredients.indexOf(el), 1);
            })
        }
        return listIngredients
    }

    getAppareilsList(filteredRecipes, exclusionList, entryAppareil) {

        // Transformation array d'objet recette -> array de liste d'appareils
        let listAppareils = (filteredRecipes || this.recipes).map((el) => {
            return el.appliance.toLowerCase()
        })

        // Formatage liste
        // Obj Set -> supprime doublons, spread [... set] conversion set -> array
        listAppareils = [... new Set(listAppareils)];

        //Filtre l'array de string Appareil en fonction de la recherche saisie
        /* if (entryAppareil) {
            listAppareils = listAppareil.filter((el) => {
                return el.indexOf(entryAppareil.toLowerCase()) > -1
            });
        }
        */

        // Formatage liste
        listAppareils = this.formateList(listAppareils)

        // Liste exclusion tags
        if (exclusionList) {
            exclusionList.forEach((el) => {
                listAppareils.splice(listAppareils.indexOf(el), 1);
            })
        }

        return listAppareils
    }

    getUstensilList(filteredRecipes, exclusionList, entryUstensil) {

        // Transformation array d'objet recette -> array de liste d'appareils
        let listUstensils = (filteredRecipes || this.recipes).map((el) => {
            return el.ustensils.map((el) => {
                return el.toLowerCase();
            })
        })

        // Formatage liste
        listUstensils = listUstensils.flat();

        // Obj Set -> supprime doublons, spread [... set] conversion set -> array
        listUstensils = [... new Set(listUstensils)];

        //Filtre l'array de string Ustensil en fonction de la recherche saisie
        /* if (entryUstensil) {
            listUstensils = listUstensil.filter((el) => {
                return el.indexOf(entryUstensil.toLowerCase()) > -1
            });
        }
        */

        // Formatage liste
        listUstensils = this.formateList(listUstensils);

        // Liste exclusion tags
        if (exclusionList) {
            exclusionList.forEach((el) => {
                listUstensils.splice(listUstensils.indexOf(el), 1);
            })
        }

        return listUstensils
    }

    // Formatage liste
    formateList(list) {
        // Ajoute une maj sur 1er caractère
        list = list.map((el) => {
            return el[0].toUpperCase() + el.slice(1)
        })
        // Retourne liste classée dans l'ordre alphabétique
        return list.sort((a, b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0
        })
    }

    // Filtre du tableau de recettes
    filterRecipes(filterType, tagName, filteredRecipes) {
        if (filterType === "ingredientList") {
            filteredRecipes = filteredRecipes.filter((objRecipe) => {
                return objRecipe.ingredients.find((el) => {
                    return el.ingredient.toLowerCase() === tagName.toLowerCase();
                })
            })
        } else if (filterType === "appareilList") {
            filteredRecipes = filteredRecipes.filter((el) => {
                return el.appliance.toLowerCase() === tagName.toLowerCase();
            })
        } else if (filterType === "ustensilList") {
            filteredRecipes = filteredRecipes.filter((el) => {
                return el.ustensils.find((el) => {
                    return el.toLowerCase() === tagName.toLowerCase();
                })
            })
        }
        return filteredRecipes;
    }





















    rechercheGlobale(saisie) {
        const saisieLow = saisie.toLowerCase();
        const arrayRecipeFiltered = [];
        this.recipes.forEach((instRecipe) => {
            const nameLow = instRecipe.name.toLowerCase();
            const descriptionLow = instRecipe.description.toLowerCase();

            if (nameLow.includes(saisieLow)) {
                arrayRecipeFiltered.push(instRecipe)
            }
            else if (descriptionLow.includes(saisieLow)) {
                arrayRecipeFiltered.push(instRecipe)
            }
            else {
                instRecipe.ingredients.forEach((ingredients) => {
                    // ingredients = {ingre: "kiwi", quantity:, unit:}
                    const ingredientLow = ingredients.ingredient.toLowerCase();
                    if (ingredientLow.includes(saisieLow)) {
                        arrayRecipeFiltered.push(instRecipe)
                    }
                })
            }
        })
        return arrayRecipeFiltered
    }




}