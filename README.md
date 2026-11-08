# cpf-cnpj-core

Brazilian CPF/CNPJ validation and check-digit generation (Federal Revenue
mod-11). Zero runtime dependencies, Node >= 22.

Part of the LOFRANO TECNOLOGIA open-source lab. MIT.

```js
import { validate, computeCPF } from './src/doc.mjs';
validate('529.982.247-25');   // { kind: 'CPF', digits: '52998224725' }
computeCPF('529982247');      // '25'
```

```sh
npm test          # 8 tests, node:test, no dependencies
npm run demo
```

Syntactic validity only — no registry lookup. MIT — see `LICENSE`.
Full contract in `docs/contract.md`. [Versão em português](README.pt-BR.md).
