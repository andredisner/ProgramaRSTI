$(document).ready(function() {
    // Variável global "resposta" que armazena
    // a resposta JSON da consulta do CEP
    // digitado pelo usuário.
    let resposta = '';

    $("input[name=cep]").mask("00000-000");
    $("input[name=numero]").mask("n",{
        translation: {
            'n':{
                pattern: /[0-9]/,
                recursive: true
            }
        }
    });

    (document).ready(function() {

    $("input[name=telefone)").mask("(00) 00000-0000");
    $('input[name=telefone)').on('keyup',function(){
        let telefone = $("input[name=telefone)").val()
        ;// Remove todos os caracteres que não são números.
        telefone = telefone.replace(/[\D]/g,'');
    
    if (telefone.length < 11) {
        mascara = '(00) 0000-00000';
    } else { 
        mascara = '(00) 00000-0000';
    }
    
    $("input[name=telefone]").mask(mascara);

});
    const urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome';

    // Carregar os estados na inicialização
    $.getJSON(urlEstados, function(data) {
        data.forEach(function(estado) {
            $('#estado').append(`<option value="${estado.sigla}">${estado.nome}</option>`);
            
        });
    });

    $("form").on("submit", function(event){
        event.stopPropagation();
        event.preventDefault();
    });
    
    $("input[name=cep]").on("keyup", function(event){
        let cep = $("input[name=cep]").val();
        cep = cep.replace("-", "");
        if(cep.length == 8){
            $("input[name=cep]").removeClass("is-invalid");
            //alert(cep);
            $.ajax("https://viacep.com.br/ws/"+ cep +"/json")
            .done(function(data){
                resposta = JSON.parse(data);
                if(resposta.erro){
                    $("input[name=cep]").addClass("is-invalid");
                }else{
                    $("input[name=rua]").val(resposta.logradouro);
                    if(resposta.logradouro !== ""){
                        $("input[name=rua]").prop("disabled", "disabled")
                    }
                    $("input[name=bairro]").val(resposta.bairro);
                    if(resposta.bairro !== ""){
                        $("input[name=bairro]").prop("disabled", "disabled")
                    }
                    $("select[name=estado]").val(resposta.uf);
                    $("select[name=estado]").trigger("change");
                    $("select[name=estado]").prop("disabled", "disabled");
                    $("select[name=cidade]").prop("disabled", "disabled");
                }
                
            })
            .fail(function(data){
                resposta = { "erro": "true"}
            })
        } else {
            $("imput[name=rua]").prop("disabled", false);
            $("imput[name=rua]").val("");
            $("imput[name=bairro]").prop("disabled", false);
            $("imput[name=bairro]").val("");
            $("imput[name=cidade]").prop("disabled", false);
            $("imput[name=cidade]").val("");
            $("imput[name=estado]").prop("disabled", false);
            $("imput[name=estado]").val("");
        } 
    });

    $('#estado').on('change', function() {
        let estadoId = $(this).val(); // Pega o ID do estado selecionado

        if (estadoId) {
            const urlCidades = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`;

            $.getJSON(urlCidades, function(data) {
                $('#cidade').empty(); // Limpa o select de cidades
                $('#cidade').append(`<option value="">Selecione a cidade</option>`); // Adiciona a opção padrão

                data.sort(function(a, b) {
                    return a.nome.localeCompare(b.nome);
                });

                data.forEach(function(cidade) {
                    $('#cidade').append(`<option value="${cidade.nome}">${cidade.nome}</option>`);
                });

                // Popula o campo "Cidade" com a cidade que o CEP digitado
                // pelo usuário pertence.
                $("select[name=cidade]").val(resposta.localidade);
            });
        } else {
            $('#cidade').empty(); // Limpa o select de cidades caso não haja estado selecionado
            $('#cidade').append(`<option value="">Primeiro selecione o estado</option>`);
        }
    });
}); 