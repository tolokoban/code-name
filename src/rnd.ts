export default class Rnd {
    private _seed = 1
    constructor(seed: number) {
        this._seed = Math.max(1, seed)
    }

    get seed() { return this._seed }
    set seed(v: number) { this._seed = Math.max(1, v) }

    get value() {
        const MAGIC = 1000
        const x = Math.sin(this._seed++) * MAGIC
        return x - Math.floor(x)
    }

    int(length: number): number {
        return Math.floor(length * this.value)
    }
}
