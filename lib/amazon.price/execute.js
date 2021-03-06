(function() {
	
	Bookmarklet.init("3.x", function($) {
		
		var lib = this.getLib("amazon.price");
		
		if (lib.getLocal().initialize === true) return;
		
		this.loadCSS(lib.getPath() + "css/mod.css");
		
		var audio = new Audio();
		
		audio.preload = "none";
		audio.autoPlay = false;
		audio.src = "https://dmdzdk.github.io/lib/amazon.price/sound/effect.mp3";
		
		audio.load();
		
		var flag = false,
			ua = navigator.userAgent,
			isPC = !((ua.indexOf("iPhone") > 0) || (ua.indexOf("iPod") > 0) || (ua.indexOf("Android") > 0) && (ua.indexOf("Mobile") > 0));
		
		$("body")
			.empty()
			.append(
				$("<div>")
					.addClass("wpv_header")
					.append(
						$("<div>")
							.addClass("wpv_header_left")
							.on("click", function () {
								
								var button = $("div.wpv_header_left");
								
								if (flag) {
									
									flag = false;
									
									button.addClass("start").removeClass("stop");
									
								} else {
									
									flag = true
									
									button.addClass("stop").removeClass("start");
								}
								
								if (flag) {
									
									$("iframe")[0].contentWindow.location.reload();
								}
							})
					)
					.append(
						$("<div>")
							.addClass("wpv_header_center")
							.text("￥ 0")
					)
					.append(
						$("<div>")
							.addClass("wpv_header_right")
							.addClass(isPC ? "pc" : "sp")
							.append(
								$("<input>")
									.attr({
										id: "target",
										type: "text"
									})
							)
					)
			)
			.append(
				$("<iframe>")
					.attr("src", location.href)
					.css("opacity", 0.1)
					.hover(function () { $(this).css("opacity", 1); }, function () { $(this).css("opacity", 0.1); })
					.on("load", function () {
						
						var ifw = $("iframe")[0].contentWindow,
							price = $("#priceblock_ourprice", ifw.document).text(),
							target = $("#target").val();
						
						$("div.wpv_header_center").text(price);
						
						price = parseInt(price.replace(/\D/g, ""));
						
						target = target.replace(/\D/g, "");
						target = parseInt(target == "" ? 0 : target);
						
						if (price <= target) {
							
							if (!isPC) {
								
								navigator.vibrate([300, 300, 300, 300, 300]);
							}
							
							audio.play();
						}
						
						if (flag) {
							
							ifw.setTimeout(function () {
								
								if (flag) {
									ifw.location.reload();
								}
							
							}, 10000);
						}
					})
			);
		
		$(window).on("resize", function () {
			
			$("iframe").height(window.innerHeight - 68);
			
		}).trigger("resize");
		
		lib.getLocal().initialize = true;
	});
	
})();