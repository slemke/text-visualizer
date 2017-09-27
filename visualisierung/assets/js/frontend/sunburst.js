/**
 * Created by Dennis Dubbert on 11.09.17.
 */

let SBContainer = document.getElementById('nav-viz-tabContent'),
    TreeContainer = document.getElementById('nav-viz-tabContent');

let sbSvg = d3.select('#SBContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');
let sbSliderSvg = d3.select('#SBSliderContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');
let treeSvg = d3.select('#TreeContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');
let treeSliderSvg = d3.select('#TreeSliderContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');

let chartSize, bcWidth, bcHeight;

let wholeSize,
    g,
    bcG,
    partition,
    root,
    arc,
    colorThresh,
    p,
    a,
    z,
    z1,
    a1,
    sbSelection = [],
    innerRadius,
    textGroup,
    dataDocument,
    cColors,
    treeNodeWidth,
    treeNodeHeight,
    maxStrokeWidth = 6;


let chapterColors = [ '#0e6873', '#8c3c61', '#e98548', '#83c6dc', '#af6a40','#584337', '#a08562', '#8c9898', '#5f6d6e', '#87816c', '#b4aa92', '#7d7061', '#917359', '#7d6852', '#bba98b', '#a3906b'];
let colors = ['#9dd863', '#dddd77', '#F4A460', '#FA8072', '#A52A2A'];
let sliderScales = {size : [0, 10, 5, '%', d3.range(0,10.1,0.1).reverse()],
    worstSentenceLength : [0, 100, 50, '', d3.range(0,101,1).reverse()],
    worstSentencePunctuation : [0, 50, 25, '', d3.range(0,51,1).reverse()],
    worstStopwordCount : [0, 50, 25, '%', d3.range(0,50.1,0.1).reverse()],
    worstWordCount : [0, 10, 5, '%', d3.range(0,10.1,0.1).reverse()]};

let activeTopic = 'worstWordCount';
let lastInformationText = ['Lastly (De-)Selected Chapter', '. . .', '. . .', 0.2];

const setData = function(data) {
    dataDocument = data;
};

const setBubbleData = function(data) {
    bubbleData = data;
};

const traverseAndFix = function(node) {
    node.worstWordCount = (node.worstWordCount / node.size * 100);
    node.worstStopwordCount = (node.worstStopwordCount / node.size * 100);

    if(node.children.length > 0) {
        if (node.children.length > 1){
            delete node.size;
            if(node.children[0].name !== 'Einleitung') {
                node.hasIntroduction = false;
            } else {
                node.children[0].name = 'Introdution to chapter';
                node.hasIntroduction = true;
            }
        }

        if(node.children[0].name === null) {
            node.hasIntroduction = true;
            if(node.children.length === 1) {
                delete node.children;
            }
        }

        if (node.children) node.children.forEach(traverseAndFix);
    } else {
        if(node.size > 0) {
            node.hasIntroduction = true;
        }
        delete node.children;
    }
};

const drawSunburst = function() {
        removeAll();

        initializeAndDrawSunburst(dataDocument);
        redrawSlider(SBContainer, sbSliderSvg, 'sbSlider');

        redrawTree(dataDocument);
        redrawSlider(TreeContainer, treeSliderSvg, 'treeSlider');

        //redrawBreadcrumbs();
        drawBubbleChart();
};

/** All functions for the tree */

const getTreeNodePath = function(width, height, isMask) {
    let path = [];

    path.push({x: 0, y: height});

    path.push({x: 0, y: 0});

    (isMask) ? path.push({x: width - height, y: 0}) : path.push({x: width, y: 0});
    (isMask) ? path.push({x: width - height, y: height}) : path.push({x: width, y: height});

    path.push({x: 0, y: height});

    const pathCreator = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    return pathCreator(path);
};

const redrawTree = function(chapters) {
    treeSvg.selectAll('.content').remove();

    let width = TreeContainer.clientWidth * 0.95;
    let dHeight = TreeContainer.clientHeight;
    let windowHeight = $(window).height();

    let height = d3.min([dHeight, windowHeight * 0.9]);

    treeSvg.attr('viewBox', '0 0 ' + width + ' ' + height);

    let nodeDepthCount = [];

    root.descendants().forEach(function(d) {
        (nodeDepthCount[d.depth]) ? nodeDepthCount[d.depth]++ : nodeDepthCount[d.depth] = 1;
    });

    let nodeDepthMaxAmount = d3.max(nodeDepthCount);

    let strokeWidth = 2;
    let reduceAmount = nodeDepthMaxAmount * 1.5 ;
    let maxDepth = d3.max(root.leaves(), function(l) {return l.depth});
    let nodeWidth = (width - maxStrokeWidth * 2) / (maxDepth * 1.5);
    treeNodeWidth = nodeWidth;
    let nodeHeight = (height - reduceAmount * strokeWidth * 2) / reduceAmount;
    treeNodeHeight = nodeHeight;

    let newRoot = d3.hierarchy(chapters, function(d) {return d.children});
    let tree = d3.tree().size([height, width - nodeWidth - 2 * maxStrokeWidth])
        .separation(function(a, b) { return (a.parent === b.parent ? 1 : 2); });

    let treeNodes = tree(newRoot);
    treeNodes.x = height / 2;

    treeSvg.append('rect')
        .attr('class', 'content')
        .attr('id', 'bgRect')
        .attr('width', width)
        .attr('height', height)
        .style('fill', '#fff')
        .style('cursor', 'pointer')
        .on('mouseenter', function() {
            updateInformationTexts();
            highlightChapter(sbSelection);
        })
        .on('click', function() {
            sbSelection = [];
            selectedBubbles = [];

            highlightChapter([]);
            updateInformationTexts();
            //redrawBreadcrumbs();
            drawBubbleChart();
        });

    let rootG = treeSvg.append('g')
        .attr('class', 'content');

    rootG.selectAll('.link')
        .data(treeNodes.descendants().slice(1))
        .enter()
        .append('path')
        .attr('clip-path', 'url(#treeClip)')
        .attr('class', 'link linkSelected')
        .attr('id', function(d) {return 'link' + d.data.id})
        .attr('d', function(d) {
            // taken from: https://bl.ocks.org/d3noob/5537fe63086c4f100114f87f124850dd
            return 'M' + d.y + ',' + d.x
                + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x
                + ' ' + (d.y + d.parent.y) / 2 + ',' + d.parent.x
                + ' ' + d.parent.y + ',' + d.parent.x;
        })
        .style('fill', 'none')
        .style('stroke', function(d) {
            return cColors(d.ancestors()[d.ancestors().length - 2].data.id);
        })
        .style('stroke-width', 5);

    rootG.selectAll('.backgroundRect')
        .data(treeNodes.descendants())
        .enter()
        .append('path')
        .attr('class', 'backgroundRect')
        .attr('d', getTreeNodePath(nodeWidth, nodeHeight))
        .attr('transform', function(d) {return 'translate(' + (d.y -nodeWidth / 2) + ', ' + (d.x -nodeHeight / 2) + ')'})
        .style('fill', '#fff');

    let chapterNodes = rootG.selectAll('.chapterNode')
        .data(treeNodes.descendants())
        .enter()
        .append('g')
        .attr('class', 'chapterNode')
        .attr('transform', function(d) {return 'translate(' + d.y + ',' + d.x + ')'})
        .style('cursor', 'pointer')
        .on('mouseenter', function(d) {
            if(d.data.id !== root.descendants()[0].data.id) {
                sbSelection = sbSelection.concat(d.descendants());
                if(d.descendants().length === 1) {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(d.descendants(), true)), d3.format('.2f')(d3.max(d.descendants(), function (c) {
                        return c.data[activeTopic]
                    })));
                } else { updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(d.descendants(), true)))}
                highlightChapter(sbSelection);
                d.descendants().forEach(function(c) {
                    let index = sbSelection.findIndex(function(val) {
                        return val.data.id === c.data.id
                    });
                    sbSelection.splice(index, 1);
                });
            }
            else {
                highlightChapter(sbSelection);
                updateInformationTexts(d.data.name);
            }
        })
        .on('mouseleave', function() {
            updateInformationTexts();
        })
        .on('click', function(d) {
            addOrRemove(d);
            //redrawBreadcrumbs();
            highlightChapter(sbSelection);
            drawBubbleChart();
            if (sbSelection.length > 0) {
                text.highlight.scroll(sbSelection[sbSelection.length -1].data.id);
            } else text.highlight.scroll(0);
        });

    chapterNodes.append('title')
        .text(function(d) {
            if(d.descendants().length === 1) {
                return d.data.name + ' (Worst Value: ' + d3.format('.2f')(d3.max(d.descendants(), function (c) {
                        return c.data[activeTopic]
                    })) + '' + sliderScales[activeTopic][3] + ')'
            } else {return d.data.name}
        });


    chapterNodes.append('path')
        .attr('class', 'treeSelected treePart')
        .attr('id', function (d) { return 'treeChapter' + d.data.id })
        .attr('d', getTreeNodePath(nodeWidth, nodeHeight))
        .attr('transform', 'translate(' + (-nodeWidth / 2) + ', ' + (-nodeHeight / 2) + ')')
        .style('stroke', '#000')
        .style('stroke-width', 1);

    chapterNodes.append('clipPath')
        .attr('id', function(d) {return 'treeClip' + d.data.id})
        .append('path')
        .attr('d', function(d) {
            return (!d.data.hasIntroduction && d.data.id !== root.descendants()[0].data.id) ? getTreeNodePath(nodeWidth - nodeHeight - 2, nodeHeight - 2) : getTreeNodePath(nodeWidth - 2, nodeHeight - 2);
        })
        .attr('transform', 'translate(' + (-nodeWidth / 2 - 1) + ', ' + (-nodeHeight / 2) + ')');

    chapterNodes.append('text')
        .text(function(d) {return d.data.name})
        .attr('clip-path', function(d) {return 'url(#treeClip' + d.data.id + ')'})
        .attr('class', 'treeSelected treePart')
        .attr('id', function(d) {return 'treeText' + d.data.id})
        .attr('x', (-nodeWidth / 2) * 0.95)
        .attr('y', 0)
        .attr('dy', '.35em')
        .style('fill', '#000')
        .style('font-size', nodeHeight / 2)
        .style('font-weight', 'bold');

    changeColorForPercentage();

    rootG.attr('transform', 'translate(' + (nodeWidth / 2 + maxStrokeWidth) + ', 0)');

    appendTreeCircles(treeNodeHeight / 10);
    redrawTreeLegend();
    if(sbSelection.length > 0) {
        highlightChapter(sbSelection);
    } else {
        sbSelection = [];
        //redrawBreadcrumbs();
        highlightChapter([]);
    }
};

