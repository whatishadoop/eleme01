/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse() {
	let url = window.location.search;  // 获取浏览器地址栏中输入的url值
	let obj = {};  // 创建一个对象
	let reg = /[?&][^?&]+=[^?&]+/g;  // [?&]表示首个字符为?或&h中一个，后面接着[^?&]+非?&字符一个或多个例如匹配到id, 后面接着匹配单个字符 = ，后面接着[^?&]+非?&字符一个或多个例如匹配到12345 ，最后是全局匹配
	let arr = url.match(reg);  /*此时匹配到了两个分别是字符串数组 ['?id=12345', '&a=b']*/
	// ['?id=12345', '&a=b']
	if (arr) {
		arr.forEach((item) => {
			let tempArr = item.substring(1).split('=');
			let key = decodeURIComponent(tempArr[0]);  // 因为是url参数默认浏览器会encodeurl编码，此处要使用decode解码才能还原初始值
			let val = decodeURIComponent(tempArr[1]);
			obj[key] = val;  // 把值放入对象中
		});
	}
	return obj;
};
