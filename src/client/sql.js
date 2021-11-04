import HashQL from 'hashql'

const ENDPOINT = 'http://localhost:8787/hql';

const { sql } = HashQL('sql', query => 
    fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
    }).then(res => res.json())
)

sql`
    halo 3
`

export default sql;