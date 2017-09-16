/**
 * Created by Dennis Dubbert on 11.09.17.
 */
let chapter = {
    "id": 0,
    "name": "TOPICS",
    "size": 0,
    "children": [{
        "id": 1,
        "name": "Topic A",
        "size": 0,
        "children": [{
            "id": 2,
            "name": "Sub A1",
            "size": 4,
            "children": [{
                "id": 3,
                "name": "Sub A1.1",
                "size": 2
            }, {
                "id": 4,
                "name": "Sub A1.2",
                "size": 5,
                "children": [{
                    "id": 25,
                    "name": "Sub A1.2.1",
                    "size": 0.5
                }, {
                    "id": 26,
                    "name": "Sub A1.2.2",
                    "size": 0.9
                }]
            }, {
                "id": 5,
                "name": "Sub A1.3",
                "size": 0.1
            }, {
                "id": 16,
                "name": "Sub A1.4",
                "size": 1.2
            }, {
                "id": 17,
                "name": "Sub A1.5",
                "size": 3.4
            }]
        }, {
            "id": 6,
            "name": "Sub A2",
            "size": 4
        }, {
            "id": 18,
            "name": "Sub A1.2",
            "size": 5,
            "children": [{
                "id": 19,
                "name": "Sub A1.2.1",
                "size": 0.4
            }, {
                "id": 20,
                "name": "Sub A1.2.2",
                "size": 2.9
            }]
        }, {
            "id": 21,
            "name": "Sub A1.3",
            "size": 0.1
        }]
    }, {
        "id": 7,
        "name": "Topic B",
        "size": 0,
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
            "size": 3,
            "children": [{
                "id": 14,
                "name": "Sub A1.1.1",
                "size": 1
            }, {
                "id": 15,
                "name": "Sub A1.1.2",
                "size": 1.5
            }]
        }]
    }, {
        "id": 11,
        "name": "Topic C",
        "size": 0,
        "children": [{
            "id": 12,
            "name": "Sub A1",
            "size": 4
        }, {
            "id": 13,
            "name": "Sub A2",
            "size": 4,
            "children": [{
                "id": 23,
                "name": "Sub A2.1",
                "size": 0.5
            }, {
                "id": 24,
                "name": "Sub A2.2",
                "size": 0.9,
                "children": [{
                    "id": 27,
                    "name": "Sub A2.2.1",
                    "size": 0.5
                }, {
                    "id": 28,
                    "name": "Sub A2.2.2",
                    "size": 0.9
                }]
            }]
        }]
    }, {
        "id": 22,
        "name": "Topic D",
        "size": 2.6
    }]
};

let SBContainer = document.getElementById('SBContainer'),
    LContainer = document.getElementById('LContainer'),
    BCContainer = document.getElementById('BCContainer');
let bgRect;
let sbSvg = d3.select('#SBContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');
let bcSvg = d3.select('#BCContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');
let lSvg = d3.select('#LContainer').append('svg').attr('id', 'legendSvg').attr('preserveAspectRatio', 'xMidYMid');

let chartSize, bcWidth, bcHeight;

let wholeSize,
    blockedMouseover = false,
    g,
    bcG,
    partition,
    root,
    arc,
    colorThresh,
    p,
    a,
    bcText,
    bcGroupWidth,
    bcGroupHeight,
    bcInnerPadding,
    bcOuterPadding,
    maxBC;

let chapterColors = ['#552e05', '#7f4e1c', '#a9753f', '#d3a26e', '#fed7ac'];
let colors = ['#9dd863', '#dddd77', '#F4A460', '#FA8072', '#A52A2A'];
let scales = {'size' : ['(Almost) No Problems', 'Problems Can Be Neglected', 'Problems Could Be Resolved', 'Problems Should be Resolved', 'Problems Must Be Resolved']};
let activeTopic = 'size';

const drawSunburst = function(chapter) {
    removeAll();
    initializeAndDrawSunburst(chapter);
    redrawLegend();
    initializeBreadCrumbs();
};

/** All functions for the sunburst */

