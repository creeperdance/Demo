$(function() {
	var img_width = 200; //图片宽度
	var img_space = 10; //图片间隔
	var item_width = img_width + img_space; //图片项实际宽度
	var img_cells = 0; //图片项列数
	var oContainer = $('#oContainer'); //容器
	var arrLeft = []; //图片应当放置的left值 
	var arrTop = []; //图片应当放置的Top值 
	var imgUrl = "http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E5%8D%83%E4%B8%8E%E5%8D%83%E5%AF%BB&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=%E5%8D%83%E4%B8%8E%E5%8D%83%E5%AF%BB&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=60&rn=30&gsm=1e&1496559776670="; //瀑布流图片数据
	var ipages = 0;
	var dflag = true;
	//设置图片项列数及容器宽度
	function setCells() {
		img_cells = Math.floor($(window).innerWidth() / item_width);
		oContainer.css('width', img_cells * item_width - img_space);
	}
	setCells();
	//初始化arrLeft,arrTop
	for(var i = 0; i < img_cells; i++) {
		arrTop.push(0);
		arrLeft.push(i * item_width);
	}

	//加载图片数据，使用jsonp，数据来源于百度图片(关键字：千与千寻),解决跨域
	function getData() {
		if(dflag) {
			dflag = false;
			$('#loading').show();
			$.ajax({
				url: imgUrl,
				type: 'GET',
				dataType: 'JSONP', 
				success: function(data) {
					$.each(data.data, function(index, obj) {
						var imgURL = decodeURL(obj.objURL);
						//console.log(imgURL);
						oImg = $('<img />');
						oImg.attr('src', imgURL);
						oContainer.append(oImg);
						var img_height = img_width / obj.width * obj.height;
						oImg.css({
							width: img_width,
							height: img_height
						});
						var _index = getMin();

						oImg.css({

							left: arrLeft[_index],
							top: arrTop[_index]
						});

						arrTop[_index] += img_height + 10;

						$('#loading').hide();
						dflag = true;
					});

				}
			});
		}
	}
	getData();
	//滚动条，无限加载
	$(window).scroll(function() {;
		var iheight = $(window).scrollTop() + $(window).innerHeight();
		var oheight = arrTop[getMin()];
		//document.title = iheight + ":" + oheight + oContainer.offset().top
		if(iheight > oheight + oContainer.offset().top) {
			ipages++;
			getData();
		}
	});
	$(window).resize(function() {
		setCells();
		arrLeft = [];
		arrTop = [];
		for(var i = 0; i < img_cells; i++) {
			arrTop.push(0);
			arrLeft.push(i * item_width);
		}
		var imgs = oContainer.find('img');
		var j=0;
		imgs.each(function(){
			j++;
			var min_index = getMin();
			$(this).animate({
				left: arrLeft[min_index],
				top: arrTop[min_index]
			});
			arrTop[min_index] += $(this).height() + 10;
		});
	});

	function getMin() {
		var _index = 0;
		var min_top = arrTop[0];
		for(var i = 0; i < arrTop.length; i++) {
			if(arrTop[i] < min_top) {
				_index = i;
				min_top = arrTop[i];
			}
		}
		return _index;
	}
	//百度图片，解密函数
	function decodeURL(u) {
		var f = {
			w: "a",
			k: "b",
			v: "c",
			1: "d",
			j: "e",
			u: "f",
			2: "g",
			i: "h",
			t: "i",
			3: "j",
			h: "k",
			s: "l",
			4: "m",
			g: "n",
			5: "o",
			r: "p",
			q: "q",
			6: "r",
			f: "s",
			p: "t",
			7: "u",
			e: "v",
			o: "w",
			8: "1",
			d: "2",
			n: "3",
			9: "4",
			c: "5",
			m: "6",
			0: "7",
			b: "8",
			l: "9",
			a: "0",
			_z2C$q: ":",
			"_z&e3B": ".",
			AzdH3F: "/"
		};

		var url = u + "";

		var h = /(_z2C\$q|_z&e3B|AzdH3F)/g;
		var e = url.replace(h, function(t, e) {
			return f[e]
		});

		var s = /([a-w\d])/g;
		e = e.replace(s, function(t, e) {
			return f[e]
		});
		return e;
	}
});
