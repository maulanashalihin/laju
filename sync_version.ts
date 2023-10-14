import { writeFileSync } from "fs";
const p = require("./package.json")
const version = p.version;
const split_v = version.split(".");
split_v[2] = parseInt(split_v[2]) + 1;
p.version = split_v.join(".")

console.log(p.version)
writeFileSync( "./package.json", JSON.stringify(p,null, 2) )