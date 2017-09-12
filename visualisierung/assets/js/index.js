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

    setup(800, 800, chapter);
    draw();
    appendCircles();
});
