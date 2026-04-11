class BiDirectionalPriorityQueue {
    constructor() {
        this.items = [];
        this.order = [];
    }

    enqueue(item, priority) {
        const element = {
            value: item,
            priority: priority,
            id: Date.now()
        };
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
        return null;
    }
}

const pq = new BiDirectionalPriorityQueue();
pq.enqueue("A", 5);
pq.enqueue("B", 1);
pq.enqueue("C", 10);
pq.enqueue("D", 3);

console.log(pq.peek("highest").value);
console.log(pq.peek("lowest").value);
console.log(pq.peek("oldest").value);
console.log(pq.peek("newest").value);