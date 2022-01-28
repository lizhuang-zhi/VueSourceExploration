import lookup from "./lookup";
import renderTemplate from "./renderTemplate";

/* 
    处理数组，结合 renderTemplate 实现递归

    第一个参数是 token ！！而不是 tokens
*/

export default function parseArray(token, data) {
    var v = lookup(data, token[1]);
    // 结果字符串
    var resultStr = '';
    // 遍历v数组，v一定是数组
    for(let i = 0; i < v.length; i++) {
        // 补充.的识别 
        resultStr += renderTemplate(token[2], {
            ...v[i],
            '.': v[i]
        });
    }
    
    return resultStr;
}