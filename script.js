const searchBtn = document.getElementById("search-btn")
const continentSelect = document.getElementById("continent-select")
const numberOfCountriesInp = document.getElementById("number-of-countries-inp")

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
    console.log(countriesNames.sort())
  })
})
