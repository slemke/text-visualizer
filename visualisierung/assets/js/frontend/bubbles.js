/**
 * Created by Dennis Dubbert on 17.09.17.
 */
let BubbleContainer = document.getElementById('nav-tabContent');
let bubbleSvg = d3.select('#nav-list').append('svg').attr('preserveAspectRatio', 'xMidYMid');

let bubbleGroup;

const drawBubbleChart = function(data, key) {
    bubbleSvg.selectAll('.content').remove();
    let buWidth = BubbleContainer.clientWidth;
    let buHeight = BubbleContainer.clientHeight;

    bubbleSvg.attr('viewBox', '0 0 ' + buWidth + ' ' + buHeight);
    let totalValue = d3.sum(data, function(d) {return d[key]});

    let sizeScale = d3.scaleSqrt()
        .domain([d3.min(data, function(d) {return d[key]}), d3.max(data, function(d) {return d[key]})])
        .range([5, 20]);

    bubbleSvg.append('rect')
        .attr('class', 'content')
        .attr('id', 'bgRect')
        .attr('width', buWidth)
        .attr('height', buHeight)
        .style('fill', '#ddd');

    let simulation = d3.forceSimulation()
        .force('x', d3.forceX(0).strength(0.05))
        .force('y', d3.forceY(0).strength(0.05))
        .force('collide', d3.forceCollide(function(d) {return sizeScale(d[key])}))
        .nodes(data)
        .on('tick', update);

    bubbleGroup = bubbleSvg.append('g')
        .attr('class', 'content')
        .attr('transform', 'translate('+ buWidth / 2 + ', ' + buHeight / 2 + ')');

    let circles = bubbleGroup.selectAll('.node')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', function(d) {return sizeScale(d[key])})
        .attr('fill', '#000');

    function update() {
        circles.attr('cx', function(d) {return d.x})
            .attr('cy', function(d) {return d.y});
    }
};

