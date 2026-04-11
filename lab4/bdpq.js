class BiDirectionalPriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(item, priority) {
        const element = {
            value: item,
            priority: priority,
            time: Date.now()
        };
        this.items.push(element);
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

console.log(pq.peek("highest").value);
console.log(pq.peek("lowest").value);