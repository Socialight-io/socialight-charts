$chart = new function () { 

	this.$r = function (r, data) { 
		if (typeof(r) == "Function") { 
			return r(data);
		} else { 
			return data[r];
		}
	}
}