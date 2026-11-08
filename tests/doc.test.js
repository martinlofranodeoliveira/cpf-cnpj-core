import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validate, validateCPF, validateCNPJ, check, computeCPF, computeCNPJ, DocError } from '../src/doc.mjs';

describe('CPF', () => {
  it('accepts the classic example formatted or not', () => {
    assert.equal(validateCPF('52998224725'), '52998224725');
    assert.equal(validateCPF('529.982.247-25'), '52998224725');
  });
  it('rejects wrong digits, repeated and bad length', () => {
    assert.equal(check('52998224726').code, 'BAD_CHECK');
    assert.equal(check('11111111111').code, 'REPEATED');
    assert.equal(check('123').code, 'BAD_LENGTH');
  });
  it('generates check digits', () => {
    assert.equal(computeCPF('529982247'), '25');
  });
});

describe('CNPJ', () => {
  it('accepts the classic example formatted or not', () => {
    assert.equal(validateCNPJ('11222333000181'), '11222333000181');
    assert.equal(validateCNPJ('11.222.333/0001-81'), '11222333000181');
  });
  it('rejects wrong digits and repeated', () => {
    assert.equal(check('11222333000182').code, 'BAD_CHECK');
    assert.equal(check('00000000000000').code, 'REPEATED');
  });
  it('generates check digits', () => {
    assert.equal(computeCNPJ('112223330001'), '81');
  });
});

describe('validate/check', () => {
  it('dispatches by length', () => {
    assert.equal(validate('52998224725').kind, 'CPF');
    assert.equal(validate('11222333000181').kind, 'CNPJ');
    assert.throws(() => validate(42), (e) => e.code === 'NOT_STRING');
    assert.ok(new DocError('X') instanceof Error);
  });
  it('round-trips generated documents', () => {
    assert.equal(validateCPF('123456789' + computeCPF('123456789')), '123456789' + computeCPF('123456789'));
    assert.equal(validateCNPJ('123456780001' + computeCNPJ('123456780001')), '123456780001' + computeCNPJ('123456780001'));
  });
});
