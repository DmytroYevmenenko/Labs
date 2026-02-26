const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function* dayGenerator() {
    while (true) {
        for (let day of days) {
            yield day;
        }
    }
}

function startTimeout(iterator, seconds) {
    let iteration = 1;
    const interval = setInterval(() => {
        const result = iterator.next();
        const day = result.value;
        const time = new Date().toLocaleTimeString();
        
        console.log(`[${time}] Iteration ${iteration++}: ${day}`);
    }, 500);

    setTimeout(() => {
        clearInterval(interval);
        console.log(`\nTimeout finished after ${seconds} seconds`);
    }, seconds * 1000);
}

const gen = dayGenerator();
startTimeout(gen, 5);