import { Clazz } from "./clazz";
import { Registry, defaultRegistry, ClazzObject } from "./registry";

/**
 * Options for creating a transient.
 */
interface TransientOptions {
    /**
     * Registry for injecting and storing this transient.
     */
    registry?: Registry;
}

const defaultOptions: TransientOptions = {
    registry: defaultRegistry
};

/**
 * Inject all parameters to a class' constructor and store it as a transient.
 * It will get instantiated every time, it will get injected.
 * @param options options for creating a transient
 */
export function Transient(options: TransientOptions = {}): <T extends Clazz<any>>(clazz: T) => T {
    // tslint:disable-next-line: forin
    for (const t in defaultOptions) {
        (options as any)[t] = (options as any)[t] ?? (defaultOptions as any)[t];
    }

    return function<T extends Clazz<any>>(clazz: T): T {
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
        // Generate hash and store class and arguments in object
        const hash = Registry.getHash(clazz);
        const opt: ClazzObject = {
            clazz,
            args: newArgs
        };

        // Store object in registry
        options.registry?.addTransient(hash, opt);

        // Return class for chaining decorators
        return clazz;
    };
}
