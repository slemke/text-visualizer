/**
 * Created by Dennis Dubbert on 11.09.17.
 */

let SBContainer = document.getElementById('SBContainer'),
    LContainer = document.getElementById('LContainer'),
    BCContainer = document.getElementById('BCContainer'),
    SBSliderContainer = document.getElementById('SBSliderContainer');

let sbSvg = d3.select('#SBContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');
let bcSvg = d3.select('#BCContainer').append('svg'); //.attr('preserveAspectRatio', 'xMidYMid');
let lSvg = d3.select('#LContainer').append('svg').attr('id', 'legendSvg').attr('preserveAspectRatio', 'xMidYMid');
let sbSliderSvg = d3.select('#SBSliderContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');

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
    sbSelection = [];


let chapterColors = [ '#47423f', '#0e6873', '#8c3c61', '#e98548', '#83c6dc', '#af6a40','#584337', '#a08562', '#8c9898', '#5f6d6e', '#87816c', '#b4aa92', '#7d7061', '#917359', '#7d6852', '#bba98b', '#a3906b'];
let colors = ['#9dd863', '#dddd77', '#F4A460', '#FA8072', '#A52A2A'];
let sliderScales = {size : [0, 10, 5, '%', d3.range(0,10.5,0.5).reverse()]};
let activeTopic = 'size';
let bubbleGroup;
let bubbleData;
let bubbleKey = 'amount';

const drawSunburst = function(chapter, buData) {
    removeAll();
    bubbleData = buData;
    initializeAndDrawSunburst(chapter);
    redrawLegend();
    redrawSlider();
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
        return (val.data.size) ? old + val.data.size : old;
    }, 0);

    sbSvg.append('rect')
        .attr('class', 'content')
        .attr('id', 'bgRect')
        .attr('width', sbWidth)
        .attr('height', sbHeight)
        .style('fill', '#fff')
        .style('cursor', 'pointer')
        .on('click', function() {
            highlightChapter(root.descendants());
            updateInformationTexts(root.data.name, getPercentage(root.descendants()));
            sbSelection = root.descendants();
            bcSelection = root.descendants();
            redrawBreadCrumbs(root.descendants(), root);
            blockedMouseover = false;
           // drawBubbles(bubbleData, bubbleKey);
        });

    g = sbSvg.append('g')
        .attr('transform', 'translate(' + sbWidth / 2 + ',' + sbHeight / 2 + ')')
        .attr('class', 'sunburstGroup content')
        .selectAll('g')
        .data(root.descendants());

    g.enter()
        .append('g')
        .attr('class', 'sunburstNode')
        .append('path')
        .attr('class', 'sunburstSelected sunburstPart')
        .attr('id', function (d) { return 'chapter' + d.data.id })
        .attr('display', function (d) { return d.depth ? null : 'none'; })
        .style('cursor', 'pointer')
        .attr('d', arc)
        .style('stroke', '#000')
        .on('mouseover', function(d) {
            if(!blockedMouseover) {
                updateInformationTexts(d.data.name, getPercentage(d.descendants()));
            }
        })
        .on('click', function(d) {
            sbSelection = d.descendants();
            bcSelection = d.descendants();
            redrawBreadCrumbs(d.descendants(), d);
            highlightChapter(d.descendants());
            updateInformationTexts(d.data.name, getPercentage(d.descendants()));
            blockedMouseover = true;
        });

    changeColorForPercentage();

    p = sbSvg.append('text')
        .text(root.data.name)
        .attr('class', 'content')
        .attr('text-anchor', 'middle')
        .attr('font-size', innerRadius / 5 + 'px')
        .attr('font-weight', 'bold')
        .attr('dy', '.35em')
        .attr('transform', 'translate(' + sbWidth / 2 + ',' + (sbHeight / 2 - innerRadius / 3) + ')')
        .attr('pointer-events', 'none');

     sbSvg.append('text')
        .text('Size:')
        .attr('class', 'content')
        .attr('text-anchor', 'middle')
        .attr('font-size', innerRadius / 5 + 'px')
        .attr('dy', '.35em')
        .attr('transform', 'translate(' + sbWidth / 2 + ',' + (sbHeight / 2) + ')')
         .attr('pointer-events', 'none');

    a = sbSvg.append('text')
        .text(d3.format('.2%')(1))
        .attr('class', 'content')
        .attr('text-anchor', 'middle')
        .attr('font-size', innerRadius / 5 + 'px')
        .attr('dy', '.35em')
        .attr('transform', 'translate(' + sbWidth / 2 + ',' + (sbHeight / 2 + innerRadius / 3) + ')')
        .attr('pointer-events', 'none');

    appendCircles(chartSize);



    if(sbSelection.length > 0) {
        redrawBreadCrumbs(sbSelection);
        highlightChapter(sbSelection);
    } else {
        sbSelection = root.descendants();
        bcSelection = root.descendants();
        redrawBreadCrumbs(root.descendants());
    }
};

