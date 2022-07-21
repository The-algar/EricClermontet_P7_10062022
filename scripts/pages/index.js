/* imports */
import RecipeFactory from "../factories/recipeFactory.js";
import Recipe from "../model/Recipe.js";

/* Récupération des données avec fetch */
fetch("data/recipes.json") // Promise résolue: serveur répond
   .then((response) => {   // Promise résolue: data chargée  
      return response.json();
   })
   .then(({ recipes }) => { // Promise résolue: retourne data
      console.log(recipes); // [{..}, {..},] 50 objets

      /* Retourne tableau d'instances recettes de class Recipe, cree dynamiquement
      les cartes recettes ds section recette avec méthode createRecipeCards()  */
      // eslint-disable-next-line no-unused-vars
      const recipesInstance = recipes.map(function (el) {
         const recipesInst = new Recipe(el); // tableau de 50 instances
         const recipeFactory = new RecipeFactory(recipesInst);
         console.log(recipeFactory);
         document.querySelector(".sectionRecettes").appendChild(recipeFactory.createRecipeCards());
         return recipesInst;
      })


      // Fonction de recherche recette sur propriétés name, ingredients, description 
      function filter() {
         const arrayData = recipes;
         const arrayFiltered = [];
         const inputTxt = "ChO";
         const inputTxtLow = inputTxt.toLowerCase();

         arrayData.forEach(function (objet) {
            const nameLow = objet.name.toLowerCase();
            const descriptionLow = objet.description.toLowerCase();

            if (nameLow.includes(inputTxtLow)) {
               console.log("name trouvé");
               arrayFiltered.push(objet)
            } 
            else if (descriptionLow.includes(inputTxtLow)) {
               console.log("description trouvée");
               arrayFiltered.push(objet)
            } 
            else {
               objet.ingredients.forEach((obj) => {
                  // obj = {ingre: "kiwi", quantity:, unit:}
                  const ingredientLow = obj.ingredient.toLowerCase();
                  if (ingredientLow.includes(inputTxtLow)) {
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