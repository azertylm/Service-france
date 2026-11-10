/** Version navigateur : server.ts calcule __dirname, qui ne sert à rien ici. */
export const fileURLToPath = (u: unknown) => String(u);
export default { fileURLToPath };
