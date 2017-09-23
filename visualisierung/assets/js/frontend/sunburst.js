/**
 * Created by Dennis Dubbert on 11.09.17.
 */

let SBContainer = document.getElementById('nav-viz-tabContent'),
    SBSliderContainer = document.getElementById('SBSliderContainer'),
    HeaderContainer = document.getElementById('col-sm-12'),
    TreeContainer = document.getElementById('nav-viz-tabContent');

let sbSvg = d3.select('#SBContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');
let sbSliderSvg = d3.select('#SBSliderContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');
let treeSvg = d3.select('#TreeContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');
let treeLSvg = d3.select('#TreeLContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');

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
    z,
    z1,
    a1,
    sbSelection = [],
    innerRadius,
    textGroup,
    selectedRoot,
    lastSelectedChapter = null,
    dataDocument,
    cColors;


let chapterColors = [ '#0e6873', '#8c3c61', '#e98548', '#83c6dc', '#af6a40','#584337', '#a08562', '#8c9898', '#5f6d6e', '#87816c', '#b4aa92', '#7d7061', '#917359', '#7d6852', '#bba98b', '#a3906b'];
let colors = ['#9dd863', '#dddd77', '#F4A460', '#FA8072', '#A52A2A'];
let sliderScales = {size : [0, 10, 5, '%', d3.range(0,10.5,0.5).reverse()]};
let activeTopic = 'size';
let lastInformationText = ['Lastly (De-)Selected Chapter', '. . .', '. . .', 0.2];

const drawSunburst = function(chapter, buData) {
    removeAll();
    bubbleData = buData;
    dataDocument = chapter;
    initializeAndDrawSunburst(chapter);
    redrawTree(chapter);
    redrawLegend();
    redrawTreeLegend();
    redrawSlider();
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

    let width = TreeContainer.clientWidth * 0.95 * 0.9;
    let height = TreeContainer.clientHeight;

    treeSvg.attr('viewBox', '0 0 ' + width + ' ' + height);

    let nodeDepthCount = [];

    root.descendants().forEach(function(d) {
        (nodeDepthCount[d.depth]) ? nodeDepthCount[d.depth]++ : nodeDepthCount[d.depth] = 1;
    });

    let nodeDepthMaxAmount = d3.max(nodeDepthCount);

    let strokeWidth = 2;
    let maxStokeWidth = 6;
    let reduceAmount = nodeDepthMaxAmount * 2;
    let maxDepth = d3.max(root.leaves(), function(l) {return l.depth});
    let nodeWidth = (width - maxStokeWidth * 2) / (maxDepth * 1.5);
    let nodeHeight = (height - reduceAmount * strokeWidth * 2) / reduceAmount;

    let newRoot = d3.hierarchy(chapters, function(d) {return d.children});
    let tree = d3.tree().size([height, width - nodeWidth - 2 * maxStokeWidth])//.nodeSize([nodeHeight,nodeWidth])
        .separation(function(a, b) { return (a.parent === b.parent ? 1 : 2); });

    let treeNodes = tree(newRoot);

    treeSvg.append('rect')
        .attr('class', 'content')
        .attr('id', 'bgRect')
        .attr('width', width)
        .attr('height', height)
        .style('fill', '#fff')
        .style('cursor', 'pointer')
        .on('mouseenter', function() {
            if (!blockedMouseover) {
                updateInformationTexts();
                highlightChapter([]);
            }
        })
        .on('click', function() {
            sbSelection = [];
            selectedBubbles = [];
            blockedMouseover = false;
            lastSelectedChapter = null;

            highlightChapter([]);
            updateInformationTexts();
            highlightRoot();
            redrawBreadCrumbs();
        });

    let rootG = treeSvg.append('g')
        .attr('class', 'content');

    let links = rootG.selectAll('.link')
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
            if(!blockedMouseover) {
                sbSelection = sbSelection.concat(d.descendants());
                if (d.data.id !== root.descendants()[0].data.id) {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(d.descendants(), false)), d3.format('.2%')(getPercentage(d.descendants(), true)));
                    highlightRoot(sbSelection);
                } else {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(d.descendants(), false)));
                    highlightRoot();
                }
                highlightChapter(d.descendants());
                d.descendants().forEach(function(c) {
                    let index = sbSelection.findIndex(function(val) {
                        return val.data.id === c.data.id
                    });
                    sbSelection.splice(index, 1);
                });
            }
            else updateInformationTexts(d.data.name);
        })
        .on('mouseleave', function() {
            if(!blockedMouseover) highlightRoot();
            else if(lastSelectedChapter !== null) updateInformationTexts(lastSelectedChapter.data.name);
        })
        .on('click', function(d) {
            lastSelectedChapter = d;
            addOrRemove(d);
            redrawBreadCrumbs();
            highlightChapter(sbSelection);

            if(sbSelection.length > 0) {
                let differentRoots = [];

                sbSelection.forEach(function(e) {
                    let rootObject = e.ancestors()[e.ancestors().length - 2];
                    let index = differentRoots.findIndex(function (val) {
                        if (val && rootObject) {
                            return val.data.id === rootObject.data.id;
                        }
                    });
                    if(index === -1) differentRoots.push(rootObject);
                });

                if (sbSelection.length >= root.descendants().length - 1) {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(sbSelection, false)));
                    highlightRoot()
                } else if(differentRoots.length > 1) {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(sbSelection, false)), d3.format('.2%')(getPercentage(sbSelection, false)));
                    highlightRoot(sbSelection);
                } else {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(sbSelection, false)), d3.format('.2%')(getPercentage(sbSelection, true)));
                    highlightRoot(sbSelection)
                }

            } else {
                updateInformationTexts();
                highlightRoot();
            }
        });

    chapterNodes.append('path')
        .attr('class', 'treeSelected treePart')
        .attr('id', function (d) { return 'treeChapter' + d.data.id })
        .attr('d', getTreeNodePath(nodeWidth, nodeHeight))
        .attr('transform', 'translate(' + (-nodeWidth / 2) + ', ' + (-nodeHeight / 2) + ')')
        .style('stroke', '#000')
        .style('stroke-width', 2);

    chapterNodes.append('clipPath')
        .attr('id', function(d) {return 'treeClip' + d.data.id})
        .append('path')
        .attr('d', getTreeNodePath(nodeWidth - 4, nodeHeight - 4))
        .attr('transform', 'translate(' + (-nodeWidth / 2 - 2) + ', ' + (-nodeHeight / 2) + ')');

    chapterNodes.append('text')
        .text(function(d) {return d.data.name})
        .attr('clip-path', function(d) {return 'url(#treeClip' + d.data.id + ')'})
        .attr('class', 'textSelected treeText')
        .attr('id', function(d) {return 'treeText' + d.data.id})
        .attr('x', (-nodeWidth / 2) * 0.95)
        .attr('y', 0)
        .attr('dy', '.35em')
        .style('fill', '#000')
        .style('font-size', nodeHeight / 2)
        .style('font-weight', 'bold');

    changeColorForPercentage();

    rootG.attr('transform', 'translate(' + (nodeWidth / 2 + maxStokeWidth) + ', 0)');

    if(sbSelection.length > 0) {
        redrawBreadCrumbs();
        highlightChapter(sbSelection);
        highlightRoot(sbSelection);
    } else {
        sbSelection = [];
        redrawBreadCrumbs();
        highlightChapter([]);
    }
};

