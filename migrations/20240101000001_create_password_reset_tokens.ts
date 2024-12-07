import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('password_reset_tokens', (table) => {
        table.increments('id').primary();
        table.string('email').notNullable().index();
        table.string('token').notNullable().unique();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('expires_at').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('password_reset_tokens');
}
