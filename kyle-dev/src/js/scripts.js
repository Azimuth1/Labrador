_loadLabDataRingCharts = function(_geojson, options1) {

if(typeof layerTracker == 'undefined' || !layerTracker){
    layerTracker = [];
}



if(layerTracker.length){
layerTracker.forEach(function(d,e){
    layerControl.removeLayer(d);
    map.removeLayer(d);
    layerTracker = [];
})

}
    var addLayer = function(geojson,options1,name) {
        testName = geojson;
        options1 = options1 || {};

        function getKeys(data) {
            return _.chain(data.features)
                .map(function(d) {
                    return _.keys(d.properties.Compounds);
                })
                .flatten()
                .unique()
                .sortBy()
                .value();
        }

        function getmaxValue(data) {
            return _.chain(data.features)
                .map(function(d) {
                    return +_.max(d.properties.Compounds,
                        function(d) {
                            return +d;
                        });
                })
                .max()
                .value();
        layerVis = _.object(_.map(layerTracker.map(function(d, i) {
                var s = ['Soil', 'Water', 'Vapor', 'MW'];
                var obj = {};
                return {
                        name: s[i],
                        exists: map.hasLayer(d)
                };
        }), function(x) {
                return [x.name, x.exists];
        }));
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
                    data[key] = isNumber(value) ? logRadius(
                            value) : (value == 'ND') ? noData :
                        0;
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
                var radColors = {'Soil':'#614126','Water':'#0000ff','Vapor':'#00ff00','MW':'#ff0000'}
                var radiusC = radColors[name] || '#fff';
                for (var key in d) {
                    var val = d[key];
                    var obj = {};
                    obj.fillColor = colo(key, d);
                    obj.color = radiusC;
                    obj['stroke-width']='10px';
                    obj.minValue = 0;
                    obj.maxValue = radius;
                    obj.origValue = val;
                    obj.displayText = function(value) {
                        return readablize(this.orig[this.key],
                            'ppb');
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
                'stroke-width':'10px',
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
            options.chartOptions = generateOptionsChartOptions(
                compounds);
            options.table = feature.properties;
            var coords = [feature.geometry.coordinates[1], feature.geometry
                .coordinates[0]];
            return new L.CoxcombChartMarker(coords, options);
                if (visible) {
                        map.addLayer(LabLayer);
                }
        };
        var radius = options1.radius || 600;
        var scale = options1.scale || [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8,
            0.9, 1];
        var noData = options1.noData || scale[0];
        var colors = options1.colorScale || ["#8dd3c7", "#ffffb3",
            "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69",
            "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"];

        var ctrlNames = {'Soil':'Soil Labs','Water':'Water Labs','Vapor':'Vapor Labs','MW':'Monitoring Wells'}
        var layerLabel = ctrlNames[name] || 'Lab Results';



        filterItems = [];
        $('.chemical-filters:checked')
            .each(function(d, e) {
                filterItems.push(e.value)
            })



        LabLayer = L.geoJson();
        if (filterItems.length) {
            geojson = filter(geojson, filterItems);
            var MaxLab = (savedSettings.MaxLab) ? savedSettings.MaxLab :
                getmaxValue(geojson);
            savedSettings.MaxLab = MaxLab;
            var colorScale = (savedSettings.colorScale) ? savedSettings
                .colorScale : d3.scale.ordinal()
                .range(colors);
            savedSettings.colorScale = colorScale;
            //   var  x = (savedSettings.x) ? savedSettings.x :  linearBucket(geojson);
            //savedSettings.x=x
            geojson.features.forEach(function(data) {
                marker = newMarker(data);
                var $html = $(L.HTMLUtils.buildTable(marker.options
                    .table));
                marker.bindPopup($html.wrap('<div/>')
                    .parent()
                    .html(), {
                        minWidth: 400,
                        maxWidth: 400
                    });
                LabLayer.addLayer(marker);
            });
        }
        layerTracker.push(LabLayer);
        map.addLayer(LabLayer);
        layerControl.addOverlay(LabLayer, layerLabel);
        lastLayer = LabLayer;
    };




if(_geojson.features){addLayer(_geojson);}
 
    _.each(_geojson, function(d,name) {
        if(!d.features){return}
        addLayer(d,options1,name)
    })



                var vis = layerVis[name] ? true : false;
                if (!Object.keys(layerVis).length) {
                        vis = true;
                }
};












function show_loading_layer(msg) {
    if (!msg) {
        msg = "Updating selected lab results...";
    }
    jQuery(".loading_modal span").text(msg);
    jQuery(".loading_modal").fadeIn();
}

function hide_loading_layer() {
    jQuery(".loading_modal").fadeOut();
}

function refresh_compound_layers() {


    jQuery.getJSON("../data/labDepthRange3.js", function(data) {
        hide_loading_layer();
        /*Water={"type":"FeatureCollection",features:_.sample(labdata.features,5)}
        Soil={"type":"FeatureCollection",features:_.sample(labdata.features,5)}
        Vapor={"type":"FeatureCollection",features:_.sample(labdata.features,10)}
        MW={"type":"FeatureCollection",features:_.sample(labdata.features,10)}

        test = {Water:Water,Soil:Soil,Vapor:Vapor,MW:MW};
        //console.log(test)
        _loadLabDataRingCharts(test);*/


        var filteredData = _loadLabDataRingCharts(data);
        //var filteredData = _loadLabDataRingCharts(data);
        //console.log(filteredData);
        //addLabLayer(filteredData);
        //addHeat(filteredData);
    });






}

function addLabLayer(filteredData) {
    if (LabLayer) {
        map.removeLayer(LabLayer);
        layerControl.removeLayer(LabLayer);
    }
    LabLayer = filteredData[0];
    map.addLayer(LabLayer);
    layerControl.addOverlay(LabLayer, 'Soil Gas Lab Results');
}

function addHeat(filteredData) {
    if (heatL) {
        map.removeLayer(heatL);
        layerControl.removeLayer(heatL);
    }
    heatL = new HeatmapOverlay({
        "radius": 60,
        "maxOpacity": 0.8,
        "scaleRadius": true,
        "useLocalExtrema": false,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count'
    });
    heatData = geojson2heat(filteredData[1]);
    console.log(heatData);
    map.addLayer(heatL);
    layerControl.addOverlay(heatL, 'HeatLayer');
    heatL.setData(heatData);
}

function isNumber(n) {
    return val = parseFloat(n) ? true : false;
}
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
            //var val = !isNaN(number) ? +number : null;
            var val = isNumber(number) ? +number : null;
            if (val) {
                //add number to the total sum in the feature
                sum += val;
            }
        }
        return {
            lat: lat,
            lng: lng,
            count: sum,
        };
    });
    //filter if you don't want 0 values included. Not sure if it makes a difference
    if (options.filter) {
        heat = heat.filter(function(array) {
            return array[2] !== 0;
        });
    }
    minmax = d3.extent(heat, function(d) {
        return d.count;
    });
    return {
        max: minmax[1],
        min: minmax[0],
        data: heat
    };
};

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
loadLabDataRingCharts = function(geojson, options1) {
    options1 = options1 || {};
    var labLayer = L.geoJson();

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
                var value = +d[key].replace(',', '');
                data[key] = isNumber(value) ? logRadius(value) : (value == 'ND') ? noData : 0;
            }
            return data;
        };
        var generateOptionsChartOptions = function(d) {
            colo = function(item, obj) {
                if (isNaN(obj[key])) {
                    //console.log(obj[key])
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
    var colors = options1.colorScale || ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"];
    filterItems = [];
    $('.chemical-filters:checked').each(function(d, e) {
        filterItems.push(e.value);
    });
    if (filterItems.length) {
        geojson = filter(geojson, filterItems);
        var MaxLab = (savedSettings.MaxLab) ? savedSettings.MaxLab : getmaxValue(geojson);
        savedSettings.MaxLab = MaxLab;
        var colorScale = (savedSettings.colorScale) ? savedSettings.colorScale : d3.scale.ordinal().range(colors);
        savedSettings.colorScale = colorScale;
        geojson.features.forEach(function(data) {
            marker = newMarker(data);
            var $html = $(L.HTMLUtils.buildTable(marker.options.table));
            marker.bindPopup($html.wrap('<div/>').parent().html(), {
                minWidth: 400,
                maxWidth: 400
            });
            labLayer.addLayer(marker);
        });
        return [labLayer, geojson];
    }
};
var logRadius = function(value) {
    return (Math.log(value + 1) / Math.LN10) / 2; //Add 1 to value to prevent returning negative values for values (0-1)
};
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