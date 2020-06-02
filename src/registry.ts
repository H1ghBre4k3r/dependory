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
    private registry = new Map<string, any>();

    /**
     * Add a value to the registry.
     * @param hash hash of the value to add
     * @param instance instance to add to the registry
     */
    public set(hash: string, instance: any): void {
        if (this.registry.has(hash)) {
            throw new Error(`"${hash}" already in registry!`);
        }

        this.registry.set(hash, instance);
    }

    /**
     * Get the value which is stored for a hash.
     * @param hash hash to get the stored value for
     */
    public get(hash: string): any {
        return this.registry.get(hash);
    }
}
