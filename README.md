# Dependory

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

To make use of the provided features of dependency injection, just add the decorator `@Injectable()` to a class:

```ts
import { Injectable } from "dependory";

@Injectable()
export class OtherClass {
    public foo: string;
    constructor() {
        this.foo = "bar";
    }
}
```

In another class, where you want to inject `OtherClass`, to the same:

```ts
import { Injectable } from "dependory";
import { OtherClass } from "./otherClass";

@Injectable()
export class MyClass {
    constructor(a: OtherClass) {
        console.log(a.foo);
    }
}
```

The framework will create singletons of both classes, and inject the singleton of `OtherClass` into the constructor of `MyClass` during its creation. To make use of this in an existing project, just refactor all classes to use the decorators and point `node` to your entry-file, the framework will create everything for you.
