/**
 * QUnit - Uma estrutura de teste de unidade JavaScript.
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
(function(window)
{
    /**
     *
     */
    var defined = {
        setTimeout: typeof window.setTimeout !== "undefined",
        sessionStorage: (function()
        {
            try
            {
                return !!sessionStorage.getItem;
            } catch(e)
            {
                return false;
            }
        })()
    };

    /**
     *
     */
    var testId = 0;

    /**
     *
     */
    var Test = function(name, testName, expected, testEnvironmentArg, async, callback)
    {
        this.name = name;
        this.testName = testName;
        this.expected = expected;
        this.testEnvironmentArg = testEnvironmentArg;
        this.async = async;
        this.callback = callback;
        this.assertions = [];
    };

    /**
     *
     */
    Test.prototype = {
        /**
         *
         */
        init: function()
        {
            var tests = id("qunit-tests");
            if (tests)
            {
                var b = document.createElement("strong");
                    b.innerHTML = "Running " + this.name;

                var li = document.createElement("li");
                    li.appendChild( b );
                    li.className = "running";
                    li.id = this.id = "test-output" + testId++;

                tests.appendChild(li);
            }
        },

        /**
         *
         */
        setup: function()
        {
            if (this.module != config.previousModule)
            {
                if (config.previousModule)
                {
                    QUnit.moduleDone({
                        name: config.previousModule,
                        failed: config.moduleStats.bad,
                        passed: config.moduleStats.all - config.moduleStats.bad,
                        total: config.moduleStats.all
                    });
                }

                config.previousModule = this.module;
                config.moduleStats = {
                    all: 0,
                    bad: 0
                };

                QUnit.moduleStart({
                    name: this.module
                });
            }

            config.current = this;
            this.testEnvironment = extend({
                /**
                 *
                 */
                setup: function()
                {
                },

                /**
                 *
                 */
                teardown: function()
                {
                }
            }, this.moduleTestEnvironment);

            if (this.testEnvironmentArg)
            {
                extend(this.testEnvironment, this.testEnvironmentArg);
            }

            QUnit.testStart({
                name: this.testName
            });

            /**
             * Permitir que funções utilitárias acessem o ambiente
             * de teste atual TODO por quê?
             */
            QUnit.current_testEnvironment = this.testEnvironment;

            try
            {
                if (!config.pollution)
                {
                    saveGlobal();
                }

                this.testEnvironment.setup.call(this.testEnvironment);
            } catch(e)
            {
                QUnit.ok(false, "Setup failed on " + this.testName + ": " + e.message);
            }
        },

        /**
         *
         */
        run: function()
        {
            if (this.async)
            {
                QUnit.stop();
            }

            if (config.notrycatch)
            {
                this.callback.call(this.testEnvironment);
                return;
            }

            try
            {
                this.callback.call(this.testEnvironment);
            } catch(e)
            {
                fail("Test " + this.testName + " died, exception and test follows", e, this.callback);

                /**
                 *
                 */
                QUnit.ok(false, "Died on test #" + (this.assertions.length + 1) + ": " + e.message + " - " + QUnit.jsDump.parse(e));

                /**
                 * Caso contrário, o próximo teste assumirá a
                 * responsabilidade.
                 */
                saveGlobal();

                /**
                 * Reinicie os testes se eles estiverem bloqueando.
                 */
                if (config.blocking)
                {
                    start();
                }
            }
        },

        /**
         *
         */
        teardown: function()
        {
            try
            {
                this.testEnvironment.teardown.call(this.testEnvironment);
                checkPollution();
            } catch(e)
            {
                QUnit.ok( false, "Teardown failed on " + this.testName + ": " + e.message );
            }
        },

        /**
         *
         */
        finish: function()
        {
            if (this.expected && this.expected != this.assertions.length)
            {
                QUnit.ok(false, "Expected " + this.expected + " assertions, but " + this.assertions.length + " were run");
            }

            var good = 0,
                bad = 0,
                tests = id("qunit-tests");

            config.stats.all += this.assertions.length;
            config.moduleStats.all += this.assertions.length;

            if (tests)
            {
                var ol = document.createElement("ol");

                for (var i = 0; i < this.assertions.length; i++)
                {
                    var assertion = this.assertions[i];
                    var li = document.createElement("li");

                    li.className = assertion.result ? "pass" : "fail";
                    li.innerHTML = assertion.message || (assertion.result ? "okay" : "failed");
                    ol.appendChild(li);

                    if (assertion.result)
                    {
                        good++;
                    } else
                    {
                        bad++;
                        config.stats.bad++;
                        config.moduleStats.bad++;
                    }
                }

                /**
                 * Armazene o resultado quando possível.
                 */
                if (QUnit.config.reorder && defined.sessionStorage)
                {
                    if (bad)
                    {
                        sessionStorage.setItem("qunit-" + this.module + "-" + this.testName, bad);
                    } else
                    {
                        sessionStorage.removeItem("qunit-" + this.module + "-" + this.testName);
                    }
                }

                if (bad == 0)
                {
                    ol.style.display = "none";
                }

                var b = document.createElement("strong");
                    b.innerHTML = this.name + " <b class='counts'>(<b class='failed'>" + bad + "</b>, <b class='passed'>" + good + "</b>, " + this.assertions.length + ")</b>";

                var a = document.createElement("a");
                    a.innerHTML = "Rerun";
                    a.href = QUnit.url({
                        filter: getText([b]).replace(/\([^)]+\)$/, "").replace(/(^\s*|\s*$)/g, "")
                    });

                addEvent(b, "click", function()
                {
                    var next = b.nextSibling.nextSibling,
                        display = next.style.display;

                    next.style.display = display === "none" ? "block" : "none";
                });

                addEvent(b, "dblclick", function(e)
                {
                    var target = e && e.target ? e.target : window.event.srcElement;

                    if (target.nodeName.toLowerCase() == "span" || target.nodeName.toLowerCase() == "b")
                    {
                        target = target.parentNode;
                    }

                    if (window.location && target.nodeName.toLowerCase() === "strong")
                    {
                        window.location = QUnit.url({
                            filter: getText([target]).replace(/\([^)]+\)$/, "").replace(/(^\s*|\s*$)/g, "")
                        });
                    }
                });

                var li = id(this.id);
                    li.className = bad ? "fail" : "pass";
                    li.removeChild(li.firstChild);
                    li.appendChild(b);
                    li.appendChild(a);
                    li.appendChild(ol);
            } else
            {
                for (var i = 0; i < this.assertions.length; i++)
                {
                    if (!this.assertions[i].result)
                    {
                        bad++;
                        config.stats.bad++;
                        config.moduleStats.bad++;
                    }
                }
            }

            try
            {
                QUnit.reset();
            } catch(e)
            {
                fail("reset() failed, following Test " + this.testName + ", exception and reset fn follows", e, QUnit.reset);
            }

            QUnit.testDone({
                name: this.testName,
                failed: bad,
                passed: this.assertions.length - bad,
                total: this.assertions.length
            });
        },

        /**
         *
         */
        queue: function()
        {
            var test = this;

            synchronize(function()
            {
                test.init();
            });

            function run()
            {
                /**
                 * cada um deles pode ser assíncrono.
                 */
                synchronize(function()
                {
                    test.setup();
                });

                synchronize(function()
                {
                    test.run();
                });

                synchronize(function()
                {
                    test.teardown();
                });

                synchronize(function()
                {
                    test.finish();
                });
            }

            /**
             * Adiar quando o teste anterior for aprovado, se o armazenamento
             * estiver disponível.
             */
            var bad = QUnit.config.reorder && defined.sessionStorage && +sessionStorage.getItem("qunit-" + this.module + "-" + this.testName);

            if (bad)
            {
                run();
            } else
            {
                synchronize(run);
            };
        }
    };

    /**
     *
     */
    var QUnit = {
        /**
         * Chame no início do teste do módulo para acrescentar o
         * nome a todos os testes.
         */
        module: function(name, testEnvironment)
        {
            config.currentModule = name;
            config.currentModuleTestEnviroment = testEnvironment;
        },

        /**
         *
         */
        asyncTest: function(testName, expected, callback)
        {
            if (arguments.length === 2)
            {
                callback = expected;
                expected = 0;
            }

            QUnit.test(testName, expected, callback, true);
        },

        /**
         *
         */
        test: function(testName, expected, callback, async)
        {
            var name = '<span class="test-name">' + testName + '</span>', testEnvironmentArg;

            if (arguments.length === 2)
            {
                callback = expected;
                expected = null;
            }

            /**
             * O segundo argumento é um testEnvironment ?
             */
            if (expected && typeof expected === 'object')
            {
                testEnvironmentArg = expected;
                expected = null;
            }

            if (config.currentModule)
            {
                name = '<span class="module-name">' + config.currentModule + "</span>: " + name;
            }

            if (!validTest(config.currentModule + ": " + testName))
            {
                return;
            }

            var test = new Test(name, testName, expected, testEnvironmentArg, async, callback);
                test.module = config.currentModule;
                test.moduleTestEnvironment = config.currentModuleTestEnviroment;
                test.queue();
        },

        /**
         * Especifique o número de asserções esperadas para garantir
         * que o teste que falhou (nenhuma asserção é executada) não
         * escape.
         */
        expect: function(asserts)
        {
            config.current.expected = asserts;
        },

        /**
         * Asserts true.
         *
         * @example ok("asdfasdf".length > 5, "Deve haver pelo menos 5 caracteres");
         */
        ok: function(a, msg)
        {
            a = !!a;

            var details = {
                result: a,
                message: msg
            };

            msg = escapeHtml(msg);

            QUnit.log(details);
            config.current.assertions.push({
                result: a,
                message: msg
            });
        },

        /**
         * Verifica se os dois primeiros argumentos são iguais,
         * com uma mensagem opcional. Imprime valores reais e
         * esperados.
         *
         * Preferido a ok( actual == expected, message ).
         *
         * @example equal( format("Received {0} bytes.", 2), "Received 2 bytes." );
         *
         * @param Object actual.
         * @param Object expected.
         * @param String message (optional).
         */
        equal: function(actual, expected, message)
        {
            QUnit.push(expected == actual, actual, expected, message);
        },

        /**
         *
         */
        notEqual: function(actual, expected, message)
        {
            QUnit.push(expected != actual, actual, expected, message);
        },

        /**
         *
         */
        deepEqual: function(actual, expected, message)
        {
            QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
        },

        /**
         *
         */
        notDeepEqual: function(actual, expected, message)
        {
            QUnit.push(!QUnit.equiv(actual, expected), actual, expected, message);
        },

        /**
         *
         */
        strictEqual: function(actual, expected, message)
        {
            QUnit.push(expected === actual, actual, expected, message);
        },

        /**
         *
         */
        notStrictEqual: function(actual, expected, message)
        {
            QUnit.push(expected !== actual, actual, expected, message);
        },

        /**
         *
         */
        raises: function(block, expected, message)
        {
            var actual, ok = false;

            if (typeof expected === 'string')
            {
                message = expected;
                expected = null;
            }

            try
            {
                block();
            } catch (e)
            {
                actual = e;
            }

            if (actual)
            {
                /**
                 * Não queremos validar o erro gerado.
                 */
                if (!expected)
                {
                    ok = true;

                    /**
                     * Esperado é um regexp.
                     */
                } else if (QUnit.objectType(expected) === "regexp")
                {
                    ok = expected.test(actual);

                    /**
                     * Esperado é um construtor.
                     */
                } else if (actual instanceof expected)
                {
                    ok = true;

                    /**
                     * Esperado é uma função de validação que retorna
                     * true se a validação for aprovada.
                     */
                } else if (expected.call({}, actual) === true)
                {
                    ok = true;
                }
            }

            QUnit.ok(ok, message);
        },

        /**
         *
         */
        start: function()
        {
            config.semaphore--;

            if (config.semaphore > 0)
            {
                /**
                 * Não comece até que haja um número igual de chamadas
                 * de parada.
                 */
                return;
            }

            if (config.semaphore < 0)
            {
                /**
                 * Ignore se start for chamado com mais frequência
                 * do que stop.
                 */
                config.semaphore = 0;
            }

            /**
             * Um pequeno atraso, para evitar callbacks atuais.
             */
            if (defined.setTimeout)
            {
                window.setTimeout(function()
                {
                    if (config.semaphore > 0)
                    {
                        return;
                    }

                    if (config.timeout)
                    {
                        clearTimeout(config.timeout);
                    }

                    config.blocking = false;
                    process();
                }, 13);
            } else
            {
                config.blocking = false;
                process();
            }
        },

        /**
         *
         */
        stop: function(timeout)
        {
            config.semaphore++;
            config.blocking = true;

            if (timeout && defined.setTimeout)
            {
                clearTimeout(config.timeout);
                config.timeout = window.setTimeout(function()
                {
                    QUnit.ok(false, "Test timed out");
                    QUnit.start();
                }, timeout);
            }
        }
    };

    /**
     * Compatibilidade com versões anteriores, obsoleto.
     */
    QUnit.equals = QUnit.equal;
    QUnit.same = QUnit.deepEqual;

    /**
     * Manter o estado interno.
     */
    var config = {
        /**
         * A fila de testes a serem executados.
         */
        queue: [],

        /**
         * Bloquear até que o documento esteja pronto.
         */
        blocking: true,

        /**
         * Quando ativado, mostrar apenas testes com falha persiste
         * por meio do sessionStorage e pode ser alterado na IU por
         * meio da caixa de seleção.
         */
        hidepassed: false,

        /**
         * Por padrão, execute primeiro os testes que falharam
         * anteriormente, muito útil em combinação com a opção
         * "Ocultar testes aprovados" marcada.
         */
        reorder: true,

        /**
         * Por padrão, modifique document.title quando o conjunto
         * estiver concluído.
         */
        altertitle: true,

        /**
         *
         */
        urlConfig: [
            "noglobals",
            "notrycatch"
        ]
    };

    /**
     * Carregar parâmetros.
     */
    (function()
    {
        var location = window.location || { search: "", protocol: "file:" },
            params = location.search.slice( 1 ).split( "&" ),
            length = params.length,
            urlParams = {},
            current;

        if (params[0])
        {
            for (var i = 0; i < length; i++)
            {
                current = params[i].split("=");
                current[0] = decodeURIComponent(current[0]);

                /**
                 * Permitir apenas uma chave para ativar um sinalizador,
                 * por exemplo, test.html?noglobals.
                 */
                current[1] = current[1] ? decodeURIComponent(current[1]) : true;
                urlParams[current[0]] = current[1];
            }
        }

        QUnit.urlParams = urlParams;
        config.filter = urlParams.filter;

        /**
         * Descubra se estamos executando os testes em um
         * servidor ou não.
         */
        QUnit.isLocal = !!(location.protocol === 'file:');
    })();

    /**
     * Exponha a API como variáveis globais, a menos que exista
     * um objeto de 'exportação'; nesse caso, assumimos que
     * estamos em CommonJS.
     */
    if (typeof exports === "undefined" || typeof require === "undefined")
    {
        extend(window, QUnit);
        window.QUnit = QUnit;
    } else
    {
        extend(exports, QUnit);
        exports.QUnit = QUnit;
    }

    /**
     * Defina-os após expor globais para mantê-los apenas
     * neste namespace QUnit.
     */
    extend(QUnit, {
        /**
         *
         */
        config: config,

        /**
         * Inicialize as opções de configuração.
         */
        init: function()
        {
            extend(config, {
                stats: {
                    all: 0,
                    bad: 0
                },

                moduleStats: {
                    all: 0,
                    bad: 0
                },

                started: +new Date,
                updateRate: 1000,
                blocking: false,
                autostart: true,
                autorun: false,
                filter: "",
                queue: [],
                semaphore: 0
            });

            var tests = id("qunit-tests"),
                banner = id("qunit-banner"),
                result = id("qunit-testresult");

            if (tests)
            {
                tests.innerHTML = "";
            }

            if (banner)
            {
                banner.className = "";
            }

            if (result)
            {
                result.parentNode.removeChild(result);
            }

            if (tests)
            {
                result = document.createElement( "p" );
                result.id = "qunit-testresult";
                result.className = "result";
                tests.parentNode.insertBefore( result, tests );
                result.innerHTML = 'Running...<br/>&nbsp;';
            }
        },

        /**
         * Redefine a configuração do teste. Útil para testes
         * que modificam o DOM. Se o jQuery estiver disponível,
         * use o html() do jQuery, caso contrário, apenas o
         * innerHTML.
         */
        reset: function()
        {
            if (window.jQuery)
            {
                jQuery("#qunit-fixture").html(config.fixture);
            } else
            {
                var main = id("qunit-fixture");

                if (main)
                {
                    main.innerHTML = config.fixture;
                }
            }
        },

        /**
         * Acione um evento em um elemento.
         *
         * @example triggerEvent( document.body, "click" );
         *
         * @param DOMElement elem
         * @param String type
         */
        triggerEvent: function(elem, type, event)
        {
            if (document.createEvent)
            {
                event = document.createEvent("MouseEvents");
                event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                elem.dispatchEvent( event );
            } else if (elem.fireEvent)
            {
                elem.fireEvent("on" + type);
            }
        },

        /**
         * Verificação segura do tipo de objeto.
         */
        is: function(type, obj)
        {
            return QUnit.objectType(obj) == type;
        },

        /**
         *
         */
        objectType: function(obj)
        {
            if (typeof obj === "undefined")
            {
                return "undefined";

                /**
                 * considerar: typeof null === object.
                 */
            }

            if (obj === null)
            {
                return "null";
            }

            var type = Object.prototype.toString.call(obj)
                .match(/^\[object\s(.*)\]$/)[1] || '';

            switch (type)
            {
                case 'Number':
                    if (isNaN(obj))
                    {
                        return "nan";
                    } else
                    {
                        return "number";
                    }

                case 'String':
                case 'Boolean':
                case 'Array':
                case 'Date':
                case 'RegExp':
                case 'Function':
                    return type.toLowerCase();
            }

            if (typeof obj === "object")
            {
                return "object";
            }

            return undefined;
        },

        /**
         *
         */
        push: function(result, actual, expected, message)
        {
            var details = {
                result: result,
                message: message,
                actual: actual,
                expected: expected
            };

            message = escapeHtml(message) || (result ? "okay" : "failed");
            message = '<span class="test-message">' + message + "</span>";
            expected = escapeHtml(QUnit.jsDump.parse(expected));
            actual = escapeHtml(QUnit.jsDump.parse(actual));

            var output = message + '<table><tr class="test-expected"><th>Expected: </th><td><pre>' + expected + '</pre></td></tr>';
            if (actual != expected)
            {
                output += '<tr class="test-actual"><th>Result: </th><td><pre>' + actual + '</pre></td></tr>';
                output += '<tr class="test-diff"><th>Diff: </th><td><pre>' + QUnit.diff(expected, actual) +'</pre></td></tr>';
            }

            if (!result)
            {
                var source = sourceFromStacktrace();
                if (source)
                {
                    details.source = source;
                    output += '<tr class="test-source"><th>Source: </th><td><pre>' + escapeHtml(source) + '</pre></td></tr>';
                }
            }

            /**
             *
             */
            output += "</table>";

            /**
             *
             */
            QUnit.log(details);

            /**
             *
             */
            config.current.assertions.push({
                result: !!result,
                message: output
            });
        },

        /**
         *
         */
        url: function(params)
        {
            params = extend(extend({}, QUnit.urlParams), params);

            var querystring = "?",
                key;

            for (key in params)
            {
                querystring += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
            }

            return window.location.pathname + querystring.slice(0, -1);
        },

        /**
         *
         */
        extend: extend,

        /**
         *
         */
        id: id,

        /**
         *
         */
        addEvent: addEvent,

        /**
         * Registrando callbacks; todos recebem um único argumento
         * com as propriedades listadas, execute test/logs.html
         * para quaisquer alterações relacionadas.
         */
        begin: function()
        {
        },

        /**
         * done: {
         *     failed,
         *     passed,
         *     total,
         *     runtime
         * }.
         */
        done: function()
        {
        },

        /**
         * log: {
         *     result,
         *     actual,
         *     expected,
         *     message
         * }.
         */
        log: function()
        {
        },

        /**
         * testStart: {
         *     name
         * }.
         */
        testStart: function()
        {
        },

        /**
         * testDone: {
         *     name,
         *     failed,
         *     passed,
         *     total
         * }.
         */
        testDone: function()
        {
        },

        /**
         * moduleStart: {
         *     name
         * }.
         */
        moduleStart: function()
        {
        },

        /**
         * moduleDone: {
         *     name,
         *     failed,
         *     passed,
         *     total
         * }.
         */
        moduleDone: function()
        {
        }
    });

    /**
     *
     */
    if (typeof document === "undefined" || document.readyState === "complete")
    {
        config.autorun = true;
    }

    /**
     *
     */
    QUnit.load = function()
    {
        QUnit.begin({});

        /**
         * Inicialize a configuração, salvando a fila de execução.
         */
        var oldconfig = extend({}, config);

        /**
         *
         */
        QUnit.init();
        extend(config, oldconfig);
        config.blocking = false;

        /**
         *
         */
        var urlConfigHtml = "",
            len = config.urlConfig.length;

        for (var i = 0, val; i < len, val = config.urlConfig[i]; i++)
        {
            config[val] = QUnit.urlParams[val];
            urlConfigHtml += '<label><input name="' + val + '" type="checkbox"' + ( config[val] ? ' checked="checked"' : '' ) + '>' + val + '</label>';
        }

        var userAgent = id("qunit-userAgent");
        if (userAgent)
        {
            userAgent.innerHTML = navigator.userAgent;
        }

        var banner = id("qunit-header");
        if (banner)
        {
            banner.innerHTML = '<a href="' + QUnit.url({
                filter: undefined
            }) + '"> ' + banner.innerHTML + '</a> ' + urlConfigHtml;

            addEvent(banner, "change", function(event)
            {
                var params = {};
                    params[
                        event.target.name
                    ] = event.target.checked ? true : undefined;

                window.location = QUnit.url(params);
            });
        }

        /**
         *
         */
        var toolbar = id("qunit-testrunner-toolbar");

        /**
         *
         */
        if (toolbar)
        {
            var filter = document.createElement("input");
                filter.type = "checkbox";
                filter.id = "qunit-filter-pass";

            addEvent(filter, "click", function()
            {
                var ol = document.getElementById("qunit-tests");

                if (filter.checked)
                {
                    ol.className = ol.className + " hidepass";
                } else
                {
                    var tmp = " " + ol.className.replace(/[\n\t\r]/g, " ") + " ";
                        ol.className = tmp.replace(/ hidepass /, " ");
                }

                if (defined.sessionStorage)
                {
                    if (filter.checked)
                    {
                        sessionStorage.setItem("qunit-filter-passed-tests", "true");
                    } else
                    {
                        sessionStorage.removeItem("qunit-filter-passed-tests");
                    }
                }
            });

            if (config.hidepassed || defined.sessionStorage && sessionStorage.getItem("qunit-filter-passed-tests"))
            {
                filter.checked = true;

                var ol = document.getElementById("qunit-tests");
                    ol.className = ol.className + " hidepass";
            }

            /**
             *
             */
            toolbar.appendChild(filter);

            /**
             *
             */
            var label = document.createElement("label");
                label.setAttribute("for", "qunit-filter-pass");
                label.innerHTML = "Hide passed tests";

            /**
             *
             */
            toolbar.appendChild(label);
        }

        var main = id("qunit-fixture");
        if (main)
        {
            config.fixture = main.innerHTML;
        }

        if (config.autostart)
        {
            QUnit.start();
        }
    };

    /**
     *
     */
    addEvent(window, "load", QUnit.load);

    /**
     *
     */
    function done()
    {
        config.autorun = true;

        /**
         * Registre os últimos resultados do módulo.
         */
        if (config.currentModule)
        {
            QUnit.moduleDone( {
                name: config.currentModule,
                failed: config.moduleStats.bad,
                passed: config.moduleStats.all - config.moduleStats.bad,
                total: config.moduleStats.all
            });
        }

        var banner = id("qunit-banner"),
            tests = id("qunit-tests"),
            runtime = +new Date - config.started,
            passed = config.stats.all - config.stats.bad,
            html = [
                "Tests completed in ",
                runtime,

                ' milliseconds.<br/>',
                '<span class="passed">',
                passed,

                '</span> tests of <span class="total">',
                config.stats.all,

                '</span> passed, <span class="failed">',
                config.stats.bad,

                '</span> failed.'
            ].join('');

        if (banner)
        {
            banner.className = (config.stats.bad ? "qunit-fail" : "qunit-pass");
        }

        if (tests)
        {
            id("qunit-testresult").innerHTML = html;
        }

        if (config.altertitle && typeof document !== "undefined" && document.title)
        {
            /**
             * Mostre ✖ para sempre, ✔ para resultado ruim do
             * conjunto no título, use sequências de escape caso
             * o arquivo seja carregado com conjunto de caracteres
             * não utf-8.
             */
            document.title = [
                (config.stats.bad ? "\u2716" : "\u2714"),
                document.title.replace(/^[\u2714\u2716] /i, "")
            ].join(" ");
        }

        QUnit.done({
            failed: config.stats.bad,
            passed: passed,
            total: config.stats.all,
            runtime: runtime
        });
    }

    /**
     *
     */
    function validTest(name)
    {
        var filter = config.filter,
            run = false;

        if (!filter)
        {
            return true;
        }

        var not = filter.charAt( 0 ) === "!";
        if (not)
        {
            filter = filter.slice(1);
        }

        if (name.indexOf(filter) !== -1)
        {
            return !not;
        }

        if (not)
        {
            run = true;
        }

        return run;
    }

    /**
     * Até agora suporta apenas Firefox, Chrome e
     * Opera (buggy) podendo ser estendido no futuro
     * para usar algo como https://github.com/csnover/TraceKit.
     */
    function sourceFromStacktrace()
    {
        try
        {
            throw new Error();
        } catch (e)
        {
            if (e.stacktrace)
            {
                /**
                 * Opera.
                 */
                return e.stacktrace.split("\n")[6];
            } else if (e.stack)
            {
                /**
                 * Firefox, Chrome.
                 */
                return e.stack.split("\n")[4];
            } else if (e.sourceURL)
            {
                /**
                 * Safari, PhantomJS.
                 * TODO sourceURL aponta para a linha 'lançar novo erro'
                 * acima, inútil.
                 *
                 * return e.sourceURL + ":" + e.line;
                 */
            }
        }
    }

    /**
     *
     */
    function escapeHtml(s)
    {
        if (!s)
        {
            return "";
        }

        s = s + "";
        return s.replace(/[\&"<>\\]/g, function(s)
        {
            switch(s)
            {
                case "&":
                    return "&amp;";

                case "\\":
                    return "\\\\";

                case '"':
                    return '\"';

                case "<":
                    return "&lt;";

                case ">":
                    return "&gt;";

                default:
                    return s;
            }
        });
    }

    /**
     *
     */
    function synchronize(callback)
    {
        config.queue.push(callback);

        if (config.autorun && !config.blocking)
        {
            process();
        }
    }

    /**
     *
     */
    function process()
    {
        var start = (new Date()).getTime();

        while (config.queue.length && !config.blocking)
        {
            if (config.updateRate <= 0 || (((new Date()).getTime() - start) < config.updateRate))
            {
                config.queue.shift()();
            } else
            {
                window.setTimeout(process, 13);
                break;
            }
        }

        if (!config.blocking && !config.queue.length)
        {
            done();
        }
    }

    /**
     *
     */
    function saveGlobal()
    {
        config.pollution = [];

        if (config.noglobals)
        {
            for (var key in window)
            {
                config.pollution.push(key);
            }
        }
    }

    /**
     *
     */
    function checkPollution(name)
    {
        var old = config.pollution;
            saveGlobal();

        var newGlobals = diff(config.pollution, old);
        if (newGlobals.length > 0)
        {
            ok(false, "Introduced global variable(s): " + newGlobals.join(", "));
        }

        var deletedGlobals = diff(old, config.pollution);
        if (deletedGlobals.length > 0)
        {
            ok(false, "Deleted global variable(s): " + deletedGlobals.join(", "));
        }
    }

    /**
     * Retorna um novo vetor com os elementos que estão
     * em a mas não em b.
     */
    function diff(a, b)
    {
        var result = a.slice();

        for (var i = 0; i < result.length; i++)
        {
            for (var j = 0; j < b.length; j++)
            {
                if (result[i] === b[j])
                {
                    result.splice(i, 1);
                    i--;

                    break;
                }
            }
        }

        return result;
    }

    /**
     *
     */
    function fail(message, exception, callback)
    {
        if (typeof console !== "undefined" && console.error && console.warn)
        {
            console.error(message);
            console.error(exception);
            console.warn(callback.toString());
        } else if (window.opera && opera.postError)
        {
            opera.postError(message, exception, callback.toString);
        }
    }

    /**
     *
     */
    function extend(a, b)
    {
        for (var prop in b)
        {
            if (b[prop] === undefined)
            {
                delete a[prop];
            } else
            {
                a[prop] = b[prop];
            }
        }

        return a;
    }

    /**
     *
     */
    function addEvent(elem, type, fn)
    {
        if (elem.addEventListener)
        {
            elem.addEventListener(type, fn, false);
        } else if (elem.attachEvent)
        {
            elem.attachEvent("on" + type, fn);
        } else
        {
            fn();
        }
    }

    /**
     *
     */
    function id(name)
    {
        return !!(typeof document !== "undefined" && document && document.getElementById) && document.getElementById(name);
    }

    /**
     * Teste a igualdade de qualquer tipo de JavaScript.
     * Discussões e referências: http://philrathe.com/articles/equiv.
     * Conjuntos de testes: http://philrathe.com/tests/equiv.
     */
    QUnit.equiv = function()
    {
        /**
         * A função equivalente real.
         */
        var innerEquiv;

        /**
         * Stack para decidir entre funções pular/abortar.
         */
        var callers = [];

        /**
         * Stack para evitar loops de referência circular.
         */
        var parents = [];

        /**
         * Chame o callback relacionado com os argumentos fornecidos.
         */
        function bindCallbacks(o, callbacks, args)
        {
            var prop = QUnit.objectType(o);
            if (prop)
            {
                if (QUnit.objectType(callbacks[prop]) === "function")
                {
                    return callbacks[prop].apply(callbacks, args);
                } else
                {
                    /**
                     * Ou undefined.
                     */
                    return callbacks[prop];
                }
            }
        }

        /**
         *
         */
        var callbacks = function()
        {
            /**
             * Para string, boolean, number e null.
             */
            function useStrictEquality(b, a)
            {
                if (b instanceof a.constructor || a instanceof b.constructor)
                {
                    /**
                     * Para capturar uma anotação curta VS 'nova'
                     * anotação de uma declaração.
                     * Exemplo:
                     *     var i = 1;
                     *     var j = new Number(1);
                     */
                    return a == b;
                } else
                {
                    return a === b;
                }
            }

            return {
                "string" : useStrictEquality,
                "boolean" : useStrictEquality,
                "number" : useStrictEquality,
                "null" : useStrictEquality,
                "undefined" : useStrictEquality,

                /**
                 *
                 */
                "nan" : function(b)
                {
                    return isNaN(b);
                },

                /**
                 *
                 */
                "date" : function(b, a)
                {
                    return QUnit.objectType(b) === "date" && a.valueOf() === b.valueOf();
                },

                /**
                 *
                 */
                "regexp" : function(b, a)
                {
                    return QUnit.objectType(b) === "regexp"
                        /**
                         * O próprio regex.
                         */
                        && a.source === b.source &&

                        /**
                         * E seus modificadores.
                         */
                        a.global === b.global &&

                        /**
                         * (gmi)...
                         */
                        a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
                },

                /**
                 * - pule quando a propriedade for um método de uma
                 *   instância (OOP).
                 * - abortar caso contrário,
                 *
                 * inicial === teria capturado referências idênticas
                 * de qualquer forma.
                 */
                "function" : function()
                {
                    var caller = callers[callers.length - 1];

                    return caller !== Object && typeof caller !== "undefined";
                },

                /**
                 *
                 */
                "array" : function(b, a)
                {
                    var i, j, loop;
                    var len;

                    /**
                     * b poderia ser um objeto literal aqui.
                     */
                    if (!(QUnit.objectType(b) === "array"))
                    {
                        return false;
                    }

                    len = a.length;
                    if (len !== b.length)
                    {
                        /**
                         * Seguro e mais rápido.
                         */

                        return false;
                    }

                    /**
                     * Referência de trilha para evitar referências circulares.
                     */
                    parents.push(a);

                    for (i = 0; i < len; i++)
                    {
                        loop = false;
                        for (j = 0; j < parents.length; j++)
                        {
                            if (parents[j] === a[i])
                            {
                                /**
                                 * não repasse o vetor.
                                 */
                                loop = true;
                            }
                        }

                        if (!loop && !innerEquiv(a[i], b[i]))
                        {
                            parents.pop();

                            return false;
                        }
                    }

                    parents.pop();

                    return true;
                },

                /**
                 *
                 */
                "object" : function(b, a)
                {
                    var i, j, loop;

                    /**
                     * A menos que possamos provar isso.
                     */
                    var eq = true;

                    /**
                     * Coleção de strings.
                     */
                    var aProperties = [],
                        bProperties = [];

                    /**
                     * Comparar construtores é mais rigoroso do que usar
                     * instanceof.
                     */
                    if (a.constructor !== b.constructor)
                    {
                        return false;
                    }

                    /**
                     * construtor de stack antes de percorrer as
                     * propriedades.
                     */
                    callers.push(a.constructor);

                    /**
                     * Referência de trilha para evitar referências circulares.
                     */
                    parents.push(a);

                    /**
                     * Seja rigoroso: não garanta hasOwnProperty e vá fundo.
                     */
                    for (i in a)
                    {
                        loop = false;
                        for (j = 0; j < parents.length; j++)
                        {
                            if (parents[j] === a[i])
                            {
                                /**
                                 * Não siga o mesmo caminho duas vezes.
                                 */
                                loop = true;
                            }
                        }

                        /**
                         * Coletar as propriedades de a.
                         */
                        aProperties.push(i);

                        if (!loop && !innerEquiv(a[i], b[i]))
                        {
                            eq = false;
                            break;
                        }
                    }

                    /**
                     * Desempilhar, terminamos.
                     */
                    callers.pop();
                    parents.pop();

                    for (i in b)
                    {
                        /**
                         * Coletar as propriedades de b.
                         */
                        bProperties.push(i);
                    }

                    /**
                     * Garante nomes de propriedades idênticos.
                     */
                    return eq && innerEquiv(aProperties.sort(), bProperties.sort());
                }
            };
        }();

        /**
         *
         */
        innerEquiv = function()
        {
            /**
             * Pode receber vários argumentos.
             */
            var args = Array.prototype.slice.apply(arguments);
            if (args.length < 2)
            {
                /**
                 * Transição final
                 */
                return true;
            }

            return (function(a, b)
            {
                if (a === b)
                {
                    /**
                     * Pegue o máximo que puder.
                     */
                    return true;
                } else if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || QUnit.objectType(a) !== QUnit.objectType(b))
                {
                    /**
                     * Não perca tempo com casos propensos a erros.
                     */
                    return false;
                } else
                {
                    return bindCallbacks(a, callbacks, [b, a]);
                }

                /**
                 * Aplique transição com argumentos (1..n).
                 */
            })(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length - 1));
        };

        return innerEquiv;
    }();

    /**
     * jsDump.
     *
     * @projectDescription Despejo de dados avançado e extensível para Javascript.
     * @version 1.0.0.
     */
    QUnit.jsDump = (function()
    {
        /**
         *
         */
        function quote(str)
        {
            return '"' + str.toString().replace(/"/g, '\\"') + '"';
        };

        /**
         *
         */
        function literal(o)
        {
            return o + '';
        };

        /**
         *
         */
        function join(pre, arr, post)
        {
            var s = jsDump.separator(),
                base = jsDump.indent(),
                inner = jsDump.indent(1);

            if (arr.join)
            {
                arr = arr.join(',' + s + inner);
            }

            if (!arr)
            {
                return pre + post;
            }

            return [
                pre,
                inner + arr,
                base + post
            ].join(s);
        };

        /**
         *
         */
        function array(arr, stack)
        {
            var i = arr.length, ret = Array(i);
                this.up();

            while (i--)
            {
                ret[i] = this.parse(arr[i] , undefined , stack);
            }

            this.down();

            return join( '[', ret, ']' );
        };

        var reName = /^function (\w+)/;
        var jsDump = {
            /**
             *
             */
            parse:function(obj, type, stack)
            {
                /**
                 * Type é usado principalmente internamente, você pode
                 * corrigir um tipo (personalizado) antecipadamente.
                 */
                stack = stack || [];

                var parser = this.parsers[type || this.typeOf(obj)];
                    type = typeof parser;

                var inStack = inArray(obj, stack);
                if (inStack != -1)
                {
                    return 'recursion('+(inStack - stack.length)+')';
                }

                /**
                 * Questão: else ?.
                 */

                if (type == 'function')
                {
                    stack.push(obj);

                    var res = parser.call(this, obj, stack);
                        stack.pop();

                    return res;
                }

                /**
                 * Questão: else ?
                 */
                return (type == 'string') ? parser : this.parsers.error;
            },

            /**
             *
             */
            typeOf:function(obj)
            {
                var type;

                if (obj === null)
                {
                    type = "null";
                } else if (typeof obj === "undefined")
                {
                    type = "undefined";
                } else if (QUnit.is("RegExp", obj))
                {
                    type = "regexp";
                } else if (QUnit.is("Date", obj))
                {
                    type = "date";
                } else if (QUnit.is("Function", obj))
                {
                    type = "function";
                } else if (typeof obj.setInterval !== undefined && typeof obj.document !== "undefined" && typeof obj.nodeType === "undefined")
                {
                    type = "window";
                } else if (obj.nodeType === 9)
                {
                    type = "document";
                } else if (obj.nodeType)
                {
                    type = "node";
                } else if (typeof obj === "object" && typeof obj.length === "number" && obj.length >= 0)
                {
                    type = "array";
                } else
                {
                    type = typeof obj;
                }

                return type;
            },

            /**
             *
             */
            separator:function()
            {
                return this.multiline ?	this.HTML ? '<br />' : '\n' : this.HTML ? '&nbsp;' : ' ';
            },

            /**
             *
             */
            indent:function(extra)
            {
                /**
                 * Extra pode ser um número, atalho para aumentar-chamar-diminuir.
                 */
                if (!this.multiline)
                {
                    return "";
                }

                var chr = this.indentChar;
                if (this.HTML)
                {
                    chr = chr.replace(/\t/g,'   ').replace(/ /g,'&nbsp;');
                }

                return Array(this._depth_ + (extra || 0)).join(chr);
            },

            /**
             *
             */
            up:function(a)
            {
                this._depth_ += a || 1;
            },

            /**
             *
             */
            down:function(a)
            {
                this._depth_ -= a || 1;
            },

            /**
             *
             */
            setParser:function(name, parser)
            {
                this.parsers[name] = parser;
            },

            /**
             * Os próximos 3 estão expostos para que você possa usá-los.
             */
            quote:quote,
            literal:literal,
            join:join,

            /**
             *
             */
            _depth_: 1,

            /**
             * Esta é a lista de analisadores, para modificá-los,
             * use jsDump.setParser.
             */
            parsers:{
                /**
                 *
                 */
                window: '[Window]',

                /**
                 *
                 */
                document: '[Document]',

                /**
                 * Quando nenhum analisador for encontrado, isso não
                 * deveria acontecer.
                 */
                error:'[ERROR]',

                /**
                 *
                 */
                unknown: '[Unknown]',

                /**
                 *
                 */
                'null':'null',

                /**
                 *
                 */
                'undefined':'undefined',

                /**
                 *
                 */
                'function':function(fn)
                {
                    var ret = 'function',
                        /**
                         * Funções nunca têm nome no IE.
                         */
                        name = 'name' in fn ? fn.name : (reName.exec(fn)||[])[1];

                    if (name)
                    {
                        ret += ' ' + name;
                    }

                    ret += '(';
                    ret = [ret, QUnit.jsDump.parse(fn, 'functionArgs'), '){'].join('');

                    return join(ret, QUnit.jsDump.parse(fn,'functionCode'), '}');
                },

                /**
                 *
                 */
                array: array,

                /**
                 *
                 */
                nodelist: array,

                /**
                 *
                 */
                arguments: array,

                /**
                 *
                 */
                object:function(map, stack)
                {
                    var ret = [];

                    QUnit.jsDump.up();
                    for (var key in map)
                    {
                        var val = map[key];
                            ret.push( QUnit.jsDump.parse(key, "key") + ': ' + QUnit.jsDump.parse(val, undefined, stack));
                    }

                    /**
                     *
                     */
                    QUnit.jsDump.down();

                    /**
                     *
                     */
                    return join('{', ret, '}');
                },

                /**
                 *
                 */
                node:function(node)
                {
                    var open = QUnit.jsDump.HTML ? '&lt;' : '<',
                        close = QUnit.jsDump.HTML ? '&gt;' : '>';

                    var tag = node.nodeName.toLowerCase(),
                        ret = open + tag;

                    for (var a in QUnit.jsDump.DOMAttrs)
                    {
                        var val = node[QUnit.jsDump.DOMAttrs[a]];

                        if (val)
                        {
                            ret += ' ' + a + '=' + QUnit.jsDump.parse(val, 'attribute');
                        }
                    }

                    return ret + close + open + '/' + tag + close;
                },

                /**
                 *
                 */
                functionArgs:function(fn)
                {
                    /**
                     * Função chama internamente, são os argumentos que
                     * fazem parte da função.
                     */

                    var l = fn.length;
                    if (!l)
                    {
                        return '';
                    }

                    var args = Array(l);
                    while (l--)
                    {
                        /**
                         * 97 é 'a'.
                         */
                        args[l] = String.fromCharCode(97 + l);
                    }

                    return ' ' + args.join(', ') + ' ';
                },

                /**
                 * object chama internamente, a parte principal de
                 * um item em um mapa.
                 */
                key:quote,

                /**
                 * function chama internamente, é o conteúdo da função.
                 */
                functionCode:'[code]',

                /**
                 * node chama isso internamente, é um valor de
                 * atributo html.
                 */
                attribute:quote,

                /**
                 *
                 */
                string:quote,

                /**
                 *
                 */
                date:quote,

                /**
                 * regex.
                 */
                regexp:literal,

                /**
                 *
                 */
                number:literal,

                /**
                 *
                 */
                'boolean':literal
            },

            /**
             *
             */
            DOMAttrs: {
                /**
                 * atributos para despejar dos nodes, name => realName.
                 */
                id:'id',

                /**
                 *
                 */
                name:'name',

                /**
                 *
                 */
                'class':'className'
            },

            /**
             * se for verdade, as entidades são escapadas
             * ( <, >, \t, space and \n ).
             */
            HTML: false,

            /**
             * Unidade de recuo.
             */
            indentChar:'  ',

            /**
             * Se for verdade, os itens de uma coleção são separados
             * por \n, caso contrário, apenas um espaço.
             */
            multiline: true
        };

        return jsDump;
    })();

    /**
     * Do Sizzle.js.
     */
    function getText(elems)
    {
        var ret = "", elem;

        for (var i = 0; elems[i]; i++)
        {
            elem = elems[i];

            /**
             * Obtenha o texto dos nós de texto e dos nós CDATA.
             */
            if (elem.nodeType === 3 || elem.nodeType === 4)
            {
                ret += elem.nodeValue;

                /**
                 * Percorra todo o resto, exceto os nós de comentários.
                 */
            } else if (elem.nodeType !== 8)
            {
                ret += getText(elem.childNodes);
            }
        }

        return ret;
    };

    /**
     * Do jquery.js.
     */
    function inArray(elem, array)
    {
        if (array.indexOf)
        {
            return array.indexOf(elem);
        }

        for (var i = 0, length = array.length; i < length; i++)
        {
            if (array[i] === elem)
            {
                return i;
            }
        }

        return -1;
    }

    /**
     * Javascript Diff Algorithm.
     *
     * Uso:
     *     QUnit.diff(expected, actual);.
     *     QUnit.diff("the quick brown fox jumped over", "the quick fox jumps over") == "the  quick <del>brown </del> fox <del>jumped </del><ins>jumps </ins> over";.
     */
    QUnit.diff = (function()
    {
        /**
         *
         */
        function diff(o, n)
        {
            var ns = {};
            var os = {};

            for (var i = 0; i < n.length; i++)
            {
                if (ns[n[i]] == null)
                {
                    ns[n[i]] = {
                        rows: [],
                        o: null
                    };
                }

                ns[n[i]].rows.push(i);
            }

            for (var i = 0; i < o.length; i++)
            {
                if (os[o[i]] == null)
                {
                    os[o[i]] = {
                        rows: [],
                        n: null
                    };
                }

                os[o[i]].rows.push(i);
            }

            for (var i in ns)
            {
                if (ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1)
                {
                    n[ns[i].rows[0]] = {
                        text: n[ns[i].rows[0]],
                        row: os[i].rows[0]
                    };

                    o[os[i].rows[0]] = {
                        text: o[os[i].rows[0]],
                        row: ns[i].rows[0]
                    };
                }
            }

            for (var i = 0; i < n.length - 1; i++)
            {
                if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null && n[i + 1] == o[n[i].row + 1])
                {
                    n[i + 1] = {
                        text: n[i + 1],
                        row: n[i].row + 1
                    };

                    o[n[i].row + 1] = {
                        text: o[n[i].row + 1],
                        row: i + 1
                    };
                }
            }

            for (var i = n.length - 1; i > 0; i--)
            {
                if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null && n[i - 1] == o[n[i].row - 1])
                {
                    n[i - 1] = {
                        text: n[i - 1],
                        row: n[i].row - 1
                    };

                    o[n[i].row - 1] = {
                        text: o[n[i].row - 1],
                        row: i - 1
                    };
                }
            }

            return {
                o: o,
                n: n
            };
        }

        /**
         *
         */
        return function(o, n)
        {
            o = o.replace(/\s+$/, '');
            n = n.replace(/\s+$/, '');

            var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));
            var str = "";

            var oSpace = o.match(/\s+/g);
            if (oSpace == null)
            {
                oSpace = [" "];
            } else
            {
                oSpace.push(" ");
            }

            var nSpace = n.match(/\s+/g);
            if (nSpace == null)
            {
                nSpace = [" "];
            } else
            {
                nSpace.push(" ");
            }

            if (out.n.length == 0)
            {
                for (var i = 0; i < out.o.length; i++)
                {
                    str += '<del>' + out.o[i] + oSpace[i] + "</del>";
                }
            } else
            {
                if (out.n[0].text == null)
                {
                    for (n = 0; n < out.o.length && out.o[n].text == null; n++)
                    {
                        str += '<del>' + out.o[n] + oSpace[n] + "</del>";
                    }
                }

                for (var i = 0; i < out.n.length; i++)
                {
                    if (out.n[i].text == null)
                    {
                        str += '<ins>' + out.n[i] + nSpace[i] + "</ins>";
                    } else
                    {
                        var pre = "";

                        for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++)
                        {
                            pre += '<del>' + out.o[n] + oSpace[n] + "</del>";
                        }

                        str += " " + out.n[i].text + nSpace[i] + pre;
                    }
                }
            }

            return str;
        };
    })();
})(this);
