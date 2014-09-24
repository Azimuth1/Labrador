var map;
var labdata;
var LabLayer;
var heatL;
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
      jQuery.getJSON("fxn/labDepthRange3.php", function(data) {
      hide_loading_layer();
      var filteredData = loadLabDataRingCharts(data);
      addLabLayer(filteredData);
      addHeat(filteredData);





      });
  }

function addLabLayer(filteredData){
          if (LabLayer) {
              map.removeLayer(LabLayer);
              layerControl.removeLayer(LabLayer);
          }
          LabLayer = filteredData[0];
          map.addLayer(LabLayer);
          layerControl.addOverlay(LabLayer, 'Soil Gas Lab Results');
  
}


function addHeat(filteredData){console.log(heatL)
            if (heatL) {
              map.removeLayer(heatL);
              layerControl.removeLayer(heatL);
          }
          heatL = new HeatmapOverlay({
              "radius": 40,
              "maxOpacity": 0.8,
              "scaleRadius": true,
              "useLocalExtrema": true,
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
