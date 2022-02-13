import observe from "./observe";
import Dep from "./Dep";

/* 
    将其封装为函数
    @data 设置的对象
    @key 设置的属性
    @val 获取和设置的临时过渡值
*/
export default function defineReactive(data, key, val) {
    const dep = new Dep();

    console.log('侦听：' + key + ' 属性');
    if(arguments.length == 2) {
        val = data[key];
    }

    // 子元素进行 observe, 至此形成递归，但是是多个函数循环调用
    let childOb = observe(val);

    Object.defineProperty(data, key, {
        // 可枚举
        enumerable: true,
        // 可以被配置
        configurable: true,
        get() {
            console.log('访问属性：' + key);
            if(Dep.target) {
                dep.depend();
                if(childOb) {
                    childOb.dep.depend();
                }
            }
            return val;
        },
        set(newValue) {
            console.log('你试图改变 ' + key +' 属性', newValue);
            if(val === newValue) return ;
            val = newValue;
            // 设置的新值也需要侦听
            childOb = observe(newValue);
            // 发布订阅模式，通知dep
            dep.notify();
        }
    })
}