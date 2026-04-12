class BiDirectionalPriorityQueue {
    constructor() {
        this.items = [];
        this.order = [];
        this.counter = 0;
    }

    enqueue(item, priority) {
        const element = {
            value: item,
            priority: priority,
            id: this.counter
        };
        this.counter++;
        this.items.push(element);
        this.order.push(element);
    }

    peek(mode) {
        if (this.items.length === 0) return null;

        if (mode === "highest") {
            let highest = this.items[0];
            for (let i = 1; i < this.items.length; i++) {
                if (this.items[i].priority > highest.priority) {
                    highest = this.items[i];
                }
            }
            return highest;
        }

        if (mode === "lowest") {
            let lowest = this.items[0];
            for (let i = 1; i < this.items.length; i++) {
                if (this.items[i].priority < lowest.priority) {
                    lowest = this.items[i];
                }
            }
            return lowest;
        }

        if (mode === "oldest") {
            return this.order[0];
        }

        if (mode === "newest") {
            return this.order[this.order.length - 1];
        }

        return null;
    }

    dequeue(mode) {
        if (this.items.length === 0) return null;

        let toRemove = null;
        let removeIndex = -1;

        if (mode === "highest") {
            toRemove = this.items[0];
            removeIndex = 0;
            for (let i = 1; i < this.items.length; i++) {
                if (this.items[i].priority > toRemove.priority) {
                    toRemove = this.items[i];
                    removeIndex = i;
                }
            }
            this.items.splice(removeIndex, 1);
        } else if (mode === "lowest") {
            toRemove = this.items[0];
            removeIndex = 0;
            for (let i = 1; i < this.items.length; i++) {
                if (this.items[i].priority < toRemove.priority) {
                    toRemove = this.items[i];
                    removeIndex = i;
                }
            }
            this.items.splice(removeIndex, 1);
        } else if (mode === "oldest") {
            toRemove = this.order.shift();
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].id === toRemove.id) {
                    this.items.splice(i, 1);
                    break;
                }
            }
        } else if (mode === "newest") {
            toRemove = this.order.pop();
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].id === toRemove.id) {
                    this.items.splice(i, 1);
                    break;
                }
            }
        } else {
            return null;
        }

        return toRemove;
    }
}

const pq = new BiDirectionalPriorityQueue();
pq.enqueue("A", 5);
pq.enqueue("B", 1);
pq.enqueue("C", 10);
pq.enqueue("D", 3);
pq.enqueue("E", 7);

console.log(pq.dequeue("highest").value);
console.log(pq.dequeue("lowest").value);
console.log(pq.dequeue("oldest").value);
console.log(pq.dequeue("newest").value);
console.log(pq.peek("highest").value);