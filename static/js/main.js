var colorpalette = ["#2b8cbe", "#FFC153", "#FC575E", "#66CC99", "#785EDD", "#799412", "#f7fcf0", "#7bccc4"];

var checkjson = {"all": true, "from_dental": false, "other_source": false, "male": false, "female": false, "all_locations": true, "state": false, "first20":false, "second20": false, "third20": false, "fourth20": false, "single": false, "married": false, "all_promo": true, "promo_name": false};

var state = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

var promo = ["FREESPOUSE", "FINCON", "ACCOFF10"];

var exclusions = ["all", "all_locations", "all_promo", "state", "promo_name"];

var x = 0;

var temp = datajson;

var dentalparams = ["from_dental", "other_source"], genderparams = ["male", "female"], ageparams = ["first20", "second20", "third20", "fourth20"], maritalparams = ["single", "married"], promoparams = ["all_promo", "promo_name"];
var dentaljson = {}, genderjson = {}, agejson = [], maritaljson = {}, promojson = [];
var markers = 0;

function drawonmap(addressPoints) {
    if(markers != 0) {
        map.removeLayer(markers);
    }
    markers = L.markerClusterGroup(); 
    for (var i = 0; i < addressPoints.length; i++) {
        var a = addressPoints[i];
        var marker = L.marker(new L.LatLng(a.lat, a.lon), {});
        markers.addLayer(marker);
    }

    map.addLayer(markers);
}

function check(id, checkjson){
    if(id=="all"){
        checkjson = {"all": true, "from_dental": false, "other_source": false, "male": false, "female": false, "all_locations": true, "state": false, "first20":false, "second20": false, "third20": false, "fourth20": false, "single": false, "married": false, "all_promo": true, "promo_name": false};
        var checkjson_keys = Object.keys(checkjson);
        checkjson_keys.forEach(function(d){
            if(exclusions.indexOf(d)==-1){
                document.getElementById(d).checked = false;
            }                       
        });
        $('#state_form').prop('selectedIndex',0);
        $('#promo_form').prop('selectedIndex',0);
        x = 1;
    }
    else if(id=="all_locations"){
        checkjson["all_locations"] = true;
        checkjson["state"] = false;
    }
    else if(state.indexOf(id)!=-1){
        checkjson["all_locations"] = false;
        checkjson["state"] = id;
        
    }
    else if(id=="all_promo"){
        checkjson["all_promo"] = true;
        checkjson["promo_name"] = false;
    }
    else if(promo.indexOf(id)!=-1){
        checkjson["all_promo"] = false;
        checkjson["promo_name"] = id;
    }
    else{
        checkjson[id] = !checkjson[id];
    }
    if(id!="all")x = 0;
    if(x!=1)checkjson.all = false;
    var e = extractdata(checkjson);
	drawonmap(e);
    drawcharts(e, checkjson);
}
   
function findtrues(checkjson){
    var trues = [], falses = [];
    var checkjson_keys = Object.keys(checkjson);
    checkjson_keys.forEach(function(d){
        if(!checkjson[d]){
            falses.push(d);
        }
        else{
            trues.push(d);
        }
    });
    return trues;
}

function extractdata(checkjson){
    temp = datajson;
    if(checkjson.all)
        return datajson;
    else{
        if(checkjson.from_dental&&checkjson.other_source);
        else if(!checkjson.from_dental&&!checkjson.other_source);
        else{
            if(checkjson.from_dental){
                temp=temp.filter(function(d){
                    return d.dental == true;
                });
            }
            else{
                temp=temp.filter(function(d){
                    return d.dental == false;
                });
            }
        }
        if(checkjson.male&&checkjson.female);
        else if(!checkjson.male&&!checkjson.female);
        else{
            if(checkjson.male){
                temp=temp.filter(function(d){
                    return d.sex == "M";
                });
            }
            else{
                temp=temp.filter(function(d){
                    return d.sex == "F";
                });
            }
        }
        if(!checkjson.all_locations){
            temp=temp.filter(function(d){
                return d.state == checkjson.state;
            });
        }
        var temp1 = [], temp2 = [], temp3 = [], temp4 = [];
        if(checkjson.first20){
            temp1=temp.filter(function(d){
                return d.age < 20;
            });
        }
        if(checkjson.second20){
            temp2=temp.filter(function(d){
                return ((d.age >= 20)&&(d.age<40));
            });
        }
        if(checkjson.third20){
            temp3=temp.filter(function(d){
                return ((d.age >= 40)&&(d.age<60));
            });
        }
        if(checkjson.fourth20){
            temp4=temp.filter(function(d){
                return (d.age >=60);
            });
        }
        if(checkjson.first20&&checkjson.second20&&checkjson.third20&&checkjson.fourth20);
        else if(!checkjson.first20&&!checkjson.second20&&!checkjson.third20&&!checkjson.fourth20);
        else{
            temp = temp1.concat(temp2);
            temp = temp.concat(temp3);
            temp = temp.concat(temp4);    
        }
        if(checkjson.married&&checkjson.single);
        else if(!checkjson.married&&!checkjson.single);
        else{
            if(checkjson.single){
                temp=temp.filter(function(d){
                    return (d.marital_status == "S");
                });
            }
            else{
                temp=temp.filter(function(d){
                    return (d.marital_status == "M");
                });
            }
        }
        if(!checkjson.all_promo){
            temp=temp.filter(function(d){
                return d.promo == checkjson.promo_name;
            });
        }
    }
    return temp;
}
    
function overlap(l1, l2){
    for(var j=0; j<l1.length; j++){
        if(l2.indexOf(l1[j])!=-1)
            return true;
    }
    for(var k=0; k<l2.length; k++){
        if(l1.indexOf(l2[k])!=-1)
            return true;
    }
    return false;
}
$( document ).ready(function() {
    drawonmap(datajson);
});