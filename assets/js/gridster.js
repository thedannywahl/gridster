// Insert client ID here (requires an instagram account)
// You can also pass an id in the querystring
var clientId = '';

var enableQuery = true;

// Grab the URL query string
// From: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};

    //Instantiate defaults
    urlParams["tag"] = "";
	urlParams["reload"] = 60; //minutes
	urlParams["clientid"] = "";
	urlParams["images"] = 60;
	urlParams["background"] = "";
	urlParams["sort"] = "none";
	urlParams["color"] = "";
	urlParams["rows"] = 3;
	urlParams["columns"] = 4;
	urlParams["step"] = "random"; // random or number
	urlParams["maxStep"] = 2; // max random images to change (step)
	urlParams["speed"] = 1; //seconds
	urlParams["pause"] = 10; //seconds
	urlParams["animation"] = "random";

	if(enableQuery) {   
    	while (match = search.exec(query)) {
        	urlParams[decode(match[1]).toLowerCase()] = decode(match[2]).toLowerCase();
    	}
    }
})();

//Check for a valid clientId, either set at top, or in query string
// urlParam takes priority
if(urlParams["clientid"] != "") {
	clientId = urlParams["clientid"];
}
if(clientId != "") {
	// Determine if we're getting a tag or the popular page
	var getType = "popular";
	var tag = urlParams["tag"];
	if(tag != "") {
		getType = "tagged";
		$(".tag-header h1").text("#" + urlParams["tag"]);
		$("title").text("#" + urlParams["tag"] + ' | Gridster for instagram');
	} else {
		$(".tag-header h1").text("popular");
		$("title").text("popular | Gridster for instagram");
	}

	// Check for what to output in the template
	var output = '<li>';
	var preventClick = true;
	var href= "#"
	if("link" in urlParams) {
		href = '{{link}}';
		preventClick = false;
	}
	output = output + '<a href="' + href + '"><img src="{{image}}" />';
	if("author" in urlParams) {
		output = output + '<span class="author">{{model.user.username}}</span>';
	}
	if("caption" in urlParams) {
		output = output + '<span class="caption">{{caption}}</span>';
	}
	if("likes" in urlParams) {
		output = output + '<span class="likes"><span class="heart"></span>{{likes}}</span>';
	}
	if("comments" in urlParams) {
		output = output + '<span class="comments"><span class="comment"></span>{{comments}}</span>';
	}
	output = output + '</a></li>';

	// Make sure images is a number
	var images = urlParams["images"];
	if(isNaN(images)) {
		images = 60;
	} else {
		if(images > 60) {
			images = 60;
		}
	}
	
	// Select Sort Method
	var sort = urlParams["sort"];
	switch(sort) {
		case 'none':
			sort = "none";
			break;
		case 'most-recent':
			sort = "most-recent";
			break;
		case 'least-recent':
			sort = "least-recent";
			break;
		case 'most-liked':
			sort = "most-liked";
			break;
		case 'least-liked':
			sort = "least-liked";
			break;
		case 'most-commented':
			sort = "most-commented";
			break;
		case 'least-commented':
			sort = "least-commented";
			break;
		case 'random':
			sort = "random";
			break;
		default:
			sort = "none";
	}

	// From: http://instafeedjs.com/
	// Get instagram images
	var feed = new Instafeed({
    	get: getType,
    	tagName: tag,
    	clientId: clientId,
    	sortBy: sort,
    	resolution: 'standard_resolution',
    	template: output,
    	limit: images,
    });
	feed.run();
	
	// Set colors
	var background = urlParams["background"];
	if(background != "") {
		$("body, #instafeed, .tag-header h1").css("background", background);
	}
	var color = urlParams["color"];
	if(color != "") {
		$("body, a, a:hover, a:focus, a:active").css("color", color);
	}

    //Instantiate defaults
	var rows = urlParams["rows"];
	if(isNaN(rows)) {
		rows = 3;
	}
	
	var columns = urlParams["columns"];
	if(isNaN(columns)) {
		columns = 4;
	}
	
	// Don't output a bigger grid than ther are images
	while(columns * rows >= images) {
		columns--;
	}

	var step = Number(urlParams["step"]);
	if(isNaN(step)) {
		step = "random";
	}

	var maxStep = urlParams["maxStep"];
	if(isNaN(maxStep)) {
		maxStep = 3;
	} else {
		if(step !== "random") {
			
			// Prevent step from being larger than maxStep
			if(maxStep < step) {
				maxStep = step + 1;
			}
		}
	}
	
	// Set rotation pause
	var pause = urlParams["pause"];
	if(isNaN(pause)) {
		pause = 1  * 1000;
	} else {
		
		// Don't rotate pictures if pause is 0
		if(pause == 0) {
			pause = reload * 60 * 1000;
			step = 0;
			maxStep = 0;
		} else {
			pause = pause * 1000;
		}
	}
	
	// Set rotation speed
	var speed = urlParams["speed"];
	if(isNaN(speed)) {
		speed = 10  * 1000;
	} else {
		speed = speed * 1000;
	}
	
	// Set animation type
	var animation = urlParams["animation"];
	switch(animation) {
		case 'showhide':
			animation = "showHide";
			break;
		case 'fadeinout':
			animation = "fadeInOut";
			break;
		case 'slideleft':
			animation = "slideLeft";
			break;
		case 'slideright':
			animation = "slideRight";
			break;
		case 'slidetop':
			animation: "slideTop";
			break;
		case 'slidebottom':
			animation = "slideBottom";
			break;
		case 'rotateleft':
			animation = "rotateLeft";
			break;
		case 'rotateright':
			animation = "rotateRight";
			break;
		case 'rotatetop':
			animation = "rotateTop";
			break;
		case 'rotatebottom':
			animation = "rotateBottom";
			break;
		case 'scale':
			animation = "scale";
			break;
		case 'rotate3d':
			animation = "rotate3d";
			break;
		case 'rotateleftscale':
			animation = "rotateLeftScale";
			break;
		case 'rotaterightscale':
			animation = "rotateRightScale";
			break;
		case 'rotatetopscale':
			animation = "rotateTopScale";
			break;
		case 'rotatebottomscale':
			animation = "rotateBottomScale";
			break;
		case 'random':
			animation = "random";
			break;
		default:
			animation = "random";
	}

	// Build the grid
	// From: http://tympanus.net/codrops/2012/08/02/animated-responsive-image-grid/
	$(window).load(function() {
		$('#ri-grid').gridrotator( {
			rows         : rows,
			columns      : columns,
			step         : step,
			maxStep      : maxStep,
			interval     : pause,
			preventClick : preventClick,
			slideshow    : true,
			animType     : animation,
			animSpeed    : speed,
		});
	});

	// Fullscreen on click
	// From: http://sindresorhus.com/screenfull.js/
	// From: http://stackoverflow.com/questions/10935589/javascript-fullscreen-api-plugin
	$('.tag-header').on('click', '*', function() {
        screenfull.request();
	});

	// Reload page data
	var reload = urlParams["reload"];
	if(isNaN(reload)) {
		reload = 60 * 60 * 1000;
	} else {
		reload = reload * 60 * 1000;
	}
	setTimeout(function(){
		$("#instafeed").empty();
		feed.run();
		$(window).trigger("debouncedresize");
	}, reload);

} else {
	var error = '<div class="error">Error: No client ID found.  You can either add one to scrollster.js or use one in the url.<br/>To get a Client ID visit <a href="https://instagram.com/developer/clients/manage/">https://instagram.com/developer/clients/manage/</a></div>';
	document.write(error);
}