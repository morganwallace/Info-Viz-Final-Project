var filterDesigner = "All Designers"
var filterCategory=new Array
$(document).ready(function() {
	//Setup the viz for the first time
	run();
	//Filter Designer by button click
	$(".designer").click(function(){
		if(filterDesigner!=$(this).text()){
			filterDesigner=$(this).text(); //sets the filter to the designer that is clicked.
			$(this).css("background-color","#B71F4A");
			$(this).siblings().css("background-color", "#D3D3B1");
		}
		else{
			filterDesigner="All Designers";
			$(this).css("background-color", "#D3D3B1");
		}
		$("svg").remove();
		$("#imageGrid div").remove();
		run();
	})
	//Filter Category
	$('.category').click(function() {
	    if ($.inArray($(this).text(),filterCategory)!=-1){ //clicked before so remove it
		    console.log($.inArray($(this).text(),filterCategory))
    		filterCategory.splice($.inArray($(this).text(),filterCategory), 1);
    		$(this).css("background-color","#C2EBB1");
    		
    		$("svg").remove();
			$("#imageGrid div").remove();
			run();	
	    }
	    else{ // add the filter
    		filterCategory.push($(this).text());
    		$(this).css("background-color","#B71F4A")
    		$("svg").remove();
			$("#imageGrid div").remove();
			run();
	    }
    })
    
});

// Starts the process of putting the D3 graph on the DOM
function run(){
	// Import Data from external .CSV file
	var dataset=d3.csv("data/designers-v4.csv", function(parsedrows) {
		viz(parsedrows)
	});
}
function viz(dataset){
		console.log("ping");
	
	//#############  Visualization  ##############
	// Width, height, and padding of SVG box
	var w = 1000; //previously 700, then 1200
	var h = 300; //previously 400
	var padding = 30;
	var bottompadding = 50;
	var sidePadding = 70;
	
	//Create SVG element
	var svg = d3.select("#graph")
				.append("svg")
				.attr("width", w)
				.attr("height", h);
				
				
	// ###  Scales  ###
	var xScale = d3.scale.sqrt()
						 .domain([0, d3.max(dataset, function(d) { 
						 	return +d.Hearts; })])
						 .range([sidePadding, w - 20]);
	
	var yScale = d3.scale.sqrt()
						 .domain([0, d3.max(dataset, function(d) { 
						 	return +d.Projects; })])
						 .range([h - bottompadding, padding]);
	
	var rScale = d3.scale.linear()
						 .domain([0, d3.max(dataset, function(d) { return d.Hearts; })])
						 .range([2, 2]);
						 
	var colors = d3.scale.category10();
	
	//###  Axes  ###
	// X axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom");
	
	// Y axis
	var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left");
		
	//******  Draw Elements  *****
	//Circles	
	function makeCircles(){		
		//Create circles
				console.log("makin' circles!")
		var circles=svg.selectAll("circle")
		   .data(dataset)
		   .enter()
		   .append("circle") 
		   .attr("cx", function(d) {
		   		return xScale(d.Hearts);
		   })
		   .attr("cy", function(d) {
		   		return yScale(d.Projects);
		   })
		   .attr("r", 4)
		   .attr("fill", function(d){
			   return colors(d.Category);
		   })
		          ;
	
		// Popups
		$('svg circle').tipsy({ 
			gravity: 'w', 
			html: true, 
			title: function() {
			  var d = this.__data__;
			  return "<div class='popup'><a href='"+d.Link+"'>"+d.Name+ "'  Category: "+d.Category+"<div><img src="+d.Photo+"></div><div>Price: "+d.Price+"</div></div>"; 
			}
		});
	}
	
	// Filter the data from the file to only show one designer
	if (filterDesigner!="All Designers"){
		dataset=dataset.filter(function(d) { return d.Designer == filterDesigner })
	}
	var dataset_copy=dataset
	
	if(filterCategory!=false){		
		dataset=dataset.filter(function(d) { return d.Category == filterCategory[0] })
		for (var i=1;i<filterCategory.length;i++){
			dataset=dataset.concat(dataset_copy.filter(function(d) { return d.Category == filterCategory[i] }))
		}	
	}
	
	makeCircles()
		
	//Create X axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - bottompadding) + ")")
		.call(xAxis);
	
	//Create Y axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + sidePadding + ",0)")
		.call(yAxis);
		
	//Graph Title
	svg.append("text")
		.text("Pattern Popularity - " + filterDesigner)
		.attr({
			"x":function(){return (w/2)-120},
			"y":"20",
			"class":"graphTitle"
		});

		//Y-Axis Label
	svg.append("text")
		.text("# Projects Per Pattern")
		.attr({
			"transform":"rotate(90)",
			"x":function(){return (padding)+40},
			"y":function(){return -1*(sidePadding/6)},
			"class":"YaxisLabel",
		});		
		
		//X-Axis Label
	svg.append("text")
		.text("# Hearts (likes) Per Pattern")
		.attr({
			"x":function(){return (w/2)-70},
			"y":function(){return h-(bottompadding/3)+5},
			"class":"YaxisLabel",
		});		
		
		
//Key for colors
/*
	svg.append("text")
		.text("Neck/Torso    Softies   Feel/Legs    Hat   Sweaters    Hands    Blanket")
		.attr({"x":sidePadding,
			   "y":h-10,
			   "class":"keyText"
		})
		;
*/
		
		
	//Setup Image Grid
	var imgGrid = d3.select("#imageGrid")	
		.append("div")
		.attr({
			   "id":"svgImageGrid",
			   })
			   ;
	
	// ****** This filters the pictures that are shown
	pictureData=dataset.filter(function(d) { return (d.Projects >=1000)&&(d.Projects<= 1000) })
	
	//Create images in grid
	var imagesInGrid=imgGrid.selectAll("div")
	   .data(pictureData)
	   .enter()
	   .append("div")
	   .attr("class","imgContainer")
	   		;
	   		
   	var imageLink =imagesInGrid.append("a")
   		.attr("href",function(d){return d.Link})
   				.on("mouseover",function(){
		    $(this).children('p').toggleClass("hidden")
		    })
		.on("mouseout",function(){
		    $(this).children('p').toggleClass("hidden")
		    })
    ;
	   
	imageLink.append("img")
		.attr({"src":function(d){return d.Photo;}
		})
		.classed("gridPic", true)

		;	
	imageLink.append('p')
		.text(function(d){return "'"+d.Name+"' by: "+d.Designer+" - "+d.Price})
		.attr("class","overlay hidden")
		
		;
					

}