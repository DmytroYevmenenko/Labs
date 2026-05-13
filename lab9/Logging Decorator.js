function log(fn) {
  return function(...args) {
    console.log(`calling ${fn.name} with args:`, args);
    const result = fn(...args);
    console.log(`${fn.name} returned:`, result);
    return result;
  };
}

function add(a, b) {
  return a + b;
}

function greet(name) {
  return `hello, ${name}`;
}

const loggedAdd = log(add);
const loggedGreet = log(greet);

loggedAdd(2, 3);
loggedGreet("Alice");