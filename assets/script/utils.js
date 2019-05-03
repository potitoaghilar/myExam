
/**
 * FUNCTIONS USEFUL TO HELP THE OPERATIONS ON DATAS
 */

let swap = (o,r={})=> Object.keys(o).map(x=>r[o[x]]=x)&&r;

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}