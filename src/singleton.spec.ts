// tslint:disable: no-unnecessary-class
import assert from "assert";
import { Registry } from "./registry";
import { Singleton } from "./singleton";

describe("@Singleton()", () => {
    it("throws error on non class argument", () => {
        const decorator = Singleton();
        assert.throws(() => (decorator as any)(1));
        assert.throws(() => (decorator as any)("2"));
        assert.throws(() =>
            (decorator as any)(() => {
                return 1;
            })
        );
        assert.throws(() => (decorator as any)([1, 2, 3]));
        assert.throws(() => (decorator as any)(NaN));
    });

    it("should add singleton to registry", () => {
        const registry = new Registry();
        const decorator = Singleton({ registry });

        @decorator
        class MyTestClass {}

        const hash = Registry.getHash(MyTestClass);
        assert.strictEqual(registry.get(hash) instanceof MyTestClass, true);
    });

    it("should inject the dependency to the constructor", () => {
        const registry = new Registry();
        const decorator = Singleton({ registry });

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
});
