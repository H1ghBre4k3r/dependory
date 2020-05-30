import "reflect-metadata";

export function Injectable() {
    return function(clazz: any) {
        inject(clazz);
    };
}

async function inject(clazz: any) {
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
}

class Registry {
    private static registry = new Map<string, any>();

    static isClass(clazz: any) {
        return /^\s*class/.test(clazz.toString());
    }

    static getHash(clazz: any) {
        const str = clazz.toString();
        let hash = 0,
            i,
            chr;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString();
    }

    static set(hash: string, instance: any) {
        if (Registry.registry.has(hash)) {
            throw new Error(`"${hash}" already in registry!`);
        }

        Registry.registry.set(hash, instance);
    }

    static get(hash: string) {
        return Registry.registry.get(hash);
    }
}
