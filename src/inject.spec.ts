// tslint:disable: no-unnecessary-class
import assert from "assert";
import { Inject } from "./inject";
import { Registry } from "./registry";
import { Singleton } from "./singleton";

describe("@Inject()", () => {
    it("should inject the value from the registry", () => {
        const registry = new Registry();
        @Singleton({ registry })
        class A {}

        class Test {
            @Inject({ registry })
            public a!: A;
        }

        const instance = new Test();

        assert.notStrictEqual(instance.a, undefined);
        assert.strictEqual(instance.a instanceof A, true);
    });

    it("should use the provided registry", () => {
        const rA = new Registry();
        const rB = new Registry();

        @Singleton({ registry: rB })
        class A {}

        @Singleton({
            registry: rA
        })
        class B {}

        class Test {
            @Inject({ registry: rA })
            public a!: A;

            @Inject({ registry: rB })
            public b!: B;
        }

        const instance = new Test();
        assert.strictEqual(instance.a, undefined);
        assert.strictEqual(instance.b, undefined);
    });

    it("should add a parameter injectee with the provided registry to the injectee map", () => {
        const reg = new Registry();
        @Singleton({ registry: reg })
        class A {}

        class Test {
            constructor(@Inject({ registry: reg }) a: A) {
                //
            }
        }

        const hash = Registry.getHash(A);

        const injectees = Registry.getClassContructorInjectees(Test);
        assert.strictEqual(Object.keys(injectees).length, 1);
        assert.strictEqual(injectees[0].registry, reg);
        assert.strictEqual(injectees[0].hash, hash);
    });
});