const initializeAndDrawSunburst = function(chapter) {
    /*** Draw sunburst and its components (texts, circles etc.) */
    let sbWidth = SBContainer.clientWidth;
    let sbHeight = SBContainer.clientHeight;
    chartSize = d3.min([sbWidth,sbHeight]);
    let radius = chartSize / 2;

    sbSvg.attr('viewBox', '0 0 ' + sbWidth + ' ' + sbHeight);

    partition = d3.partition()
        .size([2 * Math.PI, radius]);

    root = d3.hierarchy(chapter)
        .sum(function (d) { return d.size});

    partition(root);

    arc = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });

    let innerRadius = root.descendants()[1].y0;

    wholeSize = root.descendants().reduce(function(old, val) {
        return old + val.data.size
    }, 0);

    bgRect = sbSvg.append('rect')
        .attr('class', 'content')
        .attr('id', 'bgRect')
        .attr('width', sbWidth)
        .attr('height', sbHeight)
        .style('fill', '#fff')
        .on('click', function() {
            highlightChapter(root.descendants());
            updateInformationTexts(root.data.name, getPercentage(root.descendants()));
            redrawBreadCrumbs([root], root);
            blockedMouseover = false;
        });

    g = sbSvg.append('g')
        .attr('transform', 'translate(' + sbWidth / 2 + ',' + sbHeight / 2 + ')')
        .attr('class', 'sunburstGroup content')
        .selectAll('g')
        .data(root.descendants());

    g.enter()
        .append('g')
        .attr('class', 'node')
        .append('path')
        .attr('class', 'selected sunburstPart')
        .attr('id', function (d) { return 'chapter' + d.data.id })
        .attr('display', function (d) { return d.depth ? null : "none"; })
        .attr('d', arc)
        .style('stroke', '#000')
        .on('mouseover', function(d) {
            if(!blockedMouseover) {
                updateInformationTexts(d.data.name, getPercentage([d]));
            }
        })
        .on('click', function(d) {
            let event = d3.event;
            switch(event.detail) {
                case 1:
                    redrawBreadCrumbs([d], d);
                    highlightChapter([d]);
                    updateInformationTexts(d.data.name, getPercentage([d]));
                    blockedMouseover = true;
                    break;
                case 2:
                    redrawBreadCrumbs(d.descendants(), d);
                    highlightChapter(d.descendants());
                    updateInformationTexts(d.data.name + '...', getPercentage(d.descendants()));
                    blockedMouseover = true;
                    break;
                case 3:
                    let nodes = getAllWithSameColor(colorThresh(d.data[activeTopic]));
                    redrawBreadCrumbs(nodes, d);
                    highlightChapter(nodes);
                    updateInformationTexts(d.data.name + '...', getPercentage(nodes));
                    blockedMouseover = true;
                    break;
                default:
                    break
            }
        });

    changeColorForPercentage();

    p = sbSvg.append('text')
        .text(root.data.name)
        .attr('class', 'content')
        .attr('text-anchor', 'middle')
        .attr('font-size', innerRadius / 5 + 'px')
        .attr('font-weight', 'bold')
        .attr('dy', '.35em')
        .attr('transform', 'translate(' + sbWidth / 2 + ',' + (sbHeight / 2 - innerRadius / 4) + ')');

    a = sbSvg.append('text')
        .text(d3.format('.2%')(1))
        .attr('class', 'content')
        .attr('text-anchor', 'middle')
        .attr('font-size', innerRadius / 5 + 'px')
        .attr('dy', '.35em')
        .attr('transform', 'translate(' + sbWidth / 2 + ',' + (sbHeight / 2 + innerRadius / 4) + ')');

    appendCircles(chartSize);
};

const getAllWithSameColor = function(color) {
    return d3.selectAll('.node').data().filter(function(d) {
        return colorThresh(d.data[activeTopic]) === color})
};

const getPercentage = function(d) {
    let size = d.reduce(function(old, val) {
        return old + val.data.size;
    }, 0);

    return d3.format('.2%')(size / wholeSize)
};

