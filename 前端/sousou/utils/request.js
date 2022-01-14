import ajax from './uni_request/uni_request.js'
import parser from 'fast-xml-parser'
import db from './database'

const http = {
  xmlConfig: {
    trimValues: true,
    textNodeName: '_t',
    ignoreAttributes: false,
    attributeNamePrefix: '_',
    parseAttributeValue: true
  },
  // 获取视频源详情
  async getSite (key) {
    const site = await db.get('site', key)
    if (site.flag) {
      return site.data
    }
    return false
  },
  // 获取视频源的分类
  async class (key) {
    const site = await this.getSite(key)
    try {
	  const res1 = await site.class_name
	  const res2 = await site.class_href
	  const arr = []
	  for (var i=0;i<res1.length;i++) {
	  const j = {
		tid: res2[i],
		name: res1[i]
	  }
	  arr.push(j)
	}
      return arr
    } catch (err) {
      return err
    }
  },
  // 获取视频资源
  async list (key, pg = 1, t) {
    const site = await this.getSite(key)
    const url = `${site.api}?ac=videolist${t ? '&t=' + t: ''}&pg=${pg}`
    try {
      const res = await ajax.post(url)
      const json = parser.parse(res.data, this.xmlConfig)
      if (json.rss.list.video) {
        return json.rss.list.video
      } else {
        return []
      }
    } catch (err) {
      return err
    }
  },
  // 获取总资源数, 以及页数
  async page (key, t) {
    pg=1;
      return pg
    
  },
  // 搜索资源
  async search (key, wd) {
    const site = await this.getSite(key);
    wd = encodeURI(wd);
    const url = await site.search_href.replace('SearchKey', wd);
	const headers = await site.header;
    ajax.get({
		baseURL: url, //baseURL
		timeout: 5, // 超时时间，单位毫秒。默认 60 秒
		header:headers
	}).then(res => { // 也可以使用配置的 baseURL 之外的 url，但是注意 url 路径要写完整
	document.write(res);
	return res;
}).catch(e => {
	document.write(e);
	return e;});
  },
  // 获取资源详情
  async detail (key, id) {
    const site = await this.getSite(key)
    const url = `${site.api}?ac=videolist&ids=${id}`
    try {
      const res = await ajax.post(url)
      const json = parser.parse(res.data, this.xmlConfig)
      if (json && json.rss && json.rss.list) {
        const videoList = json.rss.list.video
        let m3u8List = []
        const dd = videoList.dl.dd
        const type = Object.prototype.toString.call(dd)
        if (type === '[object Array]') {
          for (const i of dd) {
            if (i._flag.indexOf('m3u8') >= 0) {
              m3u8List = i._t.split('#')
            }
          }
        } else {
          m3u8List = dd._t.split('#')
        }
        videoList.m3u8List = m3u8List
        return videoList
      }
      return null
    } catch (err) {
      return err
    }
  },
  // 通过 json url 导入视频源
  async site (jsonUrl) {
    try {
      const res = await ajax.get(jsonUrl)
      return res.data
    } catch (err) {
      return err
    }
  }
}

export default http
