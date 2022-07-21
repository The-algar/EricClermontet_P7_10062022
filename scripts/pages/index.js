/* imports */
import RecipeSearch from "../search/search.js";
import RecipeFactory from "../factories/RecipeFactory.js";

let filteredRecipes = [];


/* Récupère tableau recipe via fetch */
async function init() {

   let indexSectionRecette = document.querySelector(".sectionRecettes");
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

   /* Initialisation listes dans filtre */
   // Liste ingrédients  createFilterList(nodeList, filterList)
   createFilterList("#ingredientList", recipeSearch.getIngredientsList(null));
   // Liste appareils 
   createFilterList("#appareilList", recipeSearch.getAppareilsList(null));

   listenListCreateTags();



   /* Saisie champ recherche filtre */
   inputIngredient.addEventListener("change", (event) => {
      const saisie = event.target.value;
      createFilterList("#ingredientList", recipeSearch.getIngredientsList(null, saisie));
      listenListCreateTags();
   })

   /************
   *************     TAG     *******************
   *************/

   // listen liste + cree tags
   function listenListCreateTags() {
      const nodeSectionTag = document.querySelector(".sectionTags");
      const nodesList = document.querySelectorAll(".itemLiFilter");

      // A modifier sur TOUTES les listes <li> pour chaque appel
      // Ajout Listener sur chaque ingrédient de la liste
      nodesList.forEach((el) => {
         el.addEventListener("click", (event) => {
            const tagName = event.target.textContent;

            /******* Clic sur liste *******/
            // Depuis <li> cliquée vers <input> de la <li>
            closeDropDown(event.target.parentElement.previousElementSibling);

            // Creation du tag
            const tag = document.createElement("button");
            tag.innerHTML = `${tagName}
            <img src="assets/icons/croix.svg" alt="" />`;
            tag.classList.add("btnTag");

            if (event.target.parentElement.id === "ingredientList") {
               tag.classList.add("colorIngredient");
            } else if (event.target.parentElement.id === "appareilList") {
               tag.classList.add("colorAppareil")
            }

            nodeSectionTag.appendChild(tag);

            console.log(filteredRecipes);
            // Filtre tableau recette avec nom tag
            filterRecipes(event.target);
            console.log(filteredRecipes);

            // Régénération de toutes les listes sans les noms de tag
            createListWithoutTagName();

            // Récursivité 
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
                     filterRecipesWithTag(el.innerText);
                  })
               }
               // Régénération liste ingrédients sans les noms de tag
               createListWithoutTagName();

               // Récursivité 
               listenListCreateTags();

            })
         })
      })
   }

   function filterRecipes(nodeLi) {
      if (nodeLi.parentElement.id === "ingredientList") {
         filteredRecipes = filteredRecipes.filter((el) => {
            return el.ingredients.find((el) => {
               return el.ingredient.toLowerCase() === nodeLi.textContent.toLowerCase();
            })
         })
      } else if (nodeLi.parentElement.id === "appareilList") {
         filteredRecipes = filteredRecipes.filter((el) => {
            return el.appliance.toLowerCase() === nodeLi.textContent.toLowerCase();
         })
      }
   }
   // A modifier
   function filterRecipesWithTag(tag) {
      filteredRecipes = filteredRecipes.filter((el) => {
         return el.ingredients.find((el) => {
            return el.ingredient.toLowerCase() === tag.toLowerCase();
         })
      })
   }

   function createListWithoutTagName() {
      const nodeTags = document.querySelectorAll(".btnTag");

      // Extraction tableau string liste des recettes filtrées
      const listIngredients = recipeSearch.getIngredientsList(filteredRecipes);
      const listAppareils = recipeSearch.getAppareilsList(filteredRecipes);
      
      // A Modifier
      // Supression du nom des tags de la liste
      nodeTags.forEach(function (el) {
         listIngredients.splice(listIngredients.indexOf(el.innerText), 1);
      })
      nodeTags.forEach(function (el) {
         listAppareils.splice(listAppareils.indexOf(el.innerText), 1);
      })

      // Génère la liste sans le tag
      createFilterList("#ingredientList", listIngredients);
      createFilterList("#appareilList", listAppareils);
   }


   /************
   *************     Recherche globale     *******************
   *************/

   // EventListener sur <input> champ de recherche recette
   nodeSearch.addEventListener("input", (event) => {
      /* Méthode rechercheGlobale filtre tableau instance recette en fonction saisie input */
      filteredRecipes = recipeSearch.rechercheGlobale(event.target.value);
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


function createFilterList(nodeFilter, filterList) { 
   const nodeFilterUl = document.querySelector(nodeFilter);
   // Supression des listes existantes
   nodeFilterUl.innerHTML = null;
   // Ajout des nouvelles listes
   filterList.forEach((el) => {
      const list = document.createElement("li");
      list.classList.add("itemLiFilter");
      list.innerHTML = el;
      nodeFilterUl.appendChild(list);
   })
}


/************
*************     Ouverture / fermeture menu dropDown     *******************
*************/

/*** Click sur menu dropDown -> ouvre / ferme ***/
const boutonFilter = document.querySelectorAll(".openDropdown");

// Listener sur les 3 filtres: 1er clic: ouvre dropDown, 2eme clic: ferme 
boutonFilter.forEach((el) => {
   el.addEventListener("click", (el) => {
      if (!el.target.nextElementSibling.classList.contains("appear")) {
         // el.target = <input> du filtre cliqué
         openDropDown(el.target);
      } else {
         closeDropDown(el.target);
      }
   })
})

// Fermer/ouvrir menu dropdown:
function openDropDown(filterInputNode) {
   // Appararition dropDown avec width 54%, rotation icone 
   filterInputNode.nextElementSibling.classList.add("appear");
   filterInputNode.parentElement.classList.add("widthFilter");
   filterInputNode.previousElementSibling.classList.add("rotate");

   // Modification <input type="text" vers "search" 
   filterInputNode.setAttribute("type", "search");
   filterInputNode.removeAttribute("value");
   // Changement nom placeholder fonction du filtre cliqué
   if (filterInputNode.id === "searchIngredient") {
      filterInputNode.setAttribute("placeholder", "Rechercher un ingredient");
   } else if (filterInputNode.id === "searchAppareil") {
      filterInputNode.setAttribute("placeholder", "Rechercher un appareil");
   }
}
function closeDropDown(filterInputNode) {
   // Disparition dropDown, width réduite, rotation icone 
   filterInputNode.nextElementSibling.classList.remove("appear");
   filterInputNode.parentElement.classList.remove("widthFilter")
   filterInputNode.previousElementSibling.classList.remove("rotate");

   // Modification <input type="search" vers "text" 
   filterInputNode.setAttribute("type", "button");
   filterInputNode.removeAttribute("placeholder");
   // Modification valeur <input> en fonction filtre cliqué
   if (filterInputNode.id === "searchIngredient") {
      filterInputNode.setAttribute("value", "Ingredients")
   } else if (filterInputNode.id === "searchAppareil") {
      filterInputNode.setAttribute("value", "Appareils")
   }
}

/********  Fermeture menu dropDown si ouvert et clic en dehors ********/

const ingredientSearch = document.querySelector("#searchIngredient");
const appareilSearch = document.querySelector("#searchAppareil");

window.addEventListener("click", (event) => {
   /* Si menu dropDown ouvert (widthFilter), si clic en dehors du menu ("ingredientList"), et si clic en dehors bouton filtre (searchIngredient) */
   if ((!(event.target.id === "ingredientList")
      && !(event.target.id === "searchIngredient"))
      && ingredientSearch.parentElement.classList.contains("widthFilter")) {
      closeDropDown(ingredientSearch);
   }
   if ((!(event.target.id === "appareilList")
      && !(event.target.id === "searchAppareil"))
      && appareilSearch.parentElement.classList.contains("widthFilter")) {
      closeDropDown(appareilSearch);
   }
})

