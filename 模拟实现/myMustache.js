/* 
    手写Mustache机理
*/
var templateStr = `
    <ul>
        {{#arr}}
            <li class='box'>
                {{name}}的爱好是：
                <ol>
                    {{#hobbies}}
                        <li>{{.}}</li>
                    {{/hobbies}}
                </ol>
            </li>
        {{/arr}}
    <ul>
`;
var data = {
    arr: [{
            name: 'kang',
            hobbies: ['代码', '学习']
        },
        {
            name: 'lei',
            hobbies: ['电影', '代码']
        },
        {
            name: 'li',
            hobbies: ['跳舞', '健身', '篮球']
        },
    ]
};

var myMustache = {
    render(templateStr, data) {
        // 1. 编译：模版字符串 => tokens数组
        let tokens = templateStrToTokens(templateStr);

        // 2. 解析：tokens数组 + data数据 => dom字符串
        let domStr = parseTokensToDomStr(tokens, data);

        return domStr;
    }
}

/* *********************************  1.编译  ********************************** */

/* 
    将模版字符串转化为(一级)tokens数组
*/
function templateStrToTokens(templateStr) {
    // 一级结果数组
    let tokens = [];

    let scanner = new Scanner(templateStr);
    let word = '';
    // 尾巴不为空就循环
    while(!scanner.eos()) {
        word = scanner.scanUtil('{{');
        if(word != '') {
            tokens.push(['text', word]);
        }
        scanner.scan('{{');

        word = scanner.scanUtil('}}');
        if(word != '') {
            if(word[0] == '#') {
                tokens.push(['#', word.substring(1)]);
            }else if(word[0] == '/') {
                tokens.push(['/', word.substring(1)]);
            }else {
                tokens.push(['name', word]);
            }
        }
        scanner.scan('}}');
    }
    // 再调用 nestedTokens 函数
    return nestedTokens(tokens);
}

/* 
    将tokens数组从(一级)转为嵌套tokens数组
*/
function nestedTokens(tokens) {
    // 返回的数组结果
    let nestedTokensArr = [];
    // 收集器（改变指向的结果集）
    let collector = nestedTokensArr;
    // 栈（用于存储每一层的数组）
    let sections = [];

    for(let i = 0; i < tokens.length; i++) {
        // 获取每一项token
        let token = tokens[i];

        switch(token[0]) {
            case '#':
                collector.push(token);
                sections.push(token);
                token[2] = [];
                // 改变collector指向（往洋葱内部走）
                collector = token[2];
                break;
            case '/':
                // 弹出 # 时入的栈顶元素
                sections.pop();
                // 改变collector指向（往洋葱外部走）
                collector = sections.length > 0 ? sections[sections.length - 1][2] : nestedTokensArr;
                break;
            default:
                collector.push(token);
        }
    }

    return nestedTokensArr;
}

/* 
    声明一个扫描类，用于扫描整个模版字符串
*/
class Scanner {
    constructor(templateStr) {
        this.templateStr = templateStr;
        this.pos = 0;
        this.tail = templateStr;
    }

    // 跳过tag标记
    scan(tag) {
        if(this.tail.indexOf(tag) == 0) {
            this.pos += tag.length; 
            this.tail = this.templateStr.substring(this.pos);
        }
    }

    // 扫描到停止标记处，然后记录之前的文字
    scanUtil(stopTag) {
        // 记录开始的指针位置
        let startPoint = this.pos;
        while(!this.eos() && this.tail.indexOf(stopTag) != 0) {
            // 指针后移
            this.pos++;
            // 更新尾巴
            this.tail = this.templateStr.substring(this.pos);
        }
        return this.templateStr.substring(startPoint, this.pos);
    }

    // 判断尾巴是否为空
    eos() {
        return this.tail == '';
    }
}

/* *********************************  2.解析  ********************************** */

/* 
    将tokens数组 + data数据 => domStr
*/
function parseTokensToDomStr(tokens, data) {
    // 返回字符串
    let domStr = '';

    for(let i = 0; i < tokens.length; i++) {
        // 获取每一项token元素
        let token = tokens[i];

        if(token[0] == 'text') {
            domStr += token[1];
        }else if(token[0] == 'name') {
            // 调用 lookup 是为了避免data中的属性存在 a.b.c 这样的情况
            domStr += lookup(data, token[1]);
        }else if(token[0] == '#'){
            // 碰到 '#', 递归执行
            domStr += parseArray(token, data);
        }
    }

    return domStr;
}

/* 
    递归执行 parseTokensToDomStr 函数中碰到的 # 数组
*/
function parseArray(token, data) {
    // 获取data中属性数据
    let arr = lookup(data, token[1]);
    // 结果字符串
    let resultStr = '';
    for(let i = 0; i < arr.length; i++) {
        resultStr += parseTokensToDomStr(token[2], {
            ...arr[i],
            // 补充直接碰到点的情况
            '.': arr[i]
        });
    }

    return resultStr;
}

/* 
    解决当碰到的 'name' 中存在 a.b.c 这样data数据
*/
function lookup(dataObj, keyName) {
    // 如果keyName中存在. 并且 keyName 不能就直接是一个'.'
    if(keyName.indexOf('.') != -1 && keyName != '.') {
        let arr = keyName.split('.');
        return innerLookup(dataObj, arr, 0);
    }

    // 递归转化为最后的属性值
    function innerLookup(obj, array, index) {
        if(index >= array.length) return ;
        let nextObj = obj[array[index++]];
        return typeof nextObj == 'object' ? innerLookup(nextObj, array, index) : nextObj;
    }

    return dataObj[keyName];
}

// 调用myMustache的render方法进行渲染
var domStr = myMustache.render(templateStr, data);
console.log(domStr);