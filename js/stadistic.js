function getArguments(str) {
	var regEx = /(\d+[\.|\,]?\d+)|(\d)+/g,
		values = [],
		match  = true;
	while (match) {
		match = regEx.exec(str);
		if(match) values.push(match[0]);
	}
	values.sort(function (a,b) {
		return a - b;
	});
    return values;
}

function getCount(arr) {
	var c = 0;
	for (var i = 0; i < arr.length; i++) {
		c += arr[i];
	}
	return c;
}

function tableGroup(values) {
	var x = [],
		f = [],
		fa = [],
		fr = [],
		fra = [],
		multi1 = [],
		multi2 = [],
		sumMulti2 = 0;

	for (var i = 0; i < values.length; i++) {
		if (i > 0) {
			if (x[x.length-1] != values[i]) {
				f.push(1);
				x.push(values[i]);
			}else {
				f[f.length-1] += 1;
			}
		}else {
			f.push(1);
			x.push(values[i]);
		}
	}

	for (var i = 0; i < f.length; i++) {
		if (i > 0) {
			fa.push(fa[i-1] + f[i]);
		}else {
			fa.push(f[0]);
		}
		fr.push(f[i]/values.length);
		fra.push(fa[i]/values.length);
		multi1.push(x[i]*f[i]);
		multi2.push(Math.pow(x[i],2)*f[i]);
		sumMulti2 += multi2[i];
	}
	$('#table').html('');
	$('#table').append('<tr class="info"></tr>');
	$('#table tr.info')
		.append('<th>x<sub>i</sub></th>')
		.append('<th>f<sub>i</sub></th>')
		.append('<th>f<sub>i</sub>a</th>')
		.append('<th>fr</th>')
		.append('<th>fra</th>')
		.append('<th>x<sub>i</sub>·f<sub>i</sub></th>')
		.append('<th>x²<sub>i</sub>·f<sub>i</sub></th>');

	for (var i = 0; i < x.length; i++) {
		$('#table').append('<tr id="'+i+'"></tr>');
		$('#table tr#'+i)
			.append('<td>'+x[i]+'</td>')
			.append('<td>'+f[i]+'</td>')
			.append('<td>'+fa[i]+'</td>')
			.append('<td>'+fr[i]+'</td>')
			.append('<td>'+fra[i]+'</td>')
			.append('<td>'+multi1[i]+'</td>')
			.append('<td>'+multi2[i]+'</td>');
	}

	return [x, f, fa, fr, fra, multi1, multi2, sumMulti2];
}