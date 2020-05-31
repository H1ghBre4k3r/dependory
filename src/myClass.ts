import { Injectable } from "./injectable";
import { OtherKlasse } from "./otherClass";

@Injectable()
// tslint:disable-next-line: no-unnecessary-class
export class MyKlasse {
    constructor(a: OtherKlasse) {
        console.log(a.test);
    }
}
