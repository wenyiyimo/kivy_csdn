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
				data: t[1].trim(),
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
				results.push(t[1].replace(new RegExp("\\\\", "g"), "").trim());
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
	async xtSearch(site, searchurl) {
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
						if (picres.data[i] && picres.data[i].indexOf('//') == -1) {
							picres.data[i] = [site.pic_url, picres.data[i]].join("")
						}
						if (hrefres.data[i] && hrefres.data[i].indexOf('//') == -1) {
							hrefres.data[i] = [site.search_url, hrefres.data[i]].join("")
						}
						if (hrefres.data[i] && titleres.data[i]) {
							searchLists.push({
								name: site.name,
								pic: picres.data[i] | '',
								title: titleres.data[i],
								href: hrefres.data[i],
								state: stateres.data[i] | ''
							});
						}

					}
					return {
						flag: true,
						data: searchLists,
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
	},
	// app搜索
	async appSearch(site, searchurl) {
		let searchLists = []
		try {
			let jsonString = await this.get(searchurl)
			range_search = await this.matchjson(site.search_range, jsonString)
			for (let jsondata of range_search) {
				if (jsondata[site.search_list_name] && jsondata[site.search_list_href]) {
					searchLists.push({
						name: site.name,
						pic: (site.pic_url | '' + jsondata[site.search_list_src]) | '',
						title: jsondata[site.search_list_name],
						href: site.search_url + String(jsondata[site.search_list_href]),
						state: jsondata[site.search_list_state] | ''
					});
				}

			}
			return {
				flag: true,
				data: searchLists,
				msg: '搜索完成'
			}
		} catch (err) {
			return {
				flag: false,
				data: err,
				msg: '搜索失败'
			}
		}
	},
	// st获取更新状态
	async stState(url, site) {
		try {
			let html = await this.get(url);
			let rangeres = await this.matchOnce(site.play_range, html);
			if (rangeres.flag) {
				let stateres = await this.matchOnce(site.play_state, rangeres.data);
				return {
					flag: true,
					data: stateres.data,
					msg: '状态更新完成'
				}
			} else {
				return {
					flag: false,
					data: 'error!',
					msg: '状态获取失败'
				}
			}
		} catch (err) {
			return {
				flag: false,
				data: err,
				msg: '状态获取失败'
			}
		}
	},
	//app 获取更新
	async appstate(url, site) {
		try {
			let jsondata = await this.get(url);
			let stateres = await this.matchjson(site.play_state, jsondata)
			return {
				flag: true,
				data: stateres.data,
				msg: '状态更新完成'
			}
		} catch (err) {
			return {
				flag: false,
				data: err,
				msg: '状态获取失败'
			}
		}
	},
}
export default http
