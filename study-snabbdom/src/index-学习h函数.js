import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";

// 创建patch函数
var patch = init([classModule, propsModule, styleModule, eventListenersModule]);

// 创建虚拟节点
var myVnode1 = h('a', {
    props: {
        href: 'http://www.baidu.com',
        target: '_blank'
    }
}, '百度链接');

var myVnode2 = h('div', {
    class: {
        'box': true
    }
}, '我是一个盒子');

var myVnode3 = h('ul', [
    h('li', { } ,'苹果'),
    h('li', '西瓜'),
    h('li', [
        h('div', [
            h('p', '哈哈'),
            h('p', '嘿嘿')
        ])
    ]),
    h('li', h('p', '皮卡丘')),
])

// 使用 patch 函数，让虚拟节点上树
const container = document.getElementById('container');
// patch(container, myVnode1);
// patch(container, myVnode2);
patch(container, myVnode3);