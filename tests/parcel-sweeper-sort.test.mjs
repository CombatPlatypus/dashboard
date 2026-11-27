import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { filterParcelPackageRows } from "../js/reports/parcel-sweeper/model.js";
import {
    sortParcelPackageRows,
    toggleParcelPackageSort,
} from "../js/reports/parcel-sweeper/table-sort.js";

test("ordenação alterna crescente/decrescente e reinicia ao escolher outra coluna", () => {
    const first = Object.freeze(toggleParcelPackageSort(null, "operator"));
    assert.deepEqual(first, { column: "operator", direction: "asc" });
    const second = toggleParcelPackageSort(first, "operator");
    assert.deepEqual(second, { column: "operator", direction: "desc" });
    assert.deepEqual(toggleParcelPackageSort(second, "operator"), first);
    assert.deepEqual(toggleParcelPackageSort(second, "trackingNumber"), {
        column: "trackingNumber", direction: "asc",
    });
    assert.equal(toggleParcelPackageSort(first, "invalid"), first);
    assert.equal(toggleParcelPackageSort(null, "invalid"), null);
});

test("códigos BR usam ordem natural, sem alterar o arquivo nem linhas empatadas", () => {
    const rows = Object.freeze([
        { trackingNumber: "BR10", id: 1 }, { trackingNumber: "BR2", id: 2 },
        { trackingNumber: "br2", id: 3 }, { trackingNumber: "BR1", id: 4 },
    ].map(Object.freeze));
    const sort = { column: "trackingNumber", direction: "asc" };
    assert.deepEqual(sortParcelPackageRows(rows, sort).map(row => row.id), [4, 2, 3, 1]);
    assert.deepEqual(sortParcelPackageRows(rows, { ...sort, direction: "desc" })
        .map(row => row.id), [1, 2, 3, 4]);
    assert.deepEqual(rows.map(row => row.id), [1, 2, 3, 4]);
    assert.deepEqual(sortParcelPackageRows(rows, null), rows);
    assert.notEqual(sortParcelPackageRows(rows, null), rows);
    assert.deepEqual(sortParcelPackageRows([], sort), []);
});

test("ordena o rótulo exibido do operador sem mudar código, nome original ou acento", () => {
    const rows = Object.freeze([
        { operator: "[Ops10]JOSE ÁLVARO SILVA", id: 1 },
        { operator: "[ops2]ÁLVARO ÉRICO SOUZA", id: 2 },
        { operator: "[OPS2]alvaro erico LIMA", id: 3 },
    ].map(Object.freeze));
    assert.deepEqual(sortParcelPackageRows(rows, { column: "operator", direction: "asc" })
        .map(row => row.id), [2, 3, 1]);
    assert.deepEqual(sortParcelPackageRows(rows, { column: "operator", direction: "desc" })
        .map(row => row.id), [1, 2, 3]);
    assert.equal(rows[1].operator, "[ops2]ÁLVARO ÉRICO SOUZA");
});

test("tabelas mantêm ordenações independentes ao aplicar os filtros", () => {
    const rows = [
        { operator: "[Ops2]ANA SILVA", trackingNumber: "BR10", countType: "Exception", finalStatus: "LMHub_Received" },
        { operator: "[Ops10]BRUNO LIMA", trackingNumber: "BR2", countType: "Backlog", finalStatus: "LMHub_Received" },
        { operator: "[Ops2]ANA SILVA", trackingNumber: "BR1", countType: "Backlog", finalStatus: "LMHub_Received" },
        { operator: "[Ops1]CARLA SOUZA", trackingNumber: "BR3", countType: "Processed" },
    ];
    const commonSort = Object.freeze({ column: "trackingNumber", direction: "desc" });
    const bulkySort = Object.freeze({ column: "operator", direction: "asc" });
    const render = (filter, sort) => sortParcelPackageRows(
        filterParcelPackageRows(rows, filter), sort).map(row => row.trackingNumber);
    assert.deepEqual(render("all", commonSort), ["BR10", "BR2", "BR1"]);
    assert.deepEqual(render("backlog", commonSort), ["BR2", "BR1"]);
    assert.deepEqual(render("exception", commonSort), ["BR10"]);
    assert.deepEqual(render("all", bulkySort), ["BR10", "BR1", "BR2"]);
    assert.deepEqual(render("all", toggleParcelPackageSort(commonSort, "operator")),
        ["BR10", "BR1", "BR2"]);
    assert.deepEqual(bulkySort, { column: "operator", direction: "asc" });
});

test("as tabelas exibem o contador entre o nome e a cópia e ordenam por Operador e Código BR", () => {
    const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
    for (const [kind, label] of [["Common", "Pacotes Comuns"], ["Bulky", "Pacotes Volumosos"]]) {
        const table = html.match(new RegExp(`<table id="parcel${kind}PackagesTable">([\\s\\S]*?)</table>`))[1];
        assert.match(table, new RegExp(`<caption>[\\s\\S]*?<span>${label} <span data-parcel-package-count>\\(0\\)</span></span>\\s*<button\\b`));
        assert.equal((table.match(/aria-sort="none"/g) ?? []).length, 2);
        assert.match(table, /<button\b[^>]*\bdata-parcel-sort="operator"[^>]*>/);
        assert.match(table, /<button\b[^>]*\bdata-parcel-sort="trackingNumber"[^>]*>/);
        assert.equal((table.match(/aria-hidden="true">↕/g) ?? []).length, 2);
    }
});
