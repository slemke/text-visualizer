let text = {
    highlight : {
        text : function(token) {
            // highlight every token in text
            $('.highlight').removeClass('highlight');
            $('span[data-token="' + token + '"]').addClass('highlight');
        },
        chapter : function(id, token) {
            // highlight every token in chapter id
            $('.highlight').removeClass('highlight');
            $('#chapter-' + id + ' span[data-token="' + token + '"]').addClass('highlight');

            this.scroll(id);
        },
        section : function(id, token) {
            // highlight every token in section id
            $('.highlight').removeClass('highlight');
            $('#section-' + id + ' span[data-token="' + token + '"]').addClass('highlight');

            this.scroll(id);
        },
        subsection : function(id, token) {
            // highlight every token in subsection id
            $('.highlight').removeClass('highlight');
            $('#subsection-' + id + ' span[data-token="' + token + '"]').addClass('highlight');

            this.scroll(id);
        },
        paragraph : function(id, token) {
            $('.highlight').removeClass('highlight');
            $('#paragraph-' + id + ' span[data-token="' + token + '"]').addClass('highlight');

            this.scroll(id);
        },
        sentence : function(id, token) {
            $('.highlight').removeClass('highlight');
            $('#sentence-' + id + ' span[data-token="' + token + '"]').addClass('highlight');

            this.scroll(id);
        },
        completeSentence : function(id) {
            $('.highlight').removeClass('highlight');
            $('#sentence-' + id).addClass('highlight');

            this.scroll(id);
        },
        id : function(id, token) {
            $('.highlight').removeClass('highlight');
            $('[data-id="' + id + '"] span[data-token="' + token + '"]').addClass('highlight');

            this.scroll(id);
        },
        list : function(id, list) {
            $('.highlight').removeClass('highlight');
            for(let i = 0; i < list.length; i++)
                $('[data-id="' + id + '"] span[data-id="' + list[i] + '"]').addClass('highlight');

            this.scroll(id);
        },
        scroll : function(id) {
            if(id == 0)
                var scrollTo = $('#text .container-fluid .row');
            else
                var scrollTo = $('[data-id="' + id + '"]');

            let container = $('#text .container-fluid');

            container.animate({
                scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
            }, 2000);
        }
    },
    render : function(data, callback) {
        // set title
        $('#text .row header h1').text(data.title);

        $body = $('#text .row article');

        for (var i = 0; i < data.chapters.length; i++) {
            let chapter = data.chapters[i];
            let $headlineElement = $('<h1></h1>').text(chapter.title);
            let $chapterElement = $('<div></div>');
            $chapterElement.attr('id', 'chapter-' + chapter.id);
            $chapterElement.attr('class', 'chapter');
            $chapterElement.attr('data-id', chapter.id);

            if(chapter.sections.length > 0) {
                for (var x = 0; x < chapter.sections.length; x++) {
                    let section = chapter.sections[x];
                    let $sectionElement = $('<div></div>');
                    $sectionElement.attr('id', 'section-' + section.id);
                    $sectionElement.attr('class', 'section');
                    $sectionElement.attr('data-id', section.id);

                    if(section.title != null) {
                        $sectionHeadline = $('<h2></h2>').text(section.title);
                        $chapterElement.append($sectionHeadline);
                    }

                    if(section.paragraphs.length > 0) {
                        for(var a = 0; a < section.paragraphs.length; a++) {
                            var paragraph = section.paragraphs[a];
                            $paragraphElement = $('<p></p>');
                            $paragraphElement.attr('id', 'paragraph-' + paragraph.id);
                            $paragraphElement.attr('data-id', paragraph.id);

                            if(paragraph.sentences.length > 0) {
                                for(var s = 0; s < paragraph.sentences.length; s++) {
                                    let sentence = paragraph.sentences[s];
                                    let $sentenceElement = $('<span></span>');
                                    $sentenceElement.attr('class', 'sentence');
                                    $sentenceElement.attr('id', 'sentence-' + sentence.id);
                                    $sentenceElement.attr('data-id', sentence.id);

                                    let lasttoken = '';
                                    for(var t = 0; t < sentence.token.length; t++) {
                                        let token = sentence.token[t];

                                        $tokenElement = $('<span><span>').text(token.token);
                                        $tokenElement.attr('data-id', token.id);
                                        $tokenElement.attr('data-tag', token.tag);
                                        $tokenElement.attr('data-token', token.token);
                                        $tokenElement.attr('class', 'token');
                                        $sentenceElement.append($tokenElement);

                                        if(token.token != ','
                                            && token.token != '.'
                                            && token.token != '!'
                                            && token.token != '?'
                                            && token.token != ':'
                                            && token.token != ';'
                                            && token.token != ')'
                                            && token.token != '"'
                                            && token.token != '”'
                                            && lasttoken != '('
                                            && lasttoken != '[')
                                            $tokenElement.before(" ");
                                        lasttoken = token.token;
                                    }
                                    $paragraphElement.append($sentenceElement);
                                }
                            }
                            $sectionElement.append($paragraphElement);
                        }
                    }


                    if(section.subsections.length > 0) {
                        for(var y = 0; y < section.subsections.length; y++) {
                            let subsection = section.subsections[y];
                            let $subsectionElement = $('<div></div>');
                            $subsectionElement.attr('id', subsection.id);
                            $subsectionElement.attr('class', 'subsection');
                            $subsectionElement.attr('data-id', subsection.id);

                            if(subsection.title != null) {
                                $subsectionHeadline = $('<h3></h3>').text(subsection.title);
                                $sectionElement.append($subsectionHeadline);
                            }

                            if(subsection.paragraphs.length > 0) {
                                for(var a = 0; a < subsection.paragraphs.length; a++) {
                                    var paragraph = subsection.paragraphs[a];
                                    $paragraphElement = $('<p></p>');
                                    $paragraphElement.attr('id', 'paragraph-' + paragraph.id);
                                    $paragraphElement.attr('data-id', paragraph.id);

                                    if(paragraph.sentences.length > 0) {
                                        for(var s = 0; s < paragraph.sentences.length; s++) {
                                            let sentence = paragraph.sentences[s];
                                            let $sentenceElement = $('<span></span>');
                                            $sentenceElement.attr('class', 'sentence');
                                            $sentenceElement.attr('id', 'sentence-' + sentence.id);
                                            $sentenceElement.attr('data-id', sentence.id);

                                            let lasttoken = '';
                                            for(var t = 0; t < sentence.token.length; t++) {
                                                let token = sentence.token[t];

                                                $tokenElement = $('<span><span>').text(token.token);
                                                $tokenElement.attr('data-id', token.id);
                                                $tokenElement.attr('data-tag', token.tag);
                                                $tokenElement.attr('data-token', token.token);
                                                $tokenElement.attr('class', 'token');
                                                $sentenceElement.append($tokenElement);

                                                if(token.token != ','
                                                    && token.token != '.'
                                                    && token.token != '!'
                                                    && token.token != '?'
                                                    && token.token != ':'
                                                    && token.token != ';'
                                                    && token.token != ')'
                                                    && token.token != '"'
                                                    && token.token != '”'
                                                    && lasttoken != '('
                                                    && lasttoken != '[')
                                                    $tokenElement.before(" ");
                                                lasttoken = token.token;
                                            }
                                            $paragraphElement.append($sentenceElement);
                                        }
                                    }
                                    $subsectionElement.append($paragraphElement);
                                }
                            }

                            /*
                            if(subsection.subSubSections.length > 0) {
                                for(z = 0; z < subsection.subSubSections.length; z++) {
                                    console.log('wir haben welche');
                                    let subsubsection = subsection.subSubSections[z];
                                }
                            }*/
                            $sectionElement.append($subsectionElement);
                        }
                    }
                    //console.log(section);
                    $chapterElement.append($sectionElement);
                }
            }
            $body.append($headlineElement);
            $body.append($chapterElement);
        }
        callback();
    }
};
