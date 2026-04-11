class BiDirectionalPriorityQueue {
    constructor() {
        this.items = [];
        this.order = [];
    }

    enqueue(item, priority) {
        const element = {
            value: item,
            priority: priority,
            id: Math.random()
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
        if (this.items.length === 0) return null;

        let toRemove = null;

        if (mode === "highest") {
            toRemove = this.items[0];
            for (let i = 1; i < this.items.length; i++) {
                if (this.items[i].priority > toRemove.priority) {
                    toRemove = this.items[i];
                }
            }
        } else if (mode === "lowest") {
            toRemove = this.items[0];
            for (let i = 1; i < this.items.length; i++) {
                if (this.items[i].priority < toRemove.priority) {
                    toRemove = this.items[i];
                }
            }
        } else if (mode === "oldest") {
            toRemove = this.order[0];
        } else if (mode === "newest") {
            toRemove = this.order[this.order.length - 1];
        } else {
            return null;
        }

        const newItems = [];
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id !== toRemove.id) {
                newItems.push(this.items[i]);
            }
        }
        this.items = newItems;

        const newOrder = [];
        for (let i = 0; i < this.order.length; i++) {
            if (this.order[i].id !== toRemove.id) {
                newOrder.push(this.order[i]);
            }
        }
        this.order = newOrder;

        return toRemove;
    }
}

const pq = new BiDirectionalPriorityQueue();
pq.enqueue("A", 5);
pq.enqueue("B", 1);
pq.enqueue("C", 10);
pq.enqueue("D", 3);

console.log(pq.dequeue("highest").value);
console.log(pq.dequeue("oldest").value);
console.log(pq.dequeue("lowest").value);
console.log(pq.dequeue("newest").value);