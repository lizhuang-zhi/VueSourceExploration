function Observer(data) {
    this.data = data;
    this.walk(data);
}
Observer.prototype = {
    walk(data) {
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key]);
        })
    }, 
    // 为属性添加监听
    defineReactive(obj, key, val) {
        // 创建Dep对象
        let dep = new Dep();
        // 遍历深层次的引用属性
        observe(val);
        Object.defineProperty(obj, key, {
            get() {
                // 添加依赖
                if(Dep.target) {  // Dep.target缓存了当前订阅者
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set(newVal) {
                if(newVal == val) return ;
                val = newVal;
                // 通知订阅者更新数据
                dep.notify();
            }
        })
    }
}

function observe(value) {
    if(value == null || typeof value !== 'object') {
        return ;
    }
    return new Observer(value);
}

function Dep() {
    // 收集订阅者
    this.subs = [];
}
Dep.prototype = {
    // 添加订阅者
    addSub(target) {
        this.subs.push(target);
    },
    // 通知所有的订阅者进行数据更新
    notify() {
        // 遍历所有的订阅者
        this.subs.forEach(sub => {
            // 通知每一个订阅者执行数据更新
            sub.update();
        })
    }
}

// 声明一个全局的target,用于缓存当前的订阅者
Dep.target = null;

exports.observe = observe;
exports.Dep = Dep;