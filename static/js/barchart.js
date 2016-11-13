function drawbarchart(data, svgID, divID, wi, hei){
    
    svg = document.getElementById(svgID);
    w = wi-35;
    h = hei-35;
    
    // set the ranges
    var x = d3.scaleBand()
              .range([0, w])
              .padding(0.4);
    var y = d3.scaleLinear()
              .range([h, 0]);
    
    var svg = d3.select("#"+svgID)
        .attr("width", w+35)
        .attr("height", h+35)
        .append("g")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");
    
    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);
    
    // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name)+30; })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return h - y(d.value)})
      .style("fill", function(d, i){ return colorpalette[i+2] });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(" + 35 + "," + h + ")")
  	  .attr("id","barX")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .attr("transform", "translate(" + 35 + "," + 0 + ")")
  	  .attr("id","barY")
      .call(d3.axisLeft(y));
    
}
