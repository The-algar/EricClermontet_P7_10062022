export default class Recipe {
    constructor(data) {
        this.appliance = data.appliance;
        this.description = data.description;
        this.id = data.id;
        this.ingredients = data.ingredients;
        this.name = data.name;
        this.servings = data.servings;
        this.time = data.time;
        this.ustensils = data.ustensils;
    }
}