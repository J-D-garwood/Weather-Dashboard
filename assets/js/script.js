//defining variables; grabbing html elements
const secondsIn24hrs = 86400
const searchHist = document.getElementById("search-history")
const Btn = document.getElementById("Search-Btn")
const input = document.getElementById("search-bar")
const forecast_ls = document.getElementById("forecasts")
const todays_date = document.getElementById("City_date")
const todays_temp = document.getElementById("Temp")
const todays_wind = document.getElementById("Wind")
const todays_humidity = document.getElementById("Humidity")
const icon_today = document.getElementById("wicon1")
todays_date.textContent = dayjs().format('MM/DD/YYYY')
var recent_searches = localStorage.getItem("recentSearch-List")

//setting dates on forecast cards
const day1 = document.getElementById("day1")
day1.textContent =dayjs().add(1, 'days').format('MM/DD/YYYY')
const day2 = document.getElementById("day2")
day2.textContent =dayjs().add(2, 'days').format('MM/DD/YYYY')
const day3 = document.getElementById("day3")
day3.textContent =dayjs().add(3, 'days').format('MM/DD/YYYY')
const day4 = document.getElementById("day4")
day4.textContent =dayjs().add(4, 'days').format('MM/DD/YYYY')
const day5 = document.getElementById("day5")
day5.textContent =dayjs().add(5, 'days').format('MM/DD/YYYY')

//generating recent search button list
if (recent_searches!==null) {
  var prior_search_list = recent_searches.split("|")
  prior_search_list.pop()
  prior_search_list.forEach(placeName => {
    let new_search_container = document.createElement("div")
    new_search_container.setAttribute("class", "row border mt-2")
    let new_search = document.createElement("button")
    new_search.addEventListener("click", function(event) {
      event.preventDefault()
      input.value = placeName 
      Btn.click()
    })
    new_search.textContent = placeName
    new_search_container.appendChild(new_search)
    searchHist.appendChild(new_search_container)
  })
  while (searchHist.childElementCount > 10) { 
    searchHist.children[0].remove();
  } 
}

//add new search to recent search button list
function addRecentSearch(name) {
  if (recent_searches==null) {
    recent_searches = name + "|"
  } else {
    recent_searches = recent_searches + name + "|"
  }
  localStorage.setItem("recentSearch-List", recent_searches)
  let new_search_container = document.createElement("div")
  new_search_container.setAttribute("class", "row mt-2")
  let new_search = document.createElement("button")
  new_search.setAttribute("id", "recent_search_btn")
  new_search.addEventListener("click", function(event) {
    event.preventDefault()
    input.value = name 
    Btn.click()
  })
  new_search.textContent = name
  new_search_container.appendChild(new_search)
  searchHist.appendChild(new_search_container)
}

//Search for a city function
function Search(event) {
  event.preventDefault()
  while (searchHist.childElementCount > 10) { 
    searchHist.children[0].remove();
  } 
  const SearchQuery = input.value
  const latLonURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + SearchQuery + "&limit=50&appid=353d30c1504d5c8e14a337880bf95523"

  fetch(latLonURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const cityResults = data
        if (cityResults.length>0) {
          while (forecast_ls.childElementCount > 0) { 
            forecast_ls.children[0].remove();
          } 
          let latitude = cityResults[0].lat 
          let longitude = cityResults[0].lon
          let weatherURL = "http://api.openweathermap.org/data/2.5/forecast?lat="+latitude+"&lon="+longitude+"&appid=ccd3b257380698032fa26a741a7d733a"
          fetch(weatherURL)
              .then(function (response) {
                return response.json();
              })
              .then(function(data) {
                console.log(data)
                const name = data.city.name
                addRecentSearch(name)
                const weatherdata = data.list
                const today = weatherdata[0]
                var todaysicon = today.weather[0].icon
                console.log(todaysicon)
                var iconurl = "http://openweathermap.org/img/w/" + todaysicon + ".png";
                icon_today.setAttribute("src", iconurl)
                var temp = (today.main.temp - 273.15)*(9/5)+32
                todays_date.textContent = name + " " + dayjs().format('MM/DD/YYYY')
                todays_temp.textContent = "Temp: "+ temp.toFixed(2) + "\u00B0F"
                todays_wind.textContent = "Wind: "+ today.wind.speed + " MPH"
                todays_humidity.textContent = "Humidity: "+ today.main.humidity + "%"
                const filtered_list = []
                var i = 1
                weatherdata.forEach(Point => {
                  if (today.dt+(i*86400)===Point.dt) {
                    filtered_list.push(Point)
                    i++;
                  }
                })
                filtered_list.push(weatherdata[39])              
                filtered_list.forEach(Point => {
                  var date = Point.dt_txt
                  date = date.split(" ")[0]
                  date = date.split("-")
                  date = date[1] + "/" + date[2] + "/" + date[0]
                  temp = (Point.main.temp - 273.15)*(9/5)+32

                  var forecast_col = document.createElement("div")
                  forecast_col.setAttribute("class", "col")

                  var forecast_card = document.createElement("div")
                  forecast_card.setAttribute("class", "card text-white bg-secondary mb-3")

                  var forecast_card_body = document.createElement("div")
                  forecast_card_body.setAttribute("class", "card-body")

                  var printed_date = document.createElement("h5")
                  printed_date.textContent = date
                  forecast_card_body.appendChild(printed_date)

                  var icon_container = document.createElement("div")
                  let icon = document.createElement("img")
                  let iconcode = Point.weather[0].icon
                  let iconurl =  "http://openweathermap.org/img/w/" + iconcode + ".png";
                  icon.setAttribute("src", iconurl)
                  icon_container.appendChild(icon)
                  forecast_card_body.appendChild(icon_container)


                  var forcast_temp = document.createElement("p")
                  forcast_temp.textContent = "Temp: " + temp.toFixed(2) + "\u00B0F"
                  forecast_card_body.appendChild(forcast_temp)

                  var forcast_wind = document.createElement("p")
                  forcast_wind.textContent = "Wind: " + Point.wind.speed + " MPH"
                  forecast_card_body.appendChild(forcast_wind)

                  var forcast_humid = document.createElement("p")
                  forcast_humid.textContent = "Humidity: " + Point.main.humidity + "%"
                  forecast_card_body.appendChild(forcast_humid)

                  forecast_card.appendChild(forecast_card_body)
                  forecast_col.appendChild(forecast_card)
                  forecast_ls.appendChild(forecast_col)
                }
                )
              })
        } else {
          console.log("no results returned")
        }
      });
  }

  //Search button event listener
  Btn.addEventListener("click", Search)
