# 2026-11-23 · Novo modelo da cópia de Parcel e Reversa

A cópia do Parcel Sweeper ocupa `C185:J199` na aba **Base de Dados**. A distribuição ganhou uma linha de cabeçalhos e usa dez linhas com operador em C:F, quantidade em G:H e percentual em I:J.

A cópia da Reversa ocupa `C201:J215` com título mesclado na primeira linha, totais por tipo na linha 203 e dez linhas de distribuição por TO. A lista usa a ordem da prévia e mantém o percentual sobre o total de pacotes. Os dois blocos preenchem as linhas livres com células vazias e avisam quando a lista excede o espaço do modelo.

Os 306 testes Node passaram. A comparação com **Resumo da Operação (11).xlsx** confirmou os intervalos, os cabeçalhos e as 92 mesclagens. O contexto registra as referências da aba Relatório Parcel que precisam apontar para as novas colunas da Base de Dados. [Cópia para planilha](../Painel%20Relat%C3%B3rios/copia-de-dados-para-planilha.md#resumo-da-operação) · [Painel Relatórios](../Painel%20Relat%C3%B3rios/README.md#parcel-sweeper)
