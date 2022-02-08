import patchVnode from "./patchVnode";
import createElement from "./createElement";

// 判断是否是同一个虚拟节点
function checkSameVnode(a, b) {
    return a.sel == b.sel && a.key == b.key;
}

export default function updateChildren(parentElm, oldCh, newCh) {
    console.log(oldCh);
    console.log(newCh);

    // 新前、新后
    let newStartIdx = 0;
    let newEndIdx = newCh.length - 1;
    // 旧前、旧后
    let oldStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    // 新前节点、新后节点(新前和新后节点指向的节点)
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    // 旧前节点、旧后节点(旧前和旧后节点指向的节点)
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];

    let keyMap = null;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        console.log(111);

        // 首先不是判断四种命中，而是要略过已经加undefined标记的东西
        if (oldStartVnode == null || oldCh[oldStartIdx] == undefined) {
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (oldEndVnode == null || oldCh[oldEndIdx] == undefined) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (newStartVnode == null || newCh[newStartIdx] == undefined) {
            newStartVnode = newCh[++newStartIdx];
        } else if (newEndVnode == null || newCh[newEndIdx] == undefined) {
            newEndVnode = newCh[--newEndIdx];
        } else if (checkSameVnode(newStartVnode, oldStartVnode)) { // 新前和旧前节点命中 
            // 对比两个节点
            patchVnode(oldStartVnode, newStartVnode);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (checkSameVnode(newEndVnode, oldEndVnode)) { // 新后和旧后命中
            patchVnode(oldEndVnode, newEndVnode);
            newEndVnode = newCh[--newEndIdx];
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (checkSameVnode(newEndVnode, oldStartVnode)) { // 新后和旧前命中
            patchVnode(oldStartVnode, newEndVnode);
            // 移动节点(插入)
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
            newEndVnode = newCh[--newEndIdx];
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (checkSameVnode(newStartVnode, oldEndVnode)) { // 新前和旧后命中
            patchVnode(oldEndVnode, newStartVnode);
            // 移动节点(插入)
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
            oldEndVnode = oldCh[--oldEndIdx];
        } else {
            // 都没找到(四种命中都没有命中)
            if (!keyMap) {
                keyMap = {};
                // 从oldStartIdx开始，到oldEndIdx结束，创建keyMap映射对象
                for (let i = oldStartIdx; i <= oldEndIdx; i++) {
                    const key = oldCh[i].key;
                    if (key != undefined) {
                        keyMap[key] = i;
                    }
                }
            }
            console.log(keyMap);
            // 寻找当前这项（newStartIdx）这项在keyMap中的映射的位置序号
            const idxInOld = keyMap[newStartVnode.key];
            console.log(idxInOld);
            if (idxInOld == undefined) {
                // 判断，如果idxInOld是undefined表示它是全新的项
                // 被加入的项（就是newStartVnode这项)现不是真正的DOM节点
                parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm);
            } else {
                // 如果不是undefined，不是全新的项，而是要移动
                const elmToMove = oldCh[idxInOld];
                patchVnode(elmToMove, newStartVnode);
                // 把这项设置为undefined，表示我处理完这项了
                oldCh[idxInOld] = undefined;
                // 移动，调用insertBefore也可以实现移动
                parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm);
            }
            // 指针下移，只移动新的头 
            newStartVnode = newCh[++newStartIdx];
        }
    }

    // 是否有剩余节点
    if (newStartIdx <= newEndIdx) { // 新节点中有剩余
        // let before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
        // 遍历新的newCh，添加到老的没有处理之前
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            // parentElm.insertBefore(createElement(newCh[i]), before);
            // 往老节点尾部插入
            parentElm.insertBefore(createElement(newCh[i]), oldCh[oldStartIdx].elm);
        }
    } else if (oldStartIdx <= oldEndIdx) { // 旧节点中有剩余
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            if (oldCh[i]) {
                parentElm.removeChild(oldCh[i].elm);
            }
        }
    }

}