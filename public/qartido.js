var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , edges = { top: 72, left: -25, bottom: 24, right: 50 }
  , width = window.innerWidth
  , width = width - margin.left - margin.right
  , mapRatio = .7, widthCenterRatio = .5, heightCenterRatio = .6
  , height = Math.min(window.innerHeight, width * mapRatio)
  , scaleFactor = 0.95;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "root");

var upcomingCountries = ['SRB', 'ALB', 'DEU', 'BGR', 'FRA', 'ARM', 'ISL', 'UKR', 'SVN', 'CZE'];

function isHiddenCountry(d) {
  //console.log(d);
  return !(d.properties.continent === 'Europe' || ['CYP','CYN','TUR','ARM','AZE','GEO'].indexOf(d.id) >= 0)
    || ['JEY','FRO','GGY','IMN','ALD','AND','MCO','LIE','SMR'].indexOf(d.id) >= 0;
}

var projection = d3.geo.azimuthalEqualArea()
  .center([20, 48.5])
  .scale(width * scaleFactor)
  .translate([width * widthCenterRatio, height * heightCenterRatio]);

var path = d3.geo.path()
  .projection(projection);

var radius = d3.scale.sqrt()
  .domain([0, 200])
  .range([0, 50]);

var voronoi = d3.geom.voronoi()
  .x(function(d) { return pathDotCentroid(d)[0]; })
  .y(function(d) { return pathDotCentroid(d)[1]; })
  .clipExtent([[0, 0], [width, height]]);

var parlgov = {};

var familyMap = {'Agrarian' : 'green',
  'Christian democracy' : 'aqua',
  'Communist/Socialist' : 'red',
  'Conservative' : 'royalblue',
  'Liberal' : 'orange',
  'Social democracy' : 'pink',
  'no family' : 'gray',
  '' : 'gray'};

var emojiMap = {
  "#population-color" : "👥",
  "#density-color" : "🏙",
  "#gdp-color" : "💰",
  "#gdpPerCapita-color" : "💶",
  "#cpi-color" : "🕵",
  "#ruling-left-right-color" : "↔️",
  "#ruling-state-market-color" : "🏛",
  "#ruling-liberty-authority-color" : "⚖",
  "#ruling-pro-anti-eu-color" : "🇪🇺",
  "#unemployment-color" : "🏚",
  "#rulingParty-color" : "👑",
  "#upcoming-color" : "⏰",
}

function pathDotCentroid(d) {
  unit = window.innerWidth/120
  if (d.id === 'FRA') {
    return [path.centroid(d)[0]+(unit * 14),path.centroid(d)[1]-(unit * 11.5)]
  } else if (d.id === 'HRV') {
    return [path.centroid(d)[0],path.centroid(d)[1]-unit]
  } else if (d.id === 'CYP') {
    return [path.centroid(d)[0]-unit*2,path.centroid(d)[1]-unit]
  } else if (d.id === 'RUS') {
    return [path.centroid(d)[0]-(unit * 10),path.centroid(d)[1]+(unit * 30)]
  } else {
    return path.centroid(d)
  }
}

