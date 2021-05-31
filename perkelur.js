let tinggi= 750,
    lebar = 1020


let svg = d3.select('#peta')
    .append('svg')
    .attr('width', lebar)
    .attr('hight', tinggi)
    .append('g')
    

d3.queue()
    .defer(d3.json, "perkelur.json")
    .await(ready)


function ready(err, data) {
    console.log(data)
}
