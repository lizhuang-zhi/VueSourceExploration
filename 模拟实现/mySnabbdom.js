/* 
    练习书写 snabbdom 源码
    涉及内容：虚拟DOM、h函数、patch函数
    ********************************************************************
    *********************** 更多图片查看 ProcessOn ***********************
    *** https://www.processon.com/diagraming/6169645563768921fa246af3 **
    ********************************************************************
*/
let container = document.getElementById('container');

// 创建虚拟节点
// let myVnode1 = h('section', {}, [
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'B' }, 'B'),
//     h('div', { key: 'C' }, 'C'),
//     h('div', { key: 'D' }, 'D')
// ]);
// let myVnode2 = h('section', {}, [
//     h('div', { key: 'D' }, 'D'),
//     h('div', { key: 'A' }, 'A'),
//     h('div', { key: 'C' }, 'C'),
//     h('div', { key: 'Q' }, 'Q'),
//     h('div', { key: 'B' }, 'B'),
// ]);

/* 
    有key和无key的对比
*/
let myVnode1 = h('section', {}, [
    h('div', { key: 'A' }, 'A'),
    h('div', { key: 'B' }, 'B'),
    h('div', { key: 'C' }, 'C'),
    h('div', { key: 'D' }, 'D')
]);
let myVnode2 = h('section', {}, [
    h('div', { key: 'F' }, 'F'),
    h('div', { key: 'A' }, 'A'),
    h('div', { key: 'B' }, 'B'),
    h('div', { key: 'C' }, 'C'),
    h('div', { key: 'D' }, 'D')
]);

// // 这个例子会报错（阉割版）
// const myVnode1 = h('section', {}, [
//     h('div', { }, 'A'),
//     h('div', { }, 'B'),
//     h('div', { }, 'C'),
//     h('div', { }, 'D')
// ]);
// const myVnode2 = h('section', {}, [
//     h('div', { }, 'F'),
//     h('div', { }, 'A'),
//     h('div', { }, 'B'),
//     h('div', { }, 'C'),
//     h('div', { }, 'D')
// ]);

// 置换节点
patch(container, myVnode1);

let btn = document.querySelector('#btn');

btn.addEventListener('click', function() {
    // 置换节点
    patch(myVnode1, myVnode2);
})

/* 
    h函数
    调用形式必须是以下一种(包含三个参数)
        - h('div', {}, '文字')
        - h('div', {}, [
            h('div', {}, '内容1'),
            h('div', {}, '内容2'),
            h('div', {}, '内容3')
        ])
        - h('div', {}, h()) 
*/
function h(sel, data, c) {
    if (arguments.length != 3) {
        throw new Error('对不起，传入h函数的参数必须是3个！！')
    }
    // 通过判断c的类型
    if (typeof c == 'string' || typeof c == 'number') {
        return vnode(sel, data, undefined, c, undefined);
    } else if (Array.isArray(c)) {
        let children = [];
        for (let i = 0; i < c.length; i++) {
            if (!(c[i].hasOwnProperty('sel') && typeof c[i] == 'object')) {
                throw new Error('数组元素的参数类型错误或参数不是对象！！')
            }
            children.push(c[i]);
        }
        return vnode(sel, data, children, undefined, undefined);
    } else if (typeof c == 'object' && c.hasOwnProperty('sel')) {
        return vnode(sel, data, [c], undefined, undefined);
    } else {
        throw new Error('传入的参数类型错误');
    }

}

/* 虚拟节点 */
function vnode(sel, data, children, text, elm) {
    const key = data.key;
    return {
        sel,
        data,
        children,
        text,
        elm,
        key
    };
}

/* patch函数 */
function patch(oldVnode, newVnode) {
    // oldVnode是dom节点
    if (oldVnode.sel == '' || oldVnode.sel == undefined) {
        oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode);
    }

    // 是同一个虚拟节点
    if (checkSameVnode(oldVnode, newVnode)) {
        // 精细化比较
        patchVnode(oldVnode, newVnode);
    } else { // 不是同一个虚拟节点
        /* 
        暴力插入新的，删除旧的   
        */
        // 将newVnode转化为对应的DOM节点
        let newVnodeElm = createElement(newVnode);
        // 当老节点的父元素节点存在 && 新建 newVnodeElm 存在
        if (newVnodeElm && oldVnode.elm.parentNode) {
            oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm);
        }
        // 删除老节点
        oldVnode.elm.parentNode.removeChild(oldVnode.elm);
    }
}

/* 
    createElement函数
    功能：将虚拟节点转化为DOM节点（孤儿DOM节点，不上树）    
*/
function createElement(vnode) {
    // 创建一个孤儿的DOM节点
    let domNode = document.createElement(vnode.sel);
    // 如果虚拟节点只是包含文字
    if (vnode.text != '' && vnode.children == undefined) {
        // 给孤儿DOM节点设置文字
        domNode.innerText = vnode.text;
    } else if (Array.isArray(vnode.children) && vnode.children.length > 0) { // 如果虚拟节点中有子节点(有children)
        for (let i = 0; i < vnode.children.length; i++) {
            // 将每个元素（）都进行递归，返回一个DOM节点
            let dom = createElement(vnode.children[i]);
            // 将上面的DOM节点添加到总的DOM节点上
            domNode.appendChild(dom);
        }
    }
    // 设置虚拟节点对应的DOM节点
    vnode.elm = domNode;
    // 返回这个DOM节点
    return domNode;
}

