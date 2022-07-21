/* imports */
import RecipeFactory from "../factories/recipeFactory.js";
import recipeSearch from "../search/search.js";
import Recipe from "../model/Recipe.js";

/* Récupération des données avec fetch */
fetch("data/recipes.json") // Promise résolue: serveur répond
   .then((response) => {   // Promise résolue: data chargée  
      return response.json();
   })
   .then(({ recipes }) => { // Promise résolue: retourne data
      //console.log(recipes); // [{..}, {..},] 50 objets

      /* Retourne tableau d'instances recettes de class Recipe, cree dynamiquement
      les cartes recettes ds section recette avec méthode createRecipeCards()  */
      // eslint-disable-next-line no-unused-vars
      let recipesInstance = recipes.map(function (el) {
         let recipesInst = new Recipe(el); // tableau de 50 instances
         let recipeFactory = new RecipeFactory(recipesInst);
         //console.log(recipeFactory);
         document.querySelector(".sectionRecettes").appendChild(recipeFactory.createRecipeCards());
         return recipesInst;
      })
   
// Saisie champ recherche -> trie et affichage recette
let entry = "";
document.querySelector("#inputSearch").addEventListener("input", () => {
   let indexSectionRecette = document.querySelector(".sectionRecettes")
   // Gestion de l'input texte main search 
   entry = document.querySelector("#inputSearch").value;

   // delete recettes affichées précédemment si il y en a
   while (indexSectionRecette.firstChild) {
      indexSectionRecette.removeChild(indexSectionRecette.firstChild)
   }

   let testService = new recipeSearch();
   // result = tableau 50 instance class Recipe
   testService.fetchData().then(function (result) {
      // Trie des instance Recipe
      console.log(testService.mainSearch(result, entry));
      // Creation du html des Recipe triées
      testService.mainSearch(result, entry).forEach(function (instRecipe) {
         let recipeFactory = new RecipeFactory(instRecipe);
         indexSectionRecette.appendChild(recipeFactory.createRecipeCards())
      })
   })
})
   })