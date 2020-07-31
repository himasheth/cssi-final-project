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
            backgroundColor: 'none',
            styles: [
                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                {
                    featureType: "administrative.locality",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }]
                },
                {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }]
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{ color: "#263c3f" }]
                },
                {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#6b9a76" }]
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#38414e" }]
                },
                {
                    featureType: "road",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#212a37" }]
                },
                {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9ca5b3" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#746855" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#1f2835" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#f3d19c" }]
                },
                {
                    featureType: "transit",
                    elementType: "geometry",
                    stylers: [{ color: "#2f3948" }]
                },
                {
                    featureType: "transit.station",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#17263c" }]
                },
                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#515c6d" }]
                },
                {
                    featureType: "water",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#17263c" }]
                }
            ]
        };

        let map = new google.maps.Map(document.getElementById('map'), mapOptions);

        initMap();

        // MAPPING CODE 

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

            // gets the element and uses the built-in jQuery function in order to fade out
            $('#map').stop().fadeOut('slow');
            $('#instructions').stop().fadeOut('slow');

            // appends the div that creates the "game beginning" text
            let div = document.createElement('div');
            div.className = "line";
            let load = document.createElement('div');
            load.className = "load";
            load.innerHTML = "Game Loading..."
            document.body.append(div, load);
            await sleep(5000);
            document.body.removeChild(div);
            document.body.removeChild(load);

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