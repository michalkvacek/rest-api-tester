$(document).ready(function () {
	$(document).foundation();

	$('input[type=datetime]').fdatepicker({
		pickTime: true,
		format: 'mm-dd-yyyy hh:ii',
	});
});