const redrawTreeLegend = function() {
    treeLSvg.selectAll('.content').remove();

    let lWidth = TreeContainer.clientWidth * 0.95 * 0.1;
    let lHeight = TreeContainer.clientHeight;

    let size = d3.min([lWidth / 2, lHeight / 22 ]);
    let spacing = size / 5;

    treeLSvg.attr('viewBox', '0 0 ' + lWidth + ' ' + lHeight);

    treeLSvg.append('rect')
        .attr('class', 'content')
        .attr('width', lWidth)
        .attr('height', lHeight)
        .attr('opacity', 0.7)
        .style('fill', 'rgb(220,220,220)')
        .style('stroke', '#000')
        .style('stroke-width', 2);

    let rootG = treeLSvg.append('g')
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
        .text('Color = Worst Value Of The Chapter / Average Of Sub - Chapters:')
        .attr('x', lWidth / 2)
        .attr('y', legend.node().getBBox().height)
        .attr('dy', '.8em')
        .attr('font-size', size / 3.1)
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
            .style('stroke-width', 2)
            .each(function() {
                const band = sliderScales[activeTopic][2] / (colors.length - 1);

                let lGText = treeLSvg.select('#legendSubGroup' + i )
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

                treeLSvg.select('#legendSubGroup' + i).append('rect')
                    .attr('y', gheight + size + lGText.node().getBBox().height)
                    .attr('width', lWidth)
                    .attr('height', spacing)
                    .style('fill', 'transparent');
            });
    });

    treeLSvg.select('rect').attr('height', rootG.node().getBBox().height + 2 * spacing).attr('transform', 'translate(0, ' + ((lHeight / 2) - (rootG.node().getBBox().height / 2) - spacing) + ')');
    rootG.attr('transform', 'translate(0, ' + ((lHeight / 2) - (rootG.node().getBBox().height / 2)) + ')');
};

