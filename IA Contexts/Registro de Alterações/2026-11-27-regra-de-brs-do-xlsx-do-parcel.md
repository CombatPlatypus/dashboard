# 2026-11-27 · Regra de inclusão de BRs no XLSX do Parcel Sweeper

O download XLSX passou a exigir `Count Type` Backlog ou Exception, `Final Status = LMHub_Received` e um operador identificado por `[Ops123]` ou e-mail `@shopee.com`. O botão avalia a base inteira no clique e usa a ordem da importação. [Exportador](../../js/reports/parcel-sweeper/export.js) · [Contexto do Painel Relatórios](../Painel%20Relat%C3%B3rios/README.md#parcel-sweeper)

Os 310 testes Node passaram. O XLSX gerado com o último CSV fornecido continha 618 BRs únicos, todos Backlog com código Ops. O teste automatizado cobre o e-mail da Shopee e a exclusão de operadores sem identificação aceita. [Teste do XLSX](../../tests/parcel-sweeper-export.test.mjs)
