/** @odoo-module **/

var marker
var map
$(document).ready(async function () {
    try {
    
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            var lat = position.coords.latitude
            var lng = position.coords.longitude
            console.log("4444444444444444444444444444", lat, lng);
            // var lat = 9.9610510
            // var lng = 76.2961325
            try {


                map = new Map(document.getElementById('map'), {
                    zoom: 14,
                    center: { lat, lng },
                    mapId: "4504f8b37365c3d0",
                });



                function update_driver_location() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            console.log("222222222222222222222222222222", position);
                            var pos = {
                                'lat': position.coords.latitude,
                                'lng': position.coords.longitude
                            };
                            if (marker) {
                                marker.map = null;
                            }

                            const carIconPng = document.createElement("img");
                            carIconPng.src = "pragmatic_fleet_management/static/src/images/icons8-car-94.png"
                            carIconPng.style = 'width:50px'
                            marker = new AdvancedMarkerElement({
                                map,
                                position: { lat: pos.lat, lng: pos.lng },
                                content: carIconPng,
                                // animation: google.maps.Animation.DROP
                            });


                            $.ajax({
                                url: "/update-driver-location",
                                async: true,
                                timeout: 5000,
                                data: pos,
                                success: function (res) {
                                    let data = JSON.parse(res)
                                    $('#route_values').val(JSON.stringify(data['routes']))
                                },
                            });
                        });
                    }
                }
                setInterval(function () {
                    update_driver_location()
                }, 5000);
            }
            catch (error) {

            }


        })



    }
}
catch {
    
}


})