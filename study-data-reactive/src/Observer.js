import { def } from './utils';
import defineReactive from "./defineReactive";
import { arrayMethods } from './array';
import observe from './observe';
import Dep from './Dep';

/* 
    将一个正常的object转换为每个层级的属性
    都是响应式（可以被侦测的）的object
*/
export default class Observer {
    constructor(value) {
        // 每个Observer的实例身上，都有一个dep
        this.dep = new Dep();

        def(value, '__ob__', this, false);
        if(Array.isArray(value)) {
            // 如果是数组，将这个数组的原型，指向arrayMethods
            Object.setPrototypeOf(value, arrayMethods);
            // 让这个数组变的 observe
            this.observeArray(value);
        }else {
            // 调用walk
            this.walk(value);
        }
    }
    // 遍历 value 对象，将其每一个属性添加侦听
    walk(value) {
        for(let key in value) {
            defineReactive(value, key);
        }
    }
    // 数组的特殊遍历
    observeArray(arr) {
        for(let i = 0, len = arr.length; i < len; i++) {
            // 逐项进行observe
            observe(arr[i]);
        }
    }
}