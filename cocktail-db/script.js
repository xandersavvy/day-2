const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

let oldDrinks = [];

let resEl = document.getElementById("res");

loadGenerate();
alphabet.map((key) => {
  document.getElementById(
    "alp-select"
  ).innerHTML += `<option value="${key}">${key}</option>`;
});

//fetching the cocktail
function fetchCocktail(val = "a", searchItem = "f") {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?${searchItem}=${val}`;
  resEl.innerHTML = "Loading";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const { drinks } = data;
      if (searchItem === "f") {
        oldDrinks = drinks;
        generateFooter();
        pagination();
      } else {
        generateHtml(drinks, true);
      }
    });
}

// uri component
function loadGenerate() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  console.log(params.q);
  if (params.q !== null) fetchCocktail(params.q, "s");
  else fetchCocktail();
}

// end of uri component

// ingredientlist generate
function generateIngredientList(drink) {
  let str = "";
  for (let i = 1; i < 16; i++) {
    str +=
      drink[`strIngredient${i}`] !== null
        ? `<li><p>
            <strong>${drink[`strIngredient${i}`]} </strong>: ${
            drink[`strMeasure${i}`]
          }
          </p></li>`
        : "";
  }
  return str;
}

// generating the html

function generateHtml(drinks = oldDrinks, ingred = false) {
  resEl.innerHTML = "";
  if (drinks.length === 0) {
    resEl.innerHTML = "No results";
    return;
  }

  drinks.map((drink) => {
    const { strDrink, strCategory, strDrinkThumb } = drink;
    let p = `<div class="item" id="${strDrink}" >
              <div class="thumb">
                <img src="${strDrinkThumb}" alt="" srcset=""/>
              </div>
              <p class="category">${strCategory}</p>
              <h1 class="name">${strDrink}</h1>`;

    // for single with ingredient display
    if (ingred) {
      p += `<a class="button button-primary" href="./">back</a>
            <h3>Instruction:</h3>
            <p>${drink.strInstructions}</p>
            <h3>Ingredients:</h3>
            <ul>${generateIngredientList(drink)}</ul></div>`;
    } else {
      p += `<a href="./?q=${strDrink}"> Show recipe</a></div>`;
    }

    resEl.innerHTML += p;
  });

  return true;
}

//search button
function search() {
  window.location = `./?q=${document.getElementById("search-field").value}`;
  document.getElementById("search-field").value = "";
}

//pagination

let footerEl = document.getElementById("footer");

function generateFooter(itemCount = 6) {
  footerEl.innerHTML = "";
  let len = oldDrinks.length;
  let pageCount = len / itemCount;

  if (len % itemCount !== 0) pageCount++;
  for (let i = 1; i <= pageCount; i++) {
    footerEl.innerHTML += `<button class="page" id=${i} onclick="pagination(this.id)">${i}</button>`;
  }
}

function pagination(id = 1) {
  let startIdx = (id - 1) * 6;
  let endIdx =
    startIdx + 6 > oldDrinks.length ? oldDrinks.length : startIdx + 6;
  generateHtml(oldDrinks.slice(startIdx, endIdx));
}
