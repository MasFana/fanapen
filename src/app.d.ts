// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    interface Env {
        SURREAL_URL: string;
        SURREAL_NAMESPACE: string;
        SURREAL_DATABASE: string;
        SURREAL_USERNAME: string;
        SURREAL_PASSWORD: string;
    }

    namespace App {
        interface Platform {
            env: Env
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
}

export { };