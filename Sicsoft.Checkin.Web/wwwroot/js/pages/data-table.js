//[Data Table Javascript]

//Project:	Azurex Admin - Responsive Admin Template
//Primary use:   Used only for the Data Table

$(function () {
    "use strict";

	$('#example1').DataTable({
		dom: 'Bfrtip',
		buttons: [
			'copy', 'excel', 'pdf', 'print'
		],
		'paging': true,
		'lengthChange': true,

		'autoWidth': true,
		responsive: false,
		order: [[0, "desc"]]

	});
    $('#example2').DataTable({
      'paging'      : true,
      'lengthChange': false,
      'searching'   : false,
      'ordering'    : true,
      'info'        : true,
      'autoWidth'   : false
    });
	$('#example3').DataTable({
		 
		'paging': true,
		'lengthChange': true,
		'searching': true,
		'ordering': true,
		'info': true,
		'autoWidth': true,
		order: [[0, "desc"]]
	});
	
	$('#example').DataTable( {
		dom: 'Bfrtip',
		buttons: [
			'copy', 'csv', 'excel', 'pdf', 'print'
		]
	} );
	
	$('#tickets').DataTable({
	  'paging'      : true,
	  'lengthChange': false,
	  'searching'   : false,
	  'ordering'    : true,
	  'info'        : true,
	  'autoWidth'   : false,
	});
	
  }); // End of use strict