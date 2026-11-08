# Contract — cpf-cnpj-core

Pure ESM in `src/doc.mjs`, zero runtime dependencies, Node >= 22.
Formatting characters (`.[space]/-`) stripped; letters rejected.

| Export | Result |
| --- | --- |
| `validateCPF` / `validateCNPJ` | Normalized digits or throws. |
| `validate(input)` | `{ kind: 'CPF'\|'CNPJ', digits }` by length. |
| `check(input)` | `{ ok:true, kind, digits }` or `{ ok:false, code }`. |
| `computeCPF(base9)` / `computeCNPJ(base12)` | The two check digits. |

Weights: CPF 10..2 then 11..2; CNPJ 5..2,9..2 then 6..2,9..2; digit =
`r<2 ? 0 : 11-r`. All-same-digit rejected as `REPEATED` (known invalid).

Errors: `NOT_STRING` · `EMPTY` · `BAD_CHARS` · `BAD_CPF_LENGTH` ·
`BAD_CNPJ_LENGTH` · `BAD_LENGTH` · `REPEATED` · `BAD_CHECK` · `BAD_BASE`.
