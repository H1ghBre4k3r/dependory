# Change Log

All notable changes to this project will be documented in this file.

## [0.6.0] - 2020-06-02

Add optional options for `@Injectable()` and fix typo.

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
