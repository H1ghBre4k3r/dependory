import "reflect-metadata";

/**
 * Make a class injectable.
 */
export function Injectable(): (clazz: any) => void {
    return function(clazz: any): void {
        if (!clazz) {
            throw new Error(`Argument must be of type class`);
        }
        // Get constructor arguments
        const args = Reflect.getMetadata("design:paramtypes", clazz);

        // Fetch all new arguments out of the registry
        const newArgs = args.map((arg: any) => {
            const hash = Registry.getHash(arg);
            let param;
            // Wait, until all depencies are resolved
            while (!param) {
                param = Registry.get(hash);
            }
            return param;
        });

        // Instantiate object and register it in the registry
        const hash = Registry.getHash(clazz);
        const instance = new clazz(...newArgs);
        Registry.set(hash, instance);
    };
}

// tslint:disable-next-line: no-unnecessary-class
class Registry {
    private static registry = new Map<string, any>();

    /**
     * Check, if a class is actually an ES6 class.
     * @param clazz object, for which to check, if it is an ES6 class
     */
    public static isClass(clazz: { toString(): string }): boolean {
        return /^\s*class/.test(clazz.toString());
    }

    /**
     * Generate the hash for anything, which has a "toString" method.
     * @param object object to generate the hash for
     */
    public static getHash(object: { toString(): string }): string {
        const str = object.toString();
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0;
        }
        return hash.toString();
    }

    /**
     * Add a value to the registry.
     * @param hash hash of the value to add
     * @param instance instance to add to the registry
     */
    public static set(hash: string, instance: any): void {
        if (Registry.registry.has(hash)) {
            throw new Error(`"${hash}" already in registry!`);
        }

        Registry.registry.set(hash, instance);
    }

    /**
     * Get the value which is stored for a hash.
     * @param hash hash to get the stored value for
     */
    public static get(hash: string): any {
        return Registry.registry.get(hash);
    }
}
