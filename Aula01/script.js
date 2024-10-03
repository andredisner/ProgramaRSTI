    $(document).ready(function() {
        //variavel Global
        let resposta ='';
        // Aplicar máscaras de entrada
        $("input[name=cep]").mask("00000-000");
        $("input[name=numero]").mask("#");
            translation: {
                'n':{
                    pattern: /[0-9]/,
                    recursive: true
                }
            }
        });
            // Buscar estados e popular o select
            const urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
            $.getJSON(urlEstados, function(data) {
                data.forEach(function(estado){
                    $('#estado').append(`<option value="${estado.sigla}">${estado.nome}</option>`);
                });
            });
        // Prevenir o envio do formulário
        $("form").on("submit", function(event) {
            event.Propagation();
            event.preventDefault();
        });
        // Lidar com a entrada do CEP e buscar dados de endereço
        $("input[name=cep]").on("keyup", function(event) {
            let cep = $("input[name=cep]").val();
            cep = cep.replace("-", "");
            if (cep.length === 8) {
                $("input[name=cep]").removeClass("is-invalid");
                $.ajax("https://viacep.com.br/ws/" + cep + "/json")
                    .done(function(data) {
                        // Usar dados diretamente, pois já é JSON
                        if (resposta.erro) {
                            $("input[name=cep]").addClass("is-invalid");
                        } else {
                            $("input[name=rua]").val(data.logradouro);
                            $("input[name=bairro]").val(data.bairro);
                            $("select[name=estado]").val(data.uf);
                            $("select[name=estado]").trigger("change");
                            $("input[name=complemento]").val(data.complemento);
                            $("select[name=cidade]").val(data.localidade);
                            $("input[name=uf]").val(data.uf);
                            $("input[name=ibge]").val(data.ibge);
                            // Opcional: lidar com o caso em que o CEP é inválido
                        }
                    })
                    .fail(function() {
                        // Lidar com erros de AJAX
                        alert("Erro ao buscar o CEP. Tente novamente.");
                    });
            }
        });
            // Lidar com a mudança de estado para buscar Cidades
            $('#estado').on('change', function() {
                let estadoId = $(this).val();
                if (estadoId) {
                    const urlCidades = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`;
                    $.getJSON(urlCidades, function(data) {
                        $('#cidade').empty();
                        $('#cidade').append('<option value="">Selecione a Cidade</option>');
                        data.sort(function(a, b) {
                            return a.nome.localeCompare(b.nome);
                        });
                        data.forEach(function(cidade) {
                            $('#cidade').append(`<option value="${cidade.nome}">${cidade.nome}</option>`);
                        });
                    $("select[name=cidade]").val(resposta.localidade);
                } else {
                    $('#cidade').empty();
                    $('#cidade').append('<option value="">Primeiro selecione o estado</option>');
                }
            });
        });
    });
});
