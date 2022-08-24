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
let selectEl = document.getElementById("alp-select");
let resEl = document.getElementById("res");

alphabet.map((key) => {
  selectEl.innerHTML += `<option value="${key}">${key}</option>`;
});

function fetchCocktail(val = "A") {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${val}`;
  resEl.innerHTML = "Loading";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const { drinks } = data;
      oldDrinks = drinks;
      generateHtml(drinks, false);
    });
}

fetchCocktail();

function fetchNew() {
  fetchCocktail(selectEl.value);
}

function generateHtml(drinks = oldDrinks, ingred = false) {
  resEl.innerHTML = "";
  if (drinks.length === 0) {
    resEl.innerHTML = "No results";
    return;
  }

  drinks.map((drink) => {
    const { strDrink, strCategory, strDrinkThumb } = drink;

    //new code added

    // for single with ingredient display
    if (ingred) {
      let p = "";
      for (let i = 1; i < 16; i++) {
        if (drink[`strIngredient${i}`] != null) {
          p += `<li><h5>${drink[`strIngredient${i}`]} </h5><p> ${
            drink[`strMeasure${i}`]
          }</p></li>`;
        }
      }
      resEl.innerHTML += `<div class="item-single" id="${strDrink}">
        
          <div class="thumb">
            <img
              src="${strDrinkThumb}"
              alt=""
              srcset=""
            />
          </div>
          <button class="button button-primary" onclick="generateHtml()">back</button>
           <p class="category">${strCategory}</p>
            <h1 class="name">${strDrink}</h1>
            <h3>Instruction:</h3>
            <p>${drink.strInstructions}</p>
            <h3>Ingredients:</h3>
            <ul>${p}</ul>
        </div>
    `;
    } else {
      resEl.innerHTML += `<div class="item" id="${strDrink}" onclick="openSingle(this.id)">
          <div class="thumb">
            <img
              src="${strDrinkThumb}"
              alt=""
              srcset=""
            />
          </div>
           <p class="category">${strCategory}</p>
            <h1 class="name">${strDrink}</h1>
        </div>
    `;
    }

    //newcode complete
  });
}

//search button
function search() {
  let val = document.getElementById("search-field").value;
  document.getElementById("search-field").value = "";
  if (val === "") return;
  val = val.toLowerCase();
  let newArr = oldDrinks.filter((oldDrink) => {
    let drinkVal =
      oldDrink.strDrink.toLowerCase() +
      " " +
      oldDrink.strCategory.toLowerCase();
    return drinkVal.includes(val);
  });
  generateHtml(newArr);
}

//open single

function openSingle(id) {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      generateHtml(data.drinks, true);
    });
}
