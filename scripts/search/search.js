
import Recipe from "../model/recipe.js";

export default class recipeSearch {
    constructor() {
        this.recipes = [];
    }
    mainSearch(arrayRecipe, entry) {
        console.time();
        let entryLow = entry.toLowerCase();
        let arrayFiltered = [];
        arrayRecipe.forEach(function (instRecipe) {
            let nameLow = instRecipe.name.toLowerCase();
            let descriptionLow = instRecipe.description.toLowerCase();
             
            if (nameLow.includes(entryLow)) {
                arrayFiltered.push(instRecipe) 
                
            }
            else if (descriptionLow.includes(entryLow)) {
                arrayFiltered.push(instRecipe)
            }
            else {
                instRecipe.ingredients.forEach((ingredients) => {
                    // ingredients = {ingre: "coco", quantity:, unit:}
                    let ingredientLow = ingredients.ingredient.toLowerCase();
                    if (ingredientLow.includes(entryLow)) {
                        arrayFiltered.push(instRecipe)
                    }
                })
            }
            
        })
        console.timeEnd();
        
        return arrayFiltered


        
    }

    /* Récupération des données avec fetch */
    async fetchData() {
        return fetch("data/recipes.json")  // Promise résolue: serveur répond
            .then((response) => {        // Promise résolue: data chargée  
                return response.json();
            })
            .then(({ recipes }) => {      // Promise résolue: retourne data
                //console.log(recipes);  //[{..}, {..},] 50 instRecipes

                // Retourne tableau d'instances recettes de class Recipe
                this.recipe = recipes.map(function (objRecipe) {
                    let recipesInst = new Recipe(objRecipe);
                    return recipesInst;
                });
                return this.recipe
            })
    }
}