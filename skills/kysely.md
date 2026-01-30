# Kysely

> The most powerful type-safe SQL query builder for TypeScript

- [Kysely](https://kysely.dev/index.md)

## search

Kysely is the most powerful type-safe SQL query builder for TypeScript. Get unparalleled autocompletion and compile-time type safety for complex queries, joins, and subqueries. Used in production by Deno, Maersk, and Cal.com. Modern TypeScript, zero runtime overhead.

- [Search the documentation](https://kysely.dev/search.md): Kysely is the most powerful type-safe SQL query builder for TypeScript. Get unparalleled autocompletion and compile-time type safety for complex queries, joins, and subqueries. Used in production by Deno, Maersk, and Cal.com. Modern TypeScript, zero runtime overhead.

## docs


### dialects

A dialect is the glue between Kysely and the underlying database engine. Check the API docs to learn how to build your own.

- [Dialects](https://kysely.dev/docs/dialects.md): A dialect is the glue between Kysely and the underlying database engine. Check the API docs to learn how to build your own.

### examples


#### cte

- [Inserts, updates and deletions](https://kysely.dev/docs/examples/cte/inserts-updates-and-deletions.md): Some databases like postgres also allow you to run other queries than selects
- [Simple selects](https://kysely.dev/docs/examples/cte/simple-selects.md): Common table expressions (CTE) are a great way to modularize complex queries.

#### delete

- [Single row](https://kysely.dev/docs/examples/delete/single-row.md): Delete a single row:

#### insert

- [Complex values](https://kysely.dev/docs/examples/insert/complex-values.md): In addition to primitives, the values can also be arbitrary expressions.
- [Insert subquery](https://kysely.dev/docs/examples/insert/insert-subquery.md): You can create an INSERT INTO SELECT FROM query using the expression method.
- [Multiple rows](https://kysely.dev/docs/examples/insert/multiple-rows.md): On dialects that support it (for example PostgreSQL) you can insert multiple
- [Returning data](https://kysely.dev/docs/examples/insert/returning-data.md): On supported dialects like PostgreSQL you need to chain returning to the query to get
- [Single row](https://kysely.dev/docs/examples/insert/single-row.md): Insert a single row:

#### join

- [Aliased inner join](https://kysely.dev/docs/examples/join/aliased-inner-join.md): You can give an alias for the joined table like this:
- [Complex join](https://kysely.dev/docs/examples/join/complex-join.md): You can provide a function as the second argument to get a join
- [Simple inner join](https://kysely.dev/docs/examples/join/simple-inner-join.md): Simple inner joins can be done by providing a table name and two columns to join:
- [Subquery join](https://kysely.dev/docs/examples/join/subquery-join.md): You can join a subquery by providing two callbacks:

#### merge

- [Source row existence](https://kysely.dev/docs/examples/merge/source-row-existence.md): Update a target column based on the existence of a source row:
- [Temporary changes table](https://kysely.dev/docs/examples/merge/temporary-changes-table.md): Merge new entries from a temporary changes table:

#### select

- [A single column](https://kysely.dev/docs/examples/select/a-single-column.md): Select a single column:
- [Aliases](https://kysely.dev/docs/examples/select/aliases.md): You can give an alias for selections and tables by appending as the_alias to the name:
- [All columns](https://kysely.dev/docs/examples/select/all-columns.md): The selectAll method generates SELECT *:
- [All columns of a table](https://kysely.dev/docs/examples/select/all-columns-of-a-table.md): Select all columns of a table:
- [Column with a table](https://kysely.dev/docs/examples/select/column-with-a-table.md): Select a single column and specify a table:
- [Complex selections](https://kysely.dev/docs/examples/select/complex-selections.md): You can select arbitrary expression including subqueries and raw sql snippets.
- [Distinct](https://kysely.dev/docs/examples/select/distinct.md): The API documentation is packed with examples. The API docs are hosted here,
- [Distinct on](https://kysely.dev/docs/examples/select/distinct-on.md): The API documentation is packed with examples. The API docs are hosted here,
- [Function calls](https://kysely.dev/docs/examples/select/function-calls.md): This example shows how to create function calls. These examples also work in any
- [Generic find query](https://kysely.dev/docs/examples/select/generic-find-query.md): A generic type-safe helper function for finding a row by a column value:
- [Multiple columns](https://kysely.dev/docs/examples/select/multiple-columns.md): Select multiple columns:
- [Nested array](https://kysely.dev/docs/examples/select/nested-array.md): While kysely is not an ORM and it doesn't have the concept of relations, we do provide
- [Nested object](https://kysely.dev/docs/examples/select/nested-object.md): While kysely is not an ORM and it doesn't have the concept of relations, we do provide
- [Not null](https://kysely.dev/docs/examples/select/not-null.md): Sometimes you can be sure something's not null, but Kysely isn't able to infer

#### transactions

- [Controlled transaction](https://kysely.dev/docs/examples/transactions/controlled-transaction.md): A controlled transaction allows you to commit and rollback manually, execute
- [Controlled transaction /w savepoints](https://kysely.dev/docs/examples/transactions/controlled-transaction-w-savepoints.md): A controlled transaction allows you to commit and rollback manually, execute
- [Simple transaction](https://kysely.dev/docs/examples/transactions/simple-transaction.md): This example inserts two rows in a transaction. If an exception is thrown inside

#### update

- [Complex values](https://kysely.dev/docs/examples/update/complex-values.md): As always, you can provide a callback to the set method to get access
- [MySQL joins](https://kysely.dev/docs/examples/update/my-sql-joins.md): MySQL allows you to join tables directly to the "main" table and update
- [Single row](https://kysely.dev/docs/examples/update/single-row.md): Update a row in person table:

#### where

- [Complex where clause](https://kysely.dev/docs/examples/where/complex-where-clause.md): For complex where expressions you can pass in a single callback and
- [Conditional where calls](https://kysely.dev/docs/examples/where/conditional-where-calls.md): You can add expressions conditionally like this:
- [Object filter](https://kysely.dev/docs/examples/where/object-filter.md): You can use the and function to create a simple equality
- [OR where](https://kysely.dev/docs/examples/where/or-where.md): To combine conditions using OR, you can use the expression builder.
- [Simple where clause](https://kysely.dev/docs/examples/where/simple-where-clause.md): where method calls are combined with AND:
- [Where in](https://kysely.dev/docs/examples/where/where-in.md): Find multiple items using a list of identifiers:

### execution

The following page gives a simplified overview of Kysely's execution flow, from query

- [Execution flow](https://kysely.dev/docs/execution.md): The following page gives a simplified overview of Kysely's execution flow, from query

### generating-types

To work with Kysely, you're required to provide a database schema type definition to the Kysely constructor.

- [Generating types](https://kysely.dev/docs/generating-types.md): To work with Kysely, you're required to provide a database schema type definition to the Kysely constructor.

### getting-started

Prerequisites

- [Getting started](https://kysely.dev/docs/getting-started.md): Prerequisites

### integrations


#### llms

Kysely provides LLM-friendly documentation to help AI tools like Cursor, Windsurf, GitHub Copilot, ChatGPT, Claude, and Claude Code understand and work with it.

- [LLMs](https://kysely.dev/docs/integrations/llms.md): Kysely provides LLM-friendly documentation to help AI tools like Cursor, Windsurf, GitHub Copilot, ChatGPT, Claude, and Claude Code understand and work with it.

#### supabase

Supabase is an open-source Firebase alternative that provides a suite of tools

- [Supabase](https://kysely.dev/docs/integrations/supabase.md): Supabase is an open-source Firebase alternative that provides a suite of tools

### intro

Kysely (pronounced “Key-Seh-Lee”) is a type-safe and autocompletion-friendly TypeScript SQL query builder. Inspired by Knex. Mainly developed for node.js but also

- [Introduction](https://kysely.dev/docs/intro.md): Kysely (pronounced “Key-Seh-Lee”) is a type-safe and autocompletion-friendly TypeScript SQL query builder. Inspired by Knex. Mainly developed for node.js but also

### migrations

Migration files

- [Migrations](https://kysely.dev/docs/migrations.md): Migration files

### playground

@wirekang has created a playground for Kysely. You can use it to quickly test stuff out and for creating code examples for your issues, PRs and Discord messages.

- [Playground](https://kysely.dev/docs/playground.md): @wirekang has created a playground for Kysely. You can use it to quickly test stuff out and for creating code examples for your issues, PRs and Discord messages.

### plugins

Plugins are classes that implement KyselyPlugin. Plugins are then added to the Kysely instance as follows:

- [Plugin system](https://kysely.dev/docs/plugins.md): Plugins are classes that implement KyselyPlugin. Plugins are then added to the Kysely instance as follows:

### recipes


#### conditional-selects

Sometimes you may want to select some fields based on a runtime condition.

- [Conditional selects](https://kysely.dev/docs/recipes/conditional-selects.md): Sometimes you may want to select some fields based on a runtime condition.

#### data-types

When talking about data types in Kysely we need to make a distinction between the two kinds of types:

- [Data types](https://kysely.dev/docs/recipes/data-types.md): When talking about data types in Kysely we need to make a distinction between the two kinds of types:

#### deduplicate-joins

When building dynamic queries, you sometimes end up in situations where the same join

- [Deduplicate joins](https://kysely.dev/docs/recipes/deduplicate-joins.md): When building dynamic queries, you sometimes end up in situations where the same join

#### excessively-deep-types

Kysely uses complex type magic to achieve its type safety. This complexity is sometimes

- [Dealing with the Type instantiation is excessively deep and possibly infinite error](https://kysely.dev/docs/recipes/excessively-deep-types.md): Kysely uses complex type magic to achieve its type safety. This complexity is sometimes

#### expressions

An Expression is the basic type-safe query building block in Kysely. Pretty much all methods accept expressions as inputs. Most internal classes like SelectQueryBuilder and RawBuilder (the return value of the sql tag) are expressions themselves.

- [Expressions](https://kysely.dev/docs/recipes/expressions.md): An Expression is the basic type-safe query building block in Kysely. Pretty much all methods accept expressions as inputs. Most internal classes like SelectQueryBuilder and RawBuilder (the return value of the sql tag) are expressions themselves.

#### extending-kysely

In many cases, Kysely doesn't provide a built-in type-safe method for a feature. It's often because adding

- [Extending kysely](https://kysely.dev/docs/recipes/extending-kysely.md): In many cases, Kysely doesn't provide a built-in type-safe method for a feature. It's often because adding

#### introspecting-relation-metadata

Extracting metadata about tables and views from your database schema in runtime is possible using the methods in the instrospection property of a Kysely instance.

- [Introspecting relation metadata](https://kysely.dev/docs/recipes/introspecting-relation-metadata.md): Extracting metadata about tables and views from your database schema in runtime is possible using the methods in the instrospection property of a Kysely instance.

#### logging

It is possible to set up logs for all queries using the log property when instantiating Kysely.

- [Logging](https://kysely.dev/docs/recipes/logging.md): It is possible to set up logs for all queries using the log property when instantiating Kysely.

#### raw-sql

You can execute raw SQL strings and pass raw SQL snippets to pretty much any method or function

- [Raw SQL](https://kysely.dev/docs/recipes/raw-sql.md): You can execute raw SQL strings and pass raw SQL snippets to pretty much any method or function

#### relations

Kysely IS NOT an ORM. Kysely DOES NOT have the concept of relations.

- [Relations](https://kysely.dev/docs/recipes/relations.md): Kysely IS NOT an ORM. Kysely DOES NOT have the concept of relations.

#### reusable-helpers

Here's a playground link containing all the code in this recipe.

- [Reusable helpers](https://kysely.dev/docs/recipes/reusable-helpers.md): Here's a playground link containing all the code in this recipe.

#### schemas

First of all, when we talk about schemas in this document, we mean custom

- [Working with schemas](https://kysely.dev/docs/recipes/schemas.md): First of all, when we talk about schemas in this document, we mean custom

#### splitting-query-building-and-execution

Kysely is primarily a type-safe sql query builder.

- [Splitting query building and execution](https://kysely.dev/docs/recipes/splitting-query-building-and-execution.md): Kysely is primarily a type-safe sql query builder.

### runtimes


#### browser

Kysely also runs in the browser. Here's a minimal example:

- [Browser](https://kysely.dev/docs/runtimes/browser.md): Kysely also runs in the browser. Here's a minimal example:

#### deno

Kysely doesn't include drivers for Deno, but you can still use Kysely as a query builder or implement your own driver:

- [Running on Deno](https://kysely.dev/docs/runtimes/deno.md): Kysely doesn't include drivers for Deno, but you can still use Kysely as a query builder or implement your own driver:


---

# Full Documentation Content

[Skip to main content](#__docusaurus_skipToContent_fallback)

[![Kysely Logo](/img/logo.svg)![Kysely Logo](/img/logo.svg)](https://kysely.dev/index.md)

[**Kysely**](https://kysely.dev/index.md)[Docs](https://kysely.dev/docs/intro.md)

[GitHub](https://github.com/kysely-org/kysely)[API docs](https://kysely-org.github.io/kysely-apidoc)

Search

# Search the documentation

Type your search here

Powered by[](https://www.algolia.com/)

Docs

* [Introduction](https://kysely.dev/docs/intro.md)
* [Getting started](https://kysely.dev/docs/getting-started.md)
* [Playground](https://kysely.dev/docs/playground.md)
* [Migrations](https://kysely.dev/docs/migrations.md)
* [Recipes](https://kysely.dev/docs/category/recipes)
* [Other runtimes](https://kysely.dev/docs/category/other-runtimes)
* [Dialects](https://kysely.dev/docs/dialects.md)
* [Generating types](https://kysely.dev/docs/generating-types.md)
* [Plugin system](https://kysely.dev/docs/plugins.md)

Examples

* [SELECT](https://kysely.dev/docs/category/select)
* [WHERE](https://kysely.dev/docs/category/where)
* [JOIN](https://kysely.dev/docs/category/join)
* [INSERT](https://kysely.dev/docs/category/insert)
* [UPDATE](https://kysely.dev/docs/category/update)
* [DELETE](https://kysely.dev/docs/category/delete)
* [Transactions](https://kysely.dev/docs/category/transactions)
* [CTE](https://kysely.dev/docs/category/cte)

Community

* [Discord](https://discord.gg/xyBJ3GwvAm)
* [Bluesky](https://bsky.app/profile/kysely.dev)

Other

* [GitHub](https://github.com/kysely-org/kysely)
* [API docs](https://kysely-org.github.io/kysely-apidoc/)

Sponsors

* [![Powered by Vercel](/img/powered-by-vercel.svg)](https://vercel.com/?utm_source=kysely\&utm_campaign=oss)


---

# Dialects

A dialect is the glue between Kysely and the underlying database engine. Check the [API docs](https://kysely-org.github.io/kysely-apidoc/interfaces/Dialect.html) to learn how to build your own.

## Core dialects[​](#core-dialects "Direct link to Core dialects")

| Dialect                      | Link                                                                      |
| ---------------------------- | ------------------------------------------------------------------------- |
| PostgreSQL                   | <https://kysely-org.github.io/kysely-apidoc/classes/PostgresDialect.html> |
| MySQL                        | <https://kysely-org.github.io/kysely-apidoc/classes/MysqlDialect.html>    |
| Microsoft SQL Server (MSSQL) | <https://kysely-org.github.io/kysely-apidoc/classes/MssqlDialect.html>    |
| SQLite                       | <https://kysely-org.github.io/kysely-apidoc/classes/SqliteDialect.html>   |

## Organization dialects[​](#organization-dialects "Direct link to Organization dialects")

| Dialect              | Link                                               |
| -------------------- | -------------------------------------------------- |
| Postgres.js          | <https://github.com/kysely-org/kysely-postgres-js> |
| SingleStore Data API | <https://github.com/kysely-org/kysely-singlestore> |

## Community dialects[​](#community-dialects "Direct link to Community dialects")

| Dialect                       | Link                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------- |
| PlanetScale Serverless Driver | <https://github.com/depot/kysely-planetscale>                                 |
| Cloudflare D1                 | <https://github.com/aidenwallis/kysely-d1>                                    |
| Cloudflare Durable Objects    | <https://github.com/benallfree/kysely-do>                                     |
| AWS RDS Data API              | <https://github.com/serverless-stack/kysely-data-api>                         |
| SurrealDB                     | <https://github.com/igalklebanov/kysely-surrealdb>                            |
| Neon                          | <https://github.com/seveibar/kysely-neon>                                     |
| Xata                          | <https://github.com/xataio/client-ts/tree/main/packages/plugin-client-kysely> |
| AWS S3 Select                 | <https://github.com/igalklebanov/kysely-s3-select>                            |
| libSQL/sqld                   | <https://github.com/libsql/kysely-libsql>                                     |
| Fetch driver                  | <https://github.com/andersgee/kysely-fetch-driver>                            |
| SQLite WASM                   | <https://github.com/DallasHoff/sqlocal>                                       |
| Deno SQLite                   | <https://gitlab.com/soapbox-pub/kysely-deno-sqlite>                           |
| TiDB Cloud Serverless Driver  | <https://github.com/tidbcloud/kysely>                                         |
| Capacitor SQLite Kysely       | <https://github.com/DawidWetzler/capacitor-sqlite-kysely>                     |
| BigQuery                      | <https://github.com/maktouch/kysely-bigquery>                                 |
| Clickhouse                    | <https://github.com/founderpathcom/kysely-clickhouse>                         |
| PGLite                        | <https://github.com/czeidler/kysely-pglite-dialect>                           |
| Oracle                        | <https://github.com/griffiths-waite/kysely-oracledb>                          |
| Firebird                      | <https://github.com/benkoppe/kysely-firebird>                                 |
| MariaDB                       | <https://github.com/awaludinar/kysely-mariadb>                                |


---

# Inserts, updates and deletions

Some databases like postgres also allow you to run other queries than selects in CTEs. On these databases CTEs are extremely powerful:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db
  .with('new_person', (db) => db
    .insertInto('person')
    .values({
      first_name: 'Jennifer',
      age: 35,
    })
    .returning('id')
  )
  .with('new_pet', (db) => db
    .insertInto('pet')
    .values({
      name: 'Doggo',
      species: 'dog',
      is_favorite: true,
      // Use the id of the person we just inserted.
      owner_id: db
        .selectFrom('new_person')
        .select('id')
    })
    .returning('id')
  )
  .selectFrom(['new_person', 'new_pet'])
  .select([
    'new_person.id as person_id',
    'new_pet.id as pet_id'
  ])
  .execute()
```


---

# Simple selects

Common table expressions (CTE) are a great way to modularize complex queries. Essentially they allow you to run multiple separate queries within a single roundtrip to the DB.

Since CTEs are a part of the main query, query optimizers inside DB engines are able to optimize the overall query. For example, postgres is able to inline the CTEs inside the using queries if it decides it's faster.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db
  // Create a CTE called `jennifers` that selects all
  // persons named 'Jennifer'.
  .with('jennifers', (db) => db
    .selectFrom('person')
    .where('first_name', '=', 'Jennifer')
    .select(['id', 'age'])
  )
  // Select all rows from the `jennifers` CTE and
  // further filter it.
  .with('adult_jennifers', (db) => db
    .selectFrom('jennifers')
    .where('age', '>', 18)
    .select(['id', 'age'])
  )
  // Finally select all adult jennifers that are
  // also younger than 60.
  .selectFrom('adult_jennifers')
  .where('age', '<', 60)
  .selectAll()
  .execute()
```


---

# Single row

Delete a single row:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db
  .deleteFrom('person')
  .where('person.id', '=', 1)
  .executeTakeFirst()

console.log(result.numDeletedRows)
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [deleteFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#deleteFrom)
* [returning method](https://kysely-org.github.io/kysely-apidoc/classes/DeleteQueryBuilder.html#returning)


---

# Complex values

In addition to primitives, the values can also be arbitrary expressions. You can build the expressions by using a callback and calling the methods on the expression builder passed to it:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


import { sql } from 'kysely'

const ani = "Ani"
const ston = "ston"

const result = await db
  .insertInto('person')
  .values(({ ref, selectFrom, fn }) => ({
    first_name: 'Jennifer',
    last_name: sql<string>`concat(${ani}, ${ston})`,
    middle_name: ref('first_name'),
    age: selectFrom('person')
      .select(fn.avg<number>('age').as('avg_age')),
  }))
  .executeTakeFirst()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [values method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#values)
* [onConflict method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#onConflict)
* [returning method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#returning)
* [insertInto method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#insertInto)


---

# Insert subquery

You can create an `INSERT INTO SELECT FROM` query using the `expression` method. This API doesn't follow our WYSIWYG principles and might be a bit difficult to remember. The reasons for this design stem from implementation difficulties.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db.insertInto('person')
  .columns(['first_name', 'last_name', 'age'])
  .expression((eb) => eb
    .selectFrom('pet')
    .select((eb) => [
      'pet.name',
      eb.val('Petson').as('last_name'),
      eb.lit(7).as('age'),
    ])
  )
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [values method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#values)
* [onConflict method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#onConflict)
* [returning method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#returning)
* [insertInto method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#insertInto)


---

# Multiple rows

On dialects that support it (for example PostgreSQL) you can insert multiple rows by providing an array. Note that the return value is once again very dialect-specific. Some databases may only return the id of the *last* inserted row and some return nothing at all unless you call `returning`.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


await db
  .insertInto('person')
  .values([{
    first_name: 'Jennifer',
    last_name: 'Aniston',
    age: 40,
  }, {
    first_name: 'Arnold',
    last_name: 'Schwarzenegger',
    age: 70,
  }])
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [values method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#values)
* [onConflict method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#onConflict)
* [returning method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#returning)
* [insertInto method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#insertInto)


---

# Returning data

On supported dialects like PostgreSQL you need to chain `returning` to the query to get the inserted row's columns (or any other expression) as the return value. `returning` works just like `select`. Refer to `select` method's examples and documentation for more info.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db
  .insertInto('person')
  .values({
    first_name: 'Jennifer',
    last_name: 'Aniston',
    age: 40,
  })
  .returning(['id', 'first_name as name'])
  .executeTakeFirstOrThrow()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [values method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#values)
* [onConflict method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#onConflict)
* [returning method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#returning)
* [insertInto method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#insertInto)


---

# Single row

Insert a single row:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db
  .insertInto('person')
  .values({
    first_name: 'Jennifer',
    last_name: 'Aniston',
    age: 40
  })
  .executeTakeFirst()

// `insertId` is only available on dialects that
// automatically return the id of the inserted row
// such as MySQL and SQLite. On PostgreSQL, for example,
// you need to add a `returning` clause to the query to
// get anything out. See the "returning data" example.
console.log(result.insertId)
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [values method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#values)
* [onConflict method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#onConflict)
* [returning method](https://kysely-org.github.io/kysely-apidoc/classes/InsertQueryBuilder.html#returning)
* [insertInto method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#insertInto)


---

# Aliased inner join

You can give an alias for the joined table like this:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


await db.selectFrom('person')
  .innerJoin('pet as p', 'p.owner_id', 'person.id')
  .where('p.name', '=', 'Doggo')
  .selectAll()
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [innerJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#innerJoin)
* [leftJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#leftJoin)
* [rightJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#rightJoin)
* [fullJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#fullJoin)


---

# Complex join

You can provide a function as the second argument to get a join builder for creating more complex joins. The join builder has a bunch of `on*` methods for building the `on` clause of the join. There's basically an equivalent for every `where` method (`on`, `onRef` etc.).

You can do all the same things with the `on` method that you can with the corresponding `where` method (like [OR expressions for example](https://kysely.dev/docs/examples/WHERE/or-where)). See the `where` method documentation for more examples.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


await db.selectFrom('person')
  .innerJoin(
    'pet',
    (join) => join
      .onRef('pet.owner_id', '=', 'person.id')
      .on('pet.name', '=', 'Doggo')
      .on((eb) => eb.or([
        eb('person.age', '>', 18),
        eb('person.age', '<', 100)
      ]))
  )
  .selectAll()
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [innerJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#innerJoin)
* [leftJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#leftJoin)
* [rightJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#rightJoin)
* [fullJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#fullJoin)


---

# Simple inner join

Simple `inner join`s can be done by providing a table name and two columns to join:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db
  .selectFrom('person')
  .innerJoin('pet', 'pet.owner_id', 'person.id')
  // `select` needs to come after the call to `innerJoin` so
  // that you can select from the joined table.
  .select(['person.id', 'pet.name as pet_name'])
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [innerJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#innerJoin)
* [leftJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#leftJoin)
* [rightJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#rightJoin)
* [fullJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#fullJoin)


---

# Subquery join

You can join a subquery by providing two callbacks:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db.selectFrom('person')
  .innerJoin(
    (eb) => eb
      .selectFrom('pet')
      .select(['owner_id as owner', 'name'])
      .where('name', '=', 'Doggo')
      .as('doggos'),
    (join) => join
      .onRef('doggos.owner', '=', 'person.id'),
  )
  .selectAll('doggos')
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [innerJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#innerJoin)
* [leftJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#leftJoin)
* [rightJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#rightJoin)
* [fullJoin method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#fullJoin)


---

# Source row existence

Update a target column based on the existence of a source row:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db
  .mergeInto('person as target')
  .using('pet as source', 'source.owner_id', 'target.id')
  .whenMatchedAnd('target.has_pets', '!=', 'Y')
  .thenUpdateSet({ has_pets: 'Y' })
  .whenNotMatchedBySourceAnd('target.has_pets', '=', 'Y')
  .thenUpdateSet({ has_pets: 'N' })
  .executeTakeFirstOrThrow()

console.log(result.numChangedRows)
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [mergeInto method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#mergeInto)
* [using method](https://kysely-org.github.io/kysely-apidoc/classes/MergeQueryBuilder.html#using)
* [whenMatched method](https://kysely-org.github.io/kysely-apidoc/classes/WheneableMergeQueryBuilder.html#whenMatched)
* [thenUpdateSet method](https://kysely-org.github.io/kysely-apidoc/classes/MatchedThenableMergeQueryBuilder.html#thenUpdateSet)
* [thenDelete method](https://kysely-org.github.io/kysely-apidoc/classes/MatchedThenableMergeQueryBuilder.html#thenDelete)
* [thenDoNothing method](https://kysely-org.github.io/kysely-apidoc/classes/MatchedThenableMergeQueryBuilder.html#thenDoNothing)
* [whenNotMatched method](https://kysely-org.github.io/kysely-apidoc/classes/WheneableMergeQueryBuilder.html#whenNotMatched)
* [thenInsertValues method](https://kysely-org.github.io/kysely-apidoc/classes/NotMatchedThenableMergeQueryBuilder.html#thenInsertValues)


---

# Temporary changes table

Merge new entries from a temporary changes table:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db
  .mergeInto('wine as target')
  .using(
    'wine_stock_change as source',
    'source.wine_name',
    'target.name',
  )
  .whenNotMatchedAnd('source.stock_delta', '>', 0)
  .thenInsertValues(({ ref }) => ({
    name: ref('source.wine_name'),
    stock: ref('source.stock_delta'),
  }))
  .whenMatchedAnd(
    (eb) => eb('target.stock', '+', eb.ref('source.stock_delta')),
    '>',
    0,
  )
  .thenUpdateSet('stock', (eb) =>
    eb('target.stock', '+', eb.ref('source.stock_delta')),
  )
  .whenMatched()
  .thenDelete()
  .executeTakeFirstOrThrow()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [mergeInto method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#mergeInto)
* [using method](https://kysely-org.github.io/kysely-apidoc/classes/MergeQueryBuilder.html#using)
* [whenMatched method](https://kysely-org.github.io/kysely-apidoc/classes/WheneableMergeQueryBuilder.html#whenMatched)
* [thenUpdateSet method](https://kysely-org.github.io/kysely-apidoc/classes/MatchedThenableMergeQueryBuilder.html#thenUpdateSet)
* [thenDelete method](https://kysely-org.github.io/kysely-apidoc/classes/MatchedThenableMergeQueryBuilder.html#thenDelete)
* [thenDoNothing method](https://kysely-org.github.io/kysely-apidoc/classes/MatchedThenableMergeQueryBuilder.html#thenDoNothing)
* [whenNotMatched method](https://kysely-org.github.io/kysely-apidoc/classes/WheneableMergeQueryBuilder.html#whenNotMatched)
* [thenInsertValues method](https://kysely-org.github.io/kysely-apidoc/classes/NotMatchedThenableMergeQueryBuilder.html#thenInsertValues)


---

# A single column

Select a single column:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const persons = await db
  .selectFrom('person')
  .select('id')
  .where('first_name', '=', 'Arnold')
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Aliases

You can give an alias for selections and tables by appending `as the_alias` to the name:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const persons = await db
  .selectFrom('person as p')
  .select([
    'first_name as fn',
    'p.last_name as ln'
  ])
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# All columns

The `selectAll` method generates `SELECT *`:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const persons = await db
  .selectFrom('person')
  .selectAll()
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# All columns of a table

Select all columns of a table:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const persons = await db
  .selectFrom('person')
  .selectAll('person')
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Column with a table

Select a single column and specify a table:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const persons = await db
  .selectFrom(['person', 'pet'])
  .select('person.id')
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Complex selections

You can select arbitrary expression including subqueries and raw sql snippets. When you do that, you need to give a name for the selections using the `as` method:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


import { sql } from 'kysely'

const persons = await db.selectFrom('person')
  .select(({ eb, selectFrom, or, val, lit }) => [
    // Select a correlated subquery
    selectFrom('pet')
      .whereRef('person.id', '=', 'pet.owner_id')
      .select('pet.name')
      .orderBy('pet.name')
      .limit(1)
      .as('first_pet_name'),

    // Build and select an expression using
    // the expression builder
    or([
      eb('first_name', '=', 'Jennifer'),
      eb('first_name', '=', 'Arnold')
    ]).as('is_jennifer_or_arnold'),

    // Select a raw sql expression
    sql<string>`concat(first_name, ' ', last_name)`.as('full_name'),

    // Select a static string value
    val('Some value').as('string_value'),

    // Select a literal value
    lit(42).as('literal_value'),
  ])
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Distinct

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const persons = await db.selectFrom('person')
  .select('first_name')
  .distinct()
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Distinct on

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const persons = await db.selectFrom('person')
  .innerJoin('pet', 'pet.owner_id', 'person.id')
  .where('pet.name', '=', 'Doggo')
  .distinctOn('person.id')
  .selectAll('person')
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Function calls

This example shows how to create function calls. These examples also work in any other place (`where` calls, updates, inserts etc.). The only difference is that you leave out the alias (the `as` call) if you use these in any other place than `select`.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


import { sql } from 'kysely'

const result = await db.selectFrom('person')
  .innerJoin('pet', 'pet.owner_id', 'person.id')
  .select(({ fn, val, ref }) => [
    'person.id',

    // The `fn` module contains the most common
    // functions.
    fn.count<number>('pet.id').as('pet_count'),

    // You can call any function by calling `fn`
    // directly. The arguments are treated as column
    // references by default. If you want  to pass in
    // values, use the `val` function.
    fn<string>('concat', [
      val('Ms. '),
      'first_name',
      val(' '),
      'last_name'
    ]).as('full_name_with_title'),

    // You can call any aggregate function using the
    // `fn.agg` function.
    fn.agg<string[]>('array_agg', ['pet.name']).as('pet_names'),

    // And once again, you can use the `sql`
    // template tag. The template tag substitutions
    // are treated as values by default. If you want
    // to reference columns, you can use the `ref`
    // function.
    sql<string>`concat(
      ${ref('first_name')},
      ' ',
      ${ref('last_name')}
    )`.as('full_name')
  ])
  .groupBy('person.id')
  .having((eb) => eb.fn.count('pet.id'), '>', 10)
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Generic find query

A generic type-safe helper function for finding a row by a column value:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


import { SelectType } from 'kysely'
import { Database } from 'type-editor'

async function getRowByColumn<
  T extends keyof Database,
  C extends keyof Database[T] & string,
  V extends SelectType<Database[T][C]>,
>(t: T, c: C, v: V) {
  // We need to use the dynamic module since the table name
  // is not known at compile time.
  const { table, ref } = db.dynamic

  return await db
    .selectFrom(table(t).as('t'))
    .selectAll()
    .where(ref(c), '=', v)
    .orderBy('t.id')
    .executeTakeFirstOrThrow()
}

const person = await getRowByColumn('person', 'first_name', 'Arnold')
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Multiple columns

Select multiple columns:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const persons = await db
  .selectFrom('person')
  .select(['person.id', 'first_name'])
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Nested array

While kysely is not an ORM and it doesn't have the concept of relations, we do provide helpers for fetching nested objects and arrays in a single query. In this example we use the `jsonArrayFrom` helper to fetch person's pets along with the person's id.

Please keep in mind that the helpers under the `kysely/helpers` folder, including `jsonArrayFrom`, are not guaranteed to work with third party dialects. In order for them to work, the dialect must automatically parse the `json` data type into JavaScript JSON values like objects and arrays. Some dialects might simply return the data as a JSON string. In these cases you can use the built in `ParseJSONResultsPlugin` to parse the results.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


import { jsonArrayFrom } from 'kysely/helpers/postgres'

const result = await db
  .selectFrom('person')
  .select((eb) => [
    'id',
    jsonArrayFrom(
      eb.selectFrom('pet')
        .select(['pet.id as pet_id', 'pet.name'])
        .whereRef('pet.owner_id', '=', 'person.id')
        .orderBy('pet.name')
    ).as('pets')
  ])
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Nested object

While kysely is not an ORM and it doesn't have the concept of relations, we do provide helpers for fetching nested objects and arrays in a single query. In this example we use the `jsonObjectFrom` helper to fetch person's favorite pet along with the person's id.

Please keep in mind that the helpers under the `kysely/helpers` folder, including `jsonObjectFrom`, are not guaranteed to work with third-party dialects. In order for them to work, the dialect must automatically parse the `json` data type into JavaScript JSON values like objects and arrays. Some dialects might simply return the data as a JSON string. In these cases you can use the built in `ParseJSONResultsPlugin` to parse the results.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


import { jsonObjectFrom } from 'kysely/helpers/postgres'

const result = await db
  .selectFrom('person')
  .select((eb) => [
    'id',
    jsonObjectFrom(
      eb.selectFrom('pet')
        .select(['pet.id as pet_id', 'pet.name'])
        .whereRef('pet.owner_id', '=', 'person.id')
        .where('pet.is_favorite', '=', true)
    ).as('favorite_pet')
  ])
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Not null

Sometimes you can be sure something's not null, but Kysely isn't able to infer it. For example calling `where('last_name', 'is not', null)` doesn't make `last_name` not null in the result type, but unless you have other where statements you can be sure it's never null.

Kysely has a couple of helpers for dealing with these cases: `$notNull()` and `$narrowType`. Both are used in the following example:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


import { NotNull } from 'kysely'
import { jsonObjectFrom } from 'kysely/helpers/postgres'

const persons = db
  .selectFrom('person')
  .select((eb) => [
    'last_name',
     // Let's assume we know the person has at least one
     // pet. We can use the `.$notNull()` method to make
     // the expression not null. You could just as well
     // add `pet` to the `$narrowType` call below.
     jsonObjectFrom(
       eb.selectFrom('pet')
         .selectAll()
         .limit(1)
         .whereRef('person.id', '=', 'pet.owner_id')
     ).$notNull().as('pet')
  ])
  .where('last_name', 'is not', null)
  // $narrowType can be used to narrow the output type.
  // The special `NotNull` type can be used to make a
  // selection not null. You could add `pet: NotNull`
  // here and omit the `$notNull()` call on it.
  // Use whichever way you prefer.
  .$narrowType<{ last_name: NotNull }>()
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [select method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#select)
* [selectAll method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#selectAll)
* [selectFrom method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#selectFrom)


---

# Controlled transaction

A controlled transaction allows you to commit and rollback manually, execute savepoint commands, and queries in general.

In this example we start a transaction, use it to insert two rows and then commit the transaction. If an error is thrown, we catch it and rollback the transaction.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const trx = await db.startTransaction().execute()

try {
  const jennifer = await trx.insertInto('person')
    .values({
      first_name: 'Jennifer',
      last_name: 'Aniston',
      age: 40,
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  const catto = await trx.insertInto('pet')
    .values({
      owner_id: jennifer.id,
      name: 'Catto',
      species: 'cat',
      is_favorite: false,
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  await trx.commit().execute()

  // ...
} catch (error) {
  await trx.rollback().execute()
}
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [transaction method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#transaction)


---

# Controlled transaction /w savepoints

A controlled transaction allows you to commit and rollback manually, execute savepoint commands, and queries in general.

In this example we start a transaction, insert a person, create a savepoint, try inserting a toy and a pet, and if an error is thrown, we rollback to the savepoint. Eventually we release the savepoint, insert an audit record and commit the transaction. If an error is thrown, we catch it and rollback the transaction.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const trx = await db.startTransaction().execute()

try {
  const jennifer = await trx
    .insertInto('person')
    .values({
      first_name: 'Jennifer',
      last_name: 'Aniston',
      age: 40,
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()

  try {
    const catto = await trxAfterJennifer
      .insertInto('pet')
      .values({
        owner_id: jennifer.id,
        name: 'Catto',
        species: 'cat',
      })
      .returning('id')
      .executeTakeFirstOrThrow()

    await trxAfterJennifer
      .insertInto('toy')
      .values({ name: 'Bone', price: 1.99, pet_id: catto.id })
      .execute()
  } catch (error) {
    await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
  }

  await trxAfterJennifer.releaseSavepoint('after_jennifer').execute()

  await trx.insertInto('audit').values({ action: 'added Jennifer' }).execute()

  await trx.commit().execute()
} catch (error) {
  await trx.rollback().execute()
}
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [transaction method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#transaction)


---

# Simple transaction

This example inserts two rows in a transaction. If an exception is thrown inside the callback passed to the `execute` method,

1. the exception is caught,
2. the transaction is rolled back, and
3. the exception is thrown again. Otherwise the transaction is committed.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const catto = await db.transaction().execute(async (trx) => {
  const jennifer = await trx.insertInto('person')
    .values({
      first_name: 'Jennifer',
      last_name: 'Aniston',
      age: 40,
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  return await trx.insertInto('pet')
    .values({
      owner_id: jennifer.id,
      name: 'Catto',
      species: 'cat',
      is_favorite: false,
    })
    .returningAll()
    .executeTakeFirst()
})
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [transaction method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#transaction)


---

# Complex values

As always, you can provide a callback to the `set` method to get access to an expression builder:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db
  .updateTable('person')
  .set((eb) => ({
    age: eb('age', '+', 1),
    first_name: eb.selectFrom('pet').select('name').limit(1),
    last_name: 'updated',
  }))
  .where('id', '=', 1)
  .executeTakeFirst()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [set method](https://kysely-org.github.io/kysely-apidoc/classes/UpdateQueryBuilder.html#set)
* [returning method](https://kysely-org.github.io/kysely-apidoc/classes/UpdateQueryBuilder.html#returning)
* [updateTable method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#updateTable)


---

# MySQL joins

MySQL allows you to join tables directly to the "main" table and update rows of all joined tables. This is possible by passing all tables to the `updateTable` method as a list and adding the `ON` conditions as `WHERE` statements. You can then use the `set(column, value)` variant to update columns using table qualified names.

The `UpdateQueryBuilder` also has `innerJoin` etc. join methods, but those can only be used as part of a PostgreSQL `update set from join` query. Due to type complexity issues, we unfortunately can't make the same methods work in both cases.

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db
  .updateTable(['person', 'pet'])
  .set('person.first_name', 'Updated person')
  .set('pet.name', 'Updated doggo')
  .whereRef('person.id', '=', 'pet.owner_id')
  .where('person.id', '=', 1)
  .executeTakeFirst()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [set method](https://kysely-org.github.io/kysely-apidoc/classes/UpdateQueryBuilder.html#set)
* [returning method](https://kysely-org.github.io/kysely-apidoc/classes/UpdateQueryBuilder.html#returning)
* [updateTable method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#updateTable)


---

# Single row

Update a row in `person` table:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const result = await db
  .updateTable('person')
  .set({
    first_name: 'Jennifer',
    last_name: 'Aniston'
  })
  .where('id', '=', 1)
  .executeTakeFirst()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [set method](https://kysely-org.github.io/kysely-apidoc/classes/UpdateQueryBuilder.html#set)
* [returning method](https://kysely-org.github.io/kysely-apidoc/classes/UpdateQueryBuilder.html#returning)
* [updateTable method](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#updateTable)


---

# Complex where clause

For complex `where` expressions you can pass in a single callback and use the `ExpressionBuilder` to build your expression:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const firstName = 'Jennifer'
const maxAge = 60

const persons = await db
  .selectFrom('person')
  .selectAll('person')
  .where(({ eb, or, and, not, exists, selectFrom }) => and([
    or([
      eb('first_name', '=', firstName),
      eb('age', '<', maxAge)
    ]),
    not(exists(
      selectFrom('pet')
        .select('pet.id')
        .whereRef('pet.owner_id', '=', 'person.id')
    ))
  ]))
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [where method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#where)
* [whereRef method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#whereRef)


---

# Conditional where calls

You can add expressions conditionally like this:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


import { Expression, SqlBool } from 'kysely'

const firstName: string | undefined = 'Jennifer'
const lastName: string | undefined = 'Aniston'
const under18 = true
const over60 = true

let query = db
  .selectFrom('person')
  .selectAll()

if (firstName) {
  // The query builder is immutable. Remember to reassign
  // the result back to the query variable.
  query = query.where('first_name', '=', firstName)
}

if (lastName) {
  query = query.where('last_name', '=', lastName)
}

if (under18 || over60) {
  // Conditional OR expressions can be added like this.
  query = query.where((eb) => {
    const ors: Expression<SqlBool>[] = []

    if (under18) {
      ors.push(eb('age', '<', 18))
    }

    if (over60) {
      ors.push(eb('age', '>', 60))
    }

    return eb.or(ors)
  })
}

const persons = await query.execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [where method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#where)
* [whereRef method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#whereRef)


---

# Object filter

You can use the `and` function to create a simple equality filter using an object

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const persons = await db
  .selectFrom('person')
  .selectAll()
  .where((eb) => eb.and({
    first_name: 'Jennifer',
    last_name: eb.ref('first_name')
  }))
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [where method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#where)
* [whereRef method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#whereRef)


---

# OR where

To combine conditions using `OR`, you can use the expression builder. There are two ways to create `OR` expressions. Both are shown in this example:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const persons = await db
  .selectFrom('person')
  .selectAll()
  // 1. Using the `or` method on the expression builder:
  .where((eb) => eb.or([
    eb('first_name', '=', 'Jennifer'),
    eb('first_name', '=', 'Sylvester')
  ]))
  // 2. Chaining expressions using the `or` method on the
  // created expressions:
  .where((eb) =>
    eb('last_name', '=', 'Aniston').or('last_name', '=', 'Stallone')
  )
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [where method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#where)
* [whereRef method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#whereRef)


---

# Simple where clause

`where` method calls are combined with `AND`:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const person = await db
  .selectFrom('person')
  .selectAll()
  .where('first_name', '=', 'Jennifer')
  .where('age', '>', 40)
  .executeTakeFirst()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [where method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#where)
* [whereRef method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#whereRef)


---

# Where in

Find multiple items using a list of identifiers:

<!-- -->

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const persons = await db
  .selectFrom('person')
  .selectAll()
  .where('id', 'in', [1, 2, 3])
  .execute()
```

More examples

The API documentation is packed with examples. The API docs are hosted [here](https://kysely-org.github.io/kysely-apidoc/), but you can access the same documentation by hovering over functions/methods/classes in your IDE. The examples are always just one hover away!

For example, check out these sections:

* [where method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#where)
* [whereRef method](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#whereRef)


---

# Execution flow

The following page gives a **simplified** overview of Kysely's execution flow, from query building to querying the database. It is a nice introduction for anyone looking to understand how Kysely works under the hood. Knowing what your dependencies do and don't do is always a good idea!

This breakdown explains the journey from a type-safe method call in your application to receiving results from the database, as depicted in the diagram.

1. ### Immutable query building[​](#immutable-query-building "Direct link to Immutable query building")

   The process starts in your `App`. You interact with the `QueryBuilder` by calling its methods (`selectFrom`, `where`, etc.). Each call returns a *new* `QueryBuilder` instance containing an updated, immutable `QueryAST` (Abstract Syntax Tree), which is the internal representation of your SQL query.

   <!-- -->

2. ### Initiating execution[​](#initiating-execution "Direct link to Initiating execution")

   When you chain the final `.execute()` call, the `QueryBuilder` begins a multi-step execution process, commanding the `QueryExecutor` to perform distinct tasks.

   <!-- -->

3. ### Query Transformation[​](#query-transformation "Direct link to Query Transformation")

   First, the `QueryBuilder` instructs the `QueryExecutor` to process the `QueryAST`. The `QueryExecutor` iterates through all registered plugins, calling `transformQuery` on each. This allows plugins to modify the query structure before compilation. The final, transformed `QueryAST` is returned to the `QueryBuilder`.

   <!-- -->

4. ### Query Compilation[​](#query-compilation "Direct link to Query Compilation")

   Next, the `QueryBuilder` tells the `QueryExecutor` to compile the transformed AST. The `QueryExecutor` delegates this to the `Dialect`-specific `QueryCompiler`. The compiler traverses the AST and produces a `CompiledQuery` object (containing the final SQL string and parameters). This `CompiledQuery` is then returned to the `QueryBuilder`.

   <!-- -->

5. ### Execution & Connection Handling[​](#execution--connection-handling "Direct link to Execution & Connection Handling")

   The `QueryBuilder` now asks the `QueryExecutor` to execute the `CompiledQuery`.

   * The `QueryExecutor` requests a connection from Kysely's `Driver`.
   * The `Driver`'s job is to abstract away vendor-specific details. It communicates with the actual third-party `DatabaseDriver` — for example, the `pg` or `mysql2` npm package — to get a connection from its pool.
   * A `DatabaseConnection` object, which wraps the native connection, is returned to the `QueryExecutor`.

   <!-- -->

6. ### Database Query[​](#database-query "Direct link to Database Query")

   The `QueryExecutor` passes the `CompiledQuery` to the `DatabaseConnection` object, which executes it. The `DatabaseConnection` uses the underlying `DatabaseDriver` to send the SQL and parameters to the database for execution. The `DatabaseDriver` sends the raw results back. The `DatabaseConnection` standardizes these into a `QueryResult` object and returns it to the `QueryExecutor`. Immediately after, the connection is released back to the pool.

   <!-- -->

7. ### Result Transformation[​](#result-transformation "Direct link to Result Transformation")

   The `QueryResult` is then passed through the plugin system again. The `QueryExecutor` calls the `transformResult` method on each plugin, allowing for final modifications to the results before they are returned to the `App`.

   <!-- -->

8. ### Returning to the App[​](#returning-to-the-app "Direct link to Returning to the App")

   The final, transformed `QueryResult` is passed up from the `QueryExecutor` to the `QueryBuilder`. The `QueryBuilder` then resolves the promise from the initial `.execute()` call, delivering the final, typed results to your `App`.


---

# Generating types

To work with Kysely, you're required to provide a database schema type definition to the Kysely constructor.

In many cases, defining your database schema definitions manually is good enough.

However, when building production applications, it's best to stay aligned with the database schema, by automatically generating the database schema type definitions.

There are several ways to do this using third-party libraries:

* [kysely-codegen](https://github.com/RobinBlomberg/kysely-codegen) - This library generates Kysely database schema type definitions by connecting to and introspecting your database. This library works with all built-in dialects.

* [prisma-kysely](https://github.com/valtyr/prisma-kysely) - This library generates Kysely database schema type definitions from your existing Prisma schemas.

* [kanel-kysely](https://github.com/kristiandupont/kanel/tree/main/packages/kanel-kysely) - This library generates Kysely database schema type definitions by connecting to and introspecting your database. This library extends Kanel which is a mature PostgreSQL-only type generator.

* [kysely-schema-generator](https://github.com/deanc/kysely-schema-generator) - This library generates Kysely database schema type definitions by connecting to and introspecting your database. Current MySQL only.


---

# Getting started

## Prerequisites[​](#prerequisites "Direct link to Prerequisites")

* [TypeScript](https://www.typescriptlang.org/)

  * Minimum supported version [4.6](https://devblogs.microsoft.com/typescript/announcing-typescript-4-6/#indexed-access-inference-improvements).

  * For even more type-safety and accurate inference, use version [5.4](https://devblogs.microsoft.com/typescript/announcing-typescript-5-4/#notable-behavioral-changes) or later.

  * For improved compilation performance, use version [5.9](https://devblogs.microsoft.com/typescript/announcing-typescript-5-9/#cache-instantiations-on-mappers) or later.

  * You must enable `strict` mode in your `tsconfig.json` file's `compilerOptions`:

    tsconfig.json

    ```
    {
      // ...
      "compilerOptions": {
        // ...
        "strict": true
        // ...
      }
      // ...
    }
    ```

## Installation[​](#installation "Direct link to Installation")

Kysely can be installed using any of the following package managers:

* npm
* pnpm
* Yarn
* Deno
* Bun

[npm](https://npmjs.com) <!-- -->is the default package manager for [Node.js](https://nodejs.org), and to where Kysely is published.<br />Your project is using <!-- -->npm<!-- --> if it has a<!-- --> `package-lock.json` file in its root folder.

**Run the following command in your terminal:**

terminal

```
npm install kysely
```

[pnpm](https://pnpm.io) is a fast, disk space efficient package manager for [Node.js](https://nodejs.org).<br />Your project is using <!-- -->pnpm<!-- --> if it has a<!-- --> `pnpm-lock.yaml` file in its root folder.

**Run the following command in your terminal:**

terminal

```
pnpm install kysely
```

[Yarn](https://yarnpkg.com) <!-- -->is a fast, reliable and secure dependency manager for [Node.js](https://nodejs.org).<br />Your project is using <!-- -->Yarn<!-- --> if it has a<!-- --> `yarn.lock` file in its root folder.

**Run the following command in your terminal:**

terminal

```
yarn add kysely
```

[Deno](https://deno.com/runtime) <!-- -->is a secure runtime for [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) and<!-- --> [TypeScript](https://www.typescriptlang.org).

****Your root&#x20;**`deno.json`**'s "imports" field should include the following dependencies:****

deno.json

```
{
  "imports": {
    "kysely": "npm:kysely@^0.28.10"
  }
}
```

[Bun](https://bun.sh) is a new [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) runtime built for speed, with a native bundler, transpiler, test runner, and <!-- -->npm<!-- -->-compatible package manager baked-in.

**Run the following command in your terminal:**

terminal

```
bun install kysely
```

## Types[​](#types "Direct link to Types")

For Kysely's type-safety and autocompletion to work, it needs to know your database structure. This requires a TypeScript `Database` interface, that contains table names as keys and table schema interfaces as values.

**Let's define our first database interface:**

src/types.ts

```
import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from 'kysely'

export interface Database {
  person: PersonTable
  pet: PetTable
}

// This interface describes the `person` table to Kysely. Table
// interfaces should only be used in the `Database` type above
// and never as a result type of a query!. See the `Person`,
// `NewPerson` and `PersonUpdate` types below.
export interface PersonTable {
  // Columns that are generated by the database should be marked
  // using the `Generated` type. This way they are automatically
  // made optional in inserts and updates.
  id: Generated<number>

  first_name: string
  gender: 'man' | 'woman' | 'other'

  // If the column is nullable in the database, make its type nullable.
  // Don't use optional properties. Optionality is always determined
  // automatically by Kysely.
  last_name: string | null

  // You can specify a different type for each operation (select, insert and
  // update) using the `ColumnType<SelectType, InsertType, UpdateType>`
  // wrapper. Here we define a column `created_at` that is selected as
  // a `Date`, can optionally be provided as a `string` in inserts and
  // can never be updated:
  created_at: ColumnType<Date, string | undefined, never>

  // You can specify JSON columns using the `JSONColumnType` wrapper.
  // It is a shorthand for `ColumnType<T, string, string>`, where T
  // is the type of the JSON object/array retrieved from the database,
  // and the insert and update types are always `string` since you're
  // always stringifying insert/update values.
  metadata: JSONColumnType<{
    login_at: string
    ip: string | null
    agent: string | null
    plan: 'free' | 'premium'
  }>
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
//
// Most of the time you should trust the type inference and not use explicit
// types at all. These types can be useful when typing function arguments.
export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>

export interface PetTable {
  id: Generated<number>
  name: string
  owner_id: number
  species: 'dog' | 'cat'
}

export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
```

Codegen

For production apps, it is recommended to automatically generate your `Database` interface by introspecting your production database or Prisma schemas. Generated types might differ in naming convention, internal order, etc. Find out more at ["Generating types"](https://kysely.dev/docs/generating-types).

Runtime types

Kysely only deals with types in the TypeScript level. The runtime JavaScript types are decided by the underlying third-party driver such as `pg` or `mysql2` and it's up to you to select the correct TypeScript types in the database interface. Kysely never touches the runtime output types in any way. Find out more at ["Data types"](https://kysely.dev/docs/recipes/data-types).

## Dialects[​](#dialects "Direct link to Dialects")

For Kysely's query compilation and execution to work, it needs to understand your database's SQL specification and how to communicate with it. This requires a `Dialect` implementation.<br /><br />There are 4 built-in dialects for PostgreSQL, MySQL, Microsoft SQL Server (MSSQL), and SQLite. Additionally, the community has implemented several dialects to choose from. Find out more at<!-- --> ["Dialects"](https://kysely.dev/docs/dialects.md).

### Driver installation

A `Dialect` implementation usually requires a database driver library as a peer dependency. Let's install it using the same package manager command from before:

* PostgreSQL
* MySQL
* Microsoft SQL Server (MSSQL)
* SQLite

Kysely's built-in <!-- -->PostgreSQL<!-- --> dialect uses the "<!-- -->pg<!-- -->" driver library under the hood. Please refer to its<!-- --> [official documentation](https://node-postgres.com/) for configuration options.

**Run the following command in your terminal:**

terminal

```
npm install pg 
```

Kysely's built-in <!-- -->MySQL<!-- --> dialect uses the "<!-- -->mysql2<!-- -->" driver library under the hood. Please refer to its<!-- --> [official documentation](https://github.com/sidorares/node-mysql2/tree/master/documentation) for configuration options.

**Run the following command in your terminal:**

terminal

```
npm install mysql2 
```

Kysely's built-in <!-- -->Microsoft SQL Server (MSSQL)<!-- --> dialect uses the "<!-- -->tedious<!-- -->" driver library under the hood. Please refer to its<!-- --> [official documentation](https://tediousjs.github.io/tedious/index.html) for configuration options.

Additionally, Kysely's <!-- -->Microsoft SQL Server (MSSQL)<!-- --> dialect uses the "<!-- -->tarn<!-- -->" resource pool package for connection pooling. Please refer to its<!-- --> [official documentation](https://github.com/vincit/tarn.js) for configuration options.

**Run the following command in your terminal:**

terminal

```
npm install tedious tarn
```

Kysely's built-in <!-- -->SQLite<!-- --> dialect uses the "<!-- -->better-sqlite3<!-- -->" driver library under the hood. Please refer to its<!-- --> [official documentation](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md) for configuration options.

**Run the following command in your terminal:**

terminal

```
npm install better-sqlite3 
```

[I use a different package manager (not <!-- -->npm<!-- -->)](#installation)

Driverless

Kysely can also work in compile-only mode that doesn't require a database driver. Find out more at

<!-- -->

["Splitting query building and execution"](https://kysely.dev/docs/recipes/splitting-query-building-and-execution.md).

## Instantiation[​](#instantiation "Direct link to Instantiation")

**Let's create a Kysely instance****&#x20;using the built-in&#x20;**`PostgresDialect`**&#x20;dialect****:**

src/database.ts

```
import { Database } from './types.ts' // this is the Database interface we defined earlier
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'test',
    host: 'localhost',
    user: 'admin',
    port: 5434,
    max: 10,
  })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
})
```

[I use a different package manager (not <!-- -->npm<!-- -->)](#installation)

[I use a different dialect (not <!-- -->PostgreSQL<!-- -->)](#dialects)

Singleton

In most cases, you should only create a single Kysely instance per database. Most dialects use a connection pool internally, or no connections at all, so there's no need to create a new instance for each request.

keeping secrets

Use a secrets manager, environment variables (DO NOT commit \`.env\` files to your repository), or a similar solution, to avoid hardcoding database credentials in your code.

kill it with fire

When needed, you can dispose of the Kysely instance, release resources and close all connections by invoking the `db.destroy()`

<!-- -->

function.

## Querying[​](#querying "Direct link to Querying")

**Let's implement the person repository:**

src/PersonRepository.ts

```
import { db } from './database'
import { PersonUpdate, Person, NewPerson } from './types'

export async function findPersonById(id: number) {
  return await db.selectFrom('person')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()
}

export async function findPeople(criteria: Partial<Person>) {
  let query = db.selectFrom('person')

  if (criteria.id) {
    query = query.where('id', '=', criteria.id) // Kysely is immutable, you must re-assign!
  }

  if (criteria.first_name) {
    query = query.where('first_name', '=', criteria.first_name)
  }

  if (criteria.last_name !== undefined) {
    query = query.where(
      'last_name',
      criteria.last_name === null ? 'is' : '=',
      criteria.last_name
    )
  }

  if (criteria.gender) {
    query = query.where('gender', '=', criteria.gender)
  }

  if (criteria.created_at) {
    query = query.where('created_at', '=', criteria.created_at)
  }

  return await query.selectAll().execute()
}

export async function updatePerson(id: number, updateWith: PersonUpdate) {
  await db.updateTable('person').set(updateWith).where('id', '=', id).execute()
}

export async function createPerson(person: NewPerson) {
  return await db.insertInto('person')
    .values(person)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function deletePerson(id: number) {
  return await db.deleteFrom('person').where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}
```

[I use a different dialect (not <!-- -->PostgreSQL<!-- -->)](#dialects)

But wait, there's more!

This is a simplified example with basic CRUD operations. Kysely supports many more SQL features including: joins, subqueries, complex boolean logic, set operations, CTEs, functions (aggregate and window functions included), raw SQL, transactions, DDL queries, etc.

<br />

Find out more at [Examples](https://kysely.dev/docs/category/examples).

## Summary[​](#summary "Direct link to Summary")

We've seen how to install and instantiate Kysely, its dialects and underlying drivers. We've also seen how to use Kysely to query a database.<br /><br />**Let's put it all to the test:**

src/PersonRepository.spec.ts

```
import { sql } from 'kysely'
import { db } from './database'
import * as PersonRepository from './PersonRepository'

describe('PersonRepository', () => {
  before(async () => {
    await db.schema.createTable('person')
      .addColumn('id', 'serial', (cb) => cb.primaryKey())
      .addColumn('first_name', 'varchar', (cb) => cb.notNull())
      .addColumn('last_name', 'varchar')
      .addColumn('gender', 'varchar(50)', (cb) => cb.notNull())
      .addColumn('created_at', 'timestamp', (cb) =>
        cb.notNull().defaultTo(sql`now()`)
      )
      .execute()
  })
    
  afterEach(async () => {
    await sql`truncate table ${sql.table('person')}`.execute(db)
  })
    
  after(async () => {
    await db.schema.dropTable('person').execute()
  })
    
  it('should find a person with a given id', async () => {
    await PersonRepository.findPersonById(123)
  })
    
  it('should find all people named Arnold', async () => {
    await PersonRepository.findPeople({ first_name: 'Arnold' })
  })
    
  it('should update gender of a person with a given id', async () => {
    await PersonRepository.updatePerson(123, { gender: 'woman' })
  })
    
  it('should create a person', async () => {
    await PersonRepository.createPerson({
      first_name: 'Jennifer',
      last_name: 'Aniston',
      gender: 'woman',
    })
  })
    
  it('should delete a person with a given id', async () => {
    await PersonRepository.deletePerson(123)
  })
})
```

[I use a different dialect (not <!-- -->PostgreSQL<!-- -->)](#dialects)

Migrations

As you can see, Kysely supports DDL queries. It also supports classic "up/down" migrations. Find out more at

<!-- -->

[Migrations](https://kysely.dev/docs/migrations.md).


---

# LLMs

Kysely provides LLM-friendly documentation to help AI tools like **Cursor**, **Windsurf**, **GitHub Copilot**, **ChatGPT**, **Claude**, and **Claude Code** understand and work with it.

`llms.txt` documentation is automatically generated and kept up-to-date with each push on GitHub and is based on the [llms.txt standard](https://llmstxt.org/).

## Documentation Structure[​](#documentation-structure "Direct link to Documentation Structure")

The [llms.txt](https://kysely.dev/llms.txt) file acts as a summary and index to all the docs pages.

The [llms-full.txt](https://kysely.dev/llms-full.txt) file includes all of the Kysely docs in a single file.

## Usage with AI Tools[​](#usage-with-ai-tools "Direct link to Usage with AI Tools")

### Cursor[​](#cursor "Direct link to Cursor")

In Cursor, you can reference the documentation using the `@Docs` feature:

1. Type `@Docs` in your prompt
2. Reference the Kysely documentation URL: `https://kysely.dev/llms-full.txt`
3. Ask questions about Kysely queries, types, or database operations

### Windsurf[​](#windsurf "Direct link to Windsurf")

For Windsurf users:

1. Reference the documentation using `@https://kysely.dev/llms-full.txt`
2. Or add it to your `.windsurfrules` file for persistent access

### ChatGPT & Claude[​](#chatgpt--claude "Direct link to ChatGPT & Claude")

When using ChatGPT or Claude:

1. Mention that you're using Kysely
2. Reference the documentation URL: `https://kysely.dev/llms-full.txt`
3. The AI will fetch and use the documentation to provide accurate answers

### GitHub Copilot[​](#github-copilot "Direct link to GitHub Copilot")

While Copilot doesn't directly support external documentation, you can:

1. Include relevant documentation snippets in your comments
2. Reference query builder methods and types accurately for better suggestions

### Claude Code[​](#claude-code "Direct link to Claude Code")

For Claude Code users:

1. Reference the documentation by mentioning the URL: `https://kysely.dev/llms-full.txt`
2. Ask Claude Code to analyze the documentation for specific Kysely patterns
3. Use commands like: `claude -p "Using the Kysely docs at https://kysely.dev/llms-full.txt, help me build a type-safe query"`

## Example Prompts[​](#example-prompts "Direct link to Example Prompts")

Here are some example prompts you can use with AI tools:

* "Using Kysely, how do I build a type-safe SELECT query with JOINs?"
* "Show me how to define a database schema interface for Kysely"
* "How can I use transactions with Kysely?"
* "Create a complex query with subqueries and aggregations"
* "How to handle database migrations with Kysely?"


---

# Supabase

Supabase is an open-source Firebase alternative that provides a suite of tools for building applications. At the core, it is a managed PostgreSQL database vendor. They provide a CLI library called `supabase` that's at the heart of their ecosystem. It manages your database, migrates it and can generate TypeScript types from it. They also provide a JavaScript client library called `@supabase/supabase-js` that wraps a PostgREST API, and is pretty limited - doesn't even allow raw SQL. This is where Kysely comes in.

We provide a bridge library called `kysely-supabase` that allows you to translate `supabase`'s generated TypeScript types into types compatible with Kysely.

## Prerequisites[​](#prerequisites "Direct link to Prerequisites")

1. `supabase` CLI installed and a Supabase project set up.

2. `kysely` installed.

3. A PostgreSQL driver installed - e.g. `pg` or `postgres`. The latter requires `kysely-postgres-js` to be installed as well.

## Installation[​](#installation "Direct link to Installation")

```
npm i -D kysely-supabase
```

## Usage[​](#usage "Direct link to Usage")

### Generate TypeScript types using `supabase` CLI[​](#generate-typescript-types-using-supabase-cli "Direct link to generate-typescript-types-using-supabase-cli")

```
npx supabase gen types typescript --local > path/to/supabase/generated/types/file
```

### Translate Supabase types to Kysely types[​](#translate-supabase-types-to-kysely-types "Direct link to Translate Supabase types to Kysely types")

src/types.ts

```
import type { Database as SupabaseDatabase } from 'path/to/supabase/generated/types/file'
import type { KyselifyDatabase } from 'kysely-supabase'

export type Database = KyselifyDatabase<SupabaseDatabase>
```

### Pass translated types to Kysely constructor[​](#pass-translated-types-to-kysely-constructor "Direct link to Pass translated types to Kysely constructor")

src/db.ts

```
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import type { Database } from './types'

export const db = new Kysely<Database>({
  //                         ^^^^^^^^
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})
```


---

# Introduction

Kysely (pronounced “Key-Seh-Lee”) is a type-safe and autocompletion-friendly TypeScript SQL query builder. Inspired by Knex. Mainly developed for [node.js](https://nodejs.org/en/) but also runs on all other JavaScript environments like [deno](https://deno.land/) and [bun](https://bun.sh/).

[![](/demo-poster.webp)](/demo_optimized.webm)

Kysely makes sure you only refer to tables and columns that are visible to the part of the query you're writing. The result type only has the selected columns with correct types and aliases. As an added bonus you get autocompletion for all that stuff.

As shown in the gif above, through the pure magic of modern TypeScript, Kysely is even able to parse the alias given to `pet.name` and add the `pet_name` column to the result row type. Kysely is able to infer column names, aliases and types from selected subqueries, joined subqueries, `with` statements and pretty much anything you can think of.

Of course there are cases where things cannot be typed at compile time, and Kysely offers escape hatches for these situations. See the [sql template tag](https://kysely-org.github.io/kysely-apidoc/interfaces/Sql.html) and the [DynamicModule](https://kysely-org.github.io/kysely-apidoc/classes/DynamicModule.html#ref) for more info.

All API documentation is written in the typing files and you can simply hover over the module, class or method you're using to see it in your IDE. The same documentation is also hosted [here](https://kysely-org.github.io/kysely-apidoc/).

If you start using Kysely and can't find something you'd want to use, please open an issue or join our [Discord server](https://discord.gg/xyBJ3GwvAm).

## Looking for help?[​](#looking-for-help "Direct link to Looking for help?")

If you start using Kysely and can't find something you'd want to use, please [open an issue](https://github.com/kysely-org/kysely/issues) or [join our Discord server](https://discord.gg/xyBJ3GwvAm).


---

# Migrations

## Migration files[​](#migration-files "Direct link to Migration files")

Migration files should look like this:

```
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}
```

The `up` function is called when you update your database schema to the next version and `down` when you go back to previous version. The only argument for the functions is an instance of `Kysely<any>`. It's important to use `Kysely<any>` and not `Kysely<YourDatabase>`.

Migrations should never depend on the current code of your app because they need to work even when the app changes. Migrations need to be "frozen in time".

Migrations can use the `Kysely.schema` module to modify the schema. Migrations can also run normal queries to read/modify data.

## Execution order[​](#execution-order "Direct link to Execution order")

Migrations will be run in the alpha-numeric order of your migration names. An excellent way to name your migrations is to prefix them with an ISO 8601 date string.

By default, Kysely will also ensure this order matches the execution order of any previously executed migrations in your database. If the orders do not match (for example, a new migration was added alphabetically before a previously executed one), an error will be returned. This adds safety by always executing your migrations in the correct, alphanumeric order.

There is also an `allowUnorderedMigrations` option. This option will allow new migrations to be run even if they are added alphabetically before ones that have already executed. Allowing unordered migrations works well in large teams where multiple team members may add migrations at the same time in parallel commits without knowing about the other migrations. Pending (unexecuted) migrations will be run in alpha-numeric order when migrating up. When migrating down, migrations will be undone in the opposite order in which they were executed (reverse sorted by execution timestamp).

To allow unordered migrations, pass the `allowUnorderedMigrations` option to Migrator:

```
const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider(...),
  allowUnorderedMigrations: true
})
```

## Single file vs multiple file migrations[​](#single-file-vs-multiple-file-migrations "Direct link to Single file vs multiple file migrations")

You don't need to store your migrations as separate files if you don't want to. You can easily implement your own MigrationProvider and give it to the Migrator class when you instantiate one.

## PostgreSQL migration example[​](#postgresql-migration-example "Direct link to PostgreSQL migration example")

```
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('person')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('first_name', 'varchar', (col) => col.notNull())
    .addColumn('last_name', 'varchar')
    .addColumn('gender', 'varchar(50)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()

  await db.schema
    .createTable('pet')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull().unique())
    .addColumn('owner_id', 'integer', (col) =>
      col.references('person.id').onDelete('cascade').notNull(),
    )
    .addColumn('species', 'varchar', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('pet_owner_id_index')
    .on('pet')
    .column('owner_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('pet').execute()
  await db.schema.dropTable('person').execute()
}
```

## SQLite migration example[​](#sqlite-migration-example "Direct link to SQLite migration example")

```
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('person')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('first_name', 'text', (col) => col.notNull())
    .addColumn('last_name', 'text')
    .addColumn('gender', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute()

  await db.schema
    .createTable('pet')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('owner_id', 'integer', (col) =>
      col.references('person.id').onDelete('cascade').notNull(),
    )
    .addColumn('species', 'text', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('pet_owner_id_index')
    .on('pet')
    .column('owner_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('pet').execute()
  await db.schema.dropTable('person').execute()
}
```

## CLI (optional)[​](#cli-optional "Direct link to CLI (optional)")

Kysely offers a CLI you can use for migrations (and more). It can help you create and run migrations. It is not part of the core, and your mileage may vary.

For more information, visit <https://github.com/kysely-org/kysely-ctl>.

## Running migrations[​](#running-migrations "Direct link to Running migrations")

You can then use:

```
const migrator = new Migrator(migratorConfig)
await migrator.migrateToLatest()
```

to run all migrations that have not yet been run. See the Migrator class's documentation for more info.

You will probably want to add a simple migration script to your projects like this:

```
import * as path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely'
import { Database } from './types'

async function migrateToLatest() {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: 'localhost',
        database: 'kysely_test',
      }),
    }),
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, 'some/path/to/migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()
```

The migration methods use a lock on the database level and parallel calls are executed serially. This means that you can safely call migrateToLatest and other migration methods from multiple server instances simultaneously and the migrations are guaranteed to only be executed once. The locks are also automatically released if the migration process crashes or the connection to the database fails.

## Reference documentation[​](#reference-documentation "Direct link to Reference documentation")

[Migrator](https://kysely-org.github.io/kysely-apidoc/classes/Migrator.html)


---

# Playground

[@wirekang](https://github.com/wirekang) has created a [playground for Kysely](https://kyse.link). You can use it to quickly test stuff out and for creating code examples for your issues, PRs and Discord messages.

<!-- -->

```
import type {
  ColumnType,
  Generated,
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'

export interface Database {
  audit: AuditTable
  person: PersonTable
  person_backup: PersonTable
  pet: PetTable
  toy: ToyTable
  wine: WineTable
  wine_stock_change: WineStockChangeTable
}

interface AuditTable {
  id: Generated<number>
  action: string
}

interface PersonTable {
  id: Generated<number>
  address: { city: string } | null
  age: number | null
  birthdate: ColumnType<Date | null, string | null | undefined, string | null>
  created_at: GeneratedAlways<Date>
  deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
  experience: { role: string }[] | null
  first_name: string
  gender: 'male' | 'female' | 'other' | null
  has_pets: Generated<'Y' | 'N'>
  last_name: string | null
  middle_name: string | null
  nicknames: string[] | null
  nullable_column: string | null
  profile: {
    addresses: { city: string }[]
    website: { url: string }
  } | null
  updated_at: ColumnType<Date | null, string | null | undefined, string | null>
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

interface PetTable {
  id: Generated<number>
  created_at: GeneratedAlways<Date>
  is_favorite: Generated<SqlBool>
  name: string
  owner_id: number
  species: Species
}

interface ToyTable {
  id: Generated<number>
  name: string
  pet_id: number
  price: number
}

interface WineTable {
  id: Generated<number>
  name: string
  stock: number
}

interface WineStockChangeTable {
  id: Generated<number>
  stock_delta: number
  wine_name: string
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>
export type Species = 'dog' | 'cat' | 'hamster'

declare global {
  // @ts-ignore
  export class Buffer {
    static isBuffer(obj: unknown): obj is { length: number }
    static compare(a: Buffer, b: Buffer): number
  }
  export const db: Kysely<Database>
  export function functionThatExpectsPersonWithNonNullValue(
    person: Person & { nullable_column: string },
  ): void
}


const person = await db
.selectFrom('person')
.select(['id', 'first_name'])
.where('id', '=', 1)
.executeTakeFirst()
```

## Codesandbox[​](#codesandbox "Direct link to Codesandbox")

We also have a minimal [code sandbox example](https://codesandbox.io/s/kysely-demo-9l099t?file=/src/index.tsx:0-36).


---

# Plugin system

Plugins are classes that implement [KyselyPlugin](https://kysely-org.github.io/kysely-apidoc/interfaces/KyselyPlugin.html). Plugins are then added to the `Kysely` instance as follows:

```
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    database: 'kysely_test',
    host: 'localhost',
  }),
  plugins: [new CamelCasePlugin()],
})
```

## Built-in plugins[​](#built-in-plugins "Direct link to Built-in plugins")

### Camel case plugin[​](#camel-case-plugin "Direct link to Camel case plugin")

A plugin that converts snake\_case identifiers in the database into camelCase in the JavaScript side. [Learn more](https://kysely-org.github.io/kysely-apidoc/classes/CamelCasePlugin.html).

### Deduplicate joins plugin[​](#deduplicate-joins-plugin "Direct link to Deduplicate joins plugin")

A plugin that removes duplicate joins from queries. You can read more about it in the [examples](https://kysely.dev/docs/recipes/deduplicate-joins.md) section or check the [API docs](https://kysely-org.github.io/kysely-apidoc/classes/DeduplicateJoinsPlugin.html).

### Handle `in ()` and `not in ()` plugin[​](#handle-in--and-not-in--plugin "Direct link to handle-in--and-not-in--plugin")

A plugin that allows handling `in ()` and `not in ()` with a chosen strategy. [Learn more](https://kysely-org.github.io/kysely-apidoc/classes/HandleEmptyInListsPlugin.html).


---

# Conditional selects

Sometimes you may want to select some fields based on a runtime condition. Something like this:

```
async function getPerson(id: number, withLastName: boolean) {}
```

If `withLastName` is true the person object is returned with a `last_name` property, otherwise without it.

Your first thought can be to simply do this:

```
async function getPerson(id: number, withLastName: boolean) {
  let query = db.selectFrom('person').select('first_name').where('id', '=', id)

  if (withLastName) {
    // ❌ The type of `query` doesn't change here
    query = query.select('last_name')
  }

  // ❌ Wrong return type { first_name: string }
  return await query.executeTakeFirstOrThrow()
}
```

While that *would* compile, the result type would be `{ first_name: string }` without the `last_name` column, which is wrong. What happens is that the type of `query` when created is something, let's say `A`. The type of the query with `last_name` selection is `B` which extends `A` but also contains information about the new selection. When you assign an object of type `B` to `query` inside the `if` statement, the type gets downcast to `A`.

info

You *can* write code like this to add conditional `where`, `groupBy`, `orderBy` etc. statements that don't change the type of the query builder, but it doesn't work with `select`, `returning`, `innerJoin` etc. that *do* change the type of the query builder.

In this simple case you could implement the method like this:

```
async function getPerson(id: number, withLastName: boolean) {
  const query = db
    .selectFrom('person')
    .select('first_name')
    .where('id', '=', id)

  if (withLastName) {
    // ✅ The return type is { first_name: string, last_name: string }
    return await query.select('last_name').executeTakeFirstOrThrow()
  }

  // ✅ The return type is { first_name: string }
  return await query.executeTakeFirstOrThrow()
}
```

This works fine when you have one single condition. As soon as you have two or more conditions the amount of code explodes if you want to keep things type-safe. You need to create a separate branch for every possible combination of selections or otherwise the types won't be correct.

This is where the [$if](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#_if) method can help you:

```
async function getPerson(id: number, withLastName: boolean) {
  // ✅ The return type is { first_name: string, last_name?: string }
  return await db
    .selectFrom('person')
    .select('first_name')
    .$if(withLastName, (qb) => qb.select('last_name'))
    .where('id', '=', id)
    .executeTakeFirstOrThrow()
}
```

Any selections added inside the `if` callback will be added as optional fields to the output type since we can't know if the selections were actually made before running the code.


---

# Data types

When talking about data types in Kysely we need to make a distinction between the two kinds of types:

1. Typescript types
2. Runtime JavaScript types

## Typescript types[​](#typescript-types "Direct link to Typescript types")

In Kysely, you only define TypeScript types for your tables and columns. Since TypeScript is entirely a compile-time concept, TypeScript types **can't** affect runtime JavaScript types. If you define your column to be a `string` in TypeScript but the database returns a `number`, the runtime type doesn't magically change to `string`. You'll see a `string` in the TypeScript code, but observe a number when you run the program.

info

It's up to **you** to select correct TypeScript types for your columns based on what the driver returns.

## Runtime JavaScript types[​](#runtime-javascript-types "Direct link to Runtime JavaScript types")

The database driver, such as `pg` or `mysql2`, decides the runtime JavaScript types the queries return. Kysely never touches the runtime types the driver returns. In fact, Kysely doesn't touch the data returned by the driver in any way. It simply executes the query and returns whatever the driver returns. An exception to this rule is when you use a plugin like `CamelCasePlugin`, in which case Kysely does change the column names.

You need to read the underlying driver's documentation or otherwise figure out what the driver returns and then align the TypeScript types to match them.

### Configuring runtime JavaScript types[​](#configuring-runtime-javascript-types "Direct link to Configuring runtime JavaScript types")

Most drivers provide a way to change the returned types. For example `pg` returns `bigint` and `numeric` types as strings by default, but often you want to configure it to return numbers instead.

#### Postgres[​](#postgres "Direct link to Postgres")

When using the `pg` driver, you can use the [pg-types](https://github.com/brianc/node-pg-types) package to configure the types. For example here's how you'd configure the `bigint` to be returned as a number:

```
import { Kysely, PostgresDialect } from 'kysely'
import * as pg from 'pg'

const int8TypeId = 20
// Map int8 to number.
pg.types.setTypeParser(int8TypeId, (val) => {
  return parseInt(val, 10)
})

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pg.Pool(config),
  }),
})
```

See the documentation [here](https://github.com/brianc/node-pg-types) on how to figure out the correct type id.

#### MySQL[​](#mysql "Direct link to MySQL")

When using the `mysql2` driver, you an use the [typeCast](https://github.com/mysqljs/mysql?tab=readme-ov-file#custom-type-casting) pool property.

For example here's how you'd map `tinyint(1)` to a boolean:

```
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

export const db = new Kysely<Database>({
  dialect: new MysqlDialect({
    pool: createPool({
      ...config,
      // Map tinyint(1) to boolean
      typeCast(field, next) {
        if (field.type === 'TINY' && field.length === 1) {
          return field.string() === '1'
        } else {
          return next()
        }
      },
    }),
  }),
})
```

## Type generators[​](#type-generators "Direct link to Type generators")

There are third-party type generators such as [kysely-codegen](https://github.com/RobinBlomberg/kysely-codegen) and [kanel-kysely](https://kristiandupont.github.io/kanel/kanel-kysely.html) that automatically generate TypeScript types based on the database schema. Find out more at ["Generating types"](https://kysely.dev/docs/generating-types).

If these tools generate a type that doesn't match the runtime type you observe, please refer to their documentation or open an issue in their github. Kysely has no control over these libraries.


---

# Deduplicate joins

When building dynamic queries, you sometimes end up in situations where the same join could be added twice. Consider this query:

```
async function getPerson(
  id: number,
  withPetName: boolean,
  withPetSpecies: boolean
) {
  return await db
    .selectFrom('person')
    .selectAll('person')
    .$if(withPetName, (qb) =>
      qb
        .innerJoin('pet', 'pet.owner_id', 'person.id')
        .select('pet.name as pet_name')
    )
    .$if(withPetSpecies, (qb) =>
      qb
        .innerJoin('pet', 'pet.owner_id', 'person.id')
        .select('pet.species as pet_species')
    )
    .where('person.id', '=', id)
    .executeTakeFirst()
}
```

We have two optional selections `pet_name` and `pet_species`. Both of them require the `pet` table to be joined, but we don't want to add an unnecessary join if both `withPetName` and `withPetSpecies` are `false`.

But if both `withPetName` and `withPetSpecies` are `true`, we end up with two identical joins which will cause an error in the database.

To prevent the error from happening, you can install the [DeduplicateJoinsPlugin](https://kysely-org.github.io/kysely-apidoc/classes/DeduplicateJoinsPlugin.html). You can either install it globally by providing it in the configuration:

```
const db = new Kysely<Database>({
  dialect,
  plugins: [new DeduplicateJoinsPlugin()],
})
```

or you can use it when needed:

```
async function getPerson(
  id: number,
  withPetName: boolean,
  withPetSpecies: boolean
) {
  return await db
    .withPlugin(new DeduplicateJoinsPlugin())
    .selectFrom('person')
    .selectAll('person')
    .$if(withPetName, (qb) =>
      qb
        .innerJoin('pet', 'pet.owner_id', 'person.id')
        .select('pet.name as pet_name')
    )
    .$if(withPetSpecies, (qb) =>
      qb
        .innerJoin('pet', 'pet.owner_id', 'person.id')
        .select('pet.species as pet_species')
    )
    .where('person.id', '=', id)
    .executeTakeFirst()
}
```

You may wonder why this is a plugin and not the default behavior? The reason is that it's surprisingly difficult to detect if two joins are identical. It's trivial for simple joins like the ones in the example, but becomes quite complex with arbitrary joins with nested subqueries etc. There may be corner cases where the `DeduplicateJoinsPlugin` fails and we don't want it to affect people that don't need this deduplication (most people).

See [this recipe](https://kysely.dev/docs/recipes/conditional-selects.md) if you are wondering why we are using the `$if` method.


---

# Dealing with the `Type instantiation is excessively deep and possibly infinite` error

Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much for TypeScript and you get errors like this:

```
error TS2589: Type instantiation is excessively deep and possibly infinite.
```

In these case you can often use the [$assertType](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#_assertType) method to help TypeScript a little bit. When you use this method to assert the output type of a query, Kysely can drop the complex output type that consists of multiple nested helper types and replace it with the simple asserted type.

Using this method doesn't reduce type safety at all. You have to pass in a type that is structurally equal to the current type.

For example having more than 12 `with` statements in a query can lead to the `TS2589` error:

```
const res = await db
  .with('w1', (qb) => qb.selectFrom('person').select('first_name as fn1'))
  .with('w2', (qb) => qb.selectFrom('person').select('first_name as fn2'))
  .with('w3', (qb) => qb.selectFrom('person').select('first_name as fn3'))
  .with('w4', (qb) => qb.selectFrom('person').select('first_name as fn4'))
  .with('w5', (qb) => qb.selectFrom('person').select('first_name as fn5'))
  .with('w6', (qb) => qb.selectFrom('person').select('first_name as fn6'))
  .with('w7', (qb) => qb.selectFrom('person').select('first_name as fn7'))
  .with('w8', (qb) => qb.selectFrom('person').select('first_name as fn8'))
  .with('w9', (qb) => qb.selectFrom('person').select('first_name as fn9'))
  .with('w10', (qb) => qb.selectFrom('person').select('first_name as fn10'))
  .with('w11', (qb) => qb.selectFrom('person').select('first_name as fn11'))
  .with('w12', (qb) => qb.selectFrom('person').select('first_name as fn12'))
  .with('w13', (qb) => qb.selectFrom('person').select('first_name as fn13'))
  .selectFrom(['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 'w12', 'w13'])
  .selectAll()
  .executeTakeFirstOrThrow()
```

But if you simplify one or more of the `with` statements using `$assertType`, you get rid of the error:

```
const res = await db
  .with('w1', (qb) => qb.selectFrom('person').select('first_name as fn1'))
  .with('w2', (qb) => qb.selectFrom('person').select('first_name as fn2'))
  .with('w3', (qb) => qb.selectFrom('person').select('first_name as fn3'))
  .with('w4', (qb) => qb.selectFrom('person').select('first_name as fn4'))
  .with('w5', (qb) => qb.selectFrom('person').select('first_name as fn5'))
  .with('w6', (qb) => qb.selectFrom('person').select('first_name as fn6'))
  .with('w7', (qb) => qb.selectFrom('person').select('first_name as fn7'))
  .with('w8', (qb) => qb.selectFrom('person').select('first_name as fn8'))
  .with('w9', (qb) => qb.selectFrom('person').select('first_name as fn9'))
  .with('w10', (qb) => qb.selectFrom('person').select('first_name as fn10'))
  .with('w11', (qb) => qb.selectFrom('person').select('first_name as fn11'))
  .with('w12', (qb) =>
    qb
      .selectFrom('person')
      .select('first_name as fn12')
      .$assertType<{ fn12: string }>()
  )
  .with('w13', (qb) =>
    qb
      .selectFrom('person')
      .select('first_name as fn13')
      .$assertType<{ fn13: string }>()
  )
  .selectFrom(['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 'w12', 'w13'])
  .selectAll()
  .executeTakeFirstOrThrow()
```

The type you provide for `$assertType` must be structurally equal to the return type of the subquery. Therefore no type safety is lost.

I know what you're thinking: "can't this be done automatically?" No, unfortunately it can't. There's no way to do this using current TypeScript features. Typescript drags along all the parts the type is built with. Even though it could simplify the type into a simple object, it doesn't. We need to explictly tell it to do that.

"But there's this `Simplify` helper I've seen and it does exactly what you need". You mean this one:

```
export type Simplify<T> = { [K in keyof T]: T[K] } & {}
```

While that does simplify the type when you hover over it in your IDE, it doesn't actually drop the complex type underneath. You can try this yourself with the example above.


---

# Expressions

An [`Expression<T>`](https://kysely-org.github.io/kysely-apidoc/interfaces/Expression.html) is the basic type-safe query building block in Kysely. Pretty much all methods accept expressions as inputs. Most internal classes like [SelectQueryBuilder](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html) and [RawBuilder](https://kysely-org.github.io/kysely-apidoc/interfaces/RawBuilder.html) (the return value of the [sql tag](https://kysely-org.github.io/kysely-apidoc/functions/sql-1.html)) are expressions themselves.

`Expression<T>` represents an arbitrary SQL expression, like a binary expression (e.g. `a + b`), or a function call (e.g. `concat(arg1, ' ', arg2, ...)`). It can be any combination of those, no matter how complex. `T` is the output type of the expression.

## Expression builder[​](#expression-builder "Direct link to Expression builder")

Expressions are usually built using an instance of [`ExpressionBuilder<DB, TB>`](https://kysely-org.github.io/kysely-apidoc/interfaces/ExpressionBuilder.html). `DB` is the same database type you give to `Kysely` when you create an instance. `TB` is the union of all table names that are visible in the context. For example `ExpressionBuilder<DB, 'person' | 'pet'>` means you can reference `person` and `pet` columns in the created expressions.

You can get an instance of the expression builder using a callback:

```
const person = await db
  .selectFrom('person')
  // `eb` is an instance of ExpressionBuilder<DB, 'person'>
  .select((eb) => [
    // Call the `upper` function on `first_name`. There's a bunch of
    // shortcuts to functions under the `fn` object such as
    // `eb.fn.coalesce()` that provide a cleaner syntax.
    eb.fn('upper', ['first_name']).as('upper_first_name'),

    // Select a subquery
    eb.selectFrom('pet')
      .select('name')
      .whereRef('pet.owner_id', '=', 'person.id')
      .limit(1)
      .as('pet_name'),

    // Select a boolean expression
    eb('first_name', '=', 'Jennifer').as('is_jennifer'),

    // Select a static string value
    eb.val('Some value').as('string_value'),

    // Select a literal value
    eb.lit(42).as('literal_value'),
  ])
  // You can also destructure the expression builder like this
  .where(({ and, or, eb, not, exists, selectFrom }) => or([
    and([
      eb('first_name', '=', firstName),
      eb('last_name', '=', lastName)
    ]),
    not(exists(
      selectFrom('pet')
        .select('pet.id')
        .whereRef('pet.owner_id', '=', 'person.id')
        .where('pet.species', 'in', ['dog', 'cat'])
    ))
  ]))
  .executeTakeFirstOrThrow()

console.log(person.upper_first_name)
console.log(person.pet_name)
console.log(person.is_jennifer)
```

The generated SQL:

```
select
  upper("first_name") as "upper_first_name",

  (
    select "name"
    from "pet"
    where "pet"."owner_id" = "person"."id"
    limit 1
  ) as "pet_name",

  "first_name" = $1 as "is_jennifer",
  $2 as "string_value",
  42 as "literal_value"
from
  "person"
where (
  (
    "first_name" = $3
    and "last_name" = $4
  )
  or not exists (
    select "pet.id"
    from "pet"
    where "pet"."owner_id" = "person"."id"
    and "pet"."species" in ($5, $6)
  )
)
```

In the above query we used the expression builder in `select` and `where` methods. You can use it the same way in other methods like `having`, `on`, `orderBy`, `groupBy` etc.

All expressions are composable. You can pass expressions as arguments of any expression. All query builder methods in Kysely accept expressions and expression builder callbacks. All expression builder methods offer auto-completions and type-safety just like methods on the query builders.

You might be wondering, "why do I need to use a callback to get the expression builder?". "Why not just create an instance using a global function?". The reason is that when you use a callback, Kysely is able to infer the context correctly. The expression builder's methods only auto-complete and accept column and table names that are available in the context. In other words, using a callback provides more type-safety!

There's also a global function `expressionBuilder` you can use to create expression builders:

```
import { expressionBuilder } from 'kysely'

// `eb1` has type `ExpressionBuilder<DB, never>` which means there are no tables in the
// context. This variant should be used most of the time in helper functions since you
// shouldn't make assumptions about the calling context.
const eb1 = expressionBuilder<DB>()

// `eb2` has type `ExpressionBuilder<DB, 'person'>`. You can reference `person` columns
// directly in all expression builder methods.
const eb2 = expressionBuilder<DB, 'person'>()

// In this one you'd have access to tables `person` and `pet` and all their columns.
const eb3 = expressionBuilder<DB, 'person' | 'pet'>()

let qb = query
  .selectFrom('person')
  .innerJoin('movie as m', 'm.director_id', 'person.id')

// You can also provide a query builder instance and the context is inferred automatically.
// Type of `eb` is `ExpressionBuilder<DB & { m: Movie }, 'person' | 'm'>`
const eb = expressionBuilder(qb)

qb = qb.where(eb.not(eb.exists(
  eb.selectFrom('pet')
    .select('pet.id')
    .whereRef('pet.name', '=', 'm.name')
)))
```

## Creating reusable helpers[​](#creating-reusable-helpers "Direct link to Creating reusable helpers")

The expression builder can be used to create reusable helper functions. Let's say we have a complex `where` expression we want to reuse in multiple queries:

```
function hasDogNamed(name: string): Expression<boolean> {
  const eb = expressionBuilder<DB, 'person'>()

  return eb.exists(
    eb.selectFrom('pet')
      .select('pet.id')
      .whereRef('pet.owner_id', '=', 'person.id')
      .where('pet.species', '=', 'dog')
      .where('pet.name', '=', name)
  )
}
```

This helper can now be used in any query, and would work just fine if "person" table is in context:

```
const doggoPersons = await db
  .selectFrom('person')
  .selectAll('person')
  .where(hasDogNamed('Doggo'))
  .execute()
```

However, the above helper is not very type-safe. The following code would compile, but fail at runtime:

```
const bigFatFailure = await db
  .selectFrom('movie') // <-- "person" table is not in context!
  .selectAll('movie')
  .where(hasDogNamed('Doggo')) // <-- but we're referring to "person.id" in our helper
  .execute()
```

It's better to not make assumptions about the calling context and pass in all dependencies as arguments. In the following example we pass in the person's id as an expression. We also changed the type of `name` from `string` to `Expression<string>`, which allows us to pass in arbitrary expressions instead of just values.

```
function hasDogNamed(name: Expression<string>, ownerId: Expression<number>) {
  // Create an expression builder without any tables in the context.
  // This way we make no assumptions about the calling context.
  const eb = expressionBuilder<DB>()

  return eb.exists(
    eb.selectFrom('pet')
      .select('pet.id')
      .where('pet.owner_id', '=', ownerId)
      .where('pet.species', '=', 'dog')
      .where('pet.name', '=', name)
  )
}
```

Here's how you'd use our brand new helper:

```
const doggoPersons = await db
  .selectFrom('person')
  .selectAll('person')
  .where((eb) => hasDogNamed(eb.val('Doggo'), eb.ref('person.id')))
  .execute()
```

Learn more about reusable helper functions [here](https://kysely.dev/docs/recipes/reusable-helpers).

## Conditional expressions[​](#conditional-expressions "Direct link to Conditional expressions")

In the following, we'll only cover `where` expressions. The same logic applies to `having`, `on`, `orderBy`, `groupBy` etc.

> This section should not be confused with conditional selections in `select` clauses, which is a whole 'nother topic we discuss in [this recipe](https://kysely.dev/docs/recipes/conditional-selects).

Having a set of optional filters you want to combine using `and`, is the most basic and common use case of conditional `where` expressions. Since the `where`, `having` and other filter functions are additive, most of the time this is enough:

```
let query = db
  .selectFrom('person')
  .selectAll('person')

if (firstName) {
  // The query builder is immutable. Remember to replace the builder
  // with the new one.
  query = query.where('first_name', '=', firstName)
}

if (lastName) {
  query = query.where('last_name', '=', lastName)
}

const persons = await query.execute()
```

The same query can be built using the expression builder like this:

```
const persons = await db
  .selectFrom('person')
  .selectAll('person')
  .where((eb) => {
    const filters: Expression<SqlBool>[] = []

    if (firstName) {
      filters.push(eb('first_name', '=', firstName))
    }

    if (lastName) {
      filters.push(eb('last_name', '=', lastName))
    }

    return eb.and(filters)
  })
  .execute()
```

Using the latter design, you can build conditional expressions of any complexity.


---

# Extending kysely

In many cases, Kysely doesn't provide a built-in type-safe method for a feature. It's often because adding that feature in a generic way that would work in all use cases is difficult or impossible. In many cases it's better to create little helper functions in your project that suit your use case. Kysely makes this simple.

The Kysely API is designed around two interfaces [`Expression<T>`](https://kysely-org.github.io/kysely-apidoc/interfaces/Expression.html) and [`AliasedExpression<T, A>`](https://kysely-org.github.io/kysely-apidoc/interfaces/AliasedExpression.html). Almost every method accepts values that implement these interfaces and most Kysely internals achieve their "type magic" by implementing them.

Most of the time you can create your helpers using the [sql template tag](https://kysely-org.github.io/kysely-apidoc/interfaces/Sql.html) and the `RawBuilder<T>` and `AliasedRawBuilder<T, A>` class instances it returns, but it's good to first understand how the underlying interfaces they implement, `Expression<T>` and `AliasedExpression<T, A>`, work.

## Expression[​](#expression "Direct link to Expression")

[`Expression<T>`](https://kysely-org.github.io/kysely-apidoc/interfaces/Expression.html) is a simple interface that has a type `T` and a single method `toOperationNode()`. `T` tells Kysely's type system the type of the expression. `toOperationNode()` returns instructions on what SQL should be produced once the expression is compiled.

Here's an example of a custom expression for `JSON` or `JSONB` values on PostgreSQL:

```
import { Expression, Kysely, OperationNode, sql } from 'kysely'

class JsonValue<T> implements Expression<T> {
  #value: T

  constructor(value: T) {
    this.#value = value
  }

  // This is a mandatory getter. You must add it and always return `undefined`.
  // The return type must always be `T | undefined`.
  get expressionType(): T | undefined {
    return undefined
  }

  toOperationNode(): OperationNode {
    const json = JSON.stringify(this.#value)
    // Most of the time you can use the `sql` template tag to build the returned node.
    // The `sql` template tag takes care of passing the `json` string as a parameter, alongside the sql string, to the DB.
    return sql`CAST(${json} AS JSONB)`.toOperationNode()
  }
}
```

Now you can use your new `JsonValue` expression pretty much anywhere *as a value* in a type-safe way:

```
interface DB {
  person: {
    address: {
      postalCode: string
      street: string
    }
  }
}

async function test(db: Kysely<DB>) {
  await db
    .insertInto('person')
    .values({
      address: new JsonValue({
        postalCode: '123456',
        street: 'Kysely avenue 42',
      }),
    })
    .execute()

  await db
    .selectFrom('person')
    .selectAll()
    .where(
      'address',
      '@>',
      new JsonValue({ postalCode: '123456', street: 'Kysely avenue 42' })
    )
    .execute()
}
```

Most of the time you don't need to create your own classes that implement the `Expression<T>` interface. You can simply wrap the [sql template tag](https://kysely-org.github.io/kysely-apidoc/interfaces/Sql.html) and the `RawBuilder<T>` class instance it returns in a function. `RawBuilder<T>`, like most things in Kysely, implements the `Expression<T>` interface.

Our previous example would get simplified into this:

```
import { Kysely, RawBuilder, sql } from 'kysely'

function json<T>(value: T): RawBuilder<T> {
  return sql`CAST(${JSON.stringify(value)} AS JSONB)`
}
```

And you'd use it like this:

```
interface DB {
  person: {
    address: {
      postalCode: string
      street: string
    }
  }
}

async function test(db: Kysely<DB>) {
  await db
    .insertInto('person')
    .values({
      address: json({
        postalCode: '123456',
        street: 'Kysely avenue 42',
      }),
    })
    .execute()

  await db
    .selectFrom('person')
    .selectAll()
    .where(
      'address',
      '@>',
      json({ postalCode: '123456', street: 'Kysely avenue 42' })
    )
    .execute()
}
```

## AliasedExpression[​](#aliasedexpression "Direct link to AliasedExpression")

While `Expression<T>` holds the type and compilation instructions of an SQL expression, [`AliasedExpression<T, A>`](https://kysely-org.github.io/kysely-apidoc/interfaces/AliasedExpression.html) also holds an alias (a name) for that expression. `AliasedExpression<T, A>` can be used in places where you need a name for the expression, like in a `SELECT` statement or a `FROM` statement. `AliasedExpression<T, A>` is how kysely is able to infer the name and type of result columns.

Let's expand the `JsonValue` example from the [previous section](#expression). We'll add an `as` method for the `JsonValue` class that can be used to turn an `Expression<T>` into an `AliasedExpression<T, A>`:

```
import {
  Expression,
  AliasedExpression,
  Kysely,
  OperationNode,
  sql,
  AliasNode,
  IdentifierNode,
} from 'kysely'

class JsonValue<T> implements Expression<T> {
  // ... Methods from the previous example ...

  as<A extends string>(alias: A): AliasedJsonValue<T, A> {
    return new AliasedJsonValue(this, alias)
  }
}

class AliasedJsonValue<T, A extends string> implements AliasedExpression<T, A> {
  #expression: Expression<T>
  #alias: A

  constructor(expression: Expression<T>, alias: A) {
    this.#expression = expression
    this.#alias = alias
  }

  get expression(): Expression<T> {
    return this.#expression
  }

  get alias(): A {
    return this.#alias
  }

  toOperationNode(): AliasNode {
    return AliasNode.create(
      this.#expression.toOperationNode(),
      IdentifierNode.create(this.#alias)
    )
  }
}
```

And now you can use `JsonValue` in `select` statements too with full type safety:

```
interface DB {
  person: {
    address: {
      postalCode: string
      street: string
    }
  }
}

async function test(db: Kysely<DB>) {
  const result = await db
    .selectFrom('person')
    .select([new JsonValue({ someValue: 42 }).as('some_object'), 'address'])
    .where(
      'address',
      '@>',
      new JsonValue({ postalCode: '123456', street: 'Kysely avenue 42' })
    )
    .executeTakeFirstOrThrow()

  console.log(result.some_object.someValue)
  console.log(result.address.postalCode)
}
```

Again, in most cases you don't need to implement your own `AliasedExpression<T, A>`. `RawBuilder` has a similar `as` method and we can use the three line long `json` function from our previous example:

```
function json<T>(value: T): RawBuilder<T> {
  return sql`CAST(${JSON.stringify(value)} AS JSONB)`
}
```

```
interface DB {
  person: {
    address: {
      postalCode: string
      street: string
    }
  }
}

async function test(db: Kysely<DB>) {
  const result = await db
    .selectFrom('person')
    .select([json({ someValue: 42 }).as('some_object'), 'address'])
    .where(
      'address',
      '@>',
      json({ postalCode: '123456', street: 'Kysely avenue 42' })
    )
    .executeTakeFirstOrThrow()

  console.log(result.address.postalCode)
  console.log(result.some_object.someValue)
}
```

## A more complex example[​](#a-more-complex-example "Direct link to A more complex example")

Consider this query:

```
insert into
  t (t1, t2)
select
  v.v1,
  j.j2
from
  (values ($1, $2, $3), ($4, $5, $6)) as v(id, v1, v2)
inner join
  j on v.id = j.vid
```

Kysely doesn't have built-in support for the `values` keyword in this context, but you can create a type-safe helper function like this:

```
function values<R extends Record<string, unknown>, A extends string>(
  records: R[],
  alias: A
): AliasedRawBuilder<R, A> {
  // Assume there's at least one record and all records
  // have the same keys.
  const keys = Object.keys(records[0])

  // Transform the records into a list of lists such as
  // ($1, $2, $3), ($4, $5, $6)
  const values = sql.join(
    records.map((r) => sql`(${sql.join(keys.map((k) => r[k]))})`)
  )

  // Create the alias `v(id, v1, v2)` that specifies the table alias
  // AND a name for each column.
  const wrappedAlias = sql.ref(alias)
  const wrappedColumns = sql.join(keys.map(sql.ref))
  const aliasSql = sql`${wrappedAlias}(${wrappedColumns})`

  // Finally create a single `AliasedRawBuilder` instance of the
  // whole thing. Note that we need to explicitly specify
  // the alias type using `.as<A>` because we are using a
  // raw sql snippet as the alias.
  return sql<R>`(values ${values})`.as<A>(aliasSql)
}
```

A lot is going on in this function, but it's all documented in the [sql template tag's documentation.](https://kysely-org.github.io/kysely-apidoc/interfaces/Sql.html)

Most of the time a helper like this would return either an instance of `RawBuilder` or `AliasedRawBuilder` and you'd create an instance using the `sql` template tag. You'd return a `RawBuilder` instance when only the data type of a column/table is needed and an `AliasedRawBuilder` when also the name of the column/table is needed. Our example function creates kind of a temporary table, so we need to tell Kysely both the type of the table AND the name of the table.

This is how you could now create our query using the `values` helper:

```
// This could come as an input from somewhere.
const records = [
  {
    id: 1,
    v1: 'foo',
    v2: 'bar',
  },
  {
    id: 2,
    v1: 'baz',
    v2: 'spam',
  },
]

db.insertInto('t')
  .columns(['t1', 't2'])
  .expression(
    // The `values` function automatically parses the column types
    // from the records and you can refer to them through the table
    // alias `v`. This works because Kysely is able to parse the
    // AliasedRawBuilder<T, A> type.
    db
      .selectFrom(values(records, 'v'))
      .innerJoin('j', 'v.id', 'j.vid')
      .select(['v.v1', 'j.j2'])
  )
```

## Extending using inheritance[​](#extending-using-inheritance "Direct link to Extending using inheritance")

You usually don't want to do this because of the complexity of the types and TypeScript's limitations when it comes to inheritence and return types. You'll quickly run into problems. Even though Kysely uses classes, it is not designed from the OOP point of view. Classes are used because they are supported natively by TypeScript. They provide private variables and a nice discoverable API.

## Extending using module augmentation[​](#extending-using-module-augmentation "Direct link to Extending using module augmentation")

> DISCLAIMER: We do not support this method. Use at your own risk.

You can override and extend Kysely's builder classes via [Typescript module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

The following example adds an `addIdColumn` method to `CreateTableBuilder`, which helps in adding a PostgreSQL UUID primary key column:

```
declare module 'kysely/dist/cjs/schema/create-table-builder' {
  interface CreateTableBuilder<TB extends string, C extends string = never> {
    addIdColumn<CN extends string = 'id'>(
      col?: CN
    ): CreateTableBuilder<TB, C | CN>
  }
}
CreateTableBuilder.prototype.addIdColumn = function (
  this: CreateTableBuilder<any, any>,
  col?: string
) {
  return this.addColumn(col || 'id', 'uuid', (col) =>
    col.primaryKey().defaultTo(sql`gen_random_uuid()`)
  )
}
```

Now you can use `addIdColumn` seamlessly to create several tables with a uniform primary key definition:

```
db.schema.createTable('person').addIdColumn().addColumn('name', 'varchar')
db.schema.createTable('pet').addColumn('species', 'varchar').addIdColumn()
```


---

# Introspecting relation metadata

Extracting metadata about tables and views from your database schema in runtime is possible using the methods in the `instrospection` property of a `Kysely` instance.

The example below uses a PostgreSQL connection to print information about all tables and views found in the database schema:

```
import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
const { Pool } = pg

async function logDatabaseSchema() {
  const db = new Kysely({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    }),
  })

  const tables = await db.introspection.getTables()
  //        ^?  TableMetadata[]

  console.log({ tables })
}

logDatabaseSchema()
```

For more information check the docs for details on the interfaces [DatabaseIntrospector](https://kysely-org.github.io/kysely-apidoc/interfaces/DatabaseIntrospector.html) and [TableMetadata](https://kysely-org.github.io/kysely-apidoc/interfaces/TableMetadata.html).


---

# Logging

It is possible to set up logs for all queries using the `log` property when instantiating `Kysely`.

There are 2 ways to configure logging:

## 1. Provide an array with log level/s[​](#1-provide-an-array-with-log-levels "Direct link to 1. Provide an array with log level/s")

You can provide an array of log levels to the `log` property when instantiating `Kysely`.

When `'query'` is included in the array, `Kysely` will log all executed queries, not including parameter values.

When `'error'` is included in the array, `Kysely` will log all errors.

```
const db = new Kysely({
  ...
  log: ['query', 'error']
  ...
});
```

## 2. Provide a custom logging function[​](#2-provide-a-custom-logging-function "Direct link to 2. Provide a custom logging function")

You can provide a custom logging function to the `log` property when instantiating `Kysely`. The custom logging function receives a log event as an argument.

The `LogEvent` interface is defined as follows:

```
interface LogEvent {
  level: 'query' | 'error';
  query: CompiledQuery; // this object contains the raw SQL string, parameters, and Kysely's SQL syntax tree that helped output the raw SQL string.
  queryDurationMillis: number; // the time in milliseconds it took for the query to execute and get a response from the database.
  error: unknown; // only present if `level` is `'error'`.
}
```

Example:

```
const db = new Kysely({
  dialect: new PostgresDialect(postgresConfig),
  log(event) {
    if (event.level === "error") {
        console.error("Query failed : ", {
          durationMs: event.queryDurationMillis,
          error: event.error,
          sql: event.query.sql,
          params: event.query.parameters.map(maskPII),
        });
    } else { // `'query'`
      console.log("Query executed : ", {
        durationMs: event.queryDurationMillis,
        sql: event.query.sql,
        params: event.query.parameters.map(maskPII),
      });
    }
  }
})
```

For more information check the docs for details on the interfaces [KyselyConfig](https://kysely-org.github.io/kysely-apidoc/interfaces/KyselyConfig.html).


---

# Raw SQL

You can execute raw SQL strings and pass raw SQL snippets to pretty much any method or function using the [sql template tag](https://kysely-org.github.io/kysely-apidoc/interfaces/Sql.html).


---

# Relations

### Kysely IS NOT an ORM. Kysely DOES NOT have the concept of relations. Kysely IS a query builder. Kysely DOES build the SQL you tell it to, nothing more, nothing less.

Phew, glad we got that out the way..

Having said all that, there are ways to nest related rows in your queries. You just have to do it using the tools SQL and the underlying dialect (e.g. PostgreSQL, MySQL, or SQLite) provide. In this recipe we show one way to do that when using the built-in PostgreSQL, MySQL, and SQLite dialects.

This recipe is supported on MySQL versions starting from 8.0.14. This is due to the way subqueries use outer references in this recipe (cf. [MySQL 8.0.14 changelog](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-14.html#mysqld-8-0-14-optimizer) | [MariaDB is not supported yet](https://jira.mariadb.org/browse/MDEV-19078)).

## The `json` data type and functions[​](#the-json-data-type-and-functions "Direct link to the-json-data-type-and-functions")

PostgreSQL and MySQL have rich JSON support through their `json` data types and functions. `pg` and `mysql2`, the node drivers, automatically parse returned `json` columns as json objects. With the combination of these two things, we can write some super efficient queries with nested relations.

Parsing JSON

The built in `SqliteDialect` and some third-party dialects don't parse the returned JSON columns to objects automatically. Not even if they use `PostgreSQL` or `MySQL` under the hood! Parsing is handled (or not handled) by the database driver that Kysely has no control over. If your JSON columns get returned as strings, you can use the `ParseJSONResultsPlugin`:

```
const db = new Kysely<DB>({
  ...
  plugins: [new ParseJSONResultsPlugin()]
})
```

Let's start with some raw postgres SQL, and then see how we can write the query using Kysely in a nice type-safe way.

In the following query, we fetch a list of people (from "person" table) and for each person, we nest the person's pets, and mother, into the returned objects:

```
SELECT
  person.*,

  -- Select person's pets as a json array
  (
    SELECT
      COALESCE(JSON_AGG(pets), '[]')
    FROM
    (
      SELECT
        pet.id, pet.name
      FROM
        pet
      WHERE
        pet.owner_id = person.id
      ORDER BY
        pet.name
    ) pets
  ) pets,

  -- Select person's mother as a json object
  (
    SELECT
      TO_JSON(mother)
    FROM
    (
      SELECT
        mother.id, mother.first_name
      FROM
        person as mother
      WHERE
        mother.id = person.mother_id
    ) mother
  ) mother
FROM
  person
```

Simple right 😅. Yeah, not so much. But it does provide full control over the queries and a really good performance as long as you have indices (or indexes, we don't judge) for "pet.owner\_id" and "person.mother\_id".

Fortunately we can improve and simplify this a lot using Kysely. First let's define a couple of helpers:

```
function jsonArrayFrom<O>(expr: Expression<O>) {
  return sql<Simplify<O>[]>`(select coalesce(json_agg(agg), '[]') from ${expr} as agg)`
}

function jsonObjectFrom<O>(expr: Expression<O>) {
  return sql<Simplify<O>>`(select to_json(obj) from ${expr} as obj)`
}
```

These helpers are included in Kysely and you can import them from the `helpers` module like this:

```
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
```

MySQL and SQLite versions of the helpers are slightly different, but you can use them the same way. You can import them like this:

```
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql'
```

```
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite'
```

With these helpers, our example query already becomes a little more bearable to look at:

```
const persons = await db
  .selectFrom('person')
  .selectAll('person')
  .select((eb) => [
    // pets
    jsonArrayFrom(
      eb.selectFrom('pet')
        .select(['pet.id', 'pet.name'])
        .whereRef('pet.owner_id', '=', 'person.id')
        .orderBy('pet.name')
    ).as('pets'),

    // mother
    jsonObjectFrom(
      eb.selectFrom('person as mother')
        .select(['mother.id', 'mother.first_name'])
        .whereRef('mother.id', '=', 'person.mother_id')
    ).as('mother')
  ])
  .execute()

console.log(persons[0].pets[0].name)
console.log(persons[0].mother?.first_name)
```

That's better right? If you need to do this over and over in your codebase, you can create some helpers like these:

```
function pets(ownerId: Expression<string>) {
  return jsonArrayFrom(
    db.selectFrom('pet')
      .select(['pet.id', 'pet.name'])
      .where('pet.owner_id', '=', ownerId)
      .orderBy('pet.name')
  )
}

function mother(motherId: Expression<string>) {
  return jsonObjectFrom(
    db.selectFrom('person as mother')
      .select(['mother.id', 'mother.first_name'])
      .where('mother.id', '=', motherId)
  )
}
```

And now you get this:

```
const persons = await db
  .selectFrom('person')
  .selectAll('person')
  .select(({ ref }) => [
    pets(ref('person.id')).as('pets'),
    mother(ref('person.mother_id')).as('mother')
  ])
  .execute()

console.log(persons[0].pets[0].name)
console.log(persons[0].mother?.first_name)
```

In some cases Kysely marks your selections as nullable if it's not able to know the related object always exists. If you have that information, you can mark the relation non-null using the `$notNull()` helper like this:

```
const persons = await db
  .selectFrom('person')
  .selectAll('person')
  .select(({ ref }) => [
    pets(ref('person.id')).as('pets'),
    mother(ref('person.mother_id')).$notNull().as('mother')
  ])
  .execute()

console.log(persons[0].pets[0].name)
console.log(persons[0].mother.first_name)
```

If you need to select relations conditionally, `$if` is your friend:

```
const persons = await db
  .selectFrom('person')
  .selectAll('person')
  .$if(includePets, (qb) => qb.select(
    (eb) => pets(eb.ref('person.id')).as('pets')
  ))
  .$if(includeMom, (qb) => qb.select(
    (eb) => mother(eb.ref('person.mother_id')).as('mother')
  ))
  .execute()
```


---

# Reusable helpers

info

[Here's](https://kyse.link/qm67s) a playground link containing all the code in this recipe.

Let's say you want to write the following query:

```
SELECT id, first_name
FROM person
WHERE upper(last_name) = $1
```

Kysely doesn't have a built-in `upper` function but there are at least three ways you could write this:

```
const lastName = 'STALLONE'

const persons = await db
  .selectFrom('person')
  .select(['id', 'first_name'])
  // 1. `sql` template tag. This is the least type-safe option.
  // You're providing the column name without any type-checking,
  // and plugins won't affect it.
  .where(
    sql<string>`upper(last_name)`, '=', lastName
  )
  // 2. `sql` template tag with `ref`. Anything passed to `ref`
  // gets type-checked against the accumulated query context.
  .where(({ eb, ref }) => eb(
    sql<string>`upper(${ref('last_name')})`, '=', lastName
  ))
  // 3. The `fn` function helps you avoid missing parentheses/commas
  // errors and uses refs as 1st class arguments.
  .where(({ eb, fn }) => eb(
    fn<string>('upper', ['last_name']), '=', lastName
  ))
  .execute()
```

but each option could be more readable or type-safe.

Fortunately Kysely allows you to easily create composable, reusable and type-safe helper functions:

```
import { Expression, sql } from 'kysely'

function upper(expr: Expression<string>) {
  return sql<string>`upper(${expr})`
}

function lower(expr: Expression<string>) {
  return sql<string>`lower(${expr})`
}

function concat(...exprs: Expression<string>[]) {
  return sql.join<string>(exprs, sql`||`)
}
```

Using the `upper` helper, our query would look like this:

```
const lastName = 'STALLONE'

const persons = await db
  .selectFrom('person')
  .select(['id', 'first_name'])
  .where(({ eb, ref }) => eb(
    upper(ref('last_name')), '=', lastName
  ))
  .execute()
```

The recipe for helper functions is simple: take inputs as `Expression<T>` instances where `T` is the type of the expression. For example `upper` takes in any `string` expression since it transforms strings to upper case. If you implemented the `round` function, it'd take in `Expression<number>` since you can only round numbers.

The helper functions should then use the inputs to create an output that's also an `Expression`. Everything you can create using the expression builder is an instance of `Expression`. So is the output of the `sql` template tag and all methods under the `sql` object. Same goes for `SelectQueryBuilder` and pretty much everything else in Kysely. Everything's an expression.

See [this recipe](https://kysely.dev/docs/recipes/expressions) to learn more about expressions.

So we've learned that everything's an expression and that expressions are composable. Let's put this idea to use:

```
const persons = await db
  .selectFrom('person')
  .select(['id', 'first_name'])
  .where(({ eb, ref, val }) => eb(
    concat(
      lower(ref('first_name')),
      val(' '),
      upper(ref('last_name'))
    ),
    '=',
    'sylvester STALLONE'
  ))
  .execute()
```

So far we've only used our helper functions in the first argument of `where` but you can use them anywhere:

```
const persons = await db
  .selectFrom('person')
  .innerJoin('pet', (join) => join.on(eb => eb(
    'person.first_name', '=', lower(eb.ref('pet.name'))
  )))
  .select(({ ref, val }) => [
    'first_name',
    // If you use a helper in `select`, you need to always provide an explicit
    // name for it using the `as` method.
    concat(ref('person.first_name'), val(' '), ref('pet.name')).as('name_with_pet')
  ])
  .orderBy(({ ref }) => lower(ref('first_name')))
  .execute()
```

## Reusable helpers using `ExpressionBuilder`[​](#reusable-helpers-using-expressionbuilder "Direct link to reusable-helpers-using-expressionbuilder")

Here's an example of a helper function that uses the expression builder instead of raw SQL:

```
import { Expression, expressionBuilder } from 'kysely'

function idsOfPersonsThatHaveDogNamed(name: Expression<string>) {
  const eb = expressionBuilder<DB>()

  // A subquery that returns the identifiers of all persons
  // that have a dog named `name`.
  return eb
    .selectFrom('pet')
    .select('pet.owner_id')
    .where('pet.species', '=', 'dog')
    .where('pet.name', '=', name)
}
```

And here's how you could use it:

```
const dogName = 'Doggo'

const persons = await db
  .selectFrom('person')
  .selectAll('person')
  .where((eb) => eb(
    'person.id', 'in', idsOfPersonsThatHaveDogNamed(eb.val(dogName))
  ))
  .execute()
```

Note that `idsOfPersonsThatHaveDogNamed` doesn't execute a separate query but instead returns a subquery expression that's compiled as a part of the parent query:

```
select
  person.*
from
  person
where
  person.id in (
    select pet.owner_id
    from pet
    where pet.species = 'dog'
    and pet.name = ?
  )
```

In all our examples we've used the following syntax:

```
.where(eb => eb(left, operator, right))
```

When the expression builder `eb` is used as a function, it creates a binary expression. All binary expressions with a comparison operator are represented as a `Expression<SqlBool>`. You don't always need to return `eb(left, operator, right)` from the callback though. Since `Expressions` are composable and reusable, you can return any `Expression<SqlBool>`.

This means you can create helpers like this:

```
function isOlderThan(age: Expression<number>) {
  return sql<SqlBool>`age > ${age}`
}
```

```
const persons = await db
  .selectFrom('person')
  .select(['id', 'first_name'])
  .where(({ val }) => isOlderThan(val(60)))
  .execute()
```

## Dealing with nullable expressions[​](#dealing-with-nullable-expressions "Direct link to Dealing with nullable expressions")

If you want your helpers to work with nullable expressions (nullable columns etc.), you can do something like this:

```
import { Expression } from 'kysely'

// This function accepts both nullable and non-nullable string expressions.
function toInt<T extends string | null>(expr: Expression<T>) {
  // This returns `Expression<number | null>` if `expr` is nullable
  // and `Expression<number>` otherwise.
  return sql<T extends null ? (number | null) : number>`(${expr})::integer`
}
```

## Passing select queries as expressions[​](#passing-select-queries-as-expressions "Direct link to Passing select queries as expressions")

Let's say we have the following query:

```
const expr: Expression<{ name: string }> = db
  .selectFrom('pet')
  .select('pet.name')
```

The expression type of our query is `Expression<{ name: string }>` but SQL allows you to use a query like that as an `Expression<string>`. In other words, SQL allows you to use single-column record types like scalars. Most of the time Kysely is able to automatically handle this case but with helper functions you need to use `$asScalar()` to convert the type. Here's an example:

```
const persons = await db
  .selectFrom('person')
  .select((eb) => [
    'id',
    'first_name',
    upper(
      eb.selectFrom('pet')
        .select('name')
        .whereRef('person.id', '=', 'pet.owner_id')
        .limit(1)
        .$asScalar() // <-- This is needed
        .$notNull()
    ).as('pet_name')
  ])
```

The subquery is an `Expression<{ name: string }>` but our `upper` function only accepts `Expression<string>`. That's why we need to call `$asScalar()`. `$asScalar()` has no effect on the generated SQL. It's simply a type-level helper.

We also used `$notNull()` in the example because our simple `upper` function doesn't support nullable expressions.


---

# Working with schemas

First of all, when we talk about schemas in this document, we mean custom schemas like [postgres schemas](https://www.postgresql.org/docs/14/ddl-schemas.html).

There are two common ways to use schemas:

1. To group a logical set of tables under the same "namespace". For example all tables directly related to users could live under a `user` schema.

2. To have a separate namespaced copy of a set of tables for each tenant in a multitenant application.

Kysely offers tools for both of these cases.

## 1[​](#1 "Direct link to 1")

When you have an enumarable set of schemas, you can add them to your database interface like this:

```
interface Database {
  'user.user': UserTable
  'user.user_permission': UserPermissionTable
  'user.permission': PermissionTable
  pet: PetTable
}
```

then you can refer to the tables just like you would a normal table:

```
db.selectFrom('user.user')
  .where('username', '=', '')
  // You can also include the full table name
  .where('user.user.created_at', '>', createdAt)
  .innerJoin('user.user_permission as up', 'up.user_id', 'user.user.id')
  .innerJoin('user.permission as p', 'p.id', 'up.permission_id')
  .selectAll()
```

## 2[​](#2 "Direct link to 2")

In the multitenant case you have a schema per tenant and you can't add each of them to the database interface, nor would it make sense to do so. In this case you can use the [withSchema](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html#withSchema) method.

The `withSchema` method sets the default schema of all table references that don't explicitly specify a schema:

```
db.withSchema(tenant)
  .selectFrom('user')
  .innerJoin('user_permission as up', 'up.user_id', 'user.id')
  .innerJoin('public.permission as p', 'p.id', 'up.permission_id')
  .selectAll()
```

This is the generated SQL assuming `tenant` equals `'acme'`:

```
select * from "acme"."user"
inner join "acme"."user_permission" as "up" on "up"."user_id" = "acme"."user"."id"
inner join "public"."permission" as "p" on "p"."id" = "up"."permission_id"
```

In this example we also referred to a shared table `permission` in the `public` schema. Please note that you need to add a `'public.permission': PermissionTable` item in your database schema to be able to refer to the `public.permission` table:

```
interface Database {
  // Add your tenant tables without any schema:
  user: UserTable
  user_permission: UserPermissionTable

  // Add schemas and tables you need to explicitly reference like this:
  'public.permission': PermissionTable

  // You can also have other shared tables with or without schemas here.
  // But keep in mind that if you want to refer to them from a `withSchema`
  // query, you need the table name with the schema name.
  pet: PetTable
}
```

See the [first case](#1) for more info.


---

# Splitting query building and execution

Kysely is primarily a type-safe sql query builder.

It also does query execution, migrations, etc. in order to align with Knex's "batteries included" approach.

## "Cold" Kysely instances[​](#cold-kysely-instances "Direct link to \"Cold\" Kysely instances")

In order to use Kysely purely as a query builder without database driver dependencies, you can instantiate it with the built-in `DummyDriver` class:

```
import {
  Generated,
  DummyDriver,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from 'kysely'

interface Person {
  id: Generated<number>
  first_name: string
  last_name: string | null
}

interface Database {
  person: Person
}

const db = new Kysely<Database>({
  dialect: {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db) => new PostgresIntrospector(db),
    createQueryCompiler: () => new PostgresQueryCompiler(),
  },
})
```

This Kysely instance will compile to PostgreSQL sql dialect. You can brew "dummy" dialects to compile to all kinds of sql dialects (e.g. MySQL). Trying to execute queries using "cold" kysely instances will return empty results without communicating with a database.

> "Cold" Kysely instances are not required for the following sections. You can use "hot" kysely instances, with real drivers, if you want to.

## Compile a query[​](#compile-a-query "Direct link to Compile a query")

To compile a query, simply call `.compile()` at the end of the query building chain:

```
const compiledQuery = db
  .selectFrom('person')
  .select('first_name')
  .where('id', '=', id)
  .compile()

console.log(compiledQuery) // { sql: 'select "first_name" from "person" where "id" = $1', parameters: [1], query: { ... } }
```

The result of `.compile()` is a `CompiledQuery` object. It contains the query string (in `sql` field), parameters and the original Kysely-specific syntax tree used for compilation.

This output alone can be used with any database driver that understands the sql dialect used (PostgreSQL in this example).

Raw queries can be compiled as well:

```
import { Selectable, sql } from 'kysely'

const compiledQuery = sql<Selectable<Person>>`select * from person where id = ${id}`.compile(db)

console.log(compiledQuery) // { sql: 'select * from person where id = $1', parameters: [1], query: { ... } }
```

## Infer result type[​](#infer-result-type "Direct link to Infer result type")

Kysely supports inferring a (compiled) query's result type even when detached from query building chains. This allows splitting query building, compilation and execution code without losing type-safety.

```
import { InferResult } from 'kysely'

const query = db
  .selectFrom('person')
  .select('first_name')
  .where('id', '=', id)

type QueryReturnType = InferResult<typeof query> // { first_name: string }[]

const compiledQuery = query.compile()

type CompiledQueryReturnType = InferResult<typeof compiledQuery> // { first_name: string }[]
```

## Execute compiled queries[​](#execute-compiled-queries "Direct link to Execute compiled queries")

The `CompiledQuery` object returned by `.compile()` can be executed via "hot" Kysely instances (real drivers in use):

```
const compiledQuery = db
  .selectFrom('person')
  .select('first_name')
  .where('id', '=', id)
  .compile()

const results = await db.executeQuery(compiledQuery)
```

The `QueryResult` object returned by `.executeQuery()` contains the query results' rows, insertId and number of affected rows (if applicable).


---

# Browser

Kysely also runs in the browser. Here's a minimal example:

```
import {
  Kysely,
  Generated,
  DummyDriver,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
} from 'kysely'

interface Person {
  id: Generated<number>
  first_name: string
  last_name: string | null
}

interface Database {
  person: Person
}

const db = new Kysely<Database>({
  dialect: {
    createAdapter() {
      return new SqliteAdapter()
    },
    createDriver() {
      return new DummyDriver()
    },
    createIntrospector(db: Kysely<unknown>) {
      return new SqliteIntrospector(db)
    },
    createQueryCompiler() {
      return new SqliteQueryCompiler()
    },
  },
})

window.addEventListener('load', () => {
  const sql = db.selectFrom('person').select('id').compile()

  const result = document.createElement('span')
  result.id = 'result'
  result.innerHTML = sql.sql

  document.body.appendChild(result)
})
```


---

# Running on Deno

Kysely doesn't include drivers for Deno, but you can still use Kysely as a query builder or implement your own driver:

```
// We use jsdeliver to get Kysely from npm.
import {
  DummyDriver,
  Generated,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from 'https://cdn.jsdelivr.net/npm/kysely/dist/esm/index.js'

interface Person {
  id: Generated<number>
  first_name: string
  last_name: string | null
}

interface Database {
  person: Person
}

const db = new Kysely<Database>({
  dialect: {
    createAdapter() {
      return new PostgresAdapter()
    },
    createDriver() {
      // You need a driver to be able to execute queries. In this example
      // we use the dummy driver that never does anything.
      return new DummyDriver()
    },
    createIntrospector(db: Kysely<unknown>) {
      return new PostgresIntrospector(db)
    },
    createQueryCompiler() {
      return new PostgresQueryCompiler()
    },
  },
})

const query = db.selectFrom('person').select('id')
const sql = query.compile()

console.log(sql.sql)
```


---
