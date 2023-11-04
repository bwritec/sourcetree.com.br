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
    module("bootstrap-popover");

    /**
     *
     */
    test("deve ser definido no objeto jquery", function()
    {
        var div = $("<div></div>");

        ok(div.popover, "método popover é definido.");
    });

    /**
     *
     */
    test("deve retornar o elemento", function()
    {
        var div = $("<div></div>");

        ok(div.popover() == div, "document.body devolvido.");
    });

    /**
     *
     */
    test("deve renderizar o elemento popover", function()
    {
        $.support.transition = false;

        var popover = $("<a href=\"#\" title=\"mdo\" data-content=\"http://twitter.com/mdo\">@mdo</a>")
            .appendTo("#qunit-runoff")
            .popover()
            .popover("show");

        ok($(".popover").length, "popover foi inserido.");
        popover.popover("hide");

        ok(!$(".popover").length, "popover removido.");
        $("#qunit-runoff").empty();
    });

    /**
     *
     */
    test("deve armazenar instância popover no objeto de dados popover", function()
    {
        $.support.transition = false
        var popover = $("<a href=\"#\" title=\"mdo\" data-content=\"http://twitter.com/mdo\">@mdo</a>")
            .popover();

        ok(!!popover.data("popover"), "a instância popover existe.");
    });

    /**
     *
     */
    test("deve obter o título e o conteúdo das opções", function()
    {
        $.support.transition = false

        var popover = $("<a href=\"#\">@fat</a>")
            .appendTo("#qunit-runoff")
            .popover({
                /**
                 *
                 */
                title: function()
                {
                    return "@fat";
                },

                /**
                 *
                 */
                content: function()
                {
                    return "adora escrever testes （╯°□°）╯︵ ┻━┻";
                }
            });

        /**
         *
         */
        popover.popover("show");

        /**
         *
         */
        ok($(".popover").length, "popover foi inserido.");
        equals($(".popover .title").text(), "@fat", "título inserido corretamente.");
        equals($(".popover .content").text(), "adora escrever testes （╯°□°）╯︵ ┻━┻", "conteúdo inserido corretamente.");

        /**
         *
         */
        popover.popover("hide");
        ok(!$(".popover").length, "popover foi removido.");
        $("#qunit-runoff").empty();
    });

    /**
     *
     */
    test("deve obter o título e o conteúdo dos atributos", function()
    {
        $.support.transition = false;
        var popover = $("<a href=\"#\" title=\"@mdo\" data-content=\"adora atributos de dados (づ｡◕‿‿◕｡)づ ︵ ┻━┻\">@mdo</a>")
            .appendTo("#qunit-runoff")
            .popover()
            .popover("show");

        ok($(".popover").length, "popover foi inserido.");
        equals($(".popover .title").text(), "@mdo", "título inserido corretamente.");
        equals($('.popover .content').text(), "adora atributos de dados (づ｡◕‿‿◕｡)づ ︵ ┻━┻", "conteúdo inserido corretamente.");

        popover.popover("hide");
        ok(!$(".popover").length, "popover foi removido.");
        $('#qunit-runoff').empty();
    });
});
