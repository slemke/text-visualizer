$(document).ready(function() {

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
            lastPercentage = null;
            bubbleMinValue = null;
            initializeCharts();
        });
    });

    // set up view split
    var instance = Split(['#visualization', '#text'], {
        sizes: [50, 50],
        minSize: 500
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

    $.get( "/document/1/meta/", function( data ) {
        setBubbleData(bubbleData);
        setData(data);
        traverseAndFix(dataDocument);
        initializeCharts();
    });

    // on page load display text loading overlay
    $('#overlay').fadeIn(0);

    // load document on page load
    $.get('document/1/', function(data) {

        // render loaded text
        text.render(data, function() {

            // hide text loading overlay, when text rendering is done
            $('#overlay').fadeOut(1000);

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
