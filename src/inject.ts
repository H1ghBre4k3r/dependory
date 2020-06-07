import "reflect-metadata";
import { Registry, defaultRegistry } from "./registry";

/**
 * Options for injecting a property into a class.
 */
export interface InjectOptions {
    /**
     * Registry to use for getting the value.
     * Defaults to the general default registry.
     */
    registry?: Registry;
}

const defaultOptions: InjectOptions = {
    registry: defaultRegistry
};

/**
 * Inject a property into a class.
 * @param options InjectOptions for injecting.
 */
export function Inject(options: InjectOptions = {}): any {
    // tslint:disable-next-line: forin
    for (const t in defaultOptions) {
        (options as any)[t] = (options as any)[t] ?? (defaultOptions as any)[t];
    }

    return function(object: object, prop: any): any {
        // Get type and hash of parameter
        const type = Reflect.getMetadata("design:type", object, prop);
        const hash = Registry.getHash(type);
        // Get the value
        const value = options.registry?.get(hash);

        // Assign value to variable
        Object.defineProperty(object, prop, {
            writable: true,
            value,
            enumerable: true,
            configurable: true
        });
    };
}

export { Inject as inject };
