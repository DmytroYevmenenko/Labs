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
        const day = iterator.next().value;
        const time = new Date().toLocaleTimeString();
        
        console.log(`[${time}] Iteration ${iteration++}: ${day}`);
    }, 200);

    setTimeout(() => {
        clearInterval(interval);
        console.log(`\nTimeout finished after ${seconds} seconds`);
    }, seconds * 1000);
}

const gen = dayGenerator();
startTimeout(gen, 5);