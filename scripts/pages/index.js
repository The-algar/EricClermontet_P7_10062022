/* imports */
import recipeFactory from "../factories/recipeFactory.js";
import Recipe from "../model/Recipe.js";

/* Récupération des données avec fetch */
fetch("data/recipes.json") // Promise résolue: serveur répond
   .then((response) => {  // Promise résolue: data chargée  
      return response.json();
   })
   .then((response) => { // Promise résolue: retourne data
      const { recipes } = response;
      console.log(recipes); // [{..}, {..},] 50 objets

      // Tableau objets vers instances class Recipe 
      const recipesInst = recipes.map(function (el) {
         const test = new Recipe(el);
         return new recipeFactory(test)
      })
      // Création dynamiques recettes
      recipesInst.forEach(function (el) {
         const node = document.querySelector(".sectionRecettes");
         node.appendChild(el.createRecipeCards());
      })

      // Fonction de recherche sur propriétés name, ingredients, description 
      function filter() {
         const arrayData = recipes;
         const arrayFiltered = [];
         const entry = "FoueT";
         const entryLow = entry.toLowerCase();
         console.log(entryLow);

         arrayData.forEach(function (card) {
            const nameLow = card.name.toLowerCase();
            const descriptionLow = card.description.toLowerCase();

            if (nameLow.includes(entryLow)) {
               console.log("name trouvé");
               arrayFiltered.push(card)
            } else if (descriptionLow.includes(entryLow)) {
               console.log("description trouvée");
               arrayFiltered.push(card)
            } else {
               card.ingredients.forEach((obj) => {
                  // obj = {ingre: "kiwi", quantity:, unit:}
                  const ingredientLow = obj.ingredient.toLowerCase();
                  if (ingredientLow.includes(entryLow)) {
                     console.log("ingrédient trouvé")
                     arrayFiltered.push(card)
                  }
               })
            }

         })
         console.log(arrayFiltered);

      }
      
      filter();

})