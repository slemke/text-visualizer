"use strict"

$(document).ready(function() {
    var instance = Split(['#visualization', '#text'], {
        sizes: [60, 40]
    });

    var textClosed = false;

    $('#collapse-text-button').click(function(event) {
        event.preventDefault();

        if(textClosed) {
            instance.setSizes([60, 40]);
            textClosed = false;
            $(this).html('&raquo;');
        } else {
            instance.collapse(1);
            textClosed = true;
            $(this).html('&laquo;');
        }
    });

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

    const initializeCharts = function() {
        drawSunburst(chapter);
    };

    initializeCharts();

    $(window).resize(function() {
            console.log('sdfgjadskhfgkdasfg');
            initializeCharts()
    });

});