const redrawTreeLegend = function() {
    /** append legend */

    treeSvg.select('.legendContent').remove();

    let width = TreeContainer.clientWidth * 0.15;
    let size = width / 4;
    let spacing = size / 5;

    let legendG = treeSvg.append('g')
        .attr('class', 'legendContent');

    legendG.append('text')
        .text('Color = Worst Value Of The Chapter / Average Of Sub - Chapters:')
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('dy', '.8em')
        .attr('font-size', size / 2.5)
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none')
        .style('fill', '#000')
        .style('font-weight', 'bold')
        .classed('legendText', true)
        .call(wrap, width);

    let subG1 = legendG.append('g')
        .attr('id', 'legendSubG1')
        .attr('transform', 'translate(0, ' + legendG.node().getBBox().height + ')');

    colors.forEach(function(d, i) {
        subG1.append('g')
            .attr('class', 'legendSubGroup')
            .attr('id', 'legendSubGroup' + i)
            .append('rect')
            .attr('width', size)
            .attr('height', size)
            .attr('x', maxStrokeWidth)
            .attr('y', i * (size + spacing))
            .style('fill', colors[i])
            .style('stroke', '#000')
            .style('stroke-width', 2)
            .each(function() {
                const band = sliderScales[activeTopic][2] / (colors.length - 1);

                let lGText = subG1.select('#legendSubGroup' + i )
                    .append('text')
                    .text(function() {
                        if (i === 0) {
                            return '<' + ((sliderScales[activeTopic][3] === '%') ? d3.format('.1f')(i * band + band) + sliderScales[activeTopic][3] : (Math.round(i * band + band)) + sliderScales[activeTopic][3])
                        } else if (i < colors.length - 1) {
                            return '>' + ((sliderScales[activeTopic][3] === '%') ? d3.format('.1f')(i * band) + sliderScales[activeTopic][3] + '   &&   <' + (d3.format('.1f')(i * band + band) + sliderScales[activeTopic][3]) :
                                    (Math.round(i * band) + sliderScales[activeTopic][3]) + '   &&   <' + ((Math.round(i * band + band) + sliderScales[activeTopic][3])))
                        } else {
                            return '>=' + ((sliderScales[activeTopic][3] === '%') ? (d3.format('.1f')(i * band) + sliderScales[activeTopic][3]) : ((Math.round(i * band) + sliderScales[activeTopic][3])))
                        }
                    })
                    .attr('x', maxStrokeWidth + width / 2 + spacing)
                    .attr('y', i * (size + spacing) + size / 2)
                    .attr('dy', '.35em')
                    .attr('font-size', size / 2.6)
                    .attr('text-anchor', 'middle')
                    .attr('id', 'legendText' + i)
                    .attr('pointer-events', 'none')
                    .style('fill', '#000')
                    .style('font-weight', 'bold');

                lGText.call(wrapY, width / 2, 0);
            });
    });
    //
    // let subG2 = legendG.append('g')
    //     .attr('transform', 'translate(' + (width / 3 ) + ', ' + (size / 2 + legendG.node().getBBox().height) + ')')
    //     .attr('id', 'legendSubG2');
    //
    // a2 = subG2.append('text')
    //     .text('Worst Value:')
    //     .attr('x', 0)
    //     .attr('y', 0)
    //     .attr('dy', '.35em')
    //     .attr('font-size', size / 2.5)
    //     .attr('text-anchor', 'middle')
    //     .attr('pointer-events', 'none')
    //     .style('fill', '#000')
    //     .style('font-weight', 'bold');
    //
    // a2.call(wrap, width * 0.9);
    //
    // a3 = subG2.append('text')
    //     .text('...')
    //     .attr('x', 0)
    //     .attr('y', subG2.node().getBBox().height)
    //     .attr('dy', '.35em')
    //     .attr('font-size', size / 2.5)
    //     .attr('text-anchor', 'middle')
    //     .attr('pointer-events', 'none')
    //     .style('fill', '#000')
    //     .style('font-weight', 'bold');
    //
    // a3.call(wrap, width * 0.9);

    updateInformationTexts();
};

/** All functions for the sunburst */

