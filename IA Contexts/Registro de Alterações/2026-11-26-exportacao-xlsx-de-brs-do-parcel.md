# 2026-11-26 · Download XLSX de BRs do Parcel Sweeper

O botão XLSX da barra de ações baixa `parcel-sweeper-lmhub-received.xlsx` com uma coluna intitulada `SPX TN`. A exportação lê no clique as linhas da base importada ou restaurada com `Final Status = LMHub_Received` e `Count Type` diferente de `Missing`. Os códigos seguem a ordem da importação. O botão fica disponível quando a base tem dados, e uma base sem registros elegíveis gera somente o cabeçalho. [Exportador](../../js/reports/parcel-sweeper/export.js) · [Contexto do Painel Relatórios](../Painel%20Relat%C3%B3rios/README.md#parcel-sweeper)

Os 310 testes Node passaram. A verificação com o CSV fornecido reabriu o XLSX com 324 BRs, sendo 323 Backlog e 1 Exception. [Teste do XLSX](../../tests/parcel-sweeper-export.test.mjs)
