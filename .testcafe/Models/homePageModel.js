import {Selector,t} from 'testcafe';

export default class HomePage{
    constructor(){
        this.header = Selector ('[data-tc="home-header"]');
    }
}