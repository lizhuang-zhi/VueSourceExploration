import Dep from "./Dep";

var uid = 0;
export default class Watcher {
    constructor(target, expression, callback) {
        this.id = uid++;
        this.target = target;
        this.getter = parsePath(expression);
        this.callback = callback;
        this.value = this.get();
    }
    update() {
        this.run();
    }
    get() {
        // 进入依赖收集的阶段
        // 让全局的Dep.target设置为Wathcher本身，那么就是进入依赖阶段
        Dep.target = this;
        const obj = this.target;
        var value;
        // 只要能找到，就一直找
        try {
            value = this.getter(obj);
        } finally {
            Dep.target = null;
        }
        return value;
    }
    run() {
        this.getAndInvoke(this.callback);
    }
    getAndInvoke(cb) {
        const value = this.get();

        if(value !== this.value || typeof value == 'object') {
            const oldValue = this.value;
            this.value = value;
            cb.call(this.target, value, oldValue);
        }
    }
}

function parsePath(str) {
    let arr = str.split('.');

    return (obj) => {
        for(let i = 0; i < arr.length; i++) {
            if(!obj) return ;
            obj = obj[arr[i]];
        }
        return obj;
    }
}