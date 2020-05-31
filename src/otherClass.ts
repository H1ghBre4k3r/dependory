import { Injectable } from "./injectable";

@Injectable()
export class OtherKlasse {
    public test = "Hello";
    constructor() {
        // @no-empty
    }
}
