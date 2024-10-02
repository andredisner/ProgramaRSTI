$(document).ready(function() {
    $("form").on("submit", function(event) {
        event.stopPropagation();
        event.stopDefault();
    });

    $("input[name.cep]").on("change", function(event){
        
    })
});
