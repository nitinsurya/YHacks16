var datum = [
  {
    "activity_date": "2016-01-01T00:00:00Z",
    "activity_type": "Mail Flyers",
    "counts": 1038,
    "targeted_counts": "1000000"
  },
  {
    "activity_date": "2016-01-15T00:00:00Z",
    "activity_type": "Email",
    "counts": 2993,
    "targeted_counts": "1000000"
  },
  {
    "activity_date": "2016-02-25T00:00:00Z",
    "activity_type": "Email",
    "counts": 281,
    "promocodes": "ACCOFF10",
    "targeted_counts": "1123000"
  },
  {
    "activity_date": "2016-02-29T00:00:00Z",
    "activity_type": "Call",
    "counts": 6730,
    "promocodes": "ACCOFF10",
    "targeted_counts": "60000"
  },
  {
    "activity_date": "2016-06-01T00:00:00Z",
    "activity_type": "Email",
    "counts": 982,
    "promocodes": "FREESPOUSE",
    "targeted_counts": "1190500"
  },
  {
    "activity_date": "2016-06-15T00:00:00Z",
    "activity_type": "Call",
    "counts": 1071,
    "promocodes": "FREESPOUSE",
    "targeted_counts": "150000"
  },
  {
    "activity_date": "2016-06-30T00:00:00Z",
    "activity_type": "Mail Flyers",
    "counts": 7870,
    "promocodes": "FINCON",
    "targeted_counts": "200000"
  }
];
    
function drawlinegraph(){
    
    // set the dimensions and margins of the graph
    var width = 240,
        height = 240;

    // parse the date / time

    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");    

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height-10, 0]);
    
    // define the area
    var area = d3.area()
        .curve(eval("d3.curve"+"Cardinal"))
        .x(function(d) { return x(d.activity_date); })
        .y0(height-10)
        .y1(function(d) { return y(d.counts); });

    // define the line
    var valueline = d3.line()
        .curve(eval("d3.curve"+"Cardinal"))
        .x(function(d) { return x(d.activity_date); })
        .y(function(d) { return y(d.counts); });


    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#linegraphsvg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");
	
	datum.forEach(function(d, i){
		console.log((d));
		datum[i].activity_date = parseTime(d.activity_date);
	});
    
    datum.sort(function(a,b){ return new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime();});
	
    // scale the range of the data
    x.domain(d3.extent(datum, function(d) { return d.activity_date; }));
    y.domain([0, d3.max(datum, function(d) { return d.counts; })]);
	
	svg.append("path")
       .data([datum])
       .attr("class", "area")
       .attr("d", area)
       .attr("style", "fill: rgba(54, 196, 208, 0.2)"); 
	
    // add the valueline path
    svg.append("path")
      .data([datum])
      .attr("class", "line")
      .attr("d", valueline)
	  .attr("style","stroke: #36c4d0; fill: none");

        // add points
        svg.selectAll("dot")
            .data(datum)
            .enter().append("circle")
            .attr("r", 4)
            .attr("cx", function(d) { return x(d.activity_date); })
            .attr("cy", function(d) { return y(d.counts); })
            .attr("style", "opacity: 1; fill: #36c4d0")
            .on("mouseenter", function(){
               d3.select(this).attr("style", "opacity: 1; fill: #36c4d0").attr("r", 6); })
            .on("mouseleave", function(){
               d3.select(this).attr("style", "opacity: 1; fill: #36c4d0").attr("r", 4); });   
        
    $('circle').tipsy({ 
        gravity: 'w', 
        title: function() {
          var d = (this.__data__);
          var formatTime = d3.timeFormat("%b %d, %Y.");
              return d.activity_type + " on " + formatTime(d.activity_date);
        }
    });
    }

    // add the X Axis
//    svg.append("g")
//      .attr("transform", "translate(0," + height + ")")
//      .call(d3.axisBottom(x).ticks(6));
//
//    // add the Y Axis
//    svg.append("g")
//      .call(d3.axisLeft(y).ticks(6));

drawlinegraph();