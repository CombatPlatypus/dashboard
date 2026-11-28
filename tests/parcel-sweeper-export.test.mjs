import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { initializeParcelExport } from "../js/reports/parcel-sweeper/export.js";
import { readParcelFile } from "../js/reports/parcel-sweeper/import.js";
import {
    replaceParcelRows, resetParcelReport, restoreParcelState, toggleParcelOperatorBulky, updateParcelFilter,
} from "../js/reports/parcel-sweeper/state.js";

const XLSX = createRequire(import.meta.url)("../js/libraries/xlsx.full.min.js");

test("botão baixa Backlog e Exception recebidos com operador Ops ou Shopee", async t => {
    class Element extends EventTarget {
        dataset = {};
    }
    class Button extends Element {
        click() { this.dispatchEvent(new Event("click")); }
    }

    const downloads = [];
    const globals = {
        HTMLElement: Element,
        HTMLButtonElement: Button,
        document: { getElementById: () => null },
        window: { XLSX: { ...XLSX, writeFile(workbook, name) {
            const bytes = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
            downloads.push({ name, workbook: XLSX.read(bytes, { type: "array" }) });
        } } },
    };
    for (const [key, value] of Object.entries(globals)) {
        const original = Object.getOwnPropertyDescriptor(globalThis, key);
        Object.defineProperty(globalThis, key, { configurable: true, value });
        t.after(() => {
            if (original) Object.defineProperty(globalThis, key, original);
            else delete globalThis[key];
        });
    }

    const button = new Button();
    const elements = {
        "#parcelCopyReportButton": new Button(),
        "#parcelClearReportButton": new Button(),
        "#parcelDownloadReceivedPackagesButton": button,
        "#parcelPreview": new Element(),
    };
    const panel = { querySelector: selector => elements[selector] };
    const checkWorkbook = (index, expected) => {
        const { name, workbook } = downloads[index];
        assert.equal(name, "smart_routing_batch_add_order_template.xlsx");
        assert.deepEqual(workbook.SheetNames, ["Parcel Sweeper"]);
        const sheet = workbook.Sheets["Parcel Sweeper"];
        assert.deepEqual(XLSX.utils.decode_range(sheet["!ref"]).e, { c: 0, r: expected.length - 1 });
        assert.deepEqual(XLSX.utils.sheet_to_json(sheet, { header: 1 }), expected);
    };

    assert.equal(initializeParcelExport(panel), true);
    assert.equal(button.disabled, true);
    button.click();
    assert.equal(downloads.length, 0);

    const csv = [
        "SPX Tracking Number,Final Status,Scanned Status,Count Type,Operator,Aging Time,Scanned Time",
        "BR103,LMHub_Received,-,Missing,[Ops1] ANA,,",
        "BR101,LMHub_Received,-,Backlog,[Ops1] ANA,,",
        "BR102,LMHub_Received,-,Exception,[Ops2] BRUNO,,",
        "BR106,LMHub_Received,-,Processed,[Ops1] ANA,,",
        "BR104,SOC_Received,LMHub_Received,Backlog,[Ops1] ANA,,",
        "BR105,Return_LMHub_Received,LMHub_Received,Exception,[Ops2] BRUNO,,",
        "BR107,LMHub_Received,-,Mis-sorted,[Ops2] BRUNO,,",
        "BR108,LMHub_Received,-,Exception, analista@SHOPEE.COM ,,",
        "BR109,LMHub_Received,-,Backlog,,,",
        "BR110,LMHub_Received,-,Exception,ANA,,",
        "BR111,LMHub_Received,-,Backlog,operador@empresa.com,,",
        "BR112,LMHub_Received,-,Exception,operador@shopee.com.exemplo.net,,",
        "BR101,LMHub_Received,-,Backlog,[Ops1] ANA,,",
    ].join("\n");
    const imported = await readParcelFile(new File([csv], "parcel.csv"));
    replaceParcelRows(imported.rows, "parcel.csv", { normalized: true });
    updateParcelFilter("exception");
    toggleParcelOperatorBulky("[Ops1] ANA");
    assert.equal(button.disabled, false);
    button.click();
    const expected = [["SPX TN"], ["BR101"], ["BR102"], ["BR108"], ["BR101"]];
    checkWorkbook(0, expected);

    replaceParcelRows([{ trackingNumber: "BR109", finalStatus: "LMHub_Received", countType: "Backlog" }]);
    button.click();
    checkWorkbook(1, [["SPX TN"]]);

    resetParcelReport();
    assert.equal(button.disabled, true);
    button.click();
    assert.equal(downloads.length, 2);

    assert.equal(restoreParcelState({ rows: imported.rows, activeFilter: "backlog" }), true);
    assert.equal(button.disabled, false);
    button.click();
    checkWorkbook(2, expected);
});
