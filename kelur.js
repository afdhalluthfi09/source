
var margin ={top:50, right:50, left:50, bottom:50};
var height =400 - margin.top - margin.bottom;
var width =800 - margin.left -margin.right;
var tinggi= 450,
    lebar = 550
// The svg
var svg = d3.select("#map")
              .append("svg")
              .attr("height",height +margin.top + margin.bottom)
              .attr("width", width + margin.left + margin.right)
              .append("g")
              .attr("transform","translate("+ margin.left +","+ margin.top +")");



// Load external data and boot
d3.queue()
  .defer(d3.json, "perkelur.json")
  // .defer(d3.csv, "data.csv", function(d) { data.set(d.kec_kendal, +d.jumlah); })
  .await(ready);
// Map and projection
var projection = d3.geoMercator()
  .scale(100)
  .translate([lebar / 2, tinggi / 2]);

  var path = d3.geoPath()
      .projection(projection);

function ready(error, topo) {

  console.log(topo)
  // var kecamatan =topojson.feature(topo,topo.objects.collection).features;
  // console.log(kecamatan);
  // svg.selectAll(".country")
  //     .data(kecamatan)
  //     .enter().append("path")
  //     .attr("class","country")
  //   //   .attr('id',function(d){return d.properties.kode_kec})
  //     .attr("d",path)
  //     .on('mouseover',function(d){
  //         console.log(d)
  //         d3.select(this).classed('selected',true)
  //     })
  //     .on("mouseout",function(d){
  //         d3.select(this).classed('selected',false)
  //     })
    }
