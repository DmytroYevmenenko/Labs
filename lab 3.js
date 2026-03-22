function memoize(fn, options = {}) {
    const {
        maxSize = Infinity,
        strategy = 'lru',
        ttl = null,
        customEvict = null
    } = options;

    const cache = new Map();
    const accessCount = new Map();
    const lruOrder = [];

    function getCacheKey(args) {
        return JSON.stringify(args);
    }

    function updateLRU(key) {
        const index = lruOrder.indexOf(key);
        if (index !== -1) {
            lruOrder.splice(index, 1);
        }
        lruOrder.push(key);
    }

    function evictLRU() {
        if (lruOrder.length === 0) return;
        const oldestKey = lruOrder.shift();
        cache.delete(oldestKey);
        accessCount.delete(oldestKey);
    }

    function evictLFU() {
        if (accessCount.size === 0) return;
        let minKey = null;
        let minCount = Infinity;
        for (const [key, count] of accessCount) {
            if (count < minCount) {
                minCount = count;
                minKey = key;
            }
        }
        if (minKey) {
            cache.delete(minKey);
            accessCount.delete(minKey);
            const index = lruOrder.indexOf(minKey);
            if (index !== -1) lruOrder.splice(index, 1);
        }
    }

    function evictExpired() {
        if (!ttl) return;
        const now = Date.now();
        const toDelete = [];
        for (const [key, entry] of cache) {
            if (now - entry.timestamp > ttl) {
                toDelete.push(key);
            }
        }
        for (const key of toDelete) {
            cache.delete(key);
            accessCount.delete(key);
            const index = lruOrder.indexOf(key);
            if (index !== -1) lruOrder.splice(index, 1);
        }
    }

    function evict() {
        if (cache.size <= maxSize) {
            if (strategy === 'time' && ttl) {
                evictExpired();
            }
            return;
        }

        switch (strategy) {
            case 'lru':
                evictLRU();
                break;
            case 'lfu':
                evictLFU();
                break;
            case 'time':
                evictExpired();
                break;
            case 'custom':
                if (typeof customEvict === 'function') {
                    customEvict(cache, { accessCount, lruOrder });
                }
                break;
            default:
                evictLRU();
        }
    }

    function memoized(...args) {
        const key = getCacheKey(args);

        if (cache.has(key)) {
            const cached = cache.get(key);
            
            if (ttl && (Date.now() - cached.timestamp > ttl)) {
                cache.delete(key);
                accessCount.delete(key);
                const index = lruOrder.indexOf(key);
                if (index !== -1) lruOrder.splice(index, 1);
            } else {
                updateLRU(key);
                
                if (strategy === 'lfu') {
                    accessCount.set(key, (accessCount.get(key) || 0) + 1);
                }
                
                return cached.value;
            }
        }

        const result = fn(...args);
        
        cache.set(key, {
            value: result,
            timestamp: Date.now()
        });
        
        accessCount.set(key, 1);
        updateLRU(key);
        
        if (cache.size > maxSize) {
            evict();
        }
        
        return result;
    }

    memoized.clear = function() {
        cache.clear();
        accessCount.clear();
        lruOrder.length = 0;
    };

    memoized.size = function() {
        return cache.size;
    };

    memoized.getCache = function() {
        return cache;
    };

    return memoized;
}

const expensiveFunction = (a, b) => {
    console.log(`Computing ${a} + ${b}...`);
    return a + b;
};

console.log('=== LRU Strategy ===');
const memoizedLRU = memoize(expensiveFunction, { maxSize: 2, strategy: 'lru' });
console.log(memoizedLRU(2, 3));
console.log(memoizedLRU(2, 3));
console.log(memoizedLRU(4, 5));
console.log(memoizedLRU(6, 7));
console.log('LRU cache size:', memoizedLRU.size());

console.log('\n=== LFU Strategy ===');
const memoizedLFU = memoize(expensiveFunction, { maxSize: 2, strategy: 'lfu' });
console.log(memoizedLFU(1, 1));
console.log(memoizedLFU(1, 1));
console.log(memoizedLFU(2, 2));
console.log(memoizedLFU(1, 1));
console.log(memoizedLFU(3, 3));
console.log('LFU cache size:', memoizedLFU.size());

console.log('\n=== Time-Based Strategy ===');
const memoizedTime = memoize(expensiveFunction, { maxSize: 3, strategy: 'time', ttl: 2000 });
console.log(memoizedTime(10, 20));
console.log(memoizedTime(10, 20));
setTimeout(() => {
    console.log(memoizedTime(10, 20));
    console.log('Time-based cache size after TTL:', memoizedTime.size());
}, 2500);

console.log('\n=== Custom Strategy ===');
const memoizedCustom = memoize(expensiveFunction, {
    maxSize: 2,
    strategy: 'custom',
    customEvict: (cache, metadata) => {
        console.log('Custom eviction called');
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
        metadata.accessCount.delete(firstKey);
        const index = metadata.lruOrder.indexOf(firstKey);
        if (index !== -1) metadata.lruOrder.splice(index, 1);
    }
});
console.log(memoizedCustom(100, 200));
console.log(memoizedCustom(300, 400));
console.log(memoizedCustom(500, 600));
console.log('Custom cache size:', memoizedCustom.size());

console.log('\n=== Clearing Cache ===');
memoizedLRU.clear();
console.log('After clearing LRU:', memoizedLRU.size());