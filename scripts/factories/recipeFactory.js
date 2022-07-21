export default class recipeFactory {
    constructor(recipeCard) {
        this.recipeCard = recipeCard;
    }
    createRecipeCards() {
        const recipeCard = document.createElement("recipeCard");
        recipeCard.innerHTML = `
        <div class="imgRecette"></div>
        <div class="legende">
            <div class="titre">
                <h2>${this.recipeCard.name}</h2>
                <span><img src="assets/icons/clock.svg" alt="" />${this.recipeCard.time} min</span>
            </div>
            <div class="description">
                <ul>
                    ${this.createLi()}
                </ul>
                <p>${this.recipeCard.description}</p>
            </div>
        </div>`;
        const node = document.querySelector(".sectionRecettes");
        return recipeCard
    }
    createLi() {
        const arrayLi = this.recipeCard.ingredients;
        let newLi = "";
        let x = 0;
        while (x < arrayLi.length) {
            if (this.recipeCard.ingredients[x]["unit"]) {
                newLi = newLi + `<li><span>${this.recipeCard.ingredients[x]["ingredient"]}:</span> ${this.recipeCard.ingredients[x]["quantity"]} ${this.recipeCard.ingredients[x]["unit"]}</li>`;
            } else if (this.recipeCard.ingredients[x]["quantity"]) {
                newLi = newLi + `<li><span>${this.recipeCard.ingredients[x]["ingredient"]}:</span> ${this.recipeCard.ingredients[x]["quantity"]}</li>`;
            } else {
                newLi = newLi + `<li><span>${this.recipeCard.ingredients[x]["ingredient"]}</span></li>`;
            }
            x++;
        }
        return newLi
    }
}
// carote poisson tahicienne sucre limo coco corrigés: quantite