/** All functions for the sunburst */

const initializeAndDrawSunburst = function(chapter) {
    let headerW = HeaderContainer.clientWidth;
    let headerH = HeaderContainer.clientHeight;

    d3.select('#col-sm-12').append('svg')
        .attr('class', 'content')
        .attr('width', headerW * 0.75)
        .attr('height', headerH)
        .append('text')
        .attr('x', headerW / 2)
        .attr('y', headerH / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .style('font-size', headerH * 0.9)
        .style('font-weight', 'bold')
        .text('Navigation');

    /*** Draw sunburst and its components (texts, circles etc.) */
    let sbWidth = SBContainer.clientWidth * 0.95 * 0.9;
    let sbHeight = SBContainer.clientHeight;
    chartSize = d3.min([sbWidth,sbHeight]);

    sbSvg.attr('viewBox', '0 0 ' + sbWidth + ' ' + sbHeight);

    root = d3.hierarchy(chapter)
        .sum(function (d) { return d.size});

    let maxDepth = d3.max(root.leaves(), function(d) {return d.depth});
    innerRadius = chartSize / 5;
    let radius = chartSize / 2;
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
        .attr('height', sbHeight)
        .style('fill', '#fff')
        .style('cursor', 'pointer')
        .on('mouseenter', function() {
            if (!blockedMouseover) {
                updateInformationTexts();
                highlightChapter([]);
            }
        })
        .on('click', function() {
            sbSelection = [];
            selectedBubbles = [];
            blockedMouseover = false;
            lastSelectedChapter = null;

            highlightChapter([]);
            updateInformationTexts();
            highlightRoot();
            redrawBreadCrumbs();
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
        .style('cursor', 'pointer')
        .attr('d', arc)
        .style('stroke', '#000')
        .on('mouseenter', function(d) {
            if(!blockedMouseover) {
                sbSelection = sbSelection.concat(d.descendants());
                if (d.data.id !== root.descendants()[0].data.id) {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(d.descendants(), false)), d3.format('.2%')(getPercentage(d.descendants(), true)));
                    highlightRoot(sbSelection);
                } else {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(d.descendants(), false)));
                    highlightRoot();
                }
                highlightChapter(d.descendants());
                d.descendants().forEach(function(c) {
                    let index = sbSelection.findIndex(function(val) {
                        return val.data.id === c.data.id
                    });
                    sbSelection.splice(index, 1);
                });
            }
            else updateInformationTexts(d.data.name);
        })
        .on('mouseleave', function() {
            if(!blockedMouseover) highlightRoot();
            else if(lastSelectedChapter !== null) updateInformationTexts(lastSelectedChapter.data.name);
        })
        .on('click', function(d) {
            lastSelectedChapter = d;
            addOrRemove(d);
            redrawBreadCrumbs();
            highlightChapter(sbSelection);

            if(sbSelection.length > 0) {
                let differentRoots = [];

                sbSelection.forEach(function(e) {
                    let rootObject = e.ancestors()[e.ancestors().length - 2];
                    let index = differentRoots.findIndex(function (val) {
                        if (val && rootObject) {
                            return val.data.id === rootObject.data.id;
                        }
                    });
                    if(index === -1) differentRoots.push(rootObject);
                });

                if (sbSelection.length >= root.descendants().length - 1) {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(sbSelection, false)));
                    highlightRoot()
                } else if(differentRoots.length > 1) {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(sbSelection, false)), d3.format('.2%')(getPercentage(sbSelection, false)));
                    highlightRoot(sbSelection);
                } else {
                    updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(sbSelection, false)), d3.format('.2%')(getPercentage(sbSelection, true)));
                    highlightRoot(sbSelection)
                }

            } else {
                updateInformationTexts();
                highlightRoot();
            }
        });

    changeColorForPercentage();

    textGroup = sbSvg.append('g')
        .attr('class', 'content')
        .attr('transform', 'translate(' + sbWidth / 2 + ', ' + (sbHeight / 2 - innerRadius) + ')')
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
        .attr('font-size', fontSize)
        .attr('font-weight', 'bold')
        .attr('dy', '.35em')
        .attr('pointer-events', 'none')
        .attr('clip-path', 'url(#sbTextClip)');

    p.call(wrapY, innerRadius, innerRadius / 5);

    z = textGroup.append('text')
        .text('Size Compared To Marked Parent:')
        .attr('x', -innerRadius / 2)
        .attr('y', innerRadius * 0.9)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize * 0.9)
        .attr('dy', '.35em')
        .attr('font-weight', 'bold')
        .attr('pointer-events', 'none');

    z.call(wrap, innerRadius);

    z1 = textGroup.append('text')
        .text('Size Compared To Whole Document:')
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

    appendCircles(chartSize);

    if(sbSelection.length > 0) {
        redrawBreadCrumbs();
        highlightChapter(sbSelection);
        highlightRoot(sbSelection);
    } else {
        sbSelection = [];
        redrawBreadCrumbs();
        highlightChapter([]);
    }

};

