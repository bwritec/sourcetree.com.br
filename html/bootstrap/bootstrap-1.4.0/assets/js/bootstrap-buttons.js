/**
 * bootstrap-dropdown.js v1.4.0.
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
    function setState(el, state)
    {
        var d = "disabled",
            $el = $(el),
            data = $el.data();

        /**
         *
         */
        state = state + "Text";
        data.resetText || $el.data("resetText", $el.html());

        /**
         *
         */
        $el.html(data[state] || $.fn.button.defaults[state]);

        /**
         *
         */
        state == "loadingText" ?
            $el.addClass(d).attr(d, d) :
            $el.removeClass(d).removeAttr(d);
    }

    /**
     *
     */
    function toggle(el)
    {
        $(el).toggleClass("active");
    }

    /**
     *
     */
    $.fn.button = function(options)
    {
        return this.each(function ()
        {
            if (options == "toggle")
            {
                return toggle(this);
            }

            options && setState(this, options);
        });
    }

    /**
     *
     */
    $.fn.button.defaults = {
        loadingText: "loading..."
    };

    /**
     *
     */
    $(function ()
    {
        $("body").delegate(".btn[data-toggle]", "click", function()
        {
            $(this).button("toggle");
        });
    });
}(window.jQuery || window.ender);
