import { db } from "../database"

export const setupDatabase = async () => {
  try {
    await db.execAsync("PRAGMA foreign_keys = ON;");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS portfolios (
        portfolio_id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS assets (
        asset_id TEXT PRIMARY KEY NOT NULL,
        portfolio_id TEXT NOT NULL,
        type TEXT NOT NULL,
        symbol TEXT NOT NULL,
        name TEXT,
        UNIQUE(symbol, type, portfolio_id),
        FOREIGN KEY (portfolio_id) REFERENCES portfolios (portfolio_id) ON DELETE CASCADE
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        tx_id TEXT PRIMARY KEY NOT NULL,
        portfolio_id TEXT NOT NULL,
        asset_id TEXT NOT NULL,
        quantity REAL NOT NULL,
        price REAL,
        date TEXT,
        note TEXT,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios (portfolio_id) ON DELETE CASCADE,
        FOREIGN KEY (asset_id) REFERENCES assets (asset_id) ON DELETE CASCADE
      );
    `);

  } catch (error) {
    console.error("Couldn't setup database", error);
  }
};

export const updateTransaction = async (tx: any) => {
  try {
    await db.execAsync(`
      UPDATE transactions 
      SET quantity = ${tx.quantity},
          price = ${tx.price ?? null},
          date = '${tx.date ?? ""}',
          note = '${tx.note ?? ""}'
      WHERE tx_id = '${tx.tx_id}'
    `);
    console.log("Transaction successfully updated!");
  } catch (error) {
    console.error("Couldn't update transaction, error: ", error);
  }
};

export const insertPortfolio = async (portfolio_id: string, name: string) => {

    try {
      await db.execAsync(`
        INSERT INTO portfolios (portfolio_id, name)
        VALUES ('${portfolio_id}', '${name}')
        ON CONFLICT(portfolio_id) DO UPDATE SET
          name = EXCLUDED.name
      `);
      console.log("Portfolio inserted/updated successfully!");
    } catch (error) {
      console.error("Couldn't insert portfolio into DB, error: ", error);
    }
  };
  

  export const insertAsset = async (
    asset_id, portfolio_id, type, symbol
  ) => {
    const assetType = type || "crypto";
    try {
      const result = await db.execAsync(`
        UPDATE assets 
        SET portfolio_id = '${portfolio_id}', 
            type = '${assetType}', 
            symbol = '${symbol}'
        WHERE asset_id = '${asset_id}'
      `);
      
      if (!result || result.rowsAffected === 0) {
        await db.execAsync(`
          INSERT INTO assets (asset_id, portfolio_id, type, symbol)
          VALUES ('${asset_id}', '${portfolio_id}', '${assetType}', '${symbol}')
          ON CONFLICT(symbol, type, portfolio_id) DO UPDATE SET
            asset_id = '${asset_id}'
        `);
      }
      
      console.log("Asset inserted/updated successfully!");
    } catch (e) {
      console.error("Couldn't insert asset into DB, error: ", e);
    }
  };
  
  
  
  export const getAllTransactions = async () => {
    try {
        return await db.getAllAsync("SELECT * FROM transactions");
    } catch (error) {
        console.error("Failed to fetch transactions:", error)
        return [];
    }
}

export const insertTransactions = async (tx: any | any[]) => {
  let result = await db.getAllAsync("SELECT * FROM portfolios")

    try {
      if (Array.isArray(tx)) {
        for (const t of tx) {
          await db.execAsync(`
            INSERT INTO transactions (tx_id, portfolio_id, asset_id, quantity, price, date, note)
            VALUES ('${t.tx_id}', '${t.portfolio_id}', '${t.asset_id}', ${t.quantity}, ${t.price ?? null}, '${t.date ?? ""}', '${t.note ?? ""}')    
          `);
        }
      } else {
        await db.execAsync(`
          INSERT INTO transactions (tx_id, portfolio_id, asset_id, quantity, price, date, note)
          VALUES ('${tx.tx_id}', '${tx.portfolio_id}', '${tx.asset_id}', ${tx.quantity}, ${tx.price ?? null}, '${tx.date ?? ""}', '${tx.note ?? ""}')
        `);
      }
      console.log("Transaction(s) successfully inserted!");
    } catch (error) {
      console.error("Couldn't insert transaction(s), error: ", error);
    }
  };