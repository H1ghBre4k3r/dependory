# Dependory

[![pipeline status](https://git.bre4k3r.de/h1ghbre4k3r/dependory/badges/master/pipeline.svg)](https://git.bre4k3r.de/h1ghbre4k3r/dependory/-/commits/master) [![coverage report](https://git.bre4k3r.de/h1ghbre4k3r/dependory/badges/master/coverage.svg)](https://git.bre4k3r.de/h1ghbre4k3r/dependory/-/commits/master)

A very simple, yet powerful tool to add and integrate `dependency injection` to your TypeScript projects using decorators.

## Prerequisites

### tsconfig.json

To use TypeScript decorators, you have to enable them in your `tsconfig.json`:

```json
{
    "compilerOptions": {
        ...
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        ...
    }
}
```

`experimentalDecorators` allows you to use decorators in your TypeScript code and `emitDecoratorMetadata` allows the framework to get the metadata needed for dependency injection (like types) during runtime.

## Installation

Simply install this package over npm:

```sh
$ npm i dependory
```

## Usage

### Singletons

To make use of the provided features of dependency injection, just add the decorator `@Singleton()` to a class:

```ts
import { Singleton } from "dependory";

@Singleton()
export class OtherClass {
    public foo: string;
    constructor() {
        this.foo = "bar";
    }
}
```

In another class, where you want to inject `OtherClass`, do the same:

```ts
import { Singleton } from "dependory";
import { OtherClass } from "./otherClass";

@Singleton()
export class MyClass {
    constructor(a: OtherClass) {
        console.log(a.foo);
    }
}
```

The framework will create singletons of both classes, and inject the singleton of `OtherClass` into the constructor of `MyClass` during its creation. To make use of this in an existing project, just refactor all classes to use the decorators and point `node` to your entry-file, the framework will create everything for you.

### Transients ("Non-Singletons")

If you want to inject classes as non-singletons/transients instead of singletons, so a new instance gets created upon each injection, you can use the `@Transient()`-decorator.

```ts
import { Transient, Singleton } from "dependory";

// An instance gets created upon each injection
@Transient()
export class MyClass {
    private foo: string;
    constructor() {
        this.foo = "bar";
    }
}

// Only one instance will get created for all injections
@Singleton()
class Test {
    // 2 different instances get injected
    constructor(a: MyClass, b: MyClass) {
        console.log(a === b); // false
    }
}
```

**Note**: The injection in the constructor of the decorated classes will still happen.

### Custom Registry

If you want to use a custom registry (not the default one), you can specify it in the decorator:

```ts
import { Singleton, Registry } from "dependory";

const myRegistry = new Registry();

@Singleton({
    registry: myRegistry
})
export class MyClass {
    private foo: string;
    constructor() {
        this.foo = "bar";
    }
}

@Transient({
    registry: myRegistry
})
export class MyOtherClass {
    private clazz: MyClass;
    constructor(clazz: MyClass) {
        this.clazz = clazz;
    }
}
```

Doing this, this class will be stored in your custom registry and not the the default one. This also allows you to scope your injections per module.

### Inject class properties

If you only want to inject certain properties of a class, you can apply the `@Inject()` decorator to this properties.

`@Inject()` takes an optional parameter, which current allows you to specify the registry, from which the value to inject shall be taken from.

```ts
import { Singleton, Inject, Registry } from "dependory";

// Create an own registry for scoping our injections
const myRegistry = new Registry();

@Singleton({
    registry: myRegistry
})
class MyTestClass {
    public foo = "bar";
}

class MyClass {
    @Inject({
        registry: myRegistry
    })
    public test: MyTestClass;
}

const myInstance = new MyClass();
console.log(myInstance.test.foo); // "bar"
```

If `registry` is not provided, it will default to the general library, which gets used by the framework by default.

### Inject constructor parameters

If you want to inject concrete parameters from specific registries into the constructor, you can achieve this with `@Inject()` aswell. Just decorate the parameter in the constructor:

```ts
import { Singleton, Inject, Registry } from "dependory";

const myRegistry = new Registry();

// We chain the decorators, so we create 2 different singletons in 2 different registries
// See "Decorator-Chaining" for details about this
@Singleton({
    registry: myRegistry
})
@Singleton()
class MyTestClass {
    public foo = Math.random();
}

// Inject the general constructor parameters from the default registry
@Singleton()
class MyClass {
    constructor(
        a: MyTestClass,
        // Inject the second parameter from another registry
        @Inject({
            registry: myRegistry
        })
        b: MyTestClass
    ) {
        console.log(a.foo === b.foo); // false
    }
}
```

**Note:** The concretely injected parameters override the parameters, that get automatically injected by the framework!

### Inject via custom key

If you want to register and inject properties or parameters via custom keys, you can specify them in via the injection properties:

```ts
@Singleton({
    key: "myInjectionKey"
})
class MyClass {
    //
}

@Singleton()
class MyOtherClass {
    @Inject({
        key: "myInjectionKey"
    })
    private value: any;
}
```

**Note:** The custom key will _always_ overwrite the class hash (the default value for a class to be injected with).

### Decorator-Chaining

By default, you can chain the decorators in combination with different registries, to store classes both as singletons and as transients.

```ts
import { Singleton, Transient, Inject, Registry } from "dependory";

const myRegistry = new Registry();

@Transient({
    registry: myRegistry
})
@Singleton()
class MyClass {
    public value: numer;
    constructor() {
        this.value = Math.random();
    }
}

@Singleton({
    registry: myRegistry
})
class MyOtherClass {
    @Inject()
    private a: MyClass;
    @Inject()
    private b: MyClass;

    constructor(c: MyClass, d: MyClass) {
        console.log(this.a.value === this.b.value); // true
        console.log(c.value === d.value); // false
    }
}
```