/*const getAllWithSameColor = function(color) {
    return d3.selectAll('.sunburstNode').data().filter(function(d) {
        return colorThresh(d.data[activeTopic]) === color})
};*/

const getPercentage = function(d) {
    let size = d.reduce(function(old, val) {
        return (val.data.size) ? old + val.data.size : old;
    }, 0);

    return d3.format('.2%')(size / wholeSize)
};

const appendCircles = function(chartSize) {
    d3.selectAll('.sunburstNode')
        .each(function(d) {
            if (!d.data.size && d !== root) {
                d3.select(this)
                    .append('circle')
                    .attr('class', 'sunburstSelected sunburstPart')
                    .attr('id', 'circle' + d.data.id)
                    .attr('transform', 'translate(' + arc.centroid(d) + ')')
                    .attr('r', chartSize / 400)
                    .on('click', function(d) {
                        sbSelection = d.descendants();
                        bcSelection = d.descendants();
                        redrawBreadCrumbs(d.descendants(), d);
                        highlightChapter(d.descendants());
                        updateInformationTexts(d.data.name, getPercentage(d.descendants()));
                        blockedMouseover = true;
                    });
            }
        });
};

const redrawSlider = function() {
    d3.select('.sbSlider').remove();

    let sliderWidth = SBSliderContainer.clientWidth;
    let sliderHeight = SBSliderContainer.clientHeight;
    let spacing = sliderHeight / 10;
    let handleSize = sliderWidth / 5;
    let lineSize = sliderWidth / 6;
    let fontSize = sliderWidth / 4;

    sbSliderSvg.attr('viewBox', '0 0 ' + sliderWidth + ' ' + sliderHeight);

    /** taken and adjusted from: https://bl.ocks.org/mbostock/6452972 */

    let y = d3.scaleLinear()
        .domain([sliderScales[activeTopic][1], 0])
        .range([spacing, sliderHeight - spacing])
        .clamp(true);

    let scale = d3.scaleQuantize()
        .domain([spacing, sliderHeight - spacing])
        .range(sliderScales[activeTopic][4]);

    y.ticks(10);

    let slider = sbSliderSvg.append('g')
        .attr('class', 'sbSlider')
        .attr('transform', 'translate(' + handleSize * 1.1 + ', 0)');

    slider.append('text')
        .attr('id', 'scaleText')
        .attr('x',  - handleSize)
        .attr('y', spacing - handleSize * 1.5)
        .attr('text-anchor', 'left')
        .attr('pointer-events', 'none')
        .style('font-size', fontSize + 'px')
        .style('font-weight', 'bold')
        .text(sliderScales[activeTopic][2] + sliderScales[activeTopic][3]);

    slider.append('line')
        .attr('y1', y.range()[0])
        .attr('y2', y.range()[1])
        .style('stroke-linecap', 'round')
        .style('stroke', '#000')
        .style('stroke-width', handleSize + 'px')
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .style('stroke', '#ddd')
        .style('stroke-width', lineSize + 'px')
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr('id', 'track-overlay')
        .style('pointer-events', 'stroke')
        .style('stroke', 'transparent')
        .style('stroke-width', handleSize * 5 + 'px')
        .style('cursor', 'pointer')
        .call(d3.drag()
            .on('start drag', function() {
                d3.select('#scaleText').text(scale(d3.event.y) + sliderScales[activeTopic][3]);
                handle.attr('cy', y(scale(d3.event.y)));
            })
            .on('end', function() {
                sliderScales[activeTopic][2] = scale(d3.event.y);
                changeColorForPercentage();
                adjustBubbleColor();
                redrawLegend();
            }));

    slider.insert('g', '.track-overlay')
        .attr('class', 'ticks')
        .attr('transform', 'translate(' + fontSize + ', 0)')
        .selectAll('text')
        .data(y.ticks())
        .enter()
        .append('text')
        .attr('y', function(d) {return y(d)})
        .attr('dy', '.35em')
        .attr('text-anchor', 'left')
        .attr('pointer-events', 'none')
        .style('font-size', fontSize + 'px')
        .text(function(d) { return d; });

    let handle = slider.insert('circle', '#track-overlay')
        .attr('class', 'handle')
        .attr('r', handleSize)
        .attr('cy', y(sliderScales[activeTopic][2]))
        .style('fill', '#fff')
        .style('stroke', '#000')
        .style('stroke-width', handleSize / 10 + 'px');
};

