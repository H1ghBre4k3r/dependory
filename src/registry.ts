/**
 * Interface, which gets stored for transients.
 */
export interface ClazzObject {
    clazz: any;
    args: any[];
}

/**
 * Interface for the injectees for the constructor.
 */
export interface ConstructorParamInjectee {
    registry: Registry;
    hash: string;
}

/**
 * Registry for managing the injections.
 */
export class Registry {
    private static CONSTRUCTOR_INJECTION_KEY = "___dependory_injection_key";

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
     * Get the map for a class, in which its constructor injectees are stored in.
     * @param clazz class to get the map for
     */
    public static getClassContructorInjectees(clazz: any): { [key: string]: ConstructorParamInjectee } {
        clazz[Registry.CONSTRUCTOR_INJECTION_KEY] = clazz[Registry.CONSTRUCTOR_INJECTION_KEY] || {};
        return clazz[Registry.CONSTRUCTOR_INJECTION_KEY];
    }

    /**
     * Instantiate a class with the given arguments and check, if there any injectees and favor them before the actual arguments.
     * @param clazz class to instantiate
     * @param args constructor arguments
     */
    public static instantiate(clazz: any, args: any[]): any {
        // Get injectees
        const constructorParamInjectees = Registry.getClassContructorInjectees(clazz);

        // Replace arguments with injectees, if needed
        Object.keys(constructorParamInjectees).forEach(paramIndex => {
            const index = parseInt(paramIndex, 10);
            const injectee = constructorParamInjectees[paramIndex];
            const value = injectee.registry.get(injectee.hash);
            args[index] = value;
        });
        // Return the instantiated class
        return new clazz(...args);
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
    public addTransient(hash: string, clazz: ClazzObject): void {
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
                toReturn = Registry.instantiate(opt.clazz, opt.args); // new opt.clazz(...opt.args);
            }
        }
        return toReturn;
    }
}

const defaultRegistry = new Registry();

export { defaultRegistry };
