function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function readablize(val, unit) {
    if (!isNumber(val)) {
        return val;
    }
    if (val < 1000) {
        return val + ' ' + unit;
    }
    var s = [', ', 'K ', 'M ', 'B ', 'T '];
    var e = Math.floor(Math.log(val) / Math.log(1000));
    return (val / Math.pow(1000, e)).toFixed(2) + " " + s[e] + unit;
}
$(document).ready(function() {
    var l0to500kRadius = new L.LinearFunction(new L.Point(0, 4), new L.Point(10, 6));
    var l500to1mRadius = new L.LinearFunction(new L.Point(10, 6), new L.Point(100, 10));
    var l1mTo5mRadius = new L.LinearFunction(new L.Point(100, 10), new L.Point(1000, 14));
    var l5mPlusRadius = new L.LinearFunction(new L.Point(1000, 14), new L.Point(100000000, 18));
    var labRadius = new L.PiecewiseFunction([l0to500kRadius, l500to1mRadius, l1mTo5mRadius, l5mPlusRadius]);
    var logRadius = function(value) {
        return (Math.log(value + 1) / Math.LN10) / 2; //Add 1 to value to prevent returning negative values for values (0-1)
    }
    var labColorFunction = function(value) {
        var color;
        if (isNumber(value)) {
            switch (true) {
                case (value > 100000):
                    color = "#FF0000"; //red
                    break;
                case (value > 10000):
                    color = "#8B4513"; //brown
                    break;
                case (value > 1000):
                    color = "#FF7F24"; //orange
                    break;
                case (value > 100):
                    color = "#CDAD00"; //gold
                    break;
                case (value > 10):
                    color = "#FFD700"; //yellow
                    break;
                default:
                    color = "#AAAAAA"; //grey
            };
            return color;
        };
        return "#AAAAAA";
    };
    var baseLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/jasondalton.map-7z4qef6u/{z}/{x}/{y}.png', {
        attribution: 'Azimuth1',
        maxZoom: 22,
        maxNativeZoom: 17
    });
    geojson2heat = function(geojson, options) {
        options = options || {};
        var heat = geojson.features.map(function(d) {
            var lng = d.geometry.coordinates[0];
            var lat = d.geometry.coordinates[1];
            var compounds = d.properties.Compounds;
            var sum = 0;
            for (var key in compounds) {
                //Convert val from string to numeric
                var number = compounds[key].replace(',', '');
                //If it's not a number, ignore it. If it is, we are good
                var val = !isNaN(number) ? +number : null;
                if (val) {
                    //add number to the total sum in the feature
                    sum += val;
                }
            }
            return [lat, lng, sum];
        });
        //filter if you don't want 0 values included. Not sure if it makes a difference
        if (options.filter) {
            heat = heat.filter(function(array) {
                return array[2] !== 0;
            });
        }
        return heat;
    };
    map = new L.Map('map', {
        attributionControl: false,
        center: new L.LatLng(-12.654, -38.305),
        zoom: 17,
        layers: [baseLayer]
    });
    //baseLayer.addTo(map);
    var resize = function() {
        var $map = $('#map');
        $map.height($(parent).height() - 70);
        if (map) {
            map.invalidateSize();
        }
    };
    $(window).on('resize', function() {
        resize();
    });
    resize();
    var streetLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/jasondalton.h4gh1idp/{z}/{x}/{y}.png', {
        attribution: 'Azimuth1',
        maxZoom: 22
    });
    layerControl = L.control.layers({
        'Street map background': streetLayer,
        'Custom imagery background': baseLayer
    }).addTo(map);
    var marker;
    var layer;
    var littleTriangle = L.icon({
        iconUrl: 'blutri.png',
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
    var savedSettings = {};
    //New CoxcombCharts for labs
    loadLabDataRingCharts = function(geojson, options1) {
        testName = geojson;
        //if(!geojson){return}
        //if(!geojson.features[0].properties.Compounds){console.log('kyle says - incorrect geojson format')}
        options1 = options1 || {};

        function getKeys(data) {
            return _.chain(data.features).map(function(d) {
                return _.keys(d.properties.Compounds);
            }).flatten().unique().sortBy().value();
        }

        function getmaxValue(data) {
            return _.chain(data.features).map(function(d) {
                return +_.max(d.properties.Compounds, function(d) {
                    return +d;
                });
            }).max().value();
        }

        function filter(d, filters) {
            if (!filters.length) {
                return d;
            }
            d.features.forEach(function(feature) {
                var compounds = feature.properties.Compounds;
                for (var key in compounds) {
                    if (filters.indexOf(key) == -1) {
                        delete compounds[key];
                    }
                }
            });
            return d;
        }
        var newMarker = function(feature) {
            var compounds = feature.properties.Compounds;
            var generateOptionsData = function(d) {
                var data = {};
                for (var key in d) {
                    var value = +d[key];
                    //data[key] = (value > 0) ? x(value) : (value < 0) ? 0 : ((x(0) * noData));
                    //data[key] = isNumber(value) ? logRadius(value) : noData;
                    data[key] = isNumber(value) ? logRadius(value) : (value == 'ND') ? noData : 0;
                }
                return data;
            };
            var generateOptionsChartOptions = function(d) {
                colo = function(item, obj) {
                    if (isNaN(obj[key])) {
                        return '#818181';
                    }
                    return colorScale(item);
                };
                var data = {};
                for (var key in d) {
                    var val = d[key];
                    var obj = {};
                    obj.fillColor = colo(key, d);
                    obj.color = '#fff';
                    obj.minValue = 0;
                    obj.maxValue = radius;
                    obj.origValue = val;
                    obj.displayText = function(value) {
                        return readablize(this.orig[this.key], 'ng');
                    };
                    data[key] = obj;
                }
                return data;
            };
            var options = {
                radius: radius,
                fillOpacity: 0.8,
                mouseOverExaggeration: 1,
                opacity: 1,
                color: '#fff',
                weight: 1,
                gradient: false,
                dropShadow: false,
            };
            options.tooltipOptions = {
                // iconSize: new L.Point(90, 76),
                // iconAnchor: new L.Point(-4, 76)
            };
            options.data = generateOptionsData(compounds);
            options.orig = compounds;
            options.chartOptions = generateOptionsChartOptions(compounds);
            options.table = feature.properties;
            var coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
            return new L.CoxcombChartMarker(coords, options);
        };
        var radius = options1.radius || 600;
        var scale = options1.scale || [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
        var noData = options1.noData || scale[0];
        var colors = options1.colorScale || ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]
        var layerLabel = options1.layerLabel || 'Soil Gas Lab Results';
        filterItems = [];
        $('.chemical-filters:checked').each(function(d, e) {
            filterItems.push(e.value)
        })
        LabLayer = L.geoJson();
        if (filterItems.length) {
            geojson = filter(geojson, filterItems);
            var MaxLab = (savedSettings.MaxLab) ? savedSettings.MaxLab : getmaxValue(geojson);
            savedSettings.MaxLab = MaxLab;
            var colorScale = (savedSettings.colorScale) ? savedSettings.colorScale : d3.scale.ordinal().range(colors);
            savedSettings.colorScale = colorScale;
            //   var  x = (savedSettings.x) ? savedSettings.x :  linearBucket(geojson);
            //savedSettings.x=x
            geojson.features.forEach(function(data) {
                marker = newMarker(data);
                var $html = $(L.HTMLUtils.buildTable(marker.options.table));
                marker.bindPopup($html.wrap('<div/>').parent().html(), {
                    minWidth: 400,
                    maxWidth: 400
                });
                LabLayer.addLayer(marker);
            });
        }
        map.addLayer(LabLayer);
        layerControl.addOverlay(LabLayer, layerLabel);
        //lastLayer = LabLayer;
    };

    function setup_chemical_filter_form() {
        $.getJSON('get_chemical_filters.php', function(filters) {
            labdata = jQuery.getJSON("fxn/labDepthRange3.php", function(data) {
                var hasLab = map.hasLayer(LabLayer);
                map.removeLayer(LabLayer);
                layerControl.removeLayer(LabLayer);
                loadLabDataRingCharts(data);
                if (hasLab) {
                    map.addLayer(LabLayer);
                }
            });
        });
    }
    jQuery.getJSON("fxn/labDepthRange3.php", function(data) {
        labdata = data;
        var compounds = _.chain(labdata.features).map(function(d) {
            return _.keys(d.properties.Compounds)
        }).flatten().unique().sort().value();
        $.each(compounds, function() {
            compound_name = this.toString();
            if ($("#" + compound_name).length >= 1) {
                return;
            }
            $("#chemical-filter-form").append($("<label>").text(compound_name).prepend($("<input>").attr('type', 'checkbox').val(compound_name).attr('id', compound_name).attr('class', 'chemical-filters')));
        });
        //setup_chemical_filter_form();
        loadLabDataRingCharts(labdata, {
            layerLabel: 'Soil Gas2 Lab Results'
        });
    });
}); //end doc ready.




