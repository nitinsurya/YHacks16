function drawpie(data, canvasID, divID, wi, hei) {
    
    // pie chart canvas dimensions
    
    var canvas = document.getElementById(canvasID),
        context = canvas.getContext("2d");
    
    var w = wi,
        h = hei,
        radius = Math.min(w, h) / 2;

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0)
        .context(context);

    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40)
        .context(context);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.val; });

    context.translate(w / 2, h / 2);

    var dat = [];
    data_keys = Object.keys(data);
    for(var p = 0; p < 2; p++){
      var temp={};
      temp.kee = data_keys[p];
      temp.val= Number(data[data_keys[p]]);
      dat.push(temp);
    }

    var arcs = pie(dat);

    arcs.forEach(function(d, i) {
    context.beginPath();
    arc(d);
    context.fillStyle = colorpalette[i];
    context.fill();
    });

    context.beginPath();
    arcs.forEach(arc);
    context.strokeStyle = "#2e2c38";
    context.stroke();

    context.textAlign = "center";
    context.font = "12px Open Sans, Helvetica, Arial, sans-serif";
    context.textBaseline = "middle";
    context.fillStyle = "#FFF";

    arcs.forEach(function(d) {
    var c = labelArc.centroid(d);
    context.fillText(d.data.kee + " (" + d.data.val + ")", c[0], c[1]);
    });

}