import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('sessions', function (table) {
        table.string('id').primary();
        table.string("user_id").index();
        table.text("user_agent");
        table.timestamp('expires_at').nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('sessions')
}

