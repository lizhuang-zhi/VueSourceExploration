/* 
    扫描器类
*/
export default class Scanner {
    constructor(templateStr) {
        // 模版字符串
        this.templateStr = templateStr;
        // 指针
        this.pos = 0;
        // 尾巴，一开始就是整个模版字符串
        this.tail = templateStr;
    }

    // 功能弱，就是跳过指定内容，没有返回值
    scan(tag) {
        if(this.tail.indexOf(tag) == 0) {
            // tag有多长，比如 {{ 长度为2，就让指针后移多少位
            this.pos += tag.length;
            // 改变尾巴为：从当前指针这个字符开始，到最后的全部字符
            this.tail = this.templateStr.substring(this.pos);
        }
    }

    // 让指针进行扫描，直到遇见指定内容结束，并且能够返回结束之前路过的文字 
    scanUtil(stopTag) {
        // 记录执行本方法时的指针位置
        const pos_bakcup = this.pos;
        // 当尾巴的开头不是stopTag的时候，说明还没扫描到stopTag
        while(this.tail.indexOf(stopTag) != 0 && !this.eos()) {
            this.pos++;
            // 改变尾巴为：从当前指针这个字符开始，到最后的全部字符
            this.tail = this.templateStr.substring(this.pos);
        }
        return this.templateStr.substring(pos_bakcup, this.pos);
    }

    // 判断尾巴是否为空（也就是判断是否继续扫描）。end of string
    eos() {
        return this.tail === '';
    }
}