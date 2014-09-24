var map;
var labdata;
var LabLayer;
var heatL;
var layerControl;
var max_depth = 500;
var drawCharts;
var max_depth = 500;
d3.select('.modalFilter').on('click', function() {
    show_loading_layer();
    refresh_compound_layers();
    updateChemicals();
    console.log("updated");
})
var baseLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    attribution: 'Azimuth1',
    maxZoom: 22,
    maxNativeZoom: 17,
    id: 'jasondalton.map-7z4qef6u'
});
var streetLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/jasondalton.h4gh1idp/{z}/{x}/{y}.png', {
    attribution: 'Azimuth1',
    maxZoom: 22
});
map = new L.Map('map', {
    attributionControl: false,
    center: new L.LatLng(-12.654, -38.305),
    zoom: 17,
    layers: [baseLayer]
});
layerControl = L.control.layers({
    'Custom imagery background': baseLayer,
    'Street map background': streetLayer
}).addTo(map);
var marker;
var layer;
var littleTriangle = L.icon({
    iconUrl: 'style/images/blutri.png',
    opacity: 0.7,
    iconSize: [12, 12], // size of the icon
    iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 6] // point from which the popup should open relative to the iconAnchor
});
var beaconPoints = L.geoJson(beaconPts, {
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
            icon: littleTriangle
        });
    }
});
map.addLayer(beaconPoints);
layerControl.addOverlay(beaconPoints, 'Beacon survey points');
savedSettings = {};
jQuery.getJSON("php/labDepthRange3.php", function(data) {
    labdata = data;
    var compounds = _.chain(labdata.features).map(function(d) {
        return _.keys(d.properties.Compounds);
    }).flatten().unique().sort().value();
    $.each(compounds, function() {
        compound_name = this.toString();
        if ($("#" + compound_name).length >= 1) {
            return;
        }
        $("#chemical-filter-form").append($("<label>").text(compound_name).prepend($("<input>").attr('type', 'checkbox').val(compound_name).attr('id', compound_name).attr('class',
            'chemical-filters')));
    });
});