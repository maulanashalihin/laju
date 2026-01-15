import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("cache", (table) => {
        table.string("key").primary();
        table.text("value").notNullable();
        table.bigInteger("expiration").notNullable(); // Unix timestamp in seconds
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("cache");
}
