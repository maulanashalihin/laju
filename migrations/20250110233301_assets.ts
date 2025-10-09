import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('assets', (table) => {
        table.string('id').primary();
        
        // Asset Information
        table.string('name');
        table.string('type').notNullable(); // image, video, document, etc
        table.string('url').notNullable();
        table.string('mime_type');
        table.integer('size').unsigned(); // file size in bytes
        table.string('s3_key').nullable().index(); // S
        // Ownership and Organization 
        table.string('user_id').index(); 
        
         
        // Timestamps
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('assets');
}
