
const SearchQuery = "New York"
const latLonURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + SearchQuery + "&limit=50&appid=353d30c1504d5c8e14a337880bf95523"

fetch(latLonURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const cityResults = data
      if (cityResults.length>0) {
        let latitude = cityResults[0].lat 
        console.log(latitude)
        let longitude = cityResults[0].lon
        console.log(longitude)
        let name = cityResults[0].name
        let weatherURL = "http://api.openweathermap.org/data/2.5/forecast?lat="+latitude+"&lon="+longitude+"&appid=ccd3b257380698032fa26a741a7d733a"
        fetch(weatherURL)
            .then(function (response) {
              return response.json();
            })
            .then(function(data) {
              console.log(data)
              weatherResults = data
            })
      } else {
        console.log("no results returned")
      }
    });