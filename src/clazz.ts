/**
 * Pseudo-Interface for wrapping classes.
 */
export interface Clazz<T> {
    prototype: any;
    name: string;
    new (...args: any[]): T;
}
