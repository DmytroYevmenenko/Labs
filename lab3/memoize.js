function memoize(fn, options = {}) {
    const maxSize = options.maxSize ?? Infinity;
    const ttl = options.ttl;
    const strategy = options.strategy || 'lru';
    const evictionFn = options.evictionFn;

    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);
        const now = Date.now();

        const cached = cache.get(key);

        if (cached) {
            if (ttl && now - cached.time > ttl) {
                cache.delete(key);
            } else {
                cached.count++;
                cache.delete(key);
                cache.set(key, cached);
                return cached.value;
            }
        }

        const result = fn(...args);

        cache.set(key, {
            value: result,
            count: 1,
            time: now
        });

        if (cache.size > maxSize) {
            let removeKey;

            if (strategy === 'lfu') {
                let min = Infinity;

                for (const [k, v] of cache) {
                    if (v.count < min) {
                        min = v.count;
                        removeKey = k;
                    }
                }
            } 
            else if (strategy === 'custom' && evictionFn) {
                removeKey = evictionFn(cache);
            } 
            else {
                removeKey = cache.keys().next().value;
            }

            cache.delete(removeKey);
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