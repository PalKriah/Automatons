export class Stack<T> {
    private storage: T[] = [];

    constructor() { }

    push(item: T): void {
        this.storage.push(item);
    }

    pop(): T | undefined {
        return this.storage.pop();
    }

    peek(): T | undefined {
        return this.storage[this.size() - 1];
    }

    size(): number {
        return this.storage.length;
    }

    toListCopy(): T[] {
        let stackCopy: T[] = [];
        for (let i = this.storage.length - 1; i >= 0; i--) {
            stackCopy.push(this.storage[i]);
        }
        return stackCopy;
    }
}