export default class Card {
    public name: string;
    public id: number;
    public balance: number;
    public owner: string;
    public transactions: number = 0;

    constructor(owner: string, name: string, balance: number = 0) {
        this.owner = owner;
        let id: number;
        do {
            id = +Math.random().toFixed(16).toString().substring(2, 18);
        } while (id.toString().length != 16)
        this.id = id;
        this.name = name;
        this.balance = balance;
    }
}