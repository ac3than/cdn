/**
 * 常量
 *      务必不推荐使用全局字符串/数值变量, 推荐使用全局对象来保存
 */

// 函数使用 function xx() {} 这种格式, 不要使用 const/let xx = function() {}  (safari 上报错)

/**
 * 查询地址栏参数
 */
function getQueryParam(name) {

    // ?_ijt=lbc3bmupvk747lan5sablrqut0&name=王健&age=100&
    // ?_ijt=lbc3bmupvk747lan5sablrqut0&name=%E7%8E%8B%E5%81%A5&age=100&

    // 地址栏      http://localhost:1234/web/location.html?_ijt=lbc3bmupvk747lan5sablrqut0&name=%E7%8E%8B%E5%81%A5&age=100#test
    // search     ?_ijt=lbc3bmupvk747lan5sablrqut0&name=%E7%8E%8B%E5%81%A5&age=100

    let search = document.location.search

    // ${name} 表示取方法形参, 即 get 请求参数 key
    // 参数 key 前面一定有 ? 或者 &
    // 参数 key 后面一定是 =
    // 参数 value 内一定不包含 &
    // 参数 value 后面可能有 & 或者没有
    let regex = new RegExp(`[?&]${name}=([^&]+)&?`)
    let result = regex.exec(search)
    if (result != null) {
        // url 解码
        return decodeURIComponent(RegExp.$1)
    }
    return ''
};

/**
 * replaceAll    (js 原生没有 replaceAll 方法)
 */
String.prototype.replaceAll = function (s1, s2) {
    // g 表示全局匹配, 即找到所有的, 而不是只找到第一个
    // m 表示多行匹配
    // 'a  bb  cc'.replace(/\s+/gm, ''))
    return this.replace(new RegExp(s1, "gm"), s2);
}

/**
 * 中文转 unicode
 */
String.prototype.toUnicode = function () {
    return this.replace(/[^\0-~]/g, function (ch) {
        return "\\u" + ("000" + ch.charCodeAt(0).toString(16)).slice(-4);
    });
}

/**
 * localStorage 相关
 */
function setLocalStorageItem(key, value) {
    localStorage.setItem(key, value)
}

function getLocalStorageItem(key) {
    const value = localStorage.getItem(key);
    return value ? value : ''
}

/**
 * 全角空格为 12288, 半角空格为 32
 * 其他字符半角 (33-126) 与全角 (65281-65374) 的对应关系是 均相差 65248
 */
/**
 * 全角转半角
 */
function fullToHalf(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {

        let ascii = str.charCodeAt(i);

        // 全角空格为 12288, 它没有遵从于 ASCII 的相对偏移, 必须单独处理
        if (ascii == 12288) {
            result += String.fromCharCode(ascii - 12256);

            // 所有全角字符都需要 - 65248
        } else if (ascii >= 65281 && ascii <= 65374) {
            result += String.fromCharCode(ascii - 65248);

            // 其他的不变
        } else {
            result += String.fromCharCode(ascii);
        }
    }
    return result;
}

/**
 * 半角转全角
 */
function halfToFull(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        // 半角空格为 32, 它没有遵从于 ASCII 的相对偏移, 必须单独处理
        let ascii = str.charCodeAt(i);
        if (ascii == 32) {
            result += String.fromCharCode(12288);
            // 其他半角字符都需要 + 65248
        } else if (ascii >= 33 && ascii <= 126) {
            result = result + String.fromCharCode(ascii + 65248);
            // 其他的不变
        } else {
            result += String.fromCharCode(ascii);
        }
    }
    return result;
}

/**
 * 数组去重
 */
function distinct(arr) {
    let resultArr = [];
    for (let i in arr) {
        // 新数组中不存在该值
        let element = arr[i];
        // 如果值不在新数组中, 并且值不为空字符串
        if (resultArr.indexOf(element) == -1 && element.trim() != '') {
            resultArr.push(element.trim());
        }
    }
    return resultArr;
}

/**
 * 格式化 xml
 * https://gist.github.com/sente/1083506/d2834134cd070dbcc08bf42ee27dabb746a1c54d
 */
function formatXml(xml) {

    // Remove all the newlines and then remove all the spaces between tags
    xml = xml.replace(/(\r\n|\n|\r)/gm, "").replace(/>\s+</g, '><');

    // set desired indent size here
    const PADDING = ' '.repeat(4);
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;

    xml = xml.replace(reg, '$1\r\n$2$3');

    return xml.split('\r\n').map((node, index) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/) && pad > 0) {
            pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        pad += indent;

        return PADDING.repeat(pad - indent) + node;
    }).join('\r\n');
}

/**
 * 格式化 json 字符串
 */
function formatJson(jsonStr) {
    //将 json 字符串格式化为 json 对象
    let json = JSON.parse(jsonStr);
    // 使用 4 个空格缩进
    return JSON.stringify(json, null, 4)
}

/**
 *  json 对象转 key1=value1&key1=value2 字符串
 */
function jsonObjToKeyEqualsValueString(obj) {
    let result = ''
    let index = 0

    for (let key in obj) {
        let value = obj[key]
        // 第一个参数, 先追加 ?
        if (index > 0) {
            result += "&"
            // 不是第一个参数, 先追加 &
        } else {
            result += "?"
        }
        result += encodeURIComponent(key)
        result += "="
        result += encodeURIComponent(value)
        index++
    }
    console.log(result)
    return result
}

/**
 * 日期转毫秒
 */
function getMillisecond(dateStr) {
    return ''
}

/**
 * 毫秒转日期
 */

// new Date(时间戳 * 1).format('yyyy-MM-dd hh:mm:ss')

Date.prototype.format = function (format) {
    let o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

/**
 * null / undefined 转空字符串
 */
function nullToEmpty(value) {
    if (!value || !value.trim()) {
        return ''
    }
    return value
}

