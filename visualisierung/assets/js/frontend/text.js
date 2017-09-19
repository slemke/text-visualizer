let highlight = {
    text = function(token) {
        // highlight every token in text
    },
    chapter = function(id, token) {
        // highlight every token in chapter id
    },
    section = function(id, token) {
        // highlight every token in section id
    },
    subsection = function(id, token) {
        // highlight every token in subsection id
    },
    paragraph = function(id, token) {
        // highlight every token in paragraph id
    },
    sentence = function(id, token) {
        // highlight every token in sentence id
    },
    get = function(id) {
        // get text and update text-body
    },
    clear = function() {
        $('#text-body').html();
    }
};
