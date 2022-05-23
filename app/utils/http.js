const http = {
	// 网络请求
	async get(url, header = {}) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				method: 'GET',
				header: header,
				timeout: 3000,
				success(response) {
					resolve(response.data);
				},
				fail(error) {
					reject(error)
				}
			})
		})
	},
	// 匹配一次
	async matchOnce(key, html) {
		try {
			let re = new RegExp(key, 'g')
			let t = re.exec(html);
			return {
				flag: true,
				data: t[1],
				msg: '匹配完成！'
			}
		} catch (e) {
			return {
				flag: false,
				data: String(e),
				msg: '匹配失败！'
			}
		}
	},
	// 匹配所有
	async matchAll(key, html) {
		try {
			let re = new RegExp(key, 'g')
			let t;
			let results = [];
			while ((t = re.exec(html)) != null) {
				results.push(t[1]);
			};
			return {
				flag: true,
				data: results,
				msg: '匹配完成！'
			}
		} catch (e) {
			//TODO handle the exception
			return {
				flag: false,
				data: String(e),
				msg: '匹配失败！'
			}
		}
	},
	// json处理
	async matchjson(key, json) {
		try {
			let matchslice = key.split('.');
			let results = json;
			for (let slice of matchslice) {
				results = results[slice]
			}
			return {
				flag: true,
				data: results,
				msg: '匹配完成！'
			}
		} catch (e) {
			return {
				flag: false,
				data: String(e),
				msg: '获取失败！'
			}
		}
	},
	// 获取XT源搜索结果
	async getxtsearchlist(site, searchurl) {
		try {
			let searchLists = []
			let html = await this.get(searchurl);
			let rangeres = await http.matchOnce(site.search_range, html);
			if (rangeres.flag) {
				let titleres = await http.matchAll(site.search_list_name, rangeres.data);
				let picres = await http.matchAll(site.search_list_src, rangeres.data);
				let stateres = await http.matchAll(site.search_list_state, rangeres.data);
				let hrefres = await http.matchAll(site.search_list_href, rangeres.data);
				if (titleres.flag && hrefres.flag && titleres.data.length == hrefres.data.length) {
					for (let i = 0; i < titleres.data.length; i++) {
						searchLists.push({
							name: site.name,
							pic: picres.data[i] | '',
							title: titleres.data[i],
							href: hrefres.data[i],
							state: stateres.data[i] | ''
						});
					}
					return {
						flag: true,
						data: lastLists,
						msg: '搜索完成'
					}
				} else {
					return {
						flag: false,
						data: 'error!',
						msg: '搜索失败'
					}
				}
			} else {
				return {
					flag: false,
					data: 'error!',
					msg: '搜索失败'
				}
			}
		} catch (e) {
			return {
				flag: false,
				data: e,
				msg: '搜索失败'
			}
		}
	}
}
export default http
