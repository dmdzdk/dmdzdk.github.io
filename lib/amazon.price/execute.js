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
		
		var flag = false;
		
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
							.text("0")
					)
			)
			.append(
				$("<iframe>")
					.attr("src", location.href)
					.on("load", function () {
						
						var ifw = $("iframe")[0].contentWindow,
							price = $("#priceblock_ourprice", ifw.document).text();
						
						$("div.wpv_header_center").text(price);
						
						price = parseInt(price.replace(/\D/g, ""));
						
						if (price <= 45000) {
							
							audio.play();
						}
						
						if (flag) {
							
							ifw.setTimeout(function () {
								
								if (flag) {
									ifw.location.reload();
								}
							
							}, 5000);
						}
					})
			);
		
		$(window).on("resize", function () {
			
			$("iframe").height(window.innerHeight - $("div.wpv_header").outerHeight());
			
		}).trigger("resize");
		
		lib.getLocal().initialize = true;
	});
	
})();