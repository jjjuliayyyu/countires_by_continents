const searchBtn = document.getElementById("search-btn")
const continentSelect = document.getElementById("continent-select")
const numberOfCountriesInp = document.getElementById("number-of-countries-inp")
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

  let numberOfCountries = parseInt(numberOfCountriesInp.value)
  validateNumberOfCountries(numberOfCountries)

  let continentName = continentSelect.value
  let continentCode = continentsCodeNameMap[continentName]

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
  .then((allCountriesCodes) => {
    let randomCountriesCodes = getRandomElements(allCountriesCodes, numberOfCountries)
    let countriesNames = randomCountriesCodes.map((country) => {return country.name})
    return countriesNames.sort()
  })
  .then((countries) => {
    countries.forEach((country) => {
      let url = `https://restcountries.com/v3.1/name/${country}?fullText=true`
      fetch(url)
      .then((res) => res.json())
      .then((data) => {
        cards.innerHTML += `
        <div class="card">
          <img src="${data[0].flags.svg}" class="flag-img">
          <h4>${data[0].name.common}</h4>
          <div class="data-wrapper">
            <h5>Official Name:</h5>
            <span>${data[0].name.official}</span>
          </div>
          <div class="data-wrapper">
            <h5>Capital:</h5>
            <span>${data[0].capital[0]}</span>
          </div>
          <div class="data-wrapper">
            <h5>Population:</h5>
            <span>${data[0].population}</span>
          </div>
          <div class="data-wrapper">
            <h5>Currency:</h5>
            <span>
              ${Object.keys(data[0].currencies)[0]}
            </span>
          </div>
          <div class="data-wrapper">
            <h5>Subregion:</h5>
            <span>${data[0].subregion}</span>
          </div>
          <div class="data-wrapper">
            <h5>Languages:</h5>
            <span>${Object.values(data[0].languages)
              .toString()
              .split(",")
              .join(", ")}
            </span>
          </div>
        </div>
      `
      })
    })
  })
})
