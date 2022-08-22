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

alphabet.map((key) => {
  selectEl.innerHTML += `<option value="${key}">${key}</option>`;
});

function fetchCocktail(val = "a") {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${val}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const { drinks } = data;
      oldDrinks = drinks;
      generateHtml(drinks);
    });
}

fetchCocktail();

function fetchNew() {
  fetchCocktail(selectEl.value);
}

function generateHtml(drinks = []) {
  document.getElementById("res").innerHTML = "";
  if (drinks.length === 0) {
    document.getElementById("res").innerHTML = "No results";
    return;
  }
  drinks.map((drink, index) => {
    const { strDrink, strCategory, strDrinkThumb } = drink;
    document.getElementById("res").innerHTML += `
    <div class="item">
          <div class="thumb">
            <img
              src="${strDrinkThumb}"
              alt=""
              srcset=""
            />
          </div>
           <p class="category">${strCategory}</p>
            <h1 class="name">${strDrink}</p>
        
        </div>
    `;
  });
}

//search button
function search() {
  let val = document.getElementById("search-field").value;
  document.getElementById("search-field").value = "";
  if (val === "") return;
  val = val.toLowerCase();
  console.log(val);
  let newArr = oldDrinks.filter((oldDrink) => {
    let drinkVal =
      oldDrink.strDrink.toLowerCase() +
      " " +
      oldDrink.strCategory.toLowerCase();
    return drinkVal.includes(val);
  });
  generateHtml(newArr);
}
