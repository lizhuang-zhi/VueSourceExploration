import createElement from "./createElement";
import updateChildren from "./updateChildren";

// 对比同一个虚拟节点
export default function patchVnode(oldVnode, newVnode) {
    // 如果是新旧节点同一个对象
    if (oldVnode === newVnode) return;
    // 新vnode有text属性
    if (newVnode.text != undefined && (newVnode.children == undefined || newVnode.children.length == 0)) {
        // 新老vnode的text不相同
        if (oldVnode.text != newVnode.text) {
            oldVnode.elm.innerText = newVnode.text;
        }
    } else { // 新vnode没有text属性
        // 新老vnode都有children
        if (oldVnode.children != undefined && oldVnode.children.length > 0) {
            /* 
                四种命中查找！！
            */
            updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
        } else { // 老vnode没有children，新的有children
            oldVnode.elm.innerHTML = '';
            for (let i = 0; i < newVnode.children.length; i++) {
                let dom = createElement(newVnode.children[i]);
                oldVnode.elm.appendChild(dom);
            }
        }
    }
}