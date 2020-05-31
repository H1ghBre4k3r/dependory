import "reflect-metadata";

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

    public static isClass(clazz: any): boolean {
        return /^\s*class/.test(clazz.toString());
    }

    public static getHash(clazz: any): string {
        const str = clazz.toString();
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString();
    }

    public static set(hash: string, instance: any): void {
        if (Registry.registry.has(hash)) {
            throw new Error(`"${hash}" already in registry!`);
        }

        Registry.registry.set(hash, instance);
    }

    public static get(hash: string): any {
        return Registry.registry.get(hash);
    }
}
