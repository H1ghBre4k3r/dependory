import { Injectable } from "../injectable";

@Injectable()
export class OtherClass {
    public foo: string;
    constructor() {
        this.foo = "bar";
    }
}
