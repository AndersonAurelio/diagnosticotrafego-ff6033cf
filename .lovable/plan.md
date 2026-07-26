# Plano: Remover travessões do projeto

## Objetivo
Substituir todos os caracteres de travessão (`—`) por vírgulas (`,`) ou pontos finais (`.`), conforme o contexto, em todos os arquivos do projeto.

## Arquivos e substituições identificadas

1. **src/routes/index.tsx**
   - Meta `title`: `"Termômetro do Rastreamento — Diagnóstico de tráfego em 40s"` → `"Termômetro do Rastreamento. Diagnóstico de tráfego em 40s"`
   - Meta `og:title`: `"Termômetro do Rastreamento — Diagnóstico em 40s"` → `"Termômetro do Rastreamento. Diagnóstico em 40s"`

2. **src/components/diagnostico/data.ts**
   - Insight do Nível 3: `"Você já mede bem — o próximo salto..."` → `"Você já mede bem. O próximo salto..."`
   - Linha do perfil iniciante: `"...primeiro real investido — quem mede escala com segurança."` → `"...primeiro real investido. Quem mede escala com segurança."`

3. **src/styles.css**
   - Comentário: `/* Dark by default — "de tráfego pago" */` → `/* Dark by default. "de tráfego pago" */`

4. **src/lib/error-capture.ts**
   - Comentários técnicos: substituir travessões por ponto final ou vírgula, conforme fluidez.

5. **src/server.ts**
   - Comentário técnico: substituir travessão por ponto final.

6. **src/routes/README.md**
   - Tabela de rotas: substituir travessões por vírgulas ou pontos, conforme o contexto explicativo.

7. **README.md**
   - Texto introdutório: substituir travessão por vírgula ou ponto.

8. **.lovable/plan.md**
   - Documento de plano interno: substituir todos os travessões por vírgulas ou pontos, conforme o contexto.

## Validação
- Buscar novamente por `"—"` em todo o projeto para confirmar que nenhum travessão restou.
- Executar o build (`bun run build` ou equivalente) para garantir que as alterações não quebraram nada.

## Nota técnica
Nenhuma dependência nova. Alterações puramente textuais em metadados, comentários e strings visíveis ao usuário.