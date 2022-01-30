import ajax from './uni-ajax'
import db from './database'
const http = {
	// 获取搜索列表
	async getSearchList(site, searchKey) {
		const searchLists = []
		let gethtml = await ajax.get(site.search_href.replace("searchKey", searchKey));
		let html = gethtml.data;
		let re = new RegExp(site.search_range, 'g')
		let t;
		let rangeResults = [];
		while ((t = re.exec(html)) != null) {
			rangeResults.push(t[1]);
		};
		re = new RegExp(site.search_list_name, 'g')
		let nameResults = [];
		while ((t = re.exec(rangeResults[0])) != null) {
			nameResults.push(t[1]);
		};
		let picResults = [];
		re = new RegExp(site.search_list_src, 'g');
		while ((t = re.exec(rangeResults[0])) != null) {
			if (t[1].indexOf('http') == 0) {
				picResults.push(t[1].replace(new RegExp("\\\\", "g"),""));
			} else {
				let httpurl = [site.url, t[1]].join("")
				picResults.push(httpurl.replace(new RegExp("\\\\", "g"),""));
			}
		};
		let hrefResults = [];
		re = new RegExp(site.search_list_href, 'g');
		while ((t = re.exec(rangeResults[0])) != null) {
			if (t[1].indexOf('http') == 0) {
				hrefResults.push(t[1].replace(new RegExp("\\\\", "g"),""));
			} else {
				let httpurl = [site.url, t[1]].join("")
				hrefResults.push(httpurl.replace(new RegExp("\\\\", "g"),""));
			}
		};
		let stateResults = [];
		re = new RegExp(site.search_list_state, 'g');
		while ((t = re.exec(rangeResults[0])) != null) {
			stateResults.push(t[1]);
		};
		for (let j = 0; j < nameResults.length; j++) {
			let pt = [];
			pt.push(nameResults[j]);
			pt.push(hrefResults[j]);
			pt.push(picResults[j]);
			pt.push(stateResults[j]);
			searchLists.push(pt);
		}
		const lastLists = [site.name, searchLists]
		return {
			flag: true,
			data: lastLists,
			msg: '搜索完成'
		}
	},
	// 通过 json url 导入视频源
	async site(jsonUrl) {
		try {
			const res = await ajax.get(jsonUrl)
			return res.data
		} catch (err) {
			return err
		}
	},
	// 获取更新状态
	async getState(url, site) {
		try {
			let gethtml = await ajax.get(url);
			let html = gethtml.data;
			let re = new RegExp(site.play_range, 'g')
			let t;
			let rangeResults = [];
			
			while ((t = re.exec(html)) != null) {
				rangeResults.push(t[1]);
			};
			re = new RegExp(site.play_state, 'g')
			let stateResults = [];
			while ((t = re.exec(rangeResults[0])) != null) {
				stateResults.push(t[1]);
			};
			return {
				flag: true,
				data: stateResults,
				msg: '状态更新完成'
			}
		} catch (err) {
			return {
				flag: false,
				data: err,
				msg: '状态获取失败'
			}
		}
	}
}
export default http
