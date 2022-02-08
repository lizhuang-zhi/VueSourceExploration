import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";

let container = document.getElementById('container');
let btn = document.getElementById('btn');

// 创建patch函数
var patch = init([classModule, propsModule, styleModule, eventListenersModule]);

let vnode1 = h('ul', {}, [
    h('li', {key: 'A'}, 'A'),
    h('li', {key: 'B'}, 'B'),
    h('li', {key: 'C'}, 'C'),
]);

patch(container, vnode1);

let vnode2 = h('ul', {}, [
    h('li', {}, 'A'),
    h('li', {}, 'B'),
    h('li', {}, 'C'),
    h('li', {}, 'D'),
    h('li', {}, 'E'),
]);

// 点击按钮，将vnode1变为vnode2
btn.onclick = function() {
    patch(vnode1, vnode2);
}
