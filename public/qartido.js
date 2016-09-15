var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , width = window.innerWidth
  , width = width - margin.left - margin.right
  , mapRatio = .7
  , height = Math.min(window.innerHeight, width * mapRatio)
  , scaleFactor = 0.9;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "root");

var upcomingCountries = ['SRB', 'ALB', 'DEU', 'BGR', 'FRA', 'ARM', 'ISL', 'UKR', 'SVN', 'CZE'];

function isHiddenCountry(d) {
  return !(d.properties.continent === 'Europe' || ['CYP','CYN','TUR','ARM','AZE','GEO'].indexOf(d.id) >= 0)
    || ['JEY','FRO','GGY','IMN','ALD','AND','MCO','LIE','SMR'].indexOf(d.id) >= 0;
}

var projection = d3.geo.azimuthalEqualArea()
  .center([20, 53])
  .scale(width * scaleFactor)
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

var radius = d3.scale.sqrt()
  .domain([0, 200])
  .range([0, 50]);

var voronoi = d3.geom.voronoi()
  .x(function(d) { return pathDotCentroid(d)[0]; })
  .y(function(d) { return pathDotCentroid(d)[1]; })
  .clipExtent([[0, 0], [width, height]]);

function pathDotCentroid(d) {
  unit = window.innerWidth/120
  if (d.id === 'FRA') {
    return [path.centroid(d)[0]+(unit * 13.5),path.centroid(d)[1]-(unit * 11)]
  } else if (d.id === 'HRV') {
    return [path.centroid(d)[0],path.centroid(d)[1]-unit]
  } else if (d.id === 'RUS') {
    return [path.centroid(d)[0]-(unit * 10),path.centroid(d)[1]+(unit * 30)]
  } else {
    return path.centroid(d)
  }
}

d3.json("europe.json", function(error, europe) {
  if (error) return console.error(error);

  console.log(europe);

  var countries = topojson.feature(europe, europe.objects.countries);

  svg.selectAll(".country")
      .data(countries.features)
    .enter().append("path")
      .attr("class", function(d) { return "country " + (d.id === 'CYN' ? 'CYP' : d.id); })
      .attr("d", path)
      .classed("upcoming", function(d) { return upcomingCountries.indexOf(d.id) >= 0; })
      .classed("ghost", function(d) { return isHiddenCountry(d); })
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
        return !isHiddenCountry(d) && d.id !== 'CYN';
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

    d3.select(window).on('resize', resize);

    function resize() {
        // adjust things when the window size changes
        width = window.innerWidth;
        width = width - margin.left - margin.right;
        height = Math.min(window.innerHeight, width * mapRatio);

        // update projection
        projection
            .translate([width / 2, height / 2])
            .scale(width * scaleFactor);

        // resize the map container
        svg.attr('width', width).attr('height', height);

        // resize the map
        svg.selectAll('.country').attr('d', path);
        svg.selectAll('.border').attr('d', path);
        svg.selectAll(".country-label")
          .attr("transform", function(d) { return "translate(" + pathDotCentroid(d) + ")"; });
        svg.selectAll(".quota")
          .attr("transform", function(d) { return "translate(" + pathDotCentroid(d) + ")"; });
        svg.selectAll(".consumption")
          .attr("transform", function(d) { return "translate(" + pathDotCentroid(d) + ")"; });

        voronoi
          .x(function(d) { return pathDotCentroid(d)[0]; })
          .y(function(d) { return pathDotCentroid(d)[1]; })
          .clipExtent([[0, 0], [width, height]]);

          svg.selectAll(".voronoi")
              .data(voronoi(countries.features.filter(function(d) {
                return !isHiddenCountry(d);
              })))
              .attr("d", function(d, i) { return "M" + d.join("L") + "Z"; });

          svg.select(".legend").attr("transform", "translate(" + (width - 75) + "," + 15 + ")");
          svg.selectAll(".consumption-label.specific")
            .attr("transform", function(d) {
               return "translate(" + (pathDotCentroid(d)[0])
                  + "," + (pathDotCentroid(d)[1] - (radius(d.properties.consumptionKbd) || 0)
                  - ('VEN' === d.id ? -10 : 'BLZ' !== d.id ? 8 : 12)) + ")";
             })
           svg.selectAll(".quota-label.specific")
             .attr("transform", function(d) {
                return "translate(" + (pathDotCentroid(d)[0])
                   + "," + (pathDotCentroid(d)[1] + ((radius(d.properties.quotaKbd))||0)
                   + (d.id !== 'GUY' ? 8 : 12)) + ")";
              })
    }

    d3.csv('national_elections.csv')
});

function mouseover(d,i) {
  d3.selectAll("."+(d.id === 'CYN' ? 'CYP' : d.id)).classed("highlighted",true);
  d3.selectAll(".legend text").classed("highlighted",true);
}

function mouseout(d,i) {
  d3.selectAll("."+(d.id === 'CYN' ? 'CYP' : d.id)).classed("highlighted",false);
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
  var properties = d.properties;

  $('#myModal').modal('show');
  $('#myModalLabel').text(properties.name);

  console.log(properties);
  d3.select("#country-population td").text(d3.format(',d')(properties.population));
  d3.select("#country-gdp td").text(d3.format('$,d')(properties.gdpMillionUsd * 1000000));
  d3.select("#country-corruption td").text(properties.corruptionIndex);
  d3.select("#country-system td").text(properties.systemOfGovernment);


  console.log("Clicked " + d.id)
}
