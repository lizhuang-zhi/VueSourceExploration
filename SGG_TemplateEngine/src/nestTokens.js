/* 
    折叠tokens，将#和/之间的tokens能够整合起来，作为它的下标为3的项
*/
export default function nestTokens(tokens) {
    // 结果数组
    var nestedTokens = [];
    // 栈结构，存放小tokens
    var sections = [];
    //  收集器
    var collector = nestedTokens;

    for(let i = 0; i < tokens.length; i++) {
        // 获取每一项token
        let token = tokens[i];

        switch(token[0]) {
            case '#':
                // 收集器中放入这个token
                collector.push(token);
                // 入栈
                sections.push(token);
                // 收集器换人。给token添加下标为2的项，并且让收集器指向它
                collector = token[2] = [];
                break;
            case '/':
                // 出栈
                sections.pop();
                // 改变收集器
                collector = sections.length > 0 ? sections[sections.length - 1][2] : nestedTokens;
                break;
            default:
                collector.push(token);
        }
    }

    // 最终要获取的tokens数组
    console.log(nestedTokens);
    return nestedTokens;
}