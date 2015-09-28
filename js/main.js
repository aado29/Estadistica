$(function() {
	Array.prototype.max = function() {
		return Math.max.apply(null, this);
	};
	var parametros = $('#parametros');
	$('button').click(function() {
		$('#table').html('<tr class="info"><th>x<sub>i</sub></th><th>f<sub>i</sub></th><th>F<sub>i</sub></th><th>h<sub>i</sub></th><th>H<sub>i</sub></th></tr>');
		$('p').html('');
		var values = parametros.val().trim(),
			positions = [],
			count = [],
			frecuencia = [],
			porcentaje = [],
			porcentajeT = [],
			sumaT = 0;
			moda = 0;
		values = values.split(" ");
		values.sort(function (a,b) {
			return a - b;
		});
		for (var i = 0; i < values.length; i++) {
			sumaT += parseInt(values[i]);
			if (i > 0) {
				if (positions[positions.length-1] != values[i]) {
					count.push(1);
					positions.push(values[i]);
				}else {
					count[count.length-1] += 1;
				}
			}else {
				count.push(1);
				positions.push(values[i]);
			}
		};
		for (var i = 0; i < count.length; i++) {
			if (i > 0) {
				frecuencia.push(parseInt(frecuencia[i-1]) + parseInt(count[i]));
			}else {
				frecuencia.push(count[0]);
			}
			porcentaje.push(parseInt(count[i])/values.length);
			porcentajeT.push(parseInt(frecuencia[i])/values.length);
		};
		for (var i = 0; i < positions.length; i++) {
			var tr = $('#table').append('<tr id="'+i+'"><td>'+positions[i]+'</td><td>'+count[i]+'</td><td>'+frecuencia[i]+'</td><td>'+porcentaje[i]+'</td><td>'+porcentajeT[i]+'</td></tr>');
		};
		for (var i = 0; i < values.length; i++) {
			$('#one center').append('['+values[i]+']; ');
		};
		$('#rango').html('N: '+values.length);

		$('#media').html('Media: '+sumaT/values.length); //

		if (values.length % 2 == 0) {
			$('#mediana').html('Mediana: '+( parseInt(values[(values.length/2)-1]) + parseInt(values[(values.length/2)]) )/2);
		}else {
			$('#mediana').html('Mediana: '+values[Math.round(values.length/2)-1]);
		}

		for (var i = 0; i < count.length; i++) {
			if (count[i] == count.max())
				moda = positions[i];
		};
		$('#moda').html('Moda: '+moda);
		$('#total').html('total: '+sumaT);
	});

});