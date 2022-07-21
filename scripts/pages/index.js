/* imports */
import RecipeSearch from "../search/search.js";
import RecipeFactory from "../factories/RecipeFactory.js";

let filteredRecipes = [];


/* Récupère tableau recipe via fetch */
   async function init() {

   let nodeSectionRecette = document.querySelector(".sectionRecettes");
   const nodeSearch = document.querySelector("#globalSearch");
   const recipeSearch = new RecipeSearch();


   /************
   *************     FETCH     *******************
   *************/

   /* récupération data + ajout propriété recipeSearch: array 50 instances recette */
   await recipeSearch.fetchData();
   // Initialisation tableau recettes filtrées
   filteredRecipes = [...recipeSearch.recipes];


   /************
   *************     FILTRES     *******************
   *************/

   const inputIngredient = document.querySelector("#searchIngredient");

   /* Initialisation liste ingrédients dans filtre */
      createIngredientList(recipeSearch.getIngredientsList(null));
      listenListCreateTags();

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
      const nodeSectionTag = document.querySelector(".sectionTags");
      const nodesList = document.querySelectorAll(".itemIngredient");

      // Ajout Listener sur chaque ingrédient de la liste
      nodesList.forEach((el) => {
         el.addEventListener("click", () => {

            /******* Clic sur liste *******/
            closeDropDown();

            // Creation du tag
            const tag = document.createElement("button");
            tag.innerHTML = `${el.textContent}
            <img src="assets/icons/croix.svg" alt="" />`;
            tag.classList.add("btnTag");
            if (el.classList.contains("itemIngredient")) {
               tag.classList.add("colorIngredient");
            }
            nodeSectionTag.appendChild(tag);
 
            // Filtre tableau recette
            filterRecipes(el.textContent, filteredRecipes); //console.log(filteredRecipes);

            // Régénération liste ingrédients sans les noms de tag
            createListWithoutTag();

            // Récursivité du search par tag
            listenListCreateTags();


            /******* Clic sur tag *******/
            nodeSectionTag.lastChild.addEventListener("click", (event) => {

               // Supression du tag
               event.target.remove();

               // Filtre tableau recette
               const nodeTags = document.querySelectorAll(".btnTag");

               // Remise état origine tableau recette
               filteredRecipes = [...recipeSearch.recipes];

               // Si tag, filtre du tableau avec chaque tag 
               if (nodeTags) {
                  nodeTags.forEach((el) => {
                     filterRecipes(el.innerText);
                     console.log(filteredRecipes);
                  })
               }
               // Régénération liste ingrédients sans les noms de tag
               createListWithoutTag();

               // Récursivité and again ,-)
               listenListCreateTags();

            })
         })
      })
   }

   function filterRecipes(tag) {
         filteredRecipes = filteredRecipes.filter((el) => {
            return el.ingredients.find((el) => {
               return el.ingredient.toLowerCase() === tag.toLowerCase();
            })
         })
   }

   function createListWithoutTag() {
      const nodeTags = document.querySelectorAll(".btnTag");

      // Extraction tableau string liste des recettes filtrées
      const list = recipeSearch.getIngredientsList(filteredRecipes);

      // Supression du nom des tags de la liste
      nodeTags.forEach(function (el) {
         list.splice(list.indexOf(el.innerText), 1);
      })
      // Génère la liste sans le tag
      createIngredientList(list);
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


   /************
*************     Ouverture / fermeture menu dropDown     *******************
*************/

const ingredientFilter = document.querySelector("#ingredientFilter");
const nodeIconFilter = document.querySelector("#ingredientFilter img");
const ingredientLists = document.querySelector("#ingredientList");
const boutonFilter = document.querySelectorAll(".openDropdown");
const inputIngredient = document.querySelector("#searchIngredient");

// Click sur menu dropDown -> ouvre / ferme
boutonFilter.forEach((el) => {
   el.addEventListener("click", () => {
      if (!ingredientLists.classList.contains("appear")) {
         openDropDown();
      } else {
         closeDropDown();
      }
   })
})

   // Fermer/ouvrir menu dropdown:
   function openDropDown() {
      /* Modification <input type="text" -> "search" */
      ingredientLists.classList.add("appear");
      ingredientFilter.classList.add("widthFilter");
      inputIngredient.setAttribute("type", "search");
      inputIngredient.removeAttribute("value");
      inputIngredient.setAttribute("placeholder", "Rechercher un ingredient");
      nodeIconFilter.classList.add("rotate");
   }
   function closeDropDown() {
      ingredientLists.classList.remove("appear");
      ingredientFilter.classList.remove("widthFilter")
      inputIngredient.setAttribute("type", "button");
      inputIngredient.removeAttribute("placeholder");
      inputIngredient.setAttribute("value", "ingredient");
      nodeIconFilter.classList.remove("rotate");
   }

   /********  Fermeture menu dropDown si ouvert et clic en dehors ********/

   window.addEventListener("click", (event) => {
      /* Si menu dropDown ouvert (widthFilter), si clic en dehors du menu ("ingredientList"), et si clic en dehors bouton filtre (searchIngredient) */
      if ((!(event.target.id === "ingredientList")
         && !(event.target.id === "searchIngredient"))
         && ingredientFilter.classList.contains("widthFilter")) {
         closeDropDown();
      }
   })