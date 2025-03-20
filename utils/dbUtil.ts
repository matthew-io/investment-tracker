import { db } from "../database"

export const setupDatabase = async () => {
    try {
        await db.execAsync("PRAGMA foreign_keys = ON;");

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS assets (
                asset_id TEXT PRIMARY KEY NOT NULL,
                type TEXT NOT NULL,
                symbol TEXT NOT NULL,
                name TEXT,
                UNIQUE(symbol, type)
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS transactions (
                tx_id TEXT PRIMARY KEY NOT NULL,
                asset_id TEXT NOT NULL,
                quantity REAL NOT NULL,
                price REAL,
                date TEXT,
                note TEXT,
                FOREIGN KEY (asset_id) REFERENCES assets (asset_id) ON DELETE CASCADE
            );
        `);

        console.log("Setting up database complete");
    } catch (error) {
        console.error("Couldn't setup database", error);
    }
};

export const insertAsset = async (asset_id: string, type: string, symbol: string, name: string) => {
    try {
        await db.execAsync(`
            INSERT INTO assets (asset_id, type, symbol, name)
            VALUES ('${asset_id}', '${type}', '${symbol}', '${name}')
            ON CONFLICT(symbol, type) DO UPDATE SET
                name = EXCLUDED.name    
        `);
    } catch (e) {
        console.log("Couldn't insert asset into DB, error: ", e)
    }
}

export const getAllTransactions = async () => {
    try {
        return await db.getAllAsync("SELECT * FROM transactions");
    } catch (error) {
        console.error("Failed to fetch transactions:", error)
        return [];
    }
}

export const insertTransactions = async (tx: any | any[]) => {
    try {
        if (Array.isArray(tx)) {
            for (const t of tx) {
                await db.execAsync(`
                    INSERT INTO transactions (tx_id, asset_id, quantity, price, date, note)
                    VALUES ('${t.t_id}', '${t.asset_id}', ${t.quantity}, ${t.price ?? null}, '${t.date ?? ""}', '${t.note ?? ""}')    
                `)
            }
        } else {
            await db.execAsync(`
                INSERT INTO transactions (tx_id, asset_id, quantity, price, date, note)
                VALUES ('${tx.tx_id}', '${tx.asset_id}', ${tx.quantity}, ${tx.price ?? null}, '${tx.date ?? ""}', '${tx.note ?? ""}')
            `)
        }
        console.log("Transaction(s) successfully inserted!")
    } catch (error) {
        console.error("Couldn't insert transaction(s), error: ", error)
    }
}