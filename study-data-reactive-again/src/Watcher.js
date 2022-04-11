const { Dep } = require('./Observer')

function Watcher(vm, exp, cb) {
    this.vm = vm;   // 一个 Vue 的实例对象
    this.exp = exp;   // 是 node 节点的 v-model 等指令的属性值 或者插值符号中的属性。如 v-model="name"，exp 就是name;
    this.cb = cb;    // 是 Watcher 绑定的更新函数;

    // 将自己添加到Dep订阅器中
    this.value = this.get();
}

Watcher.prototype = {
    // 执行数据更新操作
    update() {
        this.run();
    },
    run() {
        let newVal = this.vm.data[this.exp];
        let oldVal = this.value;
        // 对比之前和现在的数据值
        if(newVal !== oldVal) {
            // 更新值
            this.value = newVal;
            // 执行更新函数
            this.cb.call(this.vm, newVal, oldVal);
        }
    },
    get() {
        Dep.target = this;
        let value = this.vm.data[this.exp]; // 执行getter, 添加当前watcher到dep中
        Dep.target = null;  // 释放掉全局唯一变量,供下一个watcher进行操作
        return value;
    }
}
exports.Watcher = Watcher;