import http from '@/utils/http.js'
const db = {
	// 初始化 db 数据库
	async initdb() {
		// 站源
		let sites = uni.getStorageSync("sites");
		if (!sites) {
			uni.setStorageSync('sites', [])
		}
		// 历史记录
		let historys = uni.getStorageSync("historys");
		if (!historys) {
			uni.setStorageSync('historys', [])
		}
		// 收藏
		let hearts = uni.getStorageSync("hearts");
		if (!hearts) {
			uni.setStorageSync('hearts', [])
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


}
export default db
