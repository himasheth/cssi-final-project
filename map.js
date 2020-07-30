const PARIS_LATLONG = { lat: 48.8566, lng: 2.3522 };
const TOKYO_LATLONG = { lat: 35.6762, lng: 139.6503 };
const NEWYORK_LATLONG = { lat: 40.7128, lng: -74.0060 };

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
                    if (this.code == "US" || this.code == "FR" || this.code == "JP") {
                        this.setOptions({ fillColor: "#8B0000", 'fillOpacity': 0.5 });
                    } else {
                        this.setOptions({ fillColor: "#f5c879", 'fillOpacity': 0.5 });
                    }
                });

                // if the user moves their mouse off of the country the highlight will disappear
                google.maps.event.addListener(countries[i], "mouseout", function() {
                    this.setOptions({ fillColor: "#f5c879", 'fillOpacity': 0 });
                });
                // if they click on the country it will display the name and code
                google.maps.event.addListener(countries[i], 'click', function(event) {
                    if (this.code == "US" || this.code == "FR" || this.code == "JP") {
                        gameStart();
                        this.setOptions({})
                    }
                });
            }
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function gameStart() {
            // appends the div that creates the "game beginning" text
            let div = document.createElement('div');
            div.className = "game-start";
            div.innerHTML = "<h1 style = 'color:#009912; font-size: 10vh; font-weight: bold; text-align: center; padding-top: 2vh;'> Game Beginning... <h1>";
            document.body.append(div);
            await sleep(1000);
            document.body.removeChild(div);

            // gets the element and uses the built-in jQuery function in order to fade out
            $('#map').stop().fadeOut('slow');

            // run scenario
            runGame();
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

function runGame() {
    let div = document.createElement('div');
    //append the game instead here (iFrame)
    div.innerHTML = "<script src='script.js'></script>"
    document.body.append(div);
}