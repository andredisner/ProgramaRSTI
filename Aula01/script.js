                    $(document).ready(function() {

                        $("input[name=cep]").mask("00000-000");
                        $("input[name=numero]").mask("#");
                        
                        $("form").on("submit", function(event) {
                            event.stopPropagation();
                            event.stopDefault();
                        });

                        $("input[name=cep]").on("keyup", function(event) {
                            let cep = $("input[name=cep]").val();
                            cep = cep.replace("-","");
                            if(cep.length == 8) {
                                $("input[name=cep]").removeClass("is-invalid");
                                $.ajax("https://viacep.com.br/ws/" + cep + "/json")
                                    .done(function(data) {
                                        let resposta = JSON.parse(data);
                                    if (!resposta.erro){
                                            $("input[name=rua]").val(resposta.logradouro);
                                            $("input[name=complemento]").val(resposta.complemento);
                                            $("input[name=bairro]").val(resposta.bairro);
                                            $("select[name=estado]").val(resposta.uf);
                                            $("input[name=cidade]").val(resposta.localidade);
                                            $("input[name=uf]").val(resposta.uf);
                                            $("input[name=ibge]").val(resposta.ibge);
                                    }

                                    });
                            }
                        });

                        const urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
                        $.getJSON(urlEstados, function(data) {
                            data.sort(function(a, b) {
                                return a.nome.localeCompare(b.nome);
                            });
                    
                            data.forEach(function(estado) {
                                $('#estado').append(`<option value="${estado.sigla}">${estado.nome}</option>`);
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
                                            $('#cidade').append(`<option value="${cidade.id}">${cidade.nome}</option>`);
                                        });
                                    });
                                } else {
                                    $('#cidade').empty(); // Limpa o select de cidades caso não haja estado selecionado
                                    $('#cidade').append(`<option value="">Primeiro selecione o estado</option>`);
                                }



                        });
                    });
