import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('email_verification_tokens', (table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable().index();
        table.string('token').notNullable().unique();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('expires_at').notNullable();
        
        table.foreign('user_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('email_verification_tokens');
}
