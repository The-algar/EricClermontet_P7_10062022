export default class recipeFactory {
    constructor(recipeCard) {
        this.recipeCard = recipeCard;
    }
    // retourne le html <article> à partir d'un objet recette
    createRecipeCards() {
        let recipeCard = document.createElement("recipeCard");
        recipeCard.innerHTML = `
        <div class="imgRecette"></div>
        <div class="legende">
            <div class="titre">
                <h2>${this.recipeCard.name}</h2>
                <span><img src="assets/icons/clock.svg" alt="" />${this.recipeCard.time} min</span>
            </div>
            <div class="description">
                <ul>
                    ${this.createLiIngredients()}
                </ul>
                <p>${this.recipeCard.description}</p>
            </div>
        </div>`;
        return recipeCard
    }

    /* retourne des listes <li> d'ingrédients à partir du tableau d'ingrédients 
    variable */ 
    // ingredients = [{ingredient:, quantity:, unit:}, {ingrédient: ...}, {...}
    createLiIngredients() {    
        let newLi = "";
        /* boucle sur le tableau d'ingrédients et crée <li> avec propriétés quantity et unit si elles existent, retire le ":" si elles n'existent pas */
        for (let el of this.recipeCard.ingredients) { 
                newLi = newLi + `<li><span>${el.ingredient}${(el.ingredient)?":":""}</span> ${el.quantity || ""} ${el.unit || ""}</li>`;
        }
        return newLi
    }
}