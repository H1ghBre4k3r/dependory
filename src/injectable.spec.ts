import assert from "assert";
import { Injectable } from "./injectable";
import { Registry } from "./registry";

describe("@Injectable()", () => {
    it("throws error on non class argument", () => {
        const decorator = Injectable();
        assert.throws(() => decorator(1));
        assert.throws(() => decorator("2"));
        assert.throws(() =>
            decorator(() => {
                return 1;
            })
        );
        assert.throws(() => decorator([1, 2, 3]));
        assert.throws(() => decorator(NaN));
    });

    it("should add singleton to registry", () => {
        const registry = new Registry();
        const decorator = Injectable({ registry });

        @decorator
        // tslint:disable-next-line: no-unnecessary-class
        class MyTestClass {}
        const hash = Registry.getHash(MyTestClass);
        assert.strictEqual(registry.get(hash) instanceof MyTestClass, true);
    });

    it("should add a class to the registry", () => {
        const registry = new Registry();
        const decorator = Injectable({ registry, singleton: false });

        @decorator
        // tslint:disable-next-line: no-unnecessary-class
        class MyTestClass {}
        const hash = Registry.getHash(MyTestClass);
        assert.strictEqual(registry.get(hash) instanceof MyTestClass, true);
    });

    it("should inject the dependency to the constructor", () => {
        const registry = new Registry();
        const decorator = Injectable({ registry });

        const valueToCheck = "bar";

        @decorator
        class MyTestClass {
            public foo = valueToCheck;
        }

        @decorator
        class MyOtherTestClass {
            public testClass: MyTestClass;
            constructor(testClass: MyTestClass) {
                this.testClass = testClass;
            }
        }

        const hash = Registry.getHash(MyOtherTestClass);
        const instance = registry.get(hash);
        assert.strictEqual(instance.testClass.foo, valueToCheck);
    });

    it("should inject different instances of the same stored class into the constructor", () => {
        const registry = new Registry();
        const decorator = Injectable({ registry, singleton: false });

        @decorator
        // tslint:disable-next-line: no-unnecessary-class
        class MyTestClass {}

        @decorator
        // tslint:disable-next-line: no-unnecessary-class
        class Test {
            constructor(a: MyTestClass, b: MyTestClass) {
                assert.notStrictEqual(a, b);
            }
        }
    });
});
