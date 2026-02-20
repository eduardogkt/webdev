import generateName from "sillyname";
import { randomSuperhero } from "superheroes";

// let generateName = require("sillyname");

let sillyName = generateName();
console.log(`Meu nome é ${sillyName}!`);

let heroName = randomSuperhero();
console.log(`Meu nome é ${heroName}!`);
