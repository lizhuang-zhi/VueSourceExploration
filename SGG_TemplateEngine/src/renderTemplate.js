import lookup from "./lookup";
import parseArray from "./parseArray";

/* 
    函数功能：让 tokens 数组变为 dom 字符串
*/
export default function renderTemplate(tokens, data) {
    // 结果字符串
    var resultStr = '';

    for (let i = 0; i < tokens.length; i++) {
        // token是每一项
        let token = tokens[i];

        // 如果是 text 类型，直接拼接
        if (token[0] == 'text') {
            resultStr += token[1];
        } else if (token[0] == 'name') {   
            /* 
                如果是 name 类型：
                    - 属性中有点(.)：需要递归返回对象洋葱属性
                    - 属性中没有点(.)：直接返回data[token[1]]
            */
            resultStr += lookup(data, token[1]);
        } else if (token[0] == '#') {  
            // 如果是 # ，说明又是一个数组，递归解析
            // 递归执行
            resultStr += parseArray(token, data);
        }
    }

    return resultStr;
}