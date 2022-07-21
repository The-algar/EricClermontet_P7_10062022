/* imports */
import RecipeSearch from "../search/search.js";
import RecipeFactory from "../factories/RecipeFactory.js";

let filteredRecipes = [];

/* Récupère tableau recipe via fetch */
async function init() {

   let indexSectionRecette = document.querySelector(".sectionRecettes");
   const mainSearch = document.querySelector("#globalSearch");
   const recipeSearch = new RecipeSearch();


   /*************
   *************    FETCH     *******************
   *************/

   /* récupération data + ajout propriété recipeSearch: array 50 instances recette */
   await recipeSearch.fetchData();


   /*************
   *************    FILTRES     *******************
   *************/

   const inputIngredient = document.querySelector("#searchIngredient");


   /* Ajout liste ingrédients dans filtre */
   createIngredientList(recipeSearch.getIngredients(null, ));

   /* Listener champ recherche filtre */
   inputIngredient.addEventListener("change", (event) => {
      const saisie = event.target.value;
      createIngredientList(recipeSearch.getIngredients(null, saisie));

   })


   /************* Menu Dropdown *************/
   const ingredientFilter = document.querySelector("#ingredientFilter");
   const nodeIconFilter = document.querySelector(".filter img");
   const ingredientUl = document.querySelector("#ingredientList");

   inputIngredient.addEventListener("click", (event) => {
      if (!ingredientUl.classList.contains("appear")) {
         /* Modification <input type="text" -> "search" */
         ingredientUl.classList.add("appear");
         ingredientFilter.classList.add("unsetFilter");
         event.target.setAttribute("type", "search");
         event.target.setAttribute("type", "search");
         event.target.removeAttribute("value");
         event.target.setAttribute("placeholder", "Rechercher un ingredient");
         nodeIconFilter.classList.add("rotate");

      } else {
         ingredientUl.classList.remove("appear");
         ingredientFilter.classList.remove("unsetFilter")
         event.target.setAttribute("type", "button");
         event.target.removeAttribute("placeholder");
         event.target.setAttribute("value", "ingredient");
         nodeIconFilter.classList.remove("rotate");
      }
   })


   /*************
   *************    Recherche globale     *******************
   *************/

   // EventListener sur <input> champ de recherche recette
   mainSearch.addEventListener("input", (event) => {
      /* Méthode rechercheGlobale filtre tableau instance recette en fonction saisie input */
      filteredRecipes = recipeSearch.globalSearch(event.target.value);
      // Supression des recettes préexistantes à la nouvelle saisie
      indexSectionRecette.innerHTML = null;
      // Affichage du html des nouvelles recettes
      filteredRecipes.forEach((instRecipe) => {
         const recipeFactory = new RecipeFactory(instRecipe);
         indexSectionRecette.appendChild(recipeFactory.createRecipeCards());
      })
   })







}
init();

      function createIngredientList(ingredientsList) {
         const ingredientUl = document.querySelector("#ingredientList");
         // Supression des listes existantes
         ingredientUl.innerHTML = null;
         // Ajout des nouvelles listes
         ingredientsList.forEach((el) => {
            const list = document.createElement("li");
            list.innerHTML = el;
            ingredientUl.appendChild(list);
        

      })
   








      

   }