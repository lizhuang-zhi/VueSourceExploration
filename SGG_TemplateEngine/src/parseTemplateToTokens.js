import Scanner from './Scanner';
import nestTokens from './nestTokens';

/* 
    将模版字符串变为tokens数组
        - parseTemplateToTokens：这个函数是将模版字符串变为没有潜逃的tokens
        - nestTokens：将上面的tokens折叠嵌套为最终的嵌套tokens
*/
export default function parseTemplateToTokens(templateStr) {
    var tokens = [];

    // 创建扫描器
    var scanner = new Scanner(templateStr);
    var words;
    while (!scanner.eos()) {
        // 收集开始标记之前的文字
        words = scanner.scanUtil('{{');
        // 存入tokens数组
        if(words != "") {
            // 不能去掉标签<>里的空格
            let isInJJH = false;
            // 空白字符串
            var _words = '';
            for(let i = 0; i < words.length; i++) {
                // 先判断是否在尖叫号标签里
                if(words[i] == '<') {
                    isInJJH = true;
                }else if(words[i] == '>'){
                    isInJJH = false;
                }

                // 如果不是空格，直接拼接
                if(!/\s/.test(words[i])) {
                    _words += words[i];
                }else {   // 如果是空格 
                    // 并且在标签里，就拼接一个空格
                    if(isInJJH) {
                        _words += ' ';
                    }
                }
            }
            tokens.push(['text', _words]);
        }
        // 跳过标记
        scanner.scan('{{');

        // 收集开始标记之前的文字
        words = scanner.scanUtil('}}');
        // 存入tokens数组
        if (words != '') {
            if (words[0] == '#') {
                // 从下标为1开始存，因为下标为0是#
                tokens.push(['#', words.substring(1)]);
            } else if (words[0] == '/') {
                // 从下标为1开始存，因为下标为0是/
                tokens.push(['/', words.substring(1)]);
            } else {
                tokens.push(['name', words]);
            }
        }
        // 跳过标记
        scanner.scan('}}');
    }
    
    return nestTokens(tokens);
}