const highlightRoot = function(selection) {
    if (selectedRoot) {
        if(selectedRoot.parent) {
            d3.select('#chapter' + selectedRoot.parent.data.id).style('stroke-width', 1);
            d3.select('#treeChapter' + selectedRoot.parent.data.id).style('stroke-width', 2);
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
                    rootNode.style('stroke-width', 4);
                    let treeRootNode = d3.select('#treeChapter' + selectedRoot.parent.data.id);
                    treeRootNode.style('stroke-width', 6);
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
                            rootNode.style('stroke-width', 4);
                            let treeRootNode = d3.select('#treeChapter' + selectedRoot.parent.data.id);
                            treeRootNode.style('stroke-width', 6);
                            d3.select(rootNode.node().parentNode).moveToFront();
                        }
                    }
                }
            } else {
                d3.select('#chapter' + root.descendants()[0].data.id).style('stroke-width', 1);
                d3.select('#treeChapter' + root.descendants()[0].data.id).style('stroke-width', 1);
            }
        }
    }

};

const addOrRemove = function(chapter) {
    if(chapter.data.id === root.descendants()[0].data.id && sbSelection.length >= root.descendants().length - 1) {
        sbSelection = [];
    } else {
        let indexD = sbSelection.findIndex(function (val) {
            return val.data.id === chapter.data.id
        });

        chapter.descendants().forEach(function (n) {
            let indexN = sbSelection.findIndex(function (val) {
                return val.data.id === n.data.id
            });
            (indexD === -1) ? (indexN === -1) ? sbSelection.push(n) : {} : (indexN === -1) ? {} : sbSelection.splice(indexN, 1);
        });

        let ancestors = chapter.ancestors().filter(function (d) {
            return d.depth > 0
        });
        ancestors.splice(0, 1);
        if (indexD === -1) {
            ancestors.forEach(function (n) {
                let indexN = sbSelection.findIndex(function (val) {
                    return val.data.id === n.data.id
                });
                (indexN === -1) ? sbSelection.push(n) : {};
            });
        } else {
            if (chapter.depth === 1) {
                let indexR = sbSelection.findIndex(function (val) {
                    return val.data.id === root.descendants()[0].data.id
                });

                if (indexR !== -1) sbSelection.splice(indexR, 1);
            }

            ancestors.forEach(function (d) {
                let childSelected = false;
                let descendants = d.children;
                descendants.forEach(function (c) {
                    let index = sbSelection.findIndex(function (val) {
                        return val.data.id === c.data.id
                    });
                    if (index !== -1) childSelected = true;
                });
                if (!childSelected) {
                    let index = sbSelection.findIndex(function (val) {
                        return val.data.id === d.data.id
                    });
                    sbSelection.splice(index, 1);
                }
            });
        }
    }

    (sbSelection.length > 0) ? blockedMouseover = true : blockedMouseover = false;
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
//TODO:
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
                    .style('cursor', 'pointer')
                    .on('click', function(d) {
                        lastSelectedChapter = d;
                        addOrRemove(d);
                        redrawBreadCrumbs();
                        highlightChapter(sbSelection);

                        if(sbSelection.length > 0) {
                            let differentRoots = [];

                            sbSelection.forEach(function(e) {
                                let rootObject = e.ancestors()[e.ancestors().length - 2];
                                let index = differentRoots.findIndex(function (val) {
                                    if (val && rootObject) {
                                        return val.data.id === rootObject.data.id;
                                    }
                                });
                                if(index === -1) differentRoots.push(rootObject);
                            });

                            if (sbSelection.length >= root.descendants().length - 1) {
                                updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(sbSelection, false)));
                                highlightRoot()
                            } else if(differentRoots.length > 1) {
                                updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(sbSelection, false)), d3.format('.2%')(getPercentage(sbSelection, false)));
                                highlightRoot(sbSelection);
                            } else {
                                updateInformationTexts(d.data.name, d3.format('.2%')(getPercentage(sbSelection, false)), d3.format('.2%')(getPercentage(sbSelection, true)));
                                highlightRoot(sbSelection)
                            }

                        } else {
                            updateInformationTexts();
                            highlightRoot();
                        }
                    });
            }
        });
};

const removeAll = function() {
    d3.selectAll('.content').remove();
};

