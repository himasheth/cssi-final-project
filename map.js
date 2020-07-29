//variable declaration
let placeName = [];
let requests = [];
let locationToMap = [];
let markerArray = [];
let nameMap, response, map, lat, lng, obj, link;
let addresses = [];

//a function that is called when you want to add something to the map.
//It's an async function so that the next function waits for the data from the function to be completed before moving on.
async function addToMap(d) {
    //println("Add to Map");
    placeName.unshift(d);
    nameArray = d.split(" ");
    //nameArray.join("+");
    // let newAdd = d.replaceAll(" ", "+");
    // console.log(newAdd);

    // printArray(nameArray);

    //this part of the function turns the place you want on the map into the form of a URL link
    let addressString = "";
    for (i = 0; i < nameArray.length; i++) {
        addressString += nameArray[i];
        if (nameArray.length != i + 1)
            addressString += "+";
    }
    addresses.unshift(addressString);

    // //this function takes the URL links of the places that you want mapped and creates HTTP requests to the Google Geocoding API to allow me to get the latitude and longitude of the place
    // It calls the API for addresses.length times, meaning it loops through all the locations stored in addresses.
    for (let i = 0; i < addresses.length; i++) {
        link = "";
        let link1 = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        let link2 = addresses[i];
        let link3 = "&key=AIzaSyA2MYUfwXkH6E88_aQ0Eg8sba6V23_1Fdc";
        link = link1 + link2 + link3;
    }
}

// let resp;
// fetch(link)
//     .then((resp) => resp.json()) // Transform the data into json

// .then(function(data) {

//     console.log(data);

//     // goes through the JSON data from the API to isolate the latitude and longitude to the appropriate variables
//     lat = data["results"][0]["geometry"]["location"]["lat"];
//     lng = data["results"][0]["geometry"]["location"]["lng"];

//     console.log(lat, lng);

//location latitude and longitudes

const PARIS_LATLONG = { lat: 48.8566, lng: 2.3522 };
const TOKYO_LATLONG = { lat: 35.6762, lng: 139.6503 };
const NEWYORK_LATLONG = { lat: 40.7128, lng: -74.0060 };

// function initMap() {
//     map = new google.maps.Map(document.getElementById("map"), {
//         center: NEWYORK_LATLONG,
//         zoom: 8
//     });

//     const marker = new google.maps.Marker({
//         position: NEWYORK_LATLONG,
//         map,
//         title: "Click to zoom"
//     });

//     marker.addListener("click", () => {
//         map.setZoom(8);
//         map.setCenter(marker.getPosition());
//     });


//     map.data.loadGeoJson(
//         'us.json');


//     map.data.setStyle({
//         fillColor: 'green',
//         strokeWeight: 1
//     });
//     marker.addListener("mouseover", () => {
//         //use the mouse over event handler to highlight the countries when they mouse over them
//         onmousemove = function(e) { console.log("mouse location:", e.clientX, e.clientY) }
//     });
// }

$(function() {
    {
        let countries = [];

        let mapOptions = {
            zoom: 3,
            center: new google.maps.LatLng(50.7244893, 3.2668189),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            backgroundColor: 'none'
        };

        let map = new google.maps.Map(document.getElementById('map'), mapOptions);

        initMap();

        function initMap() {
            $.ajax({
                url: 'world.json',
                dataType: 'json',
                // default for cache and async is true

                success: function(data) {

                    if (data) {

                        $.each(data, function(id, country) {

                            var countryCoords;
                            var coordPairs;
                            var countryBorder;

                            // if there are more than one land masses in the country (i.e. islands)
                            if ('multi' in country) {

                                var coordArray = [];

                                for (var t in country['xml']['Polygon']) {

                                    //an array to keep track of each land mass
                                    countryCoords = [];

                                    countryBorder = country['xml']['Polygon'][t]['outerBoundaryIs']['LinearRing']['coordinates'].split(' ');

                                    for (var i in countryBorder) {

                                        coordPairs = countryBorder[i].split(',');

                                        countryCoords.push(new google.maps.LatLng(coordPairs[1], coordPairs[0]));
                                    }

                                    coordArray.push(countryCoords);
                                }

                                createCountry(coordArray, country);

                            } else {

                                countryCoords = [];

                                countryBorder = country['xml']['outerBoundaryIs']['LinearRing']['coordinates'].split(' ');

                                for (var j in countryBorder) {

                                    coordPairs = countryBorder[j].split(',');

                                    countryCoords.push(new google.maps.LatLng(coordPairs[1], coordPairs[0]));
                                }

                                createCountry(countryCoords, country);
                            }
                        }.bind(this));

                        showCountries();
                    }
                }.bind(this)
            });
        }

        function showCountries() {
            for (var i = 0; i < countries.length; i++) {
                countries[i].setMap(map);

                // if the user mouses over a country, it will highlight the country yellow
                google.maps.event.addListener(countries[i], "mouseover", function() {
                    this.setOptions({ fillColor: "#f5c879", 'fillOpacity': 0.5 });
                });

                // if the user moves their mouse off of the country the highlight will disappear
                google.maps.event.addListener(countries[i], "mouseout", function() {
                    this.setOptions({ fillColor: "#f5c879", 'fillOpacity': 0 });
                });
                // if they click on the country it will display the name and code
                google.maps.event.addListener(countries[i], 'click', function(event) {
                    alert(this.title + ' (' + this.code + ')');
                });
            }
        }

        function createCountry(coords, country) {
            var currentCountry = new google.maps.Polygon({
                paths: coords,
                strokeColor: 'white',
                title: country.country,
                code: country.iso,
                strokeOpacity: 0,
                strokeWeight: 2,
                fillOpacity: 0
            });

            countries.push(currentCountry);
        }

    }
});

// })
// }

// addToMap("Eiffel Tower");