import "reflect-metadata";
import { Clazz } from "./clazz";
import { Registry, ClazzObject, defaultRegistry } from "./registry";

/**
 * Options for an injection.
 */
interface InjectableOptions {
    /**
     * Registry for injecting and storing classes. Of none is provided, the default one will be used.
     */
    registry?: Registry;
    /**
     * If this class shall be injected as a singleton. Default: `true`
     * @deprecated
     */
    singleton?: boolean;
}

const defaultOptions: InjectableOptions = {
    registry: defaultRegistry,
    singleton: true
};

/**
 * Make a class injectable.
 * @param options options for the injection
 * @deprecated
 */
export function Injectable(options: InjectableOptions = {}): <T extends Clazz<any>>(clazz: T) => T {
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
        // Instantiate object and register it in the registry
        const hash = Registry.getHash(clazz);

        // @deprecated
        // tslint:disable-next-line: deprecation
        if (options.singleton) {
            const instance = new clazz(...newArgs);
            options.registry?.addSingleton(hash, instance);
        } else {
            const opt: ClazzObject = {
                clazz,
                args: newArgs
            };
            options.registry?.addTransient(hash, opt);
        }
        return clazz;
    };
}
