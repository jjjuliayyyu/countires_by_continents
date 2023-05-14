const searchBtn = document.getElementById("search-btn")
const continentSelect = document.getElementById("continent-select")
const numberOfCountriesInp = document.getElementById("number-of-countries-inp")
const loadingIndicator = document.getElementById("loading-indicator")
const serachValidator = document.getElementById("serach-validator")

const getRandomElements = (arr, numElements) => {
  if (numElements > arr.length) {
    throw new Error("The number of elements requested is greater than the array length.")
  }
  let randomElements = []
  while (randomElements.length < numElements) {
    let randomIndex = Math.floor(Math.random() * arr.length)
    if (!randomElements.includes(arr[randomIndex])) {
      randomElements.push(arr[randomIndex])
    }
  }
  return randomElements
}
const validateNumberOfCountries = (numberOfCountries) => {
  if (numberOfCountries > 10 || numberOfCountries < 2) {
    serachValidator.innerHTML = `<h5>The number of countries should be in the range of 2 to 10.</h5>`
    throw new Error("The number of countries should be in the range of 2 to 10.")
  }
}
const fetchCountriesFromContinent = (continentCode) => {
  let url = "https://countries.trevorblades.com/graphql"
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
      query Query {
        continent(code: "${continentCode}") {
          countries {
            name
          }
        }
      }
    `,
    }),
  })
  .then((res) => res.json())
  .then((data) => data.data.continent.countries)
}
const makeCountryCard = (flag, commonName, officialName, capital, population, currencies, subregion, languages) => {
  cards.innerHTML += `
  <div class="card">
    <img src="${flag}" class="flag-img">
    <h4>${commonName}</h4>
    <div class="data-wrapper">
      <h5>Official Name:</h5>
      <span>${officialName}</span>
    </div>
    <div class="data-wrapper">
      <h5>Capital:</h5>
      <span>${capital}</span>
    </div>
    <div class="data-wrapper">
      <h5>Population:</h5>
      <span>${population}</span>
    </div>
    <div class="data-wrapper">
      <h5>Currency:</h5>
      <span>
        ${currencies}
      </span>
    </div>
    <div class="data-wrapper">
      <h5>Subregion:</h5>
      <span>${subregion}</span>
    </div>
    <div class="data-wrapper">
      <h5>Languages:</h5>
      <span>${languages}
      </span>
    </div>
  </div>
  `
}
const makeCountriesCards = (countries) => {
  countries.forEach((country) => {
    let url = `https://restcountries.com/v3.1/name/${country}?fullText=true`
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let flag = data[0].flags.svg
      let commonName = data[0].name.common
      let officialName = data[0].name.official
      let capital = data[0].capital[0]
      let population =data[0].population
      let currencies = Object.keys(data[0].currencies)[0]
      let subregion = data[0].subregion
      let languages = Object.values(data[0].languages)
      .toString()
      .split(",")
      .join(", ")
      makeCountryCard(flag, commonName, officialName, capital, population, currencies, subregion, languages)
    })
    .catch((e) => {
      cards.innerHTML += `
        <div class="card">
          <h4>No information found about ${country}!</h4>
        </div>
      `
    })
  })
}
const continentsCodeNameMap = {
  "Africa": "AF",
  "Antarctica": "AN",
  "Asia": "AS",
  "Europe": "EU",
  "North America": "NA",
  "Oceania": "OC",
  "South America": "SA"
}

searchBtn.addEventListener("click", () => {
  cards.innerHTML = ``
  serachValidator.innerHTML = ``

  let numberOfCountries = parseInt(numberOfCountriesInp.value)
  validateNumberOfCountries(numberOfCountries)

  loadingIndicator.style.display = "flex"

  let continentName = continentSelect.value
  let continentCode = continentsCodeNameMap[continentName]

  fetchCountriesFromContinent(continentCode)
  .then((allCountriesCodes) => {
    let randomCountriesCodes = getRandomElements(allCountriesCodes, numberOfCountries)
    let countriesNames = randomCountriesCodes.map((country) => {return country.name})
    return countriesNames.sort()
  })
  .then((countries) => {
    makeCountriesCards(countries)
  })
  .then(() => {loadingIndicator.style.display = "none"})
})