const removeAll = function() {
    d3.selectAll('.content').remove();
};

const highlightChapter = function(chapters) {
    d3.selectAll('.sunburstPart')
        .filter('.sunburstSelected')
        .classed('sunburstSelected', false)
        .style('opacity', 0.4);

    chapters.forEach(function(e) {
        d3.select('#chapter' + e.data.id).classed('sunburstSelected', true).transition().style('opacity', 1);
        d3.select('#circle' + e.data.id).classed('sunburstSelected', true).transition().style('opacity', 1);
    });
};

const updateInformationTexts = function(name, amount) {
    p.text(name);
    a.text(amount);
};

const changeColorForPercentage = function() {
    let distance = sliderScales[activeTopic][2] / (colors.length - 1);

    let domain = d3.range(colors.length - 2).reduce(function(old){
        return old.concat(old[old.length - 1] + distance);
    }, [distance]);

    colorThresh = d3.scaleThreshold()
        .domain(domain)
        .range(colors);

    //TODO: ohne kinder
    /*d3.selectAll('.sunburstNode path')
        .attr('fill', function(d) {
            return (d.data.size > 0) ? colorThresh(d.data[activeTopic]) : colorThresh(0);
        });*/

    //TODO: mit kinder
    d3.selectAll('.sunburstNode path')
        .each(function(d) {

            d3.select(this)
                .attr('fill', getColorForChapter(d));
        });
};

const getColorForChapter = function(chapter) {
    let sum = d3.sum(chapter.descendants(), function(c) {return c.data.size});
    let mid = sum / chapter.descendants().length;

    return colorThresh(mid);
};

/** legend function */

