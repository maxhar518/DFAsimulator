function dfaEndAndSub(s, p, sym, c = 9) {
    let states = Array.from({ length: s + 1 }, (_, i) => i);
    let temp = Array.from({ length: s + 1 }, (_, i) => i);

    let a1 = [];
    let b1 = [];

    let dfa = { [sym[0]]: a1, [sym[1]]: b1 };

    for (let i = 0; i < s; i++) {
        if (p[i] === sym[0]) {
            a1.push([i, i + 1]);
        } else {
            b1.push([i, i + 1]);
        }
    }

    for (let i = 0; i <= s; i++) {
        if (i > s - 1) {
            states[i] = " ";
            break;
        }
        states[i] = p.slice(i);
    }

    let counted = a1.map(i => i[0]);
    let miss = temp.filter(i => !counted.includes(i));

    let pre = "";
    for (let i of miss) {
        pre = states.slice(0, i).map(x => x[0]).join('') + sym[0];

        let stringList = [];
        for (let j = 0; j <= s; j++) {
            stringList.push(pre + states[j]);
        }

        let sizeComp = stringList.filter(k => check(p, k, s));

        let minElementPos = 0;
        for (let index = 0; index < sizeComp.length - 1; index++) {
            if (sizeComp[index].length > sizeComp[index + 1].length) {
                minElementPos = index + 1;
            }
        }

        a1.push([i, minElementPos]);
    }

    counted = b1.map(i => i[0]);
    miss = temp.filter(i => !counted.includes(i));

    for (let i of miss) {
        pre = states.slice(0, i).map(x => x[0]).join('') + sym[1];

        let stringList = [];
        for (let j = 0; j <= s; j++) {
            stringList.push(pre + states[j]);
        }

        let sizeComp = stringList.filter(k => check(p, k, s));

        let minElementPos = 0;
        for (let index = 0; index < sizeComp.length - 1; index++) {
            if (sizeComp[index].length > sizeComp[index + 1].length) {
                minElementPos = index + 1;
            }
        }

        b1.push([i, minElementPos]);
    }

    dfa[sym[0]] = sort(a1);
    dfa[sym[1]] = sort(b1);

    if (c === 3) {
        dfa[sym[0]][dfa[sym[0]].length - 1][1] = dfa[sym[0]][dfa[sym[0]].length - 1][0];
        dfa[sym[1]][dfa[sym[1]].length - 1][1] = dfa[sym[1]][dfa[sym[1]].length - 1][0];
    }

    return dfa;
}

function check(p, s, size) {
    return size <= s.length && s.slice(-size) === p;
}

function sort(lis) {
    return lis.sort((a, b) => a[0] - b[0]);
}
//draw automata
function dispTransition(dfa, string, sym, choice) {
    let sub = "₀₁₂₃₄₅₆₇₈₉";
    let transitionResult = "\n\nString Processing:\n";
    let ini = 0, next = 0;

    transitionResult += "Q" + ini.toString().replace(/[0-9]/g, m => sub[m]) + " ";
    for (let i of string) {
        next = dfa[i][ini][1];
        transitionResult += `―――${i}――→ Q` + next.toString().replace(/[0-9]/g, m => sub[m]) + " ";

        if (next === "D") {
            break;
        }
        ini = next;
    }

    if (next === dfa[sym[0]].length - 1) {
        transitionResult += "\n\nString is accepted";
    } else if (choice === 1 && next === dfa[sym[0]].length - 2) {
        transitionResult += "\n\nString is accepted";
    } else {
        transitionResult += "\n\nString is rejected";
    }

    document.getElementById("transitionResult").innerText = transitionResult;
}

