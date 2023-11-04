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
    module("bootstrap-tabs");

    /**
     *
     */
    test("deve ser definido no objeto jquery", function()
    {
        ok($(document.body).tabs, "método de guias é definido.");
    });

    /**
     *
     */
    test("deve retornar o elemento", function()
    {
        ok($(document.body).tabs()[0] == document.body, "document.body devolvido.");
    });

    /**
     *
     */
    test("deve ativar o elemento pelo id da tab", function()
    {
        var $tabsHTML = $("" +
            "<ul class=\"tabs\">" +
                "<li class=\"active\">" +
                    "<a href=\"#home\">" +
                        "Home" +
                    "</a>" +
                "</li>" +
                "<li>" +
                    "<a href=\"#profile\">" +
                        "Profile" +
                    "</a>" +
                "</li>" +
            "</ul>");

        /**
         *
         */
        $("<ul><li id=\"home\"></li><li id=\"profile\"></li></ul>").appendTo("#qunit-runoff");

        /**
         *
         */
        $tabsHTML.tabs().find("a").last().click();
        equals($("#qunit-runoff").find(".active").attr("id"), "profile");

        /**
         *
         */
        $tabsHTML.tabs().find("a").first().click();
        equals($("#qunit-runoff").find(".active").attr("id"), "home");

        /**
         *
         */
        $("#qunit-runoff").empty();
    });

    /**
     *
     */
    test("deve ativar o elemento pelo id da pill", function()
    {
        var $pillsHTML = $("" +
            "<ul class=\"pills\">" +
                "<li class=\"active\">" +
                    "<a href=\"#home\">" +
                        "Home" +
                    "</a>" +
                "</li>" +
                "<li>" +
                    "<a href=\"#profile\">" +
                        "Profile" +
                    "</a>" +
                "</li>" +
            "</ul>");

        /**
         *
         */
        $("<ul><li id=\"home\"></li><li id=\"profile\"></li></ul>").appendTo("#qunit-runoff");

        /**
         *
         */
        $pillsHTML.pills().find("a").last().click();
        equals($("#qunit-runoff").find(".active").attr("id"), "profile");

        /**
         *
         */
        $pillsHTML.pills().find("a").first().click();
        equals($("#qunit-runoff").find(".active").attr("id"), "home");

        $("#qunit-runoff").empty();
    });

    /**
     *
     */
    test("deve acionar evento de mudança ao ativar", function()
    {
        var $tabsHTML = $("" +
            "<ul class=\"tabs\">" +
                "<li class=\"active\">" +
                    "<a href=\"#home\">" +
                        "Home" +
                    "</a>" +
                "</li>" +
                "<li>" +
                    "<a href=\"#profile\">" +
                        "Profile" +
                    "</a>" +
                "</li>" +
            "</ul>"),
            $target,
            count = 0,
            relatedTarget,
            target;

        $tabsHTML
            .tabs()
            .bind("change", function(e)
            {
                target = e.target;
                relatedTarget = e.relatedTarget;
                count++;
            });

        $target = $tabsHTML
            .find("a")
            .last()
            .click();

        equals(relatedTarget, $tabsHTML.find("a").first()[0]);
        equals(target, $target[0]);
        equals(count, 1);
    });
});
