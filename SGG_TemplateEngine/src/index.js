import parseTemplateToTokens from './parseTemplateToTokens';
import renderTemplate from './renderTemplate';


// 全局提供 SSG_TemplateEngine 对象
window.SSG_TemplateEngine = {
    // 渲染方法
    render(templateStr, data) {
        // 调用 parseTemplateToTokens 函数，让模版字符串能够变为 tokens 数组
        var tokens = parseTemplateToTokens(templateStr);

        // 调用 renderTemplate 函数，让 tokens 数组变为 dom 字符串
        var domStr = renderTemplate(tokens, data);
        return domStr;
    }
}