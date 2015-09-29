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
		var regEx = /(\d+[\.|\,]?\d+)+/g;
			value = parametros.val(),
			values = [],
			match = true,
			positions = [];

		while (match) {
			match = regEx.exec(value);
			if(match) values.push(match[0]);
		}
		values.sort(function (a,b) {
			return a - b;
		});

		$('#one center').html(printOrder(values));

		if (values.length < 40) {

			var f = [],
				fa = [],
				fr = [],
				fra = [],
				multi1 = [],
				multi2 = [],
				sumMulti2 = 0,
				sumaT = 0,
				moda = 0;

			for (var i = 0; i < values.length; i++) {
				// values, positions, f, sumaT
				values[i] = parseInt(values[i])
				sumaT += parseInt(values[i]);
				if (i > 0) {
					if (positions[positions.length-1] != values[i]) {
						f.push(1);
						positions.push(values[i]);
					}else {
						f[f.length-1] += 1;
					}
				}else {
					f.push(1);
					positions.push(values[i]);
				}
			}

			for (var i = 0; i < f.length; i++) {
				// f, fa, fr, fra, multi1, multi2, sumMulti
				if (i > 0) {
					fa.push(fa[i-1] + f[i]);
				}else {
					fa.push(f[0]);
				}
				fr.push(f[i]/values.length);
				fra.push(fa[i]/values.length);
				multi1.push(positions[i]*f[i]);
				multi2.push(Math.pow(positions[i],2)*f[i]);
				sumMulti2 += multi2[i];
			}

			$('#table').html('<tr class="info"><th>x<sub>i</sub></th><th>f<sub>i</sub></th><th>f<sub>i</sub>a</th><th>fr</th><th>fra</th><th>x<sub>i</sub>·f<sub>i</sub></th><th>x²<sub>i</sub>·f<sub>i</sub></th></tr>');

			for (var i = 0; i < positions.length; i++) {
				$('#table').append('<tr id="'+i+'"><td>'+positions[i]+'</td><td>'+f[i]+'</td><td>'+fa[i]+'</td><td>'+fr[i]+'</td><td>'+fra[i]+'</td><td>'+multi1[i]+'</td><td>'+multi2[i]+'</td></tr>');
			}

			$('#rango').html(values.length);

			$('#media').html(sumaT/values.length); //

			if (values.length % 2 == 0) {
				$('#mediana').html(( parseInt(values[(values.length/2)-1]) + parseInt(values[(values.length/2)]) )/2);
			}else {
				$('#mediana').html(values[Math.round(values.length/2)-1]);
			}

			for (var i = 0; i < f.length; i++) {
				if (f[i] == f.max())
					moda = positions[i];
			};
			$('#moda').html(moda);

			$('#varianza').html((sumMulti2/values.length)-Math.pow(sumaT/values.length,2));

			$('#total').html(sumaT);

			var x = ['x'],
				x1 = ['x1'];

			adder(positions, x);
			adder(f, x1);

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
			console.log('ciax: '+values.max());
			console.log('ciin: '+values.min());
			console.log('N: '+values.length);
			console.log('f-1: '+getLimit(f.max(), f, 'min'));
			console.log('fMax: '+f.max());
			console.log('f+1: '+getLimit(f.max(), f, 'max'));

			$('#table').html('<tr class="info"><th>Clases</th><th>f<sub>i</sub></th><th>f<sub>i</sub>a</th><th>fr</th><th>fra</th><th>ci</th></tr>');
			for (var i = 0; i < classes.length; i++) {
				var strMinMax = (classes[i]-(I-1))+'-'+classes[i];
				var tr = $('#table').append('<tr id="'+i+'"><td>'+strMinMax+'</td><td>'+f[i]+'</td><td>'+fa[i]+'</td><td>'+fr[i]+'</td><td>'+fra[i]+'</td><td>'+ci[i]+'</td></tr>');
			}
			$('#moda').html(getmodagroup(f.max(), I-1, f, classes));
		}
	});
	function adder(count, arr) {
		for (var i = 0; i < count.length; i++) {
			arr.push(count[i])
		}
	}
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
		var min = getLimit(f, data, 'min'),
			max = getLimit(f, data, 'max'),
			l = getLimitClass(getLimit(f, data, 'index'), a, classes, 'min');

		return l + (max/(min+max)) * a;
	}
	function getLimit(f, data, type) {
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
	function getLimitClass(i, a, data, type) {
		if (type == 'min')
			return data[i]-a;
		if (type == 'max')
			return data[i];
	}
	function printOrder(data) {
		var str = '';
		for (var i = 0; i < data.length; i++) {
			str += '[' + data[i] + '];';
		}
		return str;
	}
});