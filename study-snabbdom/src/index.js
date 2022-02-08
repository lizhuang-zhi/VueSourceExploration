import h from './mysnabbdom/h';
import patch from './mysnabbdom/patch';

// const myVnode1 = h('h1', {}, [
//     h('div', {}, 'A'),
//     h('div', {}, 'B'),
//     h('div', {}, 'C'),
//     h('div', {}, [
//         h('div', {}, '啦啦'),
//         h('div', {}, '嘻嘻'),
//     ]),
// ]);

// const myVnode1 = h('section', {}, [
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'C' }, 'C'),
//     h('div', { key: 'D' }, 'D')
// ]);

// const myVnode2 = h('section', {}, [
//     h('div', { key: 'D' }, 'D'),
//     h('div', { key: 'C' }, 'C'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'A' }, 'A')
// ]);

// let myVnode1 = h('section', {}, [
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'C' }, 'C'),
//     h('div', { key: 'D' }, 'D')
// ]);
// let myVnode2 = h('section', {}, [
//     h('div', { key: 'D' }, 'D'),
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'C' }, 'C'),
//     h('div', { key: 'Q' }, 'Q'),
//     h('div', { key: 'B' }, 'B'),
// ]);

let container = document.getElementById('container');

let btn = document.getElementById('btn');

patch(container, myVnode1);

btn.onclick = function() {
    patch(myVnode1, myVnode2);
}