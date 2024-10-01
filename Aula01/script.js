$(document).ready(function() {
    $("form").on("submit", function(event) {
        event.stopPropagation();
        event.stopDefault();
    });
});
