	
// Create custom style for errors
function errorTrue(instance, td, row, col, prop, value, cellProperties) {
Handsontable.renderers.TextRenderer.apply(this, arguments);
td.style.color = 'red';
td.style.background = '#ffcccc';
}
Handsontable.renderers.registerRenderer('errorTrue', errorTrue);


function process_wb(wb) {
	// Generate headers for HOT
	var schema = {};
	var headers = [];
	var reg = /^\w[1]$/;
	var wb_sheet = wb["Sheets"][wb.SheetNames[0]];
	for(key in wb_sheet) {
		if (key.match(reg)) {
			var header = wb_sheet[key]['h'];
			schema[header] = null;
			headers.push(header);
		}
	}

	// Convert the workbook (wb) from SheetJS to JSON for handsontable
	var data = to_json(wb)[wb.SheetNames[0]];
	
	// Set up HOT object!
	var container = document.getElementById('viewer');
	var hot = new Handsontable(container, {
	  data: data,
	  dataSchema: schema,
	  colHeaders: headers,
	  rowHeaders: false,
	  contextMenu: true,
	  stretchH: 'all'
	});

	// Error checking
	var req = ["SampleID", "SiteName", "StationName", "Date", "TopDepth", "BottomDepth", "Basis", "Matrix", "Compound", "Dilution", "Value", "Units"];
	var check;
	headers.forEach(function(verify) {
	reqIndex = req.indexOf(verify);
	console.log(req[reqIndex]);
	if(req[reqIndex] == verify) { 
		check = 0; 
		console.log((req[reqIndex])+" <---> "+verify);
	} 
	else { 
		check = 1; 
		console.log((req[reqIndex])+" <---> "+verify);
	}
	});

	// Make SUBMIT button visible
	document.getElementById('submitJSON').style.visibility='visible';
	var submitButton = document.getElementById('submitJSON');

	// Submit data
	submitButton.addEventListener('click', function() {
		output = JSON.stringify(data);
		//console.log(output);
		$.ajax({
			type: 'POST',
			data: output,
			dataType: 'json',
			url: 'dataUpload.php',
			success: function(data){
			   alert('Items added');
			},
			error: function(e){
			   console.log('e.message');
			}
		});
	})
}

