import Observer from "./Observer";

// 创建 observe 函数，注意函数的名字没有r
export default function (value) {
    if(typeof value != 'object') return ;
    // 定义ob
    let ob;
    if(typeof value.__ob__ !== 'undefined') {
        ob = value.__ob__;
    }else {
        ob = new Observer(value);
    }
    return ob; 
}