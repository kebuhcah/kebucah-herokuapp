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
  'no family' : 'gray'};

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
      fillOnClick("#eu-color", function (d) { return parlgov[d.id] ? d.id === 'GBR' ? '#F05D5E' : parlgov[d.id].eu_accession_date ? 'gold' : '' : ''; })
      fillOnClick("#party-data-color", function (d) { return parlgov[d.id] ? parlgov[d.id].parties ? 'green' : '#DB8' : '#DB8'; })
      fillOnClick("#cpi-color", function (d) { return parlgov[d.id] ? parlgov[d.id].cpi2015 ? d3.scale.linear()
        .domain([30, 60, 90])
        .range(["red", "white", "blue"])(parlgov[d.id].cpi2015) : '#DB8' : '#DB8'; })
      fillOnClick("#population-color", function (d) { return parlgov[d.id] ? parlgov[d.id].totalPopulation ? d3.scale.sqrt()
          .domain([0, 145000000])
          .range(["white", "orange"])(parlgov[d.id].totalPopulation) : '#DB8' : '#DB8'; })
      fillOnClick("#density-color", function (d) { return parlgov[d.id] ? parlgov[d.id].populationDensity ? d3.scale.sqrt()
          .domain([5, 400])
          .range(["white", "blue"])(parlgov[d.id].populationDensity) : '#DB8' : '#DB8'; })
      fillOnClick("#gdp-color", function (d) { return parlgov[d.id] ? parlgov[d.id].gdpUsd ? d3.scale.sqrt()
          .domain([0, 3355772429854])
          .range(["white", "green"])(parlgov[d.id].gdpUsd) : '#DB8' : '#DB8'; })
      fillOnClick("#gdpPerCapita-color", function (d) { return parlgov[d.id] ? parlgov[d.id].gdpPerCapitaUsd ? d3.scale.linear()
          .domain([0, 101449])
          .range(["white", "purple"])(parlgov[d.id].gdpPerCapitaUsd) : '#DB8' : '#DB8'; })
      fillOnClick("#unemployment-color", function (d) { return parlgov[d.id] ? parlgov[d.id].gdpPerCapitaUsd ? d3.scale.linear()
          .domain([0, 25])
          .range(["white", "red"])(parlgov[d.id].unemploymentIlo) : '#DB8' : '#DB8'; })

      fillOnClick("#rulingParty-color", function(d){ return familyMap[getRulingParty(d).family_name]; })
      fillOnClick("#ruling-left-right-color", function (d) { return getRulingParty(d).left_right ? d3.scale.linear()
          .domain([0, 5, 10])
          .range(["red", "white", "royalblue"])(getRulingParty(d).left_right) : '#DB8'; })
      fillOnClick("#ruling-state-market-color", function (d) { return getRulingParty(d).state_market ? d3.scale.linear()
          .domain([0, 5, 10])
          .range(["red", "white", "green"])(getRulingParty(d).state_market) : '#DB8'; })
      fillOnClick("#ruling-liberty-authority-color", function (d) { return getRulingParty(d).liberty_authority ? d3.scale.linear()
          .domain([0, 5, 10])
          .range(["green", "white", "purple"])(getRulingParty(d).liberty_authority) : '#DB8'; })
      fillOnClick("#ruling-pro-anti-eu-color", function (d) { return getRulingParty(d).eu_anti_pro ? d3.scale.linear()
          .domain([0, 5, 10])
          .range(["red", "white", "royalblue"])(getRulingParty(d).eu_anti_pro) : '#DB8'; })
      //d3.selectAll(".active").classed("active", false);
      d3.select("#rulingParty-color").on("click")();

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
          svg.selectAll(".country-label")
            .attr("transform", function(d) { return "translate(" + pathDotCentroid(d) + ")"; });
      }

  });
});

function getRulingParty(d) {
  nullResult = {family_name: '', party_name: '', party_name_english: '',
    eu_anti_pro: NaN, left_right: NaN, liberty_authority: NaN, state_market: NaN}

  if (!parlgov[d.id] || !parlgov[d.id].parties) {
    return nullResult;
  }

  parties = parlgov[d.id].parties;
  for(i=0; i < parties.length; i++) {
    if (parties[i].cabinet_party) {
      return parties[i];
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
    d3.selectAll(".active").classed("active", false);
    //d3.select(emojiMap[id] ? "#fill-dropdown" : id).classed("active", true);
    d3.select(id).classed("active", true);
    d3.select("#fill-status").text(emojiMap[id]);
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

  console.log("Clicked " + d.id)

  d3.select("#country-election-date td").text(parlgov[d.id] ? parlgov[d.id].election_date ? parlgov[d.id].election_date.substring(0,10) : 'unknown' : 'unknown');
  rulingPartyText = getRulingParty(d).party_name_english;
  if (getRulingParty(d).party_name && d.id !== 'GBR' && d.id !== 'IRL' && d.id !== 'ROU')
    rulingPartyText = rulingPartyText + ' <br> (' + getRulingParty(d).party_name + ')'
  d3.select("#country-ruling-party td").html(rulingPartyText);
  d3.select("#country-ruling-party-family td").text(getRulingParty(d).family_name);
  //d3.select("#country-ruling-party-seats td").text(parlgov[d.id] ? (parlgov[d.id].parties ? parlgov[d.id].parties[0].seats
  //  + ' / ' + parlgov[d.id].seats_total + ' (' + d3.round(parlgov[d.id].parties[0].seats/parlgov[d.id].seats_total*100,1) + '%)' : 'unknown') : 'unknown');
  //d3.select("#country-ruling-party-votes td").text(parlgov[d.id] ? parlgov[d.id].parties ? parlgov[d.id].parties[0].vote_share + '%' : 'unknown' : 'unknown');
  d3.select("#country-population td").text(d3.format(',d')(parlgov[d.id] ? parlgov[d.id].totalPopulation : NaN));
  d3.select("#country-gdp td").text(d3.format('$,f')(parlgov[d.id] ? parlgov[d.id].gdpUsd : NaN));
  d3.select("#country-corruption td").text(parlgov[d.id] ? parlgov[d.id].cpi2015 : NaN);
  d3.select("#country-system td").text(parlgov[d.id] ? parlgov[d.id].governmentType : 'unknown');

}
