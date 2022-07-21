/* imports */
import RecipeSearch from "../search/search.js";
import RecipeFactory from "../factories/RecipeFactory.js";

/* Récupère tableau recipe via fetch, filtre le tableau en fonction saisie du champ de recherche recette et affiche les cartes recettes */
async function init() {
   const indexSectionRecette = document.querySelector(".sectionRecettes");
   const indexSearch = document.querySelector("#mainSearch");
   const recipeSearch = new RecipeSearch();

   /* Methode fetchData: récupération data + ajout propriété recipeSearch: array 50 instances recette */
   recipeSearch.fetchData().then(() => {
      console.log(recipeSearch);

      // EventListener sur <input> champ de recherche recette
      indexSearch.addEventListener("input", (event) => {

         /* Méthode indexSearch filtre tableau instance recette en fonction saisie input */
         const filteredRecipes = recipeSearch.indexSearch(event.target.value);
         console.log(filteredRecipes);

         // Supression des recettes préexistantes à la nouvelle saisie
         while (indexSectionRecette.firstChild) {
            indexSectionRecette.removeChild(indexSectionRecette.firstChild)
         }
         // Affichage du html des nouvelles recettes
         filteredRecipes.forEach((instRecipe) => {
            const recipeFactory = new RecipeFactory(instRecipe);
            indexSectionRecette.appendChild(recipeFactory.createRecipeCards());
         })
      })

      // Dropdown bouton ustensile
      const nodeFilter = document.querySelector(".filter");
      const contFilterOpen = document.querySelector(".contFilterOpen");
      const nodeNameFilter = document.querySelector(".filter span");
      const nodeSearchFilter = document.querySelector("#filterSearch");
      const nodeIconFilter = document.querySelector(".filter img");

      nodeFilter.addEventListener("click", () => {
         if (!contFilterOpen.classList.contains("appear")) {
            contFilterOpen.classList.add("appear");
            nodeNameFilter.classList.add("disappear");
            nodeFilter.classList.add("unsetFilter");
            nodeIconFilter.classList.add("rotate");
            nodeSearchFilter.focus();

         }else {
            contFilterOpen.classList.remove("appear");
            nodeFilter.classList.remove("unsetFilter");
            nodeNameFilter.classList.remove("disappear")
            nodeIconFilter.classList.remove("rotate");
         }
      })

      // Recherche filtres
      nodeSearchFilter.addEventListener("input", (event) => {
        const filteredIngredient = recipeSearch.ingredientSearch(event.target.value);
        console.log(filteredIngredient);
        
        

      })
   








      

   })


}
init();