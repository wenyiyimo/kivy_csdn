import db from '@/utils/database.js'
const http = {
	// 网络请求
	async get(url, header = {}) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				method: 'GET',
				header: header,
				timeout: 10000,
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
				msg: '匹配完成'
			}
		} catch (e) {
			return {
				flag: false,
				data: String(e),
				msg: '匹配失败'
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
				msg: '匹配完成'
			}
		} catch (e) {
			//TODO handle the exception
			return {
				flag: false,
				data: String(e),
				msg: '匹配失败'
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
				msg: '匹配完成'
			}
		} catch (e) {
			return {
				flag: false,
				data: String(e),
				msg: '获取失败'
			}
		}
	},
	// 获取XT源搜索结果
	async xtSearch(site, searchurl, header = {}) {
		try {
			let searchLists = []
			let html = await this.get(searchurl, header);
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
	// 爬剧集
	async xtplaydata(url, site) {
		try {
			let html = await this.get(url);
			let rangeres = await this.matchOnce(site.play_range, html);
			if (rangeres.flag) {
				let namerangeres = await this.matchOnce(site.name_tag_list, rangeres.data);
				let nametagsres = await this.matchAll(site.name_tag, namerangeres.data);
				let playlistres = await this.matchAll(site.play_list, rangeres.data);
				let playdatas = [];
				let n = 0;
				for (let i of playlistres.data) {
					let playlistnameres = await this.matchAll(site.play_list_name, i);
					let playlisthrefres = await this.matchAll(site.play_list_href, i);
					if (playlistnameres.flag && playlisthrefres.flag) {
						let playlen = playlisthrefres.data.length;
						let playdata = []
						for (let j = 0; j < playlen; j++) {
							let dealhref = playlisthrefres.data[j];
							if (dealhref.indexOf('http') == -1) {
								playdata.push({
									title: playlistnameres.data[j],
									href: [site.url, dealhref].join("")
								})
							} else {
								playdata.push({
									title: playlistnameres.data[j],
									href: dealhref
								})
							}
						}
						let nametag = nametagsres.data[n] | `源${n}`;
						n = n + 1;
						playdatas.push({
							name: nametag,
							data: playdata
						})
					} else {
						continue
					}
				}
				return {
					flag: true,
					data: playdatas,
					msg: '剧集获取成功'
				}
			} else {
				return {
					flag: false,
					data: 'error',
					msg: '剧集获取失败'
				}
			}
		} catch (err) {
			return {
				flag: false,
				data: err,
				msg: '剧集获取失败'
			}
		}
	},
	//app爬剧集
	async appplaydata(url, site) {
		try {
			let jsonData = await this.get(url);
			jsondata = await this.matchjson(site.play_range, jsonData)
			// let nameTags = [];
			let playdatas = [];
			let tempurl = "";
			for (let jsoninfo of jsondata) {
				let nametag = jsoninfo[site.name_tag];
				// nameTags.push(jsoninfo[site.name_tag]);
				let playjx = await this.panduanapi(site, jsoninfo)
				let playinfo = jsoninfo[site.play_list];
				let playdata = [];
				for (let playslice of playinfo.split("#")) {
					let playsliceinfo = playslice.split("$");
					tempurl = playjx + playsliceinfo[1];
					if (tempurl.indexOf("url=") != -1 || tempurl.endsWith("m3u8") || tempurl.endsWith("mp4")) {
						playdata.push({
							title: playsliceinfo[0],
							href: tempurl
						})
					} else {
						tempurl = site.extra_api + tempurl;
						playdata.push({
							title: playsliceinfo[0],
							href: tempurl
						})
					}
				}
				playdatas.push({
					name: nametag,
					data: playdata
				})
			}
			return {
				flag: true,
				data: playdatas,
				msg: '剧集加载成功'
			}
		} catch (err) {
			return {
				flag: false,
				data: err,
				msg: '剧集获取失败'
			}
		}
	},
	async getapi2(site, jsoninfo) {
		try {
			if (site.playapi2 && site.play_api2 != "") {
				let playjx = await this.matchjson(site.play_api2, jsoninfo);
				playjx = playjx.replace(/../g, ".")
				if (playjx.indexOf(",") != -1) {
					playjx = playjx.split(",")[1] | playjx.split(",")[0];
					if (playjx.indexOf("//") == -1) {
						playjx = "";
						return playjx
					} else {
						return playjx
					}
				} else {
					if (playjx.indexOf("//") == -1) {
						playjx = "";
						return playjx
					} else {
						return playjx
					}
				}
			} else {
				let playjx = "";
				return playjx;
			}
		} catch (e) {
			let playjx = '';
			return playjx
		}
	},
	//判断api
	async panduanapi(site, jsoninfo) {
		try {
			if (site.play_api != "") {
				let playjx = await this.matchjson(site.play_api, jsoninfo);
				playjx = playjx.replace(/../g, ".")
				if (playjx.indexOf(",") != -1) {
					playjx = playjx.split(",")[1] | playjx.split(",")[0];
					if (playjx.indexOf("//") == -1) {
						playjx = await this.getapi2(site, jsoninfo);
						return playjx
					} else {
						return playjx
					}
				} else {
					if (playjx.indexOf("//") == -1) {
						playjx = await this.getapi2(site, jsoninfo);
						return playjx
					} else {
						return playjx
					}
				}
			} else {
				let playjx = "";
				return playjx
			}
		} catch (e) {
			let playjx = await this.getapi2(site, jsoninfo);
			return playjx
		}
	},
	//app 获取真实链接
	async appTureUrl(url) {
		if (url.indexOf("url=") === -1) {
			return url
		} else {
			let getjson = await this.get(url);
			if (getjson.data.url) {
				return getjson.data.url
			} else {
				return url
			}
		}
	},
	// 导入视频源
	async site(jsonUrl) {
		try {
			if (jsonUrl.startsWith("http")) {
				let urlslices = jsonUrl.split('&&&&');
				let urldata = {
					name: urlslices[1],
					href: urlslices[0],
					isActive: true
				}
				let resdb = await db.addNotive('urlNotive', urldata);
				if (resdb.flag) {
					let res = await this.get(urlslices[0]);
					await this.importsite(res);
					return {
						flag: true,
						msg: '导入完成'
					}
				}
			}
			if (jsonUrl.startsWith("{")) {
				if (JSON.parse(jsonUrl).name != '') {
					await this.importsite([JSON.parse(jsonUrl)]);
					return {
						flag: true,
						msg: '导入完成'
					}
				}
			}
			if (jsonUrl.startsWith("[")) {
				if (JSON.parse(jsonUrl)[0].name != '') {
					await this.importsite(JSON.parse(jsonUrl));
					return {
						flag: true,
						msg: '导入完成'
					}
				}
			}
		} catch (err) {
			return {
				flag: false,
				msg: '导入失败'
			}
		}
	},
	// 判断是否为直播
	async importsite(sites) {
		for (let i of sites) {
			if (i.id == 'LV') {
				await db.addsite('livelists', i)
			}
			if (i.id == 'XT' || i.id == 'APP') {
				await db.addsite('sites', i)
			}
		}
	},
	// 检测订阅更新
	async checksiteupdate() {
		let urlList = uni.getStorageSync('urlNotive');
		for (let i of urlList) {
			let res = await this.get(i);
			await this.importsite(res);
		}
	}
}
export default http