const appendCircles = function(chartSize) {
    d3.selectAll('.node')
        .each(function(d) {
            if (d.data.size) {
                d3.select(this)
                    .append('circle')
                    .attr('class', 'selected sunburstPart')
                    .attr('id', 'circle' + d.data.id)
                    .attr('transform', 'translate(' + arc.centroid(d) + ')')
                    .attr('r', chartSize / 400)
                    .on('click', function(d) {
                        let event = d3.event;
                        switch(event.detail) {
                            case 1:
                                redrawBreadCrumbs([d], d);
                                highlightChapter([d]);
                                updateInformationTexts(d.data.name, getPercentage([d]));
                                blockedMouseover = true;
                                break;
                            case 2:
                                redrawBreadCrumbs(d.descendants(), d);
                                highlightChapter(d.descendants());
                                updateInformationTexts(d.data.name + '...', getPercentage(d.descendants()));
                                blockedMouseover = true;
                                break;
                            case 3:
                                let nodes = getAllWithSameColor(colorThresh(d.data[activeTopic]));
                                redrawBreadCrumbs(nodes, d);
                                highlightChapter(nodes);
                                updateInformationTexts(d.data.name + '...', getPercentage(nodes));
                                blockedMouseover = true;
                                break;
                            default:
                                break
                        }
                    });
            }
        });
};

const removeAll = function() {
    d3.selectAll('.content').remove();
};

const highlightChapter = function(chapters) {
    d3.selectAll('.sunburstPart').filter('.selected').classed('selected', false).transition().style('opacity', 0.4);
    chapters.forEach(function(e) {
        d3.select('#chapter' + e.data.id).classed('selected', true).transition().style('opacity', 1);
        d3.select('#circle' + e.data.id).classed('selected', true).transition().style('opacity', 1);
    });
};

const updateInformationTexts = function(name, amount) {
    p.text(name);
    a.text(amount);
};

const changeColorForPercentage = function() {
    let max = d3.max(root.descendants(), function(d) {return d.data[activeTopic]});
    let min = d3.min(root.descendants(), function(d) {return d.data[activeTopic]});
    let distance = (max - min) / 5;
    let domain = d3.range(4).reduce(function(old){
        return old.concat(old[old.length - 1] + distance);
    }, [distance]);

    colorThresh = d3.scaleThreshold()
        .domain(domain)
        .range(colors);

    d3.selectAll('.node path')
        .attr('fill', function(d) {
            return colorThresh(d.data[activeTopic]);
        });
};

/** legend function */

