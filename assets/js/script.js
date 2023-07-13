const secondsIn24hrs = 86400
const Btn = document.getElementById("Search-Btn")
const input = document.getElementById("search-bar")
const forecast_ls = document.getElementById("forecasts")
const todays_date = document.getElementById("City_date")
const todays_temp = document.getElementById("Temp")
const todays_wind = document.getElementById("Wind")
const todays_humidity = document.getElementById("Humidity")
todays_date.textContent = dayjs().format('MM/DD/YYYY')

function Search(event) {
  event.preventDefault()
  const SearchQuery = input.value
  console.log(SearchQuery)
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
                const name = data.city.name
                const weatherdata = data.list
                const today = weatherdata[0]
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
                  console.log(date)
                  date = date[1] + "/" + date[2] + "/" + date[0]
                  temp = (Point.main.temp - 273.15)*(9/5)+32

                  var forecast_col = document.createElement("div")
                  forecast_col.setAttribute("class", "col")

                  var forecast_card = document.createElement("div")
                  forecast_card.setAttribute("class", "card")

                  var printed_date = document.createElement("h5")
                  printed_date.textContent = date
                  forecast_card.appendChild(printed_date)

                  var forcast_temp = document.createElement("p")
                  forcast_temp.textContent = "temp: " + temp.toFixed(2) + "\u00B0F"
                  forecast_card.appendChild(forcast_temp)

                  var forcast_wind = document.createElement("p")
                  forcast_wind.textContent = "wind: " + Point.wind.speed + " MPH"
                  forecast_card.appendChild(forcast_wind)

                  var forcast_humid = document.createElement("p")
                  forcast_humid.textContent = "humidity: " + Point.main.humidity + "%"
                  forecast_card.appendChild(forcast_humid)

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

  Btn.addEventListener("click", Search)
