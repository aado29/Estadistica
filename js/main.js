$(function() {
	$('button').click(function() {
		var parametros = $('#parametros').val(),
			is_group = $('#check').is(':checked'),
			is_decimal = $('#decimal').is(':checked'),
			values = new Grouped(parametros),
			values = values.getArguments();

		$('#one center').html(printOrder(values));
		$('#rango').html(values.length);

		if (!is_group) {

			var dataGrouped = new Grouped(parametros),
				dataGroup = dataGrouped.getParameters();

			dataGrouped.drawTable('#table');

			$('#media').html(dataGrouped.getMedia());
			$('#mediana').html(dataGrouped.getMediana());
			$('#moda').html(dataGrouped.getModa());
			$('#varianza').html(dataGrouped.getVariance());
			$('#total').html(dataGrouped.getCount());

			var chart = c3.generate({
				data: {
					xs: {
						'Frecuencia': 'X'
					},
					columns: [
						adder(dataGroup[0], ["X"]),
						adder(dataGroup[1], ["Frecuencia"])
					]
				}
			});
		}else {
			var dataUngrouped = new Ungrouped(parametros),
				dataUngroup = dataUngrouped.getParameters();

			if (is_decimal)
				dataUngrouped.setDecimal();

			dataUngrouped.drawTable('#table');

			$('#media').html(dataUngrouped.getMedia());

			var chart = c3.generate({
				data: {
					xs: {
						'Frecuencia': 'X'
					},
					columns: [
						adder(dataUngroup[5], ["X"]),
						adder(dataUngroup[7], ["Frecuencia"])
					]
				}
			});
		}
	});

});