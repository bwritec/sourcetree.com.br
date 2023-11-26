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
(function(window, undefined)
{
    /**
     * Use o documento correto de acordo com o argumento
     * da janela (sandbox).
     */
    var document = window.document,
        navigator = window.navigator,
        location = window.location;

    /**
     *
     */
    var jQuery = (function()
    {
        /**
         * Defina uma cópia local do jQuery.
         */
        var jQuery = function(selector, context)
        {
            /**
             * O objeto jQuery é na verdade apenas o construtor
             * init 'aprimorado'.
             */
            return new jQuery.fn.init(selector, context, rootjQuery);
        },

        /**
         * Mapeie sobre jQuery em caso de substituição.
         */
        _jQuery = window.jQuery,

        /**
         * Mapeie sobre $ em caso de substituição.
         */
        _$ = window.$,

        /**
         * Uma referência central à root jQuery(document).
         */
        rootjQuery,

        /**
         * Uma maneira simples de verificar strings HTML ou ID.
         * Priorize #id sobre <tag> para evitar XSS via
         * location.hash (#9521).
         */
        quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

        /**
         * Verifique se uma string contém um caractere que não
         * seja um espaço em branco.
         */
        rnotwhite = /\S/,

        /**
         * Usado para aparar espaços em branco.
         */
        trimLeft = /^\s+/,
        trimRight = /\s+$/,

        /**
         * Combine uma tag independente.
         */
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

        /**
         * RegExp JSON.
         */
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

        /**
         * Useragent RegExp.
         */
        rwebkit = /(webkit)[ \/]([\w.]+)/,
        ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        rmsie = /(msie) ([\w.]+)/,
        rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

        /**
         * Corresponde a string com traços para camelização.
         */
        rdashAlpha = /-([a-z]|[0-9])/ig,
        rmsPrefix = /^-ms-/,

        /**
         * Usado por jQuery.camelCase como callback para replace().
         */
        fcamelCase = function(all, letter)
        {
            return ( letter + "" ).toUpperCase();
        },

        /**
         * Mantenha uma string UserAgent para uso com jQuery.browser.
         */
        userAgent = navigator.userAgent,

        /**
         * Para combinar o mecanismo e a versão do navegador.
         */
        browserMatch,

        /**
         * O adiado usado no DOM pronto.
         */
        readyList,

        /**
         * O manipulador de eventos pronto.
         */
        DOMContentLoaded,

        /**
         * Salve uma referência a alguns métodos principais.
         */
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        trim = String.prototype.trim,
        indexOf = Array.prototype.indexOf,

        /**
         * [[Class]] -> pairs de tipos.
         */
        class2type = {};

        /**
         *
         */
        jQuery.fn = jQuery.prototype = {
            /**
             *
             */
            constructor: jQuery,

            /**
             *
             */
            init: function(selector, context, rootjQuery)
            {
                var match,
                    elem,
                    ret,
                    doc;

                /**
                 * Handle $(""), $(null), ou $(undefined).
                 */
                if (!selector)
                {
                    return this;
                }

                /**
                 * Handle $(DOMElement).
                 */
                if (selector.nodeType)
                {
                    this.context = this[0] = selector;
                    this.length = 1;

                    return this;
                }

                /**
                 * O elemento body existe apenas uma vez, otimize
                 * sua localização.
                 */
                if (selector === "body" && !context && document.body)
                {
                    this.context = document;
                    this[0] = document.body;
                    this.selector = selector;
                    this.length = 1;

                    return this;
                }

                /**
                 * Handle HTML strings.
                 */
                if (typeof selector === "string")
                {
                    /**
                     * Estamos lidando com uma string HTML ou um ID ?
                     */
                    if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3)
                    {
                        /**
                         * Suponha que as strings que começam e terminam
                         * com <> sejam HTML e pule a verificação de regex.
                         */
                        match = [null, selector, null];
                    } else
                    {
                        match = quickExpr.exec(selector);
                    }

                    /**
                     * Verifique uma correspondência e se nenhum contexto
                     * foi especificado para #id.
                     */
                    if (match && (match[1] || !context))
                    {

                    /**
                     * HANDLE: $(html) -> $(array).
                     */
                    if (match[1])
                    {
                        context = context instanceof jQuery ? context[0] : context;
                        doc = (context ? context.ownerDocument || context : document);

                        /**
                         * Se uma única string for passada e for uma
                         * única tag, basta fazer um createElement e
                         * pular o resto.
                         */
                        ret = rsingleTag.exec(selector);

                        if (ret)
                        {
                            if (jQuery.isPlainObject(context))
                            {
                                selector = [
                                    document.createElement(ret[1])
                                ];

                                jQuery.fn.attr.call(selector, context, true);
                            } else
                            {
                                selector = [
                                    doc.createElement(ret[1])
                                ];
                            }
                        } else
                        {
                            ret = jQuery.buildFragment([match[1]], [doc]);
                            selector = (
                                ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment
                            ).childNodes;
                        }

                        return jQuery.merge(this, selector);

                        /**
                         * HANDLE: $("#id").
                         */
                    } else
                    {
                        elem = document.getElementById(match[2]);

                        /**
                         * Verifique parentNode para detectar quando o
                         * Blackberry 4.6 retorna nós que não estão mais
                         * no documento #6963.
                         */
                        if (elem && elem.parentNode)
                        {
                            /**
                             * Lide com o caso em que o IE e o Opera retornam
                             * itens por nome em vez de ID.
                             */
                            if (elem.id !== match[2])
                            {
                                return rootjQuery.find(selector);
                            }

                            /**
                             * Caso contrário, injetamos o elemento diretamente
                             * no objeto jQuery.
                             */
                            this.length = 1;
                            this[0] = elem;
                        }

                        this.context = document;
                        this.selector = selector;

                        return this;
                    }

                    /**
                     * HANDLE: $(expr, $(...)).
                     */
                } else if (!context || context.jquery)
                {
                    return (context || rootjQuery).find(selector);

                    /**
                     * HANDLE: $(expr, context).
                     * (que é apenas equivalente a: $(context).find(expr).
                     */
                } else
                {
                    return this.constructor(context).find(selector);
                }

                /**
                 * HANDLE: $(function).
                 * Atalho para documento pronto.
                 */
            } else if (jQuery.isFunction(selector))
            {
                return rootjQuery.ready(selector);
            }

            if (selector.selector !== undefined)
            {
                this.selector = selector.selector;
                this.context = selector.context;
            }

            return jQuery.makeArray(selector, this);
        },

        /**
         * Comece com um seletor vazio.
         */
        selector: "",

        /**
         * A versão atual do jQuery em uso.
         */
        jquery: "1.7.1",

        /**
         * O comprimento padrão de um objeto jQuery é 0.
         */
        length: 0,

        /**
         * O número de elementos contidos no conjunto de elementos
         * correspondentes.
         */
        size: function()
        {
            return this.length;
        },

        /**
         *
         */
        toArray: function()
        {
            return slice.call(this, 0);
        },

        /**
         * Obtenha o enésimo elemento no conjunto de elementos
         * correspondente OU. Obtenha todo o elemento correspondente
         * definido como um vetor limpo.
         */
        get: function(num)
        {
            return num == null ?
                /**
                 * Devolve um vetor 'limpo'.
                 */
                this.toArray() :

                /**
                 * Retorne apenas o objeto.
                 */
                (
                    num < 0 ? this[this.length + num] : this[num]
                );
        },

        /**
         * Pegue um vetor de elementos e coloque-o na pilha
         * (retornando o novo conjunto de elementos correspondente).
         */
        pushStack: function(elems, name, selector)
        {
            /**
             * Construa um novo conjunto de elementos correspondentes
             * do jQuery.
             */
            var ret = this.constructor();

            if (jQuery.isArray(elems))
            {
                push.apply(ret, elems);
            } else
            {
                jQuery.merge(ret, elems);
            }

            /**
             * Adicione o objeto antigo à pilha (como referência).
             */
            ret.prevObject = this;
            ret.context = this.context;

            if (name === "find")
            {
                ret.selector = this.selector + (this.selector ? " " : "") + selector;
            } else if (name)
            {
                ret.selector = this.selector + "." + name + "(" + selector + ")";
            }

            /**
             * Retorne o conjunto de elementos recém-formado.
             */
            return ret;
        },

        /**
         * Execute um callback para cada elemento do conjunto
         * correspondente. (Você pode propagar os argumentos
         * com um vetor de argumentos, mas isso é usado apenas
         * internamente.).
         */
        each: function(callback, args)
        {
            return jQuery.each(this, callback, args);
        },

        /**
         *
         */
        ready: function(fn)
        {
            /**
             * Anexe os ouvintes.
             */
            jQuery.bindReady();

            /**
             * Adicione o callback.
             */
            readyList.add(fn);

            return this;
        },

        /**
         *
         */
        eq: function(i)
        {
            i = +i;

            return i === -1 ? this.slice(i) : this.slice(i, i + 1);
        },

        /**
         *
         */
        first: function()
        {
            return this.eq(0);
        },

        /**
         *
         */
        last: function()
        {
            return this.eq(-1);
        },

        /**
         *
         */
        slice: function()
        {
            return this.pushStack(slice.apply(this, arguments), "slice", slice.call(arguments).join(","));
        },

        /**
         *
         */
        map: function(callback)
        {
            return this.pushStack(
                jQuery.map(this, function(elem, i)
                {
                    return callback.call(elem, i, elem);
                })
            );
        },

        /**
         *
         */
        end: function()
        {
            return this.prevObject || this.constructor(null);
        },

        /**
         * Apenas para uso interno. Comporta-se como um método
         * de vetor, não como um método jQuery.
         */
        push: push,

        /**
         *
         */
        sort: [].sort,

        /**
         *
         */
        splice: [].splice
    };

    /**
     * Dê à função init o protótipo jQuery para instanciação
     * posterior.
     */
    jQuery.fn.init.prototype = jQuery.fn;

    /**
     *
     */
    jQuery.extend = jQuery.fn.extend = function()
    {
        var options,
            name,
            src,
            copy,
            copyIsArray,
            clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        /**
         * Lide com uma situação de cópia avançada.
         */
        if (typeof target === "boolean")
        {
            deep = target;
            target = arguments[1] || {};

            /**
             * Pule o booleano e o alvo.
             */
            i = 2;
        }

        /**
         * Lidar com maiúsculas e minúsculas quando o destino
         * é uma string ou algo assim (possível em cópia
         * profunda).
         */
        if (typeof target !== "object" && !jQuery.isFunction(target))
        {
            target = {};
        }

        /**
         * Estenda o próprio jQuery se apenas um argumento
         * for passado.
         */
        if (length === i)
        {
            target = this;
            --i;
        }

        for (; i < length; i++)
        {
            /**
             * Lide apenas com valores non-null/undefined.
             */
            if ((options = arguments[i]) != null)
            {
                // Extend the base object
                for ( name in options )
                {
                    src = target[name];
                    copy = options[name];

                    /**
                     * Evite loop sem fim.
                     */
                    if (target === copy)
                    {
                        continue;
                    }

                    /**
                     * Recurse se estivermos mesclando objetos ou vetores
                     * simples.
                     */
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))))
                    {
                        if (copyIsArray)
                        {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else
                        {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        /**
                         * Nunca mova objetos originais, clone-os.
                         */
                        target[name] = jQuery.extend(deep, clone, copy);

                        /**
                         * Não traga valores undefined.
                         */
                    } else if (copy !== undefined)
                    {
                        target[name] = copy;
                    }
                }
            }
        }

        /**
         * Retorne o objeto modificado.
         */
        return target;
    };

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        noConflict: function(deep)
        {
            if (window.$ === jQuery)
            {
                window.$ = _$;
            }

            if (deep && window.jQuery === jQuery)
            {
                window.jQuery = _jQuery;
            }

            return jQuery;
        },

        /**
         * O DOM está pronto para ser usado ? Defina como
         * verdadeiro assim que ocorrer.
         */
        isReady: false,

        /**
         * Um contador para rastrear quantos itens esperar antes
         * que o evento pronto seja acionado. Consulte #6781.
         */
        readyWait: 1,

        /**
         * Mantenha (ou libere) o evento pronto.
         */
        holdReady: function(hold)
        {
            if (hold)
            {
                jQuery.readyWait++;
            } else
            {
                jQuery.ready(true);
            }
        },

        /**
         * Tratar quando o DOM estiver pronto.
         */
        ready: function(wait)
        {
            /**
             * Uma retenção liberada ou um evento DOMready/load e
             * ainda não está pronto.
             */
            if ((wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady))
            {
                /**
                 * Certifique-se de que o body exista, pelo menos,
                 * caso o IE fique um pouco zeloso demais (ticket #5443).
                 */
                if (!document.body)
                {
                    return setTimeout(jQuery.ready, 1);
                }

                /**
                 * Lembre-se que o DOM está pronto.
                 */
                jQuery.isReady = true;

                /**
                 * Se um evento DOM Ready normal for acionado, diminua
                 * e aguarde, se necessário.
                 */
                if (wait !== true && --jQuery.readyWait > 0)
                {
                    return;
                }

                /**
                 * Se houver funções vinculadas, para executar.
                 */
                readyList.fireWith(document, [jQuery]);

                /**
                 * Acione quaisquer eventos vinculados prontos.
                 */
                if (jQuery.fn.trigger)
                {
                    jQuery(document).trigger("ready").off("ready");
                }
            }
        },

        /**
         *
         */
        bindReady: function()
        {
            if (readyList)
            {
                return;
            }

            readyList = jQuery.Callbacks("once memory");

            /**
             * Capture casos em que $(document).ready() é chamado
             * após o evento do navegador já ter ocorrido.
             */
            if (document.readyState === "complete")
            {
                /**
                 * Trate-o de forma assíncrona para permitir que os
                 * scripts tenham a oportunidade de atrasar a preparação.
                 */
                return setTimeout(jQuery.ready, 1);
            }

            /**
             * O modo escuro do Mozilla, Opera e webkit atualmente
             * suporta este evento.
             */
            if (document.addEventListener)
            {
                /**
                 * Use o callback prático de evento.
                 */
                document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

                /**
                 * Um substituto para window.onload, que sempre funcionará.
                 */
                window.addEventListener("load", jQuery.ready, false);

                /**
                 * Se o modelo de evento do IE for usado.
                 */
            } else if (document.attachEvent)
            {
                /**
                 * Garanta o envio antes do onload, talvez tarde,
                 * mas seguro também para iframes.
                 */
                document.attachEvent("onreadystatechange", DOMContentLoaded);

                /**
                 * Um substituto para window.onload, que sempre funcionará.
                 */
                window.attachEvent("onload", jQuery.ready);

                /**
                 * Se for IE e não um frame, verifique continuamente
                 * se o documento está pronto.
                 */
                var toplevel = false;

                try
                {
                    toplevel = window.frameElement == null;
                } catch(e)
                {
                }

                if (document.documentElement.doScroll && toplevel)
                {
                    doScrollCheck();
                }
            }
        },

        /**
         * Consulte test/unit/core.js para obter detalhes sobre
         * isFunction. Desde a versão 1.3, métodos e funções DOM
         * como alert não são suportados. Eles retornam falso no
         * IE (#2968).
         */
        isFunction: function(obj)
        {
            return jQuery.type(obj) === "function";
        },

        /**
         *
         */
        isArray: Array.isArray || function(obj)
        {
            return jQuery.type(obj) === "array";
        },

        /**
         * Uma maneira complexa de determinar se um objeto
         * é uma janela.
         */
        isWindow: function(obj)
        {
            return obj && typeof obj === "object" && "setInterval" in obj;
        },

        /**
         *
         */
        isNumeric: function(obj)
        {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },

        /**
         *
         */
        type: function(obj)
        {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
        },

        /**
         *
         */
        isPlainObject: function(obj)
        {
            /**
             * Deve ser um objeto. Por causa do IE, também temos
             * que verificar a presença da propriedade construtor.
             * Certifique-se de que os nós DOM e os objetos de
             * janela também não passem.
             */
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj))
            {
                return false;
            }

            try
            {
                /**
                 * A propriedade do construtor que não possui deve
                 * ser Object.
                 */
                if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf"))
                {
                    return false;
                }
            } catch (e)
            {
                /**
                 * IE8,9 lançará exceções em certos objetos host #9897.
                 */
                return false;
            }

            /**
             * As propriedades own são enumeradas primeiro,
             * então para acelerar, se a última for own, então
             * todas as propriedades serão own.
             */

            var key;
            for (key in obj)
            {
            }

            return key === undefined || hasOwn.call(obj, key);
        },

        /**
         *
         */
        isEmptyObject: function(obj)
        {
            for (var name in obj)
            {
                return false;
            }

            return true;
        },

        /**
         *
         */
        error: function(msg)
        {
            throw new Error(msg);
        },

        /**
         *
         */
        parseJSON: function(data)
        {
            if (typeof data !== "string" || !data)
            {
                return null;
            }

            /**
             * Certifique-se de que os espaços em branco iniciais/finais
             * sejam removidos (o IE não consegue lidar com isso).
             */
            data = jQuery.trim(data);

            /**
             * Tente analisar primeiro usando o analisador JSON nativo.
             */
            if (window.JSON && window.JSON.parse)
            {
                return window.JSON.parse(data);
            }

            /**
             * Certifique-se de que os dados recebidos sejam JSON
             * reais. Lógica emprestada de http://json.org/json2.js.
             */
            if ( rvalidchars.test( data.replace( rvalidescape, "@" ).replace(rvalidtokens, "]").replace(rvalidbraces, "")))
            {
                return (new Function("return " + data))();
            }

            jQuery.error("Invalid JSON: " + data);
        },

        /**
         * Análise XML entre navegadores.
         */
        parseXML: function(data)
        {
            var xml,
                tmp;

            try
            {
                if (window.DOMParser)
                {
                    /**
                     * Padrão.
                     */
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data , "text/xml");
                } else
                {
                    /**
                     * IE.
                     */
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(data);
                }
            } catch(e)
            {
                xml = undefined;
            }

            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
            {
                jQuery.error("Invalid XML: " + data);
            }

            return xml;
        },

        /**
         *
         */
        noop: function()
        {
        },

        /**
         * Avalia um script em um contexto global.
         * http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context.
         */
        globalEval: function(data)
        {
            if (data && rnotwhite.test(data))
            {
                /**
                 * Usamos execScript no Internet Explorer. Usamos uma
                 * função anônima para que o contexto seja janela em
                 * vez de jQuery no Firefox.
                 */
                (
                    window.execScript || function(data)
                    {
                        window["eval"].call(window, data);
                    }
                )(data);
            }
        },

        /**
         * Converter tracejado em camelCase; usado pelos módulos
         * CSS e dados. A SystemBase esqueceu de aumentar o prefixo
         * do fornecedor (#9572).
         */
        camelCase: function(string)
        {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },

        /**
         *
         */
        nodeName: function(elem, name)
        {
            return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
        },

        /**
         * args é apenas para uso interno.
         */
        each: function(object, callback, args)
        {
            var name, i = 0,
                length = object.length,
                isObj = length === undefined || jQuery.isFunction(object);

            if (args)
            {
                if (isObj)
                {
                    for (name in object)
                    {
                        if (callback.apply(object[name], args) === false)
                        {
                            break;
                        }
                    }
                } else
                {
                    for (; i < length;)
                    {
                        if (callback.apply(object[i++], args) === false)
                        {
                            break;
                        }
                    }
                }

                /**
                 * Um case especial e rápido para o uso mais comum
                 * de cada um.
                 */
            } else
            {
                if (isObj)
                {
                    for (name in object)
                    {
                        if (callback.call(object[name], name, object[name]) === false)
                        {
                            break;
                        }
                    }
                } else
                {
                    for (; i < length;)
                    {
                        if (callback.call(object[i], i, object[i++]) === false)
                        {
                            break;
                        }
                    }
                }
            }

            return object;
        },

        /**
         * Use a função String.trim nativa sempre que possível.
         */
        trim: trim ?
            /**
             *
             */
            function(text)
            {
                return text == null ? "" : trim.call(text);
            } :

            /**
             * Caso contrário, use nossa própria funcionalidade
             * de remoção.
             */
            function(text)
            {
                return text == null ? "" : text.toString().replace(trimLeft, "").replace(trimRight, "");
            },

        /**
         * Resultados são apenas para uso interno.
         */
        makeArray: function(array, results)
        {
            var ret = results || [];

            if (array != null)
            {
                /**
                 * A janela, strings (e funções) também possuem 'comprimento'.
                 * Lógica ligeiramente ajustada para lidar com os problemas
                 * do Blackberry 4.7 RegExp # 6930.
                 */
                var type = jQuery.type(array);

                if (array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(array))
                {
                    push.call(ret, array);
                } else
                {
                    jQuery.merge(ret, array);
                }
            }

            return ret;
        },

        /**
         *
         */
        inArray: function(elem, array, i)
        {
            var len;

            if (array)
            {
                if (indexOf)
                {
                    return indexOf.call(array, elem, i);
                }

                len = array.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

                for (; i < len; i++)
                {
                    /**
                     * Ignore o acesso em vetores esparsas.
                     */
                    if (i in array && array[i] === elem)
                    {
                        return i;
                    }
                }
            }

            return -1;
        },

        /**
         *
         */
        merge: function(first, second)
        {
            var i = first.length,
                j = 0;

            if (typeof second.length === "number")
            {
                for (var l = second.length; j < l; j++)
                {
                    first[i++] = second[j];
                }
            } else
            {
                while (second[j] !== undefined)
                {
                    first[i++] = second[j++];
                }
            }

            first.length = i;

            return first;
        },

        /**
         *
         */
        grep: function(elems, callback, inv)
        {
            var ret = [], retVal;
                inv = !!inv;

            /**
             * Percorra o array, salvando apenas os itens que passam
             * na função validadora.
             */
            for (var i = 0, length = elems.length; i < length; i++)
            {
                retVal = !!callback(elems[i], i);

                if (inv !== retVal)
                {
                    ret.push(elems[i]);
                }
            }

            return ret;
        },

        /**
         * arg é apenas para uso interno.
         */
        map: function(elems, callback, arg)
        {
            var value,
                key,
                ret = [],
                i = 0,
                length = elems.length,

                /**
                 * Objetos jquery são tratados como arrays.
                 */
                isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || jQuery.isArray(elems));

            /**
             * Percorra o vetor, traduzindo cada um dos itens
             * para o deles.
             */
            if (isArray)
            {
                for (; i < length; i++)
                {
                    value = callback(elems[i], i, arg);

                    if (value != null)
                    {
                        ret[ret.length] = value;
                    }
                }

                /**
                 * Passe por todas as chaves do objeto.
                 */
            } else
            {
                for (key in elems)
                {
                    value = callback(elems[key], key, arg);

                    if (value != null)
                    {
                        ret[ret.length] = value;
                    }
                }
            }

            /**
             * Achate quaisquer vetores aninhados.
             */
            return ret.concat.apply([], ret);
        },

        /**
         * Um contador GUID global para objetos.
         */
        guid: 1,

        /**
         * Vincule uma função a um contexto, opcionalmente aplicando
         * parcialmente quaisquer argumentos.
         */
        proxy: function(fn, context)
        {
            if (typeof context === "string")
            {
                var tmp = fn[context];
                context = fn;

                fn = tmp;
            }

            /**
             * Verificação rápida para determinar se o alvo pode ser
             * chamado. Na especificação, isso gera um TypeError, mas
             * retornaremos apenas undefined.
             */
            if (!jQuery.isFunction(fn))
            {
                return undefined;
            }

            /**
             * Ligação simulada.
             */
            var args = slice.call(arguments, 2),
                proxy = function()
                {
                    return fn.apply(
                        context,
                        args.concat(
                            slice.call(
                                arguments
                            )
                        )
                    );
                };

            /**
             * Defina o guia do manipulador exclusivo como o mesmo
             * do manipulador original, para que possa ser removido.
             */
            proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

            return proxy;
        },

        /**
         * Método multifuncional para obter e definir valores
         * para uma coleção. O(s) valor(es) pode(m) ser executado(s)
         * opcionalmente se for uma função.
         */
        access: function(elems, key, value, exec, fn, pass)
        {
            var length = elems.length;

            /**
             * Configurando muitos atributos.
             */
            if (typeof key === "object")
            {
                for (var k in key)
                {
                    jQuery.access(elems, k, key[k], exec, fn, value);
                }

                return elems;
            }

            /**
             * Configurando um atributo.
             */
            if (value !== undefined)
            {
                /**
                 * Opcionalmente, os valores da função são executados
                 * se exec for true.
                 */
                exec = !pass && exec && jQuery.isFunction(value);

                for (var i = 0; i < length; i++)
                {
                    fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
                }

                return elems;
            }

            /**
             * Obtendo um atributo.
             */
            return length ? fn(elems[0], key) : undefined;
        },

        /**
         *
         */
        now: function()
        {
            return (new Date()).getTime();
        },

        /**
         * O uso de jQuery.browser é desaprovado.
         * Mais detalhes: http://docs.jquery.com/Utilities/jQuery.browser.
         */
        uaMatch: function(ua)
        {
            ua = ua.toLowerCase();

            var match = rwebkit.exec(ua) ||
                ropera.exec(ua) ||
                rmsie.exec(ua) ||
                ua.indexOf("compatible") < 0 && rmozilla.exec(ua) ||
                [];

            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        },

        /**
         *
         */
        sub: function()
        {
            /**
             *
             */
            function jQuerySub(selector, context)
            {
                return new jQuerySub.fn.init(selector, context);
            }

            jQuery.extend(true, jQuerySub, this);
            jQuerySub.superclass = this;
            jQuerySub.fn = jQuerySub.prototype = this();
            jQuerySub.fn.constructor = jQuerySub;
            jQuerySub.sub = this.sub;

            /**
             *
             */
            jQuerySub.fn.init = function init(selector, context)
            {
                if (context && context instanceof jQuery && !(context instanceof jQuerySub))
                {
                    context = jQuerySub(context);
                }

                return jQuery.fn.init.call(
                    this,
                    selector,
                    context,
                    rootjQuerySub
                );
            };

            jQuerySub.fn.init.prototype = jQuerySub.fn;
            var rootjQuerySub = jQuerySub(document);

            return jQuerySub;
        },

        /**
         *
         */
        browser: {}
    });

    /**
     * Preencha o mapa class2type.
     */
    jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name)
    {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    /**
     *
     */
    browserMatch = jQuery.uaMatch(userAgent);

    /**
     *
     */
    if (browserMatch.browser)
    {
        jQuery.browser[browserMatch.browser] = true;
        jQuery.browser.version = browserMatch.version;
    }

    /**
     * Obsoleto, use jQuery.browser.webkit.
     */
    if (jQuery.browser.webkit)
    {
        jQuery.browser.safari = true;
    }

    /**
     * O IE não corresponde a espaços ininterruptos com \s.
     */
    if (rnotwhite.test("\xA0"))
    {
        trimLeft = /^[\s\xA0]+/;
        trimRight = /[\s\xA0]+$/;
    }

    /**
     * Todos os objetos jQuery devem apontar para eles.
     */
    rootjQuery = jQuery(document);

    /**
     * Funções de limpeza para o método de preparação
     * de documento.
     */
    if (document.addEventListener)
    {
        DOMContentLoaded = function()
        {
            document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);

            jQuery.ready();
        };
    } else if (document.attachEvent)
    {
        DOMContentLoaded = function()
        {
            /**
             * Certifique-se de que a body exista, pelo menos,
             * caso o IE fique um pouco complexo (ticket #5443).
             */
            if (document.readyState === "complete")
            {
                document.detachEvent("onreadystatechange", DOMContentLoaded);
                jQuery.ready();
            }
        };
    }

    /**
     * A verificação de DOM pronto para o Internet Explorer.
     */
    function doScrollCheck()
    {
        if (jQuery.isReady)
        {
            return;
        }

        try
        {
            /**
             * Se o IE for usado, use o truque.
             * http://javascript.nwbox.com/IEContentLoaded/.
             */
            document.documentElement.doScroll("left");
        } catch(e)
        {
            setTimeout(doScrollCheck, 1);
            return;
        }

        /**
         * E execute quaisquer funções de espera.
         */
        jQuery.ready();
    }

    return jQuery;
})();

/**
 * Cache de formato de sinalizadores de string para objeto.
 */
var flagsCache = {};

/**
 * Converta sinalizadores formatados em String em
 * sinalizadores formatados em Objeto e armazene
 * em cache.
 */
function createFlags(flags)
{
    var object = flagsCache[flags] = {},
        i,
        length;

    flags = flags.split(/\s+/);
    for (i = 0, length = flags.length; i < length; i++)
    {
        object[flags[i]] = true;
    }

    return object;
}

/**
 * Crie uma lista de callback usando os seguintes
 * parâmetros:
 *     flags: uma lista opcional de sinalizadores separados
 *            por espaço que mudará o comportamento da lista
 *            de callback.
 *
 * Por padrão, uma lista de callback funcionará como uma
 * lista de retorno de evento e pode ser "enviada"
 * diversas vezes.
 *
 * Possíveis flags:
 *     once:        garantirá que a lista de callback só possa
 *                  ser enviada uma vez (como um Adiado).
 *     memory:      acompanhará os valores anteriores e chamará
 *                  qualquer callback adicionado após a lista
 *                  ter sido enviada imediatamente com os últimos
 *                  valores "memorizados" (como um Adiado).
 *     unique:      garantirá que um callback só possa ser adicionado
 *                  uma vez (sem duplicatas na lista).
 *     stopOnFalse: interromper chamadas quando um callback retornar false.
 */
