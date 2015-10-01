Array.prototype.max = function() {
	return Math.max.apply(null, this);
}

Array.prototype.min = function() {
	return Math.min.apply(null, this);
}

function adder(count, arr) {
	for (var i = 0; i < count.length; i++) {
		arr.push(count[i]);
	}
	return arr;
}

function printOrder(data) {
	var str = '';
	for (var i = 0; i < data.length; i++) {
		str += '[' + data[i] + '<sub>' + (i+1) + '</sub>];';
	}
	return str;
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
	var values = this.getArguments(),
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

/**  -------------------------------------  */

function Ungrouped(data) {
	this.data = data,
	this.tached = [];
}

Ungrouped.prototype.getArguments = function() {
	var regEx = /(\d+[\.|\,]?\d+)|(\d)+/g,
		values = [],
		match  = true;
	while (match) {
		match = regEx.exec(this.data);
		if(match) values.push(parseFloat(match[0]));
	}
	values.sort(function (a,b) {
		return a - b;
	});
    return values;
    //return array with the text.
}

Ungrouped.prototype.getCount = function() {
	var c = 0;
	for (var i = 0; i < this.getArguments().length; i++) {
		c += parseFloat(this.getArguments()[i]);
	}
	return c;
}

Ungrouped.prototype.getParameters = function() {
	var values = this.getArguments(),
		R = parseFloat((values.max()-values.min()).toFixed(2)),
		K = Math.ceil( 1 + ( 3.32 * Math.log10(values.length) ) ),
		A = parseFloat((R/K).toFixed(2)),
		Li = [],
		Ls = [],
		Mi = [],
		classes = [],
		f = [];

		for (var i = 0; i < K; i++) {
			var ai = A;

			if (i == 0) {
				var min0 = values.min(),
					max0 = min0 + ai;

				Li.push(min0);
				Ls.push(max0);
				Mi.push( ( min0 + max0 ) / 2 );
				classes.push( min0 + '-' + max0 );
				f.push(this.getClasses(min0, max0));
			} else {
				var min1 = Li[i-1]+A,
					max1 = min1 + ai;

				Li.push(min1);
				Ls.push(max1);
				Mi.push( ( min1 + max1 ) / 2 );
				classes.push( min1 + '-' + max1 );
				f.push(this.getClasses(min1, max1));
			}
		}

		console.log(values);
		console.log(R);
		console.log(K);
		console.log(A);
		console.log(Li);
		console.log(Ls);
		console.log(Mi);
		console.log(classes);
		console.log(f);

}

Ungrouped.prototype.getClasses = function(min, max) {
	var data = this.getArguments(),
		count = 0;

	for (var i = 0; i < data.length; i++) {
		if (data[i] >= min && data[i] <= max) {
			if (this.tached[i] !== 'undefined') {
				count += 1;
				this.tached.push(i);
			}
			console.log(this.tached[i]);
		}
	}

	return count;
}