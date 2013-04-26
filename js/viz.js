var filterDesigner = "All Designers"
var filterCategory=new Array
$(document).ready(function() {
	//Setup the viz for the first time
	run();
	//Filter Designer by button click
	$(".designer").click(function(){
		if(filterDesigner!=$(this).text()){
		filterDesigner=$(this).text(); //sets the filter to the designer that is clicked.
		$(this).css("background-color","#B71F4A")
		$(this).siblings().css("background-color", "#D3D3B1");
		}
		else{
			filterDesigner="All Designers"
			$(this).css("background-color", "#D3D3B1");
		}
		$("svg").remove();
		run()
	})
	//Filter Category
	$('.category').click(function() {
	    if ($.inArray($(this).text(),filterCategory)!=-1){ //clicked before so remove it
		    console.log($.inArray($(this).text(),filterCategory))
    		filterCategory.splice($.inArray($(this).text(),filterCategory), 1);
    		$(this).css("background-color","#C2EBB1");
    		
    		$("svg").remove();
			run()	
	    }
	    else{ // add the filter
    		filterCategory.push($(this).text());
    		$(this).css("background-color","#B71F4A")
    		$("svg").remove();
			run()
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
		
	
	//#############  Visualization  ##############
	// Width, height, and padding of SVG box
	var w = 700;
	var h = 400;
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
			  return "<div class='popup'><a href='"+d.Link+"'>"+d.Name+ "'  Category: "+d.Category+"<div><img src="+d.Photo+"></div><div>Price: $"+d.Price+"0</div></div>"; 
			}
		});
	}

	// Filter the data from the file to only show one designer
	if (filterDesigner!="All Designers"){
		dataset=dataset.filter(function(d) { return d.Designer == filterDesigner })
	}
	console.log(filterCategory)
	if(filterCategory!=false){

		for (var i=0;i<filterCategory.length;i++){

			dataset=dataset.filter(function(d) { return d.Category == filterCategory[i] })
			makeCircles()
		}
		
	}
	else{
		makeCircles()
	}

/*
	
//####### TOOLTIPS  #######	
	var tooltipH=20;
	var tooltipW=100;
	   
	var tooltip = svg.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr('x',function(d){
			return xScale(d.Hearts)-(tooltipW/2);
		})
		.style("z-index", "10")
		.attr("class","tooltip")
		.attr("y",function(d){
			return yScale(d.Projects)-(tooltipH+5);
		})
		.attr({
			"height":tooltipH,
			"width":tooltipW,
			"stroke":"black",
			"fill-opacity":"0"
		})
		.append("div")
			.text(function(d){
				return d.Name
			})
			.style("z-index","10")
		.style("visibility", "hidden")
		;	
	
	
*/		
	
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
		.text(filterDesigner)
		.attr({
			"x":function(){return (w/2)-40},
			"y":"20",
			"class":"graphTitle"
		});

		//Y-Axis Label
	svg.append("text")
		.text("# Projects per Pattern")
		.attr({
			"transform":"rotate(90)",
			"x":function(){return (padding)+90},
			"y":function(){return -1*(sidePadding/6)},
			"class":"YaxisLabel",
		});		
		
		//X-Axis Label
	svg.append("text")
		.text("# Hearts(likes) per Pattern")
		.attr({
			"x":function(){return (w/3)},
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
	var gridW=500;
	
	var imgGrid = d3.select("#imageGrid")	
		.append("svg")
		.attr({"width": gridW,
			   "id":"svgImageGrid",
			   })
			   ;
	
	//Create images in grid
	var imagesInGrid=imgGrid.selectAll("div")
	   .data(dataset)
	   .enter()
	   .append("div")
	   .style("height","10")
	   .style("width","10")
	   .style("float","left")
	   .style("border","black")
	   
}