$(document).ready(function () {
	$(".map").height(window.innerHeight - 30);
	$(".map").width(window.innerWidth - 295);
	$(".graphs").height(window.innerHeight - 30 - 75);
});

// Show/Hide graphs
var compress = 0;
var graph = 0;
$(".material-design-hamburger__icon").click(function(){
	
	graph = !graph;
	
	if(graph){
		$("#map").width(window.innerWidth - 295 - 415)
		$("#graphs").css("right","15px");
	}
	else{
		$("#map").width(window.innerWidth - 295)
		$("#graphs").css("right","-400px");
	}
});

$("#expand").click(function(){
	$(".expand").toggleClass("compress");
	$(".graphs").toggleClass("large");
	
	compress = !compress;
	
	if(compress){
		$("#map").width(0);
		$("#graphs").css("width",window.innerWidth - 295);
	}
	else{
		$("#map").width(window.innerWidth - 295 - 415);
		$("#graphs").css("width","400px");
	}
});
$(".layer-button").click(function(){
	$(".layers-expand").toggle();
});