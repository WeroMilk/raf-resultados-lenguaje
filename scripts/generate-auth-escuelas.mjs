#!/usr/bin/env node
/**
 * Añade usuarios por escuela (CCT + contraseña) a auth-data.json.
 * Cada escuela solo verá su propia información en /escuela/{cct}.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = path.join(process.cwd());
const AUTH_DATA_PATH = path.join(ROOT, "lib", "auth-data.json");

function normalizePassword(text) {
  return String(text || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "");
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

// CCT y contraseña por escuela (agregar más aquí si es necesario)
const ESCUELAS = [
  ["26DST0001P", "dst0001pF+"],
  ["26DST0005L", "dst0005lB+"],
  ["26DST0006K", "dst0006kA+"],
  ["26DST0010X", "dst0010xS+"],
  ["26DST0011W", "dst0011wR+"],
  ["26DST0012V", "dst0012vQ+"],
  ["26DST0019O", "dst0019oG+"],
  ["26DST0020D", "dst0020dH+"],
  ["26DST0022B", "dst0022bF+"],
  ["26DST0023A", "dst0023aE+"],
  ["26DST0024Z", "dst0024zM+"],
  ["26DST0025Z", "dst0025zW+"],
  ["26DST0026Y", "dst0026yV+"],
  ["26DST0027X", "dst0027xU+"],
  ["26DST0028W", "dst0028wT+"],
  ["26DST0042P", "dst0042pA+"],
  ["26DST0048J", "dst0048jU+"],
  ["26DST0051X", "dst0051xM+"],
  ["26DST0053V", "dst0053vJ+"],
  ["26DST0054U", "dst0054uH+"],
  ["26DST0055T", "dst0055tG+"],
  ["26DST0056S", "dst0056sF+"],
  ["26DST0060E", "dst0060eD+"],
  ["26DST0061D", "dst0061dC+"],
  ["26DST0065Z", "dst0065zF+"],
  ["26DST0067Y", "dst0067yQ+"],
  ["26DST0071K", "dst0071kN+"],
  ["26DST0073I", "dst0073iK+"],
  ["26DST0074H", "dst0074hJ+"],
  ["26DST0076F", "dst0076fG+"],
  ["26DST0078D", "dst0078dE+"],
];

const escuelasAuth = {};
const passwordsList = [];

for (const [cct, pwd] of ESCUELAS) {
  const hash = sha256(normalizePassword(pwd));
  escuelasAuth[cct] = hash;
  passwordsList.push({ cct, pwd });
}

// Leer auth-data.json actual y añadir/actualizar escuelas
let authData = { superUsuario: "", zonas: {} };
if (fs.existsSync(AUTH_DATA_PATH)) {
  const raw = fs.readFileSync(AUTH_DATA_PATH, "utf8").replace(/^\uFEFF/, "");
  authData = JSON.parse(raw);
}
if (!authData.escuelas) authData.escuelas = {};
Object.assign(authData.escuelas, escuelasAuth);

fs.mkdirSync(path.dirname(AUTH_DATA_PATH), { recursive: true });
fs.writeFileSync(AUTH_DATA_PATH, JSON.stringify(authData, null, 2), "utf8");

const LISTA_PATH = path.join(ROOT, "USUARIOS-Y-CONTRASEÑAS-ESCUELAS.txt");
const lineasLista = [
  "RAF Lenguaje – Usuarios y contraseñas por ESCUELA",
  "==================================================",
  "",
  "Cada escuela solo puede ver su propia información en /escuela/{cct}.",
  "",
  "CCT\t\tContraseña",
  "---\t\t----------",
  ...passwordsList.map(({ cct, pwd }) => `  ${cct}\t${pwd}`),
  "",
  `Total: ${passwordsList.length} escuelas.`,
  "Guarda este archivo en lugar seguro y no lo subas a Git.",
];
fs.writeFileSync(LISTA_PATH, lineasLista.join("\n"), "utf8");

console.log("Actualizado:", AUTH_DATA_PATH);
console.log("Lista guardada en:", LISTA_PATH);
console.log("\nEscuelas añadidas:", passwordsList.length);
passwordsList.forEach(({ cct, pwd }) => console.log("  ", cct, "→", pwd));
