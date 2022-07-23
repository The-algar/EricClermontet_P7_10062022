/* imports */
import RecipeSearch from "../search/search.js";
import RecipeFactory from "../factories/recipeFactory.js";

/* GLobal Settings */
let filteredRecipes = [];
let originalRecipes = [];

// Saisie recherche globale
let validSearch = "";

let selectedTags = {
   ingredientList: [], appareilList: [], ustensilList: []
};

const recipeSearch = new RecipeSearch();

/* Récupère tableau recipe via fetch */
async function init() {

   let indexRecipeSection = document.querySelector(".sectionRecettes");
   const indexSearch = document.querySelector("#globalSearch");

   //const recipeSearch = new RecipeSearch();

   /************
   *************     FETCH     *******************
   *************/

   /* récupération data + ajout propriété recipeSearch: array 50 instances recette */
   await recipeSearch.fetchData();

   // Initialisation tableau recettes filtrées
   filteredRecipes = [...recipeSearch.recipes];

   // Initialisation affichage des recettes
   recipesDisplay(filteredRecipes); // Si pas de tag = affiche les 50 recettes originales

   // Initialisation tableau recettes non filtrées
   originalRecipes = [...recipeSearch.recipes];

   /************
   *************     FILTRES     *******************
   *************/
   
   /*** Click sur menu dropDown -> ouvre / ferme ***/
   const btnFilter = document.querySelectorAll(".openDropdown");

   /* Listener sur les 3 boutons filtres: 1er clic: ouvre dropDown, 2eme clic: ferme */
   btnFilter.forEach((el) => {
      el.addEventListener("click", (event) => {
         // Si <input> filtre cliqué contient class appear
         if (!event.target.nextElementSibling.classList.contains("appear")) {
            /* Crée liste ingrédients en fonction du tableau recette filtré et du tag */
            if (event.target.id === "searchIngredient") {
               createFilterList("#ingredientList", recipeSearch.getIngredientsList(filteredRecipes, selectedTags.ingredientList));
            }
            else if (event.target.id === "searchAppareil") {
               createFilterList("#appareilList", recipeSearch.getAppareilsList(filteredRecipes, selectedTags.appareilList));
            }
            else if (event.target.id === "searchUstensil") {
               createFilterList("#ustensilList", recipeSearch.getUstensilList(filteredRecipes, selectedTags.ustensilList));
            }

            // Ouvre le filtre cliqué, el.target = <input> cliqué
            openDropDown(event.target);

         } else {
            closeDropDown(event.target);
         }
      })
   })


   /* Saisie champ recherche filtre */
   const inputFilter = document.querySelectorAll(".inputFilter");
    
   inputFilter.forEach((el) => {
      el.addEventListener("change", (event) => {
         const saisie = event.target.value.toLowerCase();
         console.log(event.target.id);
         if (event.target.id === "searchIngredient") {
            createFilterList("#ingredientList", recipeSearch.getIngredientsList(filteredRecipes, selectedTags.ingredientList, saisie));
         } else if (event.target.id === "searchAppareil") {
            createFilterList("#appareilList", recipeSearch.getAppareilsList(filteredRecipes, selectedTags.appareilList, saisie));
         } else if (event.target.id === "searchUstensil") {
            createFilterList("#ustensilList", recipeSearch.getUstensilList(filteredRecipes, selectedTags.ustensilList, saisie));
         }
      })
   })


   // Recettes originales ajout init
   function createFilterList(indexFilter, filterList) {
      const indexFilterItem = document.querySelector(indexFilter);

      // Supression des listes existantes
      indexFilterItem.innerHTML = null;

      // Si filterList vide
      if (filterList.length === 0) {
         indexFilterItem.innerHTML = `<span class="noFilter"> Aucun filtre disponible </span>`;

      } else {
         // Ajout des nouvelles listes
         filterList.forEach((el) => {
            const list = document.createElement("li");
            list.classList.add("itemLiFilter");
            list.innerHTML = el;
            indexFilterItem.appendChild(list);
            // addEventListener sur chaque liste créee
            list.addEventListener("click", (event) => onSelectTag(event));
         })
      }
   }


   /************
   *************     TAG     *******************
   *************/

   /********* Ajout tag *********/
   function onSelectTag(event) {
      const nodeSectionTag = document.querySelector(".sectionTags");
      const tagName = event.target.textContent;
      const indexContListItem = event.target.parentElement;

      /****** Clic sur liste ******/
      // Depuis <li> cliquée vers <input> de la <li>
      closeDropDown(indexContListItem.previousElementSibling);

      /*** Création du tag ***/
      const tagIndex = document.createElement("button");
      tagIndex.innerHTML = `${tagName}<img src="assets/icons/croix.svg" alt="" />`;
      tagIndex.classList.add("btnTag");
      // Ajout data type de tag + couleur
      if (indexContListItem.id === "ingredientList") {
         tagIndex.classList.add("colorIngredient");
         tagIndex.setAttribute("data-id", "ingredientList")
      } else if (indexContListItem.id === "appareilList") {
         tagIndex.classList.add("colorAppareil");
         tagIndex.setAttribute("data-id", "appareilList")
      } else if (indexContListItem.id === "ustensilList") {
         tagIndex.classList.add("colorUstensil");
         tagIndex.setAttribute("data-id", "ustensilList")
      }
      // Génération Tag
      nodeSectionTag.appendChild(tagIndex);
      // Ajout listener sur tag crée avec suppression tag si clic
      tagIndex.addEventListener("click", (event) => onRemoveTag(event));

      // Object.key <=> array 
      selectedTags[indexContListItem.id].push(tagName);

      // Filtre tableau recette avec nom tag
      filteredRecipes = recipeSearch.filterByTag(event.target.parentElement.id, event.target.textContent, filteredRecipes);
      
      // Affichage recettes filtrées
      recipesDisplay(filteredRecipes);
      console.log(filteredRecipes);
   }

   /********* Suppression tag *********/
   // Supprime un tag, filtre le tableau filteredRecipes avec tags restants
   function onRemoveTag(event) {

      // Supression nom tag de la liste du filtre
      // idTag -> tag ingredient ou appareil
      const idTag = event.target.dataset.id;
      // Liste des tags cliqués par type
      const arrayTag = selectedTags[idTag];
      // Récupération index du nom du tag 
      const indexTag = arrayTag.indexOf(event.target.textContent);
      // Suppression nom Tag
      arrayTag.splice(indexTag, 1);

      // Supression tag
      event.target.remove();

      // Remise état origine tableau recette
      filteredRecipes = [...originalRecipes];

      // Filtre filteredRecipes avec tags non supprimés:
      if (selectedTags["ingredientList"].length > 0)
         selectedTags["ingredientList"].forEach((el) => {
            filteredRecipes = recipeSearch.filterByTag("ingredientList", el, filteredRecipes)
         })
      if (selectedTags["appareilList"].length > 0)
         selectedTags["appareilList"].forEach((el) => {
            filteredRecipes = recipeSearch.filterByTag("appareilList", el, filteredRecipes)
         })
      if (selectedTags["ustensilList"].length > 0)
         selectedTags["ustensilList"].forEach((el) => {
            filteredRecipes = recipeSearch.filterByTag("ustensilList", el, filteredRecipes)
         })

      // Si saisie valide dans globalSearch: filtrer filteredRecipes   
      if (validSearch) {
         filteredRecipes = recipeSearch.itemsMainSearch(validSearch, filteredRecipes);
      }

      // Affichage recette filtrées
      recipesDisplay(filteredRecipes);
      console.log(filteredRecipes);
   }


   /************
   *************     Affichage des recettes     *******************
   *************/

   function recipesDisplay(arrayRecipe) {

      // Supression des recettes préexistantes
      indexRecipeSection.innerHTML = null;

      // Affichage html des recettes filtrées par recherche globale (et Tag)
      arrayRecipe.forEach((instRecipe) => {
         const recipeFactory = new RecipeFactory(instRecipe);
         indexRecipeSection.appendChild(recipeFactory.createRecipeCards());
      })

   }


   /************
   *************     Recherche globale     *******************
   *************/

   // EventListener sur <input> champ de recherche recette
   indexSearch.addEventListener("input", (event) => {

      // si au moins 3 lettres entry -> trigg recherche
      if (event.target.value.length > 2) {

         // Extraction valeur saisie
         validSearch = event.target.value;
         console.log(validSearch);

         /* Modifie tableau filteredRecipes fonction entry input */
         filteredRecipes = recipeSearch.itemsMainSearch(event.target.value, filteredRecipes);

         // Si entry inconnue
         if (filteredRecipes.length === 0) {

            // Reset tableau recette
            filteredRecipes = [...originalRecipes];

            // Originale SI TAG appel onremoveTag( )

            // Suppression des recettes affichées
            indexRecipeSection.innerHTML = null;

            // Affichage aucune recette trouvée
            const errorMessage = document.createElement("span");
            errorMessage.textContent = "Aucune recette ne correspond à votre recherche... vous pouvez chercher « tarte aux pommes », « poisson », etc.";
            indexRecipeSection.appendChild(errorMessage);

         } else {

            // Si entry valide -> affichage recettes
            recipesDisplay(filteredRecipes)
         }
      } else {

         // Si entry < 3 lettre = pas de saisie
         validSearch = "";

         // Si pas de tag sélectionné
         if (selectedTags["ingredientList"].length === 0
            && selectedTags["appareilList"].length === 0
            && selectedTags["ustensilList"].length === 0) {
            console.log('pas de tag');

            // Affichage de toutes les recettes
            recipesDisplay(originalRecipes);

            filteredRecipes = [...originalRecipes];

         }
      }
   })
}
init();



