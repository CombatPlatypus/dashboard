# 2026-11-26 · Final Status nas listas de BRs do Parcel Sweeper

As tabelas de pacotes comuns e volumosos passaram a exigir `Final Status = LMHub_Received` para Backlog e Exception nos três filtros. Os botões copiam os BRs da tabela filtrada. Os indicadores de Backlog e Exception continuam usando o `Count Type` da base inteira. [Filtro de pacotes](../../js/reports/parcel-sweeper/model.js#L812) · [Contexto do Painel Relatórios](../Painel%20Relat%C3%B3rios/README.md#parcel-sweeper)

Os 308 testes Node passaram. As verificações de filtro e cópia cobrem registros com status correspondente, diferente ou ausente. [Testes do filtro](../../tests/parcel-sweeper.test.mjs) · [Testes de cópia](../../tests/parcel-sweeper-copy.test.mjs)
