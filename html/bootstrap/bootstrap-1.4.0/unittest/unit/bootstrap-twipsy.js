/**
 * Copyright (C) <ano>  Chifrudo <chifrudo@localhost.com.br>
 *
 * Este programa é um software livre: você pode redistribuí-lo e/ou
 * modificá-lo sob os termos da GNU General Public License conforme
 * publicada por a Free Software Foundation, seja a versão 3 da
 * Licença, ou (a seu critério) qualquer versão posterior.
 *
 * Este programa é distribuído na esperança de que seja útil,
 * mas SEM QUALQUER GARANTIA; mesmo sem a garantia implícita de
 * COMERCIABILIDADE ou ADEQUAÇÃO PARA UM FIM ESPECÍFICO. Veja a
 * Licença Pública Geral GNU para mais detalhes.
 *
 * Você deve ter recebido uma cópia da GNU General Public License
 * juntamente com este programa. Caso contrário, consulte
 * <https://www.gnu.org/licenses/>.
 */
$(function()
{
    module("bootstrap-twipsy");

    /**
     *
     */
    test("deve ser definido no objeto jquery", function()
    {
        var div = $("<div></div>");

        ok(div.twipsy, "método popover é definido.");
    });

    /**
     *
     */
    test("deve retornar o elemento", function()
    {
        var div = $("<div></div>");

        ok(div.twipsy() == div, "document.body devolvido.");
    });

    /**
     *
     */
    test("deve expor as configurações padrão", function()
    {
        ok(!!$.fn.twipsy.defaults, "padrão é definido.");
    });

    /**
     *
     */
    test("deve remover o atributo title", function()
    {
        var twipsy = $("<a href=\"#\" rel=\"twipsy\" title=\"Another twipsy\"></a>").twipsy();

        ok(!twipsy.attr("title"), "tag de título foi removida.");
    });

    /**
     *
     */
    test("deve adicionar o atributo data para fazer referência ao título original", function()
    {
        var twipsy = $("<a href=\"#\" rel=\"twipsy\" title=\"Outro twipsy\"></a>").twipsy();

        equals(twipsy.attr("data-original-title"), "Outro twipsy", "título original preservado no atributo data.");
    });

    /**
     *
     */
    test("deve colocar dicas de ferramentas relativas à opção de posicionamento", function()
    {
        $.support.transition = false

        var twipsy = $('<a href="#" rel="twipsy" title="Another twipsy"></a>')
            .appendTo('#qunit-runoff')
            .twipsy({placement: 'below'})
            .twipsy('show');

        ok($(".twipsy").hasClass("fade below in"), "tem classes corretas aplicadas.");
        twipsy.twipsy("hide");

        ok(!$(".twipsy").length, "twipsy removido.");
        $("#qunit-runoff").empty();
    });

    /**
     *
     */
    test("deve adicionar um substituto nos casos em que os elementos não possuem tag de título", function()
    {
        $.support.transition = false;
        var twipsy = $("<a href=\"#\" rel=\"twipsy\"></a>")
            .appendTo("#qunit-runoff")
            .twipsy({ fallback: "@fat" })
            .twipsy("show");

        equals($(".twipsy").text(), "@fat", "tem texto padrão correto.");
        twipsy.twipsy("hide");
        ok(!$(".twipsy").length, "twipsy removido.");
        $("#qunit-runoff").empty();
    });

    /**
     *
     */
    test("não deve permitir entidades HTML", function()
    {
        $.support.transition = false;
        var twipsy = $("<a href=\"#\" rel=\"twipsy\" title=\"<b>@fat</b>\"></a>")
            .appendTo('#qunit-runoff')
            .twipsy()
            .twipsy('show');

        ok(!$(".twipsy b").length, "A tag b não foi inserida.");
        twipsy.twipsy("hide");

        ok(!$(".twipsy").length, "twipsy removido.");
        $("#qunit-runoff").empty();
    });

    /**
     *
     */
    test("deve permitir entidades html se a opção html estiver definida como true", function()
    {
        $.support.transition = false;
        var twipsy = $("<a href=\"#\" rel=\"twipsy\" title=\"<b>@fat</b>\"></a>")
            .appendTo("#qunit-runoff")
            .twipsy({ html: true })
            .twipsy("show");

        ok($(".twipsy b").length, "A tag b foi inserida.");
        twipsy.twipsy("hide");

        ok(!$(".twipsy").length, "twipsy removido.");
        $("#qunit-runoff").empty();
    });
});
