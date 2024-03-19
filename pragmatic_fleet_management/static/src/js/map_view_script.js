/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, onWillStart, onMounted, useState } from "@odoo/owl";
import { loadJS } from "@web/core/assets";
import { useEffect, useService } from "@web/core/utils/hooks";
import { markup } from "@odoo/owl";


export class MapView extends Component {

    setup() {

        this.state = useState({
            value: this.props.value,
            markers: [],
          });
        // onWillStart(this.onWillStart.bind(this));
        // onMounted(this.onMounted.bind(this));

        this.orm = useService("orm");
        console.log("((((((((((((((((((((((((11111111111)))))))))))))))))))))))", this);

        this.initialize();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    'lat': position.coords.latitude,
                    'lng': position.coords.longitude
                };
                console.log("11111111111111111111111111111111111111111111", position);

            })
        }

    }


/////////////////////////////////////////////////////////////////////////////

    // self.env.services.rpc("/web/dataset/call_kw/pos.config/action_send_whatsapp_msg", {
    //     model: 'pos.config',
    //     method: 'action_send_whatsapp_msg',
    //     args: [payload.template_id, payload.message, payload.mobileNo],
    //     kwargs: {},
    // });

/////////////////////////////////////////////////////////////////////////////


    // async onWillStart() {

    // }
    // async onMounted() {

    // }
/////////////////////////////////// Initializong Map view //////////////////////////////////
    async initialize() {
        var self = this;
        const google_map_api = await self.orm.call('res.config.settings', 'get_map_api_key', [0])
        console.log("google api key ===========", google_map_api);
        (g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })
            ({ key: google_map_api, v: "weekly" })

        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", Map);
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
        // let markers = [];
        // self.state.markers

        var map
        var lat
        var lng

        var hide = $('#hide-slider')
        hide.click(() => {
            $('.mapController').animate({ left: '-500px' }, 1000);
            setTimeout(function () {
                $('.mapController').addClass('d-none');
                clearTimeout(self);
            }, 1000)
        })
        var show = $('#show-slider')
        show.click(() => {
            $('.mapController').animate({ left: '0' }, 800).removeClass('d-none');

        })

//////////////////////////////////// FIRST MAP LOADING ////////////////////////////////////
        function view_map() {
            if (lat && lng) {
                map = new Map(document.getElementById('map'), {
                    center: { lat: lat, lng: lng },
                    zoom: 10,
                    mapId: "4504f8b37365c3d0",
                });

            }
            else {
                map = new Map(document.getElementById('map'), {
                    center: { lat: 0.0, lng: 0.0 },
                    zoom: 8,
                    mapId: "4504f8b37365c3d0",
                });

            }

        }

///////////////////////////////////// GETTING CURRENT LOCATION ///////////////////////////
        async function get_location() {
            if (navigator.geolocation) {
                await navigator.geolocation.watchPosition(function (position) {
                    console.log("latitude", position.coords.latitude);
                    console.log("longitude", position.coords.longitude);
                    lat = position.coords.latitude,
                        lng = position.coords.longitude

                })
                view_map()

            }

        }
        get_location()

///////////////////////////// GETTING ALL FLEET MEMBERS FOR SELECTION ////////////////////////

        const result = await self.orm.call('res.partner', 'get_all_drivers', [0])
        console.log("==============================", result);
        const drivers = result
        const selection = $('#driver_selection')
        selection.append(`<option value="all">All</options>`)

        for (let i = 0; i < drivers.length; i++) {

            selection.append(`<option value="${drivers[i].id}">${drivers[i].name}</options>`)

        }
        new MultiSelectTag('driver_selection')
        var all_drivers_list = []

//////////////////////////////// IF ALL IN SELECTION /////////////////////////////
        async function group_fleet_members() {
            console.log("(((((((((((((((((((((((()))))))))))))))))))))))", self.orm.rpc);
            const all_drivers = await self.orm.rpc('/get-driver-location', {})
            
            console.log("------------------------ result ----------------", all_drivers);

            if (all_drivers.length >=0) {
                    for (let i = 0; i < self.state.markers.length; i++) {
                        self.state.markers[i].setMap(null);
                    }
                    self.state.markers = []
                    all_drivers.forEach(elem => {


                        const infoContent = '<div class="info-content" id="content">' + '<img class="map_image" src="' + elem.image + '" />' + '<h2 class="driver_name">' + elem.name + '</h2>' +
                            '</div><div>' + '<h4 class="vehecle_number">' + elem.vehicle_number + '</h4>' + '</div>'

                        const infowindow = new google.maps.InfoWindow({
                            content: infoContent,
                            ariaLabel: elem.name
                        });
                        const carIconPng = document.createElement("img");
                        console.log("***************8 vehicle type **************************", elem.vehicle_type);
                        if (elem.vehicle_type == 'car'){
                            carIconPng.src = "pragmatic_fleet_management/static/src/images/icons8-car-94.png"
                            carIconPng.style = 'width:50px'
                        }
                        else if(elem.vehicle_type == 'bike') {
                            carIconPng.src = "pragmatic_fleet_management/static/src/images/icons8-bike-94.png"
                            carIconPng.style = 'width:60px'
                        }
                        else if(elem.vehicle_type == 'picup'){
                            carIconPng.src = "pragmatic_fleet_management/static/src/images/icons8-pickup-64.png"
                            carIconPng.style = 'width:50px'
                        }
                        else if(elem.vehicle_type == 'bus'){
                            carIconPng.src = "pragmatic_fleet_management/static/src/images/icons8-bus-94.png"
                            carIconPng.style = 'width:40px'
                        }
                        else if(elem.vehicle_type == 'truck'){
                            carIconPng.src = "pragmatic_fleet_management/static/src/images/icons8-truck-94.png"
                            carIconPng.style = 'width:50px'
                        }

                        const marker = new AdvancedMarkerElement({
                            map,
                            position: { lat: elem.partner_lat, lng: elem.partner_lng },
                            content: carIconPng,
                            title: infoContent,
                            // animation: google.maps.Animation.DROP
                        });
                        marker.addListener("click", function () {
                            infowindow.open({
                                anchor: marker,
                                map,
                            });
                        })
                        infowindow.open({
                            anchor: marker,
                            map,
                        });
                        self.state.markers.push(marker)




                    })
            }
        }



        async function signInOut() {
            navigator.geolocation.getCurrentPosition(
                async ({coords: {latitude, longitude}}) => {
                    console.log("llllllllllllllllllllllllllllllllllll", latitude);
                    console.log("oooooooooooooooooooooooooooooooooooo", longitude);
                    await self.orm.rpc("/hr_attendance/systray_check_in_out", {
                        latitude,
                        longitude
                    })
                    // await this.searchReadEmployee()
                },
                async err => {
                    await this.rpc("/hr_attendance/systray_check_in_out")
                    // await this.searchReadEmployee()
                }
            )
        }
        signInOut()

        
