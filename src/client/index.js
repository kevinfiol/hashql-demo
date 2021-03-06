import m from 'mithril';
import sql from './sql';

let pokemans = []

const getPokemons = async () => {
    pokemans = await sql`select * from pokemon`;
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