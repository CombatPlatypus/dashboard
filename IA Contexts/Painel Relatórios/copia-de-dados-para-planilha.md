# Cópia de dados para planilha

O botão de cópia de dados usa o estado atual do relatório para montar a tabela. A área de transferência recebe HTML com mesclagens, bordas e alinhamento, além de texto tabulado. A dica do botão e a mensagem de sucesso indicam a aba e a célula inicial. Use `Ctrl+V` para colar o bloco formatado. [Implementação](../../js/reports/summary-copy.js)

## Resumo da Operação

Cole os blocos na aba **Base de Dados**, começando pela primeira célula do intervalo indicado.

| Relatório | AM | PM1 | PM2 |
| --- | --- | --- | --- |
| Processamento | `C7:F62` | `C67:F122` | `C127:F182` |
| Expedição | `G7:J62` | `G67:J122` | `G127:J182` |

Cada bloco por janela tem 56 linhas. Processamento copia o resumo de LHs, os volumes e a lista dos recebedores selecionados. Expedição copia o resumo de rotas e volumes, a análise de erros e o ranking dos conferentes selecionados. As linhas restantes da lista ficam vazias para limpar os dados de uma colagem anterior. A cópia informa quando a seleção excede a capacidade do bloco.

O HTML usa 35 px no título de Processamento e de Expedição. As demais linhas usam 30 px em AM e PM2 e 21 px em PM1, conforme o modelo da Base de Dados.

| Relatório | Intervalo | Indicadores |
| --- | --- | --- |
| Parcel Sweeper | `C185:J199` | Porcentagem em `C187`, separador em `D187`, Total de Bipado em `E187`, Não Escaneados em `F187`, Backlog em `G187`, Exception em `H187` e Missorted em `I187` |
| Reversa | `C201:J215` | Total da Reversa em `C203`, Return / Missorted em `E203`, Liquidate em `G203` e Confiscado em `I203` |

Parcel Sweeper e Reversa usam esses destinos em todas as janelas.

### Parcel Sweeper

Selecione o título mesclado `C185:J185` na aba **Base de Dados** e cole com `Ctrl+V`. A Porcentagem Total usa os pacotes esperados como base. **Total de Bipado** e **Não Escaneados** usam todas as linhas importadas. A linha 188 contém o título **Distribuição por Operador** e a linha 189 contém os cabeçalhos. De 190 a 199, o nome ocupa C:F, a quantidade ocupa G:H e o percentual ocupa I:J. O HTML leva os percentuais como números com duas casas decimais.

A lista segue a ordem da prévia, por quantidade decrescente, com a mesma formatação de nomes e o mesmo percentual sobre os pacotes bipados por operadores identificados. Quando houver mais de 10 operadores, a cópia inclui os primeiros 10 e informa quantos entraram. Os indicadores e os percentuais mantêm o cálculo sobre a base completa. As linhas livres são copiadas vazias para apagar registros de uma colagem anterior. [Testes da cópia](../../tests/report-summary-copy.test.mjs)

O HTML leva as 15 linhas com altura de 35 px. As fórmulas em `C14`, `I14` e `K14` da aba **Relatório Parcel** leem respectivamente `C190:C199`, `G190:G199` e `I190:I199` da Base de Dados.

### Resumo da Reversa

Selecione o título mesclado `C201:J201` na aba **Base de Dados** e cole com `Ctrl+V`. O título ocupa a linha inteira. A linha 203 contém o total geral e os três totais por categoria, a linha 204 contém o título **Distribuição por TO** e a linha 205 contém os cabeçalhos. De 206 a 215, a TO ocupa C:D, a quantidade E:F, o percentual G:H e o tipo I:J.

As três primeiras linhas do HTML têm 35 px de altura e as demais têm 30 px.

