import assert from "assert";
import { Registry } from "./injectable";

describe("registry", () => {
    describe("isClass()", () => {
        it("should return false for plain object", () => {
            assert.strictEqual(Registry.isClass({}), false);
        });

        it("shoukd return false for primitive data type", () => {
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
});
