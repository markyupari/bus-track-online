//personal token needed to get access to mapbox data
mapboxgl.accessToken = 'pk.eyJ1IjoibWFyay15dXBhcmkiLCJhIjoiY2xpdG5xbHkyMjFiajNmdGhneGh4cmwwMyJ9.U23WuvAQXRpsrNzvsS5pfQ';

//creating map with properties
var map = new mapboxgl.Map({
    container: 'map', //DOM element that will contain map
    style: 'mapbox://styles/mapbox/navigation-night-v1', //style for the map view
    center: [-77.021292, 38.884838], //initial center location of map
    zoom: 15 //map zoom
});
// geojson variable to customize marker
const geojson = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'properties': {
                'iconSize': [40, 40]
            },
            'geometry': {
                'type': 'Point',
            }
        },    
    ]
    };

//code for changing the size and background image of the marker
for (const marker of geojson.features) {
    const el = document.createElement('div');
    const width = marker.properties.iconSize[0];
    const height = marker.properties.iconSize[1];
    el.className = 'marker';
    //getting image from internet
    el.style.backgroundImage = 'url(https://www.shutterstock.com/image-vector/icon-school-bus-education-elements-600w-2294736277.jpg)';
    //properties defined at the geojson variable
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = '100%';
    //creating marker with custom image and size
    var busMarker = new mapboxgl.Marker(el)
        .setLngLat([-77.021292, 38.884838]) //Asigning Longitude and Latitude for marker
        .addTo(map); //adding marker to map created previously
}

//getting data from Washington Metropolitan Area Transit Authority API
async function getRealTimeLocation() {
    $(function () {
        var params = {
            "api_key": "1192de8d2dad43f68e27fb55a309e7ad", //personal key
            // Request parameters
            //"RouteID": "70", //ID of bus route
        };
        //requesting data from Washington Metropolitan Area Transit Authority
        $.ajax({
            url: "https://api.wmata.com/Bus.svc/json/jBusPositions?" + $.param(params),
            type: "GET",
        })
        .done(function(data) {
            console.log(new Date());
            console.log(data);
            //updating marker position
            busMarker.setLngLat([data.BusPositions[0].Lon , data.BusPositions[0].Lat]);
            map.setCenter([data.BusPositions[0].Lon , data.BusPositions[0].Lat]);
        })
        .fail(function() {
            alert("error");
        });
    });

}

//calling function every 15 seconds
async function run(){
    await getRealTimeLocation();
    setTimeout(run, 15000);
}