A lista segue a ordem da prévia, com as últimas TOs adicionadas primeiro. Cada percentual divide a quantidade da TO pelo total de pacotes da Reversa. Uma TO com mais de um tipo mantém todos os rótulos na mesma célula. A cópia preenche as linhas restantes com células vazias e informa quando apenas as 10 primeiras TOs couberem. [Testes da cópia](../../tests/report-summary-copy.test.mjs)

### Expedição do Ranking Mensal

Selecione o título mesclado `B2:W3` da aba **Ranking de Colaboradores** e cole com `Ctrl+V`. O HTML aplica o alinhamento horizontal e vertical centralizado e a fonte diretamente às células. A fonte Open Sans usa 20 pt no título, 12 pt nos títulos das seções, 17 pt no cabeçalho 🏅, 11 pt nos outros cabeçalhos e 10 pt nos dados. [Ranking Mensal de Colaboradores](ranking-de-colaboradores.md)

| Bloco | Colunas | Posição | ID |
| --- | --- | --- | --- |
| Pacotes Recebidos | B:E | B | C |
| Erros de Etiquetagem | G:J | G | H |
| Rotas Conferidas | L:O | L | M |
| Avarias Recebidas | Q:S | Q | |
| Pacotes OFF | U:W | U | |

Os títulos dos blocos ficam na linha 5, os cabeçalhos de coluna na linha 6 e os dados começam na linha 7. A posição é numérica no HTML, com formato ordinal como `1º`. O nome abreviado da prévia vai na coluna **Colaborador**.

A cópia define as quatro bordas externas de cada título mesclado e as quatro bordas de cada célula nos cabeçalhos e dados. A linha 4 fica mesclada de B a W. Os separadores verticais F, K, P e T levam as mesclagens e as bordas do modelo.

O bloco tem pelo menos 150 linhas de dados. Se as tabelas já ocuparam mais linhas na aba do navegador, a cópia inclui vazios até esse tamanho para sobrescrever a colagem anterior. Na reimportação, a área de transferência precisa incluir os IDs. Se a planilha copiar apenas os nomes, reexiba C, H e M e copie novamente. [Cópia do ranking](../../js/reports/employee-ranking/clipboard.js)

Recebimento, Erros de Etiquetagem e Rotas Conferidas incluem apenas os totais com OPS identificado. Um aviso junto da confirmação da cópia indica quando há registros pendentes na fonte.

## Listas de pacotes da Reversa

O botão ao lado do título de **Return / Missorted**, **Liquidate** ou **Confiscado** copia os pares da tabela correspondente em texto tabulado. A colagem começa pelo primeiro pacote e preenche **Código BR** na primeira coluna e **Respectiva TO** na segunda. [Implementação](../../js/reports/reverse/package-copy.js) · [Teste](../../tests/reverse-packages.test.mjs)

## Planejamento

Selecione o título mesclado `C2:L3` da aba **Modelo** na planilha de Planejamento e cole com `Ctrl+V`. O título usa o turno selecionado e a data e hora da cópia no horário de São Paulo, como `PLANEJAMENTO LM HUB SP 63 - AM 19/11 23:07`. [Montagem do bloco](../../js/reports/planning/clipboard.js)

LHs programados, LHs a segregar e TOs ocupam C:E e começam nas linhas 7, 29 e 51. O backlog começa na linha 7 em G:H. Os resumos e os valores da Collection Pool ficam em J:L até a linha 18, com os rótulos mesclados em J:K e os valores em L. A cópia termina na última linha necessária para incluir esses resumos e as listas preenchidas. F e I funcionam como separadores dentro desse recorte.

O HTML reproduz as bordas da grade e dos títulos mesclados, aplica Open Sans de 20 pt no título, 12 pt nos títulos das seções e nos cabeçalhos de segregação, 11 pt nos demais cabeçalhos e 10 pt nos dados e rótulos dos resumos. Os rótulos dos resumos ficam à esquerda e os dados são centralizados verticalmente. [Testes da cópia](../../tests/report-summary-copy.test.mjs)
