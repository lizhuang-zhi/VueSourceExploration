/* 
    功能是可以在dataObj对象中，寻找用连续点符号的keyName属性
    比如，dataObj是
        {
            a: {
                b: {
                    c: 100
                }
            }
        }

    那么lookup(dataObj, 'a.b.c')结果就是100
*/
export default function lookup(dataObj, keyName) {
    // 如果keyName中存在.
    if (keyName.indexOf('.') != -1 && keyName != '.') {
        let arr = keyName.split('.');
        let res = parseObj(dataObj, arr, 0);
        return res;
    }
    // 如果keyName中不存在.
    return dataObj[keyName];
}

// 递归解析洋葱对象
function parseObj(obj, array, index) {
    if (index >= array.length) return;
    let nextObj = obj[array[index++]];
    return typeof nextObj == 'object' ? parseObj(nextObj, array, index) : nextObj;
}