const initializeAndDrawSunburst = function(chapter) {

    /*** Draw sunburst and its components (texts, circles etc.) */

    let sbWidth = SBContainer.clientWidth * 0.8;
    let sbHeight = SBContainer.clientHeight;
    let windowHeight = $(window).height();

    chartSize = d3.min([windowHeight * 0.9,sbHeight]);

    sbSvg.attr('viewBox', '0 0 ' + sbWidth + ' ' + chartSize);

    root = d3.hierarchy(chapter)
        .sum(function (d) {return d.size});

    let maxDepth = d3.max(root.leaves(), function(d) {return d.depth});
    innerRadius = (chartSize - 10) / 5;
    let radius = (chartSize - 10) / 2;
    let partsSize = (radius - innerRadius) / maxDepth;

    partition = d3.partition()
        .size([2 * Math.PI, radius]);

    partition(root);

    arc = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return (d.depth === 0) ? 0 : innerRadius + partsSize * (d.depth - 1)})
        .outerRadius(function (d) { return (d.depth === 0) ? innerRadius : innerRadius + partsSize * (d.depth - 1) + partsSize});

    wholeSize = root.descendants().reduce(function(old, val) {
        return (val.data.size) ? old + val.data.size : old;
    }, 0);

    cColors = d3.scaleOrdinal()
        .domain(root.children.reduce(function(old, val) {
            old.push(val.data.id);
            return old;
        }, []))
        .range(chapterColors);

    sbSvg.append('rect')
        .attr('class', 'content')
        .attr('id', 'bgRect')
        .attr('width', sbWidth)
        .attr('height', chartSize)
        .style('fill', '#fff')
        .style('cursor', 'pointer')
        .on('mouseenter', function() {
            highlightChapter(sbSelection);
            updateInformationTexts();
        })
        .on('click', function() {
            sbSelection = [];
            selectedBubbles = [];
            text.highlight.scroll(0);
            highlightChapter([]);
            updateInformationTexts();
            //redrawBreadcrumbs();
            drawBubbleChart();
        });

    g = sbSvg.append('g')
        .attr('transform', 'translate(' + sbWidth / 2 + ',' + (chartSize / 2 - 10)+ ')')
        .attr('class', 'sunburstGroup content')
        .attr('id', 'sbRoot')
        .selectAll('g')
        .data(root.descendants());

    g.enter()
        .append('g')
        .attr('class', 'sunburstNode')
        .append('path')
        .attr('class', 'sunburstSelected sunburstPart')
        .attr('id', function (d) { return 'chapter' + d.data.id })
        .style('cursor', 'pointer')
        .attr('d', arc)
        .style('stroke', '#000')
        .on('mouseenter', function(d) {
            if(d.data.id !== root.descendants()[0].data.id) {
                sbSelection = sbSelection.concat(d.descendants());
                if(d.descendants().length === 1) {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(d.descendants(), true)), d3.format('.2f')(d.data[activeTopic]));
                } else { updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(d.descendants(), true)))}
                highlightChapter(sbSelection);
                d.descendants().forEach(function(c) {
                    let index = sbSelection.findIndex(function(val) {
                        return val.data.id === c.data.id
                    });
                    sbSelection.splice(index, 1);
                });
            } else {
                highlightChapter(sbSelection);
                updateInformationTexts(d.data.name)
            }
        })
        .on('mouseleave', function() {
            updateInformationTexts();
        })
        .on('click', function(d) {
            addOrRemove(d);
            //redrawBreadcrumbs();
            highlightChapter(sbSelection);
            drawBubbleChart();
            if (sbSelection.length > 0) {
                text.highlight.scroll(sbSelection[sbSelection.length -1].data.id);
            } else text.highlight.scroll(0);
        });

    changeColorForPercentage();

    textGroup = sbSvg.append('g')
        .attr('class', 'content')
        .attr('transform', 'translate(' + sbWidth / 2 + ', ' + (chartSize / 2 - innerRadius) + ')')
        .attr('opacity', lastInformationText[3]);

    let fontSize = innerRadius / 7;

    let clip = textGroup.append('clipPath')
        .attr('id', 'sbTextClip');

    clip.append('path')
        .attr('d', describeArc(0, 0, innerRadius, 270, 90))
        .style('stroke-width', 2)
        .attr('transform', 'translate(0, ' + innerRadius + ')');

    p = textGroup.append('text')
        .text(lastInformationText[0])
        .attr('x', 0)
        .attr('y', innerRadius / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize / 1.2)
        .attr('font-weight', 'bold')
        .attr('dy', '.35em')
        .attr('pointer-events', 'none')
        .attr('clip-path', 'url(#sbTextClip)');

    p.call(wrapY, innerRadius, innerRadius / 5);

    z = textGroup.append('text')
        .text('Size Compared To Parent Chapter:')
        .attr('x', -innerRadius / 2)
        .attr('y', innerRadius * 0.9)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize * 0.9)
        .attr('dy', '.35em')
        .attr('font-weight', 'bold')
        .attr('pointer-events', 'none');

    z.call(wrap, innerRadius);

    z1 = textGroup.append('text')
        .text('Worst Value:')
        .attr('x', innerRadius / 2)
        .attr('y', innerRadius * 0.9)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize * 0.9)
        .attr('dy', '.35em')
        .attr('font-weight', 'bold')
        .attr('pointer-events', 'none');

    z1.call(wrap, innerRadius);

    a = textGroup.append('text')
        .text(lastInformationText[1])
        .attr('x', -innerRadius / 2)
        .attr('y', innerRadius * 0.9 + (z.node().getBBox().height + fontSize) )
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('dy', '.35em')
        .attr('pointer-events', 'none');

    a1 = textGroup.append('text')
        .text(lastInformationText[2])
        .attr('x', innerRadius / 2)
        .attr('y', innerRadius * 0.9 + (z.node().getBBox().height + fontSize) )
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('dy', '.35em')
        .attr('pointer-events', 'none');

    appendCircles(chartSize / 300);
    redrawLegend();

    if(sbSelection.length > 0) {
        highlightChapter(sbSelection);
        //text.highlight.scroll(sbSelection[sbSelection.length -1].data.id);
    } else {
        sbSelection = [];
        //redrawBreadcrumbs();
        highlightChapter([]);
    }
};

/*const highlightRoot = function(selection) {
    if (selectedRoot) {
        if(selectedRoot.parent) {
            d3.select('#chapter' + selectedRoot.parent.data.id).style('stroke-width', 1);
        }
    }

    if(selection) {
        if(selection.length > 0) {
            if(selection.length < root.descendants().length - 1) {
                let differentRoots = [];

                let numberFirstChild = [];
                root.children.forEach(function (c) {
                    let index = selection.findIndex(function (val) {
                        return val.data.id === c.data.id
                    });
                    if (index !== -1) numberFirstChild.push(c);
                });

                if (numberFirstChild.length > 1) {
                    selectedRoot = numberFirstChild[0];
                    let rootNode = d3.select('#chapter' + selectedRoot.parent.data.id);
                    rootNode.style('stroke-width', 3);
                    d3.select(rootNode.node().parentNode).moveToFront();
                } else {
                    selection.forEach(function (e) {
                        let rootObject = e.ancestors()[e.ancestors().length - 2];
                        let index = differentRoots.findIndex(function (val) {
                            return val.data.id === rootObject.data.id;
                        });
                        if (index === -1) differentRoots.push(rootObject);
                    });

                    if (differentRoots.length === 1) {
                        let minDepth = getMinDepth(selection);

                        selectedRoot = sbSelection.filter(function (c) {
                            return c.depth === minDepth;
                        })[0];

                        if (selectedRoot.parent) {
                            let rootNode = d3.select('#chapter' + selectedRoot.parent.data.id);
                            rootNode.style('stroke-width', 3);
                            d3.select(rootNode.node().parentNode).moveToFront();
                        }
                    }
                }
            } else {
                d3.select('#chapter' + root.descendants()[0].data.id).style('stroke-width', 1);
            }
        }
    }

};*/

const getRoot = function(chapter) {
    return chapter.ancestors()[chapter.ancestors().length - 2];
};

const checkParent = function(chapter) {
    if(chapter.parent.data.id !== root.descendants()[0].data.id) {
        let parent = chapter.parent;

        let indexD = sbSelection.findIndex(function (val) {
            return val.data.id === parent.data.id
        });

        if (indexD === -1) {

            let childCount = 0;
            parent.children.forEach(function (c) {
                if (sbSelection.findIndex(function (val) {return val.data.id === c.data.id}) !== -1) childCount++;
            });

            if (childCount === parent.children.length) {
                sbSelection.push(parent);
                if (parent.parent && parent.parent.data.id !== root.descendants()[0].data.id) {
                    checkParent(parent);
                }
            }
        } else {
            let parent = chapter.parent;
            let childCount = 0;
            parent.children.forEach(function (c) {
                if (sbSelection.findIndex(function (val) {return val.data.id === c.data.id}) !== -1) childCount++;
            });

            if (childCount < parent.children.length) {
                sbSelection.splice(indexD, 1);
                if (parent.parent && parent.parent.data.id !== root.descendants()[0].data.id) {
                    checkParent(parent);
                }
            }
        }
    }
};

const addOrRemove = function(chapter) {
    if(chapter.data.id === root.descendants()[0].data.id){
        sbSelection = [];
    } else {
        let mode = 0;
        if(chapter.descendants().length === sbSelection.length) {
            let equalCount = 0;
            chapter.descendants().forEach(function(c) {
                if(sbSelection.findIndex(function(val){return c.data.id === val.data.id}) !== -1) equalCount++;
            });
            if (equalCount === chapter.descendants().length) mode = 1;
        }
        sbSelection = [];
        if(mode === 0) {
            let indexD = sbSelection.findIndex(function (val) {
                return val.data.id === chapter.data.id
            });

            chapter.descendants().forEach(function (n) {
                let indexN = sbSelection.findIndex(function (val) {
                    return val.data.id === n.data.id
                });
                (indexD === -1) ? (indexN === -1) ? sbSelection.push(n) : {} : (indexN === -1) ? {} : sbSelection.splice(indexN, 1);
            });


            checkParent(chapter);
        }
    }
};

