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

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 49, lng: -80 },
        zoom: 8
    });
}
// })
// }

// addToMap("Eiffel Tower");