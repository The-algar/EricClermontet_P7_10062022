
import Recipe from "../model/recipe.js";

export default class recipeSearch {
    constructor() {
        this.recipes = [];
    }

    mainSearch(arrayRecipe, entry) {
        console.time();
        let entryLow = entry.toLowerCase();
        let arrayFiltered = [];
    
        for (let i = 0; i < arrayRecipe.length; i++) {
            let instRecipe = arrayRecipe[i];
            let nameLow = instRecipe.name.toLowerCase();
            let descriptionLow = instRecipe.description.toLowerCase();
         
        if (nameLow.includes(entryLow)) {
            arrayFiltered.push(instRecipe) 
            
        }
        else if (descriptionLow.includes(entryLow)) {
            arrayFiltered.push(instRecipe)
        }

            else {
                for (let j = 0; j < instRecipe.ingredients.length; j++) {
                    let ingredient = instRecipe.ingredients[j];
                    let ingredientLow = ingredient.ingredient.toLowerCase();

                    if (ingredientLow.includes(entryLow)) {
                        arrayFiltered.push(instRecipe)
                    }
                }
            }
            
        }
        console.timeEnd();
        
        return arrayFiltered


        
    }

    /*async function test(){
    return 'Putain ça fonctionne'
    }
    test().then(
        (result) => {
        console.log(result)
    }) */

    /* Récupération des données avec fetch */
    async fetchData() {
        return fetch("data/recipes.json")  // Promise résolue: serveur répond
            .then ((response) => {        // Promise résolue: data chargée  
                return response.json();
            })
            .then (({ recipes }) => {       // Promise résolue: retourne data
                console.log(recipes);  //[{..}, {..},] 50 instRecipes
                // Mise à jour propriété class -> 50 instance de class Recipe
                this.recipes = recipes.map((objRecipe) => {
                    const recipesInst = new Recipe(objRecipe);
                    return recipesInst;
                })
                return this.recipes;
            })
    }
}