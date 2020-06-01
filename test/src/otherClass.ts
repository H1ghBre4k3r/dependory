import { Injectable } from "dependory";

@Injectable()
export class OtherClass {
    public foo: string;
    constructor() {
        this.foo = "bar";
    }
}
