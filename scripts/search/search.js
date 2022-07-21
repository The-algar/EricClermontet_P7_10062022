import Recipe from "../model/Recipe.js";

export default class RecipeSearch {
    constructor() {
        this.recipes = [];
    }
    globalSearch(entry) {
        const entryLow = entry.toLowerCase();
        const arrayRecipeFiltered = [];
        this.recipes.forEach((instRecipe) => {
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
                    // ingredients = {ingredient: "coco", quantity:, unit:}
                    const ingredientLow = ingredients.ingredient.toLowerCase();
                    if (ingredientLow.includes(entryLow)) {
                        arrayRecipeFiltered.push(instRecipe)
                    }
                })
            }
        })
        return arrayRecipeFiltered
    }

    /* Récupération data fetch: tableau recette -> tableau instance recette  */
    async fetchData() {
        return fetch("data/recipes.json")  // Promise résolue: serveur répond
            .then((response) => {        // Promise résolue: data chargée  
                return response.json();
            })
            .then(({ recipes }) => {      // Promise résolue: retourne data
                // recipes ->  [{..}, {..},] 50 objets recette
                // Mise à jour propriété class -> 50 instance de class Recipe
                this.recipes = recipes.map((objRecipe) => {
                    const recipesInst = new Recipe(objRecipe);
                    return recipesInst;
                });
            })
    }

    // Extrait liste ingrédients du tableau recette complet ou filtré
    // Filtre2 avec search <input>
    getIngredients(filteredRecipes, searchIngredient) {

        // Transformation array d'objet recette -> array de liste d'ingrédients
        // map sur filteredRecipes si existe, sinon sur tableau recettes non modifié
        let listIngredients = (filteredRecipes || this.recipes).map((objRecette) => {
            return objRecette.ingredients.map((objIngredient) => {
                return objIngredient.ingredient.toLowerCase()});
           });
       // Array d'array liste -> array string liste, supprime 1 imbrication    
       listIngredients = listIngredients.flat();
       // Obj Set -> supprime doublons, spread [... set] conversion set -> array
       listIngredients = [... new Set(listIngredients)];

       if (searchIngredient) {
           listIngredients = listIngredients.filter((saisie) => saisie.indexOf(searchIngredient.toLowerCase()) > -1);
       }
       return listIngredients
   }
}

/*
   getIngredients(filteredRecipes, searchIngredient) {
       let ingredients = [
           ...new Set((filteredRecipes || this.recipes).map((recipe) => {
               return recipe.ingredients.map((ingredient) => ingredient.ingredient.toLowerCase())
           }).flat())
       ];
       if (searchIngredient) {
           ingredients = ingredients.filter((ingredient) => ingredient.indexOf(searchIngredient.toLowerCase()) > -1);
       }
       console.log(ingredients);
       return ingredients
   }
   
*/