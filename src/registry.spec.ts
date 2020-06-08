import assert from "assert";
import { Registry, ClazzObject } from "./registry";

describe("Registry", () => {
    describe("isClass()", () => {
        it("should return false for plain object", () => {
            assert.strictEqual(Registry.isClass({}), false);
        });

        it("should return false for primitive data type", () => {
            assert.strictEqual(Registry.isClass(1), false);
            assert.strictEqual(Registry.isClass("a"), false);
            assert.strictEqual(Registry.isClass(2.01), false);
            assert.strictEqual(Registry.isClass(NaN), false);
        });

        it("should return false for function", () => {
            assert.strictEqual(
                Registry.isClass(() => {
                    return 0;
                }),
                false
            );

            assert.strictEqual(
                Registry.isClass(function(): number {
                    return 0;
                }),
                false
            );
        });

        it("should return false for array", () => {
            assert.strictEqual(Registry.isClass([1, 2, 3]), false);
        });

        it("should return true for ES6 class", () => {
            assert.strictEqual(Registry.isClass(class MyTestClass {}), true);
        });
    });

    describe("getHash()", () => {
        it("should give the same hash for same values", () => {
            // tslint:disable-next-line: no-unnecessary-class
            class MyTestClass {}
            assert.strictEqual(Registry.getHash(MyTestClass), Registry.getHash(MyTestClass));
        });

        it("should give different hash for number and string containing this number", () => {
            assert.notStrictEqual(1, "1");
        });
    });

    describe("addSingleton()", () => {
        // tslint:disable-next-line: no-unnecessary-class
        class MyTestClass {}

        it("should add a singleton to the registry", () => {
            const registry = new Registry();
            const hash = Registry.getHash(MyTestClass);
            const instance = new MyTestClass();
            registry.addSingleton(hash, instance);
            assert.deepStrictEqual(registry.get(hash), instance);
        });

        it("should throw error when hash already exists", () => {
            const registry = new Registry();
            const hash = Registry.getHash(MyTestClass);
            const instance = new MyTestClass();
            registry.addSingleton(hash, instance as any);
            assert.throws(() => registry.addSingleton(hash, instance));
        });
    });

    describe("addClass()", () => {
        // tslint:disable-next-line: no-unnecessary-class
        class MyTestClass {}

        it("should add a class to the registry", () => {
            const registry = new Registry();

            const hash = Registry.getHash(MyTestClass);
            const opt: ClazzObject = {
                clazz: MyTestClass,
                args: []
            };
            registry.addTransient(hash, opt);
            assert.notStrictEqual(registry.get(hash), undefined);
        });

        it("should throw error when hash already exists", () => {
            const registry = new Registry();
            const hash = Registry.getHash(MyTestClass);
            const opt: ClazzObject = {
                clazz: MyTestClass,
                args: []
            };
            registry.addTransient(hash, opt);
            assert.throws(() => registry.addTransient(hash, opt));
        });

        it("should generate new instances for non singletons", () => {
            const registry = new Registry();

            const hash = Registry.getHash(MyTestClass);

            registry.addTransient(hash, { clazz: MyTestClass, args: [] });
            const c1 = registry.get(hash);
            const c2 = registry.get(hash);
            assert.notStrictEqual(c1, c2);
        });
    });

    describe("get()", () => {
        // tslint:disable-next-line: no-unnecessary-class
        class MyTestClass {}
        it("should return the value for a specific hash", () => {
            const registry = new Registry();
            const hash = Registry.getHash(MyTestClass);
            const instance = new MyTestClass();
            registry.addSingleton(hash, instance);
            assert.deepStrictEqual(registry.get(hash), instance);
        });

        it("should return undefined for unknown hash", () => {
            const registry = new Registry();
            assert.strictEqual(registry.get("someRandomHash"), undefined);
        });
    });
});
