const {observe} = require('./Observer');
const Compile = require('./Compile');

function MVVM(options) {
    var self = this;
    this.data = options.data;
    this.methods = options.methods;

    Object.keys(this.data).forEach(key => {
        self.proxyKeys(key);
    })

    observe(this.data);

    /* 
        解析、初始化节点(解析节点中的 {{}}、v-on:、v-model)
    */
    // 这里的 this 就是 MVVM 的实例对象(包含data属性和method)
    new Compile(options.el, this);
    // 所有事情处理好后执行mounted函数
    options.mounted.call(this);
}

MVVM.prototype = {
    proxyKeys(key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get() {
                return self["data"][key];
            },
            set(newVal) {
                self["data"][key] = newVal;
            }
        })
    }
}

module.exports = MVVM;