const highlightChapter = function(chapters) {
    chapters.sort(function(a, b) {return -(a.depth - b.depth)});
    d3.selectAll('.sunburstPart')
        .filter('.sunburstSelected')
        .classed('sunburstSelected', false)
        .style('opacity', 0.2);

    d3.selectAll('.treePart')
        .filter('.treeSelected')
        .classed('treeSelected', false)
        .style('opacity', 0.2);

    d3.selectAll('.link')
        .filter('.linkSelected')
        .classed('linkSelected', false)
        .style('opacity', 0.2);

    d3.selectAll('.treeText')
        .filter('.textSelected')
        .classed('textSelected', false)
        .style('opacity', 0.2);

    chapters.forEach(function(e) {
        d3.select('#chapter' + e.data.id).classed('sunburstSelected', true).style('opacity', 1);
        d3.select('#circle' + e.data.id).classed('sunburstSelected', true).style('opacity', 1);
        d3.select('#treeChapter' + e.data.id).classed('treeSelected', true).style('opacity', 1);
        d3.select('#treeText' + e.data.id).classed('textSelected', true).style('opacity', 1);
        //d3.select('#treeCircle' + e.data.id).classed('treeSelected', true).style('opacity', 1);

        if(e.children) {
            e.children.forEach(function(c) {
                if (chapters.findIndex(function(val) {return val.data.id === c.data.id}) !== -1) {
                    d3.select('#link' + c.data.id).classed('linkSelected', true).style('opacity', 1);
                }
            });
        }
    });

    if(root.children) {
        root.children.forEach(function(c) {
            if (sbSelection.findIndex(function(val) {return val.data.id === c.data.id}) !== -1) {
                d3.select('#link' + c.data.id).classed('linkSelected', true).style('opacity', 1);
                d3.select('#treeChapter' + root.descendants()[0].data.id).classed('treeSelected', true).style('opacity', 1);
                d3.select('#treeText' + root.descendants()[0].data.id).classed('textSelected', true).style('opacity', 1);
            }
        })
    }
};

const updateInformationTexts = function(name, amountAll, amountParent) {
    if(name) {
        textGroup.attr('opacity', 1);
        p.text(name).attr('y', innerRadius / 2);
        p.call(wrapY, innerRadius, innerRadius / 5);
    }
    if (amountAll) {

        if (amountParent) {
            a.text(amountParent);
            lastInformationText[1] = amountParent;
        } else {
            a.text('. . .');
            lastInformationText[1] = '. . .';
        }
        a1.text(amountAll);
        z.text('Size Compared To Marked Parent:');
        z1.text('Size Compared To Whole Document:');
        z.call(wrap, innerRadius);
        z1.call(wrap, innerRadius);

        lastInformationText[0] = name;
        lastInformationText[2] = amountAll;
        lastInformationText[3] = 1;
    } else if (!name && !amountAll) {
        textGroup.attr('opacity', 0.2);
        p.text('Lastly (De-)Selected Chapter')
            .attr('y', innerRadius / 2);
        p.call(wrapY, innerRadius, innerRadius / 5);
        a.text('. . .');
        a1.text('. . .');

        lastInformationText[0] = 'Lastly (De-)Selected Chapter';
        lastInformationText[1] = '. . .';
        lastInformationText[2] = '. . .';
        lastInformationText[3] = 0.2;
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
        .range([spacing + 10, sliderHeight - spacing + 10])
        .clamp(true);

    let scale = d3.scaleQuantize()
        .domain([spacing + 10, sliderHeight - spacing + 10])
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
                drawBubbles();
                redrawLegend();
                redrawBreadCrumbs();
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

/** legend function */
let LContainer = document.getElementById('nav-viz-tabContent');
let lSvg = d3.select('#LContainer').append('svg').attr('id', 'legendSvg').attr('preserveAspectRatio', 'xMidYMid');

const redrawLegend = function() {
    lSvg.selectAll('.content').remove();

    let lWidth = LContainer.clientWidth * 0.95 * 0.1;
    let lHeight = LContainer.clientHeight;

    let size = d3.min([lWidth / 2, lHeight / 22 ]);
    let spacing = size / 5;

    lSvg.attr('viewBox', '0 0 ' + lWidth + ' ' + lHeight);

    lSvg.append('rect')
        .attr('class', 'content')
        .attr('width', lWidth)
        .attr('height', lHeight)
        .attr('opacity', 0.7)
        .style('fill', 'rgb(220,220,220)')
        .style('stroke', '#000')
        .style('stroke-width', 2);

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
        .text('Color = Worst Value Of The Chapter / Average Of Sub - Chapters:')
        .attr('x', lWidth / 2)
        .attr('y', legend.node().getBBox().height)
        .attr('dy', '.8em')
        .attr('font-size', size / 3.1)
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
            .style('stroke-width', 2)
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
    let arc2 = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });

    let subG2 = subG.append('g')
        .attr('transform', 'translate(' + (lWidth / 2 ) + ', ' + (size / 2 + rootG.node().getBBox().height) + ')')
        .attr('id', 'legendSubG2');

    let subG2G1 = subG2.append('g');

    subG2G1.append('path')
        .attr('d', arc2(path))
        .style('fill', '#fff')
        .style('stroke', '#000')
        .style('stroke-width', 2);

    let subG2G1Text = subG2G1.append('text')
        .text('Size Of Chapter Compared To Parent Chapter')
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
        .attr('d', arc2(path))
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

    let outsideText = subG2G3.append('text')
        .text('Click Outside: Reset Selection')
        .attr('x', 0)
        .attr('y', singleText.node().getBBox().height + spacing)
        .attr('dy', '1em')
        .attr('font-size', size / 3)
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none')
        .style('fill', '#000')
        .style('font-weight', 'bold')
        .classed('legendText', true);

    outsideText.call(wrap, lWidth);

    lSvg.select('rect').attr('height', rootG.node().getBBox().height + 2 * spacing).attr('transform', 'translate(0, ' + ((lHeight / 2) - (rootG.node().getBBox().height / 2) - spacing) + ')');
    rootG.attr('transform', 'translate(0, ' + ((lHeight / 2) - (rootG.node().getBBox().height / 2)) + ')');
};