const redrawLegend = function() {
    lSvg.selectAll('content').remove();

    let lWidth = LContainer.clientWidth;
    let lHeight = LContainer.clientHeight;

    let size = d3.min([lWidth / 2, lHeight / 25 ]);
    let spacing = size / 5;

    lSvg.attr('viewBox', '0 0 ' + lWidth + ' ' + lHeight);

    lSvg.append('rect')
        .attr('class', 'content')
        .attr('width', lWidth)
        .attr('height', lHeight)
        .style('fill', 'rgb(220,220,220)')
        .style('stroke', '#000')
        .style('stroke-width', 2);

    let rootG = lSvg.append('g')
        .attr('class', 'content');

    rootG.append('text')
        .text('Legend')
        .attr('x', lWidth / 2)
        .attr('y', 0)
        .attr('dy', '.8em')
        .attr('font-size', lWidth / 4)
        .attr('text-anchor', 'middle')
        .style('fill', '#000')
        .style('font-weight', 'bold')
        .classed('legendText', true);

    let subG = rootG.append('g')
        .attr('transform', 'translate(0,' + (lWidth - size) / 2 + ')');

    let subG1 = subG.append('g')
        .attr('id', 'legendSubG1');

    colors.forEach(function(d, i) {
        let gheight = subG1.node().getBBox().height + spacing;
        subG1.append('g')
            .attr('class', 'legendSubGroup')
            .attr('id', 'legendSubGroup' + i)
            .append('rect')
            .attr('width', size)
            .attr('height', size)
            .attr('x', lWidth / 2 - size / 2)
            .attr('y', gheight)
            .style('fill', colors[i])
            .style('stroke', '#000')
            .each(function() {
                let lGProzent = lSvg.select('#legendSubGroup' + i)
                    .append('text')
                    .text((i * 2) + '% - ' + (i * 2 + 2) + '%')
                    .attr('x', lWidth / 2)
                    .attr('dy', '.35em')
                    .attr('font-size', size / 3)
                    .attr('text-anchor', 'middle')
                    .attr('id', 'legendPercent' + i)
                    .style('font-weight', 'bold')
                    .style('fill', '#000');

                let lGText = lSvg.select('#legendSubGroup' + i )
                    .append('text')
                    .text(scales[activeTopic][i])
                    .attr('x', lWidth / 2)
                    .attr('y', gheight + size)
                    .attr('dy', '1em')
                    .attr('font-size', size / 3)
                    .attr('text-anchor', 'middle')
                    .attr('id', 'legendText' + i)
                    .style('fill', '#000')
                    .style('font-weight', 'bold');

                lGProzent.call(wrap, size)
                    .attr('y', gheight + spacing + (size / 2 - lGProzent.node().getBBox().height / 2));

                lGText.call(wrap, lWidth);

                lSvg.select('#legendSubGroup' + i).append('rect')
                    .attr('y', gheight + size + lGText.node().getBBox().height)
                    .attr('width', lWidth)
                    .attr('height', spacing)
                    .style('fill', 'transparent');
            });
    });

    let path = {x0: -Math.PI / 4, x1: Math.PI / 4, y0: size / 5, y1: size};


    let subG2 = subG.append('g')
        .attr('transform', 'translate(' + (lWidth / 2 ) + ', ' + (size / 2 + rootG.node().getBBox().height) + ')')
        .attr('id', 'legendSubG2');

    let subG2G1 = subG2.append('g');

    subG2G1.append('path')
        .attr('d', arc(path))
        .style('fill', '#fff')
        .style('stroke', '#000')
        .style('stroke-width', 2);

    let subG2G1Text = subG2G1.append('text')
        .text('Size = Wordcount + Wordcount Of Sub - Chapter')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '1em')
        .attr('font-size', size / 3)
        .attr('text-anchor', 'middle')
        .style('fill', '#000')
        .style('font-weight', 'bold');

    subG2G1Text.call(wrap, lWidth);

    let subG2G2 = subG2.append('g')
        .attr('transform', 'translate(0, ' + (subG2G1.node().getBBox().height - spacing) + ')');

    subG2G2.append('path')
        .attr('d', arc(path))
        .style('fill', '#fff')
        .style('stroke', '#000')
        .style('stroke-width', 2);

    subG2G2.append('circle')
        .attr('transform', 'translate(' + arc.centroid(path) + ')')
        .attr('r', chartSize / 400);

    let subG2G2Text = subG2G2.append('text')
        .text('Chapter Itself Contains Text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '1em')
        .attr('font-size', size / 3)
        .attr('text-anchor', 'middle')
        .style('fill', '#000')
        .style('font-weight', 'bold');

    subG2G2Text.call(wrap, lWidth);

    let subG2G3 = subG2.append('g')
        .attr('transform', 'translate(0, ' + (subG2G1.node().getBBox().height + subG2G2.node().getBBox().height - spacing * 2) + ')');

    subG2G3.append('path')
        .attr('id', 'mouseClick')
        .attr('d', arc(path))
        .style("fill", "#fff")
        .style('stroke', '#000')
        .style('stroke-width', 2);

    // <a href="https://icons8.com">Icon pack by Icons8</a>
    subG2G3.append('image')
        .attr('xlink:href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADgElEQVRoQ+2agZENQRRF70aACBABIkAEiAARIAJEgAjYCBABIkAEiAARUKeqr+rq7Z7p7umZPz5dtbVb++f/eafvu++9nt0THck6ORIO/ZMgDyVdksT33a0WRd6H6G/sjkIqptZ3Sa8kPYqCfiPpvKQY5J6kZ5KuSfp6SMCSIkDcDSDPQ4BA8OWAAXon6bOkq4eE4N5TqQUA6YQSuUXwTyShyo89gxw6tqb715qd3X8cdv6FpE9Nd9ng4hSENLkY7vs0MTqeOBd+Bwip93YPaZXzCJ64LulbMLBz3+anOt0OvgCY1/HQwVVqSa2PSRUDiC+qG+ugKtWCEChl95eky0nKU5JJSTq+0xIFT0PV28Ah0+UXTxC8+waB0vxuTgTIe4CySrwXLwG1aokuKUIwLyVheHoFi52n4xMUr3uRXg/CJGDzb65SCYQUomOzw/FO2vQXot9TmjG8zX8/aaKbqFQCITjSIk0HjyXMYB5dYmVQCgUxPj+zIZuo1GJ2B1wyfWpqVLpVKNFWibSkNy32Ug9IjelTlQDKlWi8BAyfeSVcQ/qyCShZvXpASqafuikHMgdcaqSkM0CxSi7js0eEHhACzpm+dvfmzJ9TCYW4Z1GlXpAp09cCpSWawkI1jFeqEqNQ9qjdCzLV6WtB4uvYGIJOK6Gv4bXXAZQNOLOWgNj0DJJrjfUETbPlXvxMjyLFhoL0mL5FLUzPSESh+BD6UtH0SxSx6SmtDJKjZikCZzwi3ThOoEbpuP1nY5aC2PRFyRskQGFOoQT+M/jFc97sxywFsekZJvFK7yKNUAEYSiwws70jvtkIEHaNnew1Pan0JaQR85kfBDZtyggQB5KO97WB+FkZMJx1urw2AoSAMSNn/V7T+/xDGe+CGQVCjtOwak2PivaXlVsEMwqkxfSG5j0peDfMSJAa0+MHvEB5xQuM7kNgRoLUmJ5ZipEDH+AHKtQQmJEgc6Y3KH2C9GKh0BCY0SBTpudPEPQaPw+wyYfAjAYpmd6A8eOluM8shlkDxKanpzBmECSPW7mXy26uWS6CWQPEXvBpzmB3KqbYbpg1QGLT4wnKLeeJ2j+iTsH4MHem8a4FYk+QWijkNGuZv3LVbHMQH7r8CCh7PJ2hipXxAwf6UO5R7u7/8yGGgTsLwQtrpVZtCtVeh7JAMWVnx/y/BWQW+D/I7BZtfMHRKPIbzUAQQpxDgKEAAAAASUVORK5CYII=')
        .attr('width', size / 2)
        .attr('height', size / 2)
        .attr('transform', function() {return 'translate(' + (-size / 4) + ', ' + (-size + size/8) + ')'});

    let singleText = subG2G3.append('text')
        .text('Click: Select Chapter')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '1em')
        .attr('font-size', size / 3)
        .attr('text-anchor', 'middle')
        .style('fill', '#000')
        .style('font-weight', 'bold')
        .classed('legendText', true);

    singleText.call(wrap, lWidth);

    let doubleText = subG2G3.append('text')
        .text('Double - Click: Also Select Sub - Chapters')
        .attr('x', 0)
        .attr('y', singleText.node().getBBox().height + spacing + singleText.node().getBBox().y)
        .attr('dy', '1em')
        .attr('font-size', size / 3)
        .attr('text-anchor', 'middle')
        .style('fill', '#000')
        .style('font-weight', 'bold')
        .classed('legendText', true);

    doubleText.call(wrap, lWidth);

    let tripleText = subG2G3.append('text')
        .text('Triple - Click: Select All Chapters With The Same Color')
        .attr('x', 0)
        .attr('y', doubleText.node().getBBox().height + spacing + doubleText.node().getBBox().y)
        .attr('dy', '1em')
        .attr('font-size', size / 3)
        .attr('text-anchor', 'middle')
        .style('fill', '#000')
        .style('font-weight', 'bold')
        .classed('legendText', true);

    tripleText.call(wrap, lWidth);

    lSvg.select('rect').attr('height', rootG.node().getBBox().height).attr('transform', 'translate(0, ' + ((lHeight / 2) - (rootG.node().getBBox().height / 2)) + ')');
    rootG.attr('transform', 'translate(0, ' + ((lHeight / 2) - (rootG.node().getBBox().height / 2)) + ')');
};

