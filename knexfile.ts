import type { Knex } from "knex"; 

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./data/dev.sqlite3"
    },
    useNullAsDefault : true
  },

  production: {
    client: "better-sqlite3",
    connection: {
      filename: "./data/production.sqlite3"
    },
    useNullAsDefault : true
  },

  test: {
    client: "better-sqlite3",
    connection: {
      filename: "./data/test.sqlite3"
    },
    useNullAsDefault : true,
    migrations: {
      directory: './migrations'
    }
  }

};

export default config