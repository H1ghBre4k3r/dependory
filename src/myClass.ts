import { OtherKlasse } from "./otherClass";
import { Injectable } from "./injectable";

@Injectable()
export class MyKlasse {
    constructor(a: OtherKlasse) {
        console.log(a.test);
    }
}
