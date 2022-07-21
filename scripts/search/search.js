/* eslint-disable no-undef */
import Recipe from "../model/recipe.js";

export default class recipeSearch {
    constructor() {
    }
    rechercheGlobale() {
        this.recipes.forEach(function (recipeCard) {
            const nameLow = recipeCard.name.toLowerCase();
            const descriptionLow = recipeCard.description.toLowerCase();

            if (nameLow.includes(InputTxtLow)) {
                console.log("name trouvé");
                
                arrayFiltered.push(recipeCard)
            }
            
            else if (descriptionLow.includes(InputTxtLow)) {
                console.log("description trouvée");
                
                arrayFiltered.push(recipeCard)
            }
            else {
                card.ingredients.forEach((obj) => {
                    // obj = {ingre: "kiwi", quantity:, unit:}
                    const ingredientLow = obj.ingredient.toLowerCase();
                    
                    if (ingredientLow.includes(InputTxtLow)) {
                        console.log("ingrédient trouvé")
                        
                        arrayFiltered.push(recipeCard)
                    }
                })
            }
        })
    }

    async fetchData() {
        fetch("data/recipes.json") // Promise résolue: serveur répond
            .then((response) => {   // Promise résolue: data chargée  
                return response.json();
            })
            .then(({ recipes }) => { // Promise résolue: retourne data
                this.recipes = recipes.map(function (recipe) {
                    return new Recipe(recipe);
                });
            })
    }

}