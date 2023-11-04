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
    module("bootstrap-modal");

    /**
     *
     */
    test("deve ser definido no objeto jquery", function()
    {
        var div = $("<div id=\"modal-test\"></div>");

        ok(div.modal, "método modal é definido.");
    });

    /**
     *
     */
    test("deve retornar o elemento", function()
    {
        var div = $("<div id=\"modal-test\"></div>");

        ok(div.modal() == div, "elemento div devolvido.");
    });

    /**
     *
     */
    test("deve expor var padrões para configurações", function()
    {
        ok($.fn.modal.defaults, "objeto padrão exposto.");
    });

    /**
     *
     */
    test("deve ser inserido no dom quando o método show for chamado", function ()
    {
        stop();
        $.support.transition = false;

        var div = $("<div id=\"modal-test\"></div>");
            div.modal()
                .bind("shown", function ()
                {
                    ok($('#modal-test').length, "modal inserido em dom.");
                    start();
                    div.remove();
                }).modal("show");
    });

    /**
     *
     */
    test("deve ocultar modal quando ocultar é chamado", function()
    {
        stop();
        $.support.transition = false;

        var div = $("<div id=\"modal-test\"></div>");
            div.modal()
                .bind("shown", function()
                {
                    ok($("#modal-test").is(":visible"), "modal visível.");
                    ok($("#modal-test").length, "modal inserido em dom.");
                    div.modal("hide");
                })
                .bind("hidden", function()
                {
                    ok(!$("#modal-test").is(":visible"), "modal oculto.");
                    start();
                    div.remove();
                }).modal("show");
    });

    /**
     *
     */
    test("deve alternar quando toggle é chamado", function()
    {
        stop();
        $.support.transition = false;

        var div = $("<div id=\"modal-test\"></div>");
            div.modal()
                .bind("shown", function()
                {
                    ok($('#modal-test').is(":visible"), "modal visível.");
                    ok($('#modal-test').length, "modal inserido em dom.");
                    div.modal("toggle");
                })
                .bind("hidden", function()
                {
                    ok(!$("#modal-test").is(":visible"), "modal oculto.");
                    start();
                    div.remove();
                }).modal("toggle");
    });

    /**
     *
     */
    test("deve remover do dom quando clicar em .close", function()
    {
        stop();
        $.support.transition = false;

        var div = $("<div id='modal-test'><span class='close'></span></div>");
            div
                .modal()
                .bind("shown", function()
                {
                    ok($("#modal-test").is(":visible"), "modal visível.");
                    ok($("#modal-test").length, "modal inserido em dom.");
                    div.find(".close").click();
                })
                .bind("hidden", function()
                {
                    ok(!$('#modal-test').is(":visible"), "modal oculto.")
                    start()
                    div.remove()
                }).modal("toggle");
    });

    /**
     *
     */
    test("deve adicionar backdrop quando desejado", function()
    {
        stop();
        $.support.transition = false;

        var div = $("<div id=\"modal-test\"></div>");
            div
                .modal({ backdrop: true })
                .bind("shown", function()
                {
                    equal($(".modal-backdrop").length, 1, "cenário modal inserido no dom.");
                    start();
                    div.remove();
                    $(".modal-backdrop").remove();
                }).modal("show");
    });

    /**
     *
     */
    test("não deve adicionar backdrop quando não desejado", function()
    {
        stop()
        $.support.transition = false

        var div = $("<div id=\"modal-test\"></div>");
            div
                .modal({ backdrop: false })
                .bind("shown", function()
                {
                    equal($(".modal-backdrop").length, 0, "backdrop modal não inserido no dom.");
                    start();
                    div.remove();
                }).modal("show");
    });

    /**
     *
     */
    test("deve fechar o backdrop quando clicado", function()
    {
        stop()
        $.support.transition = false

        var div = $("<div id=\"modal-test\"></div>");
            div
                .modal({ backdrop: true })
                .bind("shown", function()
                {
                    equal($(".modal-backdrop").length, 1, "modal backdrop inserido no dom.");
                    $('.modal-backdrop').click();
                    equal($('.modal-backdrop').length, 0, "modal backdrop removido do dom.");
                    start();
                    div.remove();
                }).modal("show");
    });

    /**
     *
     */
    test("não deve fechar o backdrop quando o clique estiver desativado", function()
    {
        stop();
        $.support.transition = false;

        var div = $("<div id='modal-test'></div>");
            div
                .modal({ backdrop: "static" })
                .bind("shown", function()
                {
                    equal($('.modal-backdrop').length, 1, "modal backdrop inserido no dom.");
                    $('.modal-backdrop').click();
                    equal($('.modal-backdrop').length, 1, "modal backdrop ainda no dom.");
                    start();
                    div.remove();
                    $('.modal-backdrop').remove();
                }).modal("show");
    });
});
