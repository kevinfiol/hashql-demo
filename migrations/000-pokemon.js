export async function up(sql) {
    await sql`
        create table if not exists pokemon (
            id serial primary key,
            name text not null,
            created_at timestamp not null
        );
    `;

    await sql`
        insert into pokemon(name, created_at)
        values ('pikachu', now());
    `;
};

export async function down(sql) {
    await sql`
        drop table if exists pokemon;
    `;
};