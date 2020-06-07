import assert from "assert";
import { Inject } from "./inject";
import { Injectable } from "./injectable";
import { Registry } from "./registry";

describe("@Inject()", () => {
    it("should inject the value from the registry", () => {
        const registry = new Registry();
        @Injectable({ registry })
        // tslint:disable-next-line: no-unnecessary-class
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

        @Injectable({ registry: rB })
        // tslint:disable-next-line: no-unnecessary-class
        class A {}

        @Injectable({
            registry: rA
        })
        // tslint:disable-next-line: no-unnecessary-class
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
});
