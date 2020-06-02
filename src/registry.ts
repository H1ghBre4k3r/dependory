export interface ClazzObject {
    clazz: any;
    args: any[];
}

/**
 * Registry for managing the injections.
 */
export class Registry {
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
        const str = typeof object + object.toString();
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0;
        }
        return hash.toString();
    }

    /**
     * Map for storing singletons.
     */
    private singletonRegistry = new Map<string, any>();

    /**
     * Map for storing classes.
     */
    private classRegistry = new Map<string, ClazzObject>();

    /**
     * Add a singleton to the registry.
     * @param hash hash of the value to add
     * @param instance instance to add to the registry
     */
    public addSingleton(hash: string, instance: any): void {
        if (this.singletonRegistry.has(hash)) {
            throw new Error(`"${hash}" already in registry!`);
        }
        this.singletonRegistry.set(hash, instance);
    }

    /**
     * Add a class to the registry. A new instance will be generated everytime, it shall get injected.
     * @param hash hash of the class to add
     * @param clazz class to add the the registry
     */
    public addClass(hash: string, clazz: ClazzObject): void {
        if (this.classRegistry.has(hash)) {
            throw new Error(`"${hash}" already in registry!`);
        }
        this.classRegistry.set(hash, clazz);
    }

    /**
     * Get the value which is stored for a hash.
     * @param hash hash to get the stored value for
     */
    public get(hash: string): any {
        let toReturn;
        const singleton = this.singletonRegistry.get(hash);
        if (singleton) {
            toReturn = singleton;
        } else {
            // If there is no singleton stored, get the stored class, instanciate and return it
            const opt = this.classRegistry.get(hash);
            if (opt) {
                toReturn = new opt.clazz(...opt.args);
            }
        }
        return toReturn;
    }
}
