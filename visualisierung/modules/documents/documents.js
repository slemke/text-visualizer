const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {

});

router.get('/:id', function(req, res) {

    // TODO read data from mongo
    let document = {
        id: 1,
        title: "Betriebssysteme",
        subtitle: "Ein Lehrbuch mit Übungen zur Systemprogrammierung in UNIX/Linux",
        authors: [
            { name: "Erich Ehses" },
            { name: "Lutz Köhler" },
            { name: "Petra Riemer" },
            { name: "Horst Stenzel" },
            { name: "Frank Victor" }
        ],
        released: 2005,
        isbn: "3-8273-7156-2",
        original: "",
        text: {}
    };


    res.json(document);
});

module.exports = router;
