import path from 'node:path'
import fs from "node:fs";

async function fetchThreeGames() {
    for (let i = 0; i < 3; i++) {
        let res = await fetch('http://localhost:3000/10/board');
        res = await res.json();

    }
}

//fetchThreeGames() ;
// const str = path.resolve("z.txt") ;
// console.log(str)
async function tryWrite() {

    try {
        let arrStr = "";
        for (let i = 7; i <= 10; i++) {
            let res = await fetch(`http://localhost:3000/${i}/board`);
            let text = await res.text();
            text = text.replace(/\s*"(\w+)"\s*:/g, "$1:")
          //  text = text.substring(1,text.length) ;
            arrStr += `${text} ${(i < 10) ? "," : ""}` ;
        }
        const str = `export const list = `
        const filepath = path.resolve("public", `skeletonmain.js`);
        fs.writeFileSync(filepath, str+`[${arrStr}]`);
        
    } catch (err) {
        console.error(err);
    }
}
tryWrite();