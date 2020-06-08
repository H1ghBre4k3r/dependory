import { Clazz } from "./clazz";
import { Registry, defaultRegistry } from "./registry";

/**
 * Options for creating a Singleton.
 */
interface SingletonOptions {
    /**
     * Registry to use for storing the Singleton. Defaults to the registry used by the framework.
     */
    registry?: Registry;
}

const defaultOptions: SingletonOptions = {
    registry: defaultRegistry
};

/**
 * Inject all parameters to a class' constructor and store it as a singleton.
 * It will instantiated every once and this instance will be used for all injections.
 * @param options SingletonOptions for creating this Singleton
 */
export function Singleton(options: SingletonOptions = {}): <T extends Clazz<any>>(clazz: T) => T {
    // tslint:disable-next-line: forin
    for (const t in defaultOptions) {
        (options as any)[t] = (options as any)[t] ?? (defaultOptions as any)[t];
    }
    return function<T extends Clazz<any>>(clazz: T): any {
        if (!clazz || !Registry.isClass(clazz)) {
            throw new Error(`Argument must be of type class`);
        }
        // Get constructor arguments
        const args = Reflect.getMetadata("design:paramtypes", clazz);

        // Fetch all new arguments out of the registry
        const newArgs =
            args?.map((arg: any) => {
                const hash = Registry.getHash(arg);
                const param = options.registry?.get(hash);
                return param;
            }) ?? [];
        // Instantiate object and register it in the registry
        const hash = Registry.getHash(clazz);
        const instance = new clazz(...newArgs);
        options.registry?.addSingleton(hash, instance);

        // Return class, for chaining decorators
        return clazz;
    };
}
