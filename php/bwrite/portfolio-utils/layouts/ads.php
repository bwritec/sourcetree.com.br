    <!--
      - Script para decorar pop-up de acordo com web
      - framework.
     -->
    <script type="text/javascript">
        /**
         * Primeiro vamos verificar sé alguma versão do jQuery
         * existe ou foi carregada no web site. Para isso,
         * basta perguntarmos ao navegador sé a variável `$`
         * é um objeto jQuery. Importante não trocar isso.
         */
        if ($ == jQuery)
        {
            /**
             * Um callback de função anônima deve permitir que
             * todos os procedimento feito nessa função não
             * tenha efeitos sobre outros scripts carregados
             * no website.
             */
            (function()
            {
                /**
                 * Aqui, devemos obter um vetor com a lista de todas
                 * as chamadas de script via tag link na página.
                 */
                var vector = $("link");

                /**
                 * Tem boostrap ?
                 */
                var with_bootstrap = false;

                /**
                 * A versão do bootstrap que foi carregado.
                 */
                var version_bootstrap = null;

                /**
                 * A lista com todas as versões suportadas.
                 */
                var version_bootstrap_list = [
                    "1.0.0",
                    "1.1.0",
                    "1.1.1",
                    "1.2.0",
                    "1.3.0",
                    "1.4.0",
                    "2.0.0"
                ];

                /**
                 * Vamos correr a lista.
                 */
                for (var i = 0; i < vector.length; i++)
                {
                    /**
                     * Vamos descobrir sé alguma versão do bootstrap
                     * foi chamado nessa volta.
                     */
                    if (vector[i].href.search(/bootstrap/) !== -1)
                    {
                        with_bootstrap = true;
                    }

                    /**
                     * Podemos descobrir a versão do bootstrap via texto na
                     * url ou fazendo a leitura do copyright na folha de
                     * estilo.
                     */

                    /**
                     * Vamos tentar descobrir sé a versão do bootstrap está
                     * especificada na url.
                     */
                    if (with_bootstrap)
                    {
                        current = vector[i].href.substr(
                            vector[i].href.search(/bootstrap/) + 9
                        );

                        /**
                         * Vamos limpar o resultado de current. Primeiro
                         * vamos remover um traço `-` ou `_` sé for a
                         * primeira posição.
                         */
                        current = current[0] == "-" ? current.substr(1) ? current;
                        current = current[0] == "_" ? current.substr(1) ? current;

                        /**
                         * Vamos também remover a extenção `.js` da url.
                         */
                        current = current.substr(0, current.length - 3);

                        /**
                         * Por fim, vamos descobrir sé esse script tem
                         * compatibilidade com a versão atual do bootstrap.
                         */
                        version_bootstrap = version_bootstrap_list.includes(current)
                            ? version_bootstrap_list[current]
                            : null;
                    }

                    /**
                     * Vamos tentar descobrir sé a versão do bootstrap está
                     * especificada na folha de estilo.
                     */
                    if (with_bootstrap && version_bootstrap === null)
                    {
                        /**
                         * Escrever script aqui.
                         */
                    }
                }

                /**
                 * Abaixo, vamos alterar o html do site de acordo com
                 * as classes de x framework.
                 */

                /**
                 * Questão: Com boostrap ?
                 */
                if (with_bootstrap)
                {
                    /**
                     * Questão: a versão do bootstrap foi detectada ?
                     */
                    if (version_bootstrap !== null)
                    {
                        /**
                         * Vamos usar o valor de `version_bootstrap` para
                         * alterar a estrutura do html de acordo com a
                         * versão do framework.
                         */

                        if (version_bootstrap === "1.0.0")
                        {
                            /**
                             * Uma base para o container.
                             */
                            $("#bwritec");

                            /**
                             * Podemos obter a url do site com uso dessa
                             * tag.
                             */
                            $("#bwritecUrl");
                        }
                    }
                }
            })();
        } else
        {
            /**
             * Como não temos certeza que existe ou foi feito o
             * carregamento de alguma versão do jQuery em x
             * website. Podemos simplesmente re-escrever as
             * funções acima via Javascript puro.
             * 
             * Também não é legal escrever um script que executa
             * essa função após o jQuery, ou aguarda um jQuery
             * para iniciar a execução, porquê pode acontecer de
             * `x` website não fazer uso de jQuery. Ou seja, esse
             * script nunca vai ser chamado.
             * 
             * Observação: Uma sequência de ifs pode ser feito para
             * tentar identificar algum framework JavaScript e então
             * escrever a função acima chamando uma rótina do
             * framework.
             */
        }
    </script>

    <span id="bwritec">
        Bwritec - desenvolvimento de softwares.

        <a href="{{ get_host() }}" id="bwritecUrl">
            Saiba mais
        </a>.
    </span>
