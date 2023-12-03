
// Initialize and add the map
let map, markers = [];

async function initMap() {
    // The location of Uluru
    const position = { lat: 35.6764, lng: 139.6500 };
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");


    // The map, centered at Uluru
    map = new Map(document.getElementById("map"), {
        zoom: 12,
        center: position,
        mapId: "DEMO_MAP_ID",
    });


    var request = {
        query: 'restaurants in Tokyo',
        fields: ['ALL'],
    };

    var service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                const m = createMarker(results[i]);
                markers.push(m);
            }
            map.setCenter(results[0].geometry.location);
        }
    });


    function createMarker(place) {
        if (!place.geometry || !place.geometry.location) return;

        const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
        });

        let infoWindow = new google.maps.InfoWindow();
        infoWindow.setPosition(place.geometry.location);
        infoWindow.setContent(`${place.name},\n ${place.formatted_address},\n ${place.website},\n ${place.opening_hours}` || "");

        google.maps.event.addListener(marker, "click", () => {
            infoWindow.open({
                anchor: marker,
                map
            });
        });
        return marker
    }

    // Direction API
    let direction = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();

    // Current Location
    const locationButton = document.createElement("button");
    locationButton.textContent = "Show me the route to the restaurant";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    direction.route({
                        origin: pos,
                        destination: markers[0].position,
                        travelMode: 'WALKING',
                    }, function(result, status) {
                        if (status == 'OK') {
                          directionsRenderer.setDirections(result);
                        }
                    });
                    directionsRenderer.setMap(map);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                },
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

function filterRestaurants() {
    const selectedType = document.getElementById('type-select').value;

    markers.forEach(marker => {
        if (selectedType === 'all' || marker.restaurantType === selectedType) {
            marker.setVisible(true);
        } else {
            marker.setVisible(false);
        }
    });
}

export {initMap, filterRestaurants}
