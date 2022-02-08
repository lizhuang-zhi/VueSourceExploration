import vnode from "./vnode";
import createElement from "./createElement";
import patchVnode from "./patchVnode";

export default function(oldVnode, newVnode) {
    // 判断传入的第一个参数，是DOM节点还是虚拟节点
    if(oldVnode.sel == '' || oldVnode.sel == undefined) {
        // 将DOM节点包装为虚拟节点
        oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode);
    }

    // 判断oldVnode和newVnode是否为同一个节点
    if(oldVnode.sel === newVnode.sel && oldVnode.key === newVnode.key) {
        // 精细化比较
        patchVnode(oldVnode, newVnode);
    }else {
        // 暴力插入新节点，删除旧的
        let newVnodeElm = createElement(newVnode);
        // 插入到老节点之前
        if(oldVnode.elm.parentNode && newVnodeElm) {
            oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm);
        }
        // 删除老节点
        oldVnode.elm.parentNode.removeChild(oldVnode.elm);
    }
}
