export default class Recipe {
    constructor(cardRecipe) {    
        this.appliance = cardRecipe.appliance;
        this.description = cardRecipe.description;
        this.id = cardRecipe.id;
        // Formatage de la propriété quantity écrite "quantity" ou "quantite"
        this.ingredients = cardRecipe.ingredients.map(function(el){
            return {
                ingredient : el.ingredient,
                quantity : el.quantity || el.quantite,
                unit : el.unit
            }
        });
        this.name = cardRecipe.name;
        this.servings = cardRecipe.servings;
        this.time = cardRecipe.time;
        this.ustensils = cardRecipe.ustensils;
    }
}