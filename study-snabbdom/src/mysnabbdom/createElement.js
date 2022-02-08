// 真正创建节点，将vnode创建为DOM，孤儿节点，不进行插入
export default function createElement(vnode) {
    // 创建一个DOM节点，现在还是孤儿节点
    let domNode = document.createElement(vnode.sel);
    // 有子节点还是有文本？
    if (vnode.text != '' && (vnode.children == undefined || vnode.children.length == 0)) {
        // 内部是文字
        domNode.innerText = vnode.text;
    } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
        // 它内部是子节点，就要递归创建节点
        for (let i = 0; i < vnode.children.length; i++) {
            let ch = vnode.children[i];
            let chDOM = createElement(ch);
            domNode.appendChild(chDOM);
        }
    }
    // 补充elm属性
    vnode.elm = domNode;
    // 返回elm，elm属性是一个纯DOM对象
    return vnode.elm;
}

