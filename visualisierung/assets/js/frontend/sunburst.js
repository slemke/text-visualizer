/**
 * Created by Dennis Dubbert on 11.09.17.
 */

var chapter = {
    "id": 0,
    "name": "TOPICS",
    "children": [{
        "id": 1,
        "name": "Topic A",
        "children": [{
            "id": 2,
            "name": "Sub A1",
            "size": 4,
            "children": [{
                "id": 3,
                "name": "Sub A1.1",
                "size": 2,
                "children": [{
                    "id": 14,
                    "name": "Sub A1.1.1",
                    "size": 1
                }]
            }, {
                "id": 4,
                "name": "Sub A1.2",
                "size": 5
            }, {
                "id": 5,
                "name": "Sub A1.3",
                "size": 0.1
            }]
        }, {
            "id": 6,
            "name": "Sub A2",
            "size": 4
        }]
    }, {
        "id": 7,
        "name": "Topic B",
        "children": [{
            "id": 8,
            "name": "Sub B1",
            "size": 3
        }, {
            "id": 9,
            "name": "Sub B2",
            "size": 3
        }, {
            "id": 10,
            "name": "Sub B3",
            "size": 3
        }]
    }, {
        "id": 11,
        "name": "Topic C",
        "children": [{
            "id": 12,
            "name": "Sub A1",
            "size": 4
        }, {
            "id": 13,
            "name": "Sub A2",
            "size": 4
        }]
    }]
};

var width, height;

var radius, color, svg, g, partition, root, arc, p, a, innerRadius;

var setup = function(w, h, chapter) {
    width = w;
    height = h;

    radius = Math.min(width, height) / 2;

    svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

    g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    partition = d3.partition()
        .size([2 * Math.PI, radius]);

    root = d3.hierarchy(chapter)
        .sum(function (d) { return d.size});

    color = d3.scaleOrdinal(d3.schemeBrBG[d3.max(root.descendants(), function(d) {return d.depth})]);

    partition(root);

    arc = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });

};

var draw = function() {
    innerRadius = root.descendants()[1].y0;

    g.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + -width / 2 + ',' + -height / 2 + ')')
        .style('fill', '#fff')
        .on('click', function() {
            highlightChapter(root.descendants());
            updateInformationTexts(root.data.name, root.value);
            changeColorForPercentage("penis");
        });

    g.selectAll('g')
        .attr('class', 'sunburstGroup')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .append('path')
        .attr('class', 'selected')
        .attr('id', function (d) { return 'chapter' + d.data.id })
        .attr('display', function (d) { return d.depth ? null : "none"; })
        .attr('d', arc)
        .style('stroke', '#fff')
        .style('fill', function (d) { return color(d.depth) })
        .on('mouseover', function(d) { updateInformationTexts(d.data.name, d.data.size) })
        .on('click', function(d) {
            highlightChapter([d])
        }).on('dblclick', function(d) {
            highlightChapter(d.descendants());
        });

    p = svg.append('text')
        .text(root.data.name)
        .attr('text-anchor', 'middle')
        .attr('font-size', innerRadius / 4 + 'px')
        .attr('font-weight', 'bold')
        .attr('transform', 'translate(' + width / 2 + ',' + (height / 2 - innerRadius / 2) + ')');

    a = svg.append('text')
        .text(function() { return root.value })
        .attr('text-anchor', 'middle')
        .attr('font-size', innerRadius / 4 + 'px')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
};

var appendCircles = function() {
    g.selectAll('.node')
        .each(function(d) {
            if (d.data.size) {
                d3.select(this)
                    .append('circle')
                    .attr('transform', 'translate(' + arc.centroid(d) + ')')
                    .attr('r', d3.min([width, height]) / 350)
            }
        });
};

var removeAll = function() {
    svg.selectAll().remove();
};

var highlightChapter = function(chapters) {
    g.selectAll('.selected').classed('selected', false).transition().style('opacity', 0.5);
    chapters.forEach(function(e) {
        d3.select('#chapter' + e.data.id).classed('selected', true).transition().style('opacity', 1);
    });
};

var updateInformationTexts = function(name, amount) {
    p.text(name);
    a.text(amount);
};