//////////////////////////////////// IN NOT ALL AND EACH ONE ////////////////////////////////
        async function individual_members() {
            console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]", self);
            for (let i = 0; i < self.state.markers.length; i++) {
                self.state.markers[i].map = null;
            }
            self.state.markers = []
            all_drivers_list.forEach(async (elem) => {
                // const all_drivers = await self.orm.rpc('/get-driver-location', {})
                const results = await self.orm.rpc('/get-driver-location', {"param" : elem})
                console.log("[[[[[[[[[[[[[[[[[[ result ]]]]]]]]]]]]]]]]]]]", results);
                if (results) {

                        const infoContent = '<div class="info-content" id="content">' + '<img class="map_image" src="' + results[0].image + '" />' + '<h2 class="driver_name">' + results[0].name + '</h2>' +
                            '</div><div>' + '<h4 class="vehecle_number">' + results[0].vehicle_number + '</h4>' + '</div>'

                        const infoWindow = new google.maps.InfoWindow({
                            content: infoContent,
                            ariaLabel: results[0].name
                        });
                        const carIconPng = document.createElement("img");
                        console.log("***************8 vehicle type **************************", results[0].vehicle_type);
                        if (results[0].vehicle_type == 'car'){
                            carIconPng.src = "pragmatic_fleet_management/static/src/images/icons8-car-94.png"
                            carIconPng.style = 'width:50px'

                        }
                        else if(results[0].vehicle_type == 'bike') {
                            carIconPng.src = "pragmatic_fleet_management/static/src/images/icons8-bike-94.png"
                            carIconPng.style = 'width:60px'

                        }
                        else if(results[0].vehicle_type == 'picup'){
                            carIconPng.src = "pragmatic_fleet_management/static/src/images/icons8-pickup-64.png"
                            carIconPng.style = 'width:50px'

                        }
                        else if(results[0].vehicle_type == 'bus'){
                            carIconPng.src = "pragmatic_fleet_management/static/src/images/icons8-bus-94.png"
                            carIconPng.style = 'width:40px'

                        }
                        else if(results[0].vehicle_type == 'truck'){
                            carIconPng.src = "pragmatic_fleet_management/static/src/images/icons8-truck-94.png"
                            carIconPng.style = 'width:50px'

                        }                                
                        const marker = new AdvancedMarkerElement({
                            map,
                            position: { lat: results[0].partner_lat, lng: results[0].partner_lng },
                            content: carIconPng,
                            title: infoContent,
                            // animation: google.maps.Animation.DROP
                        });
                        marker.addListener("click", function () {
                            infoWindow.open({
                                anchor: marker,
                                map,
                            });
                        })
                        infoWindow.open({
                            anchor: marker,
                            map,
                        });
                        self.state.markers.push(marker)
                }

            })
        }
        selection_change()

////////////////////////////////// ON SELECTION CHANGE //////////////////////////////
        async function selection_change() {
            var selected = document.querySelectorAll('.item-container')

            if (selected.length > 0) {
                all_drivers_list = []
                selected.forEach(element => {
                    all_drivers_list.push(element.innerText)

                });
            }
            else {
                all_drivers_list = []
            }
        }
        group_fleet_members()

////////////////////////////////////// UPDATING MARKER ////////////////////////////////////
        async function marker_change() {
            await selection_change()
            if (all_drivers_list.length == 0) {
                for (let i = 0; i < self.state.markers.length; i++) {
                    self.state.markers[i].map = null;
                }
                self.state.markers = []

            }
            else if (all_drivers_list.includes('All')) {
                await group_fleet_members()
            }
            else {
                await individual_members()
            }

        }
        $('.mult-select-tag').on('click', function () {
            // console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww", this);
            var selected = $(this).find('div.item-container')
            console.log("sssssssssssssssssssssssssssssssssss", selected);
            if (selected.length >= 0){
                
            }
            marker_change()

        })
        setInterval(async function () {
            marker_change()
            // const results = await self.orm.call('res.partner', 'get_all_drivers', [0])
            // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", results);
        }, 5000, 10)


    }



}


MapView.template = 'MapView'
registry.category('actions').add('owl.map_view', MapView)