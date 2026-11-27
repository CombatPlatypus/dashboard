import { isParcelLMHubReceived, normalizeParcelCountType } from "./model.js";

import {
    getParcelSnapshot,
    hasParcelRowsChanged,
    resetParcelReport,
    subscribeParcelState,
} from "./state.js";

import {
    bindReportImageExportButton,
    copyReportBlob,
    createReportImageBlob,
    downloadReportBlob,
} from "../export.js";

import {
    resetReportNotification,
    setReportNotification,
} from "../report-notifications.js";

let parcelExportBusy = false;

function canExportParcelReport(
    state = getParcelSnapshot(),
) {
    return state.rows.length > 0;
}

function renderParcelExportStatus(
    copyButton,
    clearButton,
    state = getParcelSnapshot(),
) {
    const hasData =
        canExportParcelReport(
            state,
        );

    copyButton.disabled =
        parcelExportBusy ||
        !hasData;

    clearButton.disabled =
        parcelExportBusy ||
        !hasData;
}

function createParcelFileName() {
    const date =
        new Intl.DateTimeFormat(
            "pt-BR",
        )
            .format(
                new Date(),
            )
            .replace(
                /\//g,
                "-",
            );

    return `relatorio-parcel-sweeper-${date}.png`;
}

function downloadParcelReceivedPackages() {
    const state = getParcelSnapshot();
    if (!canExportParcelReport(state)) return;

    try {
        const xlsx = window.XLSX;
        const rows = state.rows.filter(row =>
            isParcelLMHubReceived(row) && normalizeParcelCountType(row.countType) !== "missing",
        );
        const sheet = xlsx.utils.aoa_to_sheet([
            ["SPX TN"],
            ...rows.map(row => [row.trackingNumber]),
        ]);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, sheet, "Parcel Sweeper");
        xlsx.writeFile(workbook, "smart_routing_batch_add_order_template.xlsx", { compression: true });

        setReportNotification({
            reportId: "parcel",
            type: "success",
            message: "Planilha de BRs do Parcel Sweeper gerada.",
        });
    } catch (error) {
        console.error("Não foi possível gerar a planilha de BRs do Parcel Sweeper.", error);
        setReportNotification({
            reportId: "parcel",
            type: "error",
            message: "Não foi possível gerar a planilha de BRs do Parcel Sweeper.",
        });
    }
}

async function runParcelExport({
    copyButton,
    clearButton,
    exportArea,
    mode,
}) {
    const state =
        getParcelSnapshot();

    if (
        parcelExportBusy ||
        !canExportParcelReport(
            state,
        )
    ) {
        return;
    }

    const isCopy =
        mode === "copy";

    const originalTitle =
        copyButton.title;

    parcelExportBusy = true;

    renderParcelExportStatus(
        copyButton,
        clearButton,
        state,
    );

    copyButton.title =
        isCopy
            ? "Copiando relatório..."
            : "Gerando relatório...";

    copyButton.setAttribute(
        "aria-busy",
        "true",
    );

    try {
        await new Promise(
            function (resolve) {
                window.requestAnimationFrame(
                    function () {
                        window.setTimeout(
                            resolve,
                            300,
                        );
                    },
                );
            },
        );

        const blob =
            await createReportImageBlob(
                exportArea,
            );

        if (isCopy) {
            await copyReportBlob(
                blob,
            );
        } else {
            downloadReportBlob(
                blob,
                createParcelFileName(),
            );
        }

        setReportNotification({
            reportId: "parcel",
            type: "success",
            message:
                isCopy
                    ? "Relatório do Parcel Sweeper copiado."
                    : "Relatório do Parcel Sweeper baixado.",
        });
    } catch (error) {
        console.error(
            "Não foi possível exportar o relatório do Parcel Sweeper:",
            error,
        );

        setReportNotification({
            reportId: "parcel",
            type: "error",
            message:
                "Não foi possível exportar o relatório do Parcel Sweeper.",
        });

        window.alert(
            error instanceof Error
                ? error.message
                : "Não foi possível exportar o relatório.",
        );
    } finally {
        parcelExportBusy = false;
        copyButton.title =
            originalTitle;
        copyButton.removeAttribute(
            "aria-busy",
        );

        renderParcelExportStatus(
            copyButton,
            clearButton,
            getParcelSnapshot(),
        );
    }
}

function initializeParcelExport(
    rootElement = document,
) {
    const copyButton =
        rootElement.querySelector(
            "#parcelCopyReportButton",
        );

    const clearButton =
        rootElement.querySelector(
            "#parcelClearReportButton",
        );

    const exportArea =
        rootElement.querySelector(
            "#parcelPreview",
        );

    const downloadButton = rootElement.querySelector("#parcelDownloadReceivedPackagesButton");

    if (
        !(
            copyButton instanceof
                HTMLButtonElement
        ) ||
        !(
            clearButton instanceof
                HTMLButtonElement
        ) ||
        !(
            exportArea instanceof
                HTMLElement
        ) || !(downloadButton instanceof HTMLButtonElement)
    ) {
        return false;
    }

    if (
        copyButton.dataset
            .parcelExportInitialized ===
        "true"
    ) {
        return true;
    }

    copyButton.dataset
        .parcelExportInitialized =
            "true";

    downloadButton.addEventListener("click", downloadParcelReceivedPackages);

    bindReportImageExportButton(
        copyButton,
        {
            onCopy() {
                runParcelExport({
                    copyButton,
                    clearButton,
                    exportArea,
                    mode: "copy",
                });
            },
            onDownload() {
                runParcelExport({
                    copyButton,
                    clearButton,
                    exportArea,
                    mode: "download",
                });
            },
        },
    );

    clearButton.addEventListener(
        "click",
        function () {
            if (
                !window.confirm(
                    "Limpar todas as informações do relatório Parcel Sweeper?",
                )
            ) {
                return;
            }

            resetParcelReport();
            resetReportNotification(
                "parcel",
            );
        },
    );

    const renderDataStatus = state => {
        renderParcelExportStatus(copyButton, clearButton, state);
        downloadButton.disabled = !canExportParcelReport(state);
    };
    subscribeParcelState((state, change) => {
        if (hasParcelRowsChanged(change)) renderDataStatus(state);
    });
    renderDataStatus(getParcelSnapshot());

    return true;
}

export {
    canExportParcelReport,
    initializeParcelExport,
};
