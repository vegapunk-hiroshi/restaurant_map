
// Initialize and add the map
let map, markers = [];

async function initMap() {
    console.log('maps loading...')

    // The location of Uluru
    const position = { lat: -25.344, lng: 131.031 };
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const {Place} = await google.maps.importLibrary("places");

    // const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

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
        console.log('result', results)
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                console.log('results', i)
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
