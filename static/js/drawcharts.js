function drawcharts(exdata, checkjs){
    var trueparams = findtrues(checkjs);
    dentaljson["From Dental"] = 0;
    dentaljson["Other Source"] = 0;
    genderjson["Male"] = 0;
    genderjson["Female"] = 0;
    agejson.push({"name": "0-19", "value":0});
    agejson.push({"name": "20-39", "value":0});
    agejson.push({"name": "40-59", "value":0});
    agejson.push({"name": "60+", "value":0});
    maritaljson["Single"] = 0;
    maritaljson["Married"] = 0;
    promojson.push({"name": "FREESPOUSE", "value":0});
    promojson.push({"name": "FINCON", "value":0});
    promojson.push({"name": "ACCOFF10", "value":0});
    exdata.forEach(function(d){
        if(d.dental)
            {dentaljson["From Dental"]+=1;}
        else
            {dentaljson["Other Source"]+=1;}
        if(d.sex == "M")
            {genderjson["Male"]+=1;}
        else
            {genderjson["Female"]+=1;}
        if(d.age < 20)
            {agejson[0]["value"]+=1;}
        else if((d.age >= 20)&&(d.age<40))
            {agejson[1]["value"]+=1;}
        else if((d.age >= 40)&&(d.age<59))
            {agejson[2]["value"]+=1;}
        else
            {agejson[3]["value"]+=1;}
        if(d.marital_status=="single")
            {maritaljson["Single"]+=1;}
        else
            {maritaljson["Married"]+=1;}
        if(d.promo=="FREESPOUSE")
            {promojson[0]["value"]+=1;}
        else if(d.promo=="FINCON")
            {promojson[1]["value"]+=1;}
        else if(d.promo=="ACCOFF10")
            {promojson[2]["value"]+=1;}
    });
    if(!overlap(trueparams, dentalparams)){
        $("#typeDiv").show();
        d3.select("#"+"insurancepieCanvas").remove();
        d3.select("#"+"insurancepieDiv").append("canvas").attr("width", 240).attr("height", 240).attr("id", "insurancepieCanvas");
        drawpie(dentaljson, "insurancepieCanvas", "insurancepieDiv", 240, 240);
    }
    else{
        $("#typeDiv").hide();
    }
    
    if(!overlap(trueparams, genderparams)){
        $("#genderDiv").show();
        d3.select("#"+"genderpieCanvas").remove();
        d3.select("#"+"genderpieDiv").append("canvas").attr("width", 240).attr("height", 240).attr("id", "genderpieCanvas");
       drawpie(genderjson, "genderpieCanvas", "genderpieDiv", 240, 240);     
    }
    else{
        $("#genderDiv").hide();
    }
    
    if(!overlap(trueparams, ageparams)){
        $("#ageDiv").show();
        d3.select("#"+"agebarsvg").remove();
        d3.select("#"+"agebarDiv").append("svg").attr("id","agebarsvg");
       drawbarchart(agejson, "agebarsvg", "agebarDiv", 250, 240);
    }
    else{
        $("#ageDiv").hide();
    }

    if(!overlap(trueparams, maritalparams)){
        $("#maritalDiv").show();
        d3.select("#"+"maritalpieCanvas").remove();
        d3.select("#"+"maritalpieDiv").append("canvas").attr("width", 240).attr("height", 240).attr("id", "maritalpieCanvas");
       drawpie(maritaljson, "maritalpieCanvas", "maritalpieDiv", 240, 240);    
    }
    else{
        $("#maritalDiv").hide();
    }

    if(checkjs.all_promo){
        $("#promoDiv").show();
        d3.select("#"+"promobarsvg").remove();
        d3.select("#"+"promobarDiv").append("svg").attr("id","promobarsvg");
       drawbarchart(promojson, "promobarsvg", "promobarDiv", 250, 240);
    }
    else{
        $("#promoDiv").hide();
    }
}

drawcharts(datajson, checkjson);