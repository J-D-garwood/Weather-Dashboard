
SearchQuery = "London"
latLonURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + SearchQuery + "&limit=50&appid=353d30c1504d5c8e14a337880bf95523"

fetch(latLonURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });