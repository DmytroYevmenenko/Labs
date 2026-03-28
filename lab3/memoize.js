function memoize(fn, options = {}) {
    const maxSize = options.maxSize ?? Infinity;
    const ttl = options.ttl;
    const strategy = options.strategy || 'lru';
    const evictionFn = options.evictionFn;

    const cache = new Map();

    function isExpired(item) {
        return ttl && Date.now() - item.time > ttl;
    }

    function evict() {
        if (cache.size <= maxSize) return;
        let keyToDelete;
        if (strategy === 'lfu') {
            let min = Infinity;
            for (const [k, v] of cache) {
                if (v.count < min) {
                    min = v.count;
                    keyToDelete = k;
                }
            }
        } else if (strategy === 'custom' && evictionFn) {
            keyToDelete = evictionFn(cache);
        } else {
            keyToDelete = cache.keys().next().value;
        }

        cache.delete(keyToDelete);
    }
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            const item = cache.get(key);
            if (isExpired(item)) {
                cache.delete(key);
            } else {
                item.count++;
                cache.delete(key);
                cache.set(key, item);
                return item.value;
            }
        }

        const value = fn(...args);

        cache.set(key, {
            value,
            count: 1,
            time: Date.now()
        });

        evict();

        return value;
    };
}

const slow = (a, b) => {
    console.log("calc...");
    return a + b;
};

const m = memoize(slow, { maxSize: 2 });

console.log(m(1, 2));
console.log(m(1, 2));
console.log(m(2, 3));
console.log(m(3, 4));
console.log(m(1, 2));