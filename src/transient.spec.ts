import assert from "assert";
import { Registry } from "./registry";
import { Transient } from "./transient";

describe("@Transient()", () => {
    it("throws error on non class argument", () => {
        const decorator = Transient();
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

    it("should add a class to the registry", () => {
        const registry = new Registry();
        const decorator = Transient({ registry });

        @decorator
        // tslint:disable-next-line: no-unnecessary-class
        class MyTestClass {}
        const hash = Registry.getHash(MyTestClass);
        assert.strictEqual(registry.get(hash) instanceof MyTestClass, true);
    });

    it("should inject the dependency to the constructor", () => {
        const registry = new Registry();
        const decorator = Transient({ registry });

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
        const decorator = Transient({ registry });

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