/** All functions for the breadcrumbs */
const initializeBreadCrumbs = function() {
    /** Draw / Initialize all elements for the breadcrumbs */
    bcSvg.selectAll('content').remove();

    let width = BCContainer.clientWidth;
    let height = BCContainer.clientHeight;

    bcSvg.attr('viewBox', '0 0 ' + width + ' ' + height);
    bcText = bcSvg.append('rect')
        .attr('class', 'content')
        .attr('width', width)
        .attr('height', height)
        .style('fill', '#fff')
        .style('stroke', '#000')
        .style('stroke-width', 2);

    bcInnerPadding = height / 8;
    bcOuterPadding = height / 10;
    bcGroupWidth = width - 2 * bcOuterPadding;
    bcGroupHeight = height - 2 * bcOuterPadding;

    bcG = bcSvg.append('g')
        .attr('id', 'bcGroup')
        .attr('class', 'content')
        .attr('transform', 'translate(' + bcOuterPadding + ',' + bcOuterPadding + ')');

    redrawBreadCrumbs([root], root);
};

const getBreadCrumbPath = function(d, i, lastIndex) {

    let path = [];

    path.push({x: 0, y: bcHeight});

    /*if (i > 0) {
     path.push({x: bcWidth * 0.25, y: bcHeight / 2});
     }*/

    path.push({x: 0, y: 0});

    //if (i !== lastIndex) {
    path.push({x: bcWidth, y: 0});
    // path.push({x: bcWidth * 1.25, y: bcHeight / 2});
    path.push({x: bcWidth, y: bcHeight});
    /*} else {
     path.push({x: bcWidth * 1.25, y: 0});
     path.push({x: bcWidth * 1.25, y: bcHeight});
     }*/

    path.push({x: 0, y: bcHeight});

    const pathCreator = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    return pathCreator(path);
};

