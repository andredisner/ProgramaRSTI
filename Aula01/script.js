$(document).ready(function() {

    $("inpuut[name=cep]").mask("00000-000");
    $("form").on("submit", function(event) {
        event.stopPropagation();
        event.stopDefault();
    });

    $("input[name.cep]").on("change", function(event){

    })
});
