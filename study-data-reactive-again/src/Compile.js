var {Watcher} = require('./Watcher')

function Compile(el, vm) {
    // vm 存储 MVVM 的实例对象
    this.vm = vm;
    this.el = document.querySelector(el);
    // 创建一个空白文档片段
    this.fragment = null;
    // 执行初始化函数
    this.init();
}

Compile.prototype = {
    init: function () {
        // ** 这里的 this 是 Compile 的实例对象 **
        // 存在dom引用
        if (this.el) {
            // 将 this.el 中节点添加到 fragment 中
            this.fragment = this.nodeToFragment(this.el);
            // 将 fragment 中子节点进行解析
            this.compileElement(this.fragment);
            // 将 fragment 添加到 this.el 
            this.el.appendChild(this.fragment);
        } else {
            console.log('DOM 根节点元素不存在');
        }
    },
    // 将el父节点中的子节点都添加到 this.fragment
    nodeToFragment: function (el) {
        // 创建空白文档片段
        let fragment = document.createDocumentFragment();
        // 获取原 el 父节点下的子节点
        let child = el.firstChild;
        while (child) {
            // 将Dom元素添加fragment中
            /* 
                注意这里的 appendChild 方法
                    - 他会首先从原父节点DOM中删除对应child节点,然后再将其插入fragment中
                
                Node.appendChild MDN: 如果某个节点已经拥有父节点，在被传递给此方法后，
                                      它首先会被移除，再被插入到新的位置
            */
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    },
    // 将 fragment 中子节点进行解析
    compileElement: function (el) {
        var childNodes = el.childNodes;
        // this 指 Compile 的实例对象
        var self = this;
        [].slice.call(childNodes).forEach(function (node) {
            var reg = /\{\{(.*)\}\}/;
            var text = node.textContent;

            if (self.isElementNode(node)) { // 如果是元素节点
                /* 
                    第一步. compile(): 解析节点中属性的指令, 例如 v-on、v-model 指令
                    第二步. 分情况:
                            1) v-on: 指令
                            compileEvent(): 在 methods 中找到在上一步解析出的指令所对应的值, 
                                            然后为该节点绑定在 methods 中的对应方法
                            2) v-model 指令
                            compileModel(): 将从 v-model 指令解析出的属性添加到 Dep 订阅器中,
                                            实现 data -> view 的绑定; 然后为节点添加事件,
                                            实现 view -> data 的绑定, 从而解释 v-model 的底层原理
                */
                self.compile(node);
            } else if (self.isTextNode(node) && reg.test(text)) { // 如果是文本节点并且匹配{{}} => 就是匹配 {{name}} 这样的语法
                // reg.exec(text)[1]: 获取 {{title}} 中的 'title'
                // 添加订阅者, 实现对 {{}} 内容的数据更新
                self.compileText(node, reg.exec(text)[1]);
            }
            // 如果当前节点下还有子节点,则进行递归操作,保证深度子节点也会被解析
            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        });
    },
    // 解析节点中属性的指令, 例如 v-on、v-model 指令
    compile: function (node) {
        var nodeAttrs = node.attributes;
        var self = this;
        // 遍历节点属性
        Array.prototype.forEach.call(nodeAttrs, function (attr) {
            var attrName = attr.name;
            if (self.isDirective(attrName)) {
                // 获取事件名 => 例如 v-on:click="clickTap" 中的 clickTap
                var exp = attr.value;
                var dir = attrName.substring(2);
                // 如果是事件指令 'on:'
                if (self.isEventDirective(dir)) { // v-on 事件指令
                    self.compileEvent(node, self.vm, exp, dir);
                } else { // v-model 指令
                    self.compileModel(node, self.vm, exp, dir);
                }
                node.removeAttribute(attrName);
            }
        })
    },
    // 为文本节点中的 {{title}} 添加订阅者, 
    // 保证后续当data中数据改变后, 通知修改对应视图显示
    compileText: function (node, exp) {
        var self = this;
        var initText = self.vm[exp];
        self.updateText(node, initText); // 初始化文本节点内容

        // 将这个指令初始化为一个订阅者，后续 exp 改变时，
        // 就会触发这个更新回调，从而更新视图
        new Watcher(self.vm, exp, function (value) {
            self.updateText(node, value);
        })
    },
    // 为节点绑定在 methods 中的对应方法
    compileEvent: function (node, vm, exp, dir) {
        // 获取事件类型
        let eventType = dir.split(':')[1];
        // 在 methods 中找到对应方法
        var cb = vm.methods && vm.methods[exp];
        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
        }
    },
    // 解析处理节点属性中 v-model 指令
    compileModel: function (node, vm, exp, dir) {
        var self = this;
        // 获取vm实例(MVVM实例)上的exp值,也就是这里的title属性
        // (这里是因为 mvvm.js 中将vm实例中的data方法里的属性代理了一层到vm实例上)
        var val = self.vm[exp];
        // 更新节点的value(初始化更新)
        self.modelUpdater(node, val);
        /* 
            这里就是解释了: v-model的底层原理
            1. view --改变--> data: 给节点添加监听事件(例如input监听事件)
            2. data --改变--> view: 将vm.data中的属性(watcher)添加到Dep中,
                                    当属性被修改,则触发属性对应的getter, 
                                    <dep.notify()>通知所有的订阅者进行
                                    数据更新(执行更新函数)
        */
        // 添加订阅者, 并实现更新函数
        new Watcher(self.vm, exp, function (value) {
            self.modelUpdater(node, value);
        })

        // 这里就是实现: view --改变--> data 的事件监听
        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            if (val == newValue) return;
            self.vm[exp] = newValue;
            val = newValue;
        })
    },
    // 是否是元素节点,例如 <p>、<div>
    isElementNode: function (node) {
        return node.nodeType == 1;
    },
    isDirective: function (attr) {
        return attr.indexOf('v-') == 0;
    },
    isEventDirective: function (dir) {
        return dir.indexOf('on:') === 0;
    },
    modelUpdater: function (node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    },
    updateText: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    // 是否是文本节点
    isTextNode: function (node) {
        return node.nodeType == 3;
    }
}

module.exports = Compile;