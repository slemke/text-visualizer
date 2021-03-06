$(document).ready(function() {

    $selected = 1;
    // define delay function
    var delay = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout (timer);
			timer = setTimeout(callback, ms);
		};
	})();

    // update analysis id and update visualization
    $('#document-analysis').change(function() {
        $('#document-analysis option:selected').each(function() {
            let view = $(this).attr('value');
            activeTopic = view;
            initializeCharts();
            removeBubbleBorder();
        });
    });

    // set up view split
    var instance = Split(['#visualization', '#text'], {
        sizes: [50, 50],
        minSize: 500,
        onDrag: function() {
            delay(function() {
                initializeCharts();
            }, 1000);
        }
    });

    // add bootstrap tab functionality
    $('#tabs, #data-tabs').click(function (e) {
        // prevent default behavior
        e.preventDefault();

        // call bootstrap tab show
        $(this).tab('show');

        delay(function() {
            initializeCharts();
        }, 0.1);
    });

    // update visualization on resize
    $(window).resize(function() {

        // delay function to minimize resize events
        delay(function() {
            initializeCharts();
        }, 500);

    });

    const initializeCharts = function() {
        drawSunburst();
    };

    $.get( "document/1/tree.json", function( data ) {
        setBubbleData(bubbleData);
        setData(data);
        traverseAndFix(dataDocument);
        initializeCharts();
    });

    // on page load display text loading overlay
    $('#overlay').fadeIn(0);

   // load document on page load
    $.get('document/1/document.json', function(data) {

        // render loaded text
        text.render(data, function() {

            // hide text loading overlay, when text rendering is done
            $('#overlay').fadeOut(1000);

        });
    });


    $('#document-selector-form').submit(function(event) {
        event.preventDefault();
        $('#overlay').fadeIn(0);

        $selected = $('#document-selector').val();

        $.get('document/' + $selected + '/document.json', function(data) {

            // render loaded text
            text.render(data, function() {

                // hide text loading overlay, when text rendering is done
                $('#overlay').fadeOut(1000);

            });
        });


        $.get( "document/" + $selected + "/tree.json", function( data ) {
            setBubbleData(bubbleData);
            setData(data);
            traverseAndFix(dataDocument);
            sbSelection = [];
            selectedBubbles = [];
            text.highlight.scroll(0);
            highlightChapter([]);
            updateInformationTexts();
            initializeCharts();
        });
    });

    // scroll back to top of textview
    $('#back-to-top').click(function() {

        // scroll
        let container = $('#text .container-fluid');
        let scrollTo = $('#text .container-fluid .row');

        container.animate({
            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() - 20
        }, 2000);
    });
});
