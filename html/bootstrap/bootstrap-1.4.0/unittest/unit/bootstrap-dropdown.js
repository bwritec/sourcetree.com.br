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
    module("bootstrap-dropdowns");

    /**
     *
     */
    test("deve ser definido no objeto jquery", function()
    {
        ok($(document.body).dropdown, "o método dropdown é definido.");
    });

    /**
     *
     */
    test("deve retornar o elemento", function()
    {
        ok($(document.body).dropdown()[0] == document.body, "document.body devolvido.");
    });

    /**
     *
     */
    test("deve adicionar classe aberta ao menu se clicado", function()
    {
        var dropdownHTML = "" +
            "<ul class=\"tabs\">" +
                "<li class=\"dropdown\">" +
                    "<a href=\"#\" class=\"dropdown-toggle\">Dropdown</a>" +
                    "<ul class=\"dropdown-menu\">" +
                        "<li>" +
                            "<a href=\"#\">" +
                                "Link secundário" +
                            "</a>" +
                        "</li>" +
                        "<li>" +
                            "<a href=\"#\">" +
                                "Outra coisa aqui" +
                            "</a>" +
                        "</li>" +
                        "<li class=\"divider\"></li>" +
                        "<li>" +
                            "<a href=\"#\">" +
                                "Outro link" +
                            "</a>" +
                        "</li>" +
                    "</ul>" +
                "</li>" +
            "</ul>",
            dropdown = $(dropdownHTML).dropdown();

        dropdown.find(".dropdown-toggle").click();
        ok(dropdown.find(".dropdown").hasClass("open"), "classe aberta adicionada ao clique.");
    });

    /**
     *
     */
    test("deve remover a classe aberta se o body for clicado", function()
    {
        var dropdownHTML = "" +
            "<ul class=\"tabs\">" +
                "<li class=\"dropdown\">" +
                    "<a href=\"#\" class=\"dropdown-toggle\">" +
                        "Dropdown" +
                    "</a>" +
                    "<ul class=\"dropdown-menu\">" +
                        "<li>" +
                            "<a href=\"#\">" +
                                "Link secundário" +
                            "</a>" +
                        "</li>" +
                        "<li>" +
                            "<a href=\"#\">" +
                                "Outra coisa aqui" +
                            "</a>" +
                        "</li>" +
                        "<li class=\"divider\"></li>" +
                        "<li>" +
                            "<a href=\"#\">" +
                                "Outro link" +
                            "</a>" +
                        "</li>" +
                    "</ul>" +
                "</li>" +
            "</ul>",
            dropdown = $(dropdownHTML).dropdown().appendTo("#qunit-runoff");

        dropdown.find(".dropdown-toggle").click();
        ok(dropdown.find(".dropdown").hasClass("open"), "classe aberta adicionada ao clique.");

        $("body").click();
        ok(!dropdown.find(".dropdown").hasClass("open"), "classe aberta removida.");
        dropdown.remove();
    });
});
