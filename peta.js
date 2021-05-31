
var margin ={top:50, right:50, left:50, bottom:50};
var height =750 - margin.top - margin.bottom;
var width =1800 - margin.left -margin.right;
var tinggi= 750,
    lebar = 800
// The svg
var svg = d3.select("#map")
  .append("svg")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(d3.zoom).on("zoom", function () {
    svg.attr("transform", d3.event.transform)
  })
  .append("g");


var tooltip = d3.select('body').append('div')
              .attr('class', 'hidden tooltip');
var fill = d3.scaleThreshold()
  .domain([1000, 10000, 15000, 20000, 25000, 30000])
  .range(colorbrewer.Blues[7]);




function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / lebar, dy / tinggi),
      translate = [lebar / 2 - scale * x, tinggi / 2 - scale * y];

  svg.transition()
      .duration(750)
      .call(zoom.translate(translate).scale(scale).event);
}

// Load external data and boot
d3.queue()
  .defer(d3.json, "kab_kota/perkelur.json")
  // .defer(d3.csv, "data.csv", function(d) { data.set(d.kec_kendal, +d.jumlah); })
  .await(ready);
// Map and projection
var projection = d3.geoMercator()
  .center([110.43674,-7.80284])
  .scale(50000)
  .translate([lebar / 2, tinggi / 2]);

var path = d3.geoPath()
      .projection(projection);

function ready(error, topo) {

  console.log(topo)
  var kelurahan =topojson.feature(topo,topo.objects.collection).features;
  console.log(kelurahan);
  svg.selectAll(".country")
      .data(kelurahan)
      .enter().append("path")
      .attr("class","country")
      .attr('id',function(d){return d.properties.OBJECT_ID})
      .attr("d",path)
      .style("fill", function (d) { return fill(d.properties.JUMLAH_PEN) })
      .on("mousemove",function(d){
      // console.log(d)      
        var mouse = d3.mouse(svg.node()).map(function(d){
              return parseInt(d)
          })
          // console.log(mouse)
          tooltip.classed('hidden', false)
                .attr('style', 'left:' + (mouse[0] + 15) +
                          'px; top:' + (mouse[1] - 35) + 'px')
            .html(["<table>" +
              "<tr><th>Kabupaten</th><th>Kecamtana</th><th>Kelurahan</th><th>Penduduk</th></tr>" +
              "<tr><td>"+d.properties.KAB_KOTA+"</td><td>"+d.properties.KECAMATAN+"</td><td>"+d.properties.DESA_KELUR+"</td><td>"+d.properties.JUMLAH_PEN+" JIWA"+"<td></tr>"+"</table>"]);
          // "kabupaten: "+d.properties.KAB_KOTA,"kecamatan: "+d.properties.KECAMATAN,"kelurahan: "+d.properties.DESA_KELUR,"penduduk: "+d.properties.JUMLAH_PEN
      })
      .on("mouseout",function(d){
        // console.log(d)
        // d3.select(this).classed('selected',false)
        tooltip.classed('hidden', true);
       })
      // .on('mouseover',function(d){
      //     console.log(d)
      //     d3.select(this).classed('selected',true)
      // })
      // .on("mouseout",function(d){
      //     d3.select(this).classed('selected',false)
      // })
    }
