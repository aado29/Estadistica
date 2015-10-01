$(function() {
	Array.prototype.max = function() {
		return Math.max.apply(null, this);
	};
	Array.prototype.min = function() {
		return Math.min.apply(null, this);
	};
	var parametros = $('#parametros').val();
	$('button').click(function() {
		$('p').html('');
		var positions = [],
			is_group = $('#check').is(':checked'),
			values = getArguments(parametros);

		$('#one center').html(printOrder(values));
		$('#rango').html(values.length);

		if (!is_group) {
			var dataGroup = tableGroup(values, 'data');
			var x = dataGroup[0],
				f = dataGroup[1],
				fa = dataGroup[2],
				fr = dataGroup[3],
				fra = dataGroup[4],
				multi1 = dataGroup[5],
				multi2 = dataGroup[6],
				sumMulti2 = dataGroup[7],
				sumaT = getCount(values),
				moda = 0;

			tableGroup(values);

			$('#media').html(sumaT/values.length);

			if (values.length % 2 == 0) {
				$('#mediana').html(( parseInt(values[(values.length/2)-1]) + parseInt(values[(values.length/2)]) )/2);
			}else {
				$('#mediana').html(values[Math.round(values.length/2)-1]);
			}

			for (var i = 0; i < f.length; i++) {
				if (f[i] == f.max())
					moda = x[i];
			};
			$('#moda').html(moda);

			$('#varianza').html((sumMulti2/values.length)-Math.pow(sumaT/values.length,2));

			$('#total').html(sumaT);

			var chart = c3.generate({
				data: {
					xs: {
						'Frecuencia': 'X',
						/* 'Frecuencia Absoluta': 'X',
						'Frecuencia Porcentual': 'X',
						'Frecuencia Porcentual Absoluta': 'X' */
					},
					columns: [
						adder(x, ["X"]),
						adder(f, ["Frecuencia"]),
						/* adder(fa, ["Frecuencia Absoluta"]),
						adder(fr, ["Frecuencia Porcentual"]),
						adder(fra, ["Frecuencia Porcentual Absoluta"]) */
					]
				}
			});
		}else {
			var ni = Math.round(Math.floor(1 + 3.32 * Math.log10(values.length))),
				R = values.max() - values.min(),
				I = Math.ceil(R/ni);

			//creating classes group
			var classes = [];
			var f = [];
			var fa = [];
			var ci = [];
			var fr = [];
			var fra = [];

			for (var i = 0; i < ni; i++) {
				var min = parseInt(values.min());
				var a = i === 0 ? min+(I-1) : (classes[i-1]+1)+(I-1);
				var fi = i === 0 ? getAccumulated(a-(I-1), I-1, values) : fa[i-1] + getAccumulated(a-(I-1), I-1, values);

				classes.push(a);
				ci.push(getci(a-(I-1), a));
				f.push(getAccumulated(a-(I-1), I-1, values));
				fa.push(fi);
				fr.push(getfr(f[i], values.length));
				fra.push(getfr(fa[i], values.length));
			}

			console.log('R: '+R);
			console.log('ni: '+ni);
			console.log('i: '+I);
			console.log('cimax: '+values.max());
			console.log('cimin: '+values.min());
			console.log('N: '+values.length);
			console.log('f-1: '+getLimitF(f.max(), f, 'min'));
			console.log('fa-1: '+getLimitFa(f.max(), f, fa, 'min'));
			console.log('fMax: '+f.max());
			console.log('fa+1: '+getLimitFa(f.max(), f, fa, 'max'));
			console.log('f+1: '+getLimitF(f.max(), f, 'max'));

			$('#table').html('<tr class="info"><th>Clases</th><th>f<sub>i</sub></th><th>f<sub>i</sub>a</th><th>fr</th><th>fra</th><th>ci</th></tr>');
			for (var i = 0; i < classes.length; i++) {
				var strMinMax = (classes[i]-(I-1))+'-'+classes[i];
				var tr = $('#table').append('<tr id="'+i+'"><td>'+strMinMax+'</td><td>'+f[i]+'</td><td>'+fa[i]+'</td><td>'+fr[i]+'</td><td>'+fra[i]+'</td><td>'+ci[i]+'</td></tr>');
			}
			$('#moda').html(getmodagroup(f.max(), I-1, f, classes));
			$('#media').html(getmediagroup(f.max(), I-1, f, classes));
			$('#mediana').html(getmediana(f));

			var x = ['x'],
				x1 = ['x1'];

			adder(classes, x);
			adder(fra, x1);

			var chart = c3.generate({
				data: {
					xs: {
						'x1': 'x',
					},
					columns: [
						x1,
						x
					],
					type: 'bar'
				}
			});
		}
	});
	function getAccumulated(min, count, data) {
		var a = 0;
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j <= count; j++) {
				if (Math.floor(data[i]) == min+j) {
					a += 1;
				}
			}
		}
		return a;
	}
	function getci(min, max) {
		return (min+max)/2;
	}
	function getfr(i, total) {
		return i/total;
	}
	function getmodagroup(f, a, data, classes) {
		var min = getLimitF(f, data, 'min'),
			max = getLimitF(f, data, 'max'),
			l = getLimitClass(getLimitF(f, data, 'index'), a, classes, 'min');

		return l + (max/(min+max)) * a;
	}
	function getmediagroup(f, a, data, classes) {
		var min = getLimitClass(getLimitF(f, data, 'index'), a, classes, 'min'),
			max = getLimitClass(getLimitF(f, data, 'index'), a, classes, 'max');

		return (min+max)/2;
	}
	function getmediana(dataf) {
		var li = getLimitF(dataf.max(), dataf, 'min');
		return li;
	}
	function getLimitF(f, data, type) {
		var index;
		for (var i = 0; i < data.length; i++) {
			if(data[i] == f) {
				index = i;
			}
		}

		if (type == 'min') return data[index-1];
		if (type == 'max') return data[index+1] ? data[index+1] : 0;
		if (type == 'index') return index;
	}
	function getLimitFa(f, dataF, dataFa, type) {
		var index;
		for (var i = 0; i < dataF.length; i++) {
			if(dataF[i] == f) {
				index = i;
			}
		}

		if (type == 'min') return dataFa[index-1];
		if (type == 'max') return dataFa[index+1] ? dataFa[index+1] : 0;
		if (type == 'index') return index;
	}
	function getLimitClass(i, a, data, type) {
		if (type == 'min')
			return data[i]-a;
		if (type == 'max')
			return data[i];
	}
	function printOrder(data) {
		var str = '';
		for (var i = 0; i < data.length; i++) {
			str += '[' + data[i] + '<sub>' + (i+1) + '</sub>];';
		}
		return str;
	}

});