import assert from 'assert';
import blake3 from 'blake3';
import base32 from 'bs32';

export default function derive (name, seed, origin) {
  assert(typeof name === 'string');
  assert(typeof seed === 'string');
  assert(typeof origin === 'string');

  name = rmdot(name).toLowerCase();
  seed = rmdot(seed).toLowerCase();
  origin = rmdot(origin).toLowerCase();

  const nameLabels = name.split('.');
  const count = origin.split('.').length;
  const label = nameLabels[nameLabels.length - (count + 1)];
  let alias = base32.encode(blake3.hash(label + seed));
  alias = name.replace(label + '.' + origin, alias);

  return {
    name,
    alias,
    sld: label,
    origin,
    seed
  };
}

function rmdot (origin) {
  if (origin[origin.length - 1] === '.') {
    return origin.slice(0, origin.length - 1);
  } else {
    return origin;
  }
}