/************
*************     Ouverture / fermeture menu dropDown     *******************
*************/

// Fermer/ouvrir menu dropdown:
function openDropDown(filterInputNode) {
   // Appararition dropDown avec width 54%, rotation icone 
   filterInputNode.nextElementSibling.classList.add("appear");
   filterInputNode.parentElement.classList.add("widthFilter");
   filterInputNode.previousElementSibling.classList.add("rotate");

   // Modification <input type="button" vers "search" 
   filterInputNode.setAttribute("type", "search");
   filterInputNode.removeAttribute("value");
   // Changement nom placeholder fonction du filtre cliqué
   if (filterInputNode.id === "searchIngredient") {
      filterInputNode.setAttribute("placeholder", "Rechercher un ingredient");
   } else if (filterInputNode.id === "searchAppareil") {
      filterInputNode.setAttribute("placeholder", "Rechercher un appareil");
   } else if (filterInputNode.id === "searchUstensil") {
      filterInputNode.setAttribute("placeholder", "Rechercher un ustensile");
   }
}
function closeDropDown(filterInputNode) {
   // Disparition dropDown, width réduite, rotation icone 
   filterInputNode.nextElementSibling.classList.remove("appear");
   filterInputNode.parentElement.classList.remove("widthFilter")
   filterInputNode.previousElementSibling.classList.remove("rotate");

   // Modification <input type="search" vers "button" 
   filterInputNode.setAttribute("type", "button");
   filterInputNode.removeAttribute("placeholder");
   // Modification valeur <input> en fonction filtre cliqué
   if (filterInputNode.id === "searchIngredient") {
      filterInputNode.setAttribute("value", "Ingredients")
   } else if (filterInputNode.id === "searchAppareil") {
      filterInputNode.setAttribute("value", "Appareils")
   } else if (filterInputNode.id === "searchUstensil") {
      filterInputNode.setAttribute("value", "Ustensiles")
   }
}

/********  Fermeture menu dropDown si ouvert et clic en dehors ********/

const ingredientSearch = document.querySelector("#searchIngredient");
const appareilSearch = document.querySelector("#searchAppareil");
const ustensilSearch = document.querySelector("#searchUstensil");

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
   if ((!(event.target.id === "ustensilList")
      && !(event.target.id === "searchUstensil"))
      && ustensilSearch.parentElement.classList.contains("widthFilter")) {
      closeDropDown(ustensilSearch);
   }
})