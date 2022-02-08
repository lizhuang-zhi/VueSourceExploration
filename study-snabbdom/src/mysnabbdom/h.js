import vnode from "./vnode";

/* 
    调用形式必须是以下一种(包含三个参数)
        - h('div', {}, '文字')
        - h('div', {}, [
            h('div', {}, '内容1'),
            h('div', {}, '内容2'),
            h('div', {}, '内容3')
        ])
        - h('div', {}, h()) 
*/
export default function(sel, data, c) {
    // 检查参数个数
    if(arguments.length != 3) {
        throw new Error('对不起，参数必须传入3个！')
    }

    // 检查c的类型
    if(typeof c == 'string' || typeof c == 'number') {
        return vnode(sel, data, undefined, c, undefined);
    }else if(Array.isArray(c)) {
        // 收集子对象
        let children = [];
        for(let i = 0; i < c.length; i++) {
            // 每个元素必须是对象（因为h函数返回的vnode节点是对象），并且必须有sel属性，否则就抛出异常
            if(!(c[i].hasOwnProperty('sel') && typeof c[i] === 'object')) {
                throw new Error('数组元素的参数类型错误或参数不是对象');
            }
            children.push(c[i]);
        }
        return vnode(sel, data, children, undefined, undefined); 
    }else if(typeof c == 'object' && c.hasOwnProperty('sel')) {
        let children = [c];
        return vnode(sel, data, children, undefined, undefined);
    }else {
        throw new Error('传入的参数类型错误')
    }

}