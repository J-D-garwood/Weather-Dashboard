
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
              console.log(data)
              const name = data.city.name
              const weatherdata = data.list
              let filtered_data = [weatherdata[0], weatherdata[8], weatherdata]
              console.log(name)
              console.log(weatherdata)
            })
      } else {
        console.log("no results returned")
      }
    });