/* imports */
import RecipeSearch from "../search/search.js";
import RecipeFactory from "../factories/RecipeFactory.js";

/*** Déclarations globales ***/
let originalRecipes = [];

let filteredRecipes = [];
let selectedTags = {
   ingredientList: [],
   appareilList: [],
   ustensilList: []
};

/* Récupère tableau recipe via fetch */
async function init() {

   let nodeSectionRecette = document.querySelector(".sectionRecettes");
   const indexSearch = document.querySelector("#globalSearch");
   const recipeSearch = new RecipeSearch();


   /************
   *************     FETCH     *******************
   *************/

   /* récupération data + ajout propriété recipeSearch: array 50 instances recette */
   await recipeSearch.fetchData();

   // Global settings
   filteredRecipes = [...recipeSearch.recipes];

   originalRecipes = [...recipeSearch.recipes];

   /************
   *************     FILTRES     *******************
   *************/

   const inputIngredient = document.querySelector("#searchIngredient");
   

   /*** Click sur menu dropDown -> ouvre / ferme ***/
   const buttonFilter = document.querySelectorAll(".openDropdown");

   /* Listener sur les 3 boutons filtres: 1er clic: ouvre dropDown, 2eme clic: ferme */
   buttonFilter.forEach((el) => {
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
               createFilterList("#ustensilList", recipeSearch.getUstensilsList(filteredRecipes, selectedTags.ustensilList));
            }

            // Ouvre le filtre cliqué, el.target = <input> cliqué
            openDropDown(event.target);

         } else {
            closeDropDown(event.target);
         }
      })
   })


   /* Saisie champ recherche filtre */
   inputIngredient.addEventListener("change", (event) => {
      const entry = event.target.value;
      createFilterList("#ingredientList", recipeSearch.getIngredientsList(null, entry));
      createFilterList("#appareilList", recipeSearch.getAppareilsList(null, entry));
      createFilterList("#ustensilList", recipeSearch.getUstensilsList(null, entry));
      // listenListCreateTags();
   })

   /************
   *************     TAG     *******************
   *************/


   
   /************
   *************     Recherche globale     *******************
   *************/

   // EventListener sur <input> champ de recherche recette
   indexSearch.addEventListener("input", (event) => {
      /* Méthode entrySearch filtre tableau instance recette en fonction de l'entry input */
      filteredRecipes = recipeSearch.entrySearch(event.target.value);
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



function createFilterList(nodeFilter, filterList) {
   const indexFilterItem = document.querySelector(nodeFilter);

   // Supression des listes existantes
   indexFilterItem.innerHTML = null;

   // Si filterList vide
   if (filterList.length === 0) {
      indexFilterItem.innerHTML = `Aucun filtre disponible`;

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


function onSelectTag(event) {
   const indexSectionTag = document.querySelector(".sectionTags");
   const tagName = event.target.textContent;
   const indexContListItem = event.target.parentElement;

   /******* Clic sur liste *******/
   // Depuis <li> cliquée vers <input> de la <li>
   closeDropDown(indexContListItem.previousElementSibling);

   /*** Création du tag ***/
   const tagNode = document.createElement("button");
   tagNode.innerHTML = `${tagName}<img src="assets/icons/croix.svg" alt="" />`;
   tagNode.classList.add("btnTag");
   // Ajout data type de tag + couleur
   if (indexContListItem.id === "ingredientList") {
      tagNode.classList.add("colorIngredient");
      tagNode.setAttribute("data-id", "ingredientList")
   } else if (indexContListItem.id === "appareilList") {
      tagNode.classList.add("colorAppareil");
      tagNode.setAttribute("data-id", "appareilList")
   } else if (indexContListItem.id === "ustensilList") {
      tagNode.classList.add("colorUstensil");
      tagNode.setAttribute("data-id", "ustensilList")
   }
   // Génération Tag
   indexSectionTag.appendChild(tagNode);
   // Ajout listener sur tag crée avec suppression tag si clic
   tagNode.addEventListener("click", (event) => onRemoveTag(event));

   // Object.key <=> array 
   selectedTags[indexContListItem.id].push(tagName);

   // Filtre tableau recette avec nom tag
   filterRecipes(event.target.parentElement.id, event.target.textContent);
   console.log(filteredRecipes);
}

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
      filterRecipes("ingredientList", el)
   })
if (selectedTags["appareilList"].length > 0)
   selectedTags["appareilList"].forEach((el) => {
      filterRecipes("appareilList", el)
   })
if (selectedTags["ustensilList"].length > 0)
   selectedTags["ustensilList"].forEach((el) => {
      filterRecipes("ustensilList", el)
   })
console.log(filteredRecipes);
}

// AM A METTRE DS METHODE
// Filtre du tableau de recettes
function filterRecipes(filterType, tagName) {
   if (filterType === "ingredientList") {
      filteredRecipes = filteredRecipes.filter((objRecipe) => {
         return objRecipe.ingredients.find((el) => {
            return el.ingredient.toLowerCase() === tagName.toLowerCase();
         })
      })
   } else if (filterType === "appareilList") {
      filteredRecipes = filteredRecipes.filter((el) => {
         return el.appliance.toLowerCase() === tagName.toLowerCase();
      })
   } else if (filterType === "ustensilList") {
      filteredRecipes = filteredRecipes.filter((el) => {
         return el.ustensils.find((el) => {
            return el.toLowerCase() === tagName.toLowerCase();
         })
      })
   }
}


/************
*************     Ouverture / fermeture menu dropDown     *******************
*************/

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
   } else if (filterInputNode.id === "searchUstensil") {
      filterInputNode.setAttribute("placeholder", "Rechercher un ustensile");
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
   }  else if (filterInputNode.id === "searchUstensil") {
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