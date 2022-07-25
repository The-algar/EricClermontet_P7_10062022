export default class RecipeFactory {
    constructor(recipeCard) {
        this.recipeCard = recipeCard;
    }

    // retourne le html <article> à partir d'un objet recette
    createRecipeCards() {
        const cardRecipe = document.createElement("article");
        cardRecipe.innerHTML = `
        <div class="imgRecette"><img src="${this.recipeCard.picture}" alt="${this.recipeCard.name}" /></div>
        <div class="legende">
            <div class="titre">
                <h2>${this.recipeCard.name}</h2>
                <span><img src="./assets/icons/clock.svg" alt="" />${this.recipeCard.time} min</span>
            </div>
            <div class="description">
                <ul>
                    ${this.createLiIngredients()}
                </ul>
                <p>${this.recipeCard.description}</p>
            </div>
        </div>`;

        //console.log(cardRecipe);

        return cardRecipe
    }

    /* retourne des listes <li> d'ingrédients à partir tableau ingrédients */
    createLiIngredients() {
        let newLiIngredient = "";
        /* boucle sur le tableau d'ingrédients et crée <li> avec propriétés quantity et unit si elles existent, retire le ":" si elles n'existent pas */
        for (let e of this.recipeCard.ingredients) {
            newLiIngredient = newLiIngredient + `<li><span>${e.ingredient}${(e.quantity) ? ":" : ""}</span> ${e.quantity || ""} ${e.unit || ""}</li>`;
        }
        return newLiIngredient
    }
}