# Design — cpf-cnpj-core

Federal Revenue mod-11 with per-document weights. Generation and
validation share `mod11`, so round-trips (`compute` then `validate`) are
structural, not coincidental. Classic registry examples pin both paths.

Oracle: hand-verified examples (529.982.247-25, 11.222.333/0001-81) plus
generated round-trips on arbitrary bases. No formatting output, no
registry lookup: syntactic validity only.
