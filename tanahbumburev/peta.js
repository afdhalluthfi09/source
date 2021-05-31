let margin ={top:50, right:50, left:50, bottom:50};
let height =1040 - margin.top - margin.bottom;
let width = 1040 - margin.left - margin.right;
let svg = d3.select("#map")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(d3.zoom().on("zoom", function () { svg.attr("transform", d3.event.transform) }))
    .append("g");
    

    // kecamatan
let projection = d3.geoMercator()
    .center([115.5880,-3.3756])
    .scale(35000)
    .translate([width / 2, height / 2]);
    // sungai utama
let projectionSungai = d3.geoMercator()
    .center([115.5472,-3.3745])
    .scale(28000)
    .translate([width / 2, height / 2]);
    // sungai cabang
let projectionCabang = d3.geoMercator()
    .center([115.6524,-3.4057])
    .scale(28000)
    .translate([width / 2, height / 2]);

    // path sungai
let pathSungai = d3.geoPath()
    .projection(projectionSungai);
    // path kecamatan
let path = d3.geoPath()
    .projection(projection);
    // path cabang
let pathCabang = d3.geoPath()
    .projection(projection);

let tooltip = d3.select('body').append('div')
    .attr('class', 'hidden tooltip');

d3.queue()
    .defer(d3.json, 'topojson/kec_kusan.topojson')
    .defer(d3.json, 'topojson/sungai_cabang.topojson')
    .defer(d3.json, 'topojson/sungai_utama.topojson')
    .await(ready);

function ready(err, kec,sungai_cb, sungai_ut)
{
    // console.log(kec);
    //console.log(sungai_cb);
    //console.log(sungai_ut);
    let kusan = topojson.feature(kec, kec.objects.collection).features;
    let sungai = topojson.feature(sungai_ut, sungai_ut.objects.collection).features;
    let cabang = topojson.feature(sungai_cb, sungai_cb.objects.collection).features;
    // console.log(sungai);
    svg.selectAll('.country')
        .data(kusan)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path)
        .on("mousemove",function(d){
                   var mouse = d3.mouse(svg.node()).map(function(d){
                       return parseInt(d)
                   })
                   tooltip.classed('hidden', false)
                          .attr('style', 'left:' + (mouse[0] + 15) +
                                    'px; top:' + (mouse[1] - 35) + 'px')
                                .html("KEC: "+d.properties.NAMOBJ);
               });
        
    svg.selectAll('.line_sungai')
        .data(sungai)
        .enter()
        .append('path')
        .attr('class', 'line_sungai')
        .attr('d', path)
        .on("mousemove", function (d) {
            var mouse = d3.mouse(svg.node()).map(function(d){
                return parseInt(d)
            })
            tooltip.classed('hidden', false)
            .attr('style', 'left:' + (mouse[0] + 15) +
            'px; top:' + (mouse[1] - 35) + 'px')
                .html("<table><tr><th>Nama Sungai : </th><td>"+ d.properties.NAMOBJ +"</td></tr><tr><th>Panjang Sungai</th><td>"+ d.properties.SHAPE_Leng +"</td></tr><tr><th>Luas Area :</th><td>"+ d.properties.SHAPE_Area +"</td></tr></table>");
        });
    
    svg.selectAll('.line_cabang')
        .data(cabang)
        .enter()
        .append('path')
        .attr('class', 'line_cabang')
        .attr('d', path)
        .attr('stroke', function (d) {
            let id = d.properties.REMARK;
            if (id === 'Alur Sungai') {
                return 'blue';
            } else if(id === 'Sungai Satu Garis') {
                return 'purple'
            }
        })
        .on("mousemove", function (d) {
            let mouse = d3.mouse(svg.node()).map(function (d) {
                return parseInt(d);
            })
            tooltip.classed('hidden', false)
            .attr('style', 'left:' + (mouse[0] + 15) +
            'px; top:' + (mouse[1] - 35) + 'px')
                .html("<table><tr><th>Nama Sungai :</th><td>"+ d.properties.NAMOBJ +"</td><tr><th>Label :</th><td>"+ d.properties.REMARK +"</td><tr><th>Panjang Sungai : </th><td>"+ d.properties.SHAPE_Leng +"</td></tr></table>");
        });
    
    
    
}

              