const getMinDepth = function(selection) {
    return d3.min(selection, function(d) {
        if(d.data.size) return d.depth;
        else {
            if(d.children) {
                let childsNotEmpty = 0;
                d.children.forEach(function(c) {
                    let index = sbSelection.findIndex(function(val) {
                        return val.data.id === c.data.id
                    });
                    if(index !== -1) childsNotEmpty++;
                });
                if(childsNotEmpty === d.children.length) return d.depth;
            }
        }
    });
};

const getPercentage = function(selection, toParent, forColor) {
    let minDepth;

    if(forColor) {
        minDepth = d3.min(selection, function (e) {return e.depth});
    } else {
        minDepth = getMinDepth(selection);
    }

    let f = selection.filter(function(e) {
        return e.depth === minDepth;
    });

    if (!toParent) {
        let size = d3.sum(f, function(rootObject) {
            return d3.sum(rootObject.leaves(), function(l) {
                let index = sbSelection.findIndex(function(val) {
                    return val.data.id === l.data.id
                });
                return (index !== -1) ? l.data.size : 0;
            });
        });

        return size / wholeSize;
    } else {

        if (f[0].parent) {
            let size = 0;
            let parentSize = d3.sum(f[0].parent.descendants(), function (c) {
                return c.data.size
            });

            if (forColor) {
                size = d3.sum(f[0].descendants(), function (c) {
                    return c.data.size
                });
            } else {
                f.forEach(function(d) {
                    size += d3.sum(d.descendants(), function (l) {
                        let index = sbSelection.findIndex(function(val) {
                            return val.data.id === l.data.id
                        });
                        return (index !== -1) ? l.data.size : 0;
                    });
                })
            }

            return size / parentSize
        } else {
            return 1
        }
    }
};

const appendCircles = function(chartSize) {
    d3.selectAll('.sunburstNode')
        .each(function(d) {
            if (!d.data.hasIntroduction && d.data.id !== root.descendants()[0].data.id) {
                d3.select(this)
                    .append('circle')
                    .attr('class', 'sunburstSelected sunburstPart')
                    .attr('id', 'circle' + d.data.id)
                    .attr('transform', 'translate(' + arc.centroid(d) + ')')
                    .attr('r', chartSize)
                    .style('cursor', 'pointer')
                    .on('click', function(d) {
                        addOrRemove(d);
                        //redrawBreadcrumbs();
                        highlightChapter(sbSelection);
                        drawBubbleChart();
                        if (sbSelection.length > 0) {
                            text.highlight.scroll(sbSelection[sbSelection.length -1].data.id);
                        } else text.highlight.scroll(0);
                    })
                    .on('mouseenter', function(d) {
                        if(d.data.id !== root.descendants()[0].data.id) {
                            sbSelection = sbSelection.concat(d.descendants());
                            if(d.descendants().length === 1) {
                                updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(d.descendants(), true)), d3.format('.2f')(d3.max(d.descendants(), function (c) {
                                    return c.data[activeTopic]
                                })));
                            } else { updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(d.descendants(), true)))}
                            highlightChapter(sbSelection);
                            d.descendants().forEach(function(c) {
                                let index = sbSelection.findIndex(function(val) {
                                    return val.data.id === c.data.id
                                });
                                sbSelection.splice(index, 1);
                            });
                        } else {
                            highlightChapter(sbSelection);
                            updateInformationTexts(d.data.name)
                        }
                    })
                    .on('mouseleave', function() {
                        updateInformationTexts();
                    });
            }
        });
};

const appendTreeCircles = function(chartSize) {
    d3.selectAll('.chapterNode')
        .each(function(d) {
            if (!d.data.hasIntroduction && d.data.id !== root.descendants()[0].data.id) {
                let node= d3.select(this);

                node.append('circle')
                    .attr('class', 'treeSelected treePart')
                    .attr('id', 'treeCircle' + d.data.id)
                    .attr('transform', 'translate(' + (treeNodeWidth / 2 - treeNodeHeight / 2) + ', 0)')
                    .attr('r', chartSize)
                    .style('cursor', 'pointer');
            }
        });
};

const removeAll = function() {
    d3.selectAll('.content').remove();
};

const highlightChapter = function(chapters) {
    d3.selectAll('.sunburstPart')
        .filter('.sunburstSelected')
        .classed('sunburstSelected', false)
        .style('opacity', 0.3);

    d3.selectAll('.treePart')
        .filter('.treeSelected')
        .classed('treeSelected', false)
        .style('opacity', 0.3);

    d3.selectAll('.link')
        .filter('.linkSelected')
        .classed('linkSelected', false)
        .style('opacity', 0.3);

    if(chapters.length > 0) {
        chapters.sort(function(a, b) {return -(a.depth - b.depth)});
        chapters.forEach(function(e) {
            d3.select('#chapter' + e.data.id).classed('sunburstSelected', true).style('opacity', 1);
            d3.select('#circle' + e.data.id).classed('sunburstSelected', true).style('opacity', 1);
            d3.select('#treeChapter' + e.data.id).classed('treeSelected', true).style('opacity', 1);
            d3.select('#treeText' + e.data.id).classed('treeSelected', true).style('opacity', 1);
            d3.select('#treeCircle' + e.data.id).classed('treeSelected', true).style('opacity', 1);
            d3.select('#treeCheck' + e.data.id).classed('treeSelected', true).style('opacity', 1);

            if(e.children) {
                e.children.forEach(function(c) {
                    if (chapters.findIndex(function(val) {return val.data.id === c.data.id}) !== -1) {
                        d3.select('#link' + c.data.id).classed('linkSelected', true).style('opacity', 1);
                    }
                });
            }

            e.ancestors().forEach(function(a) {
                d3.select('#link' + a.data.id).classed('linkSelected', true).style('opacity', 1);
                d3.select('#treeChapter' + a.data.id).classed('treeSelected', true).style('opacity', 1);
                d3.select('#treeText' + a.data.id).classed('treeSelected', true).style('opacity', 1);
                d3.select('#treeCircle' + a.data.id).classed('treeSelected', true).style('opacity', 1);
                d3.select('#treeCheck' + a.data.id).classed('treeSelected', true).style('opacity', 1);
            });

        });
    }
};

const updateInformationTexts = function(name, amountParent, amountAll) {
    if(name) {
        textGroup.attr('opacity', 1);
        p.text(name).attr('y', innerRadius / 2);
        p.call(wrapY, innerRadius, innerRadius / 5);
    }
    if (amountParent) {
        if (amountAll) {

            a1.text(amountAll + '' + sliderScales[activeTopic][3]);
            z.text('Size Compared To Parent Chapter:');
            z1.text('Worst Value:');
            z.call(wrap, innerRadius);
            z1.call(wrap, innerRadius);

        } else {
            a1.text('. . .');
        }
        a.text(amountParent);
    } else {
        a.text('. . .');
    }

    if (!name && !amountParent) {
        textGroup.attr('opacity', 0.3);
        p.text('Title Of Selected Chapter')
            .attr('y', innerRadius / 2);
        p.call(wrapY, innerRadius, innerRadius / 5);
        a.text('. . .');
        a1.text('. . .');
    }
};

const changeColorForPercentage = function() {
    let distance = sliderScales[activeTopic][2] / (colors.length - 1);

    let domain = d3.range(colors.length - 2).reduce(function(old){
        return old.concat(old[old.length - 1] + distance);
    }, [distance]);

    colorThresh = d3.scaleThreshold()
        .domain(domain)
        .range(colors);

    d3.selectAll('.sunburstNode path')
        .each(function(d) {
            d3.select(this)
                .attr('fill', function() {
                    if (d.data.id === root.descendants()[0].data.id) { return '#fff'}
                    else  return getColorForChapter(d)
                });
        });

    d3.selectAll('.treePart')
        .each(function(d) {
            d3.select(this)
                .attr('fill', function() {
                    if (d.data.id === root.descendants()[0].data.id) { return '#fff'}
                    else  return getColorForChapter(d)
                });
        });
};

