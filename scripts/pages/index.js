/* imports */
import RecipeFactory from "../factories/recipeFactory.js";
import Recipe from "../model/Recipe.js";
//import RecipeSearch from "../search/Search.js";

/* Récupération des données avec fetch */
fetch("data/recipes.json") // Promise résolue: serveur répond
   .then((response) => {   // Promise résolue: data chargée  
      return response.json();
   })
   .then(({ recipes }) => { // Promise résolue: retourne data
      console.log(recipes); // [{..}, {..},] 50 objets

      /* Retourne tableau d'instances recettes de class Recipe, cree dynamiquement
      les cartes recettes ds section recette avec méthode createRecipeCards()  */
      const recipesInstance = recipes.map(function (el) {
         const recipesInst = new Recipe(el);
         const recipeFactory = new RecipeFactory(recipesInst);
         document.querySelector(".sectionRecettes").appendChild(recipeFactory.createRecipeCards());
         return recipesInst;
      })


      // Fonction de recherche recette sur propriétés name, ingredients, description 
      function filter() {
         const arrayData = recipes;
         const arrayFiltered = [];
         const entry = "ChO";
         const entryLow = entry.toLowerCase();

         arrayData.forEach(function (objet) {
            const nameLow = objet.name.toLowerCase();
            const descriptionLow = objet.description.toLowerCase();

            if (nameLow.includes(entryLow)) {
               console.log("name trouvé");
               arrayFiltered.push(objet)
            } 
            else if (descriptionLow.includes(entryLow)) {
               console.log("description trouvée");
               arrayFiltered.push(objet)
            } 
            else {
               objet.ingredients.forEach((obj) => {
                  // obj = {ingre: "kiwi", quantity:, unit:}
                  const ingredientLow = obj.ingredient.toLowerCase();
                  if (ingredientLow.includes(entryLow)) {
                     console.log("ingrédient trouvé")
                     arrayFiltered.push(objet)
                  }
               })
            }
         })
         console.log(arrayFiltered);
      }
      filter();










   })