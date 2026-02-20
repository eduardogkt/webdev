// requirindo fs
const fs = require("fs");

// fs.writeFile("msg.txt", "Alguma coisa", (err) => {
//     if (err) throw err;
//     console.log("File has been saved!");
// });

fs.readFile("msg.txt", "utf-8", (err, data) => {
    if (err) throw err;
    console.log(data);
});
