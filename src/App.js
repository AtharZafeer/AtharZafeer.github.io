import React, {Component} from 'react';
import LocationList from './components/LocationList';

class App extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            'alllocations': [
                {
                    'name': "Shree Mithai",
                    'type': "Resturant",
                    'latitude': 13.07211832463662,
                    'longitude': 80.24786485275499,
                    'streetAddress': "T.V Rd, IN"
                },
                {
                    'name': "Subway",
                    'type': "Hotel",
                    'latitude': 13.082454635954866,
                    'longitude': 80.2109266216941,
                    'streetAddress': "Shanthi Colony"
                },
                {
                    'name': "Kabab Corner",
                    'type': "Restaurant",
                    'latitude': 13.06016274522497,
                    'longitude': 80.25448502964797,
                    'streetAddress': "Greams Rd, Thousand Lights East,"
                },
                {
                    'name': "Links",
                    'type': "food",
                    'latitude': 13.079985797801971,
                    'longitude': 80.25460515237084,
                    'streetAddress': "Purasarawalkam"
                },
                {
                    'name': "Chamiers Cafe",
                    'type': "Coffee",
                    'latitude': 13.028241246553115,
                    'longitude': 80.25024020459566,
                    'streetAddress': "Chamiers Rd",
                },
                {
                    'name': "The Marina",
                    'type': "Seafood Restaurant",
                    'latitude': 13.067310668481305,
                    'longitude': 80.25211702382008,
                    'streetAddress': "A-6, Nemi Nagar, Gandhi Path"
                },
                {
                    'name': "Subway",
                    'type': "Hotel",
                    'latitude': 13.061402842754942,
                    'longitude': 80.24852081154127,
                    'streetAddress': "Wallace Garden Road, Nungambakkam"
                },
                {
                    'name': "Barbeque Nation",
                    'type': "resturant",
                    'latitude': 13.052679566222576,
                    'longitude': 80.21255043668754,
                    'streetAddress': "Bhimas, 2nd Floor (Vadapalani)"
                },
                {
                    'name': "Basil - With a Twist",
                    'type': "resturant",
                    'latitude': 13.049632370784241,
                    'longitude': 80.24220962550794,
                    'streetAddress': "58A, Habibullah Road, T Nagar"
                },
                {
                    'name': "Tuscanna At Chamiers",
                    'type': "resturant",
                    'latitude': 13.029150852305433,
                    'longitude': 80.24828935411561,
                    'streetAddress': "Chamiers Road (Nandanam)"
                }
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };

        // retain object instance when used in the function
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCPi0o_tjNjKYYDe_6nYg82r0leI7kKlOE&callback=initMap')
    }

    /**
     * Initialise the map once the google map script is loaded
     */
    initMap() {
        var self = this;

        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: {lat: 13.07211832463662, lng:80.24786485275499},
            zoom: 15,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var alllocations = [];
        this.state.alllocations.forEach(function (location) {
            var longname = location.name + ' - ' + location.type;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            alllocations.push(location);
        });
        this.setState({
            'alllocations': alllocations
        });
    }

    /**
     * Open the infowindow for the marker
     * @param {object} location marker
     */
    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }

    /**
     * Retrive the location data from the foursquare api for the marker and display it in the infowindow
     * @param {object} location marker
     */
    getMarkerInfo(marker) {
        var self = this;
        var clientId = "BVOKFTFGPMBPE4CODCE2O4PTW1002SQCRGIS4TAOE3RBSC4P";
        var clientSecret = "1YKEEUR2DTYJRU1YBPKNDF2BME1TB1KXEDQNFVLKVCDGBHWB";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sorry data can't be loaded");
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function (data) {
                        var location_data = data.response.venues[0];
                        var verified = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
                        var checkinsCount = '<b>Number of CheckIn: </b>' + location_data.stats.checkinsCount + '<br>';
                        var usersCount = '<b>Number of Users: </b>' + location_data.stats.usersCount + '<br>';
                        var tipCount = '<b>Number of Tips: </b>' + location_data.stats.tipCount + '<br>';
                        var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
                        self.state.infowindow.setContent(checkinsCount + usersCount + tipCount + verified + readMore);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }

    /**
     * Close the infowindow for the marker
     * @param {object} location marker
     */
    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    /**
     * Render function of App
     */
    render() {
        return (
            <div>
                <LocationList key="100" alllocations={this.state.alllocations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map" role="application"></div>
            </div>
        );
    }
}

export default App;

/**
 * Load the google maps Asynchronously
 * @param {url} url of the google maps script
 */
function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}
