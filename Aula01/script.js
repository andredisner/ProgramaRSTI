$(document).ready(function() {
    // Aplicar máscaras de entrada
    $("input[name=cep]").mask("00000-000");
    $("input[name=numero]").mask("#");
    
    // Prevenir o envio do formulário
    $("form").on("submit", function(event) {
        event.preventDefault(); // Corrigido para preventDefault
    });

    // Lidar com a entrada do CEP e buscar dados de endereço
    $("input[name=cep]").on("keyup", function() {
        let cep = $("input[name=cep]").val().replace("-", "");
        if (cep.length === 8) {
            $("input[name=cep]").removeClass("is-invalid");
            $.ajax("https://viacep.com.br/ws/" + cep + "/json")
                .done(function(data) {
                    // Usar dados diretamente, pois já é JSON
                    if (!data.erro) {
                        $("input[name=rua]").val(data.logradouro);
                        $("input[name=complemento]").val(data.complemento);
                        $("input[name=bairro]").val(data.bairro);
                        $("select[name=estado]").val(data.uf);
                        $("input[name=cidade]").val(data.localidade);
                        $("input[name=uf]").val(data.uf);
                        $("input[name=ibge]").val(data.ibge);
                    } else {
                        // Opcional: lidar com o caso em que o CEP é inválido
                        $("input[name=cep]").addClass("is-invalid");
                    }
                })
                .fail(function() {
                    // Lidar com erros de AJAX
                    alert("Erro ao buscar o CEP. Tente novamente.");
                });
        }
    });

    // Buscar estados e popular o select
    const urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
    $.getJSON(urlEstados, function(data) {
        data.sort((a, b) => a.nome.localeCompare(b.nome));
        data.forEach(estado => {
            $('#estado').append(`<option value="${estado.sigla}">${estado.nome}</option>`);
        });

        // Lidar com a mudança de estado para buscar cidades
        $('#estado').on('change', function() {
            let estadoId = $(this).val();
            if (estadoId) {
                const urlCidades = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`;
                $.getJSON(urlCidades, function(data) {
                    $('#cidade').empty().append('<option value="">Selecione a cidade</option>');
                    data.sort((a, b) => a.nome.localeCompare(b.nome));
                    data.forEach(cidade => {
                        $('#cidade').append(`<option value="${cidade.nome}">${cidade.nome}</option>`);
                    });
                });
            } else {
                $('#cidade').empty().append('<option value="">Primeiro selecione o estado</option>');
            }
        });
    });
});
