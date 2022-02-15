import parseAttrsString from "./parseAttrsString";

export default function (templateString) {
    let index = 0;
    // 剩余部分
    var rest = '';
    // 开始标记(也要判断存在attrs时)
    let startRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/;
    // 结束标记
    let endRegExp = /^\<\/([a-z]+[1-6]?)\>/;
    // 文字标记
    let wordRegExp = /^([^\<]+)\<\/[a-z]+[1-6]?\>/;

    // 准备两个栈
    var stack1 = [];
    var stack2 = [{
        'children': []
    }];

    while (index < templateString.length - 1) {
        rest = templateString.substring(index);

        // 识别遍历到的这个字符，是不是一个开始标签
        if (startRegExp.test(rest)) {
            let tag = rest.match(startRegExp)[1];
            let attrsSting = rest.match(startRegExp)[2];
            console.log('检测到开始标记 ' + tag);
            // 将开始标记推入栈1中
            stack1.push(tag);
            // 将开始标记推入栈2中
            stack2.push({
                "tag": tag,
                "children": [],
                'attrs': parseAttrsString(attrsSting) 
            });
            // 得到attrs的字符串长度
            const attrsStringLength = attrsSting != null ? attrsSting.length : 0;
            index += tag.length + 2 + attrsStringLength;
        } else if (endRegExp.test(rest)) {
            let tag = rest.match(endRegExp)[1];
            let pop_tag = stack1.pop();
            // console.log('检测到结束的标记 ' + tag);
            if (tag == pop_tag) {
                let pop_arr = stack2.pop();
                if (stack2.length > 0) {
                    stack2[stack2.length - 1].children.push(pop_arr);
                }
            } else {
                throw new Error(stack1[stack1.length - 1] + '标签没有封闭！！');
            }
            index += tag.length + 3;
        } else if (wordRegExp.test(rest)) {
            // 识别遍历到的这个字符，是不是文字
            let word = rest.match(wordRegExp)[1];
            // console.log('检测到文字', word);
            if (!/^\s+$/.test(word)) {
                // 改变此时stack2栈顶元素中
                stack2[stack2.length - 1].children.push({
                    'text': word,
                    'type': 3
                });
            }
            index += word.length;
        } else {
            index++;
        }
    }
    return stack2[0].children[0];
}