const redrawLegend = function() {
    lSvg.selectAll('.content').remove();

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
        .style('stroke-width', 1);

    let rootG = lSvg.append('g')
        .attr('class', 'content');

    let legend = rootG.append('text')
        .text('Legend')
        .attr('x', lWidth / 2)
        .attr('y', 0)
        .attr('dy', '.8em')
        .attr('font-size', lWidth / 4)
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none')
        .style('fill', '#000')
        .style('font-weight', 'bold')
        .classed('legendText', true);

    let colorText = rootG.append('text')
        .text('Color = Worst Value Of The Chapter / Average Of Sub-Chapters:')
        .attr('x', lWidth / 2)
        .attr('y', legend.node().getBBox().height)
        .attr('dy', '.8em')
        .attr('font-size', size / 3)
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none')
        .style('fill', '#000')
        .style('font-weight', 'bold')
        .classed('legendText', true)
        .call(wrap, lWidth);

    let subG = rootG.append('g')
        .attr('transform', 'translate(0,' + (lWidth - size) / 2 + ')');

    let subG1 = subG.append('g')
        .attr('id', 'legendSubG1')
        .attr('transform', 'translate(0, ' + colorText.node().getBBox().height + ')');

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
                const band = sliderScales[activeTopic][2] / (colors.length - 1);

                let lGText = lSvg.select('#legendSubGroup' + i )
                    .append('text')
                    .text(function() {
                        if (i === 0) {
                            return '<' + (d3.format('.1f')(i * band + band) + sliderScales[activeTopic][3])
                        } else if (i < colors.length - 1) {
                            return '>' + d3.format('.1f')(i * band) + sliderScales[activeTopic][3] + '   &&   <' + (d3.format('.1f')(i * band + band) + sliderScales[activeTopic][3])
                        } else {
                            return '>=' + d3.format('.1f')(i * band) + sliderScales[activeTopic][3]
                        }
                    })
                    .attr('x', lWidth / 2)
                    .attr('y', gheight + size)
                    .attr('dy', '1em')
                    .attr('font-size', size / 3)
                    .attr('text-anchor', 'middle')
                    .attr('id', 'legendText' + i)
                    .attr('pointer-events', 'none')
                    .style('fill', '#000')
                    .style('font-weight', 'bold');

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
        .attr('pointer-events', 'none')
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
        .text('Chapter Has No Introduction')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '1em')
        .attr('font-size', size / 3)
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none')
        .style('fill', '#000')
        .style('font-weight', 'bold');

    subG2G2Text.call(wrap, lWidth);

    let subG2G3 = subG2.append('g')
        .attr('transform', 'translate(0, ' + (subG2G1.node().getBBox().height + subG2G2.node().getBBox().height - spacing * 2) + ')');

    subG2G3.append('path')
        .attr('id', 'mouseClick')
        .attr('d', arc(path))
        .style('fill', '#fff')
        .style('stroke', '#000')
        .style('stroke-width', 2);

    // <a href='https://icons8.com'>Icon pack by Icons8</a>
    subG2G3.append('image')
        .attr('xlink:href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADgElEQVRoQ+2agZENQRRF70aACBABIkAEiAARIAJEgAjYCBABIkAEiAARUKeqr+rq7Z7p7umZPz5dtbVb++f/eafvu++9nt0THck6ORIO/ZMgDyVdksT33a0WRd6H6G/sjkIqptZ3Sa8kPYqCfiPpvKQY5J6kZ5KuSfp6SMCSIkDcDSDPQ4BA8OWAAXon6bOkq4eE4N5TqQUA6YQSuUXwTyShyo89gxw6tqb715qd3X8cdv6FpE9Nd9ng4hSENLkY7vs0MTqeOBd+Bwip93YPaZXzCJ64LulbMLBz3+anOt0OvgCY1/HQwVVqSa2PSRUDiC+qG+ugKtWCEChl95eky0nKU5JJSTq+0xIFT0PV28Ah0+UXTxC8+waB0vxuTgTIe4CySrwXLwG1aokuKUIwLyVheHoFi52n4xMUr3uRXg/CJGDzb65SCYQUomOzw/FO2vQXot9TmjG8zX8/aaKbqFQCITjSIk0HjyXMYB5dYmVQCgUxPj+zIZuo1GJ2B1wyfWpqVLpVKNFWibSkNy32Ug9IjelTlQDKlWi8BAyfeSVcQ/qyCShZvXpASqafuikHMgdcaqSkM0CxSi7js0eEHhACzpm+dvfmzJ9TCYW4Z1GlXpAp09cCpSWawkI1jFeqEqNQ9qjdCzLV6WtB4uvYGIJOK6Gv4bXXAZQNOLOWgNj0DJJrjfUETbPlXvxMjyLFhoL0mL5FLUzPSESh+BD6UtH0SxSx6SmtDJKjZikCZzwi3ThOoEbpuP1nY5aC2PRFyRskQGFOoQT+M/jFc97sxywFsekZJvFK7yKNUAEYSiwws70jvtkIEHaNnew1Pan0JaQR85kfBDZtyggQB5KO97WB+FkZMJx1urw2AoSAMSNn/V7T+/xDGe+CGQVCjtOwak2PivaXlVsEMwqkxfSG5j0peDfMSJAa0+MHvEB5xQuM7kNgRoLUmJ5ZipEDH+AHKtQQmJEgc6Y3KH2C9GKh0BCY0SBTpudPEPQaPw+wyYfAjAYpmd6A8eOluM8shlkDxKanpzBmECSPW7mXy26uWS6CWQPEXvBpzmB3KqbYbpg1QGLT4wnKLeeJ2j+iTsH4MHem8a4FYk+QWijkNGuZv3LVbHMQH7r8CCh7PJ2hipXxAwf6UO5R7u7/8yGGgTsLwQtrpVZtCtVeh7JAMWVnx/y/BWQW+D/I7BZtfMHRKPIbzUAQQpxDgKEAAAAASUVORK5CYII=')
        .attr('width', size / 2)
        .attr('height', size / 2)
        .attr('transform', function() {return 'translate(' + (-size / 4) + ', ' + (-size + size/8) + ')'});

    let singleText = subG2G3.append('text')
        .text('Click: Select Whole Chapter')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '1em')
        .attr('font-size', size / 3)
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none')
        .style('fill', '#000')
        .style('font-weight', 'bold')
        .classed('legendText', true);

    singleText.call(wrap, lWidth);

    lSvg.select('rect').attr('height', rootG.node().getBBox().height).attr('transform', 'translate(0, ' + ((lHeight / 2) - (rootG.node().getBBox().height / 2)) + ')');
    rootG.attr('transform', 'translate(0, ' + ((lHeight / 2) - (rootG.node().getBBox().height / 2)) + ')');
};

