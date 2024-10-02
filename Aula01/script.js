$(document).ready(function() {

    $("input[name=cep]").mask("00000-000");
    $("form").on("submit", function(event) {
        event.stopPropagation();
        event.stopDefault();
    });

    $("input[name=cep]").on("keyup", function(event) {
        let cep = $("input[name=cep]").val();
        cep = cep.reaplace("-","");
        if(cep.length == 8) {
            alert(cep);
        }
    });
});