const getColorForChapter = function(chapter) {
    return colorThresh(getWeightedValueForChapter(chapter));
};

const getWeightedValueForChapter = function(chapter){
    if (chapter.descendants().length > 1) {
        let value = 0;
        chapter.children.forEach(function(c){
            value += getPercentage([c], true, true) * getWeightedValueForChapter(c);
        });
        return value;
    } else {
        return chapter.data[activeTopic];
    }
};

const redrawSlider = function(container, svg, id) {
    d3.selectAll('.' + id).remove();

    let sliderWidth = container.clientWidth * 0.05;
    let height = container.clientHeight;

    let windowHeight = $(window).height();

    let sliderHeight = d3.min([windowHeight,height * 0.9]);

    svg.attr('viewBox', '0 0 ' + sliderWidth + ' ' + sliderHeight);

    let spacing = sliderHeight / 10;
    let handleSize = sliderWidth / 5;
    let lineSize = sliderWidth / 6;
    let fontSize = sliderWidth / 4;

    /** taken and adjusted from: https://bl.ocks.org/mbostock/6452972 */

    let y = d3.scaleLinear()
        .domain([sliderScales[activeTopic][1], 0])
        .range([spacing + 10, sliderHeight - spacing + 10])
        .clamp(true);

    let scale = d3.scaleQuantize()
        .domain([spacing + 10, sliderHeight - spacing + 10])
        .range(sliderScales[activeTopic][4]);

    y.ticks(10);

    let slider = svg.append('g')
        .attr('class', id)
        .attr('transform', 'translate(' + handleSize * 1.1 + ', 0)');

    slider.append('text')
        .attr('id', 'scaleText')
        .attr('x',  - handleSize)
        .attr('y', spacing - handleSize * 1.5)
        .attr('text-anchor', 'left')
        .attr('pointer-events', 'none')
        .style('font-size', fontSize + 'px')
        .style('font-weight', 'bold')
        .text(d3.format('.1f')(sliderScales[activeTopic][2]) + sliderScales[activeTopic][3]);

    slider.append('line')
        .attr('y1', y.range()[0])
        .attr('y2', y.range()[1])
        .style('stroke-linecap', 'round')
        .style('stroke', '#000')
        .style('stroke-width', handleSize + 'px')
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .style('stroke', '#fff')
        .style('stroke-width', lineSize + 'px')
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr('id', 'track-overlay')
        .style('pointer-events', 'stroke')
        .style('stroke', 'transparent')
        .style('stroke-width', handleSize * 5 + 'px')
        .style('cursor', 'pointer')
        .call(d3.drag()
            .on('start drag', function() {
                d3.select('#scaleText').text(d3.format('.1f')(scale(d3.event.y)) + sliderScales[activeTopic][3]);
                handle.attr('cy', y(scale(d3.event.y)));
            })
            .on('end', function() {
                sliderScales[activeTopic][2] = scale(d3.event.y);
                changeColorForPercentage();
                drawBubbleChart();
                redrawLegend();
                redrawTreeLegend();
                //redrawBreadcrumbs();
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
        .style('fill', '#ddd')
        .style('stroke', '#000')
        .style('stroke-width', handleSize / 10 + 'px');
};

/** legend function */
let LContainer = document.getElementById('nav-viz-tabContent');
let lSvg = d3.select('#LContainer').append('svg').attr('id', 'legendSvg').attr('preserveAspectRatio', 'xMidYMid');

const redrawLegend = function() {
    lSvg.selectAll('.content').remove();

    let lWidth = LContainer.clientWidth * 0.15;
    let height = LContainer.clientHeight;

    let windowHeight = $(window).height();

    let lHeight = d3.min([windowHeight,height * 0.9]);

    let size = lWidth / 4;
    let spacing = size / 5;

    lSvg.attr('viewBox', '0 0 ' + lWidth + ' ' + lHeight);

    let rootG = lSvg.append('g')
        .attr('class', 'content');

    let colorText = rootG.append('text')
        .text('Color = Worst Value Of The Chapter / Average Of Sub - Chapters:')
        .attr('x', lWidth / 2)
        .attr('y', 0)
        .attr('dy', '.8em')
        .attr('font-size', size / 2.5)
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none')
        .style('fill', '#000')
        .style('font-weight', 'bold')
        .classed('legendText', true)
        .call(wrap, lWidth);

    let subG1 = rootG.append('g')
        .attr('id', 'legendSubG1')
        .attr('transform', 'translate(0, ' + colorText.node().getBBox().height + ')');

    colors.forEach(function(d, i) {
        subG1.append('g')
            .attr('class', 'legendSubGroup')
            .attr('id', 'legendSubGroup' + i)
            .append('rect')
            .attr('width', size)
            .attr('height', size)
            .attr('x', maxStrokeWidth)
            .attr('y', i * (size + spacing))
            .style('fill', colors[i])
            .style('stroke', '#000')
            .style('stroke-width', 2)
            .each(function() {
                const band = sliderScales[activeTopic][2] / (colors.length - 1);

                let lGText = subG1.select('#legendSubGroup' + i )
                    .append('text')
                    .text(function() {
                        if (i === 0) {
                            return '<' + ((sliderScales[activeTopic][3] === '%') ? d3.format('.1f')(i * band + band) + sliderScales[activeTopic][3] : (Math.round(i * band + band)) + sliderScales[activeTopic][3])
                        } else if (i < colors.length - 1) {
                            return '>' + ((sliderScales[activeTopic][3] === '%') ? d3.format('.1f')(i * band) + sliderScales[activeTopic][3] + '   &&   <' + (d3.format('.1f')(i * band + band) + sliderScales[activeTopic][3]) :
                                    (Math.round(i * band) + sliderScales[activeTopic][3]) + '   &&   <' + ((Math.round(i * band + band) + sliderScales[activeTopic][3])))
                        } else {
                            return '>=' + ((sliderScales[activeTopic][3] === '%') ? (d3.format('.1f')(i * band) + sliderScales[activeTopic][3]) : ((Math.round(i * band) + sliderScales[activeTopic][3])))
                        }
                    })
                    .attr('x', maxStrokeWidth + lWidth * 0.5 + spacing)
                    .attr('y', i * (size + spacing) + size / 2)
                    .attr('dy', '.35em')
                    .attr('font-size', size / 2.6)
                    .attr('text-anchor', 'middle')
                    .attr('id', 'legendText' + i)
                    .attr('pointer-events', 'none')
                    .style('fill', '#000')
                    .style('font-weight', 'bold');

                lGText.call(wrapY, lWidth / 2, 0);
            });
    });

    let path = {x0: -Math.PI / 4, x1: Math.PI / 4, y0: size / 5, y1: size};
    let arc2 = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });

    let subG2 = rootG.append('g')
        .attr('transform', 'translate(' + (lWidth / 2 ) + ', ' + (size * 1.5 + rootG.node().getBBox().height) + ')')
        .attr('id', 'legendSubG2');


    let subG2G2 = subG2.append('g');
    subG2G2.append('path')
        .attr('d', arc2(path))
        .style('fill', '#fff')
        .style('stroke', '#000')
        .style('stroke-width', 2);

    subG2G2.append('circle')
        .attr('transform', 'translate(' + arc2.centroid(path) + ')')
        .attr('r', chartSize / 400);

    let subG2G2Text = subG2G2.append('text')
        .text('Chapter Has No Introduction')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '1em')
        .attr('font-size', size / 2.5)
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none')
        .style('fill', '#000')
        .style('font-weight', 'bold');

    subG2G2Text.call(wrap, lWidth * 0.9);
};

/** All functions for the breadcrumbs */

let BCContainer = document.getElementById('BCContainer');
let bcSvg = d3.select('#BCContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');

let bcRect,
    bcGroupWidth,
    bcPadding,
    maxBC = 6;

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

