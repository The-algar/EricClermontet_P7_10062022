import RecipeSearch from "../search/search.js";
import RecipeFactory from "../factories/recipeFactory.js";

/* GLobal Settings */
let filteredRecipes = [];
let originalRecipes = [];

// Saisie recherche globale
let validSearch = "";

let selectedTags = {
   ingredientList: [], 
   appareilList: [], 
   ustensilList: []
};

// instance globale de class Search
const search = new RecipeSearch();

/* Récupère tableau recipe via fetch */
async function init() {

/* **************************************** */
/*              V2 - FETCH                  */ 
/* **************************************** */

   /* récupération data + ajout propriété search => array 50 instances recette */
   await search.fetchData();

   // Initialisation tableaux recettes
   filteredRecipes = [...search.recipes];
   originalRecipes = [...search.recipes];

   // Initialisation affichage des 50 recettes
   recipesDisplay(search.filterByArrayTag());
}
init();


/* **************************************** */
/*            V2 - FILTRES                  */ 
/* **************************************** */

   /*** Click sur menu dropDown -> ouvre / ferme ***/
const buttonFilter = document.querySelectorAll(".openDropdown");

/* Listener sur 3 filtres: 1er clic: ouvre dropDown, 2eme clic: ferme. Génère la liste en fonction du filtre cliqué */
buttonFilter.forEach((el) => {
   el.addEventListener("click", (event) => {
   // Si <input> filtre cliqué contient class appear
      if (!event.target.nextElementSibling.classList.contains("appear")) {
         /* Crée liste ingrédients en fonction du tableau recette filtré et du tag */
         if (event.target.id === "searchIngredient") {
            createFilterList("#ingredientList", search.getIngredientsList(filteredRecipes, selectedTags.ingredientList));
         }
         else if (event.target.id === "searchAppareil") {
            createFilterList("#appareilList", search.getAppareilsList(filteredRecipes, selectedTags.appareilList));
         }
         else if (event.target.id === "searchUstensil") {
            createFilterList("#ustensilList", search.getUstensilList(filteredRecipes, selectedTags.ustensilList));
         }

         // Ouvre le filtre cliqué, el.target = <input> cliqué
         openDropDown(event.target);

         } else {
            closeDropDown(event.target);
         }
      })
   })


/*** Saisie champ recherche filtre ***/
const inputFilter = document.querySelectorAll(".inputFilter");
    
// Si saisie dans champ de recherche filtre: régénération liste de filtres fonction entry
inputFilter.forEach((el) => {
   el.addEventListener("change", (event) => {
      const entry = event.target.value.toLowerCase();
         if (event.target.id === "searchIngredient") {
         createFilterList("#ingredientList", search.getIngredientsList(filteredRecipes, selectedTags.ingredientList, entry));
         } else if (event.target.id === "searchAppareil") {
         createFilterList("#appareilList", search.getAppareilsList(filteredRecipes, selectedTags.appareilList, entry));
         } else if (event.target.id === "searchUstensil") {
         createFilterList("#ustensilList", search.getUstensilList(filteredRecipes, selectedTags.ustensilList, entry));
         }
      })
   })

// Crée la liste du filtre et pose un listener click sur chaque élément de la liste
function createFilterList(nodeFilter, filterList) {
   const indexFilterItem = document.querySelector(nodeFilter);

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
            // addEventListener sur chaque élément liste créee
            list.addEventListener("click", (event) => onSelectTag(event));
         })
      }
   }


/* **************************************** */
/*                V2 - TAGS                 */ 
/* **************************************** */

   /********* Ajout tag *********/
   function onSelectTag(event) {
      const indexSectionTag = document.querySelector(".sectionTags");
      const tagName = event.target.textContent;
      const indexContListItem = event.target.parentElement;

      /****** Clic sur liste ******/
      // Sélectionne l'input depuis <li> cliquée vers <input> de la <li>
      closeDropDown(indexContListItem.previousElementSibling);

      /*** Création du tag ***/
      const tagIndex = document.createElement("button");
      tagIndex.innerHTML = `${tagName}<img src="assets/icons/croix.svg" alt="" />`;
      tagIndex.classList.add("btnTag");
      // Ajout data type de tag + couleur du panel & tag
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
      // Génération des Tags
      indexSectionTag.appendChild(tagIndex);
      // Ajout listener sur tag crée avec suppression tag si clic
      tagIndex.addEventListener("click", (event) => onRemoveTag(event));

      // Object.key <=> array 
      selectedTags[indexContListItem.id].push(tagName);

      // Filtre tableau recette avec nom tag
      filteredRecipes = search.filterByTag(event.target.parentElement.id, event.target.textContent, filteredRecipes);
      
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

      // Récupération index du nom du tag 
   const indexTag = selectedTags[idTag].indexOf(event.target.textContent);
      
   // Suppression nom Tag de selectedTags
   selectedTags[idTag].splice(indexTag, 1);

      // Supression tag
      event.target.remove();

   /* Pour chaque tag restant, filteredRecipes est filtré une nouvelle fois */
   filteredRecipes = search.filterByArrayTag(selectedTags);

   // Si entry valide dans mainSearch: filtrer filteredRecipes   
      if (validSearch) {
         filteredRecipes = search.itemsMainSearch(validSearch, filteredRecipes);
      }

      // Affichage recette filtrées
      recipesDisplay(filteredRecipes);
      console.log(filteredRecipes);
   }


/* ************************************************ */
/*         V2 - AFFICHAGE des RECETTES              */ 
/* ************************************************ */

   function recipesDisplay(arrayRecipe) {

      // Supression des recettes préexistantes
      indexRecipeSection.innerHTML = null;

      // Affichage html des recettes filtrées par recherche globale (et Tag)
      arrayRecipe.forEach((el) => {
         const recipeFactory = new RecipeFactory(el);
         indexRecipeSection.appendChild(recipeFactory.createRecipeCards());
      })
   }

/* ************************************************ */
/*            V2 - RECHERCHE PRINCIPALE             */ 
/* ************************************************ */
   
   const indexSearch = document.querySelector("#globalSearch");
   let indexRecipeSection = document.querySelector(".sectionRecettes");

   // EventListener sur <input> champ de recherche recette
   indexSearch.addEventListener("input", (event) => {

      // si au moins 3 lettres entry -> déclanche la recherche
      if (event.target.value.length > 2) {

         // Extraction valeur de l'entrée (entry)
         validSearch = event.target.value;
         console.log(validSearch);

         /* Modifie tableau filteredRecipes fonction entry input */
         filteredRecipes = search.itemsMainSearch(event.target.value, filteredRecipes);
         // Si recherche entrée est inconnue
         if (filteredRecipes.length === 0) {

            // Reset tableau recette
            filteredRecipes = [...originalRecipes];

         // Filtrage du tableau avec tags si existent
         filteredRecipes = search.filterByArrayTag(selectedTags);

            // Suppression des recettes affichées
            indexRecipeSection.innerHTML = null;

            // Affichage aucune recette trouvée
            const errorMessage = document.createElement("span");
         errorMessage.textContent = "Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc.";
            indexRecipeSection.appendChild(errorMessage);

         } else {

            // Si entry valide -> affichage recettes
            recipesDisplay(filteredRecipes)
         }

      } else {

         // Si entry < 3 lettre = pas de recherche
         validSearch = "";

      filteredRecipes = search.filterByArrayTag(selectedTags);
      recipesDisplay(filteredRecipes);
      }
   })



/* ************************************************ */
/*            V2 - DROPDOWN FILTERS                 */ 
/* ************************************************ */

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