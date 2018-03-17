$(document).on("mouseenter", ".time-stamp", function(e) {
    let date = new Date(e.currentTarget.innerText);
    const { pageX, pageY } = e.originalEvent;
    $("body").append(`
        <div id="popup" class="time-stamp" style="z-index: 5; width: auto; height: 50px; line-height: 50px; position: absolute; top: ${pageY-25}px; left:${pageX+5}px; background-color: white; color: black;">${date.getTime()}</div>
        `);
    $(this).on("mouseleave", function() {
        $("#popup").remove();
    });
});