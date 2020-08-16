# Change Log

All notable changes to this project will be documented in this file.

## [1.0.0] - 2020-08-16

Allow concrete injection via custom keys and remove `@Injectable()` from framwork.

### Added

-   Property `key` to options for `@Singleton()`, `@Transient()` and `@Inject()`

    -   `key` stores class with this key and not its hash in the registry
    -   if `key` was used for creating the singleton or transient, it also has to be used for injeciton

### Breaking

-   Removed `@Injectable()` from framework due to its deprecation

## [0.8.0] - 2020-06-11

Allow concrete parameter injection.

### Added

-   `@Inject()` injects concrete parameters in the constructor.
    -   Will overwrite the injected parameters by the framework

## [0.7.0] - 2020-06-08

### Added

-   `@Singleton()` to create singletons
-   `@Transient()` to create transients
-   Chaining of decorators

## [0.6.0] - 2020-06-02

Add optional options for `@Injectable()`.

### Added

-   option to use custom registry instead of the default one
    -   specify registry in `InjectableOptions``
-   option to specify non-singleton-injections for classes
    -   set `singleton` in `InjectableOptions` to false

## [0.5.0] - 2020-06-01

The initial release of this module.

### Added

-   the functionality of simple dependency injection using TypeScript decorators
    -   `@Injectable()` on classes
        -   create singletons and automatically inject them into other classes' constructors

<!-- ### Changed -->

<!-- ### Fixed

-   [PROJECTNAME-UUUU](http://tickets.projectname.com/browse/PROJECTNAME-UUUU)
    MINOR Fix module foo tests
-   [PROJECTNAME-RRRR](http://tickets.projectname.com/browse/PROJECTNAME-RRRR)
    MAJOR Module foo's timeline uses the browser timezone for date resolution -->
