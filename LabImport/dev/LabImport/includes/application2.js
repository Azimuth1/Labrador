var drawCharts;
var max_depth = 500;

$(document).ready(function () {


});



function updateChemicals() {
    var selectedChemicals = '';
    $('#chemical-filter-form input[type=checkbox]:checked').map(
        function () {
            if (selectedChemicals != '') {
                selectedChemicals = selectedChemicals + ', ';
            }
            selectedChemicals = selectedChemicals + this.value;
        }).get()

    $.ajax({
        url: 'filter_chemicals.php',
        type: 'post',
        data: {
            chemical_filters: selectedChemicals
        },
        success: function (data) {}

    });
}
