import http from '@/utils/http.js'
const db = {
	// 初始化 db 数据库
	async initdb() {
		// 站源
		let sites = uni.getStorageSync("sites");
		if (!sites) {
			uni.setStorageSync('sites', []);
		}
		// 历史记录
		let historys = uni.getStorageSync("historys");
		if (!historys) {
			uni.setStorageSync('historys', []);
		}
		// 收藏
		let hearts = uni.getStorageSync("hearts");
		if (!hearts) {
			uni.setStorageSync('hearts', []);
		}
		// 直播
		let livelists = uni.getStorageSync('livelists');
		if (!livelists) {
			uni.setStorageSync('livelists', []);
		}
		// 订阅
		let urlList = uni.getStorageSync('urlNotive');
		if (!urlList) {
			uni.setStorageSync('urlNotive', []);
		}
		return {
			flag: true,
			data: null,
			msg: '初始化成功'
		}
	},
	// 重置all数据
	async reset() {
		uni.setStorageSync('sites', []);
		uni.setStorageSync('historys', []);
		uni.setStorageSync('hearts', []);
		uni.setStorageSync('livelists', []);
		uni.setStorageSync('urlNotive', []);
		return {
			flag: true,
			data: null,
			msg: `数据库重置成功`
		}
	},
	// 重置指定数据库
	async reset(db) {
		uni.setStorageSync(db, []);
		return {
			flag: true,
			data: null,
			msg: `${db}数据库重置成功`
		}
	},
	// db 里添加 item
	async addsite(db, site) {
		let sites = uni.getStorageSync(db);
		let res = await this.checksite(sites, site.name);
		if (res.flag) {
			sites.push(site);
			uni.setStorageSync(db, sites);
			return {
				flag: true,
				data: null,
				msg: `添加成功`
			}
		} else {
			return {
				flag: false,
				data: null,
				msg: `已存在`
			}
		}
	},
	// 检查 db 里 key 是否存在
	async checksite(sites, name) {
		for (let i of sites) {
			if (i.name === name) {
				return {
					flag: false,
					data: null,
					msg: `${name}已存在`
				}
			}
		}
		return {
			flag: true,
			data: null,
			msg: `${name}不存在`
		}
	},
	async addNotive(db, item) {
		let sites = uni.getStorageSync(db);
		const res = await this.checkhref(sites, item.href)
		if (res.flag) {
			sites.push(item);
			uni.setStorageSync(db, sites);
			return {
				flag: true,
				data: null,
				msg: `添加成功`
			}
		} else {
			return {
				flag: false,
				data: null,
				msg: `已存在`
			}
		}
	},
	// 检查 db 里 href 是否存在
	async checkhref(sites, href) {
		for (let i of sites) {
			if (i.href === href) {
				return {
					flag: false,
					data: null,
					msg: `已存在`
				}
			}
		}
		return {
			flag: true,
			data: null,
			msg: `不存在`
		}
	},
	// 移除 db 单个 item
	async remove(db, index) {
		try {
			let sites = uni.getStorageSync(db);
			sites.splice(index, 1);
			uni.setStorageSync(db, sites);
			return {
				flag: true,
				data: null,
				msg: `移除成功`
			}
		} catch (e) {
			return {
				flag: false,
				data: null,
				msg: `移除失败`
			}
		}
	},
}
export default db
