/**
 * bootstrap-tabs.js v1.4.0.
 *
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


/**
 *
 */
!function($)
{
    "use strict";

    /**
     *
     */
    function activate(element, container)
    {
        container
            .find("> .active")
            .removeClass("active")
            .find("> .dropdown-menu > .active")
            .removeClass("active");

        /**
         *
         */
        element.addClass("active");

        if (element.parent(".dropdown-menu"))
        {
            element.closest("li.dropdown").addClass("active");
        }
    }

    /**
     *
     */
    function tab(e)
    {
        var $this = $(this),
            $ul = $this.closest("ul:not(.dropdown-menu)"),
            href = $this.attr("href"),
            previous,
            $href;

        if (/^#\w+/.test(href))
        {
            e.preventDefault();

            if ($this.parent("li").hasClass("active"))
            {
                return;
            }

            previous = $ul.find(".active a").last()[0];
            $href = $(href);

            activate($this.parent("li"), $ul);
            activate($href, $href.parent());

            $this.trigger({
                type: "change",
                relatedTarget: previous
            });
        }
    }

    /**
     * TABS/PILLS PLUGIN DEFINITION
     */
    $.fn.tabs = $.fn.pills = function(selector)
    {
        return this.each(function ()
        {
            $(this).delegate(selector || ".tabs li > a, .pills > li > a", "click", tab);
        });
    };

    /**
     *
     */
    $(document).ready(function()
    {
        $("body").tabs("ul[data-tabs] li > a, ul[data-pills] > li > a");
    });
}(window.jQuery || window.ender);