d3.json("europe.json", function(error, europe) {
  if (error) return console.error(error);

  d3.select(".progress-bar").style("width","60%");

  d3.json('parlgov.json', function(error, json) {
    if (error) return console.error(error);

    d3.select(".progress-bar").style("width","75%");

    parlgov = json; // parlgov is GLOBAL

    console.log(parlgov);

    countries = topojson.feature(europe, europe.objects.countries);

    countries.features.forEach(function(d) {
      if(json[d.id]) {
        for (var attrname in json[d.id]) {
          if (d.properties[attrname]) continue; // don't clobber
          d.properties[attrname] = json[d.id][attrname];
        }
      }
    });

    var cyprusDatum = countries.features[countries.features.findIndex(function(d) { return d.id === 'CYP'; })];
    cyprusDatum.geometry = topojson.merge(europe,europe.objects.countries.geometries.filter(function(d) {
      return d.id === 'CYP' || d.id == 'CYN'; }));

    console.log(countries);

    svg.append("defs").selectAll("clipPath")
        .data(countries.features.filter(function(d) { return d.id !== 'CYP' && d.id !== 'CYN'; }))
      .enter().append("clipPath")
        .attr("id",function(d) { return "clip-path-" + d.id})
      .append("path")
        .attr("class", function(d) { return "country-clip " + d.id; })
        .attr("d", path);

    svg.select("defs").append("clipPath")
        .datum(cyprusDatum)
        .attr("id", "clip-path-CYP")
      .append("path")
        .attr("class", "country-clip CYP")
        .attr("d", path);

    svg.selectAll(".country")
        .data(countries.features.filter(function(d) { return d.id !== 'CYP' && d.id !== 'CYN'; }))
      .enter().append("path")
        .attr("class", function(d) { return "country " + (d.id === 'CYN' ? 'CYP' : d.id); })
        .attr("d", path)
        .attr("clip-path", function(d) { return "url(#clip-path-" + d.id + ")"; })
        //.classed("upcoming", function(d) { return upcomingCountries.indexOf(d.id) >= 0; })
        .classed("ghost", function(d) { return isHiddenCountry(d); });

    svg.append("path")
        .datum(cyprusDatum)
        .attr("class", "country CYP")
        .attr("d", path)
        .attr("clip-path", "url(#clip-path-CYP)")
        .style("pointer-events", "all");

    svg.selectAll(".country")
        .style("pointer-events", "all")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        //.on("touchend", touchend)
        .on("mousedown", mousedown)
        .on("mouseup", mouseup)
        .on("click", click);

    svg.append("path")
      .datum(topojson.mesh(europe, europe.objects.countries, function(a, b) {
        return !(a.id === 'CYP' && b.id === 'CYN' || a.id === 'CYN' && b.id === 'CYP');
      }))
      .attr("d", path)
      .attr("class", "border");

    svg.append("path")
      .datum(topojson.merge(europe,europe.objects.countries.geometries.filter(function(d) {
        return d.properties.eu_accession_date || d.id == 'CYN' ? true : false; })))
      .attr("d", path)
      .attr("class", "eu-border")
      .style("display","none")
      .style("pointer-events", "none");

    svg.selectAll(".country-label")
        .data(countries.features.filter(function(d) {
          return !isHiddenCountry(d) && ['CYN','LUX','MNE','KOS'].indexOf(d.id) < 0;
        }))
    .enter().append("text")
      .attr("class", function(d) { return "country-label " + d.id; })
      .attr("transform", function(d) { return "translate(" + pathDotCentroid(d) + ")"; })
      .attr("dy", ".35em")
      .attr("font-size", 12)
      .text(function(d) { return ['MKD','MNE','KOS','BIH','LUX','SVN','HRV','AND','MCO','SMR','LIE'].indexOf(d.id) >= 0
           ? d.id : d.properties.name; })
      .attr("x", function(d) {
        return 0;
      })
      .style("text-anchor", function(d) {
        return "middle";
      })
      .style("pointer-events", "none");

      d3.select(".progress-bar").style("width","90%");

      fillOnClick("#reset-color", function (d) { return '#DB8'; })
      fillOnClick("#upcoming-color", function (d) { return upcomingCountries.indexOf(d.id) >= 0 ? '#0F7173' : '#DB8'; })
      fillOnClick("#party-data-color", function (d) { return d.properties.parties ? 'green' : '#DB8'; })
      fillOnClick("#cpi-color", function (d) { return d.properties.cpi2015 ? d3.scale.linear()
        .domain([30, 60, 90])
        .range(["red", "white", "blue"])(d.properties.cpi2015) : 'gray'; })
      fillOnClick("#population-color", function (d) { return d.properties.totalPopulation ? d3.scale.sqrt()
          .domain([0, 145000000])
          .range(["white", "orange"])(d.properties.totalPopulation) : 'gray'; })
      fillOnClick("#density-color", function (d) { return d.properties.populationDensity ? d3.scale.sqrt()
          .domain([5, 400])
          .range(["white", "blue"])(parlgov[d.id].populationDensity) : 'gray'; })
      fillOnClick("#gdp-color", function (d) { return d.properties.gdpUsd ? d3.scale.sqrt()
          .domain([0, 3355772429854])
          .range(["white", "green"])(d.properties.gdpUsd) : 'gray'; })
      fillOnClick("#gdpPerCapita-color", function (d) { return d.properties.gdpPerCapitaUsd ? d3.scale.linear()
          .domain([0, 101449])
          .range(["white", "purple"])(d.properties.gdpPerCapitaUsd) : 'gray'; })
      fillOnClick("#unemployment-color", function (d) { return d.properties.unemploymentIlo ? d3.scale.linear()
          .domain([0, 25])
          .range(["white", "red"])(d.properties.unemploymentIlo) : 'gray'; })

      fillOnClick("#rulingParty-color", function(d){ return familyMap[getRulingParty(d).family_name]; })
      fillOnClick("#ruling-left-right-color", function (d) { return getRulingParty(d).left_right ? d3.scale.linear()
          .domain([0, 5, 10])
          .range(["red", "white", "royalblue"])(getRulingParty(d).left_right) : 'gray'; })
      fillOnClick("#ruling-state-market-color", function (d) { return getRulingParty(d).state_market ? d3.scale.linear()
          .domain([0, 5, 10])
          .range(["red", "white", "green"])(getRulingParty(d).state_market) : 'gray'; })
      fillOnClick("#ruling-liberty-authority-color", function (d) { return getRulingParty(d).liberty_authority ? d3.scale.linear()
          .domain([0, 5, 10])
          .range(["green", "white", "purple"])(getRulingParty(d).liberty_authority) : 'gray'; })
      fillOnClick("#ruling-pro-anti-eu-color", function (d) { return getRulingParty(d).eu_anti_pro ? d3.scale.linear()
          .domain([0, 5, 10])
          .range(["red", "white", "royalblue"])(getRulingParty(d).eu_anti_pro) : 'gray'; })

      d3.select("#eu-color").on("click", function() {
        if (d3.select("#eu-color").classed("active")) {
          d3.select(".eu-border").style("display","none");
          d3.select("#eu-color").classed("active",false);
        } else {
          d3.select(".eu-border").style("display","");
          d3.select("#eu-color").classed("active",true);
        }
      })

      d3.select("#rulingParty-color").on("click")();
      d3.select("#eu-color").on("click")();

      d3.select(window).on('resize', resize);

      d3.select(".progress-bar").style("width","100%");
      d3.select(".progress").transition().style("display", "none");

      function resize() {
          // adjust things when the window size changes
          width = window.innerWidth;
          width = width - margin.left - margin.right;
          height = Math.min(window.innerHeight, width * mapRatio);

          // update projection
          projection
              .translate([width * widthCenterRatio, height * heightCenterRatio])
              .scale(width * scaleFactor);

          // resize the map container
          svg.attr('width', width).attr('height', height);

          // resize the map
          svg.selectAll('.country-clip').attr('d', path);
          svg.selectAll('.country').attr('d', path);
          svg.selectAll('.border').attr('d', path);
          svg.selectAll('.eu-border').attr('d', path);
          svg.selectAll(".country-label")
            .attr("transform", function(d) { return "translate(" + pathDotCentroid(d) + ")"; });
      }

  });
});

