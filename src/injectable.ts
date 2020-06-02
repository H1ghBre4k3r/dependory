import "reflect-metadata";
import { Registry } from "./registry";

/**
 * Options for an injection.
 */
interface InjectableOptions {
    /**
     * Registry for injecting and storing classes. Of none is provided, the default one will be used.
     */
    registry?: Registry;
}

/**
 * Default registry to use, if no specific registry is provided.
 */
const defaultRegistry = new Registry();

/**
 * Make a class injectable.
 * @param options options for the injection
 */
export function Injectable(options?: InjectableOptions): (clazz: any) => void {
    const registry = options?.registry ?? defaultRegistry;

    return function(clazz: any): void {
        if (!clazz || !Registry.isClass(clazz)) {
            throw new Error(`Argument must be of type class`);
        }
        // Get constructor arguments
        const args = Reflect.getMetadata("design:paramtypes", clazz);

        // Fetch all new arguments out of the registry
        const newArgs =
            args?.map((arg: any) => {
                const hash = Registry.getHash(arg);
                let param;
                // Wait, until all depencies are resolved
                while (!param) {
                    param = registry.get(hash);
                }
                return param;
            }) ?? [];
        // Instantiate object and register it in the registry
        const hash = Registry.getHash(clazz);
        const instance = new clazz(...newArgs);
        registry.set(hash, instance);
    };
}