/** All functions for the breadcrumbs */

let bcSelection = [],
    bcRect,
    bcGroupWidth,
    bcPadding,
    maxBC = 5;

const getBreadCrumbPath = function(isMask) {
    let path = [];


    path.push({x: 0, y: bcHeight});

    path.push({x: 0, y: 0});

    (isMask) ? path.push({x: bcWidth - bcHeight, y: 0}) : path.push({x: bcWidth, y: 0});
    (isMask) ? path.push({x: bcWidth - bcHeight, y: bcHeight}) : path.push({x: bcWidth, y: bcHeight});

    path.push({x: 0, y: bcHeight});

    const pathCreator = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    return pathCreator(path);
};

const redrawBreadCrumbs = function(chapters) {
    bcSvg.selectAll('.content').remove();

    let width = BCContainer.clientWidth;

    bcPadding = width / 50;
    bcGroupWidth = width - 2 * bcPadding;

    bcWidth = (bcGroupWidth - ((maxBC - 1) * bcPadding)) / (maxBC);
    bcHeight = bcWidth / 5;

    let minDepth = d3.min(chapters, function (d) {
        return d.depth
    });
    let maxDepth = d3.max(chapters, function (d) {
        return d.depth
    });

    let depthValues = d3.range(0, (maxDepth + 1 - minDepth) * 2, 2);
    let depthElementCount = [];
    depthValues.forEach(function (d, i) {
        depthElementCount[i] = 0;
    });

    bcRect = bcSvg.append('rect')
        .attr('class', 'content')
        .style('fill', '#fff')
        .style('stroke', '#000')
        .style('stroke-width', 2);

    bcG = bcSvg.append('g')
        .attr('id', 'bcGroup')
        .attr('class', 'content')
        .attr('transform', 'translate(' + bcPadding + ',' + bcPadding + ')');

    bcG.selectAll('.breadCrumb')
        .data(chapters)
        .enter()
        .append('g')
        .attr('class', 'breadCrumb')
        .each(function (d, i) {
            let depth = (d.depth - minDepth);

            if (depthElementCount[depth] === 5) {
                depthElementCount[depth] = 0;
                for (let i = depth; i <= depthValues.length - 1; i++) {
                    depthValues[i]++;
                }
            }

            let row = depthValues[depth];
            let column = depthElementCount[depth];

            depthElementCount[depth]++;

            let bc = d3.select(this);

            bc.append('path')
                .attr('d', getBreadCrumbPath(false))
                .attr('id', 'BcPath' + d.data.id)
                .style('stroke', '#000')
                .style('stroke-width', 1)
                .style('cursor', 'pointer');

            bc.append('clipPath')
                .attr('id', 'bcClip' + i)
                .attr('class', 'bcClip')
                .append('path')
                .attr('d', getBreadCrumbPath(true));

            bc.append('text')
                .attr('x', bcWidth * 0.01)
                .attr('y', bcHeight / 2)
                .attr('dy', '.35em')
                .attr('text-anchor', 'left')
                .attr('clip-path', 'url(#bcClip' + i + ')')
                .attr('pointer-events', 'none')
                .style('cursor', 'pointer')
                .style('fill', '#fff')
                .style('font-size', (bcHeight / 1.5 < bcWidth / 5) ? bcHeight / 1.5 : bcWidth / 5)
                .style('font-weight', 'bold')
                .text(function (d) {
                    return d.data.name
                });

            let rectG = bc.append('g').attr('transform', 'translate(' + (bcWidth - bcHeight) + ', 0)').style('cursor', 'pointer');

            rectG.append('rect')
                .attr('width', bcHeight)
                .attr('height', bcHeight)
                .style('fill', getColorForChapter(d))
                .style('stroke', '#000')
                .style('stroke-width', 2);

            if(!d.data.size) {
                rectG.append('circle')
                    .attr('class', 'sunburstSelected sunburstPart')
                    .attr('transform', 'translate(' + bcHeight / 2 + ', ' + bcHeight / 2 + ')')
                    .attr('r', chartSize / 400)
            }

            bc.attr('transform', 'translate(' + (column * (bcWidth + bcPadding)) + ', ' + (row * (bcHeight + bcPadding)) + ')')
                .style('opacity', (bcSelection.indexOf(d) !== -1) ? 1 : 0.2);
        })
        .on('click', function (d) {
            let event = d3.event;
            switch (event.detail) {
                case 1:
                    let indexD = bcSelection.indexOf(d);
                    d.descendants().forEach(function (n) {
                        let indexN = bcSelection.indexOf(n);
                        (indexD === -1) ? (indexN === -1) ? bcSelection.push(n) : {} : (indexN === -1) ? {} : bcSelection.splice(indexN, 1);
                    });
                    redrawBreadCrumbs(chapters, d);
                    blockedMouseover = true;
                    // drawBubbles(bubbleData, bubbleKey);
                    break;
                default:
                    break
            }
        });

    let cColors = d3.scaleOrdinal(chapterColors)
        .domain(d3.range((chapters[0].children) ? chapters[0].children.length + 1 : 1));

    d3.select('#BcPath' + chapters[0].data.id)
        .style('fill', cColors(0));

    if (chapters[0].children) {

        let firstChildren = chapters[0].children;

        for (let i = 1; i < firstChildren.length + 1; i++) {
            firstChildren[i - 1].descendants().forEach(function (d) {
                d3.select('#BcPath' + d.data.id)
                    .style('fill', cColors(i));
            });
        }
    }

    bcSvg.attr('viewBox', '0 0 ' + width + ' ' + (bcSvg.select('#bcGroup').node().getBBox().height + 2 * bcPadding));
    bcRect.attr('width', width).attr('height', (bcSvg.select('#bcGroup').node().getBBox().height + 2 * bcPadding));

    drawBubbles(bubbleData, bubbleKey);
    drawBubbleSlider(bubbleData, bubbleKey);
};