function getRulingParty(d) {
  nullResult = {family_name: '', party_name: '', party_name_english: '',
    eu_anti_pro: NaN, left_right: NaN, liberty_authority: NaN, state_market: NaN}

  if (!d.properties.parties) {
    return nullResult;
  }

  for(i=0; i < d.properties.parties.length; i++) {
    if (d.properties.parties[i].prime_minister || d.properties.parties[i].cabinet_party || d.id === 'ROU') {
      return d.properties.parties[i];
    }
  }

  return nullResult;
 }

function fillOnClick(id, func) {
  coloringOnClick(id, func, "fill");
}

function edgeOnClick(id, func) {
  coloringOnClick(id, func, "stroke");
}

function coloringOnClick(id, func, attr) {
  d3.select(id).on("click", function() {
    svg.selectAll(".country")
      .filter(function(d){ return !isHiddenCountry(d); })
      .transition().style(attr, func);
    //d3.selectAll(".active").classed("active", false);
    //d3.select(emojiMap[id] ? "#fill-dropdown" : id).classed("active", true);
    //d3.select(id).classed("active", true);
    d3.select("#fill-status").text(id === "#reset-color" ? 'none' : d3.select(id).text());
    //d3.select("#fill-caret").style("display", emojiMap[id] ? "none" : "")
  });
}

function mouseover(d,i) {
  if (isHiddenCountry(d)) return;
  d3.selectAll("." + d.id).classed("highlighted",true);
  d3.selectAll(".legend text").classed("highlighted",true);
}

function mouseout(d,i) {
  d3.selectAll("." + d.id).classed("highlighted",false);
  d3.selectAll(".legend text").classed("highlighted",false);
}

function mousedown(d,i) {
}

function mouseup(d,i) {
}

function touchend(d,i) {
}

function click(d,i) {
  click0(d,i);
}

function click0(d,i) {
  if (isHiddenCountry(d) || d.id === 'CYN') return;

  var properties = d.properties;

  $('#myModal').modal('show');
  $('#myModalLabel').text(properties.name);

  //console.log("Clicked " + d.id)

  d3.select("#country-election-date td").text(d.properties.election_date ? parlgov[d.id].election_date.substring(0,10) : '');
  rulingPartyText = getRulingParty(d).party_name_english;
  if (getRulingParty(d).party_name && d.id !== 'GBR' && d.id !== 'IRL')
    rulingPartyText = rulingPartyText + ' <br> (' + getRulingParty(d).party_name + ')'
  d3.select("#country-ruling-party td").html(rulingPartyText);
  d3.select("#country-ruling-party-family td").text(getRulingParty(d).family_name);
  //d3.select("#country-ruling-party-seats td").text(parlgov[d.id] ? (parlgov[d.id].parties ? parlgov[d.id].parties[0].seats
  //  + ' / ' + parlgov[d.id].seats_total + ' (' + d3.round(parlgov[d.id].parties[0].seats/parlgov[d.id].seats_total*100,1) + '%)' : 'unknown') : 'unknown');
  //d3.select("#country-ruling-party-votes td").text(parlgov[d.id] ? parlgov[d.id].parties ? parlgov[d.id].parties[0].vote_share + '%' : 'unknown' : 'unknown');
  d3.select("#country-population td").text(d3.format(',d')(Math.round(d.properties.totalPopulation / 100000)*100000));
  d3.select("#country-gdp td").text(d3.format('$,d')(Math.round(d.properties.gdpUsd / 1000000000)*1000000000));
  d3.select("#country-corruption td").text(d.properties.cpi2015);
  d3.select("#country-unemployment td").text(d3.format('.1f')(d.properties.unemploymentIlo) + '%');
  d3.select("#country-system td").text(d.properties.governmentType);

}
