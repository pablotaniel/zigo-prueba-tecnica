import fs from "fs";
import path from "path";
import { db } from "../src/shared/db";


async function migrate() {

   
    const file = path.resolve(
        "../database/schema.sql"
    );
    const sql = fs.readFileSync(file, "utf8");

    await db.query(sql);

    console.log("Migration completed");

    process.exit(0);
}

migrate();