const redrawBreadCrumbs = function(chapters, selected) {
    bcG.selectAll('.breadCrumb').remove();
    bcSvg.selectAll('.bcClip').remove();

    maxBC = chapters.length;
    bcHeight = bcGroupHeight;
    bcWidth = (bcGroupWidth - ((maxBC - 1) * bcInnerPadding)) / (maxBC);

    bcG.selectAll('.breadCrumb')
        .data(chapters)
        .enter()
        .append('g')
        .attr('class', 'breadCrumb')
        .each(function(d, i) {
            d3.select(this)
                .append('path')
                .attr('d', getBreadCrumbPath(d, i, chapters.length - 1))
                .attr('fill', colorThresh(d.data[activeTopic]) )
                .style('stroke', '#000')
                .style('stroke-width', 1);

            d3.select(this)
                .append('clipPath')
                .attr('id', 'bcClip' + i)
                .attr('class', 'bcClip')
                .append('path')
                .attr('d', getBreadCrumbPath(d, i, chapters.length - 1));

            d3.select(this)
                .append('text')
                .attr('x', bcWidth * 0.01)
                .attr('y', bcHeight / 2)
                .attr('dy', '.35em')
                .attr('text-anchor', 'left')
                .attr('clip-path', 'url(#bcClip' + i + ')')
                .style('fill', function() {
                    return (d === selected) ? '#000' : '#fff';
                })
                .style('font-size', (bcHeight / 1.5 < bcWidth / 5) ? bcHeight / 1.5 : bcWidth / 5)
                .style('font-weight', 'bold')
                .text(function(d) { return d.data.name });
        })
        .attr('transform', function(d, i) {
            return 'translate(' + (i * (bcWidth + bcInnerPadding)) + ', 0)'
        })
        .on('click', function(d) {
            let event = d3.event;
            switch(event.detail) {
                case 1:
                    redrawBreadCrumbs(chapters, d);
                    blockedMouseover = true;
                    break;
                default:
                    break
            }
        });
};

/** taken from: https://bl.ocks.org/mbostock/7555321 */
const wrap = function(text, width) {
    text.each(function() {
        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
};