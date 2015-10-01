Array.prototype.max = function() {
	return Math.max.apply(null, this);
}

Array.prototype.min = function() {
	return Math.min.apply(null, this);
}

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
		c += parseFloat(arr[i]);
	}
	return c;
}

function adder(count, arr) {
	for (var i = 0; i < count.length; i++) {
		arr.push(count[i]);
	}
	return arr;
}
/**  -------------------------------------  */

function Grouped(data) {
	this.data = data;
}

Grouped.prototype.getArguments = function() {
	var regEx = /(\d+[\.|\,]?\d+)|(\d)+/g,
		values = [],
		match  = true;
	while (match) {
		match = regEx.exec(this.data);
		if(match) values.push(match[0]);
	}
	values.sort(function (a,b) {
		return a - b;
	});
    return values;
    //return array with the text.
}

Grouped.prototype.getCount = function() {
	var c = 0;
	for (var i = 0; i < this.getArguments().length; i++) {
		c += parseFloat(this.getArguments()[i]);
	}
	return c;
}

Grouped.prototype.getParameters = function() {
	var values = this.getArguments(this.data),
		x = [],
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

	return [x, f, fa, fr, fra, multi1, multi2, sumMulti2];
}

Grouped.prototype.getModa = function() {
	var moda,
		data = this.getParameters();

	for (var i = 0; i < data[1].length; i++) {
		if (data[1][i] == data[1].max())
			moda = data[0][i];
	};

	return moda;
}

Grouped.prototype.getMedia = function() {
	return this.getCount()/this.getArguments().length;
}

Grouped.prototype.getMediana = function() {
	var values = this.getArguments();

	if (this.getArguments().length % 2 == 0)
		return ( parseFloat(values[(values.length/2)-1]) + parseFloat(values[(values.length/2)]) ) / 2;
	else
		return (values[Math.round(values.length/2)-1]);
}

Grouped.prototype.getVariance = function() {
	var data = this.getParameters(),
		values = this.getArguments();
	return (data[7]/values.length)-Math.pow(this.getCount()/values.length,2)
}

Grouped.prototype.drawTable = function(id) {
	var data = this.getParameters(),
		table = document.querySelector(id);
	table.innerHTML	=	'';
	table.innerHTML	=	'<tr class="info"><th>x<sub>i</sub></th><th>f<sub>i</sub></th><th>f<sub>i</sub>a</th><th>fr</th><th>fra</th><th>x<sub>i</sub>·f<sub>i</sub></th><th>x²<sub>i</sub>·f<sub>i</sub></th></tr>';
	for (var i = 0; i < data[0].length; i++) {
		table.innerHTML	+=	'<tr id="'+i+'"><td>'+data[0][i]+'</td><td>'+data[1][i]+'</td><td>'+data[2][i]+'</td><td>'+data[3][i]+'</td><td>'+data[4][i]+'</td><td>'+data[5][i]+'</td><td>'+data[6][i]+'</td></tr>';
	}
}