/** All functions for the breadcrumbs */

let BCContainer = document.getElementById('BCContainer');
let bcSvg = d3.select('#BCContainer').append('svg').attr('preserveAspectRatio', 'xMidYMid');

let bcRect,
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

const redrawBreadCrumbs = function() {
    bcSvg.selectAll('.content').remove();
    let width = BCContainer.clientWidth;

    if (sbSelection.length > 0) {

        bcPadding = width / 50;
        bcGroupWidth = width - 2 * bcPadding;

        bcWidth = (bcGroupWidth - ((maxBC - 1) * bcPadding)) / (maxBC);
        bcHeight = bcWidth / 5;

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

        let depthValues = d3.range(0, (maxDepth + 1 - minDepth) * 2, 2);
        let depthElementCount = [];
        depthValues.forEach(function (d, i) {
            depthElementCount[i] = 0;
        });

        bcRect = bcSvg.append('rect')
            .attr('class', 'content')
            .attr('opacity', 0.7)
            .style('fill', '#fff')
            .style('stroke', '#000')
            .style('stroke-width', 2);

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

        let rectSize = chartSize / 100;

        let bcLegendGroup = bcG.append('g');

        let legendBCWidth = bcWidth * 1.5;

        bcLegendGroup.append('rect')
            .attr('width', legendBCWidth)
            .attr('height', bcHeight)
            .style('fill', '#fff')
            .style('stroke', '#000')
            .style('stroke-width', 2);

        bcLegendGroup.append('rect')
            .attr('width', bcHeight)
            .attr('height', bcHeight)
            .attr('x', legendBCWidth - bcHeight)
            .style('fill', '#fff')
            .style('stroke', '#000')
            .style('stroke-width', 2);

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

                    if (depthElementCount[depth] === 5) {
                        depthElementCount[depth] = 0;
                        for (let i = depth; i <= depthValues.length - 1; i++) {
                            depthValues[i]++;
                        }
                    }

                    let row = depthValues[depth] + 1;
                    let column = depthElementCount[depth];

                    depthElementCount[depth]++;

                    let bc = bcRoot.append('g').on('click', function() {
                        lastSelectedChapter = b;
                        addOrRemove(b);
                        if(sbSelection.length > 0) {
                            let differentRoots = [];

                            sbSelection.forEach(function(e) {
                                let rootObject = e.ancestors()[e.ancestors().length - 2];
                                let index = differentRoots.findIndex(function (val) {
                                    if (val && rootObject) {
                                        return val.data.id === rootObject.data.id;
                                    }
                                });
                                if(index === -1) differentRoots.push(rootObject);
                            });

                            if (sbSelection.length >= root.descendants().length - 1 && sbSelection.findIndex(function(val) {return val.data.id === root.descendants()[0].data.id}) === -1) {
                                updateInformationTexts(b.data.name, d3.format('.2%')(getPercentage(sbSelection, false)));
                                highlightRoot()
                            } else if(differentRoots.length > 1) {
                                updateInformationTexts(b.data.name, d3.format('.2%')(getPercentage(sbSelection, false)), d3.format('.2%')(getPercentage(sbSelection, false)));
                                highlightRoot(sbSelection);
                            } else {
                                updateInformationTexts(b.data.name, d3.format('.2%')(getPercentage(sbSelection, false)), d3.format('.2%')(getPercentage(sbSelection, true)));
                                highlightRoot(sbSelection)
                            }

                        } else {
                            updateInformationTexts();
                            highlightRoot();
                        }

                        drawSunburst(dataDocument, bubbleData);
                    });

                    bc.append('path')
                        .attr('d', getBreadCrumbPath(false))
                        .attr('id', 'BcPath' + b.data.id)
                        .style('stroke', '#000')
                        .style('stroke-width', 2)
                        .style('cursor', 'pointer')
                        .style('fill', cColors(b.ancestors()[b.ancestors().length - 2].data.id));

                    bc.append('clipPath')
                        .attr('id', 'bcClip' + b.data.id)
                        .attr('class', 'bcClip')
                        .append('path')
                        .attr('d', getBreadCrumbPath(true));

                    bc.append('text')
                        .attr('x', bcWidth * 0.01)
                        .attr('y', bcHeight / 2)
                        .attr('dy', '.35em')
                        .attr('text-anchor', 'left')
                        .attr('clip-path', 'url(#bcClip' + b.data.id + ')')
                        .attr('pointer-events', 'none')
                        .style('cursor', 'pointer')
                        .style('stroke', '#ddd')
                        .style('stroke-width', 0.5)
                        .style('fill', '#fff')
                        .style('font-size', bcHeight / 2)
                        .style('font-weight', 'bold')
                        .text(function () {
                            return b.data.name
                        });

                    let rectG = bc.append('g').attr('transform', 'translate(' + (bcWidth - bcHeight) + ', 0)').style('cursor', 'pointer');

                    rectG.append('rect')
                        .attr('width', bcHeight)
                        .attr('height', bcHeight)
                        .style('fill', getColorForChapter(b))
                        .style('stroke', '#000')
                        .style('stroke-width', 2);

                    if (b.data.children) {
                        rectG.append('rect')
                            .attr('width', rectSize)
                            .attr('height', rectSize)
                            .style('fill', '#fff')
                            .style('stroke', '#000')
                            .style('stroke-width', 2)
                            .attr('transform', 'translate(' + (bcHeight / 2 - rectSize / 2) + ', ' + (bcHeight / 2 - rectSize / 2) + ')');
                    }

                    bc.attr('transform', 'translate(' + (column * (bcWidth + bcPadding)) + ', ' + (row * (bcHeight + bcPadding / 2) + bcPadding) + ')')
                        .style('opacity', 1);
                })
            });

        bcSvg.attr('viewBox', '0 0 ' + width + ' ' + (bcSvg.select('#bcGroup').node().getBBox().height + 2 * bcPadding));
        bcRect.attr('width', width).attr('height', (bcSvg.select('#bcGroup').node().getBBox().height + 2 * bcPadding));

    } else bcSvg.attr('viewBox', '0 0 ' + width + ' 10)');

    drawBubbleChart();
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
let bubbleKey = 'amount';

