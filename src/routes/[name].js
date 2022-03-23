import derive from '$lib/derive';

export async function get ({ url, params: { name } }) {
  name = rmdot(name);

  let origin = url.searchParams.get('origin');
  let seed = url.searchParams.get('seed');
  if (seed || origin) {
    if (!seed) {
      seed = rmdot(origin);
    }
  } else {
    origin = import.meta.env.VITE_ORIGIN || url.hostname;
    origin = rmdot(origin);
    seed = import.meta.env.VITE_SEED || origin;
  }

  name = `${name}.${origin}`;

  const body = derive(name, seed, origin);

  if (typeof url.searchParams.get('json') !== 'string') {
    return { body: body.alias };
  }

  return {
    body
  };
}

function rmdot (origin) {
  if (origin[origin.length - 1] === '.') {
    return origin.slice(0, origin.length - 1);
  } else {
    return origin;
  }
}
