import Recipe from "../model/Recipe.js";

export default class RecipeSearch {
    constructor() {
        this.recipes = [];
    }

    /* Récupération data fetch: tableau recette -> tableau instance recette  */
    async fetchData() {
        return fetch("data/recipes.json")  // Promise résolue: serveur répond
            .then((response) => {          // Promise résolue: data chargée  
                return response.json();
            })
            .then(({ recipes }) => {       // Promise résolue: retourne data
                // Recipes ->  [{..}, {..},] 50 objets recette
                // Mise à jour propriété class -> 50 instance de class Recipe
                this.recipes = recipes.map((objRecipe) => {
                    const recipesInst = new Recipe(objRecipe);
                    return recipesInst;
                });
            })
    }

    // Retourne liste d'ingrédients du tableau recette
    // Si recherche filtre -> filtre ingrédients qui match avec recherche
    getIngredientsList(filteredRecipes, exclusionList, entry) {

        // Transformation array d'objet recette -> array de liste d'ingrédients
        // map sur filteredRecipes si existe, sinon sur tableau recettes non modifié
        let listIngredients = (filteredRecipes || this.recipes).map((objRecipe) => {
            return objRecipe.ingredients.map((objIngredient) => {
                return objIngredient.ingredient.toLowerCase()
            });
        });
        // Array d'array liste -> array string liste, supprime 1 imbrication    
        listIngredients = listIngredients.flat();

        // Obj Set -> supprime doublons, spread [... set] conversion set -> array
        listIngredients = [... new Set(listIngredients)];

        console.log(entry);
        console.log(listIngredients);

        //Filtre l'array de string ingrédients en fonction de la recherche
        if (entry) {
            listIngredients = this.filterListBySearchEntry(listIngredients, entry)
        }
        console.log(listIngredients);

        // Formatage liste
        listIngredients = this.formateList(listIngredients);
        console.log(exclusionList);
        // Supression des noms tags de la liste via liste d'exclusion
        if (exclusionList) {
            exclusionList.forEach((el) => {
                // Si l'élément existe, le retirer de la liste
                if (listIngredients.indexOf(el) !== -1) {
                    listIngredients.splice(listIngredients.indexOf(el), 1);
                }
            })
        }

        console.log(listIngredients);
        return listIngredients
    }

    // Retourne liste d'appareils du tableau recette
    getAppareilsList(filteredRecipes, exclusionList, entry) {

        // Transformation array d'objet recette -> array de liste d'appareils
        let listAppareils = (filteredRecipes || this.recipes).map((el) => {
            return el.appliance.toLowerCase()
        })

        // Obj Set -> supprime doublons, spread [... set] conversion set -> array
        listAppareils = [... new Set(listAppareils)];

        //Filtre l'array de string Appareil en fonction de la recherche
        if (entry) {
            listAppareils = this.filterListBySearchEntry(listAppareils, entry)
        }

        // Formatage liste
        listAppareils = this.formateList(listAppareils)

        // Liste exclusion tags
        if (exclusionList) {
            exclusionList.forEach((el) => {
                // Si l'élément existe, le retirer de la liste
                if (listAppareils.indexOf(el) !== -1) {
                    listAppareils.splice(listAppareils.indexOf(el), 1);
                }
            })
        }

        return listAppareils
    }

    // Retourne liste d'ustensiles du tableau recette
    getUstensilList(filteredRecipes, exclusionList, entry) {

        // Transformation array d'objet recette -> array de liste d'appareils
        let listUstensils = (filteredRecipes || this.recipes).map((el) => {
            return el.ustensils.map((el) => {
                return el.toLowerCase();
            })
        })

        // Supprime l'imbrication en créant un nouveau tableau avec tous les éléments des sous tableaux concaténés dans celui-ci récursivement 
        listUstensils = listUstensils.flat();

        // Obj Set -> supprime doublons, spread [... set] conversion set -> array
        listUstensils = [... new Set(listUstensils)];

        //Filtre l'array de string Ustensil en fonction de la recherche
        if (entry) {
            listUstensils = this.filterListBySearchEntry(listUstensils, entry)
        }

        // Formatage liste
        listUstensils = this.formateList(listUstensils);

        // Liste exclusion tags
        if (exclusionList) {
            exclusionList.forEach((el) => {
                // Si l'élément existe, le retirer de la liste
                if (listUstensils.indexOf(el) !== -1) {
                    listUstensils.splice(listUstensils.indexOf(el), 1);
                }
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

    // Filtre tableau de recettes en fonction de l'entry dans le search filter
    filterListBySearchEntry(listIngredients, saisieIngredient) {
        // Filtre l'array de string ingrédients en fct saisie
        return listIngredients = listIngredients.filter((el) => {
            return el.indexOf(saisieIngredient.toLowerCase()) > -1
        });
    }
    // Filtre tableau de recettes en fonction des Tags choisis
    filterByTag(filterType, tagName, filteredRecipes) {
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


    // Filtre tableau recette en fonction de la recherche globale
    itemsMainSearch(entry, filteredRecipes) {
        const arrayRecipeFiltered = [];
        const entryLow = entry.toLowerCase();

        console.log(filteredRecipes);

        filteredRecipes.forEach((instRecipe) => {
            const nameLow = instRecipe.name.toLowerCase();
            const descriptionLow = instRecipe.description.toLowerCase();

            if (nameLow.includes(entryLow)) {
                arrayRecipeFiltered.push(instRecipe)
            }
            else if (descriptionLow.includes(entryLow)) {
                arrayRecipeFiltered.push(instRecipe)
            }
            else {
                instRecipe.ingredients.forEach((ingredients) => {
                    const ingredientLow = ingredients.ingredient.toLowerCase();
                    // ingredients = {ingre: "kiwi", quantity:, unit:}
                    if (ingredientLow.includes(entryLow)) {
                        arrayRecipeFiltered.push(instRecipe)
                    }
                })
            }
        })
        return arrayRecipeFiltered
    }

}