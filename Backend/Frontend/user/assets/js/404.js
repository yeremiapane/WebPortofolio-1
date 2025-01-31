$(document).ready(function() {
    // Parallax Effect
    function parallax(e) {
        var windowWidth = $(window).width();
        if (windowWidth < 768) return; // Disable parallax on small screens

        var $parallax = $(".parallax");
        var halfFieldWidth = $parallax.width() / 2;
        var halfFieldHeight = $parallax.height() / 2;
        var fieldPos = $parallax.offset();
        var x = e.pageX;
        var y = e.pageY - fieldPos.top;

        var newX = (x - halfFieldWidth) / 30;
        var newY = (y - halfFieldHeight) / 30;

        $('.parallax [class*="wave"]').each(function(index) {
            $(this).css({
                transition: "",
                transform: "translate3d(" + (index * newX) + "px, " + (index * newY) + "px, 0px)"
            });
        });
    }

    function stopParallax() {
        $('.parallax [class*="wave"]').css({
            transform: "translate(0px,0px)",
            transition: "all 0.7s"
        });
        setTimeout(function() {
            $('.parallax [class*="wave"]').css("transition", "");
        }, 700);
    }

    // Event Listeners
    $(".not-found").on("mousemove", parallax);
    $(".not-found").on("mouseleave", stopParallax);
});
