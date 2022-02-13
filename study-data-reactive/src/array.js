import {
    def
} from "./utils";

// 得到 Array.prototype
const arrayPrototype = Array.prototype;

// 创建一个原型对象为 arrayPrototype 的对象
export let arrayMethods = Object.create(arrayPrototype);

// 需要被改写的数组方法
const methodsNeedChange = ['push', 'pop', 'shift',
    'unshift', 'splice', 'sort', 'reverse'
];

methodsNeedChange.forEach(item => {
    // 备份原来的方法
    const originalMethod = arrayPrototype[item];
    def(arrayMethods, item, function () {
        // 真正执行数组中的方法的地方
        const result = originalMethod.apply(this, arguments);
        // 获取__ob__属性
        const ob = this.__ob__;

        // 有三种方法 push\unshift\splice 能够插入新项，
        // 现在要把插入的新项也要变为 observe 的
        let inserted = [];

        switch (item) {
            case 'push':
            case 'unshift':
                inserted = arguments;
                break;
            case 'splice':
                inserted = [...arguments].slice(2);
                // inserted = Array.from(arguments).slice(2);
                // inserted = Array.prototype.slice.call(arguments, 2);
                break;
        }

        // 判断有没有插入的新项，让新项也变为响应的
        if (inserted) {
            ob.observeArray(inserted);
        }

        return result;
    }, false)
})