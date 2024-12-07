import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().notNullable()
        table.string('name', 255) 
        table.string('email', 255).unique().notNullable()
        table.string('phone', 255) 
        table.boolean("is_verified").defaultTo(false) 
        table.dateTime('membership_date');
        table.boolean("is_admin").defaultTo(false);
        table.string('password', 180).notNullable()
        table.string('remember_me_token').nullable()
   
        /**
         * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.bigInteger("created_at")
        table.bigInteger("updated_at")
      
    }) 
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}

