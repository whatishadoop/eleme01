export function saveToLocal(id, key, value) {
	let seller = window.localStorage.__seller__;  // 为了localStorage 设置私有变量__seller__，为了localStorage只能保存字符串对象
	if (!seller) {
		seller = {};
		seller[id] = {};  // 根据key值获取对象
	} else {
		seller = JSON.parse(seller);
		if (!seller[id]) {
			seller[id] = {};
		}
	}
	seller[id][key] = value;
	window.localStorage.__seller__ = JSON.stringify(seller);  // 将json对象保存为字符串进行存储
};  // 结尾要有分号

export function loadFromLocal(id, key, def) {
	let seller = window.localStorage.__seller__;
	if (!seller) {
		return def;
	}
	seller = JSON.parse(seller)[id];
	if (!seller) {
		return def;
	}
	let ret = seller[key];
	return ret || def;  // 表示没有的化还是返回默认值def
};
