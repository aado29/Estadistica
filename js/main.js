$(function() {
	Array.prototype.max = function() {
		return Math.max.apply(null, this);
	};
	Array.prototype.min = function() {
		return Math.min.apply(null, this);
	};
	var parametros = $('#parametros');
	$('button').click(function() {
		$('p').html('');
		var values = parametros.val().trim(),
			positions = [],
			count = [],
			frecuencia = [],
			porcentaje = [],
			porcentajeT = [],
			multi1 = [],
			multi2 = [],
			sumMulti2 = 0,
			sumaT = 0,
			moda = 0;
		values = values.split(" ");
		values.sort(function (a,b) {
			return a - b;
		});

		for (var i = 0; i < values.length; i++) {
			// values, positions, count, sumaT
			values[i] = parseInt(values[i])
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
		}
		for (var i = 0; i < count.length; i++) {
			// count, frecuencia, porcentaje, porcentajeT, multi1, multi2, sumMulti
			if (i > 0) {
				frecuencia.push(frecuencia[i-1] + count[i]);
			}else {
				frecuencia.push(count[0]);
			}
			porcentaje.push(count[i]/values.length);
			porcentajeT.push(frecuencia[i]/values.length);
			multi1.push(positions[i]*count[i]);
			multi2.push(Math.pow(positions[i],2)*count[i]);
			sumMulti2 += multi2[i];
		}

		if (values.length <= 40) {
			$('#table').html('<tr class="info"><th>x<sub>i</sub></th><th>f<sub>i</sub></th><th>F<sub>i</sub></th><th>h<sub>i</sub></th><th>H<sub>i</sub></th><th>x<sub>i</sub>·f<sub>i</sub></th><th>x²<sub>i</sub>·f<sub>i</sub></th></tr>');
			
			for (var i = 0; i < positions.length; i++) {
				var tr = $('#table').append('<tr id="'+i+'"><td>'+positions[i]+'</td><td>'+count[i]+'</td><td>'+frecuencia[i]+'</td><td>'+porcentaje[i]+'</td><td>'+porcentajeT[i]+'</td><td>'+multi1[i]+'</td><td>'+multi2[i]+'</td></tr>');
			}

			for (var i = 0; i < values.length; i++) {
				$('#one center').append('['+values[i]+']; ');
			}

			$('#rango').html(values.length);

			$('#media').html(sumaT/values.length); //

			if (values.length % 2 == 0) {
				$('#mediana').html(( parseInt(values[(values.length/2)-1]) + parseInt(values[(values.length/2)]) )/2);
			}else {
				$('#mediana').html(values[Math.round(values.length/2)-1]);
			}

			for (var i = 0; i < count.length; i++) {
				if (count[i] == count.max())
					moda = positions[i];
			};
			$('#moda').html(moda);

			$('#varianza').html((sumMulti2/values.length)-Math.pow(sumaT/values.length,2));

			$('#total').html(sumaT);

			var x = ['x'],
				x1 = ['x1'];

			adder(positions, x);
			adder(count, x1);

			var chart = c3.generate({
				data: {
					xs: {
						'x1': 'x',
					},
					columns: [
						x1,
						x
					]
				}
			});
		}else {
			var ni = Math.round(Math.floor(1 + 3.32 * Math.log10(values.length))),
				R = positions.max() - positions.min(),
				i = Math.ceil(R/ni);

			R = ni*i;
			console.log(R);
			console.log(values.length);
		}
	});
	function adder(count, arr) {
		for (var i = 0; i < count.length; i++) {
			arr.push(count[i])
		}
	}
});