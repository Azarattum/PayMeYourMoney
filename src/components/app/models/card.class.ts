export default class Card {
    public name: string;
    public id: number;
    public balance: number;
    public owner: string;

    constructor(owner: string, name: string, balance: number = 0) {
        this.owner = owner;
        this.id = +Math.random().toFixed(16).toString().substring(2, 18);
        this.name = name;
        this.balance = balance;
    }
}