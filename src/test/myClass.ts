import { Injectable } from "../injectable";
import { OtherClass } from "./otherClass";

@Injectable()
export class MyKlasse {
    private a: string;
    constructor(a: OtherClass) {
        this.a = a.foo;
        console.log(this.a);
    }
}
