/* imports */
import RecipeSearch from "../search/search.js";
import RecipeFactory from "../factories/RecipeFactory.js";

let filteredRecipes = [];

/* Récupère tableau recipe via fetch */
async function init() {

   let indexSectionRecette = document.querySelector(".sectionRecettes");
   const indexSearch = document.querySelector("#globalSearch");
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

   /* Initialisation liste ingrédients dans filtre */
      createIngredientList(recipeSearch.getIngredientsList(null));
      createTags();

   /* Listener champ recherche filtre */
   inputIngredient.addEventListener("change", (event) => {
      const entry = event.target.value;
      createIngredientList(recipeSearch.getIngredientsList(null, entry));
      createTags();
   })

   /* add Listener sur liste ingrédients */

   /************* Menu Dropdown *************/
   const ingredientFilter = document.querySelector("#ingredientFilter");
   const nodeIconFilter = document.querySelector(".filter img");
   const ingredientLists = document.querySelector("#ingredientList");

   // Click sur menu dropDown -> ouvre / ferme
   inputIngredient.addEventListener("click", () => {
      if (!ingredientLists.classList.contains("appear")) {
         openDropDown();
      } else {
         closeDropDown();
      }
   })

   // Fermer/ouvrir menu dropdown:
   function openDropDown() {
      /* Modification <input type="text" -> "search" */
      ingredientLists.classList.add("appear");
      ingredientFilter.classList.add("unsetFilter");
      inputIngredient.setAttribute("type", "search");
      inputIngredient.removeAttribute("value");
      inputIngredient.setAttribute("placeholder", "Rechercher un ingredient");
      nodeIconFilter.classList.add("rotate");
   }
   function closeDropDown() {
      ingredientLists.classList.remove("appear");
      ingredientFilter.classList.remove("unsetFilter")
      inputIngredient.setAttribute("type", "button");
      inputIngredient.removeAttribute("placeholder");
      inputIngredient.setAttribute("value", "ingredient");
      nodeIconFilter.classList.remove("rotate");
   }

   /************
   *************    TAG     *******************
   *************/

   function createTags() {
      // Ajout Listener sur chaque ingrédient de la liste
      const indexTag = document.querySelector(".sectionTags");
      const indexList = document.querySelectorAll(".itemIngredient");
      indexList.forEach((el) => {
         el.addEventListener("click", function () {
            closeDropDown();
            const tag = document.createElement("button");
            tag.innerHTML = `${el.textContent}
            <img src="assets/icons/croix.svg" alt="" />`;
            tag.classList.add("btnTag");
            if(el.classList.contains("itemIngredient")){
               tag.classList.add("colorIngredient");
            }
            indexTag.appendChild(tag);
         })
      })
   }

   /*************
   *************    Recherche globale     *******************
   *************/

   // EventListener sur <input> champ de recherche recette
   indexSearch.addEventListener("input", (event) => {
      /* Méthode rechercheGlobale filtre tableau instance recette en fonction entry input */
      filteredRecipes = recipeSearch.mainSearch(event.target.value);
      // Supression des recettes préexistantes à la nouvelle entry
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
      const ingredientLists = document.querySelector("#ingredientList");
      // Supression des listes existantes
      ingredientLists.innerHTML = null;
      // Ajout des nouvelles listes
      ingredientsList.forEach((el) => {
         const list = document.createElement("li");
         list.classList.add("itemIngredient")
         list.innerHTML = el;
         ingredientLists.appendChild(list);
      })

   }