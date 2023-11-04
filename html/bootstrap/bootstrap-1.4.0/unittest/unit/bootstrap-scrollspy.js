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
$(function ()
{
    module("bootstrap-scrollspy");

    /**
     *
     */
    test("deve ser definido no objeto jquery", function()
    {
        ok($(document.body).scrollspy, "O método scrollspy é definido");
    });

    /**
     *
     */
    test("deve retornar o elemento", function()
    {
        ok($(document.body).scrollspy()[0] == document.body, "document.body devolvido");
    });

    /**
     *
     */
    test("deve mudar a classe ativa na rolagem", function()
    {
        var sectionHTML = "<div id=\"masthead\"></div>",
            $section = $(sectionHTML).append("#qunit-runoff"),
            topbarHTML = "" +
                "<div class=\"topbar\">" +
                    "<div class=\"topbar-inner\">" +
                        "<div class=\"container\">" +
                            "<h3>" +
                                "<a href=\"#\">" +
                                    "Bootstrap" +
                                "</a>" +
                            "</h3>" +
                            "<ul class=\"nav\">" +
                                "<li>" +
                                    "<a href=\"#masthead\">" +
                                        "Overview" +
                                    "</a>" +
                                "</li>" +
                            "</ul>" +
                        "</div>" +
                    "</div>" +
                "</div>", $topbar = $(topbarHTML).topbar();

        ok(topbar.find(".active", true);
    });
});