jQuery.Callbacks = function(flags)
{
    /**
     * Converta sinalizadores de formatação de string para
     * formatação de objeto (primeiro verificamos o cache).
     */
    flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

    /**
     *
     */
    var
        /**
         * Lista de callback atual.
         */
        list = [],

        /**
         * Pilha de fogo exige listas repetíveis.
         */
        stack = [],

        /**
         * Último valor de envio (para listas inesquecíveis).
         */
        memory,

        /**
         * Sinalizador para saber se a lista está sendo
         * enviada no momento.
         */
        firing,

        /**
         * Primeiro callback para enviar (usado internamente
         * por add e fireWith).
         */
        firingStart,

        /**
         * Fim do loop ao enviar.
         */
        firingLength,

        /**
         * Índice do callback atualmente enviado (modificado
         * por remove, se necessário).
         */
        firingIndex,

        /**
         * Adicione um ou vários callbacks à lista.
         */
        add = function(args)
        {
            var i,
                length,
                elem,
                type,
                actual;

            for (i = 0, length = args.length; i < length; i++)
            {
                elem = args[i];
                type = jQuery.type(elem);

                if (type === "array")
                {
                    /**
                     * Inspecione recursivamente.
                     */
                    add(elem);
                } else if (type === "function")
                {
                    /**
                     * Adicione se não estiver no modo exclusivo e o
                     * callback não estiver ativado.
                     */
                    if (!flags.unique || !self.has(elem))
                    {
                        list.push(elem);
                    }
                }
            }
        },

        /**
         * Enviar callbacks.
         */
        fire = function(context, args)
        {
            args = args || [];
            memory = !flags.memory || [context, args];
            firing = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;

            for (; list && firingIndex < firingLength; firingIndex++)
            {
                if (list[firingIndex].apply(context, args) === false && flags.stopOnFalse)
                {
                    /**
                     * Marcar como interrompido.
                     */
                    memory = true;

                    break;
                }
            }

            firing = false;
            if (list)
            {
                if (!flags.once)
                {
                    if (stack && stack.length)
                    {
                        memory = stack.shift();
                        self.fireWith(memory[0], memory[1]);
                    }
                } else if (memory === true)
                {
                    self.disable();
                } else
                {
                    list = [];
                }
            }
        },

        /**
         * Objeto de callbacks reais.
         */
        self = {
            /**
             * Adicione um callback ou uma coleção de callback
             * à lista.
             */
            add: function()
            {
                if (list)
                {
                    var length = list.length;
                    add(arguments);

                    /**
                     * Precisamos adicionar os callbacks ao lote
                     * de envio atual ?
                     */
                    if (firing)
                    {
                        firingLength = list.length;

                        /**
                         * Com a memória, se não estivermos enviando,
                         * devemos chamar imediatamente, a menos que o
                         * envio anterior tenha sido interrompido
                         * (stopOnFalse).
                         */
                    } else if (memory && memory !== true)
                    {
                        firingStart = length;
                        fire(memory[0], memory[1]);
                    }
                }

                return this;
            },

            /**
             * Remova um callback da lista.
             */
            remove: function()
            {
                if (list)
                {
                    var args = arguments,
                        argIndex = 0,
                        argLength = args.length;

                    for (; argIndex < argLength ; argIndex++)
                    {
                        for (var i = 0; i < list.length; i++)
                        {
                            if (args[argIndex] === list[i])
                            {
                                /**
                                 * Lidar com firingIndex e firingLength.
                                 */
                                if (firing)
                                {
                                    if (i <= firingLength)
                                    {
                                        firingLength--;

                                        if (i <= firingIndex)
                                        {
                                            firingIndex--;
                                        }
                                    }
                                }

                                /**
                                 * Remova o elemento.
                                 */
                                list.splice( i--, 1 );

                                /**
                                 * Se tivermos alguma propriedade de unicidade,
                                 * só precisaremos fazer isso uma vez.
                                 */
                                if (flags.unique)
                                {
                                    break;
                                }
                            }
                        }
                    }
                }

                return this;
            },

            /**
             * Controla se um determinado callback está na lista.
             */
            has: function(fn)
            {
                if (list)
                {
                    var i = 0,
                        length = list.length;

                    for (; i < length; i++)
                    {
                        if (fn === list[i])
                        {
                            return true;
                        }
                    }
                }

                return false;
            },

            /**
             * Remova todos os callbacks da lista.
             */
            empty: function()
            {
                list = [];

                return this;
            },

            /**
             * Faça com que a lista não faça mais nada.
             */
            disable: function()
            {
                list = stack = memory = undefined;

                return this;
            },

            /**
             * Está desabilitado ?
             */
            disabled: function()
            {
                return !list;
            },

            /**
             * Bloqueie a lista em seu estado atual.
             */
            lock: function()
            {
                stack = undefined;

                if (!memory || memory === true)
                {
                    self.disable();
                }

                return this;
            },

            /**
             * Está bloqueado ?
             */
            locked: function()
            {
                return !stack;
            },

            /**
             * Chame todos os callbacks com o contexto e os
             * argumentos fornecidos.
             */
            fireWith: function(context, args)
            {
                if (stack)
                {
                    if (firing)
                    {
                        if (!flags.once)
                        {
                            stack.push([context, args]);
                        }
                    } else if (!(flags.once && memory))
                    {
                        fire(context, args);
                    }
                }

                return this;
            },

            /**
             * Chame todos os callbacks com os argumentos fornecidos.
             */
            fire: function()
            {
                self.fireWith(this, arguments);

                return this;
            },

            /**
             * Para saber se os callbacks já foram chamados pelo
             * menos uma vez.
             */
            fired: function()
            {
                return !!memory;
            }
        };

        return self;
    };

    /**
     *
     */
    var
        /**
         * Referência estática à slice.
         */
        sliceDeferred = [].slice;

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        Deferred: function(func)
        {
            var doneList = jQuery.Callbacks("once memory"),
                failList = jQuery.Callbacks("once memory"),
                progressList = jQuery.Callbacks("memory"),
                state = "pending",

            /**
             *
             */
            lists = {
                /**
                 *
                 */
                resolve: doneList,

                /**
                 *
                 */
                reject: failList,

                /**
                 *
                 */
                notify: progressList
            },

            /**
             *
             */
            promise = {
                /**
                 *
                 */
                done: doneList.add,

                /**
                 *
                 */
                fail: failList.add,

                /**
                 *
                 */
                progress: progressList.add,

                /**
                 *
                 */
                state: function()
                {
                    return state;
                },

                /**
                 * @deprecated.
                 */
                isResolved: doneList.fired,

                /**
                 * @deprecated.
                 */
                isRejected: failList.fired,

                /**
                 *
                 */
                then: function(doneCallbacks, failCallbacks, progressCallbacks)
                {
                    deferred.done(doneCallbacks).fail(failCallbacks).progress(progressCallbacks);

                    return this;
                },

                /**
                 *
                 */
                always: function()
                {
                    deferred.done.apply(deferred, arguments).fail.apply(deferred, arguments);

                    return this;
                },

                /**
                 *
                 */
                pipe: function(fnDone, fnFail, fnProgress)
                {
                    return jQuery.Deferred(function(newDefer)
                    {
                        jQuery.each({
                            /**
                             *
                             */
                            done: [
                                fnDone,
                                "resolve"
                            ],

                            /**
                             *
                             */
                            fail: [
                                fnFail,
                                "reject"
                            ],

                            /**
                             *
                             */
                            progress: [
                                fnProgress,
                                "notify"
                            ]
                        }, function(handler, data)
                        {
                            var fn = data[0],
                                action = data[1],
                                returned;

                            if (jQuery.isFunction(fn))
                            {
                                deferred[handler](function()
                                {
                                    returned = fn.apply(this, arguments);

                                    if (returned && jQuery.isFunction(returned.promise))
                                    {
                                        returned.promise().then(
                                            newDefer.resolve,
                                            newDefer.reject,
                                            newDefer.notify
                                        );
                                    } else
                                    {
                                        newDefer[action + "With"](this === deferred ? newDefer : this, [returned]);
                                    }
                                });
                            } else
                            {
                                deferred[handler](newDefer[action]);
                            }
                        });
                    }).promise();
                },

                /**
                 * Obtenha uma promessa para este adiamento. Se obj
                 * for fornecido, o aspecto da promessa será adicionado
                 * ao objeto.
                 */
                promise: function(obj)
                {
                    if (obj == null)
                    {
                        obj = promise;
                    } else
                    {
                        for (var key in promise)
                        {
                            obj[key] = promise[key];
                        }
                    }

                    return obj;
                }
            },

            deferred = promise.promise({}),
            key;

            for (key in lists)
            {
                deferred[key] = lists[key].fire;
                deferred[key + "With"] = lists[key].fireWith;
            }

            /**
             * Lidar com estado.
             */
            deferred.done(function()
            {
                state = "resolved";
            }, failList.disable, progressList.lock).fail(function()
            {
                state = "rejected";
            }, doneList.disable, progressList.lock);

            /**
             * Chame a função fornecida, se houver.
             */
            if (func)
            {
                func.call(deferred, deferred);
            }

            /**
             * Tudo feito !
             */
            return deferred;
        },

        /**
         * Ajudante adiado.
         */
        when: function(firstParam)
        {
            var args = sliceDeferred.call(arguments, 0),
                i = 0,
                length = args.length,
                pValues = new Array(length),
                count = length,
                pCount = length,
                deferred = length <= 1 && firstParam && jQuery.isFunction(firstParam.promise) ? firstParam : jQuery.Deferred(),
                promise = deferred.promise();

            /**
             *
             */
            function resolveFunc(i)
            {
                return function(value)
                {
                    args[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;

                    if (!(--count))
                    {
                        deferred.resolveWith(deferred, args);
                    }
                };
            }

            /**
             *
             */
            function progressFunc(i)
            {
                return function(value)
                {
                    pValues[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
                    deferred.notifyWith(promise, pValues);
                };
            }

            /**
             *
             */
            if (length > 1)
            {
                for (; i < length; i++)
                {
                    if (args[i] && args[i].promise && jQuery.isFunction(args[i].promise))
                    {
                        args[i].promise().then(resolveFunc(i), deferred.reject, progressFunc(i));
                    } else
                    {
                        --count;
                    }
                }

                if (!count)
                {
                    deferred.resolveWith(deferred, args);
                }
            } else if (deferred !== firstParam)
            {
                deferred.resolveWith(deferred, length ? [firstParam] : []);
            }

            return promise;
        }
    });

    /**
     *
     */
    jQuery.support = (function()
    {
        var support,
            all,
            a,
            select,
            opt,
            input,
            marginDiv,
            fragment,
            tds,
            events,
            eventName,
            i,
            isSupported,
            div = document.createElement("div"),
            documentElement = document.documentElement;

        /**
         * Testes preliminares.
         */
        div.setAttribute("className", "t");
        div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

        all = div.getElementsByTagName("*");
        a = div.getElementsByTagName("a")[0];

        /**
         * Não é possível obter suporte de teste básico.
         */
        if (!all || !all.length || !a)
        {
            return {};
        }

        /**
         * Primeiro lote de testes de suporte.
         */
        select = document.createElement("select");
        opt = select.appendChild(document.createElement("option"));
        input = div.getElementsByTagName("input")[0];

        /**
         *
         */
        support = {
            /**
             * O IE remove os espaços em branco iniciais quando
             * .innerHTML é usado.
             */
            leadingWhitespace: (div.firstChild.nodeType === 3),

            /**
             * Certifique-se de que os elementos tbody não sejam
             * inseridos automaticamente. O IE irá inseri-los em
             * tabelas vazias.
             */
            tbody: !div.getElementsByTagName("tbody").length,

            /**
             * Certifique-se de que os elementos do link sejam
             * serializados corretamente pelo innerHTML. Isso
             * requer um elemento wrapper no IE.
             */
            htmlSerialize: !!div.getElementsByTagName("link").length,

            /**
             * Obtenha as informações de estilo de getAttribute
             * (o IE usa .cssText).
             */
            style: /top/.test( a.getAttribute("style") ),

            /**
             * Certifique-se de que os URLs não sejam manipulados
             * (o IE os normaliza por padrão).
             */
            hrefNormalized: (a.getAttribute("href") === "/a"),

            /**
             * Certifique-se de que existe opacidade do elemento
             * (o IE usa filtro). Use um regex para solucionar
             * uma falha do WebKit. Consulte #5145.
             */
            opacity: /^0.55/.test(a.style.opacity),

            /**
             * Verifique a existência do estilo float (o IE
             * usa styleFloat em vez de cssFloat).
             */
            cssFloat: !!a.style.cssFloat,

            /**
             * Certifique-se de que, se nenhum valor for especificado
             * para uma caixa de seleção, o padrão seja "on". (O padrão
             * do WebKit é "").
             */
            checkOn: ( input.value === "on" ),

            /**
             * Certifique-se de que uma opção selecionada por
             * padrão tenha uma propriedade selecionada funcional.
             * (O padrão do WebKit é false em vez de true, ou seja,
             * também, se estiver em um optgroup).
             */
            optSelected: opt.selected,

            /**
             * Teste setAttribute na classe camelCase. Se funcionar,
             * precisaremos de attrFixes ao fazer o procedimento de
             * get/setAttribute (ie6/7).
             */
            getSetAttribute: div.className !== "t",

            /**
             * Testes para suporte a enctype em um formulário (#6743).
             */
            enctype: !!document.createElement("form").enctype,

            /**
             * Garante que a clonagem de um elemento HTML5 não cause
             * problemas. Onde outerHTML é undefined, isso ainda
             * funciona.
             */
            html5Clone: document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",

            /**
             * Será definido posteriormente.
             */
            submitBubbles: true,

            /**
             *
             */
            changeBubbles: true,

            /**
             *
             */
            focusinBubbles: false,

            /**
             *
             */
            deleteExpando: true,

            /**
             *
             */
            noCloneEvent: true,

            /**
             *
             */
            inlineBlockNeedsLayout: false,

            /**
             *
             */
            shrinkWrapBlocks: false,

            /**
             *
             */
            reliableMarginRight: true
        };

        /**
         * Certifique-se de que o status verificado esteja
         * clonado corretamente.
         */
        input.checked = true;

        /**
         *
         */
        support.noCloneChecked = input.cloneNode(true).checked;

        /**
         * Certifique-se de que as opções dentro das seleções desabilitadas
         * não estejam marcadas como desabilitadas (o WebKit as marca como
         * desabilitadas).
         */
        select.disabled = true;

        /**
         *
         */
        support.optDisabled = !opt.disabled;

        /**
         * Teste para ver se é possível excluir um expando
         * de um elemento. Falha no Internet Explorer.
         */
        try
        {
            delete div.test;
        } catch(e)
        {
            support.deleteExpando = false;
        }

        if (!div.addEventListener && div.attachEvent && div.fireEvent)
        {
            div.attachEvent("onclick", function()
            {
                /**
                 * A clonagem de um nó não deve copiar nenhum manipulador
                 * de eventos vinculado (o IE faz isso).
                 */
                support.noCloneEvent = false;
            });

            div.cloneNode(true).fireEvent("onclick");
        }

        /**
         * Verifique se um rádio mantém seu valor após ser
         * anexado ao DOM.
         */
        input = document.createElement("input");
        input.value = "t";
        input.setAttribute("type", "radio");
        support.radioValue = input.value === "t";

        input.setAttribute("checked", "checked");
        div.appendChild(input);
        fragment = document.createDocumentFragment();
        fragment.appendChild(div.lastChild);

        /**
         * O WebKit não clona o estado verificado corretamente
         * em fragmentos.
         */
        support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

        /**
         * Verifique se uma caixa de seleção desconectada manterá
         * seu valor verificado como true após anexada ao DOM (IE6/7).
         */
        support.appendChecked = input.checked;

        fragment.removeChild(input);
        fragment.appendChild(div);

        div.innerHTML = "";

        /**
         * Verifique se div com largura explícita e sem margem
         * direita é computado incorretamente com margem direita
         * com base na largura do contêiner. Para mais informações,
         * consulte o bug #3333. Falha no WebKit antes das noites
         * de fevereiro de 2011 WebKit Bug 13343 - getComputedStyle
         * retorna valor errado para margin-right.
         */
        if (window.getComputedStyle)
        {
            marginDiv = document.createElement( "div" );
            marginDiv.style.width = "0";
            marginDiv.style.marginRight = "0";

            div.style.width = "2px";
            div.appendChild( marginDiv );
            support.reliableMarginRight = (
                parseInt(
                    (
                        window.getComputedStyle(marginDiv, null) || { marginRight: 0 }
                    ).marginRight, 10
                ) || 0
            ) === 0;
        }

        /**
         * Técnica.
         * http://perfectionkills.com/detecting-event-support-without-browser-sniffing/.
         *
         * Nós apenas nos preocupamos com o caso em que são usados
         * sistemas de eventos não padronizados, nomeadamente no IE.
         * O pequêno ciclo aqui nos ajuda a evitar uma chamada eval
         * (em setAttribute) que pode fazer com que o CSP fique
         * descontrolado. Veja: https://developer.mozilla.org/en/Security/CSP.
         */
        if (div.attachEvent)
        {
            for(i in { submit: 1, change: 1, focusin: 1 })
            {
                eventName = "on" + i;
                isSupported = (eventName in div);

                if (!isSupported)
                {
                    div.setAttribute(eventName, "return;");
                    isSupported = (typeof div[eventName] === "function");
                }

                support[i + "Bubbles"] = isSupported;
            }
        }

        /**
         *
         */
        fragment.removeChild(div);

        /**
         * Elementos Null para evitar vazamentos no IE.
         */
        fragment = select = opt = marginDiv = div = input = null;

        /**
         * Execute testes que precisam de um body pronto para
         * o documento.
         */
        jQuery(function()
        {
            var container,
                outer,
                inner,
                table,
                td,
                offsetSupport,
                conMarginTop,
                ptlm,
                vb,
                style,
                html,
                body = document.getElementsByTagName("body")[0];

            if (!body)
            {
                /**
                 * Devolve para documentos de conjunto de quadros que
                 * não possuem um body.
                 */
                return;
            }

            conMarginTop = 1;
            ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
            vb = "visibility:hidden;border:0;";
            style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
            html = "<div " + style + "><div></div></div>" +
                "<table " + style + " cellpadding='0' cellspacing='0'>" +
                "<tr><td></td></tr></table>";

            container = document.createElement("div");
            container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
            body.insertBefore( container, body.firstChild );

            /**
             * Construa o elemento de teste.
             */
            div = document.createElement("div");
            container.appendChild(div);

            /**
             * Verifique se as células da tabela ainda tem offsetWidth/Height
             * quando estão configuradas para `display: none` e ainda há outras
             * células visíveis da tabela em uma linha da tabela; nesse caso,
             * offsetWidth/Height não são confiáveis para uso ao determinar se
             * um elemento foi oculto diretamente usando `display: none` (ainda
             * é seguro usar deslocamentos se um elemento pai estiver oculto;
             * use óculos de segurança e consulte o bug #4512 para obter mais
             * informações). (apenas o IE 8 falha neste teste).
             */
            div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
            tds = div.getElementsByTagName("td");
            isSupported = (tds[0].offsetHeight === 0);

            tds[0].style.display = "";
            tds[1].style.display = "none";

            /**
             * Verifique se as células vazias da tabela ainda possuem
             * offsetWidth/Height (IE <= 8 falha neste teste).
             */
            support.reliableHiddenOffsets = isSupported && (
                tds[0].offsetHeight === 0
            );

            /**
             * Descubra se o modelo de caixa W3C funciona conforme
             * o esperado.
             */
            div.innerHTML = "";
            div.style.width = div.style.paddingLeft = "1px";
            jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

            if (typeof div.style.zoom !== "undefined")
            {
                /**
                 * Verifique se os elementos nativos de nível de bloco
                 * agem como elementos de bloco embutido ao definir sua
                 * exibição como 'inline' e fornecer-lhes o layout.
                 * (IE < 8 faz isso).
                 */
                div.style.display = "inline";
                div.style.zoom = 1;
                support.inlineBlockNeedsLayout = (div.offsetWidth === 2);

                /**
                 * Verifique se os elementos com layout encolhem seus
                 * filhos (o IE 6 faz isso).
                 */
                div.style.display = "";
                div.innerHTML = "<div style='width:4px;'></div>";
                support.shrinkWrapBlocks = (div.offsetWidth !== 2);
            }

            div.style.cssText = ptlm + vb;
            div.innerHTML = html;

            outer = div.firstChild;
            inner = outer.firstChild;
            td = outer.nextSibling.firstChild.firstChild;

            offsetSupport = {
                doesNotAddBorder: (inner.offsetTop !== 5),
                doesAddBorderForTableAndCells: (td.offsetTop === 5)
            };

            inner.style.position = "fixed";
            inner.style.top = "20px";

            /**
             * Safari subtrai a largura da borda pai aqui,
             * que é 5px.
             */
            offsetSupport.fixedPosition = (inner.offsetTop === 20 || inner.offsetTop === 15);
            inner.style.position = inner.style.top = "";

            outer.style.overflow = "hidden";
            outer.style.position = "relative";

            offsetSupport.subtractsBorderForOverflowNotVisible = (inner.offsetTop === -5);
            offsetSupport.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== conMarginTop);

            body.removeChild(container);
            div  = container = null;

            jQuery.extend(support, offsetSupport);
        });

        return support;
    })();

    /**
     *
     */
    var rbrace = /^(?:\{.*\}|\[.*\])$/,
        rmultiDash = /([A-Z])/g;

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        cache: {},

        /**
         * Por favor, use com cuidado.
         */
        uuid: 0,

        /**
         * Único para cada cópia do jQuery na página. Não dígitos
         * removidos para corresponder ao rinlinejQuery.
         */
        expando: "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ""),

        /**
         * Os elementos a seguir lançam exceções que não podem ser
         * capturadas se você tentar adicionar propriedades expando
         * a eles.
         */
        noData: {
            /**
             *
             */
            "embed": true,

            /**
             * Banir todos os objetos, exceto Flash (que lida
             * com expansões).
             */
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",

            /**
             *
             */
            "applet": true
        },

        /**
         *
         */
        hasData: function(elem)
        {
            elem = elem.nodeType ? jQuery.cache[
                elem[jQuery.expando]
            ] : elem[jQuery.expando];

            return !!elem && !isEmptyDataObject(elem);
        },

        /**
         * pvt - Somente para uso interno.
         */
        data: function(elem, name, data, pvt)
        {
            if (!jQuery.acceptData(elem))
            {
                return;
            }

            var privateCache,
                thisCache,
                ret,
                internalKey = jQuery.expando,
                getByName = typeof name === "string",

                /**
                 * Temos que lidar com nós DOM e objetos JS de maneira
                 * diferente porque o IE6-7 não pode fazer referências
                 * de objetos GC corretamente através do limite DOM-JS.
                 */
                isNode = elem.nodeType,

                /**
                 * Apenas os nós DOM precisam do cache jQuery global;
                 * Os dados do objeto JS são anexados diretamente ao
                 * objeto para que o GC possa ocorrer automaticamente.
                 */
                cache = isNode ? jQuery.cache : elem,

                /**
                 * Somente definir um ID para objetos JS se seu cache
                 * já existir permite que o código acesse o mesmo
                 * caminho de um nó DOM sem cache.
                 */
                id = isNode ? elem[internalKey] : elem[internalKey] && internalKey,
                isEvents = name === "events";

            /**
             * Evite fazer mais trabalho do que o necessário ao
             * tentar obter dados em um objeto que não contém
             * nenhum dado.
             */
            if ((!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined)
            {
                return;
            }

            if (!id)
            {
                /**
                 * Apenas os nós DOM precisam de um novo ID exclusivo
                 * para cada elemento, pois seus dados acabam no cache
                 * global.
                 */
                if (isNode)
                {
                    elem[internalKey] = id = ++jQuery.uuid;
                } else
                {
                    id = internalKey;
                }
            }

            if (!cache[id])
            {
                cache[id] = {};

                /**
                 * Evita a exposição de metadados jQuery em objetos
                 * JS simples quando o objeto é serializado usando
                 * JSON.stringify.
                 */
                if (!isNode)
                {
                    cache[id].toJSON = jQuery.noop;
                }
            }

            /**
             * Um objeto pode ser passado para jQuery.data em
             * vez de um par chave/valor; isso é copiado
             * superficialmente para o cache existente.
             */
            if (typeof name === "object" || typeof name === "function")
            {
                if (pvt)
                {
                    cache[id] = jQuery.extend(cache[id], name);
                } else
                {
                    cache[id].data = jQuery.extend(cache[id].data, name);
                }
            }

            /**
             *
             */
            privateCache = thisCache = cache[id];

            /**
             * jQuery data() é armazenado em um objeto separado
             * dentro do cache de dados interno do objeto para
             * evitar colisões importantes entre dados internos
             * e dados definidos pelo usuário.
             */
            if (!pvt)
            {
                if (!thisCache.data)
                {
                    thisCache.data = {};
                }

                thisCache = thisCache.data;
            }

            if (data !== undefined)
            {
                thisCache[
                    jQuery.camelCase(name)
                ] = data;
            }

            /**
             * Os usuários não devem tentar inspecionar o objeto
             * de eventos internos usando jQuery.data, pois ele
             * não está documentado e está sujeito a alterações.
             * Mas alguém escuta o stream ? Não.
             */
            if (isEvents && !thisCache[name])
            {
                return privateCache.events;
            }

            /**
             * Verifique nomes de propriedades de dados convertidos
             * em camel e não convertidos. Se uma propriedade de
             * dados foi especificada.
             */
            if (getByName)
            {
                /**
                 * Primeiro, tente encontrar dados de propriedade no
                 * estado em que se encontram.
                 */
                ret = thisCache[name];

                /**
                 * Teste para dados de propriedade null|undefined.
                 */
                if (ret == null)
                {
                    /**
                     * Tente encontrar a propriedade camelCased.
                     */
                    ret = thisCache[
                        jQuery.camelCase(name)
                    ];
                }
            } else
            {
                ret = thisCache;
            }

            return ret;
        },

        /**
         * pvt - Somente para uso interno.
         */
        removeData: function(elem, name, pvt)
        {
            if (!jQuery.acceptData(elem))
            {
                return;
            }

            var thisCache,
                i,
                l,

                /**
                 * Referência à chave do cache de dados interno.
                 */
                internalKey = jQuery.expando,

                /**
                 *
                 */
                isNode = elem.nodeType,

                /**
                 * Consulte jQuery.data para obter mais informações.
                 */
                cache = isNode ? jQuery.cache : elem,

                /**
                 * Consulte jQuery.data para obter mais informações.
                 */
                id = isNode ? elem[internalKey] : internalKey;

            /**
             * Se já não houver nenhuma entrada de cache para este
             * objeto, não há motivo para continuar.
             */
            if (!cache[id])
            {
                return;
            }

            if (name)
            {
                thisCache = pvt ? cache[id] : cache[id].data;

                if (thisCache)
                {
                    /**
                     * Suporta nomes de vetores ou strings separadas por
                     * espaço para chaves de dados.
                     */
                    if (!jQuery.isArray(name))
                    {
                        /**
                         * Experimente a string como chave antes de qualquer
                         * manipulação.
                         */
                        if (name in thisCache)
                        {
                            name = [name];
                        } else
                        {
                            /**
                             * Divida a versão com camel cased por espaços,
                             * a menos que exista uma chave com os espaços.
                             */
                            name = jQuery.camelCase(name);

                            if (name in thisCache)
                            {
                                name = [name];
                            } else
                            {
                                name = name.split(" ");
                            }
                        }
                    }

                    for (i = 0, l = name.length; i < l; i++)
                    {
                        delete thisCache[name[i]];
                    }

                    /**
                     * Se não houver mais dados no cache, queremos continuar
                     * e deixar o próprio objeto do cache ser removido.
                     */
                    if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache))
                    {
                        return;
                    }
                }
            }

            /**
             * Consulte jQuery.data para obter mais informações.
             */
            if (!pvt)
            {
                delete cache[id].data;

                /**
                 * Não remova o cache da camada mais alta, a menos que o
                 * objeto de dados interno tenha sido a única coisa que
                 * restou nele.
                 */
                if (!isEmptyDataObject(cache[id]))
                {
                    return;
                }
            }

            /**
             * Os navegadores que falham na exclusão do expando
             * também se recusam a excluir o expandos na janela,
             * mas permitirão isso em todos os outros objetos JS;
             * outros navegadores não se importam. Certifique-se
             * de que `cache` não seja um objeto de janela #10080.
             */
            if (jQuery.support.deleteExpando || !cache.setInterval)
            {
                delete cache[id];
            } else
            {
                cache[id] = null;
            }

            /**
             * Removemos o cache e precisamos eliminar o expando no
             * nó para evitar falsas pesquisas no cache por entradas
             * que não existem mais.
             */
            if (isNode)
            {
                /**
                 * O IE não nos permite excluir propriedades expando
                 * dos nodes, nem possui uma função removeAttribute
                 * nos nodes do Documento; devemos lidar com todos
                 * esses casos.
                 */
                if (jQuery.support.deleteExpando)
                {
                    delete elem[internalKey];
                } else if (elem.removeAttribute)
                {
                    elem.removeAttribute(internalKey);
                } else
                {
                    elem[internalKey] = null;
                }
            }
        },

        /**
         * Apenas para uso interno.
         */
        _data: function(elem, name, data)
        {
            return jQuery.data(elem, name, data, true);
        },

        /**
         * Um método para determinar se um nó DOM pode lidar com
         * a expansão de dados.
         */
        acceptData: function(elem)
        {
            if (elem.nodeName)
            {
                var match = jQuery.noData[
                    elem.nodeName.toLowerCase()
                ];

                if (match)
                {
                    return !(match === true || elem.getAttribute("classid") !== match);
                }
            }

            return true;
        }
    });

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        data: function(key, value)
        {
            var parts,
                attr,
                name,
                data = null;

            if (typeof key === "undefined")
            {
                if (this.length)
                {
                    data = jQuery.data(this[0]);

                    if (this[0].nodeType === 1 && !jQuery._data(this[0], "parsedAttrs"))
                    {
                        attr = this[0].attributes;
                        for (var i = 0, l = attr.length; i < l; i++)
                        {
                            name = attr[i].name;
                            if (name.indexOf("data-") === 0)
                            {
                                name = jQuery.camelCase(name.substring(5));
                                dataAttr(this[0], name, data[name]);
                            }
                        }

                        jQuery._data(this[0], "parsedAttrs", true);
                    }
                }

                return data;
            } else if (typeof key === "object")
            {
                return this.each(function()
                {
                    jQuery.data(this, key);
                });
            }

            parts = key.split(".");
            parts[1] = parts[1] ? "." + parts[1] : "";

            if (value === undefined)
            {
                data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

                /**
                 * Tente primeiro buscar todos os dados armazenados
                 * internamente.
                 */
                if (data === undefined && this.length)
                {
                    data = jQuery.data(this[0], key);
                    data = dataAttr(this[0], key, data);
                }

                return data === undefined && parts[1] ?
                    this.data(parts[0]) :
                    data;
            } else
            {
                return this.each(function()
                {
                    var self = jQuery(this),
                        args = [
                            parts[0],
                            value
                        ];

                    self.triggerHandler("setData" + parts[1] + "!", args);
                    jQuery.data(this, key, value);
                    self.triggerHandler("changeData" + parts[1] + "!", args);
                });
            }
        },

        /**
         *
         */
        removeData: function(key)
        {
            return this.each(function()
            {
                jQuery.removeData(this, key);
            });
        }
    });

    /**
     *
     */
    function dataAttr(elem, key, data)
    {
        /**
         * Se nada foi encontrado internamente, tente buscar
         * quaisquer dados do atributo data-* do HTML5.
         */
        if (data === undefined && elem.nodeType === 1)
        {
            var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

            /**
             *
             */
            data = elem.getAttribute(name);

            /**
             *
             */
            if (typeof data === "string")
            {
                try
                {
                    data = data === "true" ? true :
                    data === "false" ? false :
                    data === "null" ? null :

                    jQuery.isNumeric(data) ? parseFloat(data) :
                        rbrace.test(data) ? jQuery.parseJSON(data) :
                        data;
                } catch(e)
                {
                }

                /**
                 * Certifique-se de definir os dados para que não
                 * sejam alterados posteriormente.
                 */
                jQuery.data(elem, key, data);
            } else
            {
                data = undefined;
            }
        }

        return data;
    }

    /**
     * Verifica se há vazio em um objeto de cache.
     */
    function isEmptyDataObject(obj)
    {
        for (var name in obj)
        {
            /**
             * Se o objeto de dados públicos estiver vazio, o privado
             * ainda estará vazio.
             */
            if (name === "data" && jQuery.isEmptyObject(obj[name]))
            {
                continue;
            }

            if (name !== "toJSON")
            {
                return false;
            }
        }

        return true;
    }

    /**
     *
     */
    function handleQueueMarkDefer(elem, type, src)
    {
        var deferDataKey = type + "defer",
            queueDataKey = type + "queue",
            markDataKey = type + "mark",
            defer = jQuery._data(elem, deferDataKey);

        if (defer && (src === "queue" || !jQuery._data(elem, queueDataKey)) && (src === "mark" || !jQuery._data(elem, markDataKey)))
        {
            /**
             * Dê espaço para que os callbacks codificados
             * sejam acionados primeiro e, eventualmente,
             * marquem/coloquem outra coisa na fila no elemento.
             */
            setTimeout(function()
            {
                if (!jQuery._data(elem, queueDataKey) && !jQuery._data(elem, markDataKey))
                {
                    jQuery.removeData(elem, deferDataKey, true);
                    defer.fire();
                }
            }, 0);
        }
    }

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        _mark: function(elem, type)
        {
            if (elem)
            {
                type = (type || "fx") + "mark";
                jQuery._data(elem, type, (jQuery._data(elem, type) || 0) + 1);
            }
        },

        /**
         *
         */
        _unmark: function(force, elem, type)
        {
            if (force !== true)
            {
                type = elem;
                elem = force;
                force = false;
            }

            if (elem)
            {
                type = type || "fx";
                var key = type + "mark",
                    count = force ? 0 : ((jQuery._data(elem, key) || 1) - 1);

                if (count)
                {
                    jQuery._data(elem, key, count);
                } else
                {
                    jQuery.removeData(elem, key, true);
                    handleQueueMarkDefer(elem, type, "mark");
                }
            }
        },

        /**
         *
         */
        queue: function(elem, type, data)
        {
            var q;
            if (elem)
            {
                type = (type || "fx") + "queue";
                q = jQuery._data(elem, type);

                /**
                 * Acelere o desenfileiramento saindo rapidamente
                 * se for apenas uma pesquisa.
                 */
                if (data)
                {
                    if (!q || jQuery.isArray(data))
                    {
                        q = jQuery._data(elem, type, jQuery.makeArray(data));
                    } else
                    {
                        q.push(data);
                    }
                }

                return q || [];
            }
        },

        /**
         *
         */
        dequeue: function( elem, type)
        {
            type = type || "fx";

            var queue = jQuery.queue(elem, type),
                fn = queue.shift(),
                hooks = {};

            /**
             * Se a fila fx for retirada da fila, sempre remova
             * o sentinela de progresso.
             */
            if (fn === "inprogress")
            {
                fn = queue.shift();
            }

            if (fn)
            {
                /**
                 * Adicione uma sentinela de progresso para evitar
                 * que a fila fx seja automaticamente retirada da
                 * fila.
                 */
                if (type === "fx")
                {
                    queue.unshift("inprogress");
                }

                jQuery._data(elem, type + ".run", hooks);
                fn.call(elem, function()
                {
                    jQuery.dequeue(elem, type);
                }, hooks);
            }

            if (!queue.length)
            {
                jQuery.removeData(elem, type + "queue " + type + ".run", true);
                handleQueueMarkDefer(elem, type, "queue");
            }
        }
    });

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        queue: function(type, data)
        {
            if (typeof type !== "string")
            {
                data = type;
                type = "fx";
            }

            if (data === undefined)
            {
                return jQuery.queue(this[0], type);
            }

            return this.each(function()
            {
                var queue = jQuery.queue( this, type, data );

                if (type === "fx" && queue[0] !== "inprogress")
                {
                    jQuery.dequeue(this, type);
                }
            });
        },

        /**
         *
         */
        dequeue: function(type)
        {
            return this.each(function()
            {
                jQuery.dequeue(this, type);
            });
        },

        /**
         * Baseado no plugin de Clint Helfers, com permissão.
         * http://blindsignals.com/index.php/2009/07/jquery-delay/.
         */
        delay: function(time, type)
        {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || "fx";

            return this.queue(type, function(next, hooks)
            {
                var timeout = setTimeout(next, time);

                hooks.stop = function()
                {
                    clearTimeout(timeout);
                };
            });
        },

        /**
         *
         */
        clearQueue: function(type)
        {
            return this.queue(type || "fx", []);
        },

        /**
         * Resolva uma promessa quando filas de um determinado
         * tipo forem esvaziadas (fx é o tipo por padrão).
         */
        promise: function(type, object)
        {
            if (typeof type !== "string")
            {
                object = type;
                type = undefined;
            }

            type = type || "fx";
            var defer = jQuery.Deferred(),
                elements = this,
                i = elements.length,
                count = 1,
                deferDataKey = type + "defer",
                queueDataKey = type + "queue",
                markDataKey = type + "mark",
                tmp;

            /**
             *
             */
            function resolve()
            {
                if (!(--count))
                {
                    defer.resolveWith(elements, [elements]);
                }
            }

            /**
             *
             */
            while (i--)
            {
                if ((tmp = jQuery.data(elements[i], deferDataKey, undefined, true) || (jQuery.data(elements[i], queueDataKey, undefined, true) || jQuery.data(elements[i], markDataKey, undefined, true)) && jQuery.data(elements[i], deferDataKey, jQuery.Callbacks("once memory"), true)))
                {
                    count++;
                    tmp.add(resolve);
                }
            }

            resolve();

            return defer.promise();
        }
    });

    /**
     *
     */
    var rclass = /[\n\t\r]/g,
        rspace = /\s+/,
        rreturn = /\r/g,
        rtype = /^(?:button|input)$/i,
        rfocusable = /^(?:button|input|object|select|textarea)$/i,
        rclickable = /^a(?:rea)?$/i,
        rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        getSetAttribute = jQuery.support.getSetAttribute,
        nodeHook,
        boolHook,
        fixSpecified;

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        attr: function(name, value)
        {
            return jQuery.access(this, name, value, true, jQuery.attr);
        },

        /**
         *
         */
        removeAttr: function(name)
        {
            return this.each(function()
            {
                jQuery.removeAttr(this, name);
            });
        },

        /**
         *
         */
        prop: function(name, value)
        {
            return jQuery.access(this, name, value, true, jQuery.prop);
        },

        /**
         *
         */
        removeProp: function(name)
        {
            name = jQuery.propFix[name] || name;

            return this.each(function()
            {
                /**
                 * try/catch lida com casos em que o IE hesita (como
                 * remover uma propriedade na janela).
                 */
                try
                {
                    this[name] = undefined;
                    delete this[name];
                } catch(e)
                {
                }
            });
        },

        /**
         *
         */
        addClass: function(value)
        {
            var classNames,
                i,
                l,
                elem,
                setClass,
                c,
                cl;

            if (jQuery.isFunction(value))
            {
                return this.each(function(j)
                {
                    jQuery(this).addClass(value.call(this, j, this.className));
                });
            }

            if (value && typeof value === "string")
            {
                classNames = value.split(rspace);

                for (i = 0, l = this.length; i < l; i++)
                {
                    elem = this[i];

                    if (elem.nodeType === 1)
                    {
                        if (!elem.className && classNames.length === 1)
                        {
                            elem.className = value;
                        } else
                        {
                            setClass = " " + elem.className + " ";

                            for (c = 0, cl = classNames.length; c < cl; c++)
                            {
                                if (!~setClass.indexOf(" " + classNames[c] + " "))
                                {
                                    setClass += classNames[c] + " ";
                                }
                            }

                            elem.className = jQuery.trim(setClass);
                        }
                    }
                }
            }

            return this;
        },

        /**
         *
         */
        removeClass: function(value)
        {
            var classNames,
                i,
                l,
                elem,
                className,
                c,
                cl;

            if (jQuery.isFunction(value))
            {
                return this.each(function(j)
                {
                    jQuery(this).removeClass(value.call(this, j, this.className));
                });
            }

            if ((value && typeof value === "string") || value === undefined)
            {
                classNames = (value || "").split(rspace);

                for (i = 0, l = this.length; i < l; i++)
                {
                    elem = this[i];

                    if (elem.nodeType === 1 && elem.className)
                    {
                        if (value)
                        {
                            className = (" " + elem.className + " ").replace(rclass, " ");

                            for (c = 0, cl = classNames.length; c < cl; c++)
                            {
                                className = className.replace(" " + classNames[c] + " ", " ");
                            }

                            elem.className = jQuery.trim(className);
                        } else
                        {
                            elem.className = "";
                        }
                    }
                }
            }

            return this;
        },

        /**
         *
         */
        toggleClass: function(value, stateVal)
        {
            var type = typeof value,
                isBool = typeof stateVal === "boolean";

            if (jQuery.isFunction(value))
            {
                return this.each(function(i)
                {
                    jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                });
            }

            return this.each(function()
            {
                if (type === "string")
                {
                    /**
                     * Alternar nomes de classes individuais.
                     */
                    var className,
                        i = 0,
                        self = jQuery(this),
                        state = stateVal,
                        classNames = value.split(rspace);

                    while ((className = classNames[i++]))
                    {
                        /**
                         * Verifique cada className fornecido, lista
                         * separada por espaço.
                         */
                        state = isBool ? state : !self.hasClass(className);
                        self[state ? "addClass" : "removeClass"](className);
                    }
                } else if (type === "undefined" || type === "boolean")
                {
                    if (this.className)
                    {
                        /**
                         * Armazene className se definido.
                         */
                        jQuery._data(this, "__className__", this.className);
                    }

                    /**
                     * Alterne todo o className.
                     */
                    this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
                }
            });
        },

        /**
         *
         */
        hasClass: function(selector)
        {
            var className = " " + selector + " ",
                i = 0,
                l = this.length;

            for (; i < l; i++)
            {
                if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) > -1)
                {
                    return true;
                }
            }

            return false;
        },

        /**
         *
         */
        val: function(value)
        {
            var hooks,
                ret,
                isFunction,
                elem = this[0];

            if (!arguments.length)
            {
                if (elem)
                {
                    hooks = jQuery.valHooks[
                        elem.nodeName.toLowerCase()
                    ] || jQuery.valHooks[elem.type];

                    if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined)
                    {
                        return ret;
                    }

                    ret = elem.value;

                    return typeof ret === "string" ?
                        /**
                         * Lidar com os casos de string mais comuns.
                         */
                        ret.replace(rreturn, "") :

                        /**
                         * Lidar com casos em que o valor é null/undef
                         * ou number.
                         */
                        ret == null ? "" : ret;
                }

                return;
            }

            /**
             *
             */
            isFunction = jQuery.isFunction(value);

            /**
             *
             */
            return this.each(function(i)
            {
                var self = jQuery(this), val;

                if (this.nodeType !== 1)
                {
                    return;
                }

                if (isFunction)
                {
                    val = value.call(this, i, self.val());
                } else
                {
                    val = value;
                }

                /**
                 * Trate null/undefined como ""; converter números
                 * em string.
                 */
                if (val == null)
                {
                    val = "";
                } else if (typeof val === "number")
                {
                    val += "";
                } else if (jQuery.isArray(val))
                {
                    val = jQuery.map(val, function (value)
                    {
                        return value == null ? "" : value + "";
                    });
                }

                /**
                 *
                 */
                hooks = jQuery.valHooks[
                    this.nodeName.toLowerCase()
                ] || jQuery.valHooks[this.type];

                /**
                 * Se set retornar undefined, retorne à configuração
                 * normal.
                 */
                if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined)
                {
                    this.value = val;
                }
            });
        }
    });

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        valHooks: {
            /**
             *
             */
            option: {
                /**
                 *
                 */
                get: function(elem)
                {
                    /**
                     * attributes.value é undefined no Blackberry 4.7,
                     * mas usa .value. Consulte #6932.
                     */
                    var val = elem.attributes.value;

                    return !val || val.specified ? elem.value : elem.text;
                }
            },

            /**
             *
             */
            select: {
                /**
                 *
                 */
                get: function(elem)
                {
                    var value,
                        i,
                        max,
                        option,
                        index = elem.selectedIndex,
                        values = [],
                        options = elem.options,
                        one = elem.type === "select-one";

                    /**
                     * Nada foi selecionado.
                     */
                    if (index < 0)
                    {
                        return null;
                    }

                    /**
                     * Percorra todas as opções selecionadas.
                     */
                    i = one ? index : 0;
                    max = one ? index + 1 : options.length;

                    for (; i < max; i++)
                    {
                        option = options[i];

                        /**
                         * Não retorne opções desabilitadas ou em um
                         * optgroup desabilitado.
                         */
                        if (option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup")))
                        {
                            /**
                             * Obtenha o valor específico da opção.
                             */
                            value = jQuery(option).val();

                            /**
                             * Não precisamos de um array para uma seleção.
                             */
                            if (one)
                            {
                                return value;
                            }

                            /**
                             * Multi-Selects devolve um vetor.
                             */
                            values.push(value);
                        }
                    }

                    /**
                     * Corrige o bug #2551 – select.val() com falhas
                     * no IE após form.reset().
                     */
                    if (one && !values.length && options.length)
                    {
                        return jQuery(options[index]).val();
                    }

                    return values;
                },

                /**
                 *
                 */
                set: function(elem, value)
                {
                    var values = jQuery.makeArray(value);

                    jQuery(elem).find("option").each(function()
                    {
                        this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
                    });

                    if (!values.length)
                    {
                        elem.selectedIndex = -1;
                    }

                    return values;
                }
            }
        },

        /**
         *
         */
        attrFn: {
            /**
             *
             */
            val: true,

            /**
             *
             */
            css: true,

            /**
             *
             */
            html: true,

            /**
             *
             */
            text: true,

            /**
             *
             */
            data: true,

            /**
             *
             */
            width: true,

            /**
             *
             */
            height: true,

            /**
             *
             */
            offset: true
        },

        /**
         *
         */
        attr: function(elem, name, value, pass)
        {
            var ret,
                hooks,
                notxml,
                nType = elem.nodeType;

            /**
             * Não obtenha/defina atributos em nós de texto,
             * comentários e atributos.
             */
            if (!elem || nType === 3 || nType === 8 || nType === 2)
            {
                return;
            }

            if (pass && name in jQuery.attrFn)
            {
                return jQuery(elem)[name](value);
            }

            /**
             * Fallback para prop quando os atributos não
             * são suportados.
             */
            if (typeof elem.getAttribute === "undefined")
            {
                return jQuery.prop(elem, name, value);
            }

            /**
             *
             */
            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

            /**
             * Todos os atributos estão em letras minúsculas.
             * Pegue o plug necessário, se houver algum definido.
             */
            if (notxml)
            {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[name] || (
                    rboolean.test(name) ? boolHook : nodeHook
                );
            }

            if (value !== undefined)
            {
                if (value === null)
                {
                    jQuery.removeAttr(elem, name);

                    return;
                } else if (hooks && "set" in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined)
                {
                    return ret;
                } else
                {
                    elem.setAttribute(name, "" + value);

                    return value;
                }
            } else if (hooks && "get" in hooks && notxml && (ret = hooks.get(elem, name)) !== null)
            {
                return ret;
            } else
            {
                ret = elem.getAttribute(name);

                /**
                 * Atributos inexistentes retornam null, normalizamos
                 * para undefined.
                 */
                return ret === null ? undefined : ret;
            }
        },

        /**
         *
         */
        removeAttr: function(elem, value)
        {
            var propName,
                attrNames,
                name,
                l,
                i = 0;

            if (value && elem.nodeType === 1)
            {
                attrNames = value.toLowerCase().split(rspace);
                l = attrNames.length;

                for (; i < l; i++)
                {
                    name = attrNames[i];

                    if (name)
                    {
                        propName = jQuery.propFix[name] || name;

                        /**
                         * Consulte #9699 para explicação dessa abordagem
                         * (primeiro configuração e depois remoção).
                         */
                        jQuery.attr(elem, name, "");
                        elem.removeAttribute(getSetAttribute ? name : propName);

                        /**
                         * Defina a propriedade correspondente como false
                         * para atributos boolean.
                         */
                        if (rboolean.test(name) && propName in elem)
                        {
                            elem[propName] = false;
                        }
                    }
                }
            }
        },

        /**
         *
         */
        attrHooks: {
            /**
             *
             */
            type: {
                /**
                 *
                 */
                set: function(elem, value)
                {
                    /**
                     * Não podemos permitir que a propriedade type seja
                     * alterada (pois causa problemas no IE).
                     */
                    if (rtype.test(elem.nodeName) && elem.parentNode)
                    {
                        jQuery.error("type property can't be changed");
                    } else if (!jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input"))
                    {
                        /**
                         * Definir o tipo em um botão de opção após o valor
                         * redefine o valor no IE6-9. Redefinir o valor para
                         * o padrão caso o tipo seja definido após o valor.
                         * Isto é para criação de elementos.
                         */
                        var val = elem.value;
                        elem.setAttribute("type", value);

                        if (val)
                        {
                            elem.value = val;
                        }

                        return value;
                    }
                }
            },

            /**
             * Use a propriedade value para retro compatibilidade.
             * Use o nodeHook para elementos de botão no IE6/7 (#1954).
             */
            value: {
                /**
                 *
                 */
                get: function(elem, name)
                {
                    if (nodeHook && jQuery.nodeName(elem, "button"))
                    {
                        return nodeHook.get(elem, name);
                    }

                    return name in elem ? elem.value : null;
                },


                /**
                 *
                 */
                set: function(elem, value, name)
                {
                    if (nodeHook && jQuery.nodeName(elem, "button"))
                    {
                        return nodeHook.set(elem, value, name);
                    }

                    /**
                     * Não retorna para que setAttribute também seja usado.
                     */
                    elem.value = value;
                }
            }
        },

        /**
         *
         */
        propFix: {
            /**
             *
             */
            tabindex: "tabIndex",

            /**
             *
             */
            readonly: "readOnly",

            /**
             *
             */
            "for": "htmlFor",

            /**
             *
             */
            "class": "className",

            /**
             *
             */
            maxlength: "maxLength",

            /**
             *
             */
            cellspacing: "cellSpacing",

            /**
             *
             */
            cellpadding: "cellPadding",

            /**
             *
             */
            rowspan: "rowSpan",

            /**
             *
             */
            colspan: "colSpan",

            /**
             *
             */
            usemap: "useMap",

            /**
             *
             */
            frameborder: "frameBorder",

            /**
             *
             */
            contenteditable: "contentEditable"
        },

        /**
         *
         */
        prop: function(elem, name, value)
        {
            var ret,
                hooks,
                notxml,
                nType = elem.nodeType;

            /**
             * Não obtenha/defina propriedades em nós de texto,
             * comentários e atributos.
             */
            if (!elem || nType === 3 || nType === 8 || nType === 2)
            {
                return;
            }

            /**
             *
             */
            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

            if (notxml)
            {
                /**
                 * Corrija o nome e anexe plugs.
                 */
                name = jQuery.propFix[name] || name;
                hooks = jQuery.propHooks[name];
            }

            if (value !== undefined)
            {
                if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined)
                {
                    return ret;
                } else
                {
                    return (elem[name] = value);
                }
            } else
            {
                if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null)
                {
                    return ret;
                } else
                {
                    return elem[name];
                }
            }
        },

        /**
         *
         */
        propHooks: {
            /**
             *
             */
            tabIndex: {
                /**
                 *
                 */
                get: function(elem)
                {
                    /**
                     * elem.tabIndex nem sempre retorna o valor correto
                     * quando não foi definido explicitamente.
                     *
                     * http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                     */
                    var attributeNode = elem.getAttributeNode("tabindex");

                    return attributeNode && attributeNode.specified ?
                        parseInt(attributeNode.value, 10) :
                        rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
                }
            }
        }
    });

    /**
     * Adicione o tabIndex propHook a attrHooks para retrocompatibilidade
     * (casos diferentes são intencionais).
     */
    jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

    /**
     * Plug para atributos booleanos.
     */
    boolHook = {
        /**
         *
         */
        get: function(elem, name)
        {
            /**
             * Alinhe atributos booleanos com propriedades correspondentes.
             * Volte para atribuir presença onde alguns booleanos não são
             * suportados.
             */
            var attrNode,
                property = jQuery.prop(elem, name);

            return property === true || typeof property !== "boolean" && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== false ? name.toLowerCase() : undefined;
        },

        /**
         *
         */
        set: function(elem, value, name)
        {
            var propName;

            if (value === false)
            {
                /**
                 * Remova atributos booleanos quando definidos
                 * como false.
                 */
                jQuery.removeAttr(elem, name);
            } else
            {
                /**
                 * value é true, pois sabemos que neste ponto é do tipo
                 * booleano e não false. Defina atributos booleanos com
                 * o mesmo nome e defina a propriedade DOM.
                 */
                propName = jQuery.propFix[name] || name;

                if (propName in elem)
                {
                    /**
                     * Defina o IDL especificamente apenas se ele já
                     * existir no elemento.
                     */
                    elem[propName] = true;
                }

                elem.setAttribute(name, name.toLowerCase());
            }

            return name;
        }
    };

    /**
     * IE6/7 não suporta obter/definir alguns atributos
     * com get/setAttribute.
     */
    if (!getSetAttribute)
    {
        fixSpecified = {
            name: true,
            id: true
        };

        /**
         * Use isto para qualquer atributo no IE6/7.
         * Isso corrige quase todas as falhas do IE6/7.
         */
        nodeHook = jQuery.valHooks.button = {
            /**
             *
             */
            get: function(elem, name)
            {
                var ret;
                ret = elem.getAttributeNode(name);

                return ret && (fixSpecified[name] ? ret.nodeValue !== "" : ret.specified) ?
                    ret.nodeValue :
                    undefined;
            },

            /**
             *
             */
            set: function(elem, value, name)
            {
                /**
                 * Defina o nó de atributo existente ou crie um novo.
                 */
                var ret = elem.getAttributeNode(name);

                if (!ret)
                {
                    ret = document.createAttribute(name);
                    elem.setAttributeNode(ret);
                }

                return (ret.nodeValue = value + "");
            }
        };

        /**
         * Aplique o nodeHook ao tabindex.
         */
        jQuery.attrHooks.tabindex.set = nodeHook.set;

        /**
         * Defina width e height como automático em vez de 0
         * na string vazia ( Bug #8150 ). Isto é para remoções.
         */
        jQuery.each(["width", "height"], function(i, name)
        {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                /**
                 *
                 */
                set: function(elem, value)
                {
                    if (value === "")
                    {
                        elem.setAttribute(name, "auto");

                        return value;
                    }
                }
            });
        });

        /**
         * Defina contenteditable como false nas remoções (#10429).
         * Definir uma string vazia gera uma falha como um valor
         * inválido.
         */
        jQuery.attrHooks.contenteditable = {
            /**
             *
             */
            get: nodeHook.get,

            /**
             *
             */
            set: function(elem, value, name)
            {
                if (value === "")
                {
                    value = "false";
                }

                nodeHook.set(elem, value, name);
            }
        };
    }

    /**
     * Alguns atributos requerem uma chamada especial no IE.
     */
    if (!jQuery.support.hrefNormalized)
    {
        jQuery.each(["href", "src", "width", "height"], function(i, name)
        {
            jQuery.attrHooks[name] = jQuery.extend(
                jQuery.attrHooks[name], {
                    get: function(elem)
                    {
                        var ret = elem.getAttribute(name, 2);

                        return ret === null ? undefined : ret;
                    }
                }
            );
        });
    }

    if (!jQuery.support.style)
    {
        jQuery.attrHooks.style = {
            /**
             *
             */
            get: function(elem)
            {
                /**
                 * Retorna undefined no caso de string vazia. Normalize
                 * para letras minúsculas, pois o IE coloca nomes de
                 * propriedades CSS em letras maiúsculas.
                 */
                return elem.style.cssText.toLowerCase() || undefined;
            },

            /**
             *
             */
            set: function(elem, value)
            {
                return (elem.style.cssText = "" + value);
            }
        };
    }

    /**
     * O Safari informa incorretamente a propriedade selecionada
     * padrão de uma opção. Acessar a propriedade selectedIndex
     * mais alta corrige a falha.
     */
    if (!jQuery.support.optSelected)
    {
        jQuery.propHooks.selected = jQuery.extend(
            jQuery.propHooks.selected, {
                /**
                 *
                 */
                get: function(elem)
                {
                    var parent = elem.parentNode;

                    if (parent)
                    {
                        parent.selectedIndex;

                        /**
                         * Certifique-se de que também funciona com optgroups,
                         * consulte #5701.
                         */
                        if (parent.parentNode)
                        {
                            parent.parentNode.selectedIndex;
                        }
                    }

                    return null;
                }
            }
        );
    }

    /**
     * IE6/7 chamar codificação enctype.
     */
    if (!jQuery.support.enctype)
    {
        jQuery.propFix.enctype = "encoding";
    }

    /**
     * Radios e checkboxes getter/setter.
     */
    if (!jQuery.support.checkOn)
    {
        jQuery.each(["radio", "checkbox"], function()
        {
            jQuery.valHooks[this] = {
                get: function(elem)
                {
                    /**
                     * Lide com o caso em que no Webkit "" é retornado
                     * em vez de "on" se um valor não for especificado.
                     */
                    return elem.getAttribute("value") === null ? "on" : elem.value;
                }
            };
        });
    }

    /**
     *
     */
    jQuery.each(["radio", "checkbox"], function()
    {
        jQuery.valHooks[this] = jQuery.extend(
            jQuery.valHooks[this], {
                set: function(elem, value)
                {
                    if (jQuery.isArray(value))
                    {
                        return (
                            elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0
                        );
                    }
                }
            }
        );
    });

    /**
     *
     */
    var rformElems = /^(?:textarea|input|select)$/i,
        rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
        rhoverHack = /\bhover(\.\S+)?\b/,
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,

        /**
         *
         */
        quickParse = function(selector)
        {
            var quick = rquickIs.exec(selector);

            if (quick)
            {
                /**
                 *   0    1   2      3.
                 * [ _, tag, id, class ].
                 */
                quick[1] = (quick[1] || "").toLowerCase();
                quick[3] = quick[3] && new RegExp("(?:^|\\s)" + quick[3] + "(?:\\s|$)");
            }

            return quick;
        },

        /**
         *
         */
        quickIs = function(elem, m)
        {
            var attrs = elem.attributes || {};

            return (
                (!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
                (!m[2] || (attrs.id || {}).value === m[2]) &&
                (!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
            );
        },

        /**
         *
         */
        hoverHack = function(events)
        {
            return jQuery.event.special.hover ? events : events.replace(rhoverHack, "mouseenter$1 mouseleave$1");
        };

    /**
     * Funções auxiliares para gerenciamento de eventos – não
     * fazem parte da interface pública. Adereços à biblioteca
     * addEvent para muitas das ideias.
     */
    jQuery.event = {
        /**
         *
         */
        add: function(elem, types, handler, data, selector)
        {
            var elemData,
                eventHandle,
                events,
                t,
                tns,
                type,
                namespaces,
                handleObj,
                handleObjIn,
                quick,
                handlers,
                special;

            /**
             * Não anexe eventos a nodes noData ou de texto/comentário
             * (embora permita objetos simples).
             */
            if (elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data(elem)))
            {
                return;
            }

            /**
             * O chamador pode passar um objeto de dados personalizados
             * no lugar do manipulador.
             */
            if (handler.handler)
            {
                handleObjIn = handler;
                handler = handleObjIn.handler;
            }

            /**
             * Certifique-se de que o manipulador tenha um ID exclusivo,
             * usado para localizá-lo/removê-lo posteriormente.
             */
            if (!handler.guid)
            {
                handler.guid = jQuery.guid++;
            }

            /**
             * Inicie a estrutura de eventos e o manipulador principal
             * do elemento, se este for o primeiro.
             */
            events = elemData.events;

            /**
             *
             */
            if (!events)
            {
                elemData.events = events = {};
            }

            /**
             *
             */
            eventHandle = elemData.handle;

            /**
             *
             */
            if (!eventHandle)
            {
                elemData.handle = eventHandle = function(e)
                {
                    /**
                     * Descarte o segundo evento de jQuery.event.trigger()
                     * e quando um evento for chamado após o descarregamento
                     * de uma página.
                     */
                    return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                        jQuery.event.dispatch.apply(eventHandle.elem, arguments) :
                        undefined;
                };

                /**
                 * Adicione elem como uma propriedade do identificador
                 * fn para evitar vazamento de memória com eventos não
                 * nativos do IE.
                 */
                eventHandle.elem = elem;
            }

            /**
             * Lidar com vários eventos separados por um espaço
             * jQuery(...).bind("mouseover mouseout", fn);
             */
            types = jQuery.trim( hoverHack(types) ).split( " " );

            /**
             *
             */
            for (t = 0; t < types.length; t++)
            {
                tns = rtypenamespace.exec(types[t]) || [];
                type = tns[1];
                namespaces = (tns[2] || "").split(".").sort();

                /**
                 * Se o evento mudar de tipo, use os manipuladores de
                 * eventos especiais para o tipo alterado.
                 */
                special = jQuery.event.special[type] || {};

                /**
                 * Se o seletor for definido, determine o tipo de API
                 * do evento especial, caso contrário, determinado tipo.
                 */
                type = (
                    selector ? special.delegateType : special.bindType
                ) || type;

                /**
                 * Atualização especial com base no tipo de redefinição
                 * recente.
                 */
                special = jQuery.event.special[type] || {};

                /**
                 * handleObj é passado para todos os manipuladores
                 * de eventos.
                 */
                handleObj = jQuery.extend({
                    type: type,
                    origType: tns[1],
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    quick: quickParse( selector ),
                    namespace: namespaces.join(".")
                }, handleObjIn );

                /**
                 * Inicie a fila do manipulador de eventos se formos
                 * os primeiros.
                 */
                handlers = events[type];

                /**
                 *
                 */
                if (!handlers)
                {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;

                    /**
                     * Use addEventListener/attachEvent apenas se o
                     * manipulador de eventos especiais retornar
                     * false.
                     */
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false)
                    {
                        /**
                         * Vincule o manipulador de eventos global ao elemento.
                         */
                        if (elem.addEventListener)
                        {
                            elem.addEventListener(type, eventHandle, false);
                        } else if (elem.attachEvent)
                        {
                            elem.attachEvent("on" + type, eventHandle);
                        }
                    }
                }

                if (special.add)
                {
                    special.add.call(elem, handleObj);

                    if (!handleObj.handler.guid)
                    {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                /**
                 * Adicione à lista de manipuladores do elemento,
                 * delegações na frente.
                 */
                if (selector)
                {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else
                {
                    handlers.push(handleObj);
                }

                /**
                 * Acompanhe quais eventos já foram usados, para otimização
                 * de eventos.
                 */
                jQuery.event.global[type] = true;
            }

            /**
             * Anule o elemento para evitar vazamentos de memória
             * no IE.
             */
            elem = null;
        },

        /**
         *
         */
        global: {},

        /**
         * Desanexe um evento ou conjunto de eventos de um elemento.
         */
        remove: function(elem, types, handler, selector, mappedTypes)
        {
            var elemData = jQuery.hasData(elem) && jQuery._data(elem),
                t,
                tns,
                type,
                origType,
                namespaces,
                origCount,
                j,
                events,
                special,
                handle,
                eventType,
                handleObj;

            if (!elemData || !(events = elemData.events))
            {
                return;
            }

            /**
             * Uma vez para cada type.namespace em tipos; tipo
             * pode ser omitido.
             */
            types = jQuery.trim(
                hoverHack(types || "")
            ).split(" ");

            /**
             *
             */
            for (t = 0; t < types.length; t++)
            {
                tns = rtypenamespace.exec(types[t]) || [];
                type = origType = tns[1];
                namespaces = tns[2];

                /**
                 * Desvincule todos os eventos (neste namespace, se
                 * fornecido) para o elemento.
                 */
                if (!type)
                {
                    for (type in events)
                    {
                        jQuery.event.remove(elem, type + types[t], handler, selector, true);
                    }

                    continue;
                }

                special = jQuery.event.special[type] || {};
                type = (selector? special.delegateType : special.bindType) || type;
                eventType = events[type] || [];
                origCount = eventType.length;
                namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

                /**
                 * Remova eventos correspondentes.
                 */
                for (j = 0; j < eventType.length; j++)
                {
                    handleObj = eventType[j];

                    if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!namespaces || namespaces.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector))
                    {
                        eventType.splice(j--, 1);

                        if (handleObj.selector)
                        {
                            eventType.delegateCount--;
                        }

                        if (special.remove)
                        {
                            special.remove.call(elem, handleObj);
                        }
                    }
                }

                /**
                 * Remova o manipulador de eventos genérico se removemos
                 * algo e não existem mais manipuladores (evita a possibilidade
                 * de recursão infinita durante a remoção de manipuladores
                 * de eventos especiais).
                 */
                if (eventType.length === 0 && origCount !== eventType.length)
                {
                    if (!special.teardown || special.teardown.call(elem, namespaces) === false)
                    {
                        jQuery.removeEvent(elem, type, elemData.handle);
                    }

                    delete events[type];
                }
            }

            /**
             * Remova o expando se não for mais usado.
             */
            if (jQuery.isEmptyObject(events))
            {
                handle = elemData.handle;

                if (handle)
                {
                    handle.elem = null;
                }

                /**
                 * removeData também verifica se há vazio e limpa o expando
                 * se estiver vazio, então use-o em vez de excluir.
                 */
                jQuery.removeData(elem, ["events", "handle"], true);
            }
        },

        /**
         * Eventos que são seguros para ciclo pequeno se nenhum
         * manipulador estiver conectado. Eventos DOM nativos não
         * devem ser adicionados, eles podem ter manipuladores
         * embutidos.
         */
        customEvent: {
            "getData": true,
            "setData": true,
            "changeData": true
        },

        /**
         *
         */
        trigger: function(event, data, elem, onlyHandlers)
        {
            /**
             * Não faça eventos em nós de texto e comentários.
             */
            if (elem && (elem.nodeType === 3 || elem.nodeType === 8))
            {
                return;
            }

            /**
             * Objeto de evento ou tipo de evento.
             */
            var type = event.type || event,
                namespaces = [],
                cache,
                exclusive,
                i,
                cur,
                old,
                ontype,
                special,
                handle,
                eventPath,
                bubbleType;

            /**
             * foco/desfoque se transforma em foco dentro/fora; garantir
             * que não os estamos removendo agora.
             */
            if (rfocusMorph.test(type + jQuery.event.triggered))
            {
                return;
            }

            if (type.indexOf("!") >= 0)
            {
                /**
                 * Eventos exclusivos são acionados apenas para o
                 * evento exato (sem namespaces).
                 */
                type = type.slice(0, -1);
                exclusive = true;
            }

            if (type.indexOf(".") >= 0)
            {
                /**
                 * Gatilho com namespace; crie um regexp para corresponder
                 * ao tipo de evento em handle().
                 */
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }

            if ((!elem || jQuery.event.customEvent[type]) && !jQuery.event.global[type])
            {
                /**
                 * Não há manipuladores jQuery para esse tipo de evento
                 * e não pode ter manipuladores embutidos.
                 */
                return;
            }

            /**
             * O chamador pode passar um Evento, Objeto ou apenas
             * uma string de tipo de evento.
             */
            event = typeof event === "object" ?
                /**
                 * Objeto jQuery.Event.
                 */
                event[ jQuery.expando ] ? event :

                /**
                 * Objeto literal.
                 */
                new jQuery.Event(type, event) :

                /**
                 * Apenas o tipo de evento (string).
                 */
                new jQuery.Event(type);

            event.type = type;
            event.isTrigger = true;
            event.exclusive = exclusive;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
            ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

            /**
             * Lidar com um trigger global.
             */
            if (!elem)
            {
                /**
                 * TODO: Pare de chamar o cache de dados; remova eventos
                 * globais e sempre anexe ao documento.
                 */
                cache = jQuery.cache;

                for (i in cache)
                {
                    if (cache[i].events && cache[i].events[type])
                    {
                        jQuery.event.trigger(event, data, cache[i].handle.elem, true);
                    }
                }

                return;
            }

            /**
             * Limpe o evento caso ele esteja sendo reutilizado.
             */
            event.result = undefined;

            /**
             *
             */
            if (!event.target)
            {
                event.target = elem;
            }

            /**
             * Clone todos os dados recebidos e acrescente o evento,
             * criando a lista de argumentos do manipulador.
             */
            data = data != null ? jQuery.makeArray(data) : [];
            data.unshift(event);

            /**
             * Permita que eventos especiais saiam dos limites.
             */
            special = jQuery.event.special[type] || {};

            /**
             *
             */
            if (special.trigger && special.trigger.apply(elem, data) === false)
            {
                return;
            }

            /**
             * Determine o caminho de propagação do evento antecipadamente,
             * de acordo com as especificações de eventos do W3C (#9951). Vá
             * para o documento e depois para a janela; procure por uma var
             * global ownerDocument (#9724).
             */
            eventPath = [[elem, special.bindType || type]];

            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem))
            {
                bubbleType = special.delegateType || type;
                cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode;
                old = null;

                for (; cur; cur = cur.parentNode)
                {
                    eventPath.push([cur, bubbleType]);
                    old = cur;
                }

                /**
                 * Adicione apenas window se tivermos que documentar
                 * (por exemplo, não obj simples ou DOM desanexado).
                 */
                if (old && old === elem.ownerDocument)
                {
                    eventPath.push([old.defaultView || old.parentWindow || window, bubbleType]);
                }
            }

            /**
             * Manipuladores de envios no caminho do evento.
             */
            for (i = 0; i < eventPath.length && !event.isPropagationStopped(); i++)
            {
                cur = eventPath[i][0];
                event.type = eventPath[i][1];
                handle = (
                    jQuery._data(cur, "events") || {}
                )[event.type] && jQuery._data(cur, "handle");

                if (handle)
                {
                    handle.apply(cur, data);
                }

                /**
                 * Observe que esta é uma função JS simples e não um
                 * manipulador jQuery.
                 */
                handle = ontype && cur[ontype];

                /**
                 *
                 */
                if (handle && jQuery.acceptData(cur) && handle.apply(cur, data) === false)
                {
                    event.preventDefault();
                }
            }

            /**
             *
             */
            event.type = type;

            /**
             * Se ninguém impediu a ação padrão, faça-o agora.
             */
            if (!onlyHandlers && !event.isDefaultPrevented())
            {
                if ((!special._default || special._default.apply(elem.ownerDocument, data) === false) && !(type === "click" && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem))
                {
                    /**
                     * Chame um método DOM nativo no destino com o mesmo
                     * nome do evento. Não é possível usar uma verificação
                     * .isFunction() aqui porque o IE 6/7 falhou nesse teste.
                     * Não execute ações padrão na janela, é onde estão as
                     * variáveis globais (#6170). IE < 9 fecha no foco/desfoque
                     * do elemento oculto (#1486).
                     */
                    if (ontype && elem[type] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow(elem))
                    {
                        /**
                         * Não acione novamente um evento onFOO quando
                         * chamarmos seu método FOO().
                         */
                        old = elem[ontype];

                        if (old)
                        {
                            elem[ontype] = null;
                        }

                        /**
                         * Impedir o re-desencadeamento do mesmo evento, uma
                         * vez que já o borbulhámos acima.
                         */
                        jQuery.event.triggered = type;
                        elem[type]();
                        jQuery.event.triggered = undefined;

                        if (old)
                        {
                            elem[ontype] = old;
                        }
                    }
                }
            }

            return event.result;
        },

        /**
         *
         */
        dispatch: function(event)
        {
            /**
             * Crie um jQuery.Event gravável a partir do objeto
             * de evento nativo.
             */
            event = jQuery.event.fix(event || window.event);

            var handlers = ((jQuery._data(this, "events") || {})[event.type] || []),
                delegateCount = handlers.delegateCount,
                args = [].slice.call(arguments, 0),
                run_all = !event.exclusive && !event.namespace,
                handlerQueue = [],
                i,
                j,
                cur,
                jqcur,
                ret,
                selMatch,
                matched,
                matches,
                handleObj,
                sel,
                related;

            /**
             * Use o jQuery.Event melhorado em vez do evento nativo
             * (somente leitura).
             */
            args[0] = event;
            event.delegateTarget = this;

            /**
             * Determine os manipuladores que deverão ser executados
             * se houver eventos de delegações. Evite elementos
             * desativados no IE (#6911) e bolhas sem clicar com o
             * botão esquerdo no Firefox (#3861).
             */
            if (delegateCount && !event.target.disabled && !(event.button && event.type === "click"))
            {
                /**
                 * Pré-gere um único objeto jQuery para reutilização
                 * com .is().
                 */
                jqcur = jQuery(this);
                jqcur.context = this.ownerDocument || this;

                for (cur = event.target; cur != this; cur = cur.parentNode || this)
                {
                    selMatch = {};
                    matches = [];
                    jqcur[0] = cur;

                    for (i = 0; i < delegateCount; i++)
                    {
                        handleObj = handlers[i];
                        sel = handleObj.selector;

                        if (selMatch[sel] === undefined)
                        {
                            selMatch[sel] = (
                                handleObj.quick ? quickIs(cur, handleObj.quick) : jqcur.is(sel)
                            );
                        }

                        if (selMatch[sel])
                        {
                            matches.push(handleObj);
                        }
                    }

                    if (matches.length)
                    {
                        handlerQueue.push({
                            elem: cur,
                            matches: matches
                        });
                    }
                }
            }

            /**
             * Adicione os manipuladores restantes (ligados
             * diretamente).
             */
            if (handlers.length > delegateCount)
            {
                handlerQueue.push({
                    elem: this,
                    matches: handlers.slice(delegateCount)
                });
            }

            /**
             * Execute as delegações primeiro; eles podem querer
             * interromper a propagação abaixo de nodes.
             */
            for (i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++)
            {
                matched = handlerQueue[i];
                event.currentTarget = matched.elem;

                for (j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++)
                {
                    handleObj = matched.matches[j];

                    /**
                     * O evento acionado deve:
                     *     1) ser não exclusivo e não ter namespace ou
                     *     2) ter namespace(s) um subconjunto ou igual
                     *        àqueles no evento vinculado (ambos não
                     *        podem ter namespace).
                     */
                    if (run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test(handleObj.namespace))
                    {
                        event.data = handleObj.data;
                        event.handleObj = handleObj;

                        ret = (
                            (
                                jQuery.event.special[handleObj.origType] || {}
                            ).handle || handleObj.handler
                        ).apply(matched.elem, args);

                        if (ret !== undefined)
                        {
                            event.result = ret;

                            if (ret === false)
                            {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }

            return event.result;
        },

        /**
         * Inclui alguns acessórios de evento compartilhados por
         * KeyEvent e MouseEvent.
         * 
         * Observação:
         *     - attrChange
         *     - attrName
         *     - relatedNode
         *     - srcElement
         * 
         *     não estão normalizados, non-W3C, descontinuado,
         *     será removido em 1.8.
         */
        props: "" +
            "attrChange " +
            "attrName " +
            "relatedNode " +
            "srcElement " +
            "altKey " +
            "bubbles " +
            "cancelable " +
            "ctrlKey " +
            "currentTarget " +
            "eventPhase " +
            "metaKey " +
            "relatedTarget " +
            "shiftKey " +
            "target " +
            "timeStamp " +
            "view " +
            "which".split(" "),

        /**
         *
         */
        fixHooks: {},

        /**
         *
         */
        keyHooks: {
            /**
             *
             */
            props: "char charCode key keyCode".split(" "),

            /**
             *
             */
            filter: function(event, original)
            {
                /**
                 * Adicione which para eventos importantes.
                 */
                if (event.which == null)
                {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }

                return event;
            }
        },

        /**
         *
         */
        mouseHooks: {
            /**
             *
             */
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),

            /**
             *
             */
            filter: function(event, original)
            {
                var eventDoc,
                    doc,
                    body,
                    button = original.button,
                    fromElement = original.fromElement;

                /**
                 * Calcule pageX/Y se estiver faltando e clientX/Y
                 * disponível.
                 */
                if (event.pageX == null && original.clientX != null)
                {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;

                    event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                    event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                }

                /**
                 * Adicione relatedTarget, se necessário.
                 */
                if (!event.relatedTarget && fromElement)
                {
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                }

                /**
                 * Adicione qual para clicar: 1 === left; 2 === middle; 3 === right.
                 * Observação: o botão não está normalizado, portanto
                 * não o utilize.
                 */
                if (!event.which && button !== undefined)
                {
                    event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                }

                return event;
            }
        },

        /**
         *
         */
        fix: function( event )
        {
            if (event[jQuery.expando])
            {
                return event;
            }

            /**
             * Crie uma cópia gravável do objeto de evento e normalize
             * algumas propriedades.
             */
            var i,
                prop,
                originalEvent = event,
                fixHook = jQuery.event.fixHooks[event.type] || {},
                copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

            /**
             *
             */
            event = jQuery.Event(originalEvent);

            /**
             *
             */
            for (i = copy.length; i;)
            {
                prop = copy[--i];
                event[prop] = originalEvent[prop];
            }

            /**
             * Melhora a propriedade de destino, se necessário
             * (#1925, IE 6/7/8 e Safari2).
             */
            if (!event.target)
            {
                event.target = originalEvent.srcElement || document;
            }

            /**
             * O destino não deve ser um node de texto (#504, Safari).
             */
            if (event.target.nodeType === 3)
            {
                event.target = event.target.parentNode;
            }

            /**
             * Para eventos de mouse/tecla; adicione metaKey se
             * não estiver lá (#3368, IE6/7/8).
             */
            if (event.metaKey === undefined)
            {
                event.metaKey = event.ctrlKey;
            }

            return fixHook.filter? fixHook.filter(event, originalEvent) : event;
        },

        /**
         *
         */
        special: {
            /**
             *
             */
            ready: {
                /**
                 * Certifique-se de que o evento pronto esteja configurado.
                 */
                setup: jQuery.bindReady
            },

            /**
             *
             */
            load: {
                /**
                 * Evite que eventos image.load acionados borbulhem
                 * para window.load.
                 */
                noBubble: true
            },

            /**
             *
             */
            focus: {
                /**
                 *
                 */
                delegateType: "focusin"
            },

            /**
             *
             */
            blur: {
                /**
                 *
                 */
                delegateType: "focusout"
            },

            /**
             *
             */
            beforeunload: {
                /**
                 *
                 */
                setup: function(data, namespaces, eventHandle)
                {
                    /**
                     * Queremos fazer este case especial apenas
                     * no Windows.
                     */
                    if (jQuery.isWindow(this))
                    {
                        this.onbeforeunload = eventHandle;
                    }
                },

                /**
                 *
                 */
                teardown: function(namespaces, eventHandle)
                {
                    if (this.onbeforeunload === eventHandle)
                    {
                        this.onbeforeunload = null;
                    }
                }
            }
        },

        /**
         *
         */
        simulate: function(type, elem, event, bubble)
        {
            /**
             * Aproveite um evento de doador para simular um evento
             * diferente. Falsifique originalEvent para evitar
             * stopPropagation do doador, mas se o evento simulado
             * impedir o padrão, faremos o mesmo no doador.
             */
            var e = jQuery.extend(new jQuery.Event(), event, {
                type: type,
                isSimulated: true,
                originalEvent: {}
            });

            if (bubble)
            {
                jQuery.event.trigger(e, null, elem);
            } else
            {
                jQuery.event.dispatch.call(elem, e);
            }

            if (e.isDefaultPrevented())
            {
                event.preventDefault();
            }
        }
    };

    /**
     * Alguns plug-ins estão sendo usados, mas não estão
     * documentados/obsoletos e serão removidos. A interface
     * de eventos especiais 1.7 deve fornecer todos os plugs
     * necessários agora.
     */
    jQuery.event.handle = jQuery.event.dispatch;

    /**
     *
     */
    jQuery.removeEvent = document.removeEventListener ?
        /**
         *
         */
        function(elem, type, handle)
        {
            if (elem.removeEventListener)
            {
                elem.removeEventListener(type, handle, false);
            }
        } :

        /**
         *
         */
        function(elem, type, handle)
        {
            if (elem.detachEvent)
            {
                elem.detachEvent("on" + type, handle);
            }
        };

    /**
     *
     */
    jQuery.Event = function(src, props)
    {
        /**
         * Permitir instanciação sem a palavra-chave 'new'.
         */
        if (!(this instanceof jQuery.Event))
        {
            return new jQuery.Event(src, props);
        }

        /**
         * Objeto de evento.
         */
        if (src && src.type)
        {
            this.originalEvent = src;
            this.type = src.type;

            /**
             * Os eventos que surgem no documento podem ter sido
             * marcados como evitados por um manipulador mais
             * abaixo na árvore; reflete o valor correto.
             */
            this.isDefaultPrevented = (
                src.defaultPrevented || src.returnValue === false || src.getPreventDefault && src.getPreventDefault()
            ) ? returnTrue : returnFalse;

            /**
             * Tipo de evento.
             */
        } else
        {
            this.type = src;
        }

        /**
         * Coloque propriedades fornecidas explicitamente no
         * objeto de evento.
         */
        if (props)
        {
            jQuery.extend(this, props);
        }

        /**
         * Crie um carimbo de data/hora se o evento recebido
         * não tiver um.
         */
        this.timeStamp = src && src.timeStamp || jQuery.now();

        /**
         * Marque-o como fixo.
         */
        this[jQuery.expando] = true;
    };

    /**
     *
     */
    function returnFalse()
    {
        return false;
    }

    /**
     *
     */
    function returnTrue()
    {
        return true;
    }

    /**
     * jQuery.Event é baseado em eventos DOM3 conforme especificado
     * pelo ECMAScript Language Binding.
     *
     * http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html.
     */
    jQuery.Event.prototype = {
        /**
         *
         */
        preventDefault: function()
        {
            this.isDefaultPrevented = returnTrue;

            var e = this.originalEvent;
            if (!e)
            {
                return;
            }

            /**
             * se preventDefault existir, execute-o no evento original.
             */
            if (e.preventDefault)
            {
                e.preventDefault();

                /**
                 * caso contrário, defina a propriedade returnValue
                 * do evento original como false (IE).
                 */
            } else
            {
                e.returnValue = false;
            }
        },

        /**
         *
         */
        stopPropagation: function()
        {
            this.isPropagationStopped = returnTrue;

            var e = this.originalEvent;
            if (!e)
            {
                return;
            }

            /**
             * se stopPropagation existir, execute-o no evento original.
             */
            if (e.stopPropagation)
            {
                e.stopPropagation();
            }

            /**
             * Caso contrário, defina a propriedade cancelBubble
             * do evento original como true (IE).
             */
            e.cancelBubble = true;
        },

        /**
         *
         */
        stopImmediatePropagation: function()
        {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },

        /**
         *
         */
        isDefaultPrevented: returnFalse,

        /**
         *
         */
        isPropagationStopped: returnFalse,

        /**
         *
         */
        isImmediatePropagationStopped: returnFalse
    };

    /**
     * Crie eventos mouseenter/leave usando mouseover/out
     * e verificações de horário do evento.
     */
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(orig, fix)
    {
        jQuery.event.special[orig] = {
            /**
             *
             */
            delegateType: fix,

            /**
             *
             */
            bindType: fix,

            /**
             *
             */
            handle: function(event)
            {
                var target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj,
                    selector = handleObj.selector,
                    ret;

                /**
                 * Para mousenter/leave, chame o manipulador se relacionado
                 * estiver fora do destino. NB: Nenhum relatedTarget se o
                 * mouse saiu/entrou na janela do navegador.
                 */
                if (!related || (related !== target && !jQuery.contains(target, related)))
                {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = fix;
                }

                return ret;
            }
        };
    });

    /**
     * IE envia delegação.
     */
    if (!jQuery.support.submitBubbles)
    {
        /**
         *
         */
        jQuery.event.special.submit = {
            /**
             *
             */
            setup: function()
            {
                /**
                 * Só precisa disso para eventos de envio de formulário
                 * de delegações.
                 */
                if (jQuery.nodeName(this, "form"))
                {
                    return false;
                }

                /**
                 * Adicione lentamente um manipulador de envio quando
                 * um formulário descendente puder ser enviado.
                 */
                jQuery.event.add(this, "click._submit keypress._submit", function(e)
                {
                    /**
                     * A verificação do nome do node evita uma falha
                     * relacionada ao VML no IE (#9807).
                     */
                    var elem = e.target,
                        form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;

                    if (form && !form._submit_attached)
                    {
                        jQuery.event.add(form, "submit._submit", function(event)
                        {
                            /**
                             * Se o formulário foi enviado pelo usuário,
                             * coloque o evento na árvore.
                             */
                            if (this.parentNode && !event.isTrigger)
                            {
                                jQuery.event.simulate("submit", this.parentNode, event, true);
                            }
                        });

                        form._submit_attached = true;
                    }
                });

                /**
                 * Devolve undefined, pois não precisamos de um
                 * ouvinte de evento.
                 */
            },

            /**
             *
             */
            teardown: function()
            {
                /**
                 * Só precisa disso para eventos de envio de formulário
                 * de delegações.
                 */
                if (jQuery.nodeName(this, "form"))
                {
                    return false;
                }

                /**
                 * Remova manipuladores de delegações; cleanData
                 * eventualmente colhe manipuladores de envio
                 * anexados acima.
                 */
                jQuery.event.remove(this, "._submit");
            }
        };
    }

    /**
     * Delegação de alteração do IE e correção de caixa
     * de seleção/radio.
     */
    if (!jQuery.support.changeBubbles)
    {
        jQuery.event.special.change = {
            /**
             *
             */
            setup: function()
            {
                if (rformElems.test(this.nodeName))
                {
                    /**
                     * O IE não envia alterações em um check/radio até
                     * desfocar; acione-o ao clicar após uma alteração
                     * de propriedade. Coma a mudança de desfoque em
                     * special.change.handle. Isso ainda é acionado
                     * em onchange uma segunda vez para check/radio
                     * após desfoque.
                     */
                    if (this.type === "checkbox" || this.type === "radio")
                    {
                        jQuery.event.add(this, "propertychange._change", function(event)
                        {
                            if (event.originalEvent.propertyName === "checked")
                            {
                                this._just_changed = true;
                            }
                        });

                        jQuery.event.add(this, "click._change", function(event)
                        {
                            if (this._just_changed && !event.isTrigger)
                            {
                                this._just_changed = false;
                                jQuery.event.simulate("change", this, event, true);
                            }
                        });
                    }

                    return false;
                }

                /**
                 * Eventos de delegação; modo lento de adição de um
                 * manipulador de alterações nas entradas descendentes.
                 */
                jQuery.event.add(this, "beforeactivate._change", function(e)
                {
                    var elem = e.target;

                    if (rformElems.test(elem.nodeName) && !elem._change_attached)
                    {
                        jQuery.event.add(elem, "change._change", function(event)
                        {
                            if (this.parentNode && !event.isSimulated && !event.isTrigger)
                            {
                                jQuery.event.simulate("change", this.parentNode, event, true);
                            }
                        });

                        elem._change_attached = true;
                    }
                });
            },

            /**
             *
             */
            handle: function(event)
            {
                var elem = event.target;

                /**
                 * Obter eventos de mudança nativos da checkbox/radio,
                 * já os acionamos acima.
                 */
                if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox"))
                {
                    return event.handleObj.handler.apply(this, arguments);
                }
            },

            /**
             *
             */
            teardown: function()
            {
                jQuery.event.remove(this, "._change");

                return rformElems.test(this.nodeName);
            }
        };
    }

    /**
     * Crie foco "bubbling" e desfoque eventos.
     */
    if (!jQuery.support.focusinBubbles)
    {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function(orig, fix)
        {
            /**
             * Anexe um único manipulador de captura enquanto
             * alguém quer focusin/focusout.
             */
            var attaches = 0,
                handler = function(event)
                {
                    jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
                };

            /**
             *
             */
            jQuery.event.special[fix] = {
                /**
                 *
                 */
                setup: function()
                {
                    if (attaches++ === 0)
                    {
                        document.addEventListener(orig, handler, true);
                    }
                },

                /**
                 *
                 */
                teardown: function()
                {
                    if (--attaches === 0)
                    {
                        document.removeEventListener(orig, handler, true);
                    }
                }
            };
        });
    }

    /**
     *
     */
    jQuery.fn.extend({
        /**
         * one - INTERNAL.
         */
        on: function(types, selector, data, fn, one)
        {
            var origFn,
                type;

            /**
             * Os tipos podem ser um mapa de tipos/manipuladores.
             */
            if (typeof types === "object")
            {
                /**
                 * (types-Object, selector, data).
                 */
                if (typeof selector !== "string")
                {
                    /**
                     * (types-Object, data).
                     */
                    data = selector;
                    selector = undefined;
                }

                for (type in types)
                {
                    this.on(type, selector, data, types[type], one);
                }

                return this;
            }

            if (data == null && fn == null)
            {
                /**
                 * (types, fn).
                 */
                fn = selector;
                data = selector = undefined;
            } else if (fn == null)
            {
                if (typeof selector === "string")
                {
                    /**
                     * (types, selector, fn).
                     */
                    fn = data;
                    data = undefined;
                } else
                {
                    /**
                     * (types, data, fn).
                     */
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }

            if (fn === false)
            {
                fn = returnFalse;
            } else if (!fn)
            {
                return this;
            }

            if (one === 1)
            {
                origFn = fn;
                fn = function(event)
                {
                    /**
                     * Pode usar um conjunto vazio, pois o evento
                     * contém as informações.
                     */
                    jQuery().off(event);

                    return origFn.apply(this, arguments);
                };

                /**
                 * Use o mesmo guid para que o chamador possa remover
                 * usando origFn.
                 */
                fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
            }

            return this.each(function()
            {
                jQuery.event.add(this, types, fn, data, selector);
            });
        },

        /**
         *
         */
        one: function(types, selector, data, fn)
        {
            return this.on.call(this, types, selector, data, fn, 1);
        },

        /**
         *
         */
        off: function(types, selector, fn)
        {
            if (types && types.preventDefault && types.handleObj)
            {
                /**
                 * (event) enviou jQuery.Event.
                 */
                var handleObj = types.handleObj;

                /**
                 *
                 */
                jQuery(types.delegateTarget).off(
                    handleObj.namespace ? handleObj.type + "." + handleObj.namespace : handleObj.type,
                    handleObj.selector,
                    handleObj.handler
                );

                return this;
            }

            if (typeof types === "object")
            {
                /**
                 * (types-object [, selector]).
                 */
                for (var type in types)
                {
                    this.off(type, selector, types[type]);
                }

                return this;
            }

            if (selector === false || typeof selector === "function")
            {
                /**
                 * (types [, fn]).
                 */
                fn = selector;
                selector = undefined;
            }

            if (fn === false)
            {
                fn = returnFalse;
            }

            return this.each(function()
            {
                jQuery.event.remove(this, types, fn, selector);
            });
        },

        /**
         *
         */
        bind: function(types, data, fn)
        {
            return this.on(types, null, data, fn);
        },

        /**
         *
         */
        unbind: function(types, fn)
        {
            return this.off(types, null, fn);
        },

        /**
         *
         */
        live: function(types, data, fn)
        {
            jQuery(this.context).on(types, this.selector, data, fn);

            return this;
        },

        /**
         *
         */
        die: function(types, fn)
        {
            jQuery(this.context).off(types, this.selector || "**", fn);

            return this;
        },

        /**
         *
         */
        delegate: function(selector, types, data, fn)
        {
            return this.on(types, selector, data, fn);
        },

        /**
         *
         */
        undelegate: function(selector, types, fn)
        {
            /**
             * (namespace) ou (selector, types [, fn]).
             */
            return arguments.length == 1 ? this.off(selector, "**") : this.off(types, selector, fn);
        },

        /**
         *
         */
        trigger: function(type, data)
        {
            return this.each(function()
            {
                jQuery.event.trigger(type, data, this);
            });
        },

        /**
         *
         */
        triggerHandler: function(type, data)
        {
            if (this[0])
            {
                return jQuery.event.trigger(type, data, this[0], true);
            }
        },

        /**
         *
         */
        toggle: function(fn)
        {
            /**
             * Salve a referência aos argumentos para acesso no
             * encerramento.
             */
            var args = arguments,
                guid = fn.guid || jQuery.guid++,
                i = 0,
                toggler = function(event)
                {
                    /**
                     * Descubra qual função executar.
                     */
                    var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
                    jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);

                    /**
                     * Certifique-se de que os cliques parem.
                     */
                    event.preventDefault();

                    /**
                     * E execute a função.
                     */
                    return args[lastToggle].apply(this, arguments) || false;
                };

            /**
             * Vincule todas as funções, para que qualquer uma delas
             * possa desvincular esse manipulador de cliques.
             */
            toggler.guid = guid;

            /**
             *
             */
            while (i < args.length)
            {
                args[i++].guid = guid;
            }

            return this.click(toggler);
        },

        /**
         *
         */
        hover: function(fnOver, fnOut)
        {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        }
    });

    /**
     *
     */
    jQuery.each(
        (
            "blur " +
            "focus " +
            "focusin " +
            "focusout " +
            "load " +
            "resize " +
            "scroll " +
            "unload " +
            "click " +
            "dblclick " +
            "mousedown " +
            "mouseup " +
            "mousemove " +
            "mouseover " +
            "mouseout " +
            "mouseenter " +
            "mouseleave " +
            "change " +
            "select " +
            "submit " +
            "keydown " +
            "keypress " +
            "keyup " +
            "error " +
            "contextmenu"
        ).split(" "), function(i, name)
        {
            /**
             * Lidar com vinculação de eventos.
             */
            jQuery.fn[name] = function(data, fn)
            {
                if (fn == null)
                {
                    fn = data;
                    data = null;
                }

                return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
            };

            if (jQuery.attrFn)
            {
                jQuery.attrFn[name] = true;
            }

            if (rkeyEvent.test(name))
            {
                jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
            }

            if (rmouseEvent.test(name))
            {
                jQuery.event.fixHooks[name] = jQuery.event.mouseHooks;
            }
        }
    );

    /**
     *
     */
    (function()
    {
        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
            expando = "sizcache" + (Math.random() + '').replace('.', ''),
            done = 0,
            toString = Object.prototype.toString,
            hasDuplicate = false,
            baseHasDuplicate = true,
            rBackslash = /\\/g,
            rReturn = /\r\n/g,
            rNonWord = /\W/;

        /**
         * Aqui verificamos se o mecanismo JavaScript está usando
         * algum tipo de otimização onde nem sempre chama nossa
         * função de comparação. Se for esse o caso, descarte o
         * valor hasDuplicate. Até agora, isso inclui o Google Chrome.
         */
        [0, 0].sort(function()
        {
            baseHasDuplicate = false;

            return 0;
        });

        /**
         *
         */
        var Sizzle = function(selector, context, results, seed)
        {
            results = results || [];
            context = context || document;

            /**
             *
             */
            var origContext = context;

            /**
             *
             */
            if (context.nodeType !== 1 && context.nodeType !== 9)
            {
                return [];
            }

            /**
             *
             */
            if (!selector || typeof selector !== "string")
            {
                return results;
            }

            /**
             *
             */
            var m,
                set,
                checkSet,
                extra,
                ret,
                cur,
                pop,
                i,
                prune = true,
                contextXML = Sizzle.isXML(context),
                parts = [],
                soFar = selector;

            /**
             * Redefina a posição do regexp do chunker (comece
             * do título).
             */
            do
            {
                chunker.exec("");
                m = chunker.exec(soFar);

                if (m)
                {
                    soFar = m[3];
                    parts.push(m[1]);

                    if (m[2])
                    {
                        extra = m[3];

                        break;
                    }
                }
            } while (m);

            /**
             *
             */
            if (parts.length > 1 && origPOS.exec(selector))
            {
                if (parts.length === 2 && Expr.relative[parts[0]])
                {
                    set = posProcess(parts[0] + parts[1], context, seed);
                } else
                {
                    set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);

                    while (parts.length)
                    {
                        selector = parts.shift();

                        if (Expr.relative[selector])
                        {
                            selector += parts.shift();
                        }

                        set = posProcess(selector, set, seed);
                    }
                }
            } else
            {
                /**
                 * Pegue um atalho e defina o contexto se o seletor raiz
                 * for um ID (mas não se for mais rápido se o seletor
                 * interno for um ID).
                 */
                if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]))
                {
                    ret = Sizzle.find(parts.shift(), context, contextXML);
                    context = ret.expr ?
                        Sizzle.filter(ret.expr, ret.set)[0] :
                        ret.set[0];
                }

                if (context)
                {
                    ret = seed ? {
                        expr: parts.pop(),
                        set: makeArray(seed)
                    } : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);

                    /**
                     *
                     */
                    set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;

                    /**
                     *
                     */
                    if (parts.length > 0)
                    {
                        checkSet = makeArray(set);
                    } else
                    {
                        prune = false;
                    }

                    /**
                     *
                     */
                    while (parts.length)
                    {
                        cur = parts.pop();
                        pop = cur;

                        if (!Expr.relative[cur])
                        {
                            cur = "";
                        } else
                        {
                            pop = parts.pop();
                        }

                        if (pop == null)
                        {
                            pop = context;
                        }

                        Expr.relative[cur](checkSet, pop, contextXML);
                    }
                } else
                {
                    checkSet = parts = [];
                }
            }

            if (!checkSet)
            {
                checkSet = set;
            }

            if (!checkSet)
            {
                Sizzle.error(cur || selector);
            }

            if (toString.call(checkSet) === "[object Array]")
            {
                if (!prune)
                {
                    results.push.apply(results, checkSet);
                } else if (context && context.nodeType === 1)
                {
                    for (i = 0; checkSet[i] != null; i++)
                    {
                        if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])))
                        {
                            results.push(set[i]);
                        }
                    }
                } else
                {
                    for (i = 0; checkSet[i] != null; i++)
                    {
                        if (checkSet[i] && checkSet[i].nodeType === 1)
                        {
                            results.push(set[i]);
                        }
                    }
                }
            } else
            {
                makeArray(checkSet, results);
            }

            if (extra)
            {
                Sizzle(extra, origContext, results, seed);
                Sizzle.uniqueSort(results);
            }

            return results;
        };

        /**
         *
         */
        Sizzle.uniqueSort = function(results)
        {
            if (sortOrder)
            {
                hasDuplicate = baseHasDuplicate;
                results.sort(sortOrder);

                if (hasDuplicate)
                {
                    for (var i = 1; i < results.length; i++)
                    {
                        if (results[i] === results[i - 1])
                        {
                            results.splice(i--, 1);
                        }
                    }
                }
            }

            return results;
        };

        /**
         *
         */
        Sizzle.matches = function(expr, set)
        {
            return Sizzle(expr, null, null, set);
        };

        /**
         *
         */
        Sizzle.matchesSelector = function(node, expr)
        {
            return Sizzle(expr, null, null, [node]).length > 0;
        };

        /**
         *
         */
        Sizzle.find = function(expr, context, isXML)
        {
            var set,
                i,
                len,
                match,
                type,
                left;

            if (!expr)
            {
                return [];
            }

            for (i = 0, len = Expr.order.length; i < len; i++)
            {
                type = Expr.order[i];

                if ((match = Expr.leftMatch[type].exec(expr)))
                {
                    left = match[1];
                    match.splice(1, 1);

                    if (left.substr(left.length - 1) !== "\\")
                    {
                        match[1] = (match[1] || "").replace(rBackslash, "");
                        set = Expr.find[type](match, context, isXML);

                        if (set != null)
                        {
                            expr = expr.replace(Expr.match[type], "");
                            break;
                        }
                    }
                }
            }

            if (!set)
            {
                set = typeof context.getElementsByTagName !== "undefined" ?
                    context.getElementsByTagName("*") :
                    [];
            }

            return {
                set: set,
                expr: expr
            };
        };

        /**
         *
         */
        Sizzle.filter = function(expr, set, inplace, not)
        {
            var match,
                anyFound,
                type,
                found,
                item,
                filter,
                left,
                i,
                pass,
                old = expr,
                result = [],
                curLoop = set,
                isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);

            while (expr && set.length)
            {
                for (type in Expr.filter)
                {
                    if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2])
                    {
                        filter = Expr.filter[type];
                        left = match[1];

                        anyFound = false;
                        match.splice(1, 1);

                        if (left.substr(left.length - 1) === "\\")
                        {
                            continue;
                        }

                        if (curLoop === result)
                        {
                            result = [];
                        }

                        if (Expr.preFilter[type])
                        {
                            match = Expr.preFilter[type](
                                match,
                                curLoop,
                                inplace,
                                result,
                                not,
                                isXMLFilter
                            );

                            if (!match)
                            {
                                anyFound = found = true;
                            } else if (match === true)
                            {
                                continue;
                            }
                        }

                        if (match)
                        {
                            for (i = 0; (item = curLoop[i]) != null; i++)
                            {
                                if (item)
                                {
                                    found = filter(item, match, i, curLoop);
                                    pass = not ^ found;

                                    if (inplace && found != null)
                                    {
                                        if (pass)
                                        {
                                            anyFound = true;
                                        } else
                                        {
                                            curLoop[i] = false;
                                        }
                                    } else if (pass)
                                    {
                                        result.push(item);
                                        anyFound = true;
                                    }
                                }
                            }
                        }

                        if (found !== undefined)
                        {
                            if (!inplace)
                            {
                                curLoop = result;
                            }

                            expr = expr.replace(Expr.match[type], "");

                            if (!anyFound)
                            {
                                return [];
                            }

                            break;
                        }
                    }
                }

                /**
                 * Expressão inadequada.
                 */
                if (expr === old)
                {
                    if (anyFound == null)
                    {
                        Sizzle.error(expr);
                    } else
                    {
                        break;
                    }
                }

                old = expr;
            }

            return curLoop;
        };

        /**
         *
         */
        Sizzle.error = function(msg)
        {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        };

        /**
         * Função utilitária para recuperar o valor de texto de
         * um vetor de nodes DOM.
         *
         * @param {Array|Element} elem.
         */
        var getText = Sizzle.getText = function(elem)
        {
            var i,
                node,
                nodeType = elem.nodeType,
                ret = "";

            if (nodeType)
            {
                if (nodeType === 1 || nodeType === 9)
                {
                    /**
                     * Use textContent || innerText para elementos.
                     */
                    if (typeof elem.textContent === 'string')
                    {
                        return elem.textContent;
                    } else if (typeof elem.innerText === 'string')
                    {
                        /**
                         * Substitua os retornos de carro do IE.
                         */
                        return elem.innerText.replace(rReturn, '');
                    } else
                    {
                        /**
                         * Passar sobre sub nodes.
                         */
                        for (elem = elem.firstChild; elem; elem = elem.nextSibling)
                        {
                            ret += getText(elem);
                        }
                    }
                } else if (nodeType === 3 || nodeType === 4)
                {
                    return elem.nodeValue;
                }
            } else
            {
                /**
                 * Se não houver nodeType, espera-se que seja um vetor.
                 */
                for (i = 0; (node = elem[i]); i++)
                {
                    /**
                     * Não atravesse os nodes de comentários.
                     */
                    if (node.nodeType !== 8)
                    {
                        ret += getText(node);
                    }
                }
            }

            return ret;
        };

        /**
         *
         */
        var Expr = Sizzle.selectors = {
            /**
             *
             */
            order: [
                "ID",
                "NAME",
                "TAG"
            ],

            /**
             *
             */
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },

            /**
             *
             */
            leftMatch: {},

            /**
             *
             */
            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },

            /**
             *
             */
            attrHandle: {
                /**
                 *
                 */
                href: function(elem)
                {
                    return elem.getAttribute("href");
                },

                /**
                 *
                 */
                type: function(elem)
                {
                    return elem.getAttribute("type");
                }
            },

            /**
             *
             */
            relative: {
                /**
                 *
                 */
                "+": function(checkSet, part)
                {
                    var isPartStr = typeof part === "string",
                        isTag = isPartStr && !rNonWord.test(part),
                        isPartStrNotTag = isPartStr && !isTag;

                    if (isTag)
                    {
                        part = part.toLowerCase();
                    }

                    for (var i = 0, l = checkSet.length, elem; i < l; i++)
                    {
                        if ((elem = checkSet[i]))
                        {
                            while ((elem = elem.previousSibling) && elem.nodeType !== 1)
                            {
                            }

                            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
                                elem || false :
                                elem === part;
                        }
                    }

                    if (isPartStrNotTag)
                    {
                        Sizzle.filter(part, checkSet, true);
                    }
                },

                /**
                 *
                 */
                ">": function(checkSet, part)
                {
                    var elem,
                        isPartStr = typeof part === "string",
                        i = 0,
                        l = checkSet.length;

                    if (isPartStr && !rNonWord.test(part))
                    {
                        part = part.toLowerCase();

                        for (; i < l; i++)
                        {
                            elem = checkSet[i];

                            if (elem)
                            {
                                var parent = elem.parentNode;

                                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                            }
                        }
                    } else
                    {
                        for (; i < l; i++)
                        {
                            elem = checkSet[i];

                            if (elem)
                            {
                                checkSet[i] = isPartStr ?
                                    elem.parentNode :
                                    elem.parentNode === part;
                            }
                        }

                        if (isPartStr)
                        {
                            Sizzle.filter(part, checkSet, true);
                        }
                    }
                },

                /**
                 *
                 */
                "": function(checkSet, part, isXML)
                {
                    var nodeCheck,
                        doneName = done++,
                        checkFn = dirCheck;

                    if (typeof part === "string" && !rNonWord.test(part))
                    {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
                },

                /**
                 *
                 */
                "~": function(checkSet, part, isXML)
                {
                    var nodeCheck,
                        doneName = done++,
                        checkFn = dirCheck;

                    if (typeof part === "string" && !rNonWord.test(part))
                    {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
                }
            },

            /**
             *
             */
            find: {
                /**
                 *
                 */
                ID: function(match, context, isXML)
                {
                    if (typeof context.getElementById !== "undefined" && !isXML)
                    {
                        var m = context.getElementById(match[1]);

                        /**
                         * Verifique parentNode para detectar quando o
                         * Blackberry 4.6 retorna nós que não estão mais
                         * no documento #6963.
                         */
                        return m && m.parentNode ? [m] : [];
                    }
                },

                /**
                 *
                 */
                NAME: function(match, context)
                {
                    if (typeof context.getElementsByName !== "undefined")
                    {
                        var ret = [],
                            results = context.getElementsByName(match[1]);

                        for (var i = 0, l = results.length; i < l; i++)
                        {
                            if (results[i].getAttribute("name") === match[1])
                            {
                                ret.push(results[i]);
                            }
                        }

                        return ret.length === 0 ? null : ret;
                    }
                },

                /**
                 *
                 */
                TAG: function(match, context)
                {
                    if (typeof context.getElementsByTagName !== "undefined")
                    {
                        return context.getElementsByTagName(match[1]);
                    }
                }
            },

            /**
             *
             */
            preFilter: {
                /**
                 *
                 */
                CLASS: function(match, curLoop, inplace, result, not, isXML)
                {
                    match = " " + match[1].replace(rBackslash, "") + " ";

                    if (isXML)
                    {
                        return match;
                    }

                    for (var i = 0, elem; (elem = curLoop[i]) != null; i++)
                    {
                        if (elem)
                        {
                            if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0))
                            {
                                if (!inplace)
                                {
                                    result.push(elem);
                                }
                            } else if (inplace)
                            {
                                curLoop[i] = false;
                            }
                        }
                    }

                    return false;
                },

                /**
                 *
                 */
                ID: function(match)
                {
                    return match[1].replace(rBackslash, "");
                },

                /**
                 *
                 */
                TAG: function(match, curLoop)
                {
                    return match[1].replace(rBackslash, "").toLowerCase();
                },

                /**
                 *
                 */
                CHILD: function(match)
                {
                    if (match[1] === "nth")
                    {
                        if (!match[2])
                        {
                            Sizzle.error(match[0]);
                        }

                        match[2] = match[2].replace(/^\+|\s*/g, '');

                        /**
                         * Analisar equações como:
                         *     'even',
                         *     'odd',
                         *     '5',
                         *     '2n',
                         *     '3n+2',
                         *     '4n-1',
                         *     '-n+6'.
                         */
                        var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
                            match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
                            !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]
                        );

                        /**
                         * calcule os números (first)n+(last) inclusive se
                         * forem negativos.
                         */
                        match[2] = (test[1] + (test[2] || 1)) - 0;
                        match[3] = test[3] - 0;
                    } else if (match[2])
                    {
                        Sizzle.error(match[0]);
                    }

                    /**
                     * TODO: Mude para o sistema de cache normal.
                     */
                    match[0] = done++;

                    return match;
                },

                /**
                 *
                 */
                ATTR: function(match, curLoop, inplace, result, not, isXML)
                {
                    var name = match[1] = match[1].replace(rBackslash, "");

                    if (!isXML && Expr.attrMap[name])
                    {
                        match[1] = Expr.attrMap[name];
                    }

                    /**
                     * Manipular se um valor sem aspas foi usado.
                     */
                    match[4] = (match[4] || match[5] || "").replace(rBackslash, "");

                    if (match[2] === "~=")
                    {
                        match[4] = " " + match[4] + " ";
                    }

                    return match;
                },

                /**
                 *
                 */
                PSEUDO: function(match, curLoop, inplace, result, not)
                {
                    if (match[1] === "not")
                    {
                        /**
                         * Se estivermos lidando com uma expressão complexa
                         * ou simples.
                         */
                        if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3]))
                        {
                            match[3] = Sizzle(match[3], null, null, curLoop);
                        } else
                        {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                            if (!inplace)
                            {
                                result.push.apply(result, ret);
                            }

                            return false;
                        }
                    } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0]))
                    {
                        return true;
                    }

                    return match;
                },

                /**
                 *
                 */
                POS: function(match)
                {
                    match.unshift(true);

                    return match;
                }
            },

            /**
             *
             */
            filters: {
                /**
                 *
                 */
                enabled: function(elem)
                {
                    return elem.disabled === false && elem.type !== "hidden";
                },

                /**
                 *
                 */
                disabled: function(elem)
                {
                    return elem.disabled === true;
                },

                /**
                 *
                 */
                checked: function(elem)
                {
                    return elem.checked === true;
                },

                /**
                 *
                 */
                selected: function(elem)
                {
                    /**
                     * Acessar esta propriedade faz com que as opções
                     * selecionadas por padrão no Safari funcionem
                     * corretamente.
                     */
                    if (elem.parentNode)
                    {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                /**
                 *
                 */
                parent: function(elem)
                {
                    return !!elem.firstChild;
                },

                /**
                 *
                 */
                empty: function(elem)
                {
                    return !elem.firstChild;
                },

                /**
                 *
                 */
                has: function(elem, i, match)
                {
                    return !!Sizzle(match[3], elem).length;
                },

                /**
                 *
                 */
                header: function(elem)
                {
                    return (/h\d/i).test(elem.nodeName);
                },

                /**
                 *
                 */
                text: function(elem)
                {
                    var attr = elem.getAttribute( "type" ), type = elem.type;

                    /**
                     * IE6 e 7 mapearão elem.type para 'text' para novos
                     * tipos de HTML5 (pesquisa, etc). Use getAttribute
                     * para testar este caso.
                     */
                    return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
                },

                /**
                 *
                 */
                radio: function(elem)
                {
                    return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
                },

                /**
                 *
                 */
                checkbox: function(elem)
                {
                    return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
                },

                /**
                 *
                 */
                file: function(elem)
                {
                    return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
                },

                /**
                 *
                 */
                password: function(elem)
                {
                    return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
                },

                /**
                 *
                 */
                submit: function(elem)
                {
                    var name = elem.nodeName.toLowerCase();

                    return (name === "input" || name === "button") && "submit" === elem.type;
                },

                /**
                 *
                 */
                image: function(elem)
                {
                    return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
                },

                /**
                 *
                 */
                reset: function(elem)
                {
                    var name = elem.nodeName.toLowerCase();

                    return (name === "input" || name === "button") && "reset" === elem.type;
                },

                /**
                 *
                 */
                button: function(elem)
                {
                    var name = elem.nodeName.toLowerCase();

                    return name === "input" && "button" === elem.type || name === "button";
                },

                /**
                 *
                 */
                input: function(elem)
                {
                    return (/input|select|textarea|button/i).test(elem.nodeName);
                },

                /**
                 *
                 */
                focus: function(elem)
                {
                    return elem === elem.ownerDocument.activeElement;
                }
            },

            /**
             *
             */
            setFilters: {
                /**
                 *
                 */
                first: function(elem, i)
                {
                    return i === 0;
                },

                /**
                 *
                 */
                last: function(elem, i, match, array)
                {
                    return i === array.length - 1;
                },

                /**
                 *
                 */
                even: function(elem, i)
                {
                    return i % 2 === 0;
                },

                /**
                 *
                 */
                odd: function(elem, i)
                {
                    return i % 2 === 1;
                },

                /**
                 *
                 */
                lt: function(elem, i, match)
                {
                    return i < match[3] - 0;
                },

                /**
                 *
                 */
                gt: function(elem, i, match)
                {
                    return i > match[3] - 0;
                },

                /**
                 *
                 */
                nth: function(elem, i, match)
                {
                    return match[3] - 0 === i;
                },

                /**
                 *
                 */
                eq: function(elem, i, match)
                {
                    return match[3] - 0 === i;
                }
            },

            /**
             *
             */
            filter: {
                /**
                 *
                 */
                PSEUDO: function(elem, match, i, array)
                {
                    var name = match[1],
                        filter = Expr.filters[name];

                    if (filter)
                    {
                        return filter(elem, i, match, array);
                    } else if (name === "contains")
                    {
                        return (elem.textContent || elem.innerText || getText([elem]) || "").indexOf(match[3]) >= 0;
                    } else if (name === "not")
                    {
                        var not = match[3];

                        for (var j = 0, l = not.length; j < l; j++)
                        {
                            if (not[j] === elem)
                            {
                                return false;
                            }
                        }

                        return true;
                    } else
                    {
                        Sizzle.error(name);
                    }
                },

                /**
                 *
                 */
                CHILD: function(elem, match)
                {
                    var first,
                        last,
                        doneName,
                        parent,
                        cache,
                        count,
                        diff,
                        type = match[1],
                        node = elem;

                    switch (type)
                    {
                        case "only":
                        case "first":
                            while ((node = node.previousSibling))
                            {
                                if (node.nodeType === 1)
                                {
                                    return false;
                                }
                            }

                            if (type === "first")
                            {
                                return true; 
                            }

                            node = elem;

                        case "last":
                            while ((node = node.nextSibling))
                            {
                                if (node.nodeType === 1)
                                {
                                    return false;
                                }
                            }

                            return true;

                        case "nth":
                            first = match[2];
                            last = match[3];

                            if (first === 1 && last === 0)
                            {
                                return true;
                            }

                            doneName = match[0];
                            parent = elem.parentNode;

                            if (parent && (parent[expando] !== doneName || !elem.nodeIndex))
                            {
                                count = 0;

                                for (node = parent.firstChild; node; node = node.nextSibling)
                                {
                                    if (node.nodeType === 1)
                                    {
                                        node.nodeIndex = ++count;
                                    }
                                }

                                parent[expando] = doneName;
                            }

                            /**
                             *
                             */
                            diff = elem.nodeIndex - last;

                            if (first === 0)
                            {
                                return diff === 0;
                            } else
                            {
                                return (diff % first === 0 && diff / first >= 0);
                            }
                    }
                },

                /**
                 *
                 */
                ID: function(elem, match)
                {
                    return elem.nodeType === 1 && elem.getAttribute("id") === match;
                },

                /**
                 *
                 */
                TAG: function(elem, match)
                {
                    return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
                },

                /**
                 *
                 */
                CLASS: function(elem, match)
                {
                    return (
                        " " + (elem.className || elem.getAttribute("class")) + " "
                    ).indexOf(match) > -1;
                },

                /**
                 *
                 */
                ATTR: function(elem, match)
                {
                    var name = match[1],
                        result = Sizzle.attr ? Sizzle.attr(elem, name) : Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name),
                        value = result + "",
                        type = match[2],
                        check = match[4];

                    /**
                     *
                     */
                    return result == null ? type === "!=" : !type && Sizzle.attr ? result != null : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value !== check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
                },

                /**
                 *
                 */
                POS: function(elem, match, i, array)
                {
                    var name = match[2],
                        filter = Expr.setFilters[name];

                    if (filter)
                    {
                        return filter(elem, i, match, array);
                    }
                }
            }
        };

        /**
         *
         */
        var origPOS = Expr.match.POS,
            fescape = function(all, num)
            {
                return "\\" + (num - 0 + 1);
            };

        /**
         *
         */
        for (var type in Expr.match)
        {
            Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
            Expr.leftMatch[type] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
        }

        /**
         *
         */
        var makeArray = function(array, results)
        {
            array = Array.prototype.slice.call(array, 0);

            if (results)
            {
                results.push.apply(results, array);

                return results;
            }

            return array;
        };

        /**
         * Execute uma verificação simples para determinar se o
         * navegador é capaz de converter um NodeList em um array
         * usando métodos integrados. Também verifica se o array
         * retornado contém nós DOM (o que não é o caso no
         * navegador Blackberry).
         */
        try
        {
            Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;

            /**
             * Forneça um método alternativo se não funcionar.
             */
        } catch(e)
        {
            makeArray = function(array, results)
            {
                var i = 0,
                    ret = results || [];

                if (toString.call(array) === "[object Array]")
                {
                    Array.prototype.push.apply(ret, array);
                } else
                {
                    if (typeof array.length === "number")
                    {
                        for (var l = array.length; i < l; i++)
                        {
                            ret.push(array[i]);
                        }
                    } else
                    {
                        for (; array[i]; i++)
                        {
                            ret.push(array[i]);
                        }
                    }
                }

                return ret;
            };
        }

        /**
         *
         */
        var sortOrder,
            siblingCheck;

        /**
         *
         */
        if (document.documentElement.compareDocumentPosition)
        {
            sortOrder = function(a, b)
            {
                if (a === b)
                {
                    hasDuplicate = true;

                    return 0;
                }

                if (!a.compareDocumentPosition || !b.compareDocumentPosition)
                {
                    return a.compareDocumentPosition ? -1 : 1;
                }

                return a.compareDocumentPosition(b) & 4 ? -1 : 1;
            };
        } else
        {
            sortOrder = function(a, b)
            {
                /**
                 * Os nodes são idênticos, podemos sair mais cedo.
                 */
                if (a === b)
                {
                    hasDuplicate = true;

                    return 0;

                    /**
                     * Fallback para usar sourceIndex (no IE) se estiver
                     * disponível em ambos os nodes.
                     */
                } else if (a.sourceIndex && b.sourceIndex)
                {
                    return a.sourceIndex - b.sourceIndex;
                }

                var al,
                    bl,
                    ap = [],
                    bp = [],
                    aup = a.parentNode,
                    bup = b.parentNode,
                    cur = aup;

                /**
                 * Se os nodes forem irmãos (ou idênticos), podemos fazer
                 * uma verificação rápida.
                 */
                if (aup === bup)
                {
                    return siblingCheck(a, b);

                    /**
                     * Se nenhum node mais alto for encontrado, os nodes
                     * serão desconectados.
                     */
                } else if (!aup)
                {
                    return -1;
                } else if (!bup)
                {
                    return 1;
                }

                /**
                 * Caso contrário, eles estão em algum outro lugar na
                 * árvore, então precisamos construir uma lista completa
                 * de parentNodes para comparação.
                 */
                while (cur)
                {
                    ap.unshift(cur);
                    cur = cur.parentNode;
                }

                /**
                 *
                 */
                cur = bup;

                /**
                 *
                 */
                while (cur)
                {
                    bp.unshift(cur);
                    cur = cur.parentNode;
                }

                /**
                 *
                 */
                al = ap.length;
                bl = bp.length;

                /**
                 * Comece a descer a árvore procurando uma base.
                 */
                for (var i = 0; i < al && i < bl; i++)
                {
                    if (ap[i] !== bp[i])
                    {
                        return siblingCheck(ap[i], bp[i]);
                    }
                }

                /**
                 * Terminamos em algum lugar no alto da árvore,
                 * então faça uma verificação de nodes na mesma
                 * camada.
                 */
                return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
            };

            /**
             *
             */
            siblingCheck = function(a, b, ret)
            {
                if (a === b)
                {
                    return ret;
                }

                /**
                 *
                 */
                var cur = a.nextSibling;

                /**
                 *
                 */
                while (cur)
                {
                    if (cur === b)
                    {
                        return -1;
                    }

                    cur = cur.nextSibling;
                }

                return 1;
            };
        }

        /**
         * Verifique se o navegador retorna elementos por nome
         * ao consultar por getElementById (e forneça uma solução
         * alternativa).
         */
        (function()
        {
            /**
             * Vamos injetar um elemento de entrada falso com um
             * nome especificado.
             */
            var form = document.createElement("div"),
                id = "script" + (new Date()).getTime(),
                root = document.documentElement;

            /**
             *
             */
            form.innerHTML = "<a name='" + id + "'/>";

            /**
             * Injete-o no elemento raiz, verifique seu status e
             * remova-o rapidamente.
             */
            root.insertBefore(form, root.firstChild);

            /**
             * A solução alternativa precisa fazer verificações
             * adicionais após um getElementById. O que torna as
             * coisas mais lentas para outros navegadores (daí a
             * ramificação).
             */
            if (document.getElementById(id))
            {
                Expr.find.ID = function(match, context, isXML)
                {
                    if (typeof context.getElementById !== "undefined" && !isXML)
                    {
                        var m = context.getElementById(match[1]);

                        /**
                         *
                         */
                        return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
                    }
                };

                /**
                 *
                 */
                Expr.filter.ID = function(elem, match)
                {
                    var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

                    return elem.nodeType === 1 && node && node.nodeValue === match;
                };
            }

            /**
             *
             */
            root.removeChild(form);

            /**
             * Liberar memória no IE.
             */
            root = form = null;
        })();

        /**
         *
         */
        (function()
        {
            /**
             * Verifique se o navegador retorna apenas elementos
             * ao executar getElementsByTagName("*").
             */

            /**
             * Crie um elemento falso.
             */
            var div = document.createElement("div");
                div.appendChild(document.createComment(""));

            /**
             * Certifique-se de que nenhum comentário seja encontrado.
             */
            if (div.getElementsByTagName("*").length > 0)
            {
                Expr.find.TAG = function(match, context)
                {
                    var results = context.getElementsByTagName(match[1]);

                    /**
                     * Filtre possíveis comentários.
                     */
                    if (match[1] === "*")
                    {
                        var tmp = [];

                        for (var i = 0; results[i]; i++)
                        {
                            if (results[i].nodeType === 1)
                            {
                                tmp.push(results[i]);
                            }
                        }

                        results = tmp;
                    }

                    return results;
                };
            }

            /**
             * Verifique se um atributo retorna atributos href normalizados.
             */
            div.innerHTML = "<a href='#'></a>";

            /**
             *
             */
            if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#")
            {
                Expr.attrHandle.href = function(elem)
                {
                    return elem.getAttribute("href", 2);
                };
            }

            /**
             * Liberar memória no IE.
             */
            div = null;
        })();

        /**
         *
         */
        if (document.querySelectorAll)
        {
            (function()
            {
                var oldSizzle = Sizzle,
                    div = document.createElement("div"),
                    id = "__sizzle__";

                div.innerHTML = "<p class='TEST'></p>";

                /**
                 * O Safari não consegue lidar com caracteres maiúsculos
                 * ou Unicode no modo quirks.
                 */
                if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0)
                {
                    return;
                }

                /**
                 *
                 */
                Sizzle = function(query, context, extra, seed)
                {
                    context = context || document;

                    /**
                     * Use querySelectorAll apenas em documentos não XML
                     * (os seletores de ID não funcionam em documentos
                     * não HTML).
                     */
                    if (!seed && !Sizzle.isXML(context))
                    {
                        /**
                         * Veja se encontramos um seletor para acelerar.
                         */
                        var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);

                        if (match && (context.nodeType === 1 || context.nodeType === 9))
                        {
                            /**
                             * Speed-up: Sizzle("TAG").
                             */
                            if (match[1])
                            {
                                return makeArray(context.getElementsByTagName(query), extra);

                                /**
                                 * Speed-up: Sizzle(".CLASS").
                                 */
                            } else if (match[2] && Expr.find.CLASS && context.getElementsByClassName)
                            {
                                return makeArray(context.getElementsByClassName(match[2]), extra);
                            }
                        }

                        if (context.nodeType === 9)
                        {
                            /**
                             * Speed-up: Sizzle("body").
                             *
                             * O elemento body existe apenas uma vez, otimize
                             * sua localização.
                             */
                            if (query === "body" && context.body)
                            {
                                return makeArray([context.body], extra);

                                /**
                                 * Speed-up: Sizzle("#ID").
                                 */
                            } else if (match && match[3])
                            {
                                var elem = context.getElementById(match[3]);

                                /**
                                 * Verifique parentNode para detectar quando o
                                 * Blackberry 4.6 retorna nodes que não estão
                                 * mais no documento #6963.
                                 */
                                if (elem && elem.parentNode)
                                {
                                    /**
                                     * Lide com o caso em que o IE e o Opera
                                     * retornam itens por nome em vez de ID.
                                     */
                                    if (elem.id === match[3])
                                    {
                                        return makeArray([elem], extra);
                                    }
                                } else
                                {
                                    return makeArray([], extra);
                                }
                            }

                            try
                            {
                                return makeArray(context.querySelectorAll(query), extra);
                            } catch(qsaError)
                            {
                            }

                            /**
                             * qSA funciona estranhamente em consultas enraizadas
                             * em elementos. Podemos contornar isso especificando
                             * um ID extra na raiz e trabalhando a partir daí. O
                             * IE 8 não funciona em elementos de objeto.
                             */
                        } else if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object")
                        {
                            var oldContext = context,
                                old = context.getAttribute("id"),
                                nid = old || id,
                                hasParent = context.parentNode,
                                relativeHierarchySelector = /^\s*[+~]/.test( query );

                            if (!old)
                            {
                                context.setAttribute("id", nid);
                            } else
                            {
                                nid = nid.replace( /'/g, "\\$&");
                            }

                            if (relativeHierarchySelector && hasParent)
                            {
                                context = context.parentNode;
                            }

                            try
                            {
                                if (!relativeHierarchySelector || hasParent)
                                {
                                    return makeArray(context.querySelectorAll("[id='" + nid + "'] " + query), extra);
                                }
                            } catch(pseudoError)
                            {
                            } finally
                            {
                                if (!old)
                                {
                                    oldContext.removeAttribute("id");
                                }
                            }
                        }
                    }

                    return oldSizzle(query, context, extra, seed);
                };

                for (var prop in oldSizzle)
                {
                    Sizzle[prop] = oldSizzle[prop];
                }

                /**
                 * Liberar memória no IE.
                 */
                div = null;
            })();
        }

        /**
         *
         */
        (function()
        {
            var html = document.documentElement,
                matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

            if (matches)
            {
                /**
                 * Verifique se é possível fazer matchesSelector em
                 * um node desconectado (o IE 9 falha nisso).
                 */
                var disconnectedMatch = !matches.call(document.createElement("div"), "div"),
                    pseudoWorks = false;

                try
                {
                    /**
                     * Isso deve falhar com uma exceção. Gecko não
                     * comete falhas, em vez disso retorna false.
                     */
                    matches.call(document.documentElement, "[test!='']:sizzle");
                } catch(pseudoError)
                {
                    pseudoWorks = true;
                }

                /**
                 *
                 */
                Sizzle.matchesSelector = function(node, expr)
                {
                    /**
                     * Certifique-se de que os seletores de atributos
                     * estejam entre aspas.
                     */
                    expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

                    /**
                     *
                     */
                    if (!Sizzle.isXML(node))
                    {
                        try
                        {
                            if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr))
                            {
                                var ret = matches.call(node, expr);

                                /**
                                 * O matchesSelector do IE 9 retorna false em
                                 * nodes desconectados.
                                 * 
                                 * node.document && node.document.nodeType !== 11
                                 *     - Da mesma forma, diz-se que os nós
                                 *       desconectados estão em um fragmento de
                                 *       documento no IE 9, então verifique
                                 *       isso.
                                 */
                                if (ret || !disconnectedMatch || node.document && node.document.nodeType !== 11)
                                {
                                    return ret;
                                }
                            }
                        } catch(e)
                        {
                        }
                    }

                    return Sizzle(expr, null, null, [node]).length > 0;
                };
            }
        })();

        /**
         *
         */
        (function()
        {
            var div = document.createElement("div");
                div.innerHTML = "<div class='test e'></div><div class='test'></div>";

            /**
             * O Opera não consegue encontrar um segundo nome
             * de classe (em 9.6). Além disso, certifique-se
             * de que getElementsByClassName realmente exista.
             */
            if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0)
            {
                return;
            }

            /**
             * O Safari armazena atributos de classe em cache,
             * não captura alterações (em 3.2).
             */
            div.lastChild.className = "e";

            /**
             *
             */
            if (div.getElementsByClassName("e").length === 1)
            {
                return;
            }

            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function(match, context, isXML)
            {
                if (typeof context.getElementsByClassName !== "undefined" && !isXML)
                {
                    return context.getElementsByClassName(match[1]);
                }
            };

            /**
             * Liberar memória no IE.
             */
            div = null;
        })();

        /**
         *
         */
        function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML)
        {
            for (var i = 0, l = checkSet.length; i < l; i++)
            {
                var elem = checkSet[i];

                if (elem)
                {
                    var match = false;
                        elem = elem[dir];

                    while (elem)
                    {
                        if (elem[expando] === doneName)
                        {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if (elem.nodeType === 1 && !isXML)
                        {
                            elem[expando] = doneName;
                            elem.sizset = i;
                        }

                        if (elem.nodeName.toLowerCase() === cur)
                        {
                            match = elem;
                            break;
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        /**
         *
         */
        function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML)
        {
            for (var i = 0, l = checkSet.length; i < l; i++)
            {
                var elem = checkSet[i];

                if (elem)
                {
                    var match = false;
                        elem = elem[dir];

                    while (elem)
                    {
                        if (elem[expando] === doneName)
                        {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if (elem.nodeType === 1)
                        {
                            if (!isXML)
                            {
                                elem[expando] = doneName;
                                elem.sizset = i;
                            }

                            if (typeof cur !== "string")
                            {
                                if (elem === cur)
                                {
                                    match = true;
                                    break;
                                }
                            } else if (Sizzle.filter(cur, [elem]).length > 0)
                            {
                                match = elem;
                                break;
                            }
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        /**
         *
         */
        if (document.documentElement.contains)
        {
            Sizzle.contains = function(a, b)
            {
                return a !== b && (a.contains ? a.contains(b) : true);
            };
        } else if (document.documentElement.compareDocumentPosition)
        {
            Sizzle.contains = function(a, b)
            {
                return !!(a.compareDocumentPosition(b) & 16);
            };
        } else
        {
            Sizzle.contains = function()
            {
                return false;
            };
        }

        /**
         *
         */
        Sizzle.isXML = function(elem)
        {
            /**
             * documentElement é verificado para casos onde ainda
             * não existe (como carregar iframes no IE - #4833).
             */
            var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        /**
         *
         */
        var posProcess = function(selector, context, seed)
        {
            var match,
                tmpSet = [],
                later = "",
                root = context.nodeType ? [context] : context;

            /**
             * Os seletores de posição devem ser feitos após o
             * filtro. E o mesmo deve acontecer com :not(positional)
             * então movemos todos os PSEUDOs para o final.
             */
            while ((match = Expr.match.PSEUDO.exec(selector)))
            {
                later += match[0];
                selector = selector.replace(Expr.match.PSEUDO, "");
            }

            /**
             *
             */
            selector = Expr.relative[selector] ? selector + "*" : selector;

            /**
             *
             */
            for (var i = 0, l = root.length; i < l; i++)
            {
                Sizzle(selector, root[i], tmpSet, seed);
            }

            return Sizzle.filter(later, tmpSet);
        };

        /**
         * EXPOR.
         * Substitua a recuperação do atributo sizzle.
         */
        Sizzle.attr = jQuery.attr;
        Sizzle.selectors.attrMap = {};
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.filters;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;
    })();

    /**
     *
     */
    var runtil = /Until$/,
        /**
         *
         */
        rparentsprev = /^(?:parents|prevUntil|prevAll)/,

        /**
         * Observação: Este RegExp deve ser melhorado ou provavelmente
         * retirado do Sizzle.
         */
        rmultiselector = /,/,

        /**
         *
         */
        isSimple = /^.[^:#\[\.,]*$/,

        /**
         *
         */
        slice = Array.prototype.slice,

        /**
         *
         */
        POS = jQuery.expr.match.POS,

        /**
         * Métodos garantidos para produzir um conjunto único
         * ao iniciar a partir de um conjunto único.
         */
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        find: function(selector)
        {
            var self = this,
                i,
                l;

            /**
             *
             */
            if (typeof selector !== "string")
            {
                return jQuery(selector).filter(function()
                {
                    for (i = 0, l = self.length; i < l; i++)
                    {
                        if (jQuery.contains(self[i], this))
                        {
                            return true;
                        }
                    }
                });
            }

            /**
             *
             */
            var ret = this.pushStack("", "find", selector),
                length,
                n,
                r;

            for (i = 0, l = this.length; i < l; i++)
            {
                length = ret.length;
                jQuery.find(selector, this[i], ret);

                if (i > 0)
                {
                    /**
                     * Certifique-se de que os resultados sejam únicos.
                     */
                    for (n = length; n < ret.length; n++)
                    {
                        for (r = 0; r < length; r++)
                        {
                            if (ret[r] === ret[n])
                            {
                                ret.splice(n--, 1);
                                break;
                            }
                        }
                    }
                }
            }

            return ret;
        },

        /**
         *
         */
        has: function(target)
        {
            var targets = jQuery(target);

            return this.filter(function()
            {
                for (var i = 0, l = targets.length; i < l; i++)
                {
                    if (jQuery.contains(this, targets[i]))
                    {
                        return true;
                    }
                }
            });
        },

        /**
         *
         */
        not: function(selector)
        {
            return this.pushStack(winnow(this, selector, false), "not", selector);
        },

        /**
         *
         */
        filter: function(selector)
        {
            return this.pushStack(winnow(this, selector, true), "filter", selector);
        },

        /**
         *
         */
        is: function(selector)
        {
            return !!selector && (
                typeof selector === "string" ?
                    /**
                     * Se este for um seletor posicional, verifique a
                     * associação no conjunto retornado para que
                     * $("p:first").is("p:last") não retorne true para
                     * um documento com dois "p".
                     */
                    POS.test(selector) ? 
                        jQuery(selector, this.context).index(this[0]) >= 0 :
                        jQuery.filter(selector, this).length > 0 :
                    this.filter(selector).length > 0);
        },

        /**
         *
         */
        closest: function(selectors, context)
        {
            var ret = [],
                i,
                l,
                cur = this[0];

            /**
             * Array (obsoleto a partir de jQuery 1.7).
             */
            if (jQuery.isArray(selectors))
            {
                var level = 1;

                while (cur && cur.ownerDocument && cur !== context)
                {
                    for (i = 0; i < selectors.length; i++)
                    {
                        if (jQuery(cur).is(selectors[i]))
                        {
                            ret.push({
                                selector: selectors[i],
                                elem: cur,
                                level: level
                            });
                        }
                    }

                    cur = cur.parentNode;
                    level++;
                }

                return ret;
            }

            /**
             * String.
             */
            var pos = POS.test(selectors) || typeof selectors !== "string" ?
                jQuery(selectors, context || this.context) :
                0;

            for (i = 0, l = this.length; i < l; i++)
            {
                cur = this[i];

                while (cur)
                {
                    if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors))
                    {
                        ret.push(cur);

                        break;
                    } else
                    {
                        cur = cur.parentNode;

                        if (!cur || !cur.ownerDocument || cur === context || cur.nodeType === 11)
                        {
                            break;
                        }
                    }
                }
            }

            /**
             *
             */
            ret = ret.length > 1 ? jQuery.unique(ret) : ret;

            /**
             *
             */
            return this.pushStack(ret, "closest", selectors);
        },

        /**
         * Determine a posição de um elemento dentro do conjunto
         * correspondente de elementos.
         */
        index: function(elem)
        {
            /**
             * Sem argumento, retorne o índice na camada mais alta.
             */
            if (!elem)
            {
                return (this[0] && this[0].parentNode) ? this.prevAll().length : -1;
            }

            /**
             * índice no seletor.
             */
            if (typeof elem === "string")
            {
                return jQuery.inArray(this[0], jQuery(elem));
            }

            /**
             * Localize a posição do elemento desejado.
             */
            return jQuery.inArray(
                /**
                 * Se receber um objeto jQuery, o primeiro elemento
                 * será usado.
                 */
                elem.jquery ? elem[0] : elem, this
            );
        },

        /**
         *
         */
        add: function(selector, context)
        {
            var set = typeof selector === "string" ?
                    jQuery(selector, context) :
                    jQuery.makeArray(selector && selector.nodeType ? [selector] : selector),
                all = jQuery.merge(this.get(), set);

            /**
             *
             */
            return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ? all : jQuery.unique(all));
        },

        /**
         *
         */
        andSelf: function()
        {
            return this.add(this.prevObject);
        }
    });

    /**
     * Uma verificação complexamente simples para ver se
     * um elemento está desconectado de um documento (deve
     * ser melhorado, sempre que possível).
     */
    function isDisconnected(node)
    {
        return !node || !node.parentNode || node.parentNode.nodeType === 11;
    }

    /**
     *
     */
    jQuery.each({
        /**
         *
         */
        parent: function(elem)
        {
            var parent = elem.parentNode;

            return parent && parent.nodeType !== 11 ? parent : null;
        },

        /**
         *
         */
        parents: function(elem)
        {
            return jQuery.dir(elem, "parentNode");
        },

        /**
         *
         */
        parentsUntil: function(elem, i, until)
        {
            return jQuery.dir(elem, "parentNode", until);
        },

        /**
         *
         */
        next: function(elem)
        {
            return jQuery.nth(elem, 2, "nextSibling");
        },

        /**
         *
         */
        prev: function(elem)
        {
            return jQuery.nth(elem, 2, "previousSibling");
        },

        /**
         *
         */
        nextAll: function(elem)
        {
            return jQuery.dir(elem, "nextSibling");
        },

        /**
         *
         */
        prevAll: function(elem)
        {
            return jQuery.dir(elem, "previousSibling");
        },

        /**
         *
         */
        nextUntil: function(elem, i, until)
        {
            return jQuery.dir(elem, "nextSibling", until);
        },

        /**
         *
         */
        prevUntil: function(elem, i, until)
        {
            return jQuery.dir(elem, "previousSibling", until);
        },

        /**
         *
         */
        siblings: function(elem)
        {
            return jQuery.sibling(elem.parentNode.firstChild, elem);
        },

        /**
         *
         */
        children: function(elem)
        {
            return jQuery.sibling(elem.firstChild);
        },

        /**
         *
         */
        contents: function(elem)
        {
            return jQuery.nodeName(elem, "iframe") ?
                elem.contentDocument || elem.contentWindow.document :
                jQuery.makeArray(elem.childNodes);
        }
    }, function(name, fn)
    {
        jQuery.fn[name] = function(until, selector)
        {
            var ret = jQuery.map(this, fn, until);

            if (!runtil.test(name))
            {
                selector = until;
            }

            if (selector && typeof selector === "string")
            {
                ret = jQuery.filter(selector, ret);
            }

            ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;

            if ((this.length > 1 || rmultiselector.test(selector)) && rparentsprev.test(name))
            {
                ret = ret.reverse();
            }

            return this.pushStack(ret, name, slice.call(arguments).join(","));
        };
    });

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        filter: function(expr, elems, not)
        {
            if (not)
            {
                expr = ":not(" + expr + ")";
            }

            return elems.length === 1 ?
                jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] :
                jQuery.find.matches(expr, elems);
        },

        /**
         *
         */
        dir: function(elem, dir, until)
        {
            var matched = [],
                cur = elem[dir];

            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until)))
            {
                if (cur.nodeType === 1)
                {
                    matched.push(cur);
                }

                cur = cur[dir];
            }

            return matched;
        },

        /**
         *
         */
        nth: function(cur, result, dir, elem)
        {
            result = result || 1;
            var num = 0;

            for (; cur; cur = cur[dir])
            {
                if (cur.nodeType === 1 && ++num === result)
                {
                    break;
                }
            }

            return cur;
        },

        /**
         *
         */
        sibling: function(n, elem)
        {
            var r = [];

            for (; n; n = n.nextSibling)
            {
                if (n.nodeType === 1 && n !== elem)
                {
                    r.push(n);
                }
            }

            return r;
        }
    });

    /**
     * Implemente a funcionalidade idêntica para filtro e não.
     */
    function winnow(elements, qualifier, keep)
    {
        /**
         * Não é possível passar nulo ou indefinido para indexOf
         * no Firefox 4. Defina como 0 para pular a verificação
         * de string.
         */
        qualifier = qualifier || 0;

        /**
         *
         */
        if (jQuery.isFunction(qualifier))
        {
            return jQuery.grep(elements, function(elem, i)
            {
                var retVal = !!qualifier.call(elem, i, elem);

                return retVal === keep;
            });
        } else if (qualifier.nodeType)
        {
            return jQuery.grep(elements, function(elem, i)
            {
                return (elem === qualifier) === keep;
            });
        } else if (typeof qualifier === "string")
        {
            var filtered = jQuery.grep(elements, function(elem)
            {
                return elem.nodeType === 1;
            });

            if (isSimple.test(qualifier))
            {
                return jQuery.filter(qualifier, filtered, !keep);
            } else
            {
                qualifier = jQuery.filter(qualifier, filtered);
            }
        }

        return jQuery.grep(elements, function(elem, i)
        {
            return (jQuery.inArray(elem, qualifier) >= 0) === keep;
        });
    }

    /**
     *
     */
    function createSafeFragment(document)
    {
        var list = nodeNames.split( "|" ),
        safeFrag = document.createDocumentFragment();

        if (safeFrag.createElement)
        {
            while (list.length)
            {
                safeFrag.createElement(
                    list.pop()
                );
            }
        }

        return safeFrag;
    }

    /**
     *
     */
    var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i,
        rhtml = /<|&#?\w+;/,
        rnoInnerhtml = /<(?:script|style)/i,
        rnocache = /<(?:script|object|embed|option|style)/i,
        rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),

        /**
         * checked="checked" ou checked.
         */
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

        /**
         *
         */
        rscriptType = /\/(java|ecma)script/i,

        /**
         *
         */
        rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,

        /**
         *
         */
        wrapMap = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            legend: [ 1, "<fieldset>", "</fieldset>" ],
            thead: [ 1, "<table>", "</table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
            area: [ 1, "<map>", "</map>" ],
            _default: [ 0, "", "" ]
        },

        /**
         *
         */
        safeFragment = createSafeFragment(document);

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    /**
     * O IE não pode serializar as tags <link> e <script>
     * normalmente.
     */
    if (!jQuery.support.htmlSerialize)
    {
        wrapMap._default = [ 1, "div<div>", "</div>" ];
    }

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        text: function(text)
        {
            if (jQuery.isFunction(text))
            {
                return this.each(function(i)
                {
                    var self = jQuery(this);

                    self.text(text.call(this, i, self.text()));
                });
            }

            if (typeof text !== "object" && text !== undefined)
            {
                return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
            }

            return jQuery.text(this);
        },

        /**
         *
         */
        wrapAll: function(html)
        {
            if (jQuery.isFunction(html))
            {
                return this.each(function(i)
                {
                    jQuery(this).wrapAll(html.call(this, i));
                });
            }

            if (this[0])
            {
                /**
                 * Os elementos para envolver o alvo.
                 */
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

                if (this[0].parentNode)
                {
                    wrap.insertBefore(this[0]);
                }

                wrap.map(function()
                {
                    var elem = this;

                    while (elem.firstChild && elem.firstChild.nodeType === 1)
                    {
                        elem = elem.firstChild;
                    }

                    return elem;
                }).append(this);
            }

            return this;
        },

        /**
         *
         */
        wrapInner: function(html)
        {
            if (jQuery.isFunction(html))
            {
                return this.each(function(i)
                {
                    jQuery(this).wrapInner(html.call(this, i));
                });
            }

            return this.each(function()
            {
                var self = jQuery(this),
                    contents = self.contents();

                if (contents.length)
                {
                    contents.wrapAll(html);
                } else
                {
                    self.append(html);
                }
            });
        },

        /**
         *
         */
        wrap: function(html)
        {
            var isFunction = jQuery.isFunction(html);

            return this.each(function(i)
            {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },

        /**
         *
         */
        unwrap: function()
        {
            return this.parent().each(function()
            {
                if (!jQuery.nodeName(this, "body"))
                {
                    jQuery(this).replaceWith(this.childNodes);
                }
            }).end();
        },

        /**
         *
         */
        append: function()
        {
            return this.domManip(arguments, true, function(elem)
            {
                if (this.nodeType === 1)
                {
                    this.appendChild(elem);
                }
            });
        },

        /**
         *
         */
        prepend: function()
        {
            return this.domManip(arguments, true, function(elem)
            {
                if (this.nodeType === 1)
                {
                    this.insertBefore(elem, this.firstChild);
                }
            });
        },

        /**
         *
         */
        before: function()
        {
            if (this[0] && this[0].parentNode)
            {
                return this.domManip(arguments, false, function(elem)
                {
                    this.parentNode.insertBefore(elem, this);
                });
            } else if (arguments.length)
            {
                var set = jQuery.clean(arguments);
                    set.push.apply(set, this.toArray());

                return this.pushStack(set, "before", arguments);
            }
        },

        /**
         *
         */
        after: function()
        {
            if (this[0] && this[0].parentNode)
            {
                return this.domManip(arguments, false, function(elem)
                {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                });
            } else if (arguments.length)
            {
                var set = this.pushStack(this, "after", arguments);
                    set.push.apply(set, jQuery.clean(arguments));

                return set;
            }
        },

        /**
         * keepData é apenas para uso interno – não documente.
         */
        remove: function(selector, keepData)
        {
            for (var i = 0, elem; (elem = this[i]) != null; i++)
            {
                if (!selector || jQuery.filter(selector, [elem]).length)
                {
                    if (!keepData && elem.nodeType === 1)
                    {
                        jQuery.cleanData(elem.getElementsByTagName("*"));
                        jQuery.cleanData([elem]);
                    }

                    if (elem.parentNode)
                    {
                        elem.parentNode.removeChild(elem);
                    }
                }
            }

            return this;
        },

        /**
         *
         */
        empty: function()
        {
            for (var i = 0, elem; (elem = this[i]) != null; i++)
            {
                /**
                 * Remova nodes de elementos e evite vazamentos de
                 * memória.
                 */
                if (elem.nodeType === 1)
                {
                    jQuery.cleanData(elem.getElementsByTagName("*"));
                }

                /**
                 * Remova todos os nodes restantes.
                 */
                while (elem.firstChild)
                {
                    elem.removeChild(elem.firstChild);
                }
            }

            return this;
        },

        /**
         *
         */
        clone: function(dataAndEvents, deepDataAndEvents)
        {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map(function ()
            {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },

        /**
         *
         */
        html: function(value)
        {
            if (value === undefined)
            {
                return this[0] && this[0].nodeType === 1 ?
                    this[0].innerHTML.replace(rinlinejQuery, "") :
                    null;

                /**
                 * Veja se podemos pegar um atalho e usar apenas innerHTML.
                 */
            } else if (typeof value === "string" && !rnoInnerhtml.test(value) && (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[ (rtagName.exec(value) || ["", ""])[1].toLowerCase()])
            {
                value = value.replace(rxhtmlTag, "<$1></$2>");

                try
                {
                    for (var i = 0, l = this.length; i < l; i++)
                    {
                        /**
                         * Remova nodes de elementos e evite vazamentos
                         * de memória.
                         */
                        if (this[i].nodeType === 1)
                        {
                            jQuery.cleanData(this[i].getElementsByTagName("*"));
                            this[i].innerHTML = value;
                        }
                    }

                    /**
                     * Se o uso de innerHTML gerar uma exceção, use o
                     * método substituto.
                     */
                } catch(e)
                {
                    this.empty().append(value);
                }
            } else if (jQuery.isFunction(value))
            {
                this.each(function(i)
                {
                    var self = jQuery(this);
                        self.html(value.call(this, i, self.html()));
                });
            } else
            {
                this.empty().append(value);
            }

            return this;
        },

        /**
         *
         */
        replaceWith: function(value)
        {
            if (this[0] && this[0].parentNode)
            {
                /**
                 * Certifique-se de que os elementos sejam removidos do
                 * DOM antes de serem inseridos. Isso pode ajudar a
                 * corrigir a substituição de elementos da camada mais
                 * alta por elementos da camada mais baixa.
                 */
                if (jQuery.isFunction(value))
                {
                    return this.each(function(i)
                    {
                        var self = jQuery(this),
                            old = self.html();

                        self.replaceWith(value.call(this, i, old));
                    });
                }

                if (typeof value !== "string")
                {
                    value = jQuery(value).detach();
                }

                return this.each(function()
                {
                    var next = this.nextSibling,
                        parent = this.parentNode;

                    jQuery(this).remove();

                    if (next)
                    {
                        jQuery(next).before(value);
                    } else
                    {
                        jQuery(parent).append(value);
                    }
                });
            } else
            {
                return this.length ? this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) : this;
            }
        },

        /**
         *
         */
        detach: function(selector)
        {
            return this.remove(selector, true);
        },

        /**
         *
         */
        domManip: function(args, table, callback)
        {
            var results,
                first,
                fragment,
                parent,
                value = args[0],
                scripts = [];

            /**
             * Não podemos clonar fragmentos de Node que contenham
             * verificados no WebKit.
             */
            if (!jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test(value))
            {
                return this.each(function()
                {
                    jQuery(this).domManip(args, table, callback, true);
                });
            }

            if (jQuery.isFunction(value))
            {
                return this.each(function(i)
                {
                    var self = jQuery(this);

                    args[0] = value.call(this, i, table ? self.html() : undefined);
                    self.domManip(args, table, callback);
                });
            }

            if (this[0])
            {
                parent = value && value.parentNode;

                /**
                 * Se estivermos em um fragmento, basta usá-lo em vez
                 * de construir um novo.
                 */
                if (jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length)
                {
                    results = {
                        fragment: parent
                    };
                } else
                {
                    results = jQuery.buildFragment(args, this, scripts);
                }

                /**
                 *
                 */
                fragment = results.fragment;

                /**
                 *
                 */
                if (fragment.childNodes.length === 1)
                {
                    first = fragment = fragment.firstChild;
                } else
                {
                    first = fragment.firstChild;
                }

                if (first)
                {
                    table = table && jQuery.nodeName(first, "tr");

                    for (var i = 0, l = this.length, lastIndex = l - 1; i < l; i++)
                    {
                        callback.call(
                            table ?
                                root(this[i], first) :
                                this[i],

                            /**
                             * Certifique-se de não vazar memória descartando
                             * inadvertidamente o fragmento original (que pode
                             * conter dados anexados) em vez de usá-lo; além
                             * disso, use o objeto fragmento original para o
                             * último item em vez do primeiro porque ele pode
                             * acabar sendo esvaziado incorretamente em certas
                             * situações (Bug #8070). Os fragmentos do cache de
                             * fragmentos devem sempre ser clonados e nunca
                             * usados no local.
                             */
                            results.cacheable || (l > 1 && i < lastIndex) ?
                                jQuery.clone(fragment, true, true) :
                                fragment
                        );
                    }
                }

                if (scripts.length)
                {
                    jQuery.each(scripts, evalScript);
                }
            }

            return this;
        }
    });

    /**
     *
     */
    function root(elem, cur)
    {
        return jQuery.nodeName(elem, "table") ?
            (elem.getElementsByTagName("tbody")[0] ||
            elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
            elem;
    }

    /**
     *
     */
    function cloneCopyEvent(src, dest)
    {
        if (dest.nodeType !== 1 || !jQuery.hasData(src))
        {
            return;
        }

        var type,
            i,
            l,
            oldData = jQuery._data(src),
            curData = jQuery._data(dest, oldData),
            events = oldData.events;

        if (events)
        {
            delete curData.handle;
            curData.events = {};

            for (type in events)
            {
                for (i = 0, l = events[type].length; i < l; i++)
                {
                    jQuery.event.add(dest, type + (events[type][i].namespace ? "." : "") + events[type][i].namespace, events[type][i], events[type][i].data);
                }
            }
        }

        /**
         * Faça do objeto de dados públicos clonado uma cópia
         * do original.
         */
        if (curData.data)
        {
            curData.data = jQuery.extend({}, curData.data);
        }
    }

    /**
     *
     */
    function cloneFixAttributes(src, dest)
    {
        var nodeName;

        /**
         * Não precisamos fazer nada pelos não-Elementos.
         */
        if (dest.nodeType !== 1)
        {
            return;
        }

        /**
         * clearAttributes remove os atributos, que não queremos,
         * mas também remove os eventos attachEvent, que *queremos*.
         */
        if (dest.clearAttributes)
        {
            dest.clearAttributes();
        }

        /**
         * mergeAttributes, por outro lado, apenas mescla os
         * atributos originais, não os eventos.
         */
        if (dest.mergeAttributes)
        {
            dest.mergeAttributes(src);
        }

        /**
         *
         */
        nodeName = dest.nodeName.toLowerCase();

        /**
         * O IE6-8 não consegue clonar elementos da camada mais
         * baixa dentro de elementos de objeto que usam o valor
         * do atributo classid proprietário (em vez do atributo
         * type) para identificar o tipo de conteúdo a ser
         * exibido.
         */
        if (nodeName === "object")
        {
            dest.outerHTML = src.outerHTML;
        } else if (nodeName === "input" && (src.type === "checkbox" || src.type === "radio"))
        {
            /**
             * O IE6-8 não consegue persistir o estado verificado
             * de uma caixa de seleção ou botão de opção clonado.
             * O IE6-7 não consegue dar ao elemento clonado uma
             * aparência verificada se o valor defaultChecked
             * também não estiver definido.
             */
            if (src.checked)
            {
                dest.defaultChecked = dest.checked = src.checked;
            }

            /**
             * O IE6-7 fica confuso e acaba definindo o valor de uma
             * caixa de seleção/botão de opção clonado para uma string
             * vazia em vez de "on".
             */
            if (dest.value !== src.value)
            {
                dest.value = src.value;
            }

            /**
             * O IE6-8 não consegue retornar a opção selecionada
             * ao estado selecionado padrão ao clonar opções.
             */
        } else if (nodeName === "option")
        {
            dest.selected = src.defaultSelected;

            /**
             * O IE6-8 falha ao definir defaultValue com o valor
             * correto ao clonar outros tipos de campos de entrada.
             */
        } else if (nodeName === "input" || nodeName === "textarea")
        {
            dest.defaultValue = src.defaultValue;
        }

        /**
         * Os dados do evento serão referenciados em vez de
         * copiados se o expando também for copiado.
         */
        dest.removeAttribute(jQuery.expando);
    }

    /**
     *
     */
    jQuery.buildFragment = function(args, nodes, scripts)
    {
        var fragment, cacheable, cacheresults, doc,
        first = args[0];

        /**
         * Os nodes podem conter um objeto de documento explícito,
         * uma coleção jQuery ou um objeto de contexto. Se nodes[0]
         * contiver um objeto válido para atribuir ao documento.
         */
        if (nodes && nodes[0])
        {
            doc = nodes[0].ownerDocument || nodes[0];
        }

        /**
         * Certifique-se de que um objeto attr não seja substituído
         * incorretamente como um objeto de documento. O Chrome e o
         * Firefox parecem permitir que isso ocorra e lançarão a
         * exceção. Melhorias em #8950.
         */
        if (!doc.createDocumentFragment)
        {
            doc = document;
        }

        /**
         * Armazene em cache apenas strings HTML "pequenas" (1/2 KB)
         * associadas ao documento principal. As opções de clonagem
         * perdem o estado selecionado, portanto, não as armazene em
         * cache. O IE 6 não gosta quando você coloca elementos
         * <object> ou <embed> em um fragmento. Além disso, o WebKit
         * não clona atributos 'checked' no cloneNode, portanto, não
         * armazene em cache. Por último, o IE6,7,8 não reutilizará
         * corretamente os fragmentos armazenados em cache que foram
         * criados a partir de elementos desconhecidos #10501.
         */
        if (args.length === 1 && typeof first === "string" && first.length < 512 && doc === document && first.charAt(0) === "<" && !rnocache.test(first) && (jQuery.support.checkClone || !rchecked.test(first)) && (jQuery.support.html5Clone || !rnoshimcache.test(first)))
        {
            cacheable = true;
            cacheresults = jQuery.fragments[first];

            if (cacheresults && cacheresults !== 1)
            {
                fragment = cacheresults;
            }
        }

        if (!fragment)
        {
            fragment = doc.createDocumentFragment();
            jQuery.clean(args, doc, fragment, scripts);
        }

        if (cacheable)
        {
            jQuery.fragments[first] = cacheresults ? fragment : 1;
        }

        return {
            fragment: fragment,
            cacheable: cacheable
        };
    };

    /**
     *
     */
    jQuery.fragments = {};

    /**
     *
     */
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(name, original)
    {
        /**
         *
         */
        jQuery.fn[name] = function(selector)
        {
            var ret = [],
                insert = jQuery(selector),
                parent = this.length === 1 && this[0].parentNode;

            if (parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1)
            {
                insert[original](this[0]);

                return this;
            } else
            {
                for (var i = 0, l = insert.length; i < l; i++)
                {
                    var elems = (i > 0 ? this.clone(true) : this).get();

                    jQuery(insert[i])[original](elems);
                    ret = ret.concat(elems);
                }

                return this.pushStack(ret, name, insert.selector);
            }
        };
    });

    /**
     *
     */
    function getAll(elem)
    {
        if (typeof elem.getElementsByTagName !== "undefined")
        {
            return elem.getElementsByTagName( "*" );
        } else if (typeof elem.querySelectorAll !== "undefined")
        {
            return elem.querySelectorAll("*");
        } else
        {
            return [];
        }
    }

    /**
     * Usado no clean, corrige a propriedade defaultChecked.
     */
    function fixDefaultChecked(elem)
    {
        if (elem.type === "checkbox" || elem.type === "radio")
        {
            elem.defaultChecked = elem.checked;
        }
    }

    /**
     * Encontra todas as entradas e as passa para fixDefaultChecked.
     */
    function findInputs(elem)
    {
        var nodeName = (elem.nodeName || "").toLowerCase();

        if (nodeName === "input")
        {
            fixDefaultChecked(elem);

            /**
             * Pule os scripts, pegue outras camadas mais baixas.
             */
        } else if (nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined")
        {
            jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
        }
    }

    /**
     * Derivado de: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js.
     */
    function shimCloneNode(elem)
    {
        var div = document.createElement("div");
        safeFragment.appendChild(div);
        div.innerHTML = elem.outerHTML;

        return div.firstChild;
    }

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        clone: function(elem, dataAndEvents, deepDataAndEvents)
        {
            var srcElements,
                destElements,
                i,

                /**
                 * O IE <= 8 não clona corretamente nós de elementos
                 * desconhecidos e desanexados.
                 */
                clone = jQuery.support.html5Clone || !rnoshimcache.test("<" + elem.nodeName) ?
                    elem.cloneNode(true) :
                    shimCloneNode(elem);

            if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem))
            {
                /**
                 * O IE copia eventos vinculados via attachEvent ao usar
                 * cloneNode. Chamar detachEvent no clone também removerá
                 * os eventos do original. Para contornar isso, usamos
                 * alguns métodos proprietários para limpar os eventos.
                 */

                /**
                 *
                 */
                cloneFixAttributes(elem, clone);

                /**
                 * Usar Sizzle aqui é muito lento, então usamos
                 * getElementsByTagName.
                 */
                srcElements = getAll(elem);
                destElements = getAll(clone);

                /**
                 * Iteração estranha porque o IE substituirá a propriedade
                 * length por um elemento se você estiver clonando o body
                 * e um dos elementos na página tiver um nome ou id de
                 * "length".
                 */
                for (i = 0; srcElements[i]; ++i)
                {
                    /**
                     * Certifique-se de que o node de destino não seja
                     * nulo; Correções #9587.
                     */
                    if (destElements[i])
                    {
                        cloneFixAttributes(srcElements[i], destElements[i]);
                    }
                }
            }

            /**
             * Copie os eventos do original para o clone.
             */
            if (dataAndEvents)
            {
                cloneCopyEvent(elem, clone);

                if (deepDataAndEvents)
                {
                    srcElements = getAll(elem);
                    destElements = getAll(clone);

                    for (i = 0; srcElements[i]; ++i)
                    {
                        cloneCopyEvent(srcElements[i], destElements[i]);
                    }
                }
            }

            /**
             *
             */
            srcElements = destElements = null;

            /**
             * Devolva o conjunto clonado.
             */
            return clone;
        },

        /**
         *
         */
        clean: function(elems, context, fragment, scripts)
        {
            var checkScriptType;

            /**
             *
             */
            context = context || document;

            /**
             * !context.createElement falha no IE com um erro, mas
             * retorna typeof 'object'.
             */
            if (typeof context.createElement === "undefined")
            {
                context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
            }

            /**
             *
             */
            var ret = [],
                j;

            for (var i = 0, elem; (elem = elems[i]) != null; i++)
            {
                if (typeof elem === "number")
                {
                    elem += "";
                }

                if (!elem)
                {
                    continue;
                }

                /**
                 * Converta string HTML em nós DOM.
                 */
                if (typeof elem === "string")
                {
                    if (!rhtml.test(elem))
                    {
                        elem = context.createTextNode(elem);
                    } else
                    {
                        /**
                         * Corrija tags de estilo "XHTML" em todos os
                         * navegadores.
                         */
                        elem = elem.replace(rxhtmlTag, "<$1></$2>");

                        /**
                         * Corte os espaços em branco, caso contrário,
                         * indexOf não funcionará conforme o esperado.
                         */
                        var tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase(),
                            wrap = wrapMap[tag] || wrapMap._default,
                            depth = wrap[0],
                            div = context.createElement("div");

                        /**
                         * Anexe o elemento wrapper ao fragmento de documento
                         * seguro do elemento desconhecido.
                         */
                        if (context === document)
                        {
                            /**
                             * Use o fragmento que já criamos para este
                             * documento.
                             */
                            safeFragment.appendChild(div);
                        } else
                        {
                            /**
                             * Use um fragmento criado com o documento do
                             * proprietário.
                             */
                            createSafeFragment(context).appendChild(div);
                        }

                        /**
                         * Vá para html e volte, depois retire os invólucros
                         * extras.
                         */
                        div.innerHTML = wrap[1] + elem + wrap[2];

                        /**
                         * Mova-se para a profundidade certa.
                         */
                        while (depth--)
                        {
                            div = div.lastChild;
                        }

                        /**
                         * Remova o <tbody> inserido automaticamente do IE
                         * dos fragmentos da tabela.
                         */
                        if (!jQuery.support.tbody)
                        {
                            /**
                             * String era uma <table>, *pode* ter <tbody>.
                             */
                            var hasBody = rtbody.test(elem),
                                tbody = tag === "table" && !hasBody ?
                                    div.firstChild && div.firstChild.childNodes :

                                    /**
                                     * String era apenas <thead> ou <tfoot>.
                                     */
                                    wrap[1] === "<table>" && !hasBody ?
                                        div.childNodes :
                                        [];

                            for (j = tbody.length - 1; j >= 0 ; --j)
                            {
                                if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length)
                                {
                                    tbody[j].parentNode.removeChild(tbody[j]);
                                }
                            }
                        }

                        /**
                         * O IE elimina completamente os espaços em branco
                         * iniciais quando innerHTML é usado.
                         */
                        if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem))
                        {
                            div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
                        }

                        elem = div.childNodes;
                    }
                }

                /**
                 * Redefine defaultChecked para quaisquer radios e
                 * checkboxes prestes a serem anexadas ao DOM no IE
                 * 6/7 (#8060).
                 */
                var len;

                /**
                 *
                 */
                if (!jQuery.support.appendChecked)
                {
                    if (elem[0] && typeof (len = elem.length) === "number")
                    {
                        for (j = 0; j < len; j++)
                        {
                            findInputs(elem[j]);
                        }
                    } else
                    {
                        findInputs(elem);
                    }
                }

                if (elem.nodeType)
                {
                    ret.push(elem);
                } else
                {
                    ret = jQuery.merge(ret, elem);
                }
            }

            if (fragment)
            {
                checkScriptType = function(elem)
                {
                    return !elem.type || rscriptType.test(elem.type);
                };

                for (i = 0; ret[i]; i++)
                {
                    if (scripts && jQuery.nodeName(ret[i], "script") && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript"))
                    {
                        scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);
                    } else
                    {
                        if (ret[i].nodeType === 1)
                        {
                            var jsTags = jQuery.grep(ret[i].getElementsByTagName("script"), checkScriptType);

                            ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
                        }

                        fragment.appendChild(ret[i]);
                    }
                }
            }

            return ret;
        },

        /**
         *
         */
        cleanData: function(elems)
        {
            var data,
                id,
                cache = jQuery.cache,
                special = jQuery.event.special,
                deleteExpando = jQuery.support.deleteExpando;

            for (var i = 0, elem; (elem = elems[i]) != null; i++)
            {
                if (elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()])
                {
                    continue;
                }

                /**
                 *
                 */
                id = elem[jQuery.expando];

                if (id)
                {
                    data = cache[id];

                    if (data && data.events)
                    {
                        for (var type in data.events)
                        {
                            if (special[type])
                            {
                                jQuery.event.remove(elem, type);

                                /**
                                 * Este é um atalho para evitar a sobrecarga
                                 * do jQuery.event.remove's.
                                 */
                            } else
                            {
                                jQuery.removeEvent(elem, type, data.handle);
                            }
                        }

                        /**
                         * Anule a referência DOM para evitar vazamento
                         * do IE6/7/8 (#7054).
                         */
                        if (data.handle)
                        {
                            data.handle.elem = null;
                        }
                    }

                    if (deleteExpando)
                    {
                        delete elem[jQuery.expando];
                    } else if (elem.removeAttribute)
                    {
                        elem.removeAttribute(jQuery.expando);
                    }

                    delete cache[id];
                }
            }
        }
    });

    /**
     *
     */
    function evalScript(i, elem)
    {
        if (elem.src)
        {
            jQuery.ajax({
                url: elem.src,
                async: false,
                dataType: "script"
            });
        } else
        {
            jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "").replace(rcleanScript, "/*$0*/"));
        }

        if (elem.parentNode)
        {
            elem.parentNode.removeChild(elem);
        }
    }

    /**
     *
     */
    var ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity=([^)]*)/,

        /**
         * Fixo para IE9, consulte #8346.
         */
        rupper = /([A-Z]|^ms)/g,
        rnumpx = /^-?\d+(?:px)?$/i,
        rnum = /^-?\d/,
        rrelNum = /^([\-+])=([\-+.\de]+)/,

        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssWidth = [ "Left", "Right" ],
        cssHeight = [ "Top", "Bottom" ],
        curCSS,

        getComputedStyle,
        currentStyle;

    /**
     *
     */
    jQuery.fn.css = function(name, value)
    {
        /**
         * Definir 'undefined' é autônomo.
         */
        if (arguments.length === 2 && value === undefined)
        {
            return this;
        }

        return jQuery.access(this, name, value, true, function(elem, name, value)
        {
            return value !== undefined ?
                jQuery.style(elem, name, value) :
                jQuery.css(elem, name);
        });
    };

    /**
     *
     */
    jQuery.extend({
        /**
         * Adicione plugs de propriedade de estilo para substituir
         * o comportamento padrão de obter e definir uma propriedade
         * de estilo.
         */
        cssHooks: {
            /**
             *
             */
            opacity: {
                /**
                 *
                 */
                get: function(elem, computed)
                {
                    if (computed)
                    {
                        /**
                         * Devemos sempre obter um número de volta da opacidade.
                         */
                        var ret = curCSS(elem, "opacity", "opacity");

                        return ret === "" ? "1" : ret;
                    } else
                    {
                        return elem.style.opacity;
                    }
                }
            }
        },

        /**
         * Exclua as seguintes propriedades CSS para adicionar px.
         */
        cssNumber: {
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },

        /**
         * Adicione propriedades cujos nomes você deseja melhorar
         * antes de definir ou obter o valor.
         */
        cssProps: {
            /**
             * Normalize a propriedade float css.
             */
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },

        /**
         * Obtenha e defina a propriedade style em um node DOM.
         */
        style: function(elem, name, value, extra)
        {
            /**
             * Não defina estilos em nodes de texto e comentários.
             */
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style)
            {
                return;
            }

            /**
             * Certifique-se de que estamos trabalhando com o
             * nome correto.
             */
            var ret,
                type,
                origName = jQuery.camelCase(name),
                style = elem.style,
                hooks = jQuery.cssHooks[origName];

            /**
             *
             */
            name = jQuery.cssProps[origName] || origName;

            /**
             * Verifique se estamos definindo um valor.
             */
            if (value !== undefined)
            {
                type = typeof value;

                /**
                 * Converter strings de números relativos (+= ou -=)
                 * em números relativos. #7345.
                 */
                if (type === "string" && (ret = rrelNum.exec(value)))
                {
                    value = (+(ret[1] + 1) * +ret[2]) + parseFloat(jQuery.css(elem, name));

                    /**
                     * Bug fixo #9237.
                     */
                    type = "number";
                }

                /**
                 * Certifique-se de que os valores NaN e null não
                 * estejam definidos. Veja: #7116.
                 */
                if (value == null || type === "number" && isNaN(value))
                {
                    return;
                }

                /**
                 * Se um número foi passado, adicione 'px' ao (exceto
                 * para certas propriedades CSS).
                 */
                if (type === "number" && !jQuery.cssNumber[origName])
                {
                    value += "px";
                }

                /**
                 * Se um plug foi fornecido, use esse valor, caso contrário,
                 * apenas defina o valor especificado.
                 */
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value)) !== undefined)
                {
                    /**
                     * Embrulhado para evitar que o IE gere erros quando
                     * valores 'inválidos' são fornecidos. Corrige o bug
                     * #5509.
                     */
                    try
                    {
                        style[name] = value;
                    } catch(e)
                    {
                    }
                }
            } else
            {
                /**
                 * Se um plug foi fornecido, obtenha o valor não
                 * computado a partir daí.
                 */
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined)
                {
                    return ret;
                }

                /**
                 * Caso contrário, basta obter o valor do objeto de estilo.
                 */
                return style[name];
            }
        },

        /**
         *
         */
        css: function(elem, name, extra)
        {
            var ret,
                hooks;

            /**
             * Certifique-se de que estamos trabalhando com o
             * nome correto.
             */
            name = jQuery.camelCase(name);
            hooks = jQuery.cssHooks[name];
            name = jQuery.cssProps[name] || name;

            /**
             * cssFloat precisa de um tratamento especial.
             */
            if (name === "cssFloat")
            {
                name = "float";
            }

            /**
             * Se um plug foi fornecido, obtenha o valor calculado
             * a partir daí.
             */
            if (hooks && "get" in hooks && (ret = hooks.get(elem, true, extra)) !== undefined)
            {
                return ret;

                /**
                 * Caso contrário, se existir uma maneira de obter
                 * o valor calculado, use-a.
                 */
            } else if (curCSS)
            {
                return curCSS(elem, name);
            }
        },

        /**
         * Um método para trocar rapidamente propriedades CSS
         * de entrada/saída para obter cálculos corretos.
         */
        swap: function(elem, options, callback)
        {
            var old = {};

            /**
             * Lembre-se dos valores antigos e insira os novos.
             */
            for (var name in options)
            {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }

            callback.call(elem);

            /**
             * Reverta os valores antigos.
             */
            for (name in options)
            {
                elem.style[name] = old[name];
            }
        }
    });

    /**
     * @deprecated, Use jQuery.css() em vez.
     */
    jQuery.curCSS = jQuery.css;

    /**
     *
     */
    jQuery.each(["height", "width"], function(i, name)
    {
        /**
         *
         */
        jQuery.cssHooks[name] = {
            /**
             *
             */
            get: function(elem, computed, extra)
            {
                var val;

                if (computed)
                {
                    if (elem.offsetWidth !== 0)
                    {
                        return getWH(elem, name, extra);
                    } else
                    {
                        jQuery.swap(elem, cssShow, function()
                        {
                            val = getWH(elem, name, extra);
                        });
                    }

                    return val;
                }
            },

            /**
             *
             */
            set: function(elem, value)
            {
                if (rnumpx.test(value))
                {
                    /**
                     * Ignore os valores negativos de largura e
                     * altura #1599.
                     */
                    value = parseFloat(value);

                    if (value >= 0)
                    {
                        return value + "px";
                    }
                } else
                {
                    return value;
                }
            }
        };
    });

    /**
     *
     */
    if (!jQuery.support.opacity)
    {
        /**
         *
         */
        jQuery.cssHooks.opacity = {
            /**
             *
             */
            get: function(elem, computed)
            {
                /**
                 * O IE usa filtros para opacidade.
                 */
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? (parseFloat(RegExp.$1) / 100) + "" : computed ? "1" : "";
            },

            /**
             *
             */
            set: function(elem, value)
            {
                var style = elem.style,
                    currentStyle = elem.currentStyle,
                    opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "",
                    filter = currentStyle && currentStyle.filter || style.filter || "";

                /**
                 * O IE tem problemas com opacidade se não tiver
                 * layout. Force-o definindo o nível de zoom.
                 */
                style.zoom = 1;

                /**
                 * Se definir a opacidade como 1 e não existirem outros
                 * filtros - tente remover o atributo de filtro #6652.
                 */
                if (value >= 1 && jQuery.trim(filter.replace(ralpha, "")) === "")
                {
                    /**
                     * Definindo style.filter como null, "" & " " ainda
                     * deixa "filter:" no cssText se "filter:" estiver
                     * presente, clearType está desativado, queremos
                     * evitar que style.removeAttribute seja apenas IE,
                     * mas aparentemente é este caminho de código.
                     */
                    style.removeAttribute("filter");

                    /**
                     * Se não houver nenhum estilo de filtro aplicado em
                     * uma regra CSS, terminamos.
                     */
                    if (currentStyle && !currentStyle.filter)
                    {
                        return;
                    }
                }

                /**
                 * Caso contrário, defina novos valores de filtro.
                 */
                style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
            }
        };
    }

    /**
     *
     */
    jQuery(function()
    {
        /**
         * Este plug não pode ser adicionado até que o DOM
         * esteja pronto porque o teste de suporte para ele
         * não é executado até que o DOM esteja pronto.
         */
        if (!jQuery.support.reliableMarginRight)
        {
            jQuery.cssHooks.marginRight = {
                /**
                 *
                 */
                get: function(elem, computed)
                {
                    /**
                     * Bug 13343 do WebKit - getComputedStyle retorna
                     * valor errado para margem direita. Contorne
                     * definindo temporariamente a exibição do elemento
                     * como bloco inline.
                     */
                    var ret;

                    /**
                     *
                     */
                    jQuery.swap(elem, { "display": "inline-block" }, function()
                    {
                        if (computed)
                        {
                            ret = curCSS(elem, "margin-right", "marginRight");
                        } else
                        {
                            ret = elem.style.marginRight;
                        }
                    });

                    return ret;
                }
            };
        }
    });

    /**
     *
     */
    if (document.defaultView && document.defaultView.getComputedStyle)
    {
        getComputedStyle = function(elem, name)
        {
            var ret,
                defaultView,
                computedStyle;

            name = name.replace(rupper, "-$1").toLowerCase();

            if ((defaultView = elem.ownerDocument.defaultView) && (computedStyle = defaultView.getComputedStyle(elem, null)))
            {
                ret = computedStyle.getPropertyValue(name);

                if (ret === "" && !jQuery.contains(elem.ownerDocument.documentElement, elem))
                {
                    ret = jQuery.style(elem, name);
                }
            }

            return ret;
        };
    }

    /**
     *
     */
    if (document.documentElement.currentStyle)
    {
        currentStyle = function(elem, name)
        {
            var left,
                rsLeft,
                uncomputed,
                ret = elem.currentStyle && elem.currentStyle[name],
                style = elem.style;

            /**
             * Evite definir ret como uma string vazia aqui para
             * não usarmos o padrão como automático.
             */
            if (ret === null && style && (uncomputed = style[name]))
            {
                ret = uncomputed;
            }

            /**
             * Do incrível hack:
             *
             * http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291.
             */

            /**
             * Se não estivermos lidando com um número de pixels
             * normal, mas com um número que tem um final estranho,
             * precisamos convertê-lo em pixels.
             */
            if (!rnumpx.test(ret) && rnum.test(ret))
            {
                /**
                 * Lembre-se dos valores originais.
                 */
                left = style.left;
                rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

                /**
                 * Insira os novos valores para obter um valor calculado.
                 */
                if (rsLeft)
                {
                    elem.runtimeStyle.left = elem.currentStyle.left;
                }

                style.left = name === "fontSize" ? "1em" : (ret || 0);
                ret = style.pixelLeft + "px";

                /**
                 * Reverta os valores alterados.
                 */
                style.left = left;

                if (rsLeft)
                {
                    elem.runtimeStyle.left = rsLeft;
                }
            }

            return ret === "" ? "auto" : ret;
        };
    }

    /**
     *
     */
    curCSS = getComputedStyle || currentStyle;

    /**
     *
     */
    function getWH(elem, name, extra)
    {
        /**
         * Comece com a propriedade offset.
         */
        var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
            which = name === "width" ? cssWidth : cssHeight,
            i = 0,
            len = which.length;

        if (val > 0)
        {
            if (extra !== "border")
            {
                for (; i < len; i++)
                {
                    if (!extra)
                    {
                        val -= parseFloat(jQuery.css(elem, "padding" + which[i])) || 0;
                    }

                    if (extra === "margin")
                    {
                        val += parseFloat(jQuery.css(elem, extra + which[i])) || 0;
                    } else
                    {
                        val -= parseFloat(jQuery.css(elem, "border" + which[i] + "Width")) || 0;
                    }
                }
            }

            return val + "px";
        }

        /**
         * Volte para CSS computado e não computado,
         * se necessário.
         */
        val = curCSS(elem, name, name);

        /**
         *
         */
        if (val < 0 || val == null)
        {
            val = elem.style[name] || 0;
        }

        /**
         * Normalize "", automático e prepare-se para mais.
         */
        val = parseFloat(val) || 0;

        /**
         * Adicionar padding, border, margin.
         */
        if (extra)
        {
            for (; i < len; i++)
            {
                val += parseFloat(jQuery.css(elem, "padding" + which[i])) || 0;

                if (extra !== "padding")
                {
                    val += parseFloat(jQuery.css(elem, "border" + which[i] + "Width")) || 0;
                }

                if (extra === "margin")
                {
                    val += parseFloat(jQuery.css(elem, extra + which[i])) || 0;
                }
            }
        }

        return val + "px";
    }

    /**
     *
     */
    if (jQuery.expr && jQuery.expr.filters)
    {
        jQuery.expr.filters.hidden = function(elem)
        {
            var width = elem.offsetWidth,
                height = elem.offsetHeight;

            return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css(elem, "display")) === "none");
        };

        /**
         *
         */
        jQuery.expr.filters.visible = function(elem)
        {
            return !jQuery.expr.filters.hidden(elem);
        };
    }

    /**
     *
     */
    var r20 = /%20/g,

        /**
         *
         */
        rbracket = /\[\]$/,

        /**
         *
         */
        rCRLF = /\r?\n/g,

        /**
         *
         */
        rhash = /#.*$/,

        /**
         * IE deixa um caractere \r no EOL.
         */
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

        /**
         *
         */
        rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,

        /**
         * #7653, #8125, #8152: detecção de protocolo local.
         */
        rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,

        /**
         *
         */
        rnoContent = /^(?:GET|HEAD)$/,

        /**
         *
         */
        rprotocol = /^\/\//,

        /**
         *
         */
        rquery = /\?/,

        /**
         *
         */
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,

        /**
         *
         */
        rselectTextarea = /^(?:select|textarea)/i,

        /**
         *
         */
        rspacesAjax = /\s+/,

        /**
         *
         */
        rts = /([?&])_=[^&]*/,

        /**
         *
         */
        rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

        /**
         * Mantenha uma cópia do método de carregamento antigo.
         */
        _load = jQuery.fn.load,

        /**
         * Pré-filtros:
         *     1) Eles são úteis para introduzir tipos de dados
         *        personalizados (consulte ajax/jsonp.js para
         *        obter um exemplo).
         *     2) Eles são chamados:
         *         - BEFORE pedindo um transporte.
         *         - AFTER serialização de parâmetros (s.data é uma
         *                 string se s.processData for true).
         *     3) Chave é o dataType.
         *     4) O símbolo genérico "*" pode ser usado.
         *     5) A execução começará com transporte dataType e ENTÃO
         *        continuará até "*" se necessário.
         */
        prefilters = {},

        /**
         * Ligações de transporte:
         *     1) Chave é o dataType.
         *     2) O símbolo genérico "*" pode ser usado.
         *     3) A seleção começará com transporte dataType
         *        e ENTÃO irá para "*" se necessário.
         */
        transports = {},

        /**
         * Localização do documento.
         */
        ajaxLocation,

        /**
         * Segmentos de localização do documento.
         */
        ajaxLocParts,

        /**
         * Evite a sequência de caracteres do prólogo de
         * comentários (#10098); deve apaziguar lint e
         * evitar a compressão.
         */
        allTypes = ["*/"] + ["*"];

    /**
     * #8138, O IE pode lançar uma exceção ao acessar um
     * campo de window.location se document.domain tiver
     * sido definido.
     */
    try
    {
        ajaxLocation = location.href;
    } catch(e)
    {
        /**
         * Use o atributo href de um elemento A, pois o IE irá
         * modificá-lo de acordo com document.location.
         */
        ajaxLocation = document.createElement("a");
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }

    /**
     * Segmente a localização em partes.
     */
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

    /**
     * "Construtor" base para jQuery.ajaxPrefilter e jQuery.ajaxTransport.
     */
    function addToPrefiltersOrTransports(structure)
    {
        /**
         * dataTypeExpression é opcional e o padrão é "*".
         */
        return function(dataTypeExpression, func)
        {
            if (typeof dataTypeExpression !== "string")
            {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            if (jQuery.isFunction(func))
            {
                var dataTypes = dataTypeExpression.toLowerCase().split(rspacesAjax),
                    i = 0,
                    length = dataTypes.length,
                    dataType,
                    list,
                    placeBefore;

                /**
                 * Para cada dataType no dataTypeExpression.
                 */
                for (; i < length; i++)
                {
                    dataType = dataTypes[i];

                    /**
                     * Controlamos se somos solicitados a adicionar antes
                     * de qualquer elemento existente.
                     */
                    placeBefore = /^\+/.test(dataType);

                    if (placeBefore)
                    {
                        dataType = dataType.substr(1) || "*";
                    }

                    list = structure[dataType] = structure[dataType] || [];

                    /**
                     * Então adicionamos à estrutura de acordo.
                     */
                    list[placeBefore ? "unshift" : "push"](func);
                }
            }
        };
    }

    /**
     * Função de inspeção básica para pré-filtros e
     * transportes.
     * 
     * dataType internal.
     * inspected internal.
     */
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, dataType, inspected)
    {
        dataType = dataType || options.dataTypes[0];
        inspected = inspected || {};
        inspected[dataType] = true;

        var list = structure[dataType],
            i = 0,
            length = list ? list.length : 0,
            executeOnly = (structure === prefilters),
            selection;

        for (; i < length && (executeOnly || !selection); i++)
        {
            selection = list[i](options, originalOptions, jqXHR);

            /**
             * Se formos redirecionados para outro tipo de dados,
             * tentaremos se estiver executando apenas e ainda não
             * tiver feito.
             */
            if (typeof selection === "string")
            {
                if (!executeOnly || inspected[selection])
                {
                    selection = undefined;
                } else
                {
                    options.dataTypes.unshift(selection);
                    selection = inspectPrefiltersOrTransports(
                        structure,
                        options,
                        originalOptions,
                        jqXHR,
                        selection,
                        inspected
                    );
                }
            }
        }

        /**
         * Se estivermos apenas executando ou nada tiver sido
         * selecionado, tentaremos o dataType catchall, se
         * ainda não tiver feito isso.
         */
        if ((executeOnly || !selection) && !inspected["*"])
        {
            selection = inspectPrefiltersOrTransports(
                structure,
                options,
                originalOptions,
                jqXHR,
                "*",
                inspected
            );
        }

        /**
         * desnecessário ao executar apenas (pré-filtros), mas será
         * ignorado pelo chamador nesse caso.
         */
        return selection;
    }

    /**
     * Uma extensão especial para opções de ajax que aceita
     * opções "simples" (não deve ser estendida profundamente).
     * Melhorias em #9887.
     */
    function ajaxExtend(target, src)
    {
        var key,
            deep,
            flatOptions = jQuery.ajaxSettings.flatOptions || {};

        for (key in src)
        {
            if (src[key] !== undefined)
            {
                (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
            }
        }

        if (deep)
        {
            jQuery.extend(true, target, deep);
        }
    }

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        load: function(url, params, callback)
        {
            if (typeof url !== "string" && _load)
            {
                return _load.apply(this, arguments);

                /**
                 * Não faça uma solicitação se nenhum elemento estiver
                 * sendo solicitado.
                 */
            } else if (!this.length)
            {
                return this;
            }

            var off = url.indexOf(" ");

            if (off >= 0)
            {
                var selector = url.slice(off, url.length);

                url = url.slice(0, off);
            }

            /**
             * O padrão é uma solicitação GET.
             */
            var type = "GET";

            /**
             * Se o segundo parâmetro foi fornecido.
             */
            if (params)
            {
                /**
                 * Se for uma função.
                 */
                if (jQuery.isFunction(params))
                {
                    /**
                     * Presumimos que seja o callback.
                     */
                    callback = params;
                    params = undefined;

                    /**
                     * Caso contrário, crie uma sequência de parâmetros.
                     */
                } else if (typeof params === "object")
                {
                    params = jQuery.param(params, jQuery.ajaxSettings.traditional);
                    type = "POST";
                }
            }

            /**
             *
             */
            var self = this;

            /**
             * Solicite o manual remoto.
             */
            jQuery.ajax({
                /**
                 *
                 */
                url: url,

                /**
                 *
                 */
                type: type,

                /**
                 *
                 */
                dataType: "html",

                /**
                 *
                 */
                data: params,

                /**
                 * Callback completo (responseText é usado internamente).
                 */
                complete: function(jqXHR, status, responseText)
                {
                    /**
                     * Armazene a resposta conforme especificado pelo
                     * objeto jqXHR.
                     */
                    responseText = jqXHR.responseText;

                    /**
                     * Se for bem-sucedido, injete o HTML em todos os
                     * elementos correspondentes.
                     */
                    if (jqXHR.isResolved())
                    {
                        /**
                         * #4825: Obtenha a resposta real caso um dataFilter
                         * esteja presente em ajaxSettings.
                         */
                        jqXHR.done(function(r)
                        {
                            responseText = r;
                        });

                        /**
                         * Veja se um seletor foi especificado.
                         */
                        self.html(selector ?
                            /**
                             * Crie um div fictício para armazenar os
                             * resultados.
                             */
                            jQuery("<div>")
                                /**
                                 * Injete o conteúdo do documento, removendo os
                                 * scripts para evitar erros de 'Permissão negada'
                                 * no IE.
                                 */
                                .append(responseText.replace(rscript, ""))

                                /**
                                 * Localize os elementos especificados.
                                 */
                                .find(selector) :

                            /**
                             * Caso contrário, basta injetar o resultado
                             * completo.
                             */
                            responseText
                        );
                    }

                    if (callback)
                    {
                        self.each(callback, [responseText, status, jqXHR]);
                    }
                }
            });

            return this;
        },

        /**
         *
         */
        serialize: function()
        {
            return jQuery.param(this.serializeArray());
        },

        /**
         *
         */
        serializeArray: function()
        {
            return this.map(function()
            {
                return this.elements ? jQuery.makeArray(this.elements) : this;
            })
            .filter(function()
            {
                return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
            })
            .map(function(i, elem)
            {
                var val = jQuery(this).val();

                return val == null ?
                    null :
                    jQuery.isArray(val) ?
                        jQuery.map(val, function(val, i)
                        {
                            return {
                                name: elem.name,
                                value: val.replace(rCRLF, "\r\n")
                            };
                        }) : {
                            name: elem.name,
                            value: val.replace(rCRLF, "\r\n")
                        };
            }).get();
        }
    });

    /**
     * Anexe um monte de funções para lidar com eventos
     * AJAX comuns.
     */
    jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(i, o)
    {
        jQuery.fn[o] = function(f)
        {
            return this.on(o, f);
        };
    });

    /**
     *
     */
    jQuery.each(["get", "post"], function(i, method)
    {
        jQuery[method] = function(url, data, callback, type)
        {
            /**
             * Argumentos de mudança se o argumento de dados foi omitido.
             */
            if (jQuery.isFunction(data))
            {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return jQuery.ajax({
                type: method,
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        };
    });

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        getScript: function(url, callback)
        {
            return jQuery.get(url, undefined, callback, "script");
        },

        /**
         *
         */
        getJSON: function(url, data, callback)
        {
            return jQuery.get(url, data, callback, "json");
        },

        /**
         * Cria um objeto de configurações completo no destino
         * com campos ajaxSettings e configurações. Se o destino
         * for omitido, grava em ajaxSettings.
         */
        ajaxSetup: function(target, settings)
        {
            if (settings)
            {
                /**
                 * Construindo um objeto de configurações.
                 */
                ajaxExtend(target, jQuery.ajaxSettings);
            } else
            {
                /**
                 * Estendendo ajaxSettings.
                 */
                settings = target;
                target = jQuery.ajaxSettings;
            }

            /**
             *
             */
            ajaxExtend(target, settings);

            return target;
        },

        /**
         *
         */
        ajaxSettings: {
            /**
             *
             */
            url: ajaxLocation,

            /**
             *
             */
            isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),

            /**
             *
             */
            global: true,

            /**
             *
             */
            type: "GET",

            /**
             *
             */
            contentType: "application/x-www-form-urlencoded",

            /**
             *
             */
            processData: true,

            /**
             *
             */
            async: true,

            /**
             * timeout: 0,
             * data: null,
             * dataType: null,
             * username: null,
             * password: null,
             * cache: null,
             * traditional: false,
             * headers: {},
             */

            /**
             *
             */
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": allTypes
            },

            /**
             *
             */
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },

            /**
             *
             */
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },

            /**
             * Lista de conversores de dados:
             *     1) o formato da chave é "source_type destination_type"
             *        (um único espaço no meio).
             *     2) o símbolo genérico "*" pode ser usado para source_type.
             */
            converters: {
                /**
                 * Converta qualquer coisa em texto.
                 */
                "* text": window.String,

                /**
                 * Texto para html (true = sem transformação).
                 */
                "text html": true,

                /**
                 * Avalie o texto como uma expressão json.
                 */
                "text json": jQuery.parseJSON,

                /**
                 * Analise o texto como xml.
                 */
                "text xml": jQuery.parseXML
            },

            /**
             * Para opções que não devem ser estendidas profundamente:
             * você pode adicionar suas próprias opções personalizadas
             * aqui se e quando criar uma que não deva ser estendida
             * profundamente (consulte ajaxExtend).
             */
            flatOptions: {
                context: true,
                url: true
            }
        },

        /**
         *
         */
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),

        /**
         *
         */
        ajaxTransport: addToPrefiltersOrTransports(transports),

        /**
         * Método principal.
         */
        ajax: function(url, options)
        {
            /**
             * Se url for um objeto, simule a assinatura pre-1.5.
             */
            if (typeof url === "object")
            {
                options = url;
                url = undefined;
            }

            /**
             * Forçar as opções a serem um objeto.
             */
            options = options || {};

            var
                /**
                 * Crie o objeto de opções final.
                 */
                s = jQuery.ajaxSetup({}, options),

                /**
                 * Contexto de callbacks.
                 */
                callbackContext = s.context || s,

                /**
                 * Contexto para eventos globais. É o callbackContext
                 * se for fornecido nas opções e se for um node DOM ou
                 * uma coleção jQuery.
                 */
                globalEventContext = callbackContext !== s && (callbackContext.nodeType || callbackContext instanceof jQuery) ? jQuery(callbackContext) : jQuery.event,

                /**
                 * Deferreds.
                 */
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks("once memory"),

                /**
                 * Callbacks de status-dependente.
                 */
                statusCode = s.statusCode || {},

                /**
                 * Chave ifModified.
                 */
                ifModifiedKey,

                /**
                 * Títulos (são enviados todos de uma vez).
                 */
                requestHeaders = {},
                requestHeadersNames = {},

                /**
                 * Títulos de resposta.
                 */
                responseHeadersString,
                responseHeaders,

                /**
                 * Transporte.
                 */
                transport,

                /**
                 * timeout handle.
                 */
                timeoutTimer,

                /**
                 * Vars de detecção de vários domínios.
                 */
                parts,

                /**
                 * O estado jqXHR.
                 */
                state = 0,

                /**
                 * Para saber se eventos globais devem ser despachados.
                 */
                fireGlobals,

                /**
                 * Variável de loop.
                 */
                i,

                /**
                 * xhr falso.
                 */
                jqXHR = {
                    /**
                     *
                     */
                    readyState: 0,

                    /**
                     * Armazena em cache o título.
                     */
                    setRequestHeader: function(name, value)
                    {
                        if (!state)
                        {
                            var lname = name.toLowerCase();

                            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                            requestHeaders[name] = value;
                        }

                        return this;
                    },

                    /**
                     * String raw.
                     */
                    getAllResponseHeaders: function()
                    {
                        return state === 2 ? responseHeadersString : null;
                    },

                    /**
                     * Constrói tabela hash de títulos, se necessário.
                     */
                    getResponseHeader: function(key)
                    {
                        var match;

                        if (state === 2)
                        {
                            if (!responseHeaders)
                            {
                                responseHeaders = {};

                                while((match = rheaders.exec(responseHeadersString)))
                                {
                                    responseHeaders[match[1].toLowerCase()] = match[2];
                                }
                            }

                            match = responseHeaders[key.toLowerCase()];
                        }

                        return match === undefined ? null : match;
                    },

                    /**
                     * Substitui o título do tipo de conteúdo de resposta.
                     */
                    overrideMimeType: function(type)
                    {
                        if (!state)
                        {
                            s.mimeType = type;
                        }

                        return this;
                    },

                    /**
                     * Cancele a solicitação.
                     */
                    abort: function(statusText)
                    {
                        statusText = statusText || "abort";

                        if (transport)
                        {
                            transport.abort(statusText);
                        }

                        done(0, statusText);

                        return this;
                    }
                };

            /**
             * Callback para quando tudo estiver pronto. É definido aqui
             * porque o jslint reclama se for declarado no final da função
             * (o que seria mais lógico e legível).
             */
            function done(status, nativeStatusText, responses, headers)
            {
                /**
                 * Chame uma vez.
                 */
                if (state === 2)
                {
                    return;
                }

                /**
                 * O estado está "done" (pronto) agora.
                 */
                state = 2;

                /**
                 * Limpe o tempo limite, se existir.
                 */
                if (timeoutTimer)
                {
                    clearTimeout(timeoutTimer);
                }

                /**
                 * Transporte de desreferência para coleta de lixo
                 * antecipada (não importa por quanto tempo o objeto
                 * jqXHR será usado).
                 */
                transport = undefined;

                /**
                 * Títulos de resposta em cache.
                 */
                responseHeadersString = headers || "";

                /**
                 * Definir readyState.
                 */
                jqXHR.readyState = status > 0 ? 4 : 0;

                /**
                 *
                 */
                var isSuccess,
                    success,
                    error,
                    statusText = nativeStatusText,
                    response = responses ? ajaxHandleResponses(s, jqXHR, responses) : undefined,
                    lastModified,
                    etag;

                /**
                 * Se for bem-sucedido, lide com o encadeamento de tipos.
                 */
                if (status >= 200 && status < 300 || status === 304)
                {
                    /**
                     * Defina o título If-Modified-Since e/ou If-None-Match,
                     * se estiver no modo ifModified.
                     */
                    if (s.ifModified)
                    {
                        if ((lastModified = jqXHR.getResponseHeader("Last-Modified")))
                        {
                            jQuery.lastModified[ifModifiedKey] = lastModified;
                        }

                        if ((etag = jqXHR.getResponseHeader("Etag")))
                        {
                            jQuery.etag[ifModifiedKey] = etag;
                        }
                    }

                    /**
                     * Se não for modificado.
                     */
                    if (status === 304)
                    {
                        statusText = "notmodified";
                        isSuccess = true;

                        /**
                         * Se tivermos dados.
                         */
                    } else
                    {
                        try
                        {
                            success = ajaxConvert(s, response);
                            statusText = "success";
                            isSuccess = true;
                        } catch(e)
                        {
                            /**
                             * Nós temos um parsererror.
                             */
                            statusText = "parsererror";
                            error = e;
                        }
                    }
                } else
                {
                    /**
                     * Extraímos o erro do statusText e normalizamos o
                     * statusText e o status para não terminar.
                     */
                    error = statusText;

                    if (!statusText || status)
                    {
                        statusText = "error";

                        if (status < 0)
                        {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = "" + (nativeStatusText || statusText);

                /**
                 * Sucesso/Erro.
                 */
                if (isSuccess)
                {
                    deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                } else
                {
                    deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                }

                /**
                 * Callbacks de status-dependente.
                 */
                jqXHR.statusCode(statusCode);
                statusCode = undefined;

                if (fireGlobals)
                {
                    globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"), [jqXHR, s, isSuccess ? success : error]);
                }

                /**
                 * Completo.
                 */
                completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

                /**
                 *
                 */
                if (fireGlobals)
                {
                    globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

                    /**
                     * Lidar com o contador AJAX global.
                     */
                    if (!(--jQuery.active))
                    {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }

            /**
             * Anexe adiados.
             */
            deferred.promise(jqXHR);
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
            jqXHR.complete = completeDeferred.add;

            /**
             * Callbacks dependentes de status.
             */
            jqXHR.statusCode = function(map)
            {
                if (map)
                {
                    var tmp;

                    if (state < 2)
                    {
                        for (tmp in map)
                        {
                            statusCode[tmp] = [statusCode[tmp], map[tmp]];
                        }
                    } else
                    {
                        tmp = map[jqXHR.status];
                        jqXHR.then(tmp, tmp);
                    }
                }

                return this;
            };

            /**
             * Remova o caractere hash (#7531: e promoção de string).
             * Adicione protocolo se não for fornecido (#5866: falha
             * do IE7 com URLs sem protocolo). Também usamos o parâmetro
             * url, se disponível.
             */
            s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");

            /**
             * Extraia a lista de dataTypes.
             */
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(rspacesAjax);

            /**
             * Determine se uma solicitação entre domínios está correta.
             */
            if (s.crossDomain == null)
            {
                parts = rurl.exec(s.url.toLowerCase());
                s.crossDomain = !!(
                    parts &&
                    (
                        parts[1] != ajaxLocParts[1] ||
                        parts[2] != ajaxLocParts[2] ||
                        (
                            parts[3] || (parts[1] === "http:" ? 80 : 443)
                        ) != (
                            ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443)
                        )
                    )
                );
            }

            /**
             * Converta dados se ainda não for uma string.
             */
            if (s.data && s.processData && typeof s.data !== "string")
            {
                s.data = jQuery.param(s.data, s.traditional);
            }

            /**
             * Aplique pré-filtros.
             */
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

            /**
             * Se a solicitação foi abortada dentro de um pré-filtro,
             * pare por aí.
             */
            if (state === 2)
            {
                return false;
            }

            /**
             * Podemos enviar eventos globais a partir de agora,
             * se solicitado.
             */
            fireGlobals = s.global;

            /**
             * Coloque o tipo em maiúscula.
             */
            s.type = s.type.toUpperCase();

            /**
             * Determine se a solicitação tem conteúdo.
             */
            s.hasContent = !rnoContent.test(s.type);

            /**
             * Fique atento a um novo conjunto de solicitações.
             */
            if (fireGlobals && jQuery.active++ === 0)
            {
                jQuery.event.trigger("ajaxStart");
            }

            /**
             * Mais opções de tratamento para solicitações sem conteúdo.
             */
            if (!s.hasContent)
            {
                /**
                 * Se os dados estiverem disponíveis, anexe os
                 * dados ao URL.
                 */
                if (s.data)
                {
                    s.url += (rquery.test(s.url) ? "&" : "?") + s.data;

                    /**
                     * #9682: remova os dados para que não sejam usados
                     * em uma eventual nova tentativa.
                     */
                    delete s.data;
                }

                /**
                 * Obtenha ifModifiedKey antes de adicionar o parâmetro
                 * anti-cache.
                 */
                ifModifiedKey = s.url;

                /**
                 * Adicione anti-cache no URL, se necessário.
                 */
                if (s.cache === false)
                {
                    var ts = jQuery.now(),
                        /**
                         * Tente substituir _= se estiver lá.
                         */
                        ret = s.url.replace(rts, "$1_=" + ts);

                    /**
                     * Se nada foi substituído, adicione timestamp
                     * ao final.
                     */
                    s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
                }
            }

            /**
             * Defina o título correto, se os dados estiverem
             * sendo enviados.
             */
            if (s.data && s.hasContent && s.contentType !== false || options.contentType)
            {
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            }

            /**
             * Definir o título If-Modified-Since e/ou If-None-Match,
             * se no modo ifModified.
             */
            if (s.ifModified)
            {
                ifModifiedKey = ifModifiedKey || s.url;

                if (jQuery.lastModified[ifModifiedKey])
                {
                    jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
                }

                if (jQuery.etag[ifModifiedKey])
                {
                    jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey]);
                }
            }

            /**
             * Defina o título Accepts para o servidor, dependendo
             * do dataType.
             */
            jqXHR.setRequestHeader(
                "Accept",
                s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
                    s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
                    s.accepts["*"]
            );

            /**
             * Verifique a opção de títulos.
             */
            for (i in s.headers)
            {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }

            /**
             * Permitir títulos/tipos MIME personalizados e
             * termino antecipado.
             */
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2))
            {
                    /**
                     * Termine se ainda não tiver feito isso.
                     */
                    jqXHR.abort();

                    return false;
            }

            /**
             * Instale callbacks em diferidos.
             */
            for (i in { success: 1, error: 1, complete: 1 })
            {
                jqXHR[i](s[i]);
            }

            /**
             * Obtenha transporte.
             */
            transport = inspectPrefiltersOrTransports(
                transports,
                s,
                options,
                jqXHR
            );

            /**
             * Se não houver transporte, abortaremos automaticamente.
             */
            if (!transport)
            {
                done(-1, "No Transport");
            } else
            {
                jqXHR.readyState = 1;

                /**
                 * Enviar evento global.
                 */
                if (fireGlobals)
                {
                    globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                }

                /**
                 * Tempo esgotado.
                 */
                if (s.async && s.timeout > 0)
                {
                    timeoutTimer = setTimeout(function()
                    {
                        jqXHR.abort("timeout");
                    }, s.timeout);
                }

                try
                {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e)
                {
                    /**
                     * Propague a exceção como erro se não for feito.
                     */
                    if (state < 2)
                    {
                        done(-1, e);

                        /**
                         * Simplesmente repita o contrário.
                         */
                    } else
                    {
                        throw e;
                    }
                }
            }

            return jqXHR;
        },

        /**
         * Serialize um vetor de elementos de formulário ou um
         * conjunto de chaves/valores em uma string de consulta.
         */
        param: function(a, traditional)
        {
            var s = [],
                add = function(key, value)
                {
                    /**
                     * Se value for uma função, chame-a e retorne
                     * seu valor.
                     */
                    value = jQuery.isFunction(value) ? value() : value;

                    /**
                     *
                     */
                    s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
                };

            /**
             * Defina tradicional como true para comportamento
             * jQuery <= 1.3.2.
             */
            if (traditional === undefined)
            {
                traditional = jQuery.ajaxSettings.traditional;
            }

            /**
             * Se um array foi passado, suponha que seja um array
             * de elementos de formulário.
             */
            if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a)))
            {
                /**
                 * Serialize os elementos do formulário.
                 */
                jQuery.each(a, function()
                {
                    add(this.name, this.value);
                });
            } else
            {
                /**
                 * Se for tradicional, codifique da maneira "antiga" (da
                 * maneira 1.3.2 ou anterior), caso contrário, codifique
                 * os parâmetros recursivamente.
                 */
                for (var prefix in a)
                {
                    buildParams(prefix, a[prefix], traditional, add);
                }
            }

            /**
             * Retorne a serialização resultante.
             */
            return s.join("&").replace(r20, "+");
        }
    });

    /**
     *
     */
    function buildParams(prefix, obj, traditional, add)
    {
        if (jQuery.isArray(obj))
        {
            /**
             * Serialize o item do vetor.
             */
            jQuery.each(obj, function(i, v)
            {
                if (traditional || rbracket.test(prefix))
                {
                    /**
                     * Trate cada item do vetor como um escalar.
                     */
                    add(prefix, v);
                } else
                {
                    /**
                     * Se o item do vetor não for escalar (vetor ou objeto),
                     * codifique seu índice numérico para resolver problemas
                     * de ambiguidade de desserialização. Observe que o rack
                     * (a partir da versão 1.0.0) atualmente não pode
                     * desserializar vetores aninhados corretamente e tentar
                     * fazer isso pode causar um erro no fornecedor. As
                     * possíveis soluções são modificar o algoritmo de
                     * desserialização do rack ou fornecer uma opção ou
                     * sinalizador para forçar a serialização do array a ser
                     * superficial.
                     */
                    buildParams(prefix + "[" + (typeof v === "object" || jQuery.isArray(v) ? i : "") + "]", v, traditional, add);
                }
            });
        } else if (!traditional && obj != null && typeof obj === "object")
        {
            /**
             * Serialize o item do objeto.
             */
            for (var name in obj)
            {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
        } else
        {
            /**
             * Serialize item escalar.
             */
            add(prefix, obj);
        }
    }

    /**
     * Isso ainda está no objeto jQuery... por enquanto.
     * Deseja mover isso para jQuery.ajax algum dia.
     */
    jQuery.extend({
        /**
         * Contador para armazenar o número de consultas ativas.
         */
        active: 0,

        /**
         * Cache de título modificado pela última vez para a
         * próxima solicitação.
         */
        lastModified: {},

        /**
         *
         */
        etag: {}
    });

    /**
     * Lida com respostas a uma solicitação ajax:
     *     - Define todos os campos de responseXXX de acordo.
     *     - Encontra o dataType correto (faz a mediação entre
     *       o tipo de conteúdo e o dataType esperado).
     *     - Devolve a resposta correspondente.
     */
    function ajaxHandleResponses(s, jqXHR, responses)
    {
        var contents = s.contents,
            dataTypes = s.dataTypes,
            responseFields = s.responseFields,
            ct,
            type,
            finalDataType,
            firstDataType;

        /**
         * Preencha os campos de responseXXX.
         */
        for (type in responseFields)
        {
            if (type in responses)
            {
                jqXHR[responseFields[type]] = responses[type];
            }
        }

        /**
         * Remova auto dataType e obtenha o tipo de conteúdo
         * no processo.
         */
        while(dataTypes[0] === "*")
        {
            dataTypes.shift();

            if (ct === undefined)
            {
                ct = s.mimeType || jqXHR.getResponseHeader("content-type");
            }
        }

        /**
         * Verifique se estamos lidando com um tipo de conteúdo
         * conhecido.
         */
        if (ct)
        {
            for (type in contents)
            {
                if (contents[type] && contents[type].test(ct))
                {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }

        /**
         * Verifique se temos uma resposta para o dataType
         * esperado.
         */
        if (dataTypes[0] in responses)
        {
            finalDataType = dataTypes[0];
        } else
        {
            /**
             * Experimente dataTypes conversíveis.
             */
            for (type in responses)
            {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]])
                {
                    finalDataType = type;
                    break;
                }

                if (!firstDataType)
                {
                    firstDataType = type;
                }
            }

            /**
             * Ou apenas use o primeiro.
             */
            finalDataType = finalDataType || firstDataType;
        }

        /**
         * Se encontrarmos um dataType. Adicionamos o dataType à lista,
         * se necessário, e retornamos a resposta correspondente.
         */
        if (finalDataType)
        {
            if (finalDataType !== dataTypes[0])
            {
                dataTypes.unshift(finalDataType);
            }

            return responses[finalDataType];
        }
    }

    /**
     * Conversões em string de acordo com a solicitação
     * e a resposta original.
     */
    function ajaxConvert(s, response)
    {
        /**
         * Aplique o dataFilter, se fornecido.
         */
        if (s.dataFilter)
        {
            response = s.dataFilter(response, s.dataType);
        }

        var dataTypes = s.dataTypes,
            converters = {},
            i,
            key,
            length = dataTypes.length,
            tmp,

            /**
             * dataTypes atuais e anteriores.
             */
            current = dataTypes[0],
            prev,

            /**
             * Expressão de conversão.
             */
            conversion,

            /**
             * Função de conversão.
             */
            conv,

            /**
             * Funções de conversão (conversão transitiva).
             */
            conv1,
            conv2;

        /**
         * Para cada dataType na string.
         */
        for (i = 1; i < length; i++)
        {
            /**
             * Crie um mapa de conversores com teclas minúsculas.
             */
            if (i === 1)
            {
                for (key in s.converters)
                {
                    if (typeof key === "string")
                    {
                        converters[key.toLowerCase()] = s.converters[key];
                    }
                }
            }

            /**
             * Obter o dataTypes.
             */
            prev = current;
            current = dataTypes[i];

            /**
             * Se atual for auto dataType, atualize-o para anterior.
             */
            if (current === "*")
            {
                current = prev;

                /**
                 * Se nenhum auto e dataTypes forem realmente diferentes.
                 */
            } else if (prev !== "*" && prev !== current)
            {
                /**
                 * Obtenha o conversor.
                 */
                conversion = prev + " " + current;
                conv = converters[conversion] || converters["* " + current];

                /**
                 * Se não houver conversor direto, pesquise transitivamente.
                 */
                if (!conv)
                {
                    conv2 = undefined;

                    for (conv1 in converters)
                    {
                        tmp = conv1.split(" ");

                        if (tmp[0] === prev || tmp[0] === "*")
                        {
                            conv2 = converters[tmp[1] + " " + current];

                            if (conv2)
                            {
                                conv1 = converters[conv1];
                                if (conv1 === true)
                                {
                                    conv = conv2;
                                } else if (conv2 === true)
                                {
                                    conv = conv1;
                                }

                                break;
                            }
                        }
                    }
                }

                /**
                 * Se não encontrarmos nenhum conversor, enviaremos um erro.
                 */
                if (!(conv || conv2))
                {
                    jQuery.error("No conversion from " + conversion.replace(" ", " to "));
                }

                /**
                 * Se encontrado, o conversor não é uma equivalência.
                 */
                if (conv !== true)
                {
                    /**
                     * Converta com 1 ou 2 conversores de acordo.
                     */
                    response = conv ? conv(response) : conv2(conv1(response));
                }
            }
        }

        return response;
    }

    /**
     *
     */
    var jsc = jQuery.now(),
        jsre = /(\=)\?(&|$)|\?\?/i;

    /**
     * Configurações jsonp padrão.
     */
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function()
        {
            return jQuery.expando + "_" + (jsc++);
        }
    });

    /**
     * Detecte, normalize opções e instale callbacks
     * para solicitações jsonp.
     */
    jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR)
    {
        var inspectData = s.contentType === "application/x-www-form-urlencoded" && (typeof s.data === "string");

        /**
         *
         */
        if (s.dataTypes[0] === "jsonp" || s.jsonp !== false && (jsre.test(s.url) || inspectData && jsre.test(s.data)))
        {
            var responseContainer,
                jsonpCallback = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback,
                previous = window[jsonpCallback],
                url = s.url,
                data = s.data,
                replace = "$1" + jsonpCallback + "$2";

            if (s.jsonp !== false)
            {
                url = url.replace(jsre, replace);

                if (s.url === url)
                {
                    if (inspectData)
                    {
                        data = data.replace(jsre, replace);
                    }

                    if (s.data === data)
                    {
                        /**
                         * Adicione callback manualmente.
                         */
                        url += (/\?/.test(url) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
                    }
                }
            }

            s.url = url;
            s.data = data;

            /**
             * Instalar callback.
             */
            window[jsonpCallback] = function(response)
            {
                responseContainer = [response];
            };

            /**
             * Função de limpeza.
             */
            jqXHR.always(function()
            {
                /**
                 * Defina o callback para o valor anterior.
                 */
                window[jsonpCallback] = previous;

                /**
                 * Ligue se for uma função e teremos uma resposta.
                 */
                if (responseContainer && jQuery.isFunction(previous))
                {
                    window[jsonpCallback](responseContainer[0]);
                }
            });

            /**
             * Use o conversor de dados para recuperar JSON após
             * a execução do script.
             */
            s.converters["script json"] = function()
            {
                if (!responseContainer)
                {
                    jQuery.error(jsonpCallback + " was not called");
                }

                return responseContainer[0];
            };

            /**
             * Forçar dataType json.
             */
            s.dataTypes[0] = "json";

            /**
             * Delegar ao script.
             */
            return "script";
        }
    });

    /**
     * Instale o script dataType.
     */
    jQuery.ajaxSetup({
        /**
         *
         */
        accepts: {
            /**
             *
             */
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },

        /**
         *
         */
        contents: {
            /**
             *
             */
            script: /javascript|ecmascript/
        },

        /**
         *
         */
        converters: {
            /**
             *
             */
            "text script": function(text)
            {
                jQuery.globalEval(text);

                return text;
            }
        }
    });

    /**
     * Lida com caso especial e global do cache.
     */
    jQuery.ajaxPrefilter("script", function(s)
    {
        if (s.cache === undefined)
        {
            s.cache = false;
        }

        if (s.crossDomain)
        {
            s.type = "GET";
            s.global = false;
        }
    });

    /**
     * Vincule o transporte de hack de tags de script.
     */
    jQuery.ajaxTransport("script", function(s)
    {
        /**
         * Este transporte lida apenas com solicitações
         * entre domínios.
         */
        if (s.crossDomain)
        {
            var script,
                head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

            return {
                /**
                 *
                 */
                send: function(_, callback)
                {
                    script = document.createElement("script");
                    script.async = "async";

                    if (s.scriptCharset)
                    {
                        script.charset = s.scriptCharset;
                    }

                    /**
                     *
                     */
                    script.src = s.url;

                    /**
                     * Anexe manipuladores para todos os navegadores.
                     */
                    script.onload = script.onreadystatechange = function(_, isAbort)
                    {
                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState))
                        {
                            /**
                             * Lidar com vazamento de memória no IE.
                             */
                            script.onload = script.onreadystatechange = null;

                            /**
                             * Remova o script.
                             */
                            if (head && script.parentNode)
                            {
                                head.removeChild(script);
                            }

                            /**
                             * Desreferenciar o script.
                             */
                            script = undefined;

                            /**
                             * Callback se não terminar.
                             */
                            if (!isAbort)
                            {
                                callback(200, "success");
                            }
                        }
                    };

                    /**
                     * Use insertBefore em vez de appendChild para contornar
                     * um bug do IE6. Isto surge quando um node base é usado
                     * (#2709 e #4378).
                     */
                    head.insertBefore(script, head.firstChild);
                },

                /**
                 *
                 */
                abort: function()
                {
                    if (script)
                    {
                        script.onload(0, 1);
                    }
                }
            };
        }
    });

    /**
     *
     */
    var
        /**
         * #5280: O Internet Explorer manterá as conexões
         * ativas se não interrompermos o descarregamento.
         */
        xhrOnUnloadAbort = window.ActiveXObject ? function()
        {
            /**
             * Abortar todas as solicitações pendentes.
             */
            for (var key in xhrCallbacks)
            {
                xhrCallbacks[key](0, 1);
            }
        } : false,

        /**
         *
         */
        xhrId = 0,

        /**
         *
         */
        xhrCallbacks;

    /**
     * Funções para criar xhrs.
     */
    function createStandardXHR()
    {
        try
        {
            return new window.XMLHttpRequest();
        } catch(e)
        {
        }
    }

    /**
     *
     */
    function createActiveXHR()
    {
        try
        {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch(e)
        {
        }
    }

    /**
     * Crie o objeto de solicitação (ele ainda está anexado
     * a ajaxSettings para compatibilidade com versões
     * anteriores).
     */
    jQuery.ajaxSettings.xhr = window.ActiveXObject ?
        /***
         * A Microsoft não conseguiu implementar corretamente
         * o XMLHttpRequest no IE7 (não é possível solicitar
         * arquivos locais), por isso usamos o ActiveXObject
         * quando ele está disponível. Além disso, XMLHttpRequest
         * pode ser desativado no IE7/IE8, portanto, precisamos
         * de um substituto.
         */
        function()
        {
            return !this.isLocal && createStandardXHR() || createActiveXHR();
        } :

        /**
         * Para todos os outros navegadores, use o objeto
         * XMLHttpRequest padrão.
         */
        createStandardXHR;

    /**
     * Determine as propriedades de suporte.
     */
    (function(xhr)
    {
        jQuery.extend(jQuery.support, {
            ajax: !!xhr,
            cors: !!xhr && ("withCredentials" in xhr)
        });
    })(jQuery.ajaxSettings.xhr());

    /**
     * Crie transporte se o navegador puder fornecer
     * um xhr.
     */
    if (jQuery.support.ajax)
    {
        jQuery.ajaxTransport(function(s)
        {
            /**
             * Entre domínios só são permitidos se houver suporte
             * por meio de XMLHttpRequest.
             */
            if (!s.crossDomain || jQuery.support.cors)
            {
                var callback;

                /**
                 *
                 */
                return {
                    /**
                     *
                     */
                    send: function(headers, complete)
                    {
                        /**
                         * Obter o novo xhr.
                         */
                        var xhr = s.xhr(),
                            handle,
                            i;

                        /**
                         * Abra o socket. Passar nome de usuário nulo
                         * gera um pop-up de login no Opera (#2865).
                         */
                        if (s.username)
                        {
                            xhr.open(s.type, s.url, s.async, s.username, s.password);
                        } else
                        {
                            xhr.open(s.type, s.url, s.async);
                        }

                        /**
                         * Aplique campos personalizados, se fornecidos.
                         */
                        if (s.xhrFields)
                        {
                            for (i in s.xhrFields)
                            {
                                xhr[i] = s.xhrFields[i];
                            }
                        }

                        /**
                         * Substitua o tipo MIME, se necessário.
                         */
                        if (s.mimeType && xhr.overrideMimeType)
                        {
                            xhr.overrideMimeType(s.mimeType);
                        }

                        /**
                         * Título X-Requested-With.
                         * Para solicitações entre domínios, visto que as
                         * condições para uma simulação são semelhantes a
                         * uma complexidade grande, simplesmente nunca as
                         * configuramos para ter certeza. (sempre pode ser
                         * definido por solicitação ou até mesmo usando
                         * ajaxSetup). Para solicitações do mesmo domínio,
                         * não alterará o título se já tiver sido fornecido.
                         */
                        if (!s.crossDomain && !headers["X-Requested-With"])
                        {
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        }

                        /**
                         * Precisa de um try/catch extra para solicitações
                         * entre domínios no Firefox 3.
                         */
                        try
                        {
                            for (i in headers)
                            {
                                xhr.setRequestHeader(i, headers[i]);
                            }
                        } catch(_)
                        {
                        }

                        /**
                         * Envie a solicitação. Isso pode gerar uma exceção
                         * que é realmente tratada em jQuery.ajax (portanto,
                         * não tente try/catch aqui).
                         */
                        xhr.send((s.hasContent && s.data) || null);

                        /**
                         * Ouvinte.
                         */
                        callback = function(_, isAbort)
                        {
                            var status,
                                statusText,
                                responseHeaders,
                                responses,
                                xml;

                            /**
                             * O Firefox lança exceções ao acessar propriedades
                             * de um xhr quando ocorre um erro de rede.
                             *
                             * http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE).
                             */
                            try
                            {
                                /**
                                 * Nunca foi chamado e foi terminado ou concluído.
                                 */
                                if (callback && (isAbort || xhr.readyState === 4))
                                {
                                    /**
                                     * Liguei apenas uma vez.
                                     */
                                    callback = undefined;

                                    /**
                                     * Não se mantenha mais tão ativo.
                                     */
                                    if (handle)
                                    {
                                        xhr.onreadystatechange = jQuery.noop;

                                        if (xhrOnUnloadAbort)
                                        {
                                            delete xhrCallbacks[handle];
                                        }
                                    }

                                    /**
                                     * Se for um término.
                                     */
                                    if (isAbort)
                                    {
                                        /**
                                         * Aborte manualmente, se necessário.
                                         */
                                        if (xhr.readyState !== 4)
                                        {
                                            xhr.abort();
                                        }
                                    } else
                                    {
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();
                                        responses = {};
                                        xml = xhr.responseXML;

                                        /**
                                         * Construa uma lista de respostas.
                                         *
                                         * xml.documentElement #4958.
                                         */
                                        if (xml && xml.documentElement)
                                        {
                                            responses.xml = xml;
                                        }

                                        responses.text = xhr.responseText;

                                        /**
                                         * O Firefox lança uma exceção ao acessar
                                         * statusText para solicitações incorretas
                                         * entre domínios.
                                         */
                                        try
                                        {
                                            statusText = xhr.statusText;
                                        } catch(e)
                                        {
                                            /**
                                             * Normalizamos com o Webkit fornecendo
                                             * um statusText vazio.
                                             */
                                            statusText = "";
                                        }

                                        /**
                                         * Filtre o status para comportamentos
                                         * fora do padrão.
                                         */

                                        /**
                                         * Se a solicitação for local e tivermos
                                         * dados: assuma um sucesso (o sucesso
                                         * sem dados não será notificado, é o
                                         * melhor que podemos fazer dadas as
                                         * implementações atuais).
                                         */
                                        if (!status && s.isLocal && !s.crossDomain)
                                        {
                                            status = responses.text ? 200 : 404;

                                            /**
                                             * IE - #1450: às vezes retorna 1223
                                             * quando deveria ser 204.
                                             */
                                        } else if (status === 1223)
                                        {
                                            status = 204;
                                        }
                                    }
                                }
                            } catch(firefoxAccessException)
                            {
                                if (!isAbort)
                                {
                                    complete(-1, firefoxAccessException);
                                }
                            }

                            /**
                             * Ligue para concluir, se necessário.
                             */
                            if (responses)
                            {
                                complete(status, statusText, responses, responseHeaders);
                            }
                        };

                        /**
                         * Se estivermos no modo de sincronização ou em cache
                         * e tiver sido recuperado diretamente (IE6 e IE7),
                         * precisaremos enviar manualmente o callback.
                         */
                        if (!s.async || xhr.readyState === 4)
                        {
                            callback();
                        } else
                        {
                            handle = ++xhrId;

                            if (xhrOnUnloadAbort)
                            {
                                /**
                                 * Crie a lista de callbacks xhrs ativos, se
                                 * necessário, e anexe o manipulador de
                                 * descarregamento.
                                 */
                                if (!xhrCallbacks)
                                {
                                    xhrCallbacks = {};
                                    jQuery(window).unload(xhrOnUnloadAbort);
                                }

                                /**
                                 * Adicione à lista de callbacks xhrs ativos.
                                 */
                                xhrCallbacks[handle] = callback;
                            }

                            xhr.onreadystatechange = callback;
                        }
                    },

                    /**
                     *
                     */
                    abort: function()
                    {
                        if (callback)
                        {
                            callback(0, 1);
                        }
                    }
                };
            }
        });
    }

    /**
     *
     */
    var elemdisplay = {},
        iframe,
        iframeDoc,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        timerId,
        fxAttrs = [
            /**
             * Animações de altura.
             */
            [
                "height",
                "marginTop",
                "marginBottom",
                "paddingTop",
                "paddingBottom"
            ],

            /**
             * Animações de largura.
             */
            [
                "width",
                "marginLeft",
                "marginRight",
                "paddingLeft",
                "paddingRight"
            ],

            /**
             * Animações de opacidade.
             */
            [
                "opacity"
            ]
        ],

        /**
         *
         */
        fxNow;

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        show: function(speed, easing, callback)
        {
            var elem,
                display;

            if (speed || speed === 0)
            {
                return this.animate(genFx("show", 3), speed, easing, callback);
            } else
            {
                for (var i = 0, j = this.length; i < j; i++)
                {
                    elem = this[i];

                    if (elem.style)
                    {
                        display = elem.style.display;

                        /**
                         * Redefina a exibição embutida deste elemento para
                         * saber se ele está sendo ocultado por regras em
                         * cascata ou não.
                         */
                        if (!jQuery._data(elem, "olddisplay") && display === "none")
                        {
                            display = elem.style.display = "";
                        }

                        /**
                         * Defina os elementos que foram substituídos por
                         * `display: none` em uma folha de estilo para
                         * qualquer que seja o estilo padrão do navegador
                         * para tal elemento.
                         */
                        if (display === "" && jQuery.css(elem, "display") === "none")
                        {
                            jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                        }
                    }
                }

                /**
                 * Defina a exibição da maioria dos elementos em um
                 * segundo loop para evitar o refluxo constante.
                 */
                for (i = 0; i < j; i++)
                {
                    elem = this[i];

                    if (elem.style)
                    {
                        display = elem.style.display;

                        if (display === "" || display === "none")
                        {
                            elem.style.display = jQuery._data(elem, "olddisplay") || "";
                        }
                    }
                }

                return this;
            }
        },

        /**
         *
         */
        hide: function(speed, easing, callback)
        {
            if (speed || speed === 0)
            {
                return this.animate(genFx("hide", 3), speed, easing, callback);
            } else
            {
                var elem,
                    display,
                    i = 0,
                    j = this.length;

                for (; i < j; i++)
                {
                    elem = this[i];

                    if (elem.style)
                    {
                        display = jQuery.css(elem, "display");

                        if (display !== "none" && !jQuery._data(elem, "olddisplay"))
                        {
                            jQuery._data(elem, "olddisplay", display);
                        }
                    }
                }

                /**
                 * Defina a exibição dos elementos em um segundo
                 * loop para evitar o refluxo constante.
                 */
                for (i = 0; i < j; i++)
                {
                    if (this[i].style)
                    {
                        this[i].style.display = "none";
                    }
                }

                return this;
            }
        },

        /**
         * Salve a antiga função de alternância.
         */
        _toggle: jQuery.fn.toggle,

        /**
         *
         */
        toggle: function(fn, fn2, callback)
        {
            var bool = typeof fn === "boolean";

            if (jQuery.isFunction(fn) && jQuery.isFunction(fn2))
            {
                this._toggle.apply(this, arguments);
            } else if (fn == null || bool)
            {
                this.each(function()
                {
                    var state = bool ? fn : jQuery(this).is(":hidden");

                    jQuery(this)[state ? "show" : "hide"]();
                });
            } else
            {
                this.animate(genFx("toggle", 3), fn, fn2, callback);
            }

            return this;
        },

        /**
         *
         */
        fadeTo: function(speed, to, easing, callback)
        {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({opacity: to}, speed, easing, callback);
        },

        /**
         *
         */
        animate: function(prop, speed, easing, callback)
        {
            var optall = jQuery.speed(speed, easing, callback);

            if (jQuery.isEmptyObject(prop))
            {
                return this.each(optall.complete, [false]);
            }

            /**
             * Não altere as propriedades referenciadas, pois a
             * flexibilização por propriedade será perdida.
             */
            prop = jQuery.extend({}, prop);

            /**
             *
             */
            function doAnimation()
            {
                /**
                 * 'this' nem sempre tem um nodeName ao executar
                 * o conjunto de testes.
                 */

                /**
                 *
                 */
                if (optall.queue === false)
                {
                    jQuery._mark(this);
                }

                /**
                 *
                 */
                var opt = jQuery.extend({}, optall),
                    isElement = this.nodeType === 1,
                    hidden = isElement && jQuery(this).is(":hidden"),
                    name,
                    val,
                    p,
                    e,
                    parts,
                    start,
                    end,
                    unit,
                    method;

                /**
                 * Armazenará a atenuação por propriedade e será usado
                 * para determinar quando uma animação será concluída.
                 */
                opt.animatedProperties = {};

                /**
                 *
                 */
                for (p in prop)
                {
                    /**
                     * Normalização do nome da propriedade.
                     */
                    name = jQuery.camelCase(p);

                    /**
                     *
                     */
                    if (p !== name)
                    {
                        prop[name] = prop[p];
                        delete prop[p];
                    }

                    /**
                     *
                     */
                    val = prop[name];

                    /**
                     * Resolução de atenuação:
                     * por property > opt.specialEasing > opt.easing > 'swing' (padrão).
                     */
                    if (jQuery.isArray(val))
                    {
                        opt.animatedProperties[name] = val[1];
                        val = prop[name] = val[0];
                    } else
                    {
                        opt.animatedProperties[name] = opt.specialEasing && opt.specialEasing[name] || opt.easing || 'swing';
                    }

                    if (val === "hide" && hidden || val === "show" && !hidden)
                    {
                        return opt.complete.call(this);
                    }

                    if (isElement && (name === "height" || name === "width"))
                    {
                        /**
                         * Certifique-se de que nada escape. Registre todos
                         * os três atributos de overflow porque o IE não
                         * altera o atributo de overflow quando overflowX
                         * e overflowY são definidos com o mesmo valor.
                         */
                        opt.overflow = [
                            this.style.overflow,
                            this.style.overflowX,
                            this.style.overflowY
                        ];

                        /**
                         * Defina a propriedade display como inline-block
                         * para animações de altura/largura em elementos
                         * inline que tenham largura/altura animada.
                         */
                        if (jQuery.css(this, "display") === "inline" && jQuery.css(this, "float") === "none")
                        {
                            /**
                             * elementos de nível inline aceitam bloco inline;
                             * os elementos de nível de bloco precisam estar
                             * alinhados com o layout.
                             */
                            if (!jQuery.support.inlineBlockNeedsLayout || defaultDisplay(this.nodeName) === "inline")
                            {
                                this.style.display = "inline-block";
                            } else
                            {
                                this.style.zoom = 1;
                            }
                        }
                    }
                }

                if (opt.overflow != null)
                {
                    this.style.overflow = "hidden";
                }

                for (p in prop)
                {
                    e = new jQuery.fx(this, opt, p);
                    val = prop[p];

                    if (rfxtypes.test(val))
                    {
                        /**
                         * Rastreia se deve ser mostrado ou ocultado com
                         * base nos dados privados anexados ao elemento.
                         */
                        method = jQuery._data(this, "toggle" + p) || (val === "toggle" ? hidden ? "show" : "hide" : 0);

                        if (method)
                        {
                            jQuery._data(this, "toggle" + p, method === "show" ? "hide" : "show");
                            e[method]();
                        } else
                        {
                            e[val]();
                        }
                    } else
                    {
                        parts = rfxnum.exec(val);
                        start = e.cur();

                        if (parts)
                        {
                            end = parseFloat(parts[2]);
                            unit = parts[3] || (jQuery.cssNumber[p] ? "" : "px");

                            /**
                             * Precisamos calcular o valor inicial.
                             */
                            if (unit !== "px")
                            {
                                jQuery.style(this, p, (end || 1) + unit);
                                start = ((end || 1) / e.cur()) * start;
                                jQuery.style(this, p, start + unit);
                            }

                            /**
                             * Se um token +=/-= foi fornecido, estamos fazendo
                             * uma animação relativa.
                             */
                            if (parts[1])
                            {
                                end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
                            }

                            e.custom(start, end, unit);
                        } else
                        {
                            e.custom(start, val, "");
                        }
                    }
                }

                /**
                 * Para conformidade estrita de JS.
                 */
                return true;
            }

            return optall.queue === false ?
                this.each(doAnimation) :
                this.queue(optall.queue, doAnimation);
        },

        /**
         *
         */
        stop: function(type, clearQueue, gotoEnd)
        {
            if (typeof type !== "string")
            {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }

            if (clearQueue && type !== false)
            {
                this.queue(type || "fx", []);
            }

            return this.each(function()
            {
                var index,
                    hadTimers = false,
                    timers = jQuery.timers,
                    data = jQuery._data(this);

                /**
                 * Limpar contadores de marcadores se soubermos que não serão.
                 */
                if (!gotoEnd)
                {
                    jQuery._unmark(true, this);
                }

                /**
                 *
                 */
                function stopQueue(elem, data, index)
                {
                    var hooks = data[index];

                    jQuery.removeData(elem, index, true);
                    hooks.stop(gotoEnd);
                }

                if (type == null)
                {
                    for (index in data)
                    {
                        if (data[index] && data[index].stop && index.indexOf(".run") === index.length - 4)
                        {
                            stopQueue(this, data, index);
                        }
                    }
                } else if (data[index = type + ".run"] && data[index].stop)
                {
                    stopQueue(this, data, index);
                }

                for (index = timers.length; index--;)
                {
                    if (timers[index].elem === this && (type == null || timers[index].queue === type))
                    {
                        if (gotoEnd)
                        {
                            /**
                             * Forçar o próximo passo a ser o último.
                             */
                            timers[index](true);
                        } else
                        {
                            timers[index].saveState();
                        }

                        hadTimers = true;
                        timers.splice(index, 1);
                    }
                }

                /**
                 * Iniciar o próximo na fila se a última etapa não tiver
                 * sido forçada, os temporizadores atualmente chamarão
                 * seus callbacks completos, que serão retirados da fila,
                 * mas apenas se forem gotoEnd.
                 */
                if (!(gotoEnd && hadTimers))
                {
                    jQuery.dequeue(this, type);
                }
            });
        }
    });

    /**
     * As animações criadas de forma síncrona serão
     * executadas de forma síncrona.
     */
    function createFxNow()
    {
        setTimeout(clearFxNow, 0);

        return (fxNow = jQuery.now());
    }

    /**
     *
     */
    function clearFxNow()
    {
        fxNow = undefined;
    }

    /**
     * Gere parâmetros para criar uma animação padrão.
     */
    function genFx(type, num)
    {
        var obj = {};

        jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function()
        {
            obj[this] = type;
        });

        return obj;
    }

    /**
     * Gere atalhos para animações personalizadas.
     */
    jQuery.each({
        /**
         *
         */
        slideDown: genFx("show", 1),

        /**
         *
         */
        slideUp: genFx("hide", 1),

        /**
         *
         */
        slideToggle: genFx("toggle", 1),

        /**
         *
         */
        fadeIn: {
            /**
             *
             */
            opacity: "show"
        },

        /**
         *
         */
        fadeOut: {
            /**
             *
             */
            opacity: "hide"
        },

        /**
         *
         */
        fadeToggle: {
            /**
             *
             */
            opacity: "toggle"
        }
    }, function(name, props)
    {
        jQuery.fn[name] = function(speed, easing, callback)
        {
            return this.animate(props, speed, easing, callback);
        };
    });

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        speed: function(speed, easing, fn)
        {
            var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
                complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
            };

            /**
             *
             */
            opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

            /**
             * Normalizar opt.queue - true/undefined/null -> "fx".
             */
            if (opt.queue == null || opt.queue === true)
            {
                opt.queue = "fx";
            }

            /**
             * Na fila.
             */
            opt.old = opt.complete;
            opt.complete = function(noUnmark)
            {
                if (jQuery.isFunction(opt.old))
                {
                    opt.old.call(this);
                }

                if (opt.queue)
                {
                    jQuery.dequeue(this, opt.queue);
                } else if (noUnmark !== false)
                {
                    jQuery._unmark(this);
                }
            };

            return opt;
        },

        /**
         *
         */
        easing: {
            /**
             *
             */
            linear: function(p, n, firstNum, diff)
            {
                return firstNum + diff * p;
            },

            /**
             *
             */
            swing: function(p, n, firstNum, diff)
            {
                return ((-Math.cos(p*Math.PI) / 2) + 0.5) * diff + firstNum;
            }
        },

        /**
         *
         */
        timers: [],

        /**
         *
         */
        fx: function(elem, options, prop)
        {
            this.options = options;
            this.elem = elem;
            this.prop = prop;

            options.orig = options.orig || {};
        }
    });

    /**
     *
     */
    jQuery.fx.prototype = {
        /**
         * Função simples para definir um valor de estilo.
         */
        update: function()
        {
            if (this.options.step)
            {
                this.options.step.call(this.elem, this.now, this);
            }

            (
                jQuery.fx.step[this.prop] || jQuery.fx.step._default
            )(this);
        },

        /**
         * Obtenha o tamanho atual.
         */
        cur: function()
        {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null))
            {
                return this.elem[this.prop];
            }

            var parsed,
                r = jQuery.css(this.elem, this.prop);

            /**
             * Strings vazias, nulas, indefinidas e "auto" são
             * convertidas em 0, valores complexos como "rotate(1rad)"
             * são retornados como estão, valores simples como "10px"
             * são analisados para Float.
             */
            return isNaN(parsed = parseFloat(r)) ? !r || r === "auto" ? 0 : r : parsed;
        },

        /**
         * Inicie uma animação de um número para outro.
         */
        custom: function(from, to, unit)
        {
            var self = this,
                fx = jQuery.fx;

            this.startTime = fxNow || createFxNow();
            this.end = to;
            this.now = this.start = from;
            this.pos = this.state = 0;
            this.unit = unit || this.unit || (jQuery.cssNumber[this.prop] ? "" : "px");

            /**
             *
             */
            function t(gotoEnd)
            {
                return self.step(gotoEnd);
            }

            t.queue = this.options.queue;
            t.elem = this.elem;

            /**
             *
             */
            t.saveState = function()
            {
                if (self.options.hide && jQuery._data(self.elem, "fxshow" + self.prop) === undefined)
                {
                    jQuery._data(self.elem, "fxshow" + self.prop, self.start);
                }
            };

            /**
             *
             */
            if (t() && jQuery.timers.push(t) && !timerId)
            {
                timerId = setInterval(fx.tick, fx.interval);
            }
        },

        /**
         * Função 'show' simples.
         */
        show: function()
        {
            var dataShow = jQuery._data(this.elem, "fxshow" + this.prop);

            /**
             * Lembre-se de onde começamos, para que possamos
             * voltar mais tarde.
             */
            this.options.orig[this.prop] = dataShow || jQuery.style(this.elem, this.prop);
            this.options.show = true;

            /**
             * Comece a animação. Certifique-se de começar com uma
             * largura/altura pequena para evitar qualquer flash
             * de conteúdo.
             */
            if (dataShow !== undefined)
            {
                /**
                 * Este show está começando de onde um show ou
                 * show anterior parou.
                 */
                this.custom(this.cur(), dataShow);
            } else
            {
                this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
            }

            /**
             * Comece mostrando o elemento.
             */
            jQuery(this.elem).show();
        },

        /**
         * Função 'hide' simples.
         */
        hide: function()
        {
            /**
             * Lembre-se de onde começamos, para que possamos
             * voltar mais tarde.
             */
            this.options.orig[this.prop] = jQuery._data(this.elem, "fxshow" + this.prop) || jQuery.style(this.elem, this.prop);
            this.options.hide = true;

            /**
             * Comece a animação.
             */
            this.custom(this.cur(), 0);
        },

        /**
         * Cada etapa de uma animação.
         */
        step: function(gotoEnd)
        {
            var p,
                n,
                complete,
                t = fxNow || createFxNow(),
                done = true,
                elem = this.elem,
                options = this.options;

            if (gotoEnd || t >= options.duration + this.startTime)
            {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();

                options.animatedProperties[this.prop] = true;
                for (p in options.animatedProperties)
                {
                    if (options.animatedProperties[p] !== true)
                    {
                        done = false;
                    }
                }

                if (done)
                {
                    /**
                     * Redefina o limite.
                     */
                    if (options.overflow != null && !jQuery.support.shrinkWrapBlocks)
                    {
                        jQuery.each(["", "X", "Y"], function(index, value)
                        {
                            elem.style["overflow" + value] = options.overflow[index];
                        });
                    }

                    /**
                     * Oculte o elemento se a operação "ocultar" tiver
                     * sido realizada.
                     */
                    if (options.hide)
                    {
                        jQuery(elem).hide();
                    }

                    /**
                     * Redefina as propriedades, se o item estiver
                     * oculto ou exibido.
                     */
                    if (options.hide || options.show)
                    {
                        for (p in options.animatedProperties)
                        {
                            jQuery.style(elem, p, options.orig[p]);
                            jQuery.removeData(elem, "fxshow" + p, true);

                            /**
                             * A alternância de dados não é mais necessária.
                             */
                            jQuery.removeData(elem, "toggle" + p, true);
                        }
                    }

                    /**
                     * Execute a função completa caso a função completa
                     * gere uma exceção, devemos garantir que ela não
                     * será chamada duas vezes. #5684.
                     */

                    /**
                     *
                     */
                    complete = options.complete;

                    /**
                     *
                     */
                    if (complete)
                    {
                        options.complete = false;
                        complete.call(elem);
                    }
                }

                return false;
            } else
            {
                /**
                 * A atenuação clássica não pode ser usada com
                 * duração infinita.
                 */
                if (options.duration == Infinity)
                {
                    this.now = t;
                } else
                {
                    n = t - this.startTime;
                    this.state = n / options.duration;

                    /**
                     * Execute a função de atenuação, o padrão é swing.
                     */
                    this.pos = jQuery.easing[options.animatedProperties[this.prop]](this.state, n, 0, 1, options.duration);
                    this.now = this.start + ((this.end - this.start) * this.pos);
                }

                /**
                 * Execute a próxima etapa da animação.
                 */
                this.update();
            }

            return true;
        }
    };

    /**
     *
     */
    jQuery.extend(jQuery.fx, {
        /**
         *
         */
        tick: function()
        {
            var timer,
                timers = jQuery.timers,
                i = 0;

            for (; i < timers.length; i++)
            {
                timer = timers[i];

                /**
                 * Verifica se o cronômetro ainda não foi removido.
                 */
                if (!timer() && timers[i] === timer)
                {
                    timers.splice(i--, 1);
                }
            }

            if (!timers.length)
            {
                jQuery.fx.stop();
            }
        },

        /**
         *
         */
        interval: 13,

        /**
         *
         */
        stop: function()
        {
            clearInterval(timerId);
            timerId = null;
        },

        /**
         *
         */
        speeds: {
            /**
             *
             */
            slow: 600,

            /**
             *
             */
            fast: 200,

            /**
             * Velocidade padrão.
             */
            _default: 400
        },

        /**
         *
         */
        step: {
            /**
             *
             */
            opacity: function(fx)
            {
                jQuery.style(fx.elem, "opacity", fx.now);
            },

            /**
             *
             */
            _default: function(fx)
            {
                if (fx.elem.style && fx.elem.style[fx.prop] != null)
                {
                    fx.elem.style[fx.prop] = fx.now + fx.unit;
                } else
                {
                    fx.elem[fx.prop] = fx.now;
                }
            }
        }
    });

    /**
     * Adiciona funções de passo de largura/altura.
     * Não defina nada abaixo de 0.
     */
    jQuery.each(["width", "height"], function(i, prop)
    {
        jQuery.fx.step[prop] = function(fx)
        {
            jQuery.style(fx.elem, prop, Math.max(0, fx.now) + fx.unit);
        };
    });

    /**
     *
     */
    if (jQuery.expr && jQuery.expr.filters)
    {
        jQuery.expr.filters.animated = function(elem)
        {
            return jQuery.grep(jQuery.timers, function(fn)
            {
                return elem === fn.elem;
            }).length;
        };
    }

    /**
     * Tente restaurar o valor de exibição padrão de
     * um elemento.
     */
    function defaultDisplay(nodeName)
    {
        if (!elemdisplay[nodeName])
        {
            var body = document.body,
                elem = jQuery("<" + nodeName + ">").appendTo(body),
                display = elem.css("display");

            /**
             *
             */
            elem.remove();

            /**
             * Se a maneira simples falhar, obtenha a exibição padrão
             * real do elemento anexando-o a um iframe temporário.
             */
            if (display === "none" || display === "")
            {
                /**
                 * Ainda não há iframe para usar, então crie-o.
                 */
                if (!iframe)
                {
                    iframe = document.createElement("iframe");
                    iframe.frameBorder = iframe.width = iframe.height = 0;
                }

                body.appendChild(iframe);

                /**
                 * Crie uma cópia armazenável em cache do documento
                 * iframe na primeira chamada. O IE e o Opera nos
                 * permitirão reutilizar o iframeDoc sem reescrever
                 * o documento HTML falso nele; WebKit e Firefox não
                 * permitem a reutilização do documento iframe.
                 */
                if (!iframeDoc || !iframe.createElement)
                {
                    iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
                    iframeDoc.write((document.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>");
                    iframeDoc.close();
                }

                elem = iframeDoc.createElement(nodeName);
                iframeDoc.body.appendChild(elem);

                display = jQuery.css(elem, "display");
                body.removeChild(iframe);
            }

            /**
             * Armazene a exibição padrão correta.
             */
            elemdisplay[nodeName] = display;
        }

        return elemdisplay[nodeName];
    }

    /**
     *
     */
    var rtable = /^t(?:able|d|h)$/i,
        rroot = /^(?:body|html)$/i;

    /**
     *
     */
    if ("getBoundingClientRect" in document.documentElement)
    {
        /**
         *
         */
        jQuery.fn.offset = function(options)
        {
            var elem = this[0], box;

            if (options)
            {
                return this.each(function(i)
                {
                    jQuery.offset.setOffset(this, options, i);
                });
            }

            if (!elem || !elem.ownerDocument)
            {
                return null;
            }

            if (elem === elem.ownerDocument.body)
            {
                return jQuery.offset.bodyOffset(elem);
            }

            try
            {
                box = elem.getBoundingClientRect();
            } catch(e)
            {
            }

            /**
             *
             */
            var doc = elem.ownerDocument,
                docElem = doc.documentElement;

            /**
             * Certifique-se de que não estamos lidando com um
             * node DOM desconectado.
             */
            if (!box || !jQuery.contains(docElem, elem))
            {
                return box ? {
                    top: box.top,
                    left: box.left
                } : {
                    top: 0,
                    left: 0
                };
            }

            var body = doc.body,
                win = getWindow(doc),
                clientTop = docElem.clientTop  || body.clientTop  || 0,
                clientLeft = docElem.clientLeft || body.clientLeft || 0,
                scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
                scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
                top  = box.top  + scrollTop  - clientTop,
                left = box.left + scrollLeft - clientLeft;

            return {
                top: top,
                left: left
            };
        };
    } else
    {
        /**
         *
         */
        jQuery.fn.offset = function(options)
        {
            var elem = this[0];

            if (options)
            {
                return this.each(function(i)
                {
                    jQuery.offset.setOffset(this, options, i);
                });
            }

            if (!elem || !elem.ownerDocument)
            {
                return null;
            }

            if (elem === elem.ownerDocument.body)
            {
                return jQuery.offset.bodyOffset(elem);
            }

            var computedStyle,
                offsetParent = elem.offsetParent,
                prevOffsetParent = elem,
                doc = elem.ownerDocument,
                docElem = doc.documentElement,
                body = doc.body,
                defaultView = doc.defaultView,
                prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle,
                top = elem.offsetTop,
                left = elem.offsetLeft;

            while ((elem = elem.parentNode) && elem !== body && elem !== docElem)
            {
                if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed")
                {
                    break;
                }

                computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
                top -= elem.scrollTop;
                left -= elem.scrollLeft;

                if (elem === offsetParent)
                {
                    top  += elem.offsetTop;
                    left += elem.offsetLeft;

                    if (jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)))
                    {
                        top += parseFloat(computedStyle.borderTopWidth) || 0;
                        left += parseFloat(computedStyle.borderLeftWidth) || 0;
                    }

                    prevOffsetParent = offsetParent;
                    offsetParent = elem.offsetParent;
                }

                if (jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible")
                {
                    top  += parseFloat(computedStyle.borderTopWidth) || 0;
                    left += parseFloat(computedStyle.borderLeftWidth) || 0;
                }

                prevComputedStyle = computedStyle;
            }

            if (prevComputedStyle.position === "relative" || prevComputedStyle.position === "static")
            {
                top  += body.offsetTop;
                left += body.offsetLeft;
            }

            if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed")
            {
                top  += Math.max(docElem.scrollTop, body.scrollTop);
                left += Math.max(docElem.scrollLeft, body.scrollLeft);
            }

            return {
                top: top,
                left: left
            };
        };
    }

    /**
     *
     */
    jQuery.offset = {
        /**
         *
         */
        bodyOffset: function(body)
        {
            var top = body.offsetTop,
                left = body.offsetLeft;

            if (jQuery.support.doesNotIncludeMarginInBodyOffset)
            {
                top  += parseFloat(jQuery.css(body, "marginTop")) || 0;
                left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
            }

            return {
                top: top,
                left: left
            };
        },

        /**
         *
         */
        setOffset: function(elem, options, i)
        {
            var position = jQuery.css(elem, "position");

            /**
             * Defina a posição primeiro, caso a parte alta/esquerda
             * esteja definida mesmo no elemento estático.
             */
            if (position === "static")
            {
                elem.style.position = "relative";
            }

            var curElem = jQuery(elem),
                curOffset = curElem.offset(),
                curCSSTop = jQuery.css(elem, "top"),
                curCSSLeft = jQuery.css(elem, "left"),
                calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
                props = {},
                curPosition = {},
                curTop,
                curLeft;

            /**
             * Precisa ser capaz de calcular a posição se o topo
             * ou a esquerda for automático e a posição for absoluta
             * ou fixa.
             */
            if (calculatePosition)
            {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else
            {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }

            if (jQuery.isFunction(options))
            {
                options = options.call(elem, i, curOffset);
            }

            if (options.top != null)
            {
                props.top = (options.top - curOffset.top) + curTop;
            }

            if (options.left != null)
            {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            if ("using" in options)
            {
                options.using.call(elem, props);
            } else
            {
                curElem.css(props);
            }
        }
    };

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        position: function()
        {
            if (!this[0])
            {
                return null;
            }

            var elem = this[0],

            /**
             * Obter offsetParent *real*.
             */
            offsetParent = this.offsetParent(),

            /**
             * Obtenha offsets corretos.
             */
            offset = this.offset(),
            parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

            /**
             * Subtraia as margens do elemento.
             * Observação: quando um elemento tem `margin: auto` o
             * offsetLeft e marginLeft são iguais no Safari, fazendo
             * com que offset.left seja 0 incorretamente.
             */
            offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0;
            offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0;

            /**
             * Adicione bordas offsetParent.
             */
            parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0;
            parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0;

            /**
             * Subtraia os dois offsets.
             */
            return {
                top:  offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },

        /**
         *
         */
        offsetParent: function()
        {
            return this.map(function()
            {
                var offsetParent = this.offsetParent || document.body;

                while (offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static"))
                {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent;
            });
        }
    });

    /**
     * Crie os métodos scrollLeft e scrollTop.
     */
    jQuery.each(["Left", "Top"], function(i, name)
    {
        var method = "scroll" + name;

        /**
         *
         */
        jQuery.fn[method] = function(val)
        {
            var elem,
                win;

            if (val === undefined)
            {
                elem = this[0];

                if (!elem)
                {
                    return null;
                }

                win = getWindow(elem);

                /**
                 * Retorne o offset do scroll.
                 */
                return win ? ("pageXOffset" in win) ? win[i ? "pageYOffset" : "pageXOffset"] : jQuery.support.boxModel && win.document.documentElement[method] || win.document.body[method] : elem[method];
            }

            /**
             * Defina o deslocamento da rolagem.
             */
            return this.each(function()
            {
                win = getWindow(this);

                if (win)
                {
                    win.scrollTo(
                        !i ? val : jQuery(win).scrollLeft(),
                         i ? val : jQuery(win).scrollTop()
                    );
                } else
                {
                    this[method] = val;
                }
            });
        };
    });

    /**
     *
     */
    function getWindow(elem)
    {
        return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
    }

    /**
     * Criar métodos
     *     - width,
     *     - height,
     *     - innerHeight,
     *     - innerWidth,
     *     - outerHeight e outerWidth.
     */
    jQuery.each(["Height", "Width"], function(i, name)
    {
        var type = name.toLowerCase();

        /**
         * innerHeight e innerWidth.
         */
        jQuery.fn["inner" + name] = function()
        {
            var elem = this[0];

            /**
             *
             */
            return elem ? elem.style ? parseFloat(jQuery.css(elem, type, "padding")) : this[type]() : null;
        };

        /**
         * outerHeight e outerWidth.
         */
        jQuery.fn["outer" + name] = function(margin)
        {
            var elem = this[0];

            /**
             *
             */
            return elem ? elem.style ? parseFloat(jQuery.css(elem, type, margin ? "margin" : "border")) : this[type]() : null;
        };

        /**
         *
         */
        jQuery.fn[type] = function(size)
        {
            /**
             * Obtenha a largura ou altura da janela.
             */
            var elem = this[0];

            /**
             *
             */
            if (!elem)
            {
                return size == null ? null : this;
            }

            /**
             *
             */
            if (jQuery.isFunction(size))
            {
                return this.each(function(i)
                {
                    var self = jQuery(this);

                    self[type](size.call(this, i, self[type]()));
                });
            }

            /**
             *
             */
            if (jQuery.isWindow(elem))
            {
                /**
                 * Todos os outros usam document.documentElement ou
                 * document.body dependendo do modo Quirks vs Standards.
                 * A 3ª condição permite o suporte da Nokia, pois
                 * suporta a propriedade docElem, mas não CSS1Compat.
                 */
                var docElemProp = elem.document.documentElement["client" + name],
                    body = elem.document.body;

                return elem.document.compatMode === "CSS1Compat" && docElemProp || body && body["client" + name] || docElemProp;

                /**
                 * Obtenha a largura ou altura do documento.
                 */
            } else if (elem.nodeType === 9)
            {
                /**
                 * Qualquer scroll[Width/Height] ou offset[Width/Height],
                 * o que for maior.
                 */
                return Math.max(
                    elem.documentElement["client" + name],
                    elem.body["scroll" + name], elem.documentElement["scroll" + name],
                    elem.body["offset" + name], elem.documentElement["offset" + name]
                );

                /**
                 * Obtenha ou defina a largura ou altura do elemento.
                 */
            } else if (size === undefined)
            {
                var orig = jQuery.css(elem, type),
                    ret = parseFloat(orig);

                return jQuery.isNumeric(ret) ? ret : orig;

                /**
                 * Defina a largura ou altura do elemento (o padrão
                 * é pixels se o valor não tiver unidade).
                 */
            } else
            {
                return this.css(type, typeof size === "string" ? size : size + "px");
            }
        };
    });

    /**
     * Exponha o jQuery ao objeto global.
     */
    window.jQuery = window.$ = jQuery;

    /**
     * Exponha o jQuery como um módulo AMD, mas apenas para carregadores
     * AMD que entendem os problemas de carregamento de múltiplas versões
     * do jQuery em uma página que todos podem chamar de define(). O
     * carregador indicará que eles têm permissões especiais para múltiplas
     * versões do jQuery especificando define.amd.jQuery = true. Registre-se
     * como um módulo nomeado, pois o jQuery pode ser concatenado com outros
     * arquivos que podem usar define, mas não pode usar um script de
     * concatenação adequado que entenda módulos AMD anônimos. Um AMD nomeado
     * é a forma mais segura e robusta de registro. jQuery minúsculo é usado
     * porque os nomes dos módulos AMD são derivados de nomes de arquivos, e
     * jQuery normalmente é entregue em um nome de arquivo minúsculo. Faça
     * isso depois de criar o global para que se um módulo AMD quiser chamar
     * noConflict para ocultar esta versão do jQuery, ele funcionará.
     */
    if (typeof define === "function" && define.amd && define.amd.jQuery)
    {
        define("jquery", [], function ()
        {
            return jQuery;
        });
    }
})(window);
