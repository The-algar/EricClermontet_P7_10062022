/* imports */
import RecipeSearch from "../search/search.js";
import RecipeFactory from "../factories/RecipeFactory.js";

let filteredRecipes = [];
let selectedTag = "";

/* Récupère tableau recipe via fetch */
async function init() {

   let nodeSectionRecette = document.querySelector(".sectionRecettes");
   const nodeSearch = document.querySelector("#globalSearch");
   const recipeSearch = new RecipeSearch();
   filteredRecipes = [...recipeSearch.recipes];

   /************
   *************     FETCH     *******************
   *************/

   /* récupération data + ajout propriété recipeSearch: array 50 instances recette */
   await recipeSearch.fetchData();


   /************
   *************     FILTRES     *******************
   *************/

   /************* Menu Dropdown *************/
   const ingredientFilter = document.querySelector("#ingredientFilter");
   const nodeIconFilter = document.querySelector("#ingredientFilter img");
   const ingredientList = document.querySelector("#ingredientList");
   const boutonFilter = document.querySelectorAll(".openDropdown");
   const inputIngredient = document.querySelector("#searchIngredient");

   // Click sur menu dropDown -> ouvre / ferme
   boutonFilter.forEach((el) => {
      el.addEventListener("click", () => {
         if (!ingredientList.classList.contains("appear")) {
            openDropDown();
         } else {
            closeDropDown();
         }
      })
   })

   // Fermer/ouvrir menu dropdown:
   function openDropDown() {
      /* Modification <input type="text" -> "search" */
      ingredientList.classList.add("appear");
      ingredientFilter.classList.add("unsetFilter");
      inputIngredient.setAttribute("type", "search");
      inputIngredient.setAttribute("type", "search");
      inputIngredient.removeAttribute("value");
      inputIngredient.setAttribute("placeholder", "Rechercher un ingredient");
      nodeIconFilter.classList.add("rotate");
   }
   function closeDropDown() {
      ingredientList.classList.remove("appear");
      ingredientFilter.classList.remove("unsetFilter")
      inputIngredient.setAttribute("type", "button");
      inputIngredient.removeAttribute("placeholder");
      inputIngredient.setAttribute("value", "ingredient");
      nodeIconFilter.classList.remove("rotate");
   }

   /************* logique filtres *************/

   /* Initialisation liste ingrédients dans filtre */
   createIngredientList(recipeSearch.getIngredientsList(null));
   listenListCreateTags();
   // createListFiltered();

   /* Saisie champ recherche filtre */
   inputIngredient.addEventListener("change", (event) => {
      const saisie = event.target.value;
      createIngredientList(recipeSearch.getIngredientsList(null, saisie));
      listenListCreateTags();
   })

   /************
   *************     TAG     *******************
   *************/

   // listen liste + cree tags
   function listenListCreateTags() {
      const nodeTag = document.querySelector(".sectionTags");
      const nodesList = document.querySelectorAll(".itemIngredient");

      // Ajout Listener sur chaque ingrédient de la liste
      nodesList.forEach((el) => {
         el.addEventListener("click", () => {

            /******* Clic sur liste *******/
            closeDropDown();

            // Export nom du tag
            selectedTag = el.textContent;

            // Creation du tag
            const tag = document.createElement("button");
            tag.innerHTML = `${el.textContent}
            <img src="assets/icons/croix.svg" alt="" />`;
            tag.classList.add("btnTag");
            if (el.classList.contains("itemIngredient")) {
               tag.classList.add("colorIngredient");
            }
            // Filtre tableau recette
            nodeTag.appendChild(tag);
            filterRecipes(el.textContent);
            console.log(filteredRecipes);


            // Régénération liste
            // Retrait du tag de la liste
            let list = recipeSearch.getIngredientsList(filteredRecipes);
            list.splice(list.indexOf(selectedTag), 1);
            // Génère la liste sans le tag
            createIngredientList(list);

            // Récursivité ;O 
            listenListCreateTags();


            /* Fermeture tag
            nodeTag.addEventListener("click", (e) => {

               // Supression du tag
               e.target.remove();

               // Filtre tableau recette
               console.log(e.target.innerText);
               createIngredientList(recipeSearch.getIngredientsList(filteredRecipes));
            })
            */
         })
      })
   }

   function filterRecipes(tag) {
      if (tag) {
         filteredRecipes = recipeSearch.recipes.filter((el) => {
            return el.ingredients.find((el) => {
               return el.ingredient.toLowerCase() === tag.toLowerCase();
            })
         })
      } else {
         filteredRecipes = [...recipeSearch.recipes];
      }
   }

   /************
   *************     Recherche globale     *******************
   *************/

   // EventListener sur <input> champ de recherche recette
   nodeSearch.addEventListener("input", (event) => {
      /* Méthode rechercheGlobale filtre tableau instance recette en fonction saisie input */
      filteredRecipes = recipeSearch.rechercheGlobale(event.target.value);
      // Supression des recettes préexistantes à la nouvelle saisie
      nodeSectionRecette.innerHTML = null;
      // Affichage du html des nouvelles recettes
      filteredRecipes.forEach((instRecipe) => {
         const recipeFactory = new RecipeFactory(instRecipe);
         nodeSectionRecette.appendChild(recipeFactory.createRecipeCards());
      })
   })







}
init();




function createIngredientList(ingredientsList) {
   const ingredientList = document.querySelector("#ingredientList");
   // Supression des listes existantes
   ingredientList.innerHTML = null;
   // Ajout des nouvelles listes
   ingredientsList.forEach((el) => {
      const list = document.createElement("li");
      list.classList.add("itemIngredient")
      list.innerHTML = el;
      ingredientList.appendChild(list);
   })
}