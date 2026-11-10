export const join = (...parties: string[]) => parties.filter(Boolean).join('/').replace(/\/+/g, '/');
export const resolve = join;
export const dirname = (p: string) => String(p).split('/').slice(0, -1).join('/');
export default { join, resolve, dirname };