/** BubbleChart-Function */
let BubbleContainer = document.getElementById('nav-tabContent'),
    bubbleSvg = d3.select('#BUContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid'),
    bubbleSliderSvg = d3.select('#BUSliderContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid'),
    bubbleMinValue;

const drawBubbles = function(data, key) {
    //TODO: Daten filtern anhand von slider-wert

    bubbleKey = key;
    if(bubbleData.length === 0) bubbleData = data;
    bubbleSvg.selectAll('.content').remove();

    let buWidth = BubbleContainer.clientWidth * 0.95;
    let buHeight = BubbleContainer.clientHeight * 0.93;

    bubbleSvg.attr('viewBox', '0 0 ' + buWidth + ' ' + buHeight);

    data.sort(function(a, b){return -(a[key] - b[key])});

    let rootNode = {
        children: data
    };

    let pack = d3.pack()
        .size([buWidth, buHeight])
        .padding(2);

    let root = d3.hierarchy(rootNode)
        .sum(function(d) {return d[key]});

    pack(root);

    bubbleSvg.append('rect')
        .attr('class', 'content')
        .attr('id', 'bgRect')
        .attr('width', buWidth)
        .attr('height', buHeight)
        .style('fill', '#ddd');

    bubbleGroup = bubbleSvg.append('g')
        .attr('class', 'content')
        .attr('transform', 'translate(0, 0)');

    bubbleGroup.selectAll('.leafNode')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('class', 'leafNode')
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')' })
        .each(function(d, i) {
            let group = d3.select(this).style('cursor', 'pointer');

            group.append('clipPath')
                .attr('id', 'bubbleClip' + i)
                .attr('class', 'bubbleClip')
                .append('circle')
                .attr('r', d.r);

            group.append('circle')
                .attr('r', d.r)
                .style('fill', colorThresh(d.data[key]))
                .style('stroke', '#000')
                .style('stroke-width', 1);

            let text = group.append('text')
                .attr('dy', '.35em')
                .attr('clip-path', 'url(#bubbleClip' + i + ')')
                .style('fill', '#fff')
                .style('text-anchor', 'middle')
                .text(d.data.name.substring(0, d.r / 4));

            text.on('mouseenter', function() {
                group.moveToFront();
                group.selectAll('circle')
                    .transition()
                    .attr('r', d3.max([d3.min([buWidth, buHeight]) / 10, d.r]));
                group.select('text')
                    .transition()
                    .text(d.data.name.substring(0, d3.max([d3.min([buWidth, buHeight]) / 20, d.r]) / 2));
            }).on('mouseleave', function() {
                group.selectAll('circle')
                    .transition()
                    .attr('r', d.r);
                group.select('text')
                    .transition()
                    .text(d.data.name.substring(0, d.r / 4));
            });
        });
};

