// 把attrsSting变为数组返回
export default function (attrsSting) {
    if (attrsSting == undefined) return [];

    // 当前是否在引号内
    var isYinhao = false;
    // 断点
    var point = 0;
    // 结果数组
    var result = [];

    console.log(attrsSting);

    for (let i = 0; i < attrsSting.length; i++) {
        let char = attrsSting[i];
        if (char == '"') {
            isYinhao = !isYinhao;
        } else if (char == ' ' && !isYinhao) { // 遇到空格并且没在引号内
            if (!/^\s*$/.test(attrsSting.substring(point, i))) {
                result.push(attrsSting.substring(point, i).trim());
                point = i;
            }
        }
    }
    result.push(attrsSting.substring(point).trim());

    // 将["k=v", "k=v"]变为[{name: k, value: v}, {name: k, value: v}]
    result = result.map(item => {
        // 根据等号拆分
        const o = item.match(/^(.+)="(.+)"$/);
        return {
            name: o[1],
            value: o[2]
        }
    })

    return result;
}