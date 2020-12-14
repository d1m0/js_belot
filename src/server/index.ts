#! /usr/bin/env node
import Args from "command-line-args"
import { BelotServer } from "./belot_server";

const argsDefinition = [
    {name: "port", type: Number, default: 5000},
    {name: "ganache-url", type: String},
    {name: "compilation-artifacts", alias: "c", type: String, multiple: true}
]
const args = Args(argsDefinition);
const app = new BelotServer(args.port);
app.start();