const redrawBreadCrumbs = function() {
    bcSvg.selectAll('.content').remove();
    let width = BCContainer.clientWidth;

    if (sbSelection.length > 0) {

        bcPadding = width / 100;
        bcGroupWidth = width - 2 * bcPadding;

        bcWidth = (bcGroupWidth - ((maxBC - 1) * bcPadding)) / (maxBC);
        bcHeight = bcWidth / 6;

        let differentRoots = [];
        let sortedNodes = [];

        sbSelection.forEach(function (e) {
            if(e.data.size > 0) {
                let rootObject = e.ancestors()[e.ancestors().length - 2];
                let index = differentRoots.findIndex(function (val) {
                    return val === rootObject;
                });

                if (index === -1) differentRoots.push(rootObject);
            }
        });

        differentRoots.sort(function(a, b) {return (a.data.id - b.data.id)});

        sbSelection.forEach(function(e) {
            if(e.data.size > 0) {
                let rootObject = e.ancestors()[e.ancestors().length - 2];
                let index = differentRoots.findIndex(function (val) {
                    return val === rootObject;
                });
                if (!sortedNodes[index]) sortedNodes[index] = [e];
                else sortedNodes[index].push(e);
            }
        });

        sortedNodes.forEach(function(e) {
            e.sort(function(a, b) {return (a.depth - b.depth)})
        });

        let minDepth = 1;
        let maxDepth = sortedNodes.length;

        let depthValues = d3.range(0, (maxDepth + 1 - minDepth) * 1.5, 1.5);
        let depthElementCount = [];
        depthValues.forEach(function (d, i) {
            depthElementCount[i] = 0;
        });

        bcRect = bcSvg.append('rect')
            .attr('class', 'content')
            .attr('opacity', 0.7)
            .style('fill', '#fff');

        let legendBG = bcSvg.append('rect')
            .attr('class', 'content')
            .attr('opacity', 0.7)
            .style('fill', 'rgb(220,220,220)')
            .style('stroke', '#000')
            .style('stroke-width', 1);

        bcG = bcSvg.append('g')
            .attr('id', 'bcGroup')
            .attr('class', 'content')
            .attr('transform', 'translate(' + bcPadding + ',' + bcPadding + ')');

        bcG.append('text')
            .attr('dy', '.35em')
            .attr('x', 0)
            .attr('y', bcHeight / 2)
            .attr('text-anchor', 'left')
            .style('fill', '#000')
            .style('font-size', bcHeight)
            .style('font-weight', 'bold')
            .text('Your Selection');

        let bcLegendGroup = bcG.append('g');

        let legendBCWidth = bcWidth * 1.5;

        bcLegendGroup.append('rect')
            .attr('width', legendBCWidth)
            .attr('height', bcHeight)
            .style('fill', '#fff')
            .style('stroke', '#000')
            .style('stroke-width', 1);

        bcLegendGroup.append('rect')
            .attr('width', bcHeight)
            .attr('height', bcHeight)
            .attr('x', legendBCWidth - bcHeight)
            .style('fill', '#fff')
            .style('stroke', '#000')
            .style('stroke-width', 1);

        bcLegendGroup.append('text')
            .attr('dy', '.35em')
            .attr('x', legendBCWidth / 2)
            .attr('y', bcHeight / 2)
            .attr('text-anchor', 'middle')
            .style('fill', '#000')
            .style('font-size', bcHeight / 2.5)
            .style('font-weight', 'bold')
            .text('Deselect Chapter');

        bcLegendGroup.append('image')
            .attr('xlink:href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADgElEQVRoQ+2agZENQRRF70aACBABIkAEiAARIAJEgAjYCBABIkAEiAARUKeqr+rq7Z7p7umZPz5dtbVb++f/eafvu++9nt0THck6ORIO/ZMgDyVdksT33a0WRd6H6G/sjkIqptZ3Sa8kPYqCfiPpvKQY5J6kZ5KuSfp6SMCSIkDcDSDPQ4BA8OWAAXon6bOkq4eE4N5TqQUA6YQSuUXwTyShyo89gxw6tqb715qd3X8cdv6FpE9Nd9ng4hSENLkY7vs0MTqeOBd+Bwip93YPaZXzCJ64LulbMLBz3+anOt0OvgCY1/HQwVVqSa2PSRUDiC+qG+ugKtWCEChl95eky0nKU5JJSTq+0xIFT0PV28Ah0+UXTxC8+waB0vxuTgTIe4CySrwXLwG1aokuKUIwLyVheHoFi52n4xMUr3uRXg/CJGDzb65SCYQUomOzw/FO2vQXot9TmjG8zX8/aaKbqFQCITjSIk0HjyXMYB5dYmVQCgUxPj+zIZuo1GJ2B1wyfWpqVLpVKNFWibSkNy32Ug9IjelTlQDKlWi8BAyfeSVcQ/qyCShZvXpASqafuikHMgdcaqSkM0CxSi7js0eEHhACzpm+dvfmzJ9TCYW4Z1GlXpAp09cCpSWawkI1jFeqEqNQ9qjdCzLV6WtB4uvYGIJOK6Gv4bXXAZQNOLOWgNj0DJJrjfUETbPlXvxMjyLFhoL0mL5FLUzPSESh+BD6UtH0SxSx6SmtDJKjZikCZzwi3ThOoEbpuP1nY5aC2PRFyRskQGFOoQT+M/jFc97sxywFsekZJvFK7yKNUAEYSiwws70jvtkIEHaNnew1Pan0JaQR85kfBDZtyggQB5KO97WB+FkZMJx1urw2AoSAMSNn/V7T+/xDGe+CGQVCjtOwak2PivaXlVsEMwqkxfSG5j0peDfMSJAa0+MHvEB5xQuM7kNgRoLUmJ5ZipEDH+AHKtQQmJEgc6Y3KH2C9GKh0BCY0SBTpudPEPQaPw+wyYfAjAYpmd6A8eOluM8shlkDxKanpzBmECSPW7mXy26uWS6CWQPEXvBpzmB3KqbYbpg1QGLT4wnKLeeJ2j+iTsH4MHem8a4FYk+QWijkNGuZv3LVbHMQH7r8CCh7PJ2hipXxAwf6UO5R7u7/8yGGgTsLwQtrpVZtCtVeh7JAMWVnx/y/BWQW+D/I7BZtfMHRKPIbzUAQQpxDgKEAAAAASUVORK5CYII=')
            .attr('width', bcHeight * 0.9)
            .attr('height', bcHeight * 0.9)
            .attr('transform', function () {
                return 'translate(' + 0 + ', ' + bcHeight * 0.05 + ')'
            });

        bcLegendGroup.attr('transform', 'translate(' + (bcGroupWidth - bcLegendGroup.node().getBBox().width) + ', 0)');

        legendBG.attr('height', bcHeight + 2 * bcPadding - 1)
            .attr('width', bcLegendGroup.node().getBBox().width + 2 * bcPadding - 0.5)
            .attr('x', bcGroupWidth - bcLegendGroup.node().getBBox().width)
            .attr('y', 0.5);

        bcG.selectAll('.breadCrumb')
            .data(sortedNodes)
            .enter()
            .append('g')
            .attr('class', 'breadCrumb')
            .each(function (d, i) {
                let bcRoot = d3.select(this);

                d.forEach(function(b) {
                    let depth = i;

                    if (depthElementCount[depth] === maxBC) {
                        depthElementCount[depth] = 0;
                        for (let i = depth; i <= depthValues.length - 1; i++) {
                            depthValues[i]++;
                        }
                    }

                    let row = depthValues[depth] + 1;
                    let column = depthElementCount[depth];

                    depthElementCount[depth]++;

                    let bc = bcRoot.append('g').on('click', function() {
                        addOrRemove(b);
                        drawSunburst(dataDocument, bubbleData);
                    });

                    bc.append('title')
                        .text(function() { return  b.data.name});

                    bc.append('path')
                        .attr('d', getBreadCrumbPath(false))
                        .attr('id', 'BcPath' + b.data.id)
                        .style('stroke', '#000')
                        .style('stroke-width', 1)
                        .style('cursor', 'pointer')
                        .style('fill', colorThresh(b.data[activeTopic]));//cColors(b.ancestors()[b.ancestors().length - 2].data.id));

                    bc.append('clipPath')
                        .attr('id', 'bcClip' + b.data.id)
                        .attr('class', 'bcClip')
                        .append('path')
                        .attr('d', getBreadCrumbPath(false));

                    bc.append('text')
                        .attr('x', bcWidth * 0.01)
                        .attr('y', bcHeight / 2)
                        .attr('dy', '.35em')
                        .attr('text-anchor', 'left')
                        .attr('clip-path', 'url(#bcClip' + b.data.id + ')')
                        .attr('pointer-events', 'none')
                        .style('cursor', 'pointer')
                        .style('stroke', '#ddd')
                        .style('stroke-width', 1)
                        .style('fill', '#fff')
                        .style('font-size', bcHeight / 2)
                        .style('font-weight', 'bold')
                        .text(function () {
                            return b.data.name
                        });

                    bc.attr('transform', 'translate(' + (column * (bcWidth + bcPadding)) + ', ' + (row * (bcHeight + bcPadding / 2) + bcPadding) + ')')
                        .style('opacity', 1);
                })
            });

        bcSvg.attr('viewBox', '0 0 ' + width + ' ' + (bcSvg.select('#bcGroup').node().getBBox().height + 2 * bcPadding));
        bcRect.attr('width', width).attr('height', (bcSvg.select('#bcGroup').node().getBBox().height + 2 * bcPadding));

    } else bcSvg.attr('viewBox', '0 0 ' + width + ' 10)');
};

