/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer
    .prompt({
        name: "input",
        message: "Enter a URL",
    })
    .then((answer) => {
        // gravando a URL de input
        const url = answer.input;
        fs.writeFile("./url.txt", url, (err) => {
            if (err) throw err;
            console.log("Arquivo gravado");
        });

        let qrCode = qr.image(url, { type: "png" });
        qrCode.pipe(fs.createWriteStream("qr-code.png"));
        console.log("QR code criado");
    })
    .catch((error) => {
        if (error.isTtyError) {
            console.error("Prompt coudn't be rendered");
        } else {
            console.error("Algo deu errado");
            console.error(error);
        }
    });
