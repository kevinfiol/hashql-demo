sql`select who bar
    from tomatosauce
    where choco = 2;
`;
import m from 'mithril';
import sql from './sql';

let pokemans = []

const getPokemons = async () => {
    pokemans = await sql`select * from pokemon where name in (select name from foobar where name like 'pikachu')`;
    let bar = await sql`select bar from foobarchu where name = ${ 'cheeky' }`;
    console.log(pokemans);
};

const App = () => ({
    view: () =>
        m('div',
            m('p', 'hello world'),
            m('button', { onclick: getPokemons }, 'get pokemons')
        )
});

m.mount(document.getElementById('app'), App);