/* 
    精细化比较(对比同一个虚拟节点)
*/
function patchVnode(oldVnode, newVnode) {
    // 如果是新旧节点同一个对象
    if (oldVnode === newVnode) return;

    // 新vnode有text
    if (newVnode.text != undefined && oldVnode.children == undefined) {
        // 新老vnode的text不相同
        if (oldVnode.text !== newVnode.text) {
            // 更新oldVnode节点对应DOM节点的innerText
            oldVnode.elm.innerText = newVnode.text;
        }
    } else { // 新vnode有children
        // 新老vnode都有children
        if (oldVnode.children != undefined && oldVnode.children.length > 0) {
            /* 
                四种命中查找！！
            */
           updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
        } else { // 老vnode没有children，新vnode有children
            // 先清空老vnode
            oldVnode.elm.innerText = '';
            // 然后往原来的地方添加新vnode的children
            for (let i = 0; i < newVnode.children.length; i++) {
                let dom = createElement(newVnode.children[i]);
                oldVnode.elm.appendChild(dom);
            }
        }
    }
}

/* 
    四种命中判断
*/
function updateChildren(parentElm, oldCh, newCh) {
    console.log(oldCh);
    console.log(newCh);

    // 新前、新后指针
    let newStartIdx = 0;
    let newEndIdx = newCh.length - 1;
    // 旧前、旧后指针
    let oldStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;

    // 新前、新后指针对应的虚拟节点
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];

    // 旧前、旧后指针对应的虚拟节点
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];

    // 集合存储
    let keyMap = null;

    while(newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {

        if(oldStartVnode == null) {
            oldStartVnode = oldCh[++oldStartIdx];
        }else if(oldEndVnode == null) {
            oldEndVnode == oldCh[--oldEndIdx];
        }else if(newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }else if(newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }else if(checkSameVnode(newStartVnode, oldStartVnode)) {  // 新前和旧前命中
            patchVnode(oldStartVnode, newStartVnode);
            newStartVnode = newCh[++newStartIdx];
            oldStartVnode = oldCh[++oldStartIdx];
        }else if(checkSameVnode(newEndVnode, oldEndVnode)) {   // 新后和旧后命中
            patchVnode(oldEndVnode, newEndVnode);
            newEndVnode = newCh[--newEndIdx];
            oldEndVnode = oldCh[--oldEndIdx];
        }else if(checkSameVnode(newEndVnode, oldStartVnode)) {  // 新后和旧前命中
            patchVnode(oldStartVnode, newEndVnode);
            // 移动节点（插入）
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
            newEndVnode = newCh[--newEndIdx];
            // 将当前的旧前节点设为undefined
            oldCh[oldStartIdx] = undefined;
            oldStartVnode = oldCh[++oldStartIdx];
        }else if(checkSameVnode(newStartVnode, oldEndVnode)) {  // 新前和旧后命中
            patchVnode(oldEndVnode, newStartVnode);
            // 移动节点（插入）
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
            // 将当前的旧后节点设为undefined
            oldCh[oldEndIdx] = undefined;
            oldEndVnode = oldCh[--oldEndIdx];
        }else {
            // 四种命中都没有命中
            if(!keyMap) {
                keyMap = {};
                for(let i = oldStartIdx; i <= oldEndIdx; i++) {
                    // 存储old中所有未处理的节点
                    const key = oldCh[i].key;
                    if(key != undefined) {
                        keyMap[key] = i;
                    }
                }
            }
            // 新前节点在keyMap中的index
            idxInOld = keyMap[newStartVnode.key];
            if(idxInOld == undefined) {  // 当新前节点是全新的项
                // 插入到旧前之前
                parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm);
            }else {   // 当新前节点不是全新的项
                // 通过index找到新前节点在oldChildren中对应的虚拟节点
                let elmToMove = oldCh[idxInOld];
                // 对比更新（新前和oldChildren中对应的节点）
                patchVnode(elmToMove, newStartVnode);
                // 处理当前节点
                oldCh[idxInOld] = undefined;
                parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm);
            }
            // 新前指针下移
            newStartVnode = newCh[++newStartIdx];
        }
    }

    if(newStartIdx <= newEndIdx) {  // 新节点有剩余
        /* 
            因为是阉割版，所以存在一些问题（尽量将key带上）
        */
        let before = oldCh[oldStartIdx] == undefined ? null : oldCh[oldStartIdx].elm;
        for(let i = newStartIdx; i <= newEndIdx; i++) {
            parentElm.insertBefore(createElement(newCh[i]), before);
        }
    }else if(oldStartIdx <= oldEndIdx) {   // 老节点有剩余
        for(let i = oldStartIdx; i <= oldEndIdx; i++) {
            if(oldCh[i]) {
                parentElm.removeChild(oldCh[i].elm);
            }
        }
    }

}

/* 判断是否是同一个虚拟节点 */
function checkSameVnode(a, b) {
    return a.sel == b.sel && a.key == b.key;
}