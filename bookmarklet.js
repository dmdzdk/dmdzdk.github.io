(function() {
	
	/*
	 * Convert This Script Src to JSON
	 */
	var script = (function() {
		
		var scripts = document.head.getElementsByTagName("script"),
			src = scripts[scripts.length - 1].src;
		
		var data = {
			src: src,
			file: "",
			params: {},
			hash: ""
		};
		
		var hashIndex = data.src.indexOf("#");
		
		data.hash = hashIndex == -1 ? "" : src.substring(hashIndex + 1);
		src = hashIndex == -1 ? data.src : src.substring(0, hashIndex);
		
		var paramIndex = src.indexOf("?"),
			query = paramIndex == -1 ? "" : src.substring(paramIndex + 1),
			params = query.split("&");
		
		data.file = paramIndex == -1 ? src : src.substring(0, paramIndex);
		
		for (var i = 0, l = params.length; i < l; i++) {
			
			var element = params[i].split("="),
				key = decodeURIComponent(element[0]),
				value = decodeURIComponent(element[1]);
			
			data.params[key] = value;
		}
		
		return data;
		
	})();
	
	/*
	 * jQuery Version Definitions
	 */
	var JQUERY_VERSION = {
		_1X: "1.11.0",
		_2X: "2.1.0",
		_3X: "3.2.1"
	};
	
	/*
	 * Script Path
	 */
	var SCRIPT_PATH = script.file.substring(0, script.file.lastIndexOf("/") + 1);
	
	/*
	 * jQuery Load Check Delay (ms)
	 */
	var DELAY = 200;
	
	/*
	 * Lib Name
	 */
	var LIB_NAME = script.params.l;
	
	/*
	 * Load JS
	 */
	function loadJS(file) {
		
		var element = document.createElement("script");
		
		element.setAttribute("type", "text/javascript");
		element.setAttribute("src", setTimestamp(file));
		
		document.head.appendChild(element);
	}
	
	/*
	 * Load CSS
	 */
	function loadCSS(file) {
		
		var element = document.createElement("link");
		
		element.setAttribute("rel", "stylesheet");
		element.setAttribute("type", "text/css");
		element.setAttribute("href", setTimestamp(file));
		
		document.head.appendChild(element);
	}
	
	/*
	 * Get Script Timestamp
	 */
	function setTimestamp(file) {
		
		return file + (file.indexOf("?") == -1 ? "?" : "&") + "timestamp=" + (new Date()).getTime();
	}
	
	/*
	 * Bookmark Class
	 */
	function Bookmarklet() {
		
		this._js = [];
		this._css = [];
		
		this._jQuery = [];
		this._lib = [];
		
		this.classes = {};
		
		if (typeof jQuery === "function") {
			
			this.loadJQuery(jQuery);
		}
	}
	
	/*
	 * Bookmark Class Methods
	 */
	Bookmarklet.prototype = {
		
		getPath: function() {
			
			return SCRIPT_PATH;
		},
		
		loadJS: function(file) {
			
			var canLoad = true;
			
			for (var i = 0, l = this._js.length; i < l; i++) {
				
				if (this._js[i] == file) {
					
					canLoad = false;
					
					break;
				}
			}
			
			if (canLoad) {
				
				this._js.push(file);
				
				loadJS(file);
			}
		},
		
		loadCSS: function(file) {
			
			var canLoad = true;
			
			for (var i = 0, l = this._css.length; i < l; i++) {
				
				if (this._css[i] == file) {
					
					canLoad = false;
					
					break;
				}
			}
			
			if (canLoad) {
				
				this._css.push(file);
				
				loadCSS(file);
			}
		},
		
		hasJQuery: function(version) {
			
			return this.getJQuery(version) != null;
		},
		
		getJQuery: function(version) {
			
			var jqInst = null;
			
			for (var i = 0, l = this._jQuery.length; i < l; i++) {
				
				var jq = this._jQuery[i];
				
				if (jq.version == version) {
					
					jqInst = jq.inst;
					
					break;
				}
			}
			
			return jqInst;
		},
		
		loadJQuery: function(jq) {
			
			try {
				
				var version = jq().jquery;
				
				if (!this.hasJQuery(version)) {
					
					var verMatch = version.match(/(\d+)\.(\d+)\.(\d+)/),
						major = ("0" + RegExp.$1).slice(-2),
						minor = ("0" + RegExp.$2).slice(-2),
						revision = ("0" + RegExp.$3).slice(-2);
					
					this._jQuery.push({
						version: version,
						inst: jq,
						sort: major + minor + revision
					});
					
					this._jQuery.sort(function(a, b) {
						
						var result = 0;
						
						if (a.sort < b.sort) {
							
							result = 1;
							
						} else if (a.sort > b.sort) {
							
							result = -1;
						}
						
						return result;
					});
				}
				
			} catch(e) {}
		},
		
		hasLib: function(name) {
			
			return this.getLib(name) != null;
		},
		
		getLib: function(name) {
			
			var libInst = null;
			
			for (var i = 0, l = this._lib.length; i < l; i++) {
				
				var lib = this._lib[i];
				
				if (lib.name == name) {
					
					libInst = lib.inst;
					
					break;
				}
			}
			
			return libInst;
		},
		
		loadLib: function(name) {
			
			var lib = this.getLib(name);
			
			if (lib == null) {
				
				lib = new Lib(name);
				
				this._lib.push({
					name: name,
					inst: lib
				});
			}
			
			lib.load();
		},
		
		addClass: function(c) {
			
			if (typeof c === "function") {
				
				this.classes[c.name] = c;
			}
			
			return this;
		},
		
		hasClass: function(name) {
			
			return typeof this.classes[name] !== "undefined";
		},
		
		getClass: function(name) {
			
			return this.classes[name];
		},
		
		loadClass: function(classes, callback) {
			
			classes = classes instanceof Array ? classes : [classes];
			
			var CLASS_PATH = this.getPath() + "classes/${CLASS}/",
				CLASS_FILE = "class.js";
			
			var that = this;
			
			function load() {
				
				var name = classes.pop(),
					path = CLASS_PATH.replace("${CLASS}", name);
				
				that.loadJS(path + CLASS_FILE);
				
				function check() {
					
					if (that.hasClass(name)) {
						
						var c = that.getClass(name);
						
						if (typeof c.prototype.getPath === "undefined") {
							
							c.prototype.getPath = function() { return path; };
						}
						
						if (classes.length == 0) {
							
							if (typeof callback === "function") {
								
								callback.apply(that);
							}
							
						} else {
							
							load();
						}
						
					} else {
						
						setTimeout(check, 100);
					}
				}
				
				check();
			}
			
			load();
			
			return this;
		},
		
		init: function(jqVersion, callback) {
			
			var that = this;
			
			function execute() {
				
				var args = jqVersion == "" ? [] : [that.getJQuery(jqVersion)];
				
				callback.apply(that, args);
			}
			
			if (arguments.length == 1) {
				
				callback = jqVersion;
				jqVersion = "";
			}
			
			if (jqVersion == "") {
				
				execute();
				
			} else {
				
				if (jqVersion.indexOf("x") > -1) {
					
					if (jqVersion.match(/^\d+\.x$/) != null) {
						
						jqVersion += ".x";
					}
					
					var verRegExp = new RegExp("^" + jqVersion.replace(/\.x/g, "\\.\\d+") + "$");
					
					if (jqVersion.match(/^1\./)) {
						
						jqVersion = JQUERY_VERSION._1X;
						
					} else if (jqVersion.match(/^2\./)) {
						
						jqVersion = JQUERY_VERSION._2X;
						
					} else if (jqVersion.match(/^3\./)) {
						
						jqVersion = JQUERY_VERSION._3X;
					}
					
					for (var i = 0, l = this._jQuery.length; i < l; i++) {
						
						var jq = this._jQuery[i];
						
						if (jq.version.match(verRegExp) != null) {
							
							jqVersion = jq.version;
							
							break;
						}
					}
				}
				
				if (this.hasJQuery(jqVersion)) {
					
					execute();
					
				} else {
					
					loadJS(SCRIPT_PATH + "jquery/jquery-" + jqVersion + ".min.js");
					
					function jqLoadComplete() {
						
						if ((typeof jQuery === "function") && (jQuery().jquery == jqVersion)) {
							
							that.loadJQuery(jQuery.noConflict(true));
							
							execute();
							
						} else {
							
							setTimeout(jqLoadComplete, DELAY);
						}
					}
					
					jqLoadComplete();
				}
			}
		}
	};
	
	/*
	 * Lib Class
	 */
	function Lib(name) {
		
		this._name = name;
		this._path = SCRIPT_PATH + "lib/" + this._name + "/";
		this._local = {};
	}
	
	/*
	 * Lib Class Methods
	 */
	Lib.prototype = {
		
		load: function() {
			
			loadJS(this.getPath() + "execute.js");
		},
		
		getName: function() {
			
			return this._name;
		},
		
		getPath: function() {
			
			return this._path;
		},
		
		getLocal: function() {
			
			return this._local;
		},
		
		setLocal: function(local) {
			
			this._local = local;
		}
	};
	
	/*
	 * Bookmark Instance
	 */
	window.Bookmarklet = window.Bookmarklet || new Bookmarklet();
	
	/*
	 * Execute
	 */
	if (typeof LIB_NAME !== "undefined") {
		
		window.Bookmarklet.loadLib(LIB_NAME);
	}
	
})();