/** BubbleChart-Function */
let BubbleContainer = document.getElementById('nav-tabContent'),
    buTextSvg = d3.select('#TContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid'),
    bubbleSvg = d3.select('#BUContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid'),
    bubbleSliderSvg = d3.select('#BUSliderContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid'),
    bubbleMinValue = null,
    selectedBubbles = [],
    lastPercentage = null,
    textField;

let bubbleGroup = null;
let bubbleData;
let keys;
let chapterID, parameter;

const getParameterName = function() {
    switch(activeTopic) {
        case 'worstSentenceLength':
            return 'length';
            break;
        case 'worstSentencePunctuation':
            return 'punctuation';
            break;
        case 'worstStopwordCount':
            return 'stopwords';
            break;
        case 'worstWordCount':
            return 'wordcount';
            break;
        default:
            return 'size';
            break;
    }
};


const drawBubbleChart = function() {
    if(sbSelection.length > 0) {
        chapterID = sbSelection[sbSelection.length -1].data.id;
        parameter = getParameterName();
        $.get( "/document/1/" + parameter + "?id=" + chapterID, function( data ) {
            keys = getKeys();
            bubbleData = data.sort(function (a, b) {
                return -(keys.value(a) - keys.value(b))
            });
            drawBubbles();
            let min = d3.min(bubbleData, function (d) {
                return keys.value(d)
            });
            let max = d3.max(bubbleData, function (d) {
                return keys.value(d)
            });

            drawBubbleSlider(min, max + 0.1);
        });
    } else {
        bubbleGroup = null;
        selectedBubbles = [];
        d3.selectAll('.buContent').remove();
        d3.selectAll('.buTextContent').remove();
    }
};

const getKeys = function() {
    switch(activeTopic) {
        case 'worstSentenceLength':
            return {value: function (element) { return element['length']},
                text: function (element) { return element['sentence']},
                color: function (element) { return element['length']},
                highlight: function(element) {text.highlight.completeSentence(element['sentenceID'])},
                id: function(element) {return element['sentenceID']}};
            break;
        case 'worstSentencePunctuation':
            return {value: function (element) { return element['count']},
                text: function (element) { return element['sentence']},
                color: function (element) { return element['count']},
                highlight: function(element) {text.highlight.list(chapterID, element['sentenceID'])},
                id: function(element) {return element['sentenceID']}};
            break;
        case 'worstStopwordCount':
            return {
                value: function (element) { return element['count']}, text: function (element) {
                    let path = '';
                    if (element.chaptername !== null) path += (element.chaptername + ' > ');
                    if (element.sectionname !== null) path += (element.sectionname + ' > ');
                    if (element.subsectionname !== null) path += (element.subsectionname + ' > ');
                    if (element.subsubsectionname !== null) path += (element.subsubsectionname + ' > ');
                    if (element.idInChapter !== null) path += ('Paragraph ' + element.idInChapter);
                    return path;
                }, color: function (element) { return element['normalized']}, //TODO: AENDERN AUF NORMALIZED WENN DA
                highlight: function(element) {text.highlight.list(chapterID, element['token'])},
                id: function(element) {return element['paragraphID']}
            };
            break;
        case 'worstWordCount':
            return {value: function (element) { return element['count']},
                text: function (element) { return element['word']},
                color: function (element) { return element['normalized']},
                highlight: function(element) {text.highlight.id(chapterID, element['word'])},
                id: function(element) {return element['word']}};
            break;
        default:
            return {value: function (element) { return element['size']}, text: function (element) { return element['name']}, color: function (element) { return element['size']}};
            break;
    }
};

