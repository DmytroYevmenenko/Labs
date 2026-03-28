function memoize(fn, options = {}) {
    const maxSize = options.maxSize || Infinity;
    const strategy = options.strategy || 'lru';
    const ttl = options.ttl;

    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            const item = cache.get(key);
            if (!ttl || Date.now() - item.time <= ttl) {
                item.count++;
                cache.delete(key);
                cache.set(key, item);
                return item.value;
            }
            cache.delete(key);
        }

        const result = fn(...args);

        cache.set(key, {
            value: result,
            count: 1,
            time: Date.now()
        });

        if (cache.size > maxSize) {
            let del = cache.keys().next().value;
            if (strategy === 'lfu') {
                let min = Infinity;
                for (let [k, v] of cache) {
                    if (v.count < min) {
                        min = v.count;
                        del = k;
                    }
                }
            }
            cache.delete(del);
        }
        return result;
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