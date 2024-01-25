export function seededRandom(seed) {
    var x = Math.sin(seed++) * 1000000;
    return x - Math.floor(x);
}
