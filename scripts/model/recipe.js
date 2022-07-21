export default class Recipe {
    constructor(recipeCard) {    
        this.appliance = recipeCard.appliance;
        this.description = recipeCard.description;
        this.id = recipeCard.id;
        // Formatage de la propriété quantity écrite "quantity" ou "quantite"
        this.ingredients = recipeCard.ingredients.map(function(el){
            return {
                ingredient : el.ingredient,
                quantity : el.quantity || el.quantite,
                unit : el.unit
            }
        });
        this.name = recipeCard.name;
        this.servings = recipeCard.servings;
        this.time = recipeCard.time;
        this.ustensils = recipeCard.ustensils;
    }
}