//Transisition Table
function dispTable(dfa, sym, choice) {
    let sub = "₀₁₂₃₄₅₆₇₈₉";
    let tableResult = "\nTransition Table:\n";
    tableResult += `\n    Q    |  ${sym[0]}   |   ${sym[1]}   \n`;
    tableResult += "――――\n";

    for (let i = 0; i < dfa[sym[0]].length; i++) {
        if (i === 0) {
            tableResult += "";
        } else if (i === dfa[sym[0]].length - 1 && choice !== 1) {
            tableResult += "  **";
        } else if (i === dfa[sym[0]].length - 2 && choice === 1) {
            tableResult += "  **";
        } else {
            tableResult += "    ";
        }

        if (choice === 1 && i === dfa[sym[0]].length - 1) {
            tableResult += `QD   Q${dfa[sym[0]][i][1].toString().replace(/[0-9]/g, m => sub[m])}   Q${dfa[sym[1]][i][1].toString().replace(/[0-9]/g, m => sub[m])}\n`;
            break;
        }

        tableResult += `Q${i.toString().replace(/[0-9]/g, m => sub[m])}   Q${dfa[sym[0]][i][1].toString().replace(/[0-9]/g, m => sub[m])}   Q${dfa[sym[1]][i][1].toString().replace(/[0-9]/g, m => sub[m])}\n`;
    }

    document.getElementById("tableResult").innerText = tableResult;
}
//real processing
function dfaStart(s, p, sym) {
    const DEAD = 999;  // Define the dead state
    const states = Array.from({ length: s + 1 }, (_, i) => i);  // Array of state indices
    let dfa = { [sym[0]]: [], [sym[1]]: [] };  // Initialize DFA transition table
    
    // Initialize transition tables with dead state transitions
    for (let i = 0; i <= s; i++) {
        dfa[sym[0]].push([i, DEAD]);
        dfa[sym[1]].push([i, DEAD]);
    }

    // Fill transitions based on the pattern p
    for (let i = 0; i < s; i++) {
        if (p[i] === sym[0]) {
            dfa[sym[0]][i][1] = i + 1;
        } else {
            dfa[sym[1]][i][1] = i + 1;
        }
    }

    // Replace any remaining dead state references
    for (let key of sym) {
        for (let transition of dfa[key]) {
            if (transition[1] === DEAD) {
                transition[1] = "D";
            }
        }
    }

    // Sort transitions for each symbol
    dfa[sym[0]].sort((a, b) => a[0] - b[0]);
    dfa[sym[1]].sort((a, b) => a[0] - b[0]);

    return dfa;
}

// Example usage:
// let s = 3;
// let p = "aba";
// let sym = ["a", "b"];
// console.log(dfaStart(s, p, sym));

//Draw Graphics Automata
// function drawDFA(dfa) {
//     let canvas = document.getElementById("dfaCanvas");
//     let ctx = canvas.getContext("2d");

//     let radius = 20;
//     let colors = ["red", "green", "purple", "blue", "orange"];
//     let space = 1000;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     let positions = [];
//     for (let i = 0; i < dfa[Object.keys(dfa)[0]].length; i++) {
//         let x = space * (i + 1);
//         let y = canvas.height / 2;
//         positions.push({ x, y });

//         ctx.beginPath();
//         ctx.arc(x, y, radius, 0, 2 * Math.PI);
//         ctx.fillStyle = colors[i % colors.length];
//         ctx.fill();
//         ctx.stroke();

//         ctx.fillStyle = "black";
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.fillText("Q" + i, x, y);
//     }

//     for (let i = 0; i < dfa[Object.keys(dfa)[0]].length; i++) {
//         for (let j = 0; j < Object.keys(dfa).length; j++) {
//             let symbol = Object.keys(dfa)[j];
//             let transitions = dfa[symbol];

//             if (transitions[i][1] !== "D") {
//                 let from = positions[i];
//                 let to = positions[transitions[i][1]];

//                 ctx.beginPath();
//                 ctx.moveTo(from.x, from.y);
//                 ctx.lineTo(to.x, to.y);
//                 ctx.strokeStyle = colors[j % colors.length];
//                 ctx.stroke();

//                 ctx.fillStyle = "black";
//                 ctx.fillText(symbol, (from.x + to.x) / 2, (from.y + to.y) / 2);
//             }
//         }
//     }
// }

function main() {
    let symbol = document.getElementById("symbols").value;
    let pattern = document.getElementById("pattern").value;
    let string = document.getElementById("string").value;
    let choice = parseInt(document.getElementById("option").value);
    let size = pattern.length;

    let dfa = {};

    if (choice === 1) {
        dfa = dfaStart(size, pattern, symbol);
    } else if (choice === 2) {
        dfa = dfaEndAndSub(size, pattern, symbol);
    } else if (choice === 3) {
        dfa = dfaEndAndSub(size, pattern, symbol, choice);
    }

    dispTable(dfa, symbol, choice);
    dispTransition(dfa, string, symbol, choice);
    drawDFA(dfa);
}