const drawBubbleChart = function() {
    if(sbSelection.length > 0) {
        drawBubbles();
        let min = d3.min(bubbleData, function (d) {
            return d[bubbleKey]
        });
        let max = d3.max(bubbleData, function (d) {
            return d[bubbleKey]
        });
        drawBubbleSlider(min, max + 0.1);
    } else {
        bubbleGroup = null;
        selectedBubbles = [];
        d3.selectAll('.buContent').remove();
        d3.selectAll('.buTextContent').remove();
    }
};

const drawBubbles = function() {
    d3.selectAll('.buTextContent').remove();
    let buWidth = BubbleContainer.clientWidth * 0.95;
    let buHeight = BubbleContainer.clientHeight * 0.90;

    bubbleSvg.attr('viewBox', '0 0 ' + buWidth + ' ' + buHeight);

    let buTextWidth = BubbleContainer.clientWidth;
    let buTextHeight = BubbleContainer.clientHeight * 0.1;
    buTextSvg.attr('viewBox', '0 0 ' + buTextWidth + ' ' + buTextHeight);

    let textFieldSpacing = buTextHeight * 0.2;
    let textFieldWidth = buTextWidth - 2 * textFieldSpacing;
    let textFieldHeight = buTextHeight - 2 * textFieldSpacing;
    let textFontSize = textFieldHeight / 4;

    let data = bubbleData;
    if (bubbleMinValue !== null) data = data.filter(function(d) {return d[bubbleKey] >= bubbleMinValue});

    if(data.length > 0) {
        buTextSvg.append('rect')
            .attr('class', 'buTextContent')
            .attr('width', textFieldWidth)
            .attr('height', textFieldHeight)
            .attr('x', textFieldSpacing)
            .attr('y', textFieldSpacing)
            .attr('opacity', 0.7)
            .style('fill', '#fff')
            .style('stroke', '#000')
            .style('stroke-width', 1);

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

        if (bubbleMinValue === null) {
            bubbleData.sort(function (a, b) {
                return -(a[bubbleKey] - b[bubbleKey])
            });
        }

        let rootNode = {
            children: data
        };

        let buPack = d3.pack()
            .size([buWidth, buHeight])
            .padding(4);

        let buRoot = d3.hierarchy(rootNode)
            .sum(function (d) {
                return d[bubbleKey]
            });

        buPack(buRoot);

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
            .each(function () {
                let group = d3.select(this).style('cursor', 'pointer');

                group.append('clipPath')
                    .attr('class', 'buMask')
                    .append('circle')
                    .attr('class', 'maskCircle')
                    .attr('r', 0);

                group.append('circle')
                    .attr('r', 0)
                    .attr('class', 'leafCircle')
                    .style('stroke', '#000')
                    .style('stroke-width', 2);

                let text = group.append('text')
                    .attr('dy', '.35em')
                    .attr('class', 'leafText')
                    .style('fill', '#fff')
                    .style('font-weight', 'bold')
                    .style('text-anchor', 'middle')
                    .text(' ');
            });

        adjustBubbleColor();
        adjustBubbleOpacity();

        d3.selectAll('.leafNode')
            .each(function (d, i) {
                let group = d3.select(this);

                group.transition()
                    .duration(500)
                    .attr('transform', 'translate(' + d.x + ', ' + d.y + ')');

                group.select('.buMask')
                    .attr('id', 'bubbleClip' + i);

                group.selectAll('.maskCircle')
                    .transition()
                    .duration(500)
                    .attr('r', d.r - 1);

                group.selectAll('.leafCircle')
                    .on('click', function () {
                        let index = selectedBubbles.findIndex(function (val) {
                            return val.data.name === d.data.name
                        });
                        (index !== -1) ? selectedBubbles.splice(index, 1) : selectedBubbles.push(d);
                        adjustBubbleOpacity();
                    })
                    .transition()
                    .duration(500)
                    .style('fill', colorThresh(d.data[bubbleKey]))
                    .attr('r', d.r);

                group.select('.leafText')
                    .attr('clip-path', 'url(#bubbleClip' + i + ')')
                    .on('mouseenter', function () {

                        textField.text(d.data.name + ' (' + d.data[bubbleKey] + ')');
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
                            .text(d.data.name.substring(0, radius / 2));

                        group.append('text')
                            .attr('x', 0)
                            .attr('y', radius / 2)
                            .attr('dy', '.35em')
                            .attr('clip-path', 'url(#bubbleClip' + i + ')')
                            .attr('class', 'infoText')
                            .style('fill', '#fff')
                            .style('font-weight', 'bold')
                            .style('text-anchor', 'middle')
                            .text((d.data[bubbleKey] + '').substring(0, radius / 2));

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
                            .text(d.data.name.substring(0, d.r / 4));

                        group.select('.infoText').remove();

                        group.transition().attr('opacity', (selectedBubbles.findIndex(function(val) {
                            return val.data.name === d.data.name
                        }) === -1) ? 0.2 : 1);

                    }).on('click', function () {
                        let index = selectedBubbles.findIndex(function (val) {
                            return val.data.name === d.data.name
                        });
                        (index !== -1) ? selectedBubbles.splice(index, 1) : selectedBubbles.push(d);
                        adjustBubbleOpacity();
                    })
                        .transition()
                        .duration(500)
                        .text(function (d) {
                            return d.data.name.substring(0, d.r / 4)
                        });
            });
    } else { d3.selectAll('.leafNode').remove() }
};

const adjustBubbleColor = function() {
    d3.selectAll('.leafNode circle')
        .transition()
        .style('fill', function(d) {return colorThresh(d.data[bubbleKey])});
};

const adjustBubbleOpacity = function() {
    d3.selectAll('.leafNode')
        .attr('opacity', function(n) {
            let index = selectedBubbles.findIndex(function(val) {
                return val.data.name === n.data.name
            });
            return (index === -1) ? 0.2 : 1});
};

const drawBubbleSlider = function(min, max) {
    bubbleSliderSvg.select('.buContent').remove();

    let sliderWidth = BubbleContainer.clientWidth * 0.05;
    let sliderHeight = BubbleContainer.clientHeight * 0.93;
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