const EventEmitter = require("events")

const bus = new EventEmitter()

function createUser(name) {
    let handler = null
    return {
        name,
        subscribe() {
            handler = (data) => {
            console.log(`${name} received: ${data.text}`);
            };
        bus.on("message", handler);
        console.log(`${name} subscribed`);
        },
        unsubscribe() {
            if (handler) {
                bus.off("message", handler);
                handler = null;
                console.log(`${name} unsubscribed`);
            }
        }
    }
}

function createLogger() {
    let handler = null;
    
    return {
        subscribe() {
            handler = (data) => {  
                console.log(`[log] ${new Date().toISOString()}: ${data.text}`);
            };
            bus.on("message", handler);
        },
        unsubscribe() {
            if (handler) {
                bus.off("message", handler);
                handler = null;
            }
        }    
    };
}

async function main() {
    const alice = createUser("Alice")
    const bob = createUser("Bob")
    const logger = createLogger()

    alice.subscribe()
    bob.subscribe()
    logger.subscribe()


    console.log("\n--- first message (all listeners active) ---");
    bus.emit("message", { text: "hello everyone" });

    await new Promise(r => setTimeout(r, 500));

    console.log("\n--- bob unsubscribes ---");
    bob.unsubscribe();

    console.log("\n--- second message (bob should not receive) ---");
    bus.emit("message", { text: "bob should miss this" });

    await new Promise(r => setTimeout(r, 500));

    console.log("\n--- everyone unsubscribes ---");
    alice.unsubscribe();
    logger.unsubscribe();

    console.log("\n--- third message (nobody listening) ---");
    bus.emit("message", { text: "nobody hears this" });
    console.log("(no output above = correct)");
}

main();