## Objetivo
Remover a promessa de envio de "material" na tela de captura de leads, já que o usuário não vai enviar material. Ajustar apenas o copy, mantendo o design tech minimalista atual.

## Alterações propostas

### `src/components/diagnostico/Diagnostico.tsx`
Na seção `step === "captura"`:
1. **Headline**: alterar de
   `Pra onde eu envio o resultado completo + o material?`
   para
   `Pra onde eu envio o resultado completo?`
2. **Texto abaixo do botão**: alterar de
   `sem spam · só o resultado + material`
   para
   `sem spam · só o resultado`

O subtexto `Seu diagnóstico já está calculado.` permanece inalterado.

## Escopo
Apenas ajuste de copy na tela de captura. Nenhuma mudança de lógica, fluxo, webhook ou design.

## Validação
- `bun run build` deve passar sem erros.
- Verificar visualmente a tela de captura para confirmar que o novo copy está correto.