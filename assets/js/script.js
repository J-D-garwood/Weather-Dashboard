const secondsIn24hrs = 86400
var forecast_ls = document.getElementById("forecasts")

const SearchQuery = "New York"
const latLonURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + SearchQuery + "&limit=50&appid=353d30c1504d5c8e14a337880bf95523"

fetch(latLonURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const cityResults = data
      if (cityResults.length>0) {
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
              const filtered_list = []
              var i = 1
              weatherdata.forEach(Point => {
                if (today.dt+(i*86400)===Point.dt) {
                  filtered_list.push(Point)
                  i++;
                }
              })
              filtered_list.push(weatherdata[39])
              console.log(filtered_list)
              filtered_list.forEach(Point => {
                var forecast_col = document.createElement("div")
                forecast_col.setAttribute("class", "col")

                var forecast_card = document.createElement("div")
                forecast_card.setAttribute("class", "card")

                var forcast_temp = document.createElement("p")
                forcast_temp.textContent = "temp: " + Point.main.temp + " K"
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