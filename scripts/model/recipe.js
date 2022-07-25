export default class Recipe {
    constructor(recipeCard) {

        this.description = recipeCard.description;
        this.id = recipeCard.id;
        // Formatage de la propriété quantity écrite "quantity" ou "quantite"
        this.ingredients = recipeCard.ingredients.map(function (e) {
            return {
                ingredient: e.ingredient,
                quantity: e.quantity || e.quantite,
                unit: e.unit
            }
        });
        this.name = recipeCard.name;
        this.picture = recipeCard.picture;
        this.servings = recipeCard.servings;
        this.time = recipeCard.time;
        this.ustensils = recipeCard.ustensils;
        /* si appliance = "Blender."" ou "Blender", alors appliance = "blender", sinon appliance = appliance */
        this.appliance = (recipeCard.appliance === "Blender."
            || recipeCard.appliance === "Blender") ? "Blender" : recipeCard.appliance;
    }
}

