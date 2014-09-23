var map;
var labdata;
var LabLayer;
var layerControl;
var max_depth=500;
/*
var loadLabDataRingCharts;
var show_loading_layer;
var refresh_compound_layers; 
var updateChemicals;
*/

 function show_loading_layer(msg)
  {
        if(!msg){
                msg = "Updating selected lab results...";
        }

                jQuery(".loading_modal span").text(msg);
                jQuery(".loading_modal").fadeIn();
  }


  function hide_loading_layer()
  {
                jQuery(".loading_modal").fadeOut();
  }


  function refresh_compound_layers() {
        jQuery.getJSON("fxn/labDepthRange3.php", function (data) {
            labdata = data;
            map.removeLayer(LabLayer);
            loadLabDataRingCharts(data,{layerLabel:'Soil Gas Lab Results'});
            map.addLayer(LabLayer);
            heatmapLayer.setData(geojson2heat(data));
            hide_loading_layer();
        });
  }