const updateBubbles = function(data, key) {
    //TODO: update chart und enter,update,exit prinzip machen
};

const adjustBubbleColor = function() {
    d3.selectAll('.leafNode circle')
        .transition()
        .style('fill', function(d) {return colorThresh(d.data[bubbleKey])});
};

const drawBubbleSlider = function(data, key) {
    d3.select('.buSlider').remove();

    let sliderWidth = BubbleContainer.clientWidth * 0.05;
    let sliderHeight = BubbleContainer.clientHeight * 0.93;
    let spacing = sliderHeight / 10;
    let handleSize = sliderWidth / 5;
    let lineSize = sliderWidth / 6;
    let fontSize = sliderWidth / 4;
    let min = d3.min(data, function(d) {
        return d[key];
    });
    let max = d3.max(data, function(d) {
        return d[key];
    });
    let dist = max - min;
    let step = dist / 100;

    bubbleSliderSvg.attr('viewBox', '0 0 ' + sliderWidth + ' ' + sliderHeight);

    bubbleSliderSvg.append('rect').attr('width', sliderWidth).attr('height', sliderHeight).style('fill', '#fff');

    /** taken and adjusted from: https://bl.ocks.org/mbostock/6452972 */

    let buY = d3.scaleLinear()
        .domain([100, 0])
        .range([spacing, sliderHeight - spacing])
        .clamp(true);

    let buScale = d3.scaleQuantize()
        .domain([0, 100])
        .range(d3.range(min, max + step, step).reverse());

    buY.ticks(100);

    let buSlider = bubbleSliderSvg.append('g')
        .attr('class', 'sbSlider')
        .attr('transform', 'translate(' + handleSize * 1.1 + ', 0)');

    buSlider.append('text')
        .attr('id', 'buScaleText')
        .attr('x',  - handleSize)
        .attr('y', spacing - handleSize * 1.5)
        .attr('text-anchor', 'left')
        .attr('pointer-events', 'none')
        .style('font-size', fontSize + 'px')
        .style('font-weight', 'bold')
        .text('100%');

    buSlider.append('line')
        .attr('y1', buY.range()[0])
        .attr('y2', buY.range()[1])
        .style('stroke-linecap', 'round')
        .style('stroke', '#000')
        .style('stroke-width', handleSize + 'px')
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .style('stroke', '#ddd')
        .style('stroke-width', lineSize + 'px')
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr('id', 'buTrack-overlay')
        .style('pointer-events', 'stroke')
        .style('stroke', 'transparent')
        .style('stroke-width', handleSize * 5 + 'px')
        .style('cursor', 'pointer')
        .call(d3.drag()
            .on('start drag', function() {
                buSlider.select('#buScaleText').text(Math.round(buY.invert(d3.event.y)) + '%');
                handle.attr('cy', buY(buY.invert(d3.event.y)));
            })
            .on('end', function() {
                //TODO: RESIZE IMAGE
                //sliderScales[activeTopic][2] = scale(d3.event.y);
                //changeColorForPercentage();
                //adjustBubbleColor();
                //redrawLegend();
            }));

    buSlider.insert('g', '.buTrack-overlay')
        .attr('class', 'ticks')
        .attr('transform', 'translate(' + fontSize + ', 0)')
        .selectAll('text')
        .data(buY.ticks())
        .enter()
        .append('text')
        .attr('y', function(d) {return buY(d)})
        .attr('dy', '.35em')
        .attr('text-anchor', 'left')
        .attr('pointer-events', 'none')
        .style('font-size', fontSize + 'px')
        .text(function(d) { return d; });

    let handle = buSlider.insert('circle', '#buTrack-overlay')
        .attr('class', 'handle')
        .attr('r', handleSize)
        .attr('cy', buY(100))
        .style('fill', '#fff')
        .style('stroke', '#000')
        .style('stroke-width', handleSize / 10 + 'px');
};

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
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
            y = text.attr('y'),
            x = text.attr('x'),
            dy = parseFloat(text.attr('dy')),
            tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
            }
        }
    });
};