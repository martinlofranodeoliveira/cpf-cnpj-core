// SPDX-License-Identifier: MIT
// CPF/CNPJ validation and check-digit generation (Brazilian Federal
// Revenue mod-11 rules). Digit strings only, no formatting semantics
// beyond stripping. No network, no I/O.

export class DocError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'DocError';
    this.code = code;
  }
}

/** Strip non-digits; require all digits and exact length. */
function digitsOf(input, length, kind) {
  if (typeof input !== 'string') throw new DocError('NOT_STRING');
  const out = input.replace(/\D/g, '');
  if (out.length === 0) throw new DocError('EMPTY');
  if (!/^[0-9]+$/.test(input.replace(/[\s./-]+/g, ''))) throw new DocError('BAD_CHARS');
  if (out.length !== length) throw new DocError(kind === 'CPF' ? 'BAD_CPF_LENGTH' : 'BAD_CNPJ_LENGTH');
  if (/^(\d)\1+$/.test(out)) throw new DocError('REPEATED');
  return out;
}

function mod11(digits, weights) {
  const sum = digits.split('').reduce((n, d, i) => n + Number(d) * weights[i], 0);
  const r = sum % 11;
  return r < 2 ? 0 : 11 - r;
}

const CPF_W1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
const CPF_W2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_W1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_W2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/** Validate CPF (11 digits). Returns normalized digits. */
export function validateCPF(input) {
  const d = digitsOf(input, 11, 'CPF');
  const d1 = mod11(d.slice(0, 9), CPF_W1);
  const d2 = mod11(d.slice(0, 9) + d1, CPF_W2);
  if (d[9] !== String(d1) || d[10] !== String(d2)) throw new DocError('BAD_CHECK');
  return d;
}

/** Validate CNPJ (14 digits). Returns normalized digits. */
export function validateCNPJ(input) {
  const d = digitsOf(input, 14, 'CNPJ');
  const d1 = mod11(d.slice(0, 12), CNPJ_W1);
  const d2 = mod11(d.slice(0, 12) + d1, CNPJ_W2);
  if (d[12] !== String(d1) || d[13] !== String(d2)) throw new DocError('BAD_CHECK');
  return d;
}

/** Validate either; returns { kind: 'CPF'|'CNPJ', digits }. */
export function validate(input) {
  if (typeof input !== 'string') throw new DocError('NOT_STRING');
  const out = input.replace(/\D/g, '');
  if (out.length === 11) return { kind: 'CPF', digits: validateCPF(input) };
  if (out.length === 14) return { kind: 'CNPJ', digits: validateCNPJ(input) };
  if (out.length === 0) throw new DocError('EMPTY');
  throw new DocError('BAD_LENGTH');
}

/** Non-throwing: { ok, kind?, digits? } or { ok:false, code }. */
export function check(input) {
  try {
    return { ok: true, ...validate(input) };
  } catch (err) {
    if (err instanceof DocError) return { ok: false, code: err.code };
    throw err;
  }
}

/** Generate check digits: computeCPF('529982247') === '25'. */
export function computeCPF(base9) {
  if (!/^[0-9]{9}$/.test(base9)) throw new DocError('BAD_BASE');
  const d1 = mod11(base9, CPF_W1);
  return `${d1}${mod11(base9 + d1, CPF_W2)}`;
}

/** Generate check digits: computeCNPJ('112223330001') === '81'. */
export function computeCNPJ(base12) {
  if (!/^[0-9]{12}$/.test(base12)) throw new DocError('BAD_BASE');
  const d1 = mod11(base12, CNPJ_W1);
  return `${d1}${mod11(base12 + d1, CNPJ_W2)}`;
}
