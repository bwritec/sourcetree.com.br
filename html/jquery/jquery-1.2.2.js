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
(function()
{
    /**
     * Mapeie sobre jQuery em caso de substituição.
     */
    if (window.jQuery)
    {
        var _jQuery = window.jQuery;
    }

    /**
     *
     */
    var jQuery = window.jQuery = function(selector, context)
    {
        /**
         * O objeto jQuery é na verdade apenas o construtor
         * init 'aprimorado'.
         */
        return new jQuery.prototype.init(selector, context);
    };

    /**
     * Mapeie sobre $ em caso de substituição.
     */
    if (window.$)
    {
        var _$ = window.$;
    }

    /**
     * Mapeie o namespace jQuery para o '$'.
     */
    window.$ = jQuery;

    /**
     * Uma maneira simples de verificar strings HTML ou strings
     * de ID (para as quais otimizamos).
     */
    var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/;

    /**
     * É um seletor simples.
     */
    var isSimple = /^.[^:#\[\.]*$/;

    /**
     *
     */
    jQuery.fn = jQuery.prototype = {
        /**
         *
         */
        init: function(selector, context)
        {
            /**
             * Certifique-se de que uma seleção foi fornecida.
             */
            selector = selector || document;

            /**
             * Handle $(DOMElement).
             */
            if (selector.nodeType)
            {
                this[0] = selector;
                this.length = 1;

                return this;

                /**
                 * Handle HTML strings.
                 */
            } else if (typeof selector == "string")
            {
                /**
                 * Estamos lidando com uma string HTML ou um ID ?
                 */
                var match = quickExpr.exec(selector);

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
                        selector = jQuery.clean([match[1]], context);
                    } else
                    {
                        /**
                         * HANDLE: $("#id").
                         */

                        /**
                         *
                         */
                        var elem = document.getElementById(match[3]);

                        /**
                         * Certifique-se de que um elemento foi localizado.
                         */
                        if (elem)
                        {
                            /**
                             * Lide com o caso em que o IE e o Opera retornam
                             * itens por nome em vez de ID.
                             */
                            if (elem.id != match[3])
                            {
                                return jQuery().find(selector);
                            } else
                            {
                                /**
                                 * Caso contrário, injetamos o elemento
                                 * diretamente no objeto jQuery.
                                 */

                                this[0] = elem;
                                this.length = 1;

                                return this;
                            }
                        } else
                        {
                            selector = [];
                        }
                    }

                    /**
                     * HANDLE: $(expr, [context]).
                     * (que é apenas equivalente a: $(content).find(expr).
                     */
                } else
                {
                    return new jQuery(context).find(selector);
                }

                /**
                 * HANDLE: $(function).
                 * Atalho para documento pronto.
                 */
            } else if (jQuery.isFunction(selector))
            {
                return new jQuery(document)[
                    jQuery.fn.ready ? "ready" : "load"
                ](selector);
            }

            return this.setArray(
                /**
                 * HANDLE: $(array).
                 */
                selector.constructor == Array && selector ||

                /**
                 * HANDLE: $(arraylike).
                 * Observe quando um objeto semelhante a um array,
                 * contendo nós DOM, é passado como o seletor.
                 */
                (selector.jquery || selector.length && selector != window && !selector.nodeType && selector[0] != undefined && selector[0].nodeType) && jQuery.makeArray( selector ) ||

                /**
                 * HANDLE: $(*).
                 */
                [selector]
            );
        },

        /**
         * A versão atual do jQuery em uso.
         */
        jquery: "1.2.2",

        /**
         * O número de elementos contidos no conjunto de elementos
         * correspondentes.
         */
        size: function()
        {
            return this.length;
        },

        /**
         * O número de elementos contidos no conjunto de elementos
         * correspondentes.
         */
        length: 0,

        /**
         * Obtenha o Nth elemento no conjunto de elementos correspondente
         * OU. Obtenha todo o elemento correspondente definido como um
         * vetor limpo.
         */
        get: function(num)
        {
            return num == undefined ?
                /**
                 * Retorna um vetor 'clean' (limpo ?).
                 */
                jQuery.makeArray(this) :

                /**
                 * Retorne apenas o objeto.
                 */
                this[num];
        },

        /**
         * Pegue um array de elementos e coloque-o na pilha (retornando
         * o novo conjunto de elementos correspondente).
         */
        pushStack: function(elems)
        {
            /**
             * Construa um novo conjunto de elementos correspondentes
             * do jQuery.
             */
            var ret = jQuery(elems);

            /**
             * Adicione o objeto antigo à pilha (como referência).
             */
            ret.prevObject = this;

            /**
             * Retorne o conjunto de elementos recém-formado.
             */
            return ret;
        },

        /**
         * Força o conjunto atual de elementos correspondentes
         * a se tornar o array de elementos especificado (destruindo
         * a pilha no processo). Você deve usar pushStack() para fazer
         * isso, mas mantenha a pilha.
         */
        setArray: function(elems)
        {
            /**
             * Redefinir o comprimento para 0 e usar o push de array
             * nativo é uma maneira super rápida de preencher um objeto
             * com propriedades semelhantes a array.
             */
            this.length = 0;

            /**
             *
             */
            Array.prototype.push.apply(this, elems);

            /**
             *
             */
            return this;
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
         * Determine a posição de um elemento dentro do conjunto
         * correspondente de elementos.
         */
        index: function(elem)
        {
            var ret = -1;

            /**
             * Localize a posição do elemento desejado.
             */
            this.each(function(i)
            {
                if (this == elem)
                {
                    ret = i;
                }
            });

            return ret;
        },

        /**
         *
         */
        attr: function(name, value, type)
        {
            var options = name;

            /**
             * Procure o caso em que estamos acessando um valor de estilo.
             */
            if (name.constructor == String)
            {
                if ( value == undefined )
                {
                    return this.length && jQuery[type || "attr"](this[0], name) || undefined;
                } else
                {
                    options = {};
                    options[name] = value;
                }
            }

            /**
             * Verifique se estamos definindo valores de estilo.
             */
            return this.each(function(i)
            {
                /**
                 * Defina todos os estilos.
                 */
                for (name in options)
                {
                    jQuery.attr(type ? this.style : this, name, jQuery.prop(this, options[name], type, i, name));
                }
            });
        },

        /**
         *
         */
        css: function(key, value)
        {
            /**
             * Ignore valores negativos de largura e altura.
             */
            if ((key == "width" || key == "height") && parseFloat(value) < 0)
            {
                value = undefined;
            }

            return this.attr(key, value, "curCSS");
        },

        /**
         *
         */
        text: function(text)
        {
            if (typeof text != "object" && text != null)
            {
                return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
            }

            var ret = "";
            jQuery.each(text || this, function()
            {
                jQuery.each(this.childNodes, function()
                {
                    if (this.nodeType != 8)
                    {
                        ret += this.nodeType != 1 ? this.nodeValue : jQuery.fn.text([this]);
                    }
                });
            });

            return ret;
        },

        /**
         *
         */
        wrapAll: function(html)
        {
            if (this[0])
            {
                /**
                 * Os elementos para envolver o alvo.
                 */
                jQuery(html, this[0].ownerDocument)
                    .clone()
                    .insertBefore(this[0])
                    .map(function()
                    {
                        var elem = this;

                        while (elem.firstChild)
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
            return this.each(function()
            {
                jQuery(this).contents().wrapAll(html);
            });
        },

        /**
         *
         */
        wrap: function(html)
        {
            return this.each(function()
            {
                jQuery(this).wrapAll(html);
            });
        },

        /**
         *
         */
        append: function()
        {
            return this.domManip(arguments, true, false, function(elem)
            {
                if (this.nodeType == 1)
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
            return this.domManip(arguments, true, true, function(elem)
            {
                if (this.nodeType == 1)
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
            return this.domManip(arguments, false, false, function(elem)
            {
                this.parentNode.insertBefore(elem, this);
            });
        },

        /**
         *
         */
        after: function()
        {
            return this.domManip(arguments, false, true, function(elem)
            {
                this.parentNode.insertBefore(elem, this.nextSibling);
            });
        },

        /**
         *
         */
        end: function()
        {
            return this.prevObject || jQuery([]);
        },

        /**
         *
         */
        find: function(selector)
        {
            var elems = jQuery.map(this, function(elem)
            {
                return jQuery.find(selector, elem);
            });

            /**
             *
             */
            return this.pushStack(/[^+>] [^+>]/.test(selector) || selector.indexOf("..") > -1 ? jQuery.unique(elems) : elems);
        },

        /**
         *
         */
        clone: function(events)
        {
            /**
             * Faça o clone.
             */
            var ret = this.map(function()
            {
                if (jQuery.browser.msie && !jQuery.isXMLDoc(this))
                {
                    /**
                     * O IE copia eventos vinculados via attachEvent ao usar
                     * cloneNode. Chamar detachEvent no clone também removerá
                     * os eventos do original. Para contornar isso, usamos
                     * innerHTML. Infelizmente, isso significa que algumas
                     * modificações em atributos no IE que são armazenados
                     * apenas como propriedades não serão copiadas (como o
                     * atributo name em uma entrada).
                     */
                    var clone = this.cloneNode(true),
                        container = document.createElement("div"),
                        container2 = document.createElement("div");

                    container.appendChild(clone);
                    container2.innerHTML = container.innerHTML;

                    return container2.firstChild;
                } else
                {
                    return this.cloneNode(true);
                }
            });

            /**
             * É necessário definir o expando como null no conjunto
             * clonado, se existir, removeData não funciona aqui, o
             * IE também o remove do original, isso é principalmente
             * para o IE, mas o expando de dados não deve ser copiado
             * em nenhum navegador.
             */
            var clone = ret.find("*").andSelf().each(function()
            {
                if (this[expando] != undefined)
                {
                    this[expando] = null;
                }
            });

            /**
             * Copie os eventos do original para o clone.
             */
            if (events === true)
            {
                this.find("*").andSelf().each(function(i)
                {
                    if (this.nodeType == 3)
                    {
                        return;
                    }

                    var events = jQuery.data(this, "events");
                    for (var type in events)
                    {
                        for (var handler in events[type])
                        {
                            jQuery.event.add(clone[i], type, events[type][handler], events[type][handler].data);
                        }
                    }
                });
            }

            /**
             * Devolva o conjunto clonado.
             */
            return ret;
        },

        /**
         *
         */
        filter: function(selector)
        {
            return this.pushStack(
                jQuery.isFunction(selector) &&
                jQuery.grep(this, function(elem, i)
                {
                    return selector.call(elem, i);
                }) || jQuery.multiFilter(selector, this)
            );
        },

        /**
         *
         */
        not: function(selector)
        {
            if (selector.constructor == String)
            {
                /**
                 * Teste o caso especial em que apenas um seletor é passado.
                 */
                if (isSimple.test(selector))
                {
                    return this.pushStack(jQuery.multiFilter(selector, this, true));
                } else
                {
                    selector = jQuery.multiFilter(selector, this);
                }
            }

            var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
            return this.filter(function()
            {
                return isArrayLike ? jQuery.inArray(this, selector) < 0 : this != selector;
            });
        },

        /**
         *
         */
        add: function(selector)
        {
            return !selector ? this : this.pushStack(jQuery.merge(this.get(), selector.constructor == String ? jQuery(selector).get() : selector.length != undefined && (!selector.nodeName || jQuery.nodeName(selector, "form")) ? selector : [selector]));
        },

        /**
         *
         */
        is: function(selector)
        {
            return selector ? jQuery.multiFilter(selector, this).length > 0 : false;
        },

        /**
         *
         */
        hasClass: function(selector)
        {
            return this.is("." + selector);
        },

        /**
         *
         */
        val: function(value)
        {
            if (value == undefined)
            {
                if (this.length)
                {
                    var elem = this[0];

                    /**
                     * Precisamos lidar com caixas de seleção especiais.
                     */
                    if (jQuery.nodeName(elem, "select"))
                    {
                        var index = elem.selectedIndex,
                            values = [],
                            options = elem.options,
                            one = elem.type == "select-one";

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
                        for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++)
                        {
                            var option = options[i];
                            if (option.selected)
                            {
                                /**
                                 * Obtenha o valor específico para a opção.
                                 */
                                value = jQuery.browser.msie && !option.attributes.value.specified ? option.text : option.value;

                                /**
                                 * Não precisamos de um array para uma seleção.
                                 */
                                if (one)
                                {
                                    return value;
                                }

                                /**
                                 * Multi-seleções retornam um array.
                                 */
                                values.push(value);
                            }
                        }

                        return values;

                        /**
                         * Todo o resto, apenas pegamos o valor.
                         */
                    } else
                    {
                        return (this[0].value || "").replace(/\r/g, "");
                    }
                }

                return undefined;
            }

            /**
             *
             */
            return this.each(function()
            {
                if (this.nodeType != 1)
                {
                    return;
                }

                if (value.constructor == Array && /radio|checkbox/.test(this.type))
                {
                    this.checked = (jQuery.inArray(this.value, value) >= 0 || jQuery.inArray(this.name, value) >= 0);
                } else if (jQuery.nodeName(this, "select"))
                {
                    var values = value.constructor == Array ? value : [value];

                    jQuery("option", this).each(function()
                    {
                        this.selected = (jQuery.inArray(this.value, values) >= 0 || jQuery.inArray(this.text, values) >= 0);
                    });

                    if (!values.length)
                    {
                        this.selectedIndex = -1;
                    }
                } else
                {
                    this.value = value;
                }
            });
        },

        /**
         *
         */
        html: function(value)
        {
            return value == undefined ? (this.length ? this[0].innerHTML : null) : this.empty().append(value);
        },

        /**
         *
         */
        replaceWith: function(value)
        {
            return this.after(value).remove();
        },

        /**
         *
         */
        eq: function(i)
        {
            return this.slice(i, i + 1);
        },

        /**
         *
         */
        slice: function()
        {
            return this.pushStack(
                Array.prototype.slice.apply(this, arguments)
            );
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
        andSelf: function()
        {
            return this.add(this.prevObject);
        },

        /**
         *
         */
        domManip: function(args, table, reverse, callback)
        {
            var clone = this.length > 1, elems; 

            return this.each(function()
            {
                if (!elems)
                {
                    elems = jQuery.clean(args, this.ownerDocument);

                    if (reverse)
                    {
                        elems.reverse();
                    }
                }

                var obj = this;
                if (table && jQuery.nodeName(this, "table") && jQuery.nodeName( elems[0], "tr"))
                {
                    obj = this.getElementsByTagName("tbody")[0] || this.appendChild( this.ownerDocument.createElement("tbody"));
                }

                var scripts = jQuery([]);
                jQuery.each(elems, function()
                {
                    var elem = clone ? jQuery(this).clone(true)[0] : this;

                    /**
                     * Execute todos os scripts após os elementos terem
                     * sido injetados.
                     */
                    if (jQuery.nodeName(elem, "script"))
                    {
                        scripts = scripts.add(elem);
                    } else
                    {
                        /**
                         * Remova quaisquer scripts internos para avaliação
                         * posterior.
                         */
                        if (elem.nodeType == 1)
                        {
                            scripts = scripts.add(
                                jQuery("script", elem).remove()
                            );
                        }

                        /**
                         * Injete os elementos no documento.
                         */
                        callback.call(obj, elem);
                    }
                });

                scripts.each(evalScript);
            });
        }
    };

    /**
     * Dê à função init o protótipo jQuery para instanciação
     * posterior.
     */
    jQuery.prototype.init.prototype = jQuery.prototype;

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
            jQuery.globalEval(elem.text || elem.textContent || elem.innerHTML || "");
        }

        if (elem.parentNode)
        {
            elem.parentNode.removeChild(elem);
        }
    }

    /**
     *
     */
    jQuery.extend = jQuery.fn.extend = function()
    {
        /**
         * Copiar referência para o objeto de destino.
         */
        var target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false,
            options;

        /**
         * Lide com uma situação de cópia profunda.
         */
        if (target.constructor == Boolean)
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
         * é uma string ou algo assim (possível em cópia profunda).
         */
        if (typeof target != "object" && typeof target != "function")
        {
            target = {};
        }

        /**
         * Estenda o próprio jQuery se apenas um argumento
         * for passado.
         */
        if (length == 1)
        {
            target = this;
            i = 0;
        }

        for (; i < length; i++)
        {
            /**
             * Lide apenas com valores non-null/undefined.
             */
            if ((options = arguments[i]) != null)
            {
                /**
                 * Estenda o objeto base.
                 */
                for (var name in options)
                {
                    /**
                     * Evite loop sem fim.
                     */
                    if (target === options[name])
                    {
                        continue;
                    }

                    /**
                     * Recurse se estivermos mesclando valores de objetos.
                     */
                    if (deep && options[name] && typeof options[name] == "object" && target[name] && !options[name].nodeType)
                    {
                        target[name] = jQuery.extend(target[name], options[name]);
                    } else if (options[name] != undefined)
                    {
                        /**
                         * Não traga valores indefinidos.
                         */

                        target[name] = options[name];
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
    var expando = "jQuery" + (new Date()).getTime(), uuid = 0, windowData = {};

    /**
     * Exclua as seguintes propriedades CSS para adicionar px.
     */
    var exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        noConflict: function(deep)
        {
            window.$ = _$;

            if (deep)
            {
                window.jQuery = _jQuery;
            }

            return jQuery;
        },

        /**
         * Consulte test/unit/core.js para obter detalhes
         * sobre esta função.
         */
        isFunction: function(fn)
        {
            return !!fn && typeof fn != "string" && !fn.nodeName && fn.constructor != Array && /function/i.test(fn + "");
        },

        /**
         * Verifique se um elemento está em um (ou é um)
         * documento XML.
         */
        isXMLDoc: function(elem)
        {
            return elem.documentElement && !elem.body || elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
        },

        /**
         * Avalia um script em um contexto global.
         */
        globalEval: function(data)
        {
            data = jQuery.trim(data);

            if (data)
            {
                /**
                 * Inspirado no código.
                 * http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html.
                 */
                var head = document.getElementsByTagName("head")[0] || document.documentElement,
                    script = document.createElement("script");
                    script.type = "text/javascript";

                if (jQuery.browser.msie)
                {
                    script.text = data;
                } else
                {
                    script.appendChild(document.createTextNode(data));
                }

                head.appendChild(script);
                head.removeChild(script);
            }
        },

        /**
         *
         */
        nodeName: function(elem, name)
        {
            return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
        },

        /**
         *
         */
        cache: {},

        /**
         *
         */
        data: function(elem, name, data)
        {
            elem = elem == window ?
                windowData :
                elem;

            var id = elem[expando];

            /**
             * Calcule um ID exclusivo para o elemento.
             */
            if (!id)
            {
                id = elem[expando] = ++uuid;
            }

            /**
             * Gere o cache de dados apenas se estivermos tentando
             * acessá-lo ou manipulá-lo.
             */
            if (name && !jQuery.cache[id])
            {
                jQuery.cache[id] = {};
            }

            /**
             * Evite substituir o cache nomeado por valores undefined.
             */
            if (data != undefined)
            {
                jQuery.cache[id][name] = data;
            }

            /**
             * Retorne os dados do cache nomeado ou o ID do elemento.
             */
            return name ? jQuery.cache[id][name] : id;
        },

        /**
         *
         */
        removeData: function(elem, name)
        {
            elem = elem == window ?
                windowData :
                elem;

            var id = elem[expando];

            /**
             * Retorne os dados do cache nomeado ou o ID do elemento.
             */
            if (name)
            {
                if (jQuery.cache[id])
                {
                    /**
                     * Remova a seção de dados do cache.
                     */
                    delete jQuery.cache[id][name];

                    /**
                     * Se removemos todos os dados, remova o cache
                     * do elemento.
                     */
                    name = "";

                    for (name in jQuery.cache[id])
                    {
                        break;
                    }

                    if (!name)
                    {
                        jQuery.removeData(elem);
                    }
                }

                /**
                 * Caso contrário, queremos remover todos os dados
                 * do elemento.
                 */
            } else
            {
                /**
                 * Limpe o elemento expando.
                 */
                try
                {
                    delete elem[expando];
                } catch(e)
                {
                    /**
                     * O IE tem problemas para remover diretamente o
                     * expando, mas não há problema em usar removeAttribute.
                     */
                    if (elem.removeAttribute)
                    {
                        elem.removeAttribute(expando);
                    }
                }

                /**
                 * Remova completamente o cache de dados.
                 */
                delete jQuery.cache[id];
            }
        },

        /**
         * args é apenas para uso interno.
         */
        each: function(object, callback, args)
        {
            if (args)
            {
                if (object.length == undefined)
                {
                    for (var name in object)
                    {
                        if (callback.apply(object[name], args) === false)
                        {
                            break;
                        }
                    }
                } else
                {
                    for (var i = 0, length = object.length; i < length; i++)
                    {
                        if (callback.apply(object[i], args) === false)
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
                if (object.length == undefined)
                {
                    for (var name in object)
                    {
                        if (callback.call(object[name], name, object[name]) === false)
                        {
                            break;
                        }
                    }
                } else
                {
                    for (var i = 0, length = object.length, value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i])
                    {
                    }
                }
            }

            return object;
        },

        /**
         *
         */
        prop: function(elem, value, type, i, name)
        {
            /**
             * Lidar com funções executáveis.
             */
            if (jQuery.isFunction(value))
            {
                value = value.call(elem, i);
            }

            /**
             * Manipular a passagem de um número para uma propriedade CSS.
             */
            return value && value.constructor == Number && type == "curCSS" && !exclude.test(name) ?
                value + "px" :
                value;
        },

        /**
         *
         */
        className: {
            /**
             * Somente interno, use addClass("class").
             */
            add: function(elem, classNames)
            {
                jQuery.each((classNames || "").split(/\s+/), function(i, className)
                {
                    if (elem.nodeType == 1 && !jQuery.className.has(elem.className, className))
                    {
                        elem.className += (elem.className ? " " : "") + className;
                    }
                });
            },

            /**
             * Somente interno, use removeClass("class").
             */
            remove: function(elem, classNames)
            {
                if (elem.nodeType == 1)
                {
                    elem.className = classNames != undefined ?
                        jQuery.grep(elem.className.split(/\s+/), function(className)
                        {
                            return !jQuery.className.has(classNames, className);
                        }).join(" ") : "";
                }
            },

            /**
             * Somente interno, use is(".class").
             */
            has: function(elem, className)
            {
                return jQuery.inArray(className, (elem.className || elem).toString().split(/\s+/)) > -1;
            }
        },

        /**
         * Um método para trocar rapidamente propriedades CSS de
         * entrada/saída para obter cálculos corretos.
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
            for (var name in options)
            {
                elem.style[name] = old[name];
            }
        },

        /**
         *
         */
        css: function(elem, name, force)
        {
            if (name == "width" || name == "height")
            {
                var val,
                    props = {
                        position: "absolute",
                        visibility: "hidden",
                        display:"block"
                    }, which = name == "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ];

                /**
                 *
                 */
                function getWH()
                {
                    val = name == "width" ? elem.offsetWidth : elem.offsetHeight;

                    var padding = 0, border = 0;
                    jQuery.each(which, function()
                    {
                        padding += parseFloat(jQuery.curCSS(elem, "padding" + this, true)) || 0;
                        border += parseFloat(jQuery.curCSS(elem, "border" + this + "Width", true)) || 0;
                    });

                    val -= Math.round(padding + border);
                }

                if (jQuery(elem).is(":visible"))
                {
                    getWH();
                } else
                {
                    jQuery.swap(elem, props, getWH);
                }

                return Math.max(0, val);
            }

            return jQuery.curCSS(elem, name, force);
        },

        /**
         *
         */
        curCSS: function(elem, name, force)
        {
            var ret;

            /**
             * Um método auxiliar para determinar se os valores
             * de um elemento estão com erros.
             */
            function color(elem)
            {
                if (!jQuery.browser.safari)
                {
                    return false;
                }

                /**
                 *
                 */
                var ret = document.defaultView.getComputedStyle(elem, null);

                /**
                 *
                 */
                return !ret || ret.getPropertyValue("color") == "";
            }

            /**
             * Precisamos lidar com a opacidade especial no IE.
             */
            if (name == "opacity" && jQuery.browser.msie)
            {
                ret = jQuery.attr(elem.style, "opacity");

                return ret == "" ?
                    "1" :
                    ret;
            }

            /**
             * Às vezes, o Opera dá uma resposta de exibição errada,
             * isso corrige o erro, consulte #2037.
             */
            if (jQuery.browser.opera && name == "display")
            {
                var save = elem.style.display;

                elem.style.display = "block";
                elem.style.display = save;
            }

            /**
             * Certifique-se de que estamos usando o nome correto
             * para obter o valor flutuante.
             */
            if (name.match(/float/i))
            {
                name = styleFloat;
            }

            if (!force && elem.style && elem.style[name])
            {
                ret = elem.style[name];
            } else if (document.defaultView && document.defaultView.getComputedStyle)
            {
                /**
                 * Apenas "float" é necessário aqui.
                 */
                if (name.match(/float/i))
                {
                    name = "float";
                }

                /**
                 *
                 */
                name = name.replace(/([A-Z])/g, "-$1").toLowerCase();

                /**
                 *
                 */
                var getComputedStyle = document.defaultView.getComputedStyle(elem, null);

                /**
                 *
                 */
                if (getComputedStyle && !color(elem))
                {
                    ret = getComputedStyle.getPropertyValue(name);
                } else
                {
                    /**
                     * Se o elemento não estiver relatando seus valores
                     * corretamente no Safari, alguns elementos `display: none`
                     * estão envolvidos.
                     */

                    var swap = [],
                        stack = [];

                    /**
                     * Localize todos os elementos `display: none` pai.
                     */
                    for (var a = elem; a && color(a); a = a.parentNode)
                    {
                        stack.unshift(a);
                    }

                    /**
                     * Percorra e torne-os visíveis, mas ao contrário (seria
                     * melhor se soubéssemos o tipo exato de exibição que eles
                     * tem).
                     */
                    for (var i = 0; i < stack.length; i++)
                    {
                        if (color(stack[i]))
                        {
                            swap[i] = stack[i].style.display;
                            stack[i].style.display = "block";
                        }
                    }

                    /**
                     * Como invertemos o estilo de exibição, temos que
                     * lidar com esse estilo especial, caso contrário,
                     * obteremos o valor.
                     */
                    ret = name == "display" && swap[stack.length - 1] != null ? "none" : (getComputedStyle && getComputedStyle.getPropertyValue(name)) || "";

                    /**
                     * Finalmente, reverta os estilos de exibição.
                     */
                    for (var i = 0; i < swap.length; i++)
                    {
                        if (swap[i] != null)
                        {
                            stack[i].style.display = swap[i];
                        }
                    }
                }

                /**
                 * Devemos sempre obter um número de volta da opacidade.
                 */
                if (name == "opacity" && ret == "")
                {
                    ret = "1";
                }
            } else if (elem.currentStyle)
            {
                var camelCase = name.replace(/\-(\w)/g, function(all, letter)
                {
                    return letter.toUpperCase();
                });

                /**
                 *
                 */
                ret = elem.currentStyle[name] || elem.currentStyle[camelCase];

                /**
                 * Do incrível hack.
                 * http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291.
                 */

                /**
                 * Se não estivermos lidando com um número de pixels
                 * normal, mas com um número que tem um final estranho,
                 * precisamos convertê-lo em pixels.
                 */
                if (!/^\d+(px)?$/i.test(ret) && /^\d/.test(ret))
                {
                    /**
                     * Lembre-se dos valores originais.
                     */
                    var style = elem.style.left,
                        runtimeStyle = elem.runtimeStyle.left;

                    /**
                     * Insira os novos valores para obter um valor calculado.
                     */
                    elem.runtimeStyle.left = elem.currentStyle.left;
                    elem.style.left = ret || 0;
                    ret = elem.style.pixelLeft + "px";

                    /**
                     * Reverta os valores alterados.
                     */
                    elem.style.left = style;
                    elem.runtimeStyle.left = runtimeStyle;
                }
            }

            return ret;
        },

        /**
         *
         */
        clean: function(elems, context)
        {
            var ret = [];

            /**
             *
             */
            context = context || document;

            /**
             * !context.createElement falha no IE com um erro,
             * mas retorna typeof 'object'.
             */
            if (typeof context.createElement == "undefined")
            {
                context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
            }

            /**
             *
             */
            jQuery.each(elems, function(i, elem)
            {
                if (!elem)
                {
                    return;
                }

                if (elem.constructor == Number)
                {
                    elem = elem.toString();
                }

                /**
                 * Converta string HTML em nós DOM.
                 */
                if (typeof elem == "string")
                {
                    /**
                     * Corrija tags de estilo "XHTML" em todos os navegadores.
                     */
                    elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag)
                    {
                        return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ? all : front + "></" + tag + ">";
                    });

                    /**
                     * Corte os espaços em branco, caso contrário, indexOf
                     * não funcionará conforme o esperado.
                     */
                    var tags = jQuery.trim(elem).toLowerCase(),
                        div = context.createElement("div");

                    /**
                     *
                     */
                    var wrap =
                        /**
                         * option ou optgroup.
                         */
                        !tags.indexOf("<opt") &&
                        [ 1, "<select multiple='multiple'>", "</select>" ] ||

                        !tags.indexOf("<leg") &&
                        [ 1, "<fieldset>", "</fieldset>" ] ||

                        tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
                        [ 1, "<table>", "</table>" ] ||

                        !tags.indexOf("<tr") &&
                        [ 2, "<table><tbody>", "</tbody></table>" ] ||

                        /**
                         * <thead> correspondido acima.
                         */
                        (!tags.indexOf("<td") || !tags.indexOf("<th")) &&
                        [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||

                        !tags.indexOf("<col") &&
                        [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||

                        /**
                         * O IE não pode serializar as tags <link> e
                         * <script> normalmente;
                         */
                        jQuery.browser.msie &&
                        [ 1, "div<div>", "</div>" ] ||

                        [ 0, "", "" ];

                    /**
                     * Vá para html e volte, depois retire os wrappers extras.
                     */
                    div.innerHTML = wrap[1] + elem + wrap[2];

                    /**
                     * Mova-se para a profundidade certa.
                     */
                    while (wrap[0]--)
                    {
                        div = div.lastChild;
                    }

                    /**
                     * Remova o <tbody> inserido automaticamente do
                     * IE dos fragmentos da tabela.
                     */
                    if (jQuery.browser.msie)
                    {
                        /**
                         * String era uma <table>, *pode* ter <tbody>.
                         */
                        var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ?
                            div.firstChild && div.firstChild.childNodes :

                            /**
                             * String tem um <thead> ou <tfoot> simples.
                             */
                            wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ?
                                div.childNodes :
                                [];

                        for (var j = tbody.length - 1; j >= 0 ; --j)
                        {
                            if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length)
                            {
                                tbody[j].parentNode.removeChild(tbody[j]);
                            }
                        }

                        /**
                         * O IE elimina completamente os espaços em branco
                         * iniciais quando innerHTML é usado.
                         */
                        if (/^\s/.test(elem))
                        {
                            div.insertBefore(
                                context.createTextNode(elem.match(/^\s*/)[0]),
                                div.firstChild
                            );
                        }
                    }

                    elem = jQuery.makeArray(div.childNodes);
                }

                if (elem.length === 0 && (!jQuery.nodeName(elem, "form") && !jQuery.nodeName(elem, "select")))
                {
                    return;
                }

                if (elem[0] == undefined || jQuery.nodeName(elem, "form") || elem.options)
                {
                    ret.push(elem);
                } else
                {
                    ret = jQuery.merge(ret, elem);
                }
            });

            return ret;
        },

        /**
         *
         */
        attr: function(elem, name, value)
        {
            /**
             * Não defina atributos em nós de texto e comentários.
             */
            if (!elem || elem.nodeType == 3 || elem.nodeType == 8)
            {
                return undefined;
            }

            /**
             *
             */
            var fix = jQuery.isXMLDoc(elem) ? {} : jQuery.props;

            /**
             * O Safari informa incorretamente a propriedade
             * selecionada padrão de uma opção oculta. Acessar
             * a propriedade selectedIndex da camada alta
             * corrige o erro.
             */
            if (name == "selected" && jQuery.browser.safari)
            {
                elem.parentNode.selectedIndex;
            }

            /**
             * Certos atributos só funcionam quando acessados
             * pelo antigo modo DOM 0.
             */
            if (fix[name])
            {
                if (value != undefined)
                {
                    elem[fix[name]] = value;
                }

                return elem[fix[name]];
            } else if (jQuery.browser.msie && name == "style")
            {
                return jQuery.attr(elem.style, "cssText", value);
            } else if (value == undefined && jQuery.browser.msie && jQuery.nodeName(elem, "form") && (name == "action" || name == "method"))
            {
                return elem.getAttributeNode(name).nodeValue;
            } else if (elem.tagName)
            {
                /**
                 * IE elem.getAttribute passa até para estilo.
                 */

                if (value != undefined)
                {
                    /**
                     * Não podemos permitir que a propriedade type seja
                     * alterada (pois causa problemas no IE).
                     */
                    if (name == "type" && jQuery.nodeName(elem, "input") && elem.parentNode)
                    {
                        throw "type property can't be changed";
                    }

                    /**
                     * Converta o valor em uma string (todos os navegadores
                     * fazem isso, exceto o IE), consulte #1070.
                     */
                    elem.setAttribute(name, "" + value);
                }

                if (jQuery.browser.msie && /href|src/.test(name) && !jQuery.isXMLDoc(elem))
                {
                    return elem.getAttribute(name, 2);
                }

                return elem.getAttribute(name);

                /**
                 * Elem é na verdade elem.style ... defina o estilo.
                 */
            } else
            {
                /**
                 * Na verdade, o IE usa filtros para opacidade.
                 */
                if (name == "opacity" && jQuery.browser.msie)
                {
                    if (value != undefined)
                    {
                        /**
                         * O IE tem problemas com opacidade se não tiver
                         * layout. Force-o definindo o nível de zoom.
                         */
                        elem.zoom = 1; 

                        /**
                         * Defina o filtro alfa para definir a opacidade.
                         */
                        elem.filter = (elem.filter || "").replace(/alpha\([^)]*\)/, "") + (parseFloat(value).toString() == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
                    }

                    /**
                     *
                     */
                    return elem.filter && elem.filter.indexOf("opacity=") >= 0 ? (parseFloat( elem.filter.match(/opacity=([^)]*)/)[1]) / 100).toString() : "";
                }

                /**
                 *
                 */
                name = name.replace(/-([a-z])/ig, function(all, letter)
                {
                    return letter.toUpperCase();
                });

                if (value != undefined)
                {
                    elem[name] = value;
                }

                return elem[name];
            }
        },

        /**
         *
         */
        trim: function(text)
        {
            return (text || "").replace(/^\s+|\s+$/g, "");
        },

        /**
         *
         */
        makeArray: function(array)
        {
            var ret = [];

            /**
             * É necessário usar typeof para combater travamentos
             * de childNodes do Safari.
             */
            if (typeof array != "array")
            {
                for (var i = 0, length = array.length; i < length; i++)
                {
                    ret.push(array[i]);
                }
            } else
            {
                ret = array.slice(0);
            }

            return ret;
        },

        /**
         *
         */
        inArray: function(elem, array)
        {
            for (var i = 0, length = array.length; i < length; i++)
            {
                if (array[i] == elem)
                {
                    return i;
                }
            }

            return -1;
        },

        /**
         *
         */
        merge: function(first, second)
        {
            /**
             * Temos que fazer um loop dessa maneira porque o IE
             * e o Opera substituem o comprimento expando de
             * getElementsByTagName.
             */

            /**
             * Além disso, precisamos ter certeza de que os elementos
             * corretos estão sendo retornados. (O IE retorna nós de
             * comentários em uma consulta '*').
             */
            if (jQuery.browser.msie)
            {
                for (var i = 0; second[i]; i++)
                {
                    if (second[i].nodeType != 8)
                    {
                        first.push(second[i]);
                    }
                }
            } else
            {
                for (var i = 0; second[i]; i++)
                {
                    first.push(second[i]);
                }
            }

            return first;
        },

        /**
         *
         */
        unique: function(array)
        {
            var ret = [],
                done = {};

            try
            {
                for (var i = 0, length = array.length; i < length; i++)
                {
                    var id = jQuery.data(array[i]);

                    if (!done[id])
                    {
                        done[id] = true;
                        ret.push(array[i]);
                    }
                }
            } catch(e)
            {
                ret = array;
            }

            return ret;
        },

        /**
         *
         */
        grep: function(elems, callback, inv)
        {
            /**
             * Se uma string for passada para a função, crie uma
             * função para ela (um atalho útil).
             */
            if (typeof callback == "string")
            {
                callback = eval("false||function(a,i){return " + callback + "}");
            }

            /**
             *
             */
            var ret = [];

            /**
             * Percorra o array, salvando apenas os itens que passam
             * na função validadora.
             */
            for (var i = 0, length = elems.length; i < length; i++)
            {
                if (!inv && callback(elems[i], i) || inv && !callback(elems[i], i))
                {
                    ret.push(elems[i]);
                }
            }

            return ret;
        },

        /**
         *
         */
        map: function(elems, callback)
        {
            var ret = [];

            /**
             * Percorra o vetor, traduzindo cada um dos itens para
             * seu novo valor (ou valores).
             */
            for (var i = 0, length = elems.length; i < length; i++)
            {
                var value = callback(elems[i], i);
                if (value !== null && value != undefined)
                {
                    if (value.constructor != Array)
                    {
                        value = [value];
                    }

                    ret = ret.concat(value);
                }
            }

            return ret;
        }
    });

    /**
     *
     */
    var userAgent = navigator.userAgent.toLowerCase();

    /**
     * Descubra qual navegador está sendo usado.
     */
    jQuery.browser = {
        version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
        safari: /webkit/.test( userAgent ),
        opera: /opera/.test( userAgent ),
        msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
        mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
    };

    /**
     *
     */
    var styleFloat = jQuery.browser.msie ?
        "styleFloat" :
        "cssFloat";

    /**
     *
     */
    jQuery.extend({
        /**
         * Verifique se o modelo de caixa W3C está sendo usado.
         */
        boxModel: !jQuery.browser.msie || document.compatMode == "CSS1Compat",

        /**
         *
         */
        props: {
            "for": "htmlFor",
            "class": "className",
            "float": styleFloat,

            cssFloat: styleFloat,
            styleFloat: styleFloat,
            innerHTML: "innerHTML",
            className: "className",
            value: "value",
            disabled: "disabled",
            checked: "checked",
            readonly: "readOnly",
            selected: "selected",
            maxlength: "maxLength",
            selectedIndex: "selectedIndex",
            defaultValue: "defaultValue",
            tagName: "tagName",
            nodeName: "nodeName"
        }
    });

    /**
     *
     */
    jQuery.each({
        parent: "elem.parentNode",
        parents: "jQuery.dir(elem,'parentNode')",
        next: "jQuery.nth(elem,2,'nextSibling')",
        prev: "jQuery.nth(elem,2,'previousSibling')",
        nextAll: "jQuery.dir(elem,'nextSibling')",
        prevAll: "jQuery.dir(elem,'previousSibling')",
        siblings: "jQuery.sibling(elem.parentNode.firstChild,elem)",
        children: "jQuery.sibling(elem.firstChild)",
        contents: "jQuery.nodeName(elem,'iframe')?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes)"
    }, function(name, fn)
    {
        fn = eval("false||function(elem){return " + fn + "}");

        jQuery.fn[name] = function(selector)
        {
            var ret = jQuery.map(this, fn);

            if (selector && typeof selector == "string")
            {
                ret = jQuery.multiFilter(selector, ret);
            }

            return this.pushStack(
                jQuery.unique(ret)
            );
        };
    });

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
        jQuery.fn[name] = function()
        {
            var args = arguments;
            return this.each(function()
            {
                for (var i = 0, length = args.length; i < length; i++)
                {
                    jQuery(args[i])[original](this);
                }
            });
        };
    });

    /**
     *
     */
    jQuery.each({
        /**
         *
         */
        removeAttr: function(name)
        {
            jQuery.attr(this, name, "");

            if (this.nodeType == 1)
            {
                this.removeAttribute(name);
            }
        },

        /**
         *
         */
        addClass: function(classNames)
        {
            jQuery.className.add(this, classNames);
        },

        /**
         *
         */
        removeClass: function(classNames)
        {
            jQuery.className.remove(this, classNames);
        },

        /**
         *
         */
        toggleClass: function(classNames)
        {
            jQuery.className[
                jQuery.className.has(this, classNames) ? "remove" : "add"
            ](this, classNames);
        },

        /**
         *
         */
        remove: function(selector)
        {
            if (!selector || jQuery.filter(selector, [this]).r.length)
            {
                /**
                 * Evite vazamentos de memória.
                 */
                jQuery("*", this).add(this).each(function()
                {
                    jQuery.event.remove(this);
                    jQuery.removeData(this);
                });

                if (this.parentNode)
                {
                    this.parentNode.removeChild(this);
                }
            }
        },

        /**
         *
         */
        empty: function()
        {
            /**
             * Remova nós de elementos e evite vazamentos de memória.
             */
            jQuery(">*", this).remove();

            /**
             * Remova todos os nós restantes.
             */
            while (this.firstChild)
            {
                this.removeChild(this.firstChild);
            }
        }
    }, function(name, fn)
    {
        jQuery.fn[name] = function()
        {
            return this.each(fn, arguments);
        };
    });

    /**
     *
     */
    jQuery.each(["Height", "Width"], function(i, name)
    {
        var type = name.toLowerCase();

        jQuery.fn[type] = function(size)
        {
            /**
             * Obtenha a largura ou altura da janela.
             */
            return this[0] == window ?
                /**
                 * O Opera reporta document.body.client[Width/Height]
                 * corretamente tanto em peculiaridades quanto em
                 * padrões.
                 */
                jQuery.browser.opera && document.body["client" + name] ||

                /**
                 * O Safari reporta [Width/Height] perfeitamente (Mozilla
                 * e Opera incluem larguras de barra de rolagem).
                 */
                jQuery.browser.safari && window["inner" + name] ||

                /**
                 * Todos os outros usam document.documentElement ou
                 * document.body dependendo do modo Quirks vs
                 * Standards.
                 */
                document.compatMode == "CSS1Compat" && document.documentElement["client" + name] || document.body["client" + name] :

                /**
                 * Obtenha a largura ou altura do documento.
                 */
                this[0] == document ?
                    /**
                     * Role [Width/Height] ou desloque [Width/Height],
                     * o que for maior.
                     */
                    Math.max(
                        Math.max(document.body["scroll" + name], document.documentElement["scroll" + name]),
                        Math.max(document.body["offset" + name], document.documentElement["offset" + name])
                    ) :

                    /**
                     * Obtenha ou defina a largura ou altura do elemento.
                     */
                    size == undefined ?
                        /**
                         * Obtenha a largura ou altura do elemento.
                         */
                        (this.length ? jQuery.css(this[0], type) : null) :

                        /**
                         * Defina o width ou height do elemento (o padrão
                         * é pixels se o valor não tiver unidade).
                         */
                        this.css(type, size.constructor == String ? size : size + "px");
        };
    });

    /**
     *
     */
    var chars = jQuery.browser.safari && parseInt(jQuery.browser.version) < 417 ? "(?:[\\w*_-]|\\\\.)" : "(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",
        quickChild = new RegExp("^>\\s*(" + chars + "+)"),
        quickID = new RegExp("^(" + chars + "+)(#)(" + chars + "+)"),
        quickClass = new RegExp("^([#.]?)(" + chars + "*)");

    /**
     *
     */
    jQuery.extend({
        expr: {
            "": "m[2]=='*'||jQuery.nodeName(a,m[2])",
            "#": "a.getAttribute('id')==m[2]",
            ":": {
                /**
                 * Verificações de posição.
                 */
                lt: "i<m[3]-0",
                gt: "i>m[3]-0",
                nth: "m[3]-0==i",
                eq: "m[3]-0==i",
                first: "i==0",
                last: "i==r.length-1",
                even: "i%2==0",
                odd: "i%2",

                /**
                 * Verificações de crianças.
                 */
                "first-child": "a.parentNode.getElementsByTagName('*')[0]==a",
                "last-child": "jQuery.nth(a.parentNode.lastChild,1,'previousSibling')==a",
                "only-child": "!jQuery.nth(a.parentNode.lastChild,2,'previousSibling')",

                /**
                 * Verificações dos pais.
                 */
                parent: "a.firstChild",
                empty: "!a.firstChild",

                /**
                 * Verificação de texto.
                 */
                contains: "(a.textContent||a.innerText||jQuery(a).text()||'').indexOf(m[3])>=0",

                /**
                 * Visibilidade.
                 */
                visible: '"hidden"!=a.type&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden"',
                hidden: '"hidden"==a.type||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden"',

                /**
                 * Atributos do formulário.
                 */
                enabled: "!a.disabled",
                disabled: "a.disabled",
                checked: "a.checked",
                selected: "a.selected||jQuery.attr(a,'selected')",

                /**
                 * Elementos de formulário.
                 */
                text: "'text'==a.type",
                radio: "'radio'==a.type",
                checkbox: "'checkbox'==a.type",
                file: "'file'==a.type",
                password: "'password'==a.type",
                submit: "'submit'==a.type",
                image: "'image'==a.type",
                reset: "'reset'==a.type",
                button: '"button"==a.type||jQuery.nodeName(a,"button")',
                input: "/input|select|textarea|button/i.test(a.nodeName)",

                /**
                 * :has().
                 */
                has: "jQuery.find(m[3],a).length",

                /**
                 * :header.
                 */
                header: "/h\\d/i.test(a.nodeName)",

                /**
                 * :animated.
                 */
                animated: "jQuery.grep(jQuery.timers,function(fn){return a==fn.elem;}).length"
            }
        },

        /**
         * As expressões regulares que alimentam o mecanismo
         * de análise.
         */
        parse: [
            /**
             * Corresponder: [@value='test'], [@foo].
             */
            /^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,

            /**
             * Corresponder: :contains('foo').
             */
            /^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,

            /**
             * Corresponder: :even, :last-chlid, #id, .class.
             */
            new RegExp("^([:.#]*)(" + chars + "+)")
        ],

        /**
         *
         */
        multiFilter: function(expr, elems, not)
        {
            var old, cur = [];

            while (expr && expr != old)
            {
                old = expr;
                var f = jQuery.filter(expr, elems, not);

                expr = f.t.replace(/^\s*,\s*/, "");
                cur = not ? elems = f.r : jQuery.merge(cur, f.r);
            }

            return cur;
        },

        /**
         *
         */
        find: function(t, context)
        {
            /**
             * Lide rapidamente com expressões sem string.
             */
            if (typeof t != "string")
            {
                return [t];
            }

            /**
             * Verifique se o contexto é um elemento DOM ou
             * um documento.
             */
            if (context && context.nodeType != 1 && context.nodeType != 9)
            {
                return [
                ];
            }

            /**
             * Defina o contexto correto (se nenhum for fornecido).
             */
            context = context || document;

            /**
             * Inicialize a busca.
             */
            var ret = [context],
                done = [],
                last,
                nodeName;

            /**
             * Continue enquanto existir uma expressão seletora e
             * enquanto não estivermos mais repetindo sobre nós
             * mesmos.
             */
            while (t && last != t)
            {
                var r = [];
                last = t;

                t = jQuery.trim(t);

                var foundToken = false;

                /**
                 * Uma tentativa de acelerar seletores filhos que
                 * apontam para uma tag de elemento específica.
                 */
                var re = quickChild;
                var m = re.exec(t);

                if (m)
                {
                    nodeName = m[1].toUpperCase();

                    /**
                     * Execute nossa própria iteração e filtro.
                     */
                    for (var i = 0; ret[i]; i++)
                    {
                        for (var c = ret[i].firstChild; c; c = c.nextSibling)
                        {
                            if (c.nodeType == 1 && (nodeName == "*" || c.nodeName.toUpperCase() == nodeName))
                            {
                                r.push(c);
                            }
                        }
                    }

                    ret = r;
                    t = t.replace( re, "" );

                    if (t.indexOf(" ") == 0)
                    {
                        continue;
                    }

                    foundToken = true;
                } else
                {
                    re = /^([>+~])\s*(\w*)/i;

                    if ((m = re.exec(t)) != null)
                    {
                        r = [];

                        var merge = {};
                        nodeName = m[2].toUpperCase();
                        m = m[1];

                        for (var j = 0, rl = ret.length; j < rl; j++)
                        {
                            var n = m == "~" || m == "+" ? ret[j].nextSibling : ret[j].firstChild;
                            for (; n; n = n.nextSibling)
                            {
                                if (n.nodeType == 1)
                                {
                                    var id = jQuery.data(n);

                                    if (m == "~" && merge[id])
                                    {
                                        break;
                                    }

                                    if (!nodeName || n.nodeName.toUpperCase() == nodeName)
                                    {
                                        if (m == "~")
                                        {
                                            merge[id] = true;
                                        }

                                        r.push(n);
                                    }

                                    if (m == "+")
                                    {
                                        break;
                                    }
                                }
                            }
                        }

                        /**
                         *
                         */
                        ret = r;

                        /**
                         * E remova o token.
                         */
                        t = jQuery.trim(t.replace(re, ""));
                        foundToken = true;
                    }
                }

                /**
                 * Veja se ainda existe uma expressão e se ainda não
                 * combinamos um token.
                 */
                if (t && !foundToken)
                {
                    /**
                     * Lidar com múltiplas expressões.
                     */
                    if (!t.indexOf(","))
                    {
                        /**
                         * Limpe o conjunto de resultados.
                         */
                        if (context == ret[0])
                        {
                            ret.shift();
                        }

                        /**
                         * Mesclar os conjuntos de resultados.
                         */
                        done = jQuery.merge(done, ret);

                        /**
                         * Redefina o contexto.
                         */
                        r = ret = [context];

                        /**
                         * Retoque a sequência do seletor.
                         */
                        t = " " + t.substr(1, t.length);
                    } else
                    {
                        /**
                         * Otimize para o caso nodeName#idName.
                         */
                        var re2 = quickID;
                        var m = re2.exec(t);

                        /**
                         * Reorganize os resultados para que sejam consistentes.
                         */
                        if (m)
                        {
                            m = [0, m[2], m[3], m[1]];
                        } else
                        {
                            /**
                             * Caso contrário, faça uma verificação de filtro
                             * tradicional para seletores de ID, classe e
                             * elemento.
                             */
                            re2 = quickClass;
                            m = re2.exec(t);
                        }

                        /**
                         *
                         */
                        m[2] = m[2].replace(/\\/g, "");

                        /**
                         *
                         */
                        var elem = ret[ret.length - 1];

                        /**
                         * Tente fazer uma busca global por ID, sempre que
                         * possível.
                         */
                        if (m[1] == "#" && elem && elem.getElementById && !jQuery.isXMLDoc(elem))
                        {
                            /**
                             * Otimização para caso de documento HTML.
                             */
                            var oid = elem.getElementById(m[2]);

                            /**
                             * Faça uma verificação rápida para a existência
                             * do atributo ID real para evitar a seleção pelo
                             * atributo name no IE e verifique também para
                             * garantir que id é uma string para evitar a
                             * seleção de um elemento com o nome 'id' dentro
                             * de um formulário.
                             */
                            if ((jQuery.browser.msie||jQuery.browser.opera) && oid && typeof oid.id == "string" && oid.id != m[2])
                            {
                                oid = jQuery('[@id="'+m[2]+'"]', elem)[0];
                            }

                            /**
                             * Faça uma verificação rápida do nome do nó (quando
                             * aplicável) para que as pesquisas div#foo sejam
                             * realmente rápidas.
                             */
                            ret = r = oid && (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : [];
                        } else
                        {
                            /**
                             * Precisamos encontrar todos os elementos
                             * descendentes.
                             */
                            for (var i = 0; ret[i]; i++)
                            {
                                /**
                                 * Pegue o nome da tag que está sendo pesquisada.
                                 */
                                var tag = m[1] == "#" && m[3] ? m[3] : m[1] != "" || m[0] == "" ? "*" : m[2];

                                /**
                                 * Lide com o IE7 sendo realmente complexo
                                 * sobre <object>s.
                                 */
                                if (tag == "*" && ret[i].nodeName.toLowerCase() == "object")
                                {
                                    tag = "param";
                                }

                                r = jQuery.merge(r, ret[i].getElementsByTagName(tag));
                            }

                            /**
                             * É mais rápido filtrar por classe e pronto.
                             */
                            if (m[1] == ".")
                            {
                                r = jQuery.classFilter(r, m[2]);
                            }

                            /**
                             * O mesmo acontece com a filtragem de ID.
                             */
                            if (m[1] == "#")
                            {
                                var tmp = [];

                                /**
                                 * Tente encontrar o elemento com o ID.
                                 */
                                for (var i = 0; r[i]; i++)
                                {
                                    if (r[i].getAttribute("id") == m[2])
                                    {
                                        tmp = [r[i]];
                                        break;
                                    }
                                }

                                r = tmp;
                            }

                            ret = r;
                        }

                        t = t.replace(re2, "");
                    }
                }

                /**
                 * Se uma string seletora ainda existir.
                 */
                if (t)
                {
                    /**
                     * Tente filtrá-lo.
                     */
                    var val = jQuery.filter(t, r);
                        ret = r = val.r;

                    t = jQuery.trim(val.t);
                }
            }

            /**
             * Ocorreu um erro com o seletor; apenas retorne um
             * conjunto vazio.
             */
            if (t)
            {
                ret = [];
            }

            /**
             * Remova o contexto raiz.
             */
            if (ret && context == ret[0])
            {
                ret.shift();
            }

            /**
             * E combine os resultados.
             */
            done = jQuery.merge(done, ret);

            return done;
        },

        /**
         *
         */
        classFilter: function(r, m, not)
        {
            m = " " + m + " ";

            var tmp = [];
            for (var i = 0; r[i]; i++)
            {
                var pass = (" " + r[i].className + " ").indexOf(m) >= 0;

                if (!not && pass || not && !pass)
                {
                    tmp.push(r[i]);
                }
            }

            return tmp;
        },

        /**
         *
         */
        filter: function(t, r, not)
        {
            var last;

            /**
             * Procure expressões de filtro comuns.
             */
            while (t && t != last)
            {
                last = t;

                var p = jQuery.parse, m;
                for (var i = 0; p[i]; i++)
                {
                    m = p[i].exec(t);

                    if (m)
                    {
                        /**
                         * Remova o que acabamos de combinar.
                         */
                        t = t.substring(m[0].length);

                        m[2] = m[2].replace(/\\/g, "");
                        break;
                    }
                }

                /**
                 *
                 */
                if (!m)
                {
                    break;
                }

                /**
                 * :not() é um caso especial que pode ser otimizado
                 * mantendo-o fora da lista de expressões.
                 */
                if ( m[1] == ":" && m[2] == "not" )
                {
                    /**
                     * Otimizar se apenas um seletor for encontrado (caso
                     * mais comum).
                     */
                    r = isSimple.test(m[3]) ?
                        jQuery.filter(m[3], r, true).r :
                        jQuery(r).not(m[3]);
                } else if (m[1] == ".")
                {
                    /**
                     * Podemos obter um grande aumento de velocidade
                     * filtrando por classe aqui.
                     */

                    r = jQuery.classFilter(r, m[2], not);
                } else if (m[1] == "[")
                {
                    var tmp = [], type = m[3];

                    for (var i = 0, rl = r.length; i < rl; i++)
                    {
                        var a = r[i],
                            z = a[jQuery.props[m[2]] || m[2]];

                        if (z == null || /href|src|selected/.test(m[2]))
                        {
                            z = jQuery.attr(a,m[2]) || '';
                        }

                        if ((type == "" && !!z || type == "=" && z == m[5] || type == "!=" && z != m[5] || type == "^=" && z && !z.indexOf(m[5]) || type == "$=" && z.substr(z.length - m[5].length) == m[5] || (type == "*=" || type == "~=") && z.indexOf(m[5]) >= 0) ^ not)
                        {
                            tmp.push(a);
                        }
                    }

                    r = tmp;

                    /**
                     * Podemos obter um aumento de velocidade lidando com
                     * o nth-child aqui.
                     */
                } else if (m[1] == ":" && m[2] == "nth-child")
                {
                    var merge = {},
                        tmp = [],

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
                        test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(m[3] == "even" && "2n" || m[3] == "odd" && "2n+1" || !/\D/.test(m[3]) && "0n+" + m[3] || m[3]),

                        /**
                         * Calcule os números (first)n+(last) inclusive
                         * se forem negativos.
                         */
                        first = (test[1] + (test[2] || 1)) - 0, last = test[3] - 0;

                    /**
                     * Percorrer todos os elementos deixados no objeto jQuery.
                     */
                    for (var i = 0, rl = r.length; i < rl; i++)
                    {
                        var node = r[i],
                            parentNode = node.parentNode,
                            id = jQuery.data(parentNode);

                        if (!merge[id])
                        {
                            var c = 1;
                            for (var n = parentNode.firstChild; n; n = n.nextSibling)
                            {
                                if (n.nodeType == 1)
                                {
                                    n.nodeIndex = c++;
                                }
                            }

                            merge[id] = true;
                        }

                        var add = false;
                        if (first == 0)
                        {
                            if (node.nodeIndex == last)
                            {
                                add = true;
                            }
                        } else if ((node.nodeIndex - last) % first == 0 && (node.nodeIndex - last) / first >= 0)
                        {
                            add = true;
                        }

                        if (add ^ not)
                        {
                            tmp.push(node);
                        }
                    }

                    r = tmp;

                    /**
                     * Caso contrário, encontre a expressão a ser executada.
                     */
                } else
                {
                    var f = jQuery.expr[m[1]];
                    if (typeof f != "string")
                    {
                        f = jQuery.expr[m[1]][m[2]];
                    }

                    /**
                     * Crie uma macro personalizada para incluí-la.
                     */
                    f = eval("false||function(a,i){return " + f + "}");

                    /**
                     * Execute-o no filtro atual.
                     */
                    r = jQuery.grep(r, f, not);
                }
            }

            /**
             * Retorna um vetor de elementos filtrados (r)
             * e a string de expressão modificada (t).
             */
            return {
                r: r,
                t: t
            };
        },

        /**
         *
         */
        dir: function(elem, dir)
        {
            var matched = [];
            var cur = elem[dir];

            while (cur && cur != document)
            {
                if (cur.nodeType == 1)
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
                if (cur.nodeType == 1 && ++num == result)
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
                if (n.nodeType == 1 && (!elem || n != elem))
                {
                    r.push(n);
                }
            }

            return r;
        }
    });

    /**
     * Diversas funções auxiliares usadas para gerenciar
     * eventos. Muitas das ideias por trás deste código
     * originaram-se da biblioteca addEvent.
     */
    jQuery.event = {
        /**
         * Vincule um evento a um elemento.
         */
        add: function(elem, types, handler, data)
        {
            if (elem.nodeType == 3 || elem.nodeType == 8)
            {
                return;
            }

            /**
             * Por alguma razão, o IE tem problemas para passar
             * o objeto da janela, fazendo com que ele seja
             * clonado no processo.
             */
            if (jQuery.browser.msie && elem.setInterval != undefined)
            {
                elem = window;
            }

            /**
             * Certifique-se de que a função que está sendo executada
             * tenha um ID exclusivo.
             */
            if (!handler.guid)
            {
                handler.guid = this.guid++;
            }

            /**
             * Se os dados forem passados, vincule ao manipulador.
             */
            if (data != undefined)
            {
                /**
                 * Crie um ponteiro de função temporário para o
                 * manipulador original.
                 */
                var fn = handler;

                /**
                 * Crie uma função de manipulador exclusiva, envolvida
                 * no manipulador original.
                 */
                handler = function()
                {
                    /**
                     * Passe argumentos e contexto para o manipulador original.
                     */
                    return fn.apply(this, arguments); 
                };

                /**
                 * Armazene dados em um manipulador exclusivo.
                 */
                handler.data = data;

                /**
                 * Defina o guia do manipulador exclusivo como o mesmo do
                 * manipulador original, para que possa ser removido.
                 */
                handler.guid = fn.guid;
            }

            /**
             * Inicie a estrutura de eventos do elemento.
             */
            var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
                handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function()
                {
                    /**
                     * Devolve undefined ou false.
                     */
                    var val;

                    /**
                     * Lida com o segundo evento de um trigger e quando
                     * um evento é chamado após o descarregamento de uma
                     * página.
                     */
                    if (typeof jQuery == "undefined" || jQuery.event.triggered)
                    {
                        return val;
                    }

                    /**
                     *
                     */
                    val = jQuery.event.handle.apply(arguments.callee.elem, arguments);

                    /**
                     *
                     */
                    return val;
                });

            /**
             * Adicione elem como uma propriedade da função handle.
             * Isso evita vazamento de memória com eventos não
             * nativos no IE.
             */
            handle.elem = elem;

            /**
             * Lide com vários eventos separados por um espaço.
             * jQuery(...).bind("mouseover mouseout", fn);
             */
            jQuery.each(types.split(/\s+/), function(index, type)
            {
                /**
                 * Manipuladores de eventos com namespace.
                 */
                var parts = type.split(".");
 
                /**
                 *
                 */
                type = parts[0];
                handler.type = parts[1];

                /**
                 * Obtenha a lista atual de funções vinculadas a este evento.
                 */
                var handlers = events[type];

                /**
                 * Inicie a fila do manipulador de eventos.
                 */
                if (!handlers)
                {
                    handlers = events[type] = {};

                    /**
                     * Verifique se há um manipulador de eventos especial.
                     * Use addEventListener/attachEvent apenas se o manipulador
                     * de eventos especiais retornar falso.
                     */
                    if (!jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem) === false)
                    {
                        /**
                         * Vincule o manipulador de eventos global ao elemento.
                         */
                        if (elem.addEventListener)
                        {
                            elem.addEventListener(type, handle, false);
                        } else if (elem.attachEvent)
                        {
                            elem.attachEvent("on" + type, handle);
                        }
                    }
                }

                /**
                 * Adicione a função à lista de manipuladores do elemento.
                 */
                handlers[handler.guid] = handler;

                /**
                 * Acompanhe quais eventos foram usados, para acionamento
                 * global.
                 */
                jQuery.event.global[type] = true;
            });

            /**
             * Anule o elemento para evitar vazamentos de
             * memória no IE.
             */
            elem = null;
        },

        /**
         *
         */
        guid: 1,

        /**
         *
         */
        global: {},

        /**
         * Desanexe um evento ou conjunto de eventos de
         * um elemento.
         */
        remove: function(elem, types, handler)
        {
            /**
             * Não faça eventos em nós de texto e comentários.
             */
            if (elem.nodeType == 3 || elem.nodeType == 8)
            {
                return;
            }

            /**
             *
             */
            var events = jQuery.data(elem, "events"), ret, index;

            /**
             *
             */
            if (events)
            {
                /**
                 * Desvincule todos os eventos do elemento.
                 */
                if (types == undefined)
                {
                    for (var type in events)
                    {
                        this.remove(elem, type);
                    }
                } else
                {
                    /**
                     * Types é na verdade um objeto de evento aqui.
                     */
                    if (types.type)
                    {
                        handler = types.handler;
                        types = types.type;
                    }

                    /**
                     * Lide com vários eventos separados por um espaço.
                     * jQuery(...).unbind("mouseover mouseout", fn);
                     */
                    jQuery.each(types.split(/\s+/), function(index, type)
                    {
                        /**
                         * Manipuladores de eventos com namespace.
                         */
                        var parts = type.split(".");
                            type = parts[0];

                        if (events[type])
                        {
                            /**
                             * Remova o manipulador fornecido para o tipo
                             * especificado.
                             */
                            if (handler)
                            {
                                delete events[type][handler.guid];
                            } else
                            {
                                /**
                                 * Remova todos os manipuladores do tipo fornecido.
                                 */

                                for (handler in events[type])
                                {
                                    /**
                                     * Lidar com a remoção de eventos com namespace.
                                     */
                                    if (!parts[1] || events[type][handler].type == parts[1])
                                    {
                                        delete events[type][handler];
                                    }
                                }
                            }

                            /**
                             * Remova o manipulador de eventos genérico se não
                             * existirem mais manipuladores.
                             */
                            for (ret in events[type])
                            {
                                break;
                            }

                            if (!ret)
                            {
                                if (!jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem) === false)
                                {
                                    if (elem.removeEventListener)
                                    {
                                        elem.removeEventListener(type, jQuery.data(elem, "handle"), false);
                                    } else if (elem.detachEvent)
                                    {
                                        elem.detachEvent("on" + type, jQuery.data(elem, "handle"));
                                    }
                                }

                                ret = null;
                                delete events[type];
                            }
                        }
                    });
                }

                /**
                 * Remova o expando se não for mais usado.
                 */
                for (ret in events)
                {
                    break;
                }

                if (!ret)
                {
                    var handle = jQuery.data(elem, "handle");

                    if (handle)
                    {
                        handle.elem = null;
                    }

                    jQuery.removeData(elem, "events");
                    jQuery.removeData(elem, "handle");
                }
            }
        },

        /**
         *
         */
        trigger: function(type, data, elem, donative, extra)
        {
            /**
             * Clone os dados recebidos, se houver.
             */
            data = jQuery.makeArray(data || []);

            /**
             * Lidar com um gatilho global.
             */
            if (!elem)
            {
                /**
                 * Acione apenas se alguma vez vincularmos um evento a ele.
                 */
                if (this.global[type])
                {
                    jQuery("*").add([window, document]).trigger(type, data);
                }

                /**
                 * Lidar com o acionamento de um único elemento.
                 */
            } else
            {
                /**
                 * Não faça eventos em nós de texto e comentários.
                 */
                if (elem.nodeType == 3 || elem.nodeType == 8)
                {
                    return undefined;
                }

                var val,
                    ret,
                    fn = jQuery.isFunction(elem[type] || null),

                    /**
                     * Verifique se precisamos fornecer um evento falso ou não.
                     */
                    event = !data[0] || !data[0].preventDefault;

                /**
                 * Passe adiante um evento falso.
                 */
                if (event)
                {
                    data.unshift(
                        this.fix({
                            type: type,
                            target: elem
                        })
                    );
                }

                /**
                 * Aplique o tipo de gatilho correto.
                 */
                data[0].type = type;

                /**
                 * Acione o evento.
                 */
                if (jQuery.isFunction(jQuery.data(elem, "handle")))
                {
                    val = jQuery.data(elem, "handle").apply(elem, data);
                }

                /**
                 * Lidar com o acionamento de manipuladores .onfoo
                 * nativos.
                 */
                if (!fn && elem["on" + type] && elem["on" + type].apply(elem, data) === false)
                {
                    val = false;
                }

                /**
                 * Funções extras não obtêm o objeto de evento personalizado.
                 */
                if (event)
                {
                    data.shift();
                }

                /**
                 * Lidar com o acionamento de funções extras.
                 */
                if (extra && jQuery.isFunction(extra))
                {
                    /**
                     * Chame a função extra e coloque o valor de retorno
                     * atual no final para possível inspeção.
                     */
                    ret = extra.apply(elem, val == null ? data : data.concat(val));

                    /**
                     * Se algo for retornado, dê precedência e substitua
                     * o valor anterior.
                     */
                    if (ret !== undefined)
                    {
                        val = ret;
                    }
                }

                /**
                 * Acione os eventos nativos (exceto cliques em links).
                 */
                if (fn && donative !== false && val !== false && !(jQuery.nodeName(elem, 'a') && type == "click"))
                {
                    this.triggered = true;

                    try
                    {
                        elem[type]();

                        /**
                         * Evitar que o IE gere um erro para alguns elementos
                         * ocultos.
                         */
                    } catch (e)
                    {
                    }
                }

                this.triggered = false;
            }

            return val;
        },

        /**
         *
         */
        handle: function(event)
        {
            /**
             * Retornou undefined ou false.
             */
            var val;

            /**
             * O objeto vazio é para eventos acionados sem dados.
             */
            event = jQuery.event.fix(event || window.event || {});

            /**
             * Manipuladores de eventos com namespace.
             */
            var parts = event.type.split(".");
                event.type = parts[0];

            var handlers = jQuery.data(this, "events") && jQuery.data(this, "events")[event.type],
                args = Array.prototype.slice.call(arguments, 1);
                args.unshift(event);

            for (var j in handlers)
            {
                var handler = handlers[j];

                /**
                 * Passe uma referência à própria função do manipulador.
                 * Para que possamos removê-lo posteriormente.
                 */
                args[0].handler = handler;
                args[0].data = handler.data;

                /**
                 * Filtre as funções por classe.
                 */
                if (!parts[1] || handler.type == parts[1])
                {
                    var ret = handler.apply(this, args);

                    if (val !== false)
                    {
                        val = ret;
                    }

                    if (ret === false)
                    {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }

            /**
             * Limpe as propriedades adicionadas no IE para evitar
             * vazamento de memória.
             */
            if (jQuery.browser.msie)
            {
                event.target = event.preventDefault = event.stopPropagation = event.handler = event.data = null;
            }

            return val;
        },

        /**
         *
         */
        fix: function(event)
        {
            /**
             * Armazene uma cópia do objeto de evento original e clone
             * para definir propriedades somente leitura.
             */
            var originalEvent = event;

            /**
             *
             */
            event = jQuery.extend({}, originalEvent);

            /**
             * Adicione preventDefault e stopPropagation, pois
             * eles não funcionarão no clone.
             */
            event.preventDefault = function()
            {
                /**
                 * Se preventDefault existir, execute-o no evento
                 * original.
                 */
                if (originalEvent.preventDefault)
                {
                    originalEvent.preventDefault();
                }

                /**
                 * Caso contrário, defina a propriedade returnValue
                 * do evento original como false (IE).
                 */
                originalEvent.returnValue = false;
            };

            /**
             *
             */
            event.stopPropagation = function()
            {
                /**
                 * Se stopPropagation existir, execute-o no
                 * evento original.
                 */
                if (originalEvent.stopPropagation)
                {
                    originalEvent.stopPropagation();
                }

                /**
                 * Caso contrário, defina a propriedade cancelBubble
                 * do evento original como true (IE).
                 */
                originalEvent.cancelBubble = true;
            };

            /**
             * Corrija a propriedade de destino, se necessário.
             */
            if (!event.target)
            {
                /**
                 * Corrige #1925 onde srcElement também pode
                 * não estar definido.
                 */
                event.target = event.srcElement || document;
            }

            /**
             * Verifique se o destino é um textnode (safári).
             */
            if (event.target.nodeType == 3)
            {
                event.target = originalEvent.target.parentNode;
            }

            /**
             * Adicione relatedTarget, se necessário.
             */
            if (!event.relatedTarget && event.fromElement)
            {
                event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
            }

            /**
             * Calcule pageX/Y se estiver faltando e clientX/Y disponível.
             */
            if (event.pageX == null && event.clientX != null)
            {
                var doc = document.documentElement, body = document.body;

                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
            }

            /**
             * Adicione which para eventos importantes.
             */
            if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode))
            {
                event.which = event.charCode || event.keyCode;
            }

            /**
             * Adicione metaKey a navegadores que não sejam Mac (use
             * ctrl para PCs e Meta para Macs).
             */
            if (!event.metaKey && event.ctrlKey)
            {
                event.metaKey = event.ctrlKey;
            }

            /**
             * Adicione qual para clicar: 1 == left; 2 == middle; 3 == right.
             * Observação: o botão não está normalizado, portanto não o utilize.
             */
            if (!event.which && event.button)
            {
                event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
            }

            return event;
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
                 *
                 */
                setup: function()
                {
                    /**
                     * Certifique-se de que o evento pronto esteja configurado.
                     */
                    bindReady();

                    return;
                },

                /**
                 *
                 */
                teardown: function()
                {
                    return;
                }
            },

            /**
             *
             */
            mouseenter: {
                /**
                 *
                 */
                setup: function()
                {
                    if (jQuery.browser.msie)
                    {
                        return false;
                    }

                    /**
                     *
                     */
                    jQuery(this).bind("mouseover", jQuery.event.special.mouseenter.handler);

                    /**
                     *
                     */
                    return true;
                },

                /**
                 *
                 */
                teardown: function()
                {
                    if (jQuery.browser.msie)
                    {
                        return false;
                    }

                    /**
                     *
                     */
                    jQuery(this).unbind("mouseover", jQuery.event.special.mouseenter.handler);

                    /**
                     *
                     */
                    return true;
                },

                /**
                 *
                 */
                handler: function(event)
                {
                    /**
                     * Se realmente passarmos o mouse sobre um subelemento,
                     * ignore-o.
                     */
                    if (withinElement(event, this))
                    {
                        return true;
                    }

                    /**
                     * Execute os manipuladores corretos definindo o
                     * tipo de evento como mouseenter.
                     */
                    arguments[0].type = "mouseenter";

                    /**
                     *
                     */
                    return jQuery.event.handle.apply(this, arguments);
                }
            },

            /**
             *
             */
            mouseleave: {
                /**
                 *
                 */
                setup: function()
                {
                    if (jQuery.browser.msie)
                    {
                        return false;
                    }

                    /**
                     *
                     */
                    jQuery(this).bind("mouseout", jQuery.event.special.mouseleave.handler);

                    /**
                     *
                     */
                    return true;
                },

                /**
                 *
                 */
                teardown: function()
                {
                    if (jQuery.browser.msie)
                    {
                        return false;
                    }

                    /**
                     *
                     */
                    jQuery(this).unbind("mouseout", jQuery.event.special.mouseleave.handler);

                    /**
                     *
                     */
                    return true;
                },

                /**
                 *
                 */
                handler: function(event)
                {
                    /**
                     * Se realmente passarmos o mouse sobre um subelemento,
                     * ignore-o.
                     */
                    if (withinElement(event, this))
                    {
                        return true;
                    }

                    /**
                     * Execute os manipuladores corretos definindo o tipo
                     * de evento como mouseleave.
                     */
                    arguments[0].type = "mouseleave";

                    /**
                     *
                     */
                    return jQuery.event.handle.apply(this, arguments);
                }
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
        bind: function(type, data, fn)
        {
            return type == "unload" ? this.one(type, data, fn) : this.each(function()
            {
                jQuery.event.add(this, type, fn || data, fn && data);
            });
        },

        /**
         *
         */
        one: function(type, data, fn)
        {
            return this.each(function()
            {
                jQuery.event.add(this, type, function(event)
                {
                    jQuery(this).unbind(event);

                    return (fn || data).apply(this, arguments);
                }, fn && data);
            });
        },

        /**
         *
         */
        unbind: function(type, fn)
        {
            return this.each(function()
            {
                jQuery.event.remove(this, type, fn);
            });
        },

        /**
         *
         */
        trigger: function(type, data, fn)
        {
            return this.each(function()
            {
                jQuery.event.trigger(type, data, this, true, fn);
            });
        },

        /**
         *
         */
        triggerHandler: function(type, data, fn)
        {
            if (this[0])
            {
                return jQuery.event.trigger(type, data, this[0], false, fn);
            }

            return undefined;
        },

        /**
         *
         */
        toggle: function()
        {
            /**
             * Salve a referência aos argumentos para acesso no encerramento.
             */
            var args = arguments;

            return this.click(function(event)
            {
                /**
                 * Descubra qual função executar.
                 */
                this.lastToggle = 0 == this.lastToggle ? 1 : 0;

                /**
                 * Certifique-se de que os cliques parem.
                 */
                event.preventDefault();

                /**
                 * E execute a função.
                 */
                return args[this.lastToggle].apply( this, arguments ) || false;
            });
        },

        /**
         *
         */
        hover: function(fnOver, fnOut)
        {
            return this.bind("mouseenter", fnOver).bind("mouseleave", fnOut);
        },

        /**
         *
         */
        ready: function(fn)
        {
            /**
             * Anexe os ouvintes.
             */
            bindReady();

            /**
             * Se o DOM já estiver pronto.
             */
            if (jQuery.isReady)
            {
                /**
                 * Execute a função imediatamente.
                 */
                fn.call(document, jQuery);
            } else
            {
                /**
                 * Caso contrário, lembre-se da função para mais tarde.
                 */

                /**
                 * Adicione a função à lista de espera.
                 */
                jQuery.readyList.push(function()
                {
                    return fn.call(this, jQuery);
                });
            }

            return this;
        }
    });

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        isReady: false,

        /**
         *
         */
        readyList: [],

        /**
         * Tratar quando o DOM estiver pronto.
         */
        ready: function()
        {
            /**
             * Certifique-se de que o DOM ainda não esteja carregado.
             */
            if (!jQuery.isReady)
            {
                /**
                 * Lembre-se que o DOM está pronto.
                 */
                jQuery.isReady = true;

                /**
                 * Se houver funções vinculadas, para executar.
                 */
                if (jQuery.readyList)
                {
                    /**
                     * Execute todos eles.
                     */
                    jQuery.each(jQuery.readyList, function()
                    {
                        this.apply(document);
                    });

                    /**
                     * Redefina a lista de funções.
                     */
                    jQuery.readyList = null;
                }

                /**
                 * Acione quaisquer eventos vinculados prontos.
                 */
                jQuery(document).triggerHandler("ready");
            }
        }
    });

    /**
     *
     */
    var readyBound = false;

    /**
     *
     */
    function bindReady()
    {
        if (readyBound)
        {
            return;
        }

        readyBound = true;

        /**
         * Mozilla, Opera (veja mais abaixo) e webkit nightlies
         * atualmente apoiam este evento.
         */
        if (document.addEventListener && !jQuery.browser.opera)
        {
            /**
             * Use o prático callback de evento.
             */
            document.addEventListener("DOMContentLoaded", jQuery.ready, false);
        }

        /**
         * Se o IE for usado e não estiver em um quadro.
         * Verifique continuamente se o documento está pronto.
         */
        if (jQuery.browser.msie && window == top)
        {
            (function()
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
                } catch(error)
                {
                    setTimeout(arguments.callee, 0);

                    return;
                }

                /**
                 * E execute quaisquer funções de espera.
                 */
                jQuery.ready();
            })();
        }

        if (jQuery.browser.opera)
        {
            document.addEventListener("DOMContentLoaded", function ()
            {
                if (jQuery.isReady)
                {
                    return;
                }

                for (var i = 0; i < document.styleSheets.length; i++)
                {
                    if (document.styleSheets[i].disabled)
                    {
                        setTimeout(arguments.callee, 0);
                        return;
                    }
                }

                /**
                 * E execute quaisquer funções de espera.
                 */
                jQuery.ready();
            }, false);
        }

        /**
         *
         */
        if (jQuery.browser.safari)
        {
            var numStyles;

            (function()
            {
                if (jQuery.isReady)
                {
                    return;
                }

                if (document.readyState != "loaded" && document.readyState != "complete")
                {
                    setTimeout(arguments.callee, 0);
                    return;
                }

                if (numStyles === undefined)
                {
                    numStyles = jQuery("style, link[rel=stylesheet]").length;
                }

                if (document.styleSheets.length != numStyles)
                {
                    setTimeout(arguments.callee, 0);
                    return;
                }

                /**
                 * E execute quaisquer funções de espera.
                 */
                jQuery.ready();
            })();
        }

        /**
         * Um substituto para window.onload, que sempre funcionará.
         */
        jQuery.event.add(window, "load", jQuery.ready);
    }

    /**
     *
     */
    jQuery.each(
        (
            "blur," +
            "focus," +
            "load," +
            "resize," +
            "scroll," +
            "unload," +
            "click," +
            "dblclick," +
            "mousedown," +
            "mouseup," +
            "mousemove," +
            "mouseover," +
            "mouseout," +
            "change," +
            "select," +
            "submit," +
            "keydown," +
            "keypress," +
            "keyup," +
            "error"
        ).split(","), function(i, name)
        {
            /**
             * Lidar com vinculação de eventos.
             */
            jQuery.fn[name] = function(fn)
            {
                return fn ? this.bind(name, fn) : this.trigger(name);
            };
        }
    );

    /**
     * Verifica se um evento aconteceu em um elemento dentro
     * de outro elemento. Usado nos manipuladores
     * jQuery.event.special.mouseenter e mouseleave.
     */
    var withinElement = function(event, elem)
    {
        /**
         * Verifique se mouse(over|out) ainda está dentro do
         * mesmo elemento pai.
         */
        var parent = event.relatedTarget;

        /**
         * Atravesse a árvore.
         */
        while (parent && parent != elem)
        {
            try
            {
                parent = parent.parentNode;
            } catch(error)
            {
                parent = elem;
            }
        }

        /**
         * Retorna verdadeiro se realmente passarmos o mouse
         * sobre um subelemento.
         */
        return parent == elem;
    };

    /**
     * Evite vazamentos de memória no IE. E evite erros na atualização
     * com eventos como passar o mouse em outros navegadores. A janela
     * não está incluída para não desvincular eventos de descarregamento
     * existentes.
     */
    jQuery(window).bind("unload", function()
    {
        jQuery("*").add(document).unbind();
    });

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        load: function(url, params, callback)
        {
            if (jQuery.isFunction(url))
            {
                return this.bind("load", url);
            }

            var off = url.indexOf(" ");
            if (off >= 0)
            {
                var selector = url.slice(off, url.length);
                    url = url.slice(0, off);
            }

            /**
             *
             */
            callback = callback || function()
            {
            };

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
                    params = null;

                    /**
                     * Caso contrário, crie uma sequência de parâmetros.
                     */
                } else
                {
                    params = jQuery.param(params);
                    type = "POST";
                }
            }

            /**
             *
             */
            var self = this;

            /**
             * Solicite o documento remoto.
             */
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params,

                /**
                 *
                 */
                complete: function(res, status)
                {
                    /**
                     * Se for bem-sucedido, injete o HTML em todos os
                     * elementos correspondentes.
                     */
                    if (status == "success" || status == "notmodified")
                    {
                        /**
                         * Veja se um seletor foi especificado.
                         */
                        self.html(selector ?
                            /**
                             * Crie um div fictício para armazenar os resultados.
                             */
                            jQuery("<div/>")
                                /**
                                 * Injete o conteúdo do documento, removendo
                                 * os scripts para evitar erros de 'Permissão
                                 * negada' no IE.
                                 */
                                .append(res.responseText.replace(/<script(.|\s)*?\/script>/g, ""))

                                /**
                                 * Localize os elementos especificados.
                                 */
                                .find(selector) :

                            /**
                             * Caso contrário, basta injetar o resultado completo.
                             */
                            res.responseText
                        );
                    }

                    self.each(callback, [res.responseText, status, res]);
                }
            });

            /**
             *
             */
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
                return jQuery.nodeName(this, "form") ? jQuery.makeArray(this.elements) : this;
            })
            .filter(function()
            {
                return this.name && !this.disabled && (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password/i.test(this.type));
            })
            .map(function(i, elem)
            {
                var val = jQuery(this).val();

                return val == null ? null :
                    val.constructor == Array ?
                        jQuery.map(val, function(val, i)
                        {
                            return {
                                name: elem.name,
                                value: val
                            };
                        }) : {
                            name: elem.name,
                            value: val
                        };
            }).get();
        }
    });

    /**
     * Anexe um monte de funções para lidar com eventos
     * AJAX comuns.
     */
    jQuery.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i, o)
    {
        jQuery.fn[o] = function(f)
        {
            return this.bind(o, f);
        };
    });

    /**
     *
     */
    var jsc = (new Date).getTime();

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        get: function(url, data, callback, type)
        {
            /**
             * Shift argumentos se o argumento de dados foi omitido.
             */
            if (jQuery.isFunction(data))
            {
                callback = data;
                data = null;
            }

            return jQuery.ajax({
                type: "GET",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },

        /**
         *
         */
        getScript: function(url, callback)
        {
            return jQuery.get(url, null, callback, "script");
        },

        /**
         *
         */
        getJSON: function(url, data, callback)
        {
            return jQuery.get(url, data, callback, "json");
        },

        /**
         *
         */
        post: function(url, data, callback, type)
        {
            if (jQuery.isFunction(data))
            {
                callback = data;
                data = {};
            }

            return jQuery.ajax({
                type: "POST",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },

        /**
         *
         */
        ajaxSetup: function(settings)
        {
            jQuery.extend(jQuery.ajaxSettings, settings);
        },

        /**
         *
         */
        ajaxSettings: {
            global: true,
            type: "GET",
            timeout: 0,
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            data: null,
            username: null,
            password: null,

            /**
             *
             */
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "*/*"
            }
        },

        /**
         * Cache de título modificado pela última vez para
         * a próxima solicitação.
         */
        lastModified: {},

        /**
         *
         */
        ajax: function(s)
        {
            var jsonp, jsre = /=\?(&|$)/g, status, data;

            /**
             * Estenda as configurações, mas estenda novamente os 's'
             * para que possam ser verificados novamente mais tarde (no
             * conjunto de testes, especificamente).
             */
            s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));

            /**
             * Converter dados se ainda não for uma string.
             */
            if (s.data && s.processData && typeof s.data != "string")
            {
                s.data = jQuery.param(s.data);
            }

            /**
             * Lidar com callbacks de parâmetro JSONP.
             */
            if (s.dataType == "jsonp")
            {
                if (s.type.toLowerCase() == "get")
                {
                    if (!s.url.match(jsre))
                    {
                        s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
                    }
                } else if (!s.data || !s.data.match(jsre))
                {
                    s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
                }

                s.dataType = "json";
            }

            /**
             * Crie uma função JSONP temporária.
             */
            if (s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre)))
            {
                jsonp = "jsonp" + jsc++;

                /**
                 * Substitua o =? sequência na string de consulta
                 * e nos dados.
                 */
                if (s.data)
                {
                    s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
                }

                /**
                 *
                 */
                s.url = s.url.replace(jsre, "=" + jsonp + "$1");

                /**
                 * Precisamos ter certeza de que uma resposta no estilo
                 * JSONP seja executada corretamente.
                 */
                s.dataType = "script";

                /**
                 * Lidar com o carregamento no estilo JSONP.
                 */
                window[jsonp] = function(tmp)
                {
                    data = tmp;
                    success();
                    complete();

                    /**
                     * Coleta de lixo.
                     */
                    window[jsonp] = undefined;

                    try
                    {
                        delete window[jsonp];
                    } catch(e)
                    {
                    }

                    if (head)
                    {
                        head.removeChild(script);
                    }
                };
            }

            if (s.dataType == "script" && s.cache == null)
            {
                s.cache = false;
            }

            if (s.cache === false && s.type.toLowerCase() == "get")
            {
                var ts = (new Date()).getTime();

                /**
                 * Tente substituir _= se estiver lá.
                 */
                var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");

                /**
                 * Se nada foi substituído, adicione carimbo de
                 * data/hora ao final.
                 */
                s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "");
            }

            /**
             * Se os dados estiverem disponíveis, anexe os dados ao
             * URL para obter solicitações.
             */
            if (s.data && s.type.toLowerCase() == "get")
            {
                s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;

                /**
                 * O IE gosta de enviar dados obtidos e postados, evite isso.
                 */
                s.data = null;
            }

            /**
             * Fique atento a um novo conjunto de solicitações.
             */
            if (s.global && ! jQuery.active++)
            {
                jQuery.event.trigger("ajaxStart");
            }

            /**
             * Se estivermos solicitando um documento remoto e
             * tentando carregar JSON ou Script com um GET.
             */
            if ((!s.url.indexOf("http") || !s.url.indexOf("//")) && (s.dataType == "script" || s.dataType =="json") && s.type.toLowerCase() == "get")
            {
                var head = document.getElementsByTagName("head")[0];
                var script = document.createElement("script");
                    script.src = s.url;

                if (s.scriptCharset)
                {
                    script.charset = s.scriptCharset;
                }

                /**
                 * Lidar com o carregamento do script.
                 */
                if ( !jsonp )
                {
                    var done = false;

                    /**
                     * Anexe manipuladores para todos os navegadores.
                     */
                    script.onload = script.onreadystatechange = function()
                    {
                        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete"))
                        {
                            done = true;
                            success();
                            complete();
                            head.removeChild(script);
                        }
                    };
                }

                head.appendChild(script);

                /**
                 * Lidamos com tudo usando a injeção de elemento de script.
                 */
                return undefined;
            }

            /**
             *
             */
            var requestDone = false;

            /**
             * Crie o objeto de solicitação; A Microsoft não conseguiu
             * implementar corretamente o XMLHttpRequest no IE7, por
             * isso usamos o ActiveXObject quando ele está disponível.
             */
            var xml = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();

            /**
             * Abrir o soquete.
             */
            xml.open(s.type, s.url, s.async, s.username, s.password);

            /**
             * Precisa de um try/catch extra para solicitações
             * entre domínios no Firefox 3.
             */
            try
            {
                /**
                 * Defina o título correto, se os dados estiverem
                 * sendo enviados.
                 */
                if (s.data)
                {
                    xml.setRequestHeader("Content-Type", s.contentType);
                }

                /**
                 * Defina o título If-Modified-Since, se for modo ifModified.
                 */
                if (s.ifModified)
                {
                    xml.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT");
                }

                /**
                 * Defina o título para que o script chamado saiba que
                 * é um XMLHttpRequest.
                 */
                xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                /**
                 * Defina o título Accepts para o servidor,
                 * dependendo do dataType.
                 */
                xml.setRequestHeader("Accept", s.dataType && s.accepts[s.dataType] ?
                    s.accepts[s.dataType] + ", */*" :
                    s.accepts._default
                );
            } catch(e)
            {
            }

            /**
             * Permitir títulos/tipos MIME personalizados.
             */
            if (s.beforeSend)
            {
                s.beforeSend(xml);
            }

            if (s.global)
            {
                jQuery.event.trigger("ajaxSend", [xml, s]);
            }

            /**
             * Aguarde uma resposta para voltar.
             */
            var onreadystatechange = function(isTimeout)
            {
                /**
                 * A transferência foi concluída e os dados estão
                 * disponíveis ou a solicitação expirou.
                 */
                if (!requestDone && xml && (xml.readyState == 4 || isTimeout == "timeout"))
                {
                    requestDone = true;

                    /**
                     * Limpar intervalo de pesquisa.
                     */
                    if (ival)
                    {
                        clearInterval(ival);
                        ival = null;
                    }

                    /**
                     *
                     */
                    status = isTimeout == "timeout" && "timeout" || !jQuery.httpSuccess(xml) && "error" || s.ifModified && jQuery.httpNotModified(xml, s.url) && "notmodified" || "success";

                    /**
                     *
                     */
                    if (status == "success")
                    {
                        /**
                         * Procure e detecte erros de análise de documentos XML.
                         */
                        try
                        {
                            /**
                             * Processar os dados (executa o xml por meio de
                             * httpData independentemente do callback).
                             */
                            data = jQuery.httpData(xml, s.dataType);
                        } catch(e)
                        {
                            status = "parsererror";
                        }
                    }

                    /**
                     * Certifique-se de que a solicitação foi bem-sucedida
                     * ou não foi modificada.
                     */
                    if (status == "success")
                    {
                        /**
                         * Título Last-Modified em cache, se estiver
                         * no modo ifModified.
                         */
                        var modRes;

                        /**
                         * Exceção de engolir lançada pelo FF se o título
                         * não estiver disponível.
                         */
                        try
                        {
                            modRes = xml.getResponseHeader("Last-Modified");
                        } catch(e)
                        {
                        }

                        if (s.ifModified && modRes)
                        {
                            jQuery.lastModified[s.url] = modRes;
                        }

                        /**
                         * JSONP lida com seu próprio callback de sucesso.
                         */
                        if (!jsonp)
                        {
                            success();
                        }
                    } else
                    {
                        jQuery.handleError(s, xml, status);
                    }

                    /**
                     * Envie os manipuladores completos.
                     */
                    complete();

                    /**
                     * Pare de vazamentos de memória.
                     */
                    if (s.async)
                    {
                        xml = null;
                    }
                }
            };

            if (s.async)
            {
                /**
                 * Não anexe o manipulador à solicitação, apenas
                 * pesquise-o.
                 */
                var ival = setInterval(onreadystatechange, 13); 

                /**
                 * Verificador de tempo limite.
                 */
                if (s.timeout > 0)
                {
                    setTimeout(function()
                    {
                        /**
                         * Verifique se a solicitação ainda está acontecendo.
                         */
                        if (xml)
                        {
                            /**
                             * Cancele a solicitação.
                             */
                            xml.abort();

                            if (!requestDone)
                            {
                                onreadystatechange("timeout");
                            }
                        }
                    }, s.timeout);
                }
            }

            /**
             * Envie os dados.
             */
            try
            {
                xml.send(s.data);
            } catch(e)
            {
                jQuery.handleError(s, xml, null, e);
            }

            /**
             * O Firefox 1.5 não envia statechange para solicitações
             * de sincronização.
             */
            if (!s.async)
            {
                onreadystatechange();
            }

            /**
             *
             */
            function success()
            {
                /**
                 * Se um callback local foi especificado, acione-o
                 * e transmita os dados.
                 */
                if (s.success)
                {
                    s.success(data, status);
                }

                /**
                 * Envie o callback global.
                 */
                if (s.global)
                {
                    jQuery.event.trigger("ajaxSuccess", [xml, s]);
                }
            }

            /**
             *
             */
            function complete()
            {
                /**
                 * Resultado do processo.
                 */
                if (s.complete)
                {
                    s.complete(xml, status);
                }

                /**
                 * A solicitação foi concluída.
                 */
                if (s.global)
                {
                    jQuery.event.trigger( "ajaxComplete", [xml, s] );
                }

                /**
                 * Lidar com o contador AJAX global.
                 */
                if (s.global && ! --jQuery.active)
                {
                    jQuery.event.trigger("ajaxStop");
                }
            }

            /**
             * Retorne XMLHttpRequest para permitir o aborto
             * da solicitação, etc.
             */
            return xml;
        },

        /**
         *
         */
        handleError: function(s, xml, status, e)
        {
            /**
             * Se um callback local foi especificado,
             * envie-o.
             */
            if (s.error)
            {
                s.error(xml, status, e);
            }

            /**
             * Envie o callback global.
             */
            if (s.global)
            {
                jQuery.event.trigger("ajaxError", [xml, s, e]);
            }
        },

        /**
         * Contador para armazenar o número de consultas ativas.
         */
        active: 0,

        /**
         * Determina se um XMLHttpRequest foi bem-sucedido ou não.
         */
        httpSuccess: function(r)
        {
            try
            {
                /**
                 * O erro do IE às vezes retorna 1223 quando deveria
                 * ser 204, então trate-o como um sucesso, consulte
                 * #1450.
                 */
                return !r.status && location.protocol == "file:" || (r.status >= 200 && r.status < 300) || r.status == 304 || r.status == 1223 || jQuery.browser.safari && r.status == undefined;
            } catch(e)
            {
            }

            return false;
        },

        /**
         * Determina se um XMLHttpRequest retorna NotModified.
         */
        httpNotModified: function(xml, url)
        {
            try
            {
                var xmlRes = xml.getResponseHeader("Last-Modified");

                /**
                 * O Firefox sempre retorna 200. verifique a data
                 * da última modificação.
                 */
                return xml.status == 304 || xmlRes == jQuery.lastModified[url] || jQuery.browser.safari && xml.status == undefined;
            } catch(e)
            {
            }

            return false;
        },

        /**
         *
         */
        httpData: function(r, type)
        {
            var ct = r.getResponseHeader("content-type");
            var xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0;
            var data = xml ? r.responseXML : r.responseText;

            if (xml && data.documentElement.tagName == "parsererror")
            {
                throw "parsererror";
            }

            /**
             * Se o tipo for "script", avalie-o no contexto global.
             */
            if (type == "script")
            {
                jQuery.globalEval(data);
            }

            /**
             * Obtenha o objeto JavaScript, se JSON for usado.
             */
            if (type == "json")
            {
                data = eval("(" + data + ")");
            }

            return data;
        },

        /**
         * Serialize um vetor de elementos de formulário ou
         * um conjunto de chaves/valores em uma string de
         * consulta.
         */
        param: function(a)
        {
            var s = [];

            /**
             * Se um array foi passado, suponha que seja um array
             * de elementos de formulário.
             */
            if (a.constructor == Array || a.jquery)
            {
                /**
                 * Serialize os elementos do formulário.
                 */
                jQuery.each(a, function()
                {
                    s.push(encodeURIComponent(this.name) + "=" + encodeURIComponent(this.value));
                });
            } else
            {
                /**
                 * Caso contrário, suponha que seja um objeto de
                 * pares chave/valor.
                 */

                /**
                 * Serialize as chaves/valores.
                 */
                for (var j in a)
                {
                    /**
                     * Se o valor for um vetor, os nomes das chaves
                     * precisarão ser repetidos.
                     */
                    if (a[j] && a[j].constructor == Array)
                    {
                        jQuery.each(a[j], function()
                        {
                            s.push(encodeURIComponent(j) + "=" + encodeURIComponent(this));
                        });
                    } else
                    {
                        s.push(encodeURIComponent(j) + "=" + encodeURIComponent(a[j]));
                    }
                }
            }

            /**
             * Retorne a serialização resultante.
             */
            return s.join("&").replace(/%20/g, "+");
        }
    });

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        show: function(speed, callback)
        {
            return speed ?
                this.animate({
                    height: "show",
                    width: "show",
                    opacity: "show"
                }, speed, callback) :

                /**
                 *
                 */
                this.filter(":hidden").each(function()
                {
                    this.style.display = this.oldblock || "";
                    if (jQuery.css(this,"display") == "none")
                    {
                        var elem = jQuery("<" + this.tagName + " />").appendTo("body");
                            this.style.display = elem.css("display");

                        /**
                         * Lidar com uma condição de borda onde css é -
                         * `div { display: none; }` ou similar.
                         */
                        if (this.style.display == "none")
                        {
                            this.style.display = "block";
                        }

                        elem.remove();
                    }
                }).end();
        },

        /**
         *
         */
        hide: function(speed, callback)
        {
            return speed ?
                this.animate({
                    height: "hide",
                    width: "hide",
                    opacity: "hide"
                }, speed, callback) :

                this.filter(":visible").each(function()
                {
                    this.oldblock = this.oldblock || jQuery.css(this, "display");
                    this.style.display = "none";
                }).end();
        },

        /**
         * Salve a antiga função de alternância.
         */
        _toggle: jQuery.fn.toggle,

        /**
         *
         */
        toggle: function(fn, fn2)
        {
            return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
                this._toggle(fn, fn2) :
                fn ?
                    this.animate({
                        height: "toggle",
                        width: "toggle",
                        opacity: "toggle"
                    }, fn, fn2) :

                    this.each(function()
                    {
                        jQuery(this)[
                            jQuery(this).is(":hidden") ? "show" : "hide"
                        ]();
                    });
        },

        /**
         *
         */
        slideDown: function(speed, callback)
        {
            return this.animate({ height: "show" }, speed, callback);
        },

        /**
         *
         */
        slideUp: function(speed, callback)
        {
            return this.animate({ height: "hide" }, speed, callback);
        },

        /**
         *
         */
        slideToggle: function(speed, callback)
        {
            return this.animate({ height: "toggle" }, speed, callback);
        },

        /**
         *
         */
        fadeIn: function(speed, callback)
        {
            return this.animate({ opacity: "show" }, speed, callback);
        },

        /**
         *
         */
        fadeOut: function(speed, callback)
        {
            return this.animate({ opacity: "hide" }, speed, callback);
        },

        /**
         *
         */
        fadeTo: function(speed, to, callback)
        {
            return this.animate({ opacity: to }, speed, callback);
        },

        /**
         *
         */
        animate: function(prop, speed, easing, callback)
        {
            var optall = jQuery.speed(speed, easing, callback);

            /**
             *
             */
            return this[optall.queue === false ? "each" : "queue"](function()
            {
                if (this.nodeType != 1)
                {
                    return false;
                }

                var opt = jQuery.extend({}, optall);
                var hidden = jQuery(this).is(":hidden"), self = this;

                for (var p in prop)
                {
                    if (prop[p] == "hide" && hidden || prop[p] == "show" && !hidden)
                    {
                        return jQuery.isFunction(opt.complete) && opt.complete.apply(this);
                    }

                    if (p == "height" || p == "width")
                    {
                        /**
                         * Armazene a propriedade de exibição.
                         */
                        opt.display = jQuery.css(this, "display");

                        /**
                         * Certifique-se de que nada escape.
                         */
                        opt.overflow = this.style.overflow;
                    }
                }

                /**
                 *
                 */
                if (opt.overflow != null)
                {
                    this.style.overflow = "hidden";
                }

                /**
                 *
                 */
                opt.curAnim = jQuery.extend({}, prop);

                /**
                 *
                 */
                jQuery.each(prop, function(name, val)
                {
                    var e = new jQuery.fx(self, opt, name);

                    if (/toggle|show|hide/.test(val))
                    {
                        e[
                            val == "toggle" ? hidden ? "show" : "hide" : val
                        ](prop);
                    } else
                    {
                        var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
                            start = e.cur(true) || 0;

                        if (parts)
                        {
                            var end = parseFloat(parts[2]),
                                unit = parts[3] || "px";

                            /**
                             * Precisamos calcular o valor inicial.
                             */
                            if (unit != "px")
                            {
                                self.style[name] = (end || 1) + unit;
                                start = ((end || 1) / e.cur(true)) * start;
                                self.style[name] = start + unit;
                            }

                            /**
                             * Se um token +=/-= foi fornecido, estamos fazendo
                             * uma animação relativa.
                             */
                            if (parts[1])
                            {
                                end = ((parts[1] == "-=" ? -1 : 1) * end) + start;
                            }

                            e.custom(start, end, unit);
                        } else
                        {
                            e.custom(start, val, "");
                        }
                    }
                });

                /**
                 * Para conformidade estrita de JS.
                 */
                return true;
            });
        },

        /**
         *
         */
        queue: function(type, fn)
        {
            if (jQuery.isFunction(type) || (type && type.constructor == Array))
            {
                fn = type;
                type = "fx";
            }

            if (!type || (typeof type == "string" && !fn))
            {
                return queue(this[0], type);
            }

            return this.each(function()
            {
                if (fn.constructor == Array)
                {
                    queue(this, type, fn);
                } else
                {
                    queue(this, type).push(fn);

                    if (queue(this, type).length == 1)
                    {
                        fn.apply(this);
                    }
                }
            });
        },

        /**
         *
         */
        stop: function(clearQueue, gotoEnd)
        {
            var timers = jQuery.timers;

            if (clearQueue)
            {
                this.queue([]);
            }

            this.each(function()
            {
                /**
                 * Vá na ordem inversa para que qualquer coisa adicionada
                 * à fila durante o loop seja ignorada.
                 */
                for (var i = timers.length - 1; i >= 0; i--)
                {
                    if (timers[i].elem == this)
                    {
                        if (gotoEnd)
                        {
                            /**
                             * Forçar o próximo passo a ser o último.
                             */
                            timers[i](true);
                        }

                        timers.splice(i, 1);
                    }
                }
            });

            /**
             * Inicie o próximo na fila se a última etapa não
             * tiver sido forçada.
             */
            if (!gotoEnd)
            {
                this.dequeue();
            }

            return this;
        }
    });

    /**
     *
     */
    var queue = function(elem, type, array)
    {
        if (!elem)
        {
            return undefined;
        }

        /**
         *
         */
        type = type || "fx";

        /**
         *
         */
        var q = jQuery.data(elem, type + "queue");

        /**
         *
         */
        if (!q || array)
        {
            q = jQuery.data(elem, type + "queue", array ? jQuery.makeArray(array) : []);
        }

        return q;
    };

    /**
     *
     */
    jQuery.fn.dequeue = function(type)
    {
        type = type || "fx";

        return this.each(function()
        {
            var q = queue(this, type);
                q.shift();

            if (q.length)
            {
                q[0].apply(this);
            }
        });
    };

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        speed: function(speed, easing, fn)
        {
            var opt = speed && speed.constructor == Object ? speed : {
                complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
                duration: speed,
                easing: fn && easing || easing && easing.constructor != Function && easing
            };

            /**
             *
             */
            opt.duration = (opt.duration && opt.duration.constructor == Number ? opt.duration : { slow: 600, fast: 200 }[opt.duration]) || 400;

            /**
             * Na fila.
             */
            opt.old = opt.complete;
            opt.complete = function()
            {
                if (opt.queue !== false)
                {
                    jQuery(this).dequeue();
                }

                if (jQuery.isFunction(opt.old))
                {
                    opt.old.apply(this);
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
                return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
            }
        },

        /**
         *
         */
        timers: [],

        /**
         *
         */
        timerId: null,

        /**
         *
         */
        fx: function(elem, options, prop)
        {
            this.options = options;
            this.elem = elem;
            this.prop = prop;

            if (!options.orig)
            {
                options.orig = {};
            }
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
                this.options.step.apply(this.elem, [this.now, this]);
            }

            /**
             *
             */
            (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);

            /**
             * Defina a propriedade de exibição para bloquear
             * animações de height/width.
             */
            if (this.prop == "height" || this.prop == "width")
            {
                this.elem.style.display = "block";
            }
        },

        /**
         * Obtenha o tamanho atual.
         */
        cur: function(force)
        {
            if (this.elem[this.prop] != null && this.elem.style[this.prop] == null)
            {
                return this.elem[this.prop];
            }

            /**
             *
             */
            var r = parseFloat(jQuery.css(this.elem, this.prop, force));

            /**
             *
             */
            return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
        },

        /**
         * Inicie uma animação de um número para outro.
         */
        custom: function(from, to, unit)
        {
            this.startTime = (new Date()).getTime();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;
            this.update();

            var self = this;
            function t(gotoEnd)
            {
                return self.step(gotoEnd);
            }

            /**
             *
             */
            t.elem = this.elem;

            /**
             *
             */
            jQuery.timers.push(t);

            /**
             *
             */
            if (jQuery.timerId == null)
            {
                jQuery.timerId = setInterval(function()
                {
                    var timers = jQuery.timers;

                    for (var i = 0; i < timers.length; i++)
                    {
                        if (!timers[i]())
                        {
                            timers.splice(i--, 1);
                        }
                    }

                    if (!timers.length)
                    {
                        clearInterval(jQuery.timerId);
                        jQuery.timerId = null;
                    }
                }, 13);
            }
        },

        /**
         * Função 'show' simples.
         */
        show: function()
        {
            /**
             * Lembre-se de onde começamos, para que possamos
             * voltar mais tarde.
             */
            this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
            this.options.show = true;

            /**
             * Comece a animação.
             */
            this.custom(0, this.cur());

            /**
             * Certifique-se de começar com uma width/height pequena
             * para evitar qualquer flash de conteúdo.
             */
            if (this.prop == "width" || this.prop == "height")
            {
                this.elem.style[this.prop] = "1px";
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
            this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
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
            var t = (new Date()).getTime();

            if (gotoEnd || t > this.options.duration + this.startTime)
            {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                this.options.curAnim[this.prop] = true;

                var done = true;
                for (var i in this.options.curAnim)
                {
                    if (this.options.curAnim[i] !== true)
                    {
                        done = false;
                    }
                }

                if (done)
                {
                    if (this.options.display != null)
                    {
                        /**
                         * Redefina o overflow.
                         */
                        this.elem.style.overflow = this.options.overflow;

                        /**
                         * Reinicialize a tela.
                         */
                        this.elem.style.display = this.options.display;
                        if (jQuery.css(this.elem, "display") == "none")
                        {
                            this.elem.style.display = "block";
                        }
                    }

                    /**
                     * Oculte o elemento se a operação "ocultar" tiver
                     * sido realizada.
                     */
                    if (this.options.hide)
                    {
                        this.elem.style.display = "none";
                    }

                    /**
                     * Redefina as propriedades, se o item estiver
                     * oculto ou exibido.
                     */
                    if (this.options.hide || this.options.show)
                    {
                        for (var p in this.options.curAnim)
                        {
                            jQuery.attr(this.elem.style, p, this.options.orig[p]);
                        }
                    }
                }

                /**
                 * Se um callback foi fornecido, execute-o.
                 */
                if (done && jQuery.isFunction(this.options.complete))
                {
                    /**
                     * Execute a função completa.
                     */
                    this.options.complete.apply(this.elem);
                }

                return false;
            } else
            {
                var n = t - this.startTime;

                /**
                 *
                 */
                this.state = n / this.options.duration;

                /**
                 * Execute a função de atenuação, o padrão é swing.
                 */
                this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
                this.now = this.start + ((this.end - this.start) * this.pos);

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
    jQuery.fx.step = {
        /**
         *
         */
        scrollLeft: function(fx)
        {
            fx.elem.scrollLeft = fx.now;
        },

        /**
         *
         */
        scrollTop: function(fx)
        {
            fx.elem.scrollTop = fx.now;
        },

        /**
         *
         */
        opacity: function(fx)
        {
            jQuery.attr(fx.elem.style, "opacity", fx.now);
        },

        /**
         *
         */
        _default: function(fx){
            fx.elem.style[fx.prop] = fx.now + fx.unit;
        }
    };

    /**
     * O método de deslocamento, parte do Dimension Plugin.
     * http://jquery.com/plugins/project/dimensions.
     */
    jQuery.fn.offset = function()
    {
        var left = 0,
            top = 0,
            elem = this[0],
            results;

        if (elem)
        {
            with (jQuery.browser)
            {
                var parent = elem.parentNode,
                    offsetChild = elem,
                    offsetParent = elem.offsetParent,
                    doc = elem.ownerDocument,
                    safari2 = safari && parseInt(version) < 522,
                    fixed = jQuery.css(elem, "position") == "fixed";

                /**
                 * Use getBoundingClientRect se disponível.
                 */
                if (elem.getBoundingClientRect)
                {
                    var box = elem.getBoundingClientRect();

                    /**
                     * Adicione os deslocamentos de rolagem do documento.
                     */
                    add(
                        box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
                        box.top  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop)
                    );

                    /**
                     * O IE adiciona a borda do elemento HTML, por padrão
                     * é média que tem 2px. No modo peculiar do IE 6 e 7,
                     * a largura da borda pode ser substituída pelo seguinte
                     * css html `{ border: 0; }`. Modo de padrões do IE 7, a
                     * borda é sempre 2px. Essa borda/deslocamento normalmente
                     * é representada pelas propriedades clientLeft e clientTop.
                     * No entanto, no modo quirks do IE6 e 7, as propriedades
                     * clientLeft e clientTop não são atualizadas ao serem
                     * substituídas via CSS. Portanto, este método será
                     * desativado em 2px no IE enquanto estiver no quirksmode.
                     */
                    add(
                        -doc.documentElement.clientLeft,
                        -doc.documentElement.clientTop
                    );

                    /**
                     * Caso contrário, faça um loop pelos offsetParents
                     * e parentNodes.
                     */
                } else
                {
                    /**
                     * Offsets do elemento inicial.
                     */
                    add(
                        elem.offsetLeft,
                        elem.offsetTop
                    );

                    /**
                     * Obtenha offsets parentais.
                     */
                    while (offsetParent)
                    {
                        /**
                         * Adicionar offsets offsetParent.
                         */
                        add(
                            offsetParent.offsetLeft,
                            offsetParent.offsetTop
                        );

                        /**
                         * Mozilla e Safari > 2 não incluem a borda dos pais
                         * deslocados. No entanto, a Mozilla adiciona a borda
                         * para tabelas ou células de tabelas.
                         */
                        if (mozilla && !/^t(able|d|h)$/i.test(offsetParent.tagName) || safari && !safari2)
                        {
                            border(offsetParent);
                        }

                        /**
                         * Adicione os deslocamentos de rolagem do documento
                         * se a posição for fixada em qualquer offsetParent.
                         */
                        if (!fixed && jQuery.css(offsetParent, "position") == "fixed")
                        {
                            fixed = true;
                        }

                        /**
                         * Defina offsetChild como offsetParent anterior,
                         * a menos que seja o elemento body.
                         */
                        offsetChild  = /^body$/i.test(offsetParent.tagName) ? offsetChild : offsetParent;

                        /**
                         * Obtenha o próximo offsetParent.
                         */
                        offsetParent = offsetParent.offsetParent;
                    }

                    /**
                     * Obtenha offsets de rolagem pai.
                     */
                    while (parent && parent.tagName && !/^body|html$/i.test(parent.tagName))
                    {
                        /**
                         * Remova a rolagem pai, A MENOS que o pai esteja
                         * embutido ou seja uma tabela para contornar o bug
                         * do Opera inline/table scrollLeft/Top.
                         */
                        if (!/^inline|table.*$/i.test(jQuery.css(parent, "display")))
                        {
                            /**
                             * Subtraia os deslocamentos de rolagem pai.
                             */
                            add(
                                -parent.scrollLeft,
                                -parent.scrollTop
                            );
                        }

                        /**
                         * A Mozilla não adiciona a borda para um pai que
                         * tenha overflow != visible.
                         */
                        if (mozilla && jQuery.css(parent, "overflow") != "visible")
                        {
                            border(parent);
                        }

                        /**
                         * Obtenha o próximo pai.
                         */
                        parent = parent.parentNode;
                    }

                    // Safari <= 2 doubles body offsets with a fixed position element/offsetParent or absolutely positioned offsetChild
                    // Mozilla doubles body offsets with a non-absolutely positioned offsetChild
                    if ((safari2 && (fixed || jQuery.css(offsetChild, "position") == "absolute")) || (mozilla && jQuery.css(offsetChild, "position") != "absolute"))
                    {
                        add(
                            -doc.body.offsetLeft,
                            -doc.body.offsetTop
                        );
                    }

                    /**
                     * Adicione os deslocamentos de rolagem do documento
                     * se a posição for fixa.
                     */
                    if (fixed)
                    {
                        add(
                            Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
                            Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop)
                        );
                    }
                }

                /**
                 * Retorna um objeto com propriedades alta e esquerda.
                 */
                results = {
                    top: top,
                    left: left
                };
            }
        }

        /**
         *
         */
        function border(elem)
        {
            add(
                jQuery.curCSS(elem, "borderLeftWidth", true),
                jQuery.curCSS(elem, "borderTopWidth", true)
            );
        }

        /**
         *
         */
        function add(l, t)
        {
            left += parseInt(l) || 0;
            top += parseInt(t) || 0;
        }

        return results;
    };
})();