const drawBubbles = function() {
    d3.selectAll('.buTextContent').remove();
    let buWidth = BubbleContainer.clientWidth * 0.95;
    let height = BubbleContainer.clientHeight * 0.85;

    let windowHeight = $(window).height();

    let buHeight = d3.min([height, windowHeight * 0.75]);

    bubbleSvg.attr('viewBox', '0 0 ' + buWidth + ' ' + buHeight);

    let buTextWidth = BubbleContainer.clientWidth;
    let buTextHeight = BubbleContainer.clientHeight * 0.15;

    buTextSvg.attr('viewBox', '0 0 ' + buTextWidth + ' ' + buTextHeight);

    let textFieldSpacing = buTextHeight * 0.2;
    let textFieldWidth = buTextWidth - 2 * textFieldSpacing;
    let textFieldHeight = buTextHeight - 2 * textFieldSpacing;
    let textFontSize = textFieldHeight / 4;

    let data = bubbleData;
    if (bubbleMinValue !== null) data = data.filter(function(d) {return keys.value(d) >= bubbleMinValue});

    if(data.length > 0) {
        buTextSvg.append('rect')
            .attr('class', 'buTextContent')
            .attr('width', textFieldWidth)
            .attr('height', textFieldHeight)
            .attr('x', textFieldSpacing)
            .attr('y', textFieldSpacing)
            .attr('opacity', 0.7)
            .style('fill', '#fff');

        textField = buTextSvg.append('text')
            .attr('x', buTextWidth / 2)
            .attr('y', buTextHeight / 2 + 2 - textFontSize / 2)
            .attr('dy', '.5em')
            .attr('class', 'buTextContent')
            .attr('font-size', textFontSize)
            .style('fill', '#000')
            .style('font-weight', 'bold')
            .style('text-anchor', 'middle')
            .text('. . .');

        let rootNode = {
            children: data
        };

        let buPack = d3.pack()
            .size([buWidth, buHeight-10])
            .padding(4);

        let buRoot = d3.hierarchy(rootNode)
            .sum(function (d) {
                return keys.value(d)
            });

        buPack(buRoot);

        buRoot.children = buRoot.children.filter(function(d){
            return d.r > 0
        });

        if (bubbleGroup === null) {
            bubbleGroup = bubbleSvg.append('g')
                .attr('class', 'buContent')
                .attr('transform', 'translate(0, 0)');
        }

        let bubbles = bubbleGroup.selectAll('.leafNode')
            .data(buRoot.leaves());

        bubbles.exit()
            .remove();

        bubbles.enter()
            .append('g')
            .attr('class', 'leafNode')
            .attr('transform', function (d) {
                return 'translate(' + d.x + ',' + d.y + ')'
            })
            .each(function (d) {
                let group = d3.select(this).style('cursor', 'pointer');

                group.append('clipPath')
                    .attr('class', 'buMask')
                    .append('circle')
                    .attr('class', 'maskCircle')
                    .attr('r', 0);

                group.append('circle')
                    .attr('r', 0)
                    .attr('class', 'leafCircle')
                    .attr('opacity', 0)
                    .style('fill', 'transparent')
                    .style('stroke', '#000')
                    .style('stroke-width', 1);

                let text = group.append('text')
                    .attr('dy', '.35em')
                    .attr('class', 'leafText')
                    .style('fill', '#fff')
                    .style('font-weight', 'bold')
                    .style('text-anchor', 'middle')
                    .text(' ');
            });

        adjustBubbleColor();
       // adjustBubbleOpacity();
        d3.selectAll('.leafNode')
            .each(function (d, i) {
                let self;
                let group = d3.select(this);

                group.transition()
                    .duration(500)
                    .attr('transform', 'translate(' + d.x + ', ' + d.y + ')');

                group.select('.buMask')
                    .attr('id', 'bubbleClip' + i);

                group.selectAll('.maskCircle')
                    .transition()
                    .duration(500)
                    .attr('r', d.r);

                group.selectAll('.leafCircle')
                    .each(function() {self = this})
                    .on('click', function () {
                        d3.selectAll('.activeCircle').classed('activeCircle', false).transition().duration(250).style('stroke-width', 1);
                        selectedBubbles = [];
                        selectedBubbles.push(d);
                        d3.select(this).classed('activeCircle', true).transition().duration(250).style('stroke-width', 3);
                        keys.highlight(d.data);
                        //adjustBubbleOpacity();
                    })
                    .transition()
                    .duration(500)
                    .style('fill', colorThresh(keys.color(d.data)))
                    .attr('r', d.r);

                group.select('.leafText')
                    .attr('clip-path', 'url(#bubbleClip' + i + ')')
                    .on('mouseenter', function () {
                        textField.text(keys.text(d.data) + ' (' + d3.format('.2f')(keys.value(d.data)) + ')');
                        textField.call(wrapY, textFieldWidth, textFieldSpacing + 2, true);

                        let radius = d3.max([d3.min([buWidth, buHeight]) / 10 - 1, d.r - 1]);

                        group.moveToFront();
                        group.selectAll('.maskCircle')
                            .transition()
                            .attr('r', radius);

                        group.selectAll('.leafCircle')
                            .transition()
                            .attr('r', d3.max([d3.min([buWidth, buHeight]) / 10, d.r]));

                        group.select('.leafText')
                            .transition()
                            .text(keys.text(d.data).substring(0, radius / 2));

                        group.append('text')
                            .attr('x', 0)
                            .attr('y', radius / 2)
                            .attr('dy', '.35em')
                            .attr('clip-path', 'url(#bubbleClip' + i + ')')
                            .attr('class', 'infoText')
                            .style('fill', '#fff')
                            .style('font-weight', 'bold')
                            .style('text-anchor', 'middle')
                            .text(d3.format('.2f')(keys.value(d.data) + '').substring(0, radius / 2));

                        group.transition().attr('opacity', 1);

                    }).on('mouseleave', function () {
                        textField.text('. . .');
                        textField.attr('y', buTextHeight / 2 + 2 - textFontSize / 2);
                        group.selectAll('.maskCircle')
                            .transition()
                            .attr('r', d.r - 1);

                        group.selectAll('.leafCircle')
                            .transition()
                            .attr('r', d.r);

                        group.select('.leafText')
                            .transition()
                            .text(keys.text(d.data).substring(0, d.r / 4));

                        group.select('.infoText').remove();

                        // group.transition().attr('opacity', (selectedBubbles.findIndex(function(val) {
                        //     return keys.text(val.data) === keys.text(d.data)
                        // }) === -1) ? 0.3 : 1);

                    }).on('click', function () {
                        d3.selectAll('.activeCircle').classed('activeCircle', false).transition().duration(250).style('stroke-width', 1);
                        selectedBubbles = [];
                        selectedBubbles.push(d);
                        d3.select(self).classed('activeCircle', true).transition().duration(250).style('stroke-width', 3);
                        keys.highlight(d.data);
                        //adjustBubbleOpacity();
                    })
                        .transition()
                        .duration(500)
                        .text(function (d) {
                            return keys.text(d.data).substring(0, d.r / 4)
                        });

                d3.selectAll('.activeCircle').classed('activeCircle', false).transition().duration(250).style('stroke-width', 1);

            });
    } else { d3.selectAll('.leafNode').remove() }
};

const adjustBubbleColor = function() {
    d3.selectAll('.leafNode circle')
        .transition(500)
        .attr('opacity', 1)
        .style('fill', function(d) {return colorThresh(keys.color(d.data))});
};

const adjustBubbleOpacity = function() {
    d3.selectAll('.leafNode')
        .attr('opacity', function(n) {
            let index = selectedBubbles.findIndex(function(val) {
                return keys.text(val.data) === keys.text(n.data)
            });
            return (index === -1) ? 0.3 : 1});
};

const drawBubbleSlider = function(min, max) {
    bubbleSliderSvg.select('.buContent').remove();

    let sliderWidth = BubbleContainer.clientWidth * 0.05;
    let height = BubbleContainer.clientHeight * 0.85;

    let windowHeight = $(window).height();

    let sliderHeight = d3.min([height, windowHeight * 0.75]);

    let spacing = sliderHeight / 10;
    let handleSize = sliderWidth / 5;
    let lineSize = sliderWidth / 6;
    let fontSize = sliderWidth / 4;

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
        .range(d3.range(min, max, step).reverse());

    buY.ticks(100);

    let buSlider = bubbleSliderSvg.append('g')
        .attr('class', 'buContent')
        .attr('transform', 'translate(' + handleSize * 1.1 + ', 0)');

    buSlider.append('text')
        .attr('id', 'buScaleText')
        .attr('x',  - handleSize)
        .attr('y', spacing - handleSize * 1.5)
        .attr('text-anchor', 'left')
        .attr('pointer-events', 'none')
        .style('font-size', fontSize  * 0.8 + 'px')
        .style('font-weight', 'bold')
        .text((lastPercentage !== null) ? 'Top ' + lastPercentage + '%' : 'Top 100%');

    buSlider.append('line')
        .attr('y1', buY.range()[0])
        .attr('y2', buY.range()[1])
        .style('stroke-linecap', 'round')
        .style('stroke', '#000')
        .style('stroke-width', handleSize + 'px')
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .style('stroke', '#fff')
        .style('stroke-width', lineSize + 'px')
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr('id', 'buTrack-overlay')
        .style('pointer-events', 'stroke')
        .style('stroke', 'transparent')
        .style('stroke-width', handleSize * 5 + 'px')
        .style('cursor', 'pointer')
        .call(d3.drag()
            .on('start drag', function() {
                let newText = Math.round(buY.invert(d3.event.y));
                buSlider.select('#buScaleText').text('Top ' + newText + '%');
                handle.attr('cy', buY(buY.invert(d3.event.y)));
            })
            .on('end', function() {
                bubbleMinValue = buScale(buY.invert(d3.event.y));
                lastPercentage =  Math.round(buY.invert(d3.event.y));
                drawBubbles();
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
        .text(function(d) { return d });

    let handle = buSlider.insert('circle', '#buTrack-overlay')
        .attr('class', 'handle')
        .attr('r', handleSize)
        .attr('cy', (lastPercentage !== null) ? buY(lastPercentage) : buY(100))
        .style('fill', '#ddd')
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

const wrapY = function(text, width, minY, saveLast) {
    text.each(function() {
        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            y = text.attr('y'),
            x = text.attr('x'),
            newY = y,
            fontSize = text.attr('font-size'),
            dy = parseFloat(text.attr('dy')),
            spans = [],
            tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
                newY -= fontSize / 2;
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                spans.push(tspan);
                spans.forEach(function(e) {
                    e.attr('y', newY);
                });
                if(newY - fontSize >= minY) {
                    tspan = text.append('tspan').attr('x', x).attr('y', newY).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
                } else {
                    if (saveLast) {
                        tspan = text.append('tspan').attr('x', x).attr('y', newY).attr('dy', ++lineNumber * lineHeight + dy + 'em').text('. . . ' + words[0]);
                    } else {
                        tspan = text.append('tspan').attr('x', x).attr('y', newY).attr('dy', ++lineNumber * lineHeight + dy + 'em').text('. . .');
                    }
                    words = [];
                }
            }
        }
    });
};

/** function to get a single arcs path */
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle){

    let start = polarToCartesian(x, y, radius, endAngle);
    let end = polarToCartesian(x, y, radius, startAngle);

    let largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    let d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');

    return d;
}
