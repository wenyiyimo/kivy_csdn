import initSiteDB from './site.json'
import initNotive from './notive.json'
const db = {
	// 初始化 db 数据库
	async init(db) {
		const res = await this.getAllDB(db)
		if (res.data.length > 0) {
		// await this.reset(db);
		  return { flag: false, data: null, msg: `初始化失败, ${db} 数据库已存在` }
		} else {
		await this.reset(db)
		return {
			flag: true,
			data: null,
			msg: '初始化成功'}
		}

	},
	// 重置 db 数据库
	async reset(db) {
		await this.removeAll(db)
		if (db === 'site') {
			for (const i of initSiteDB) {
				await this.add(db, i)
			}
		}
		if (db === 'notive') {
			for (const i of initNotive) {
				await this.addNotive(db, i)
			}
		}
		return {
			flag: true,
			data: null,
			msg: `${db} 数据库重置成功`
		}
	},
	// db 里添加 item
	async add(db, item) {
		const res = await this.addItemKey(db, item.name)
		if (res && res.flag) {
			try {
				uni.setStorageSync(`${db}-${item.name}`, item)
				return {
					flag: true,
					data: {
						...item
					},
					msg: '保存成功'
				}
			} catch (err) {
				return err
			}
		} else {
			return res
		}
	},
	async addNotive(db, item) {
		const key = item.name +"@@"+ item.href
		const res = await this.addItemKey(db, key)
		if (res && res.flag) {
			try {
				uni.setStorageSync(`${db}-${key}`, item)
				return {
					flag: true,
					data: {
						...item
					},
					msg: '保存成功'
				}
			} catch (err) {
				return err
			}
		} else {
			return res
		}
	},
	// db 里添加 item key
	async addItemKey (db, key) {
	  const res = await this.checkItemKey(db, key)
	  if (res.flag) {
	    const keys = await this.getAllDB(db)
	    let arr = []
	    if (keys.data && keys.data.length > 0) {
	      arr = [...keys.data]
	    }
	    arr.push(key)
	    try {
	      uni.setStorageSync(`SS-${db}-DB`, arr)
	      return { flag: true, data: key, msg: '保存成功' }
	    } catch(err) {
	      return { flag: false, data: key, msg: err }
	    }
	  } else {
	    return res
	  }
	},
	// 检查 db 里 key 是否存在
	async checkItemKey (db, key) {
	  const res = await this.getAllDB(db)
	  if (res.data.length > 0) {
	    for (const i of res.data) {
	      if (i === key) {
	        return { flag: false, data: null, msg: `${key} 已存在` }
	      }
	    }
	  }
	  return { flag: true, data: null, msg: `${key} 不存在` }
	},
	// 移除 db 所有 item
	async removeAll (db) {
	  const res = await this.getAllDB(db)
	  if (res.data.length <= 0) {
	    return { flag: false, data: null, msg: '数据为空' }
	  } else {
	    let arr = [...res.data]
	    for (const i of arr) {
	      await this.remove(db, i)
	    }
	    try {
	      uni.removeStorageSync(`SS-${db}-DB`)
	      return { flag: true, data: null, msg: `${db} 数据库清空成功` }
	    } catch (err) {
	      return { flag: false, data: null, msg: `${db} 数据库清空失败` }
	    }
	  }
	},
	// 获取所有为 db 的数据
	async getAllDB (db) {
	  try {
	    const res = uni.getStorageSync(`SS-${db}-DB`)
	    return { flag: true, data: res, msg: `获取到所有为 ${db} 的数据` }
	  } catch (err) {
	    return { flag: false, data: null, msg: err }
	  }
	},
	// 移除 db 单个 item
	async remove (db, key) {
	  const res = await this.getAllDB(db)
	  if (res.data.length <= 0) {
	    return { flag: false, data: null, msg: '数据为空' }
	  } else {
	    let arr = [...res.data]
	    const index = arr.indexOf(key)
	    if (index >= 0) {
	      arr.splice(index, 1)
	      try {
	        uni.setStorageSync(`SS-${db}-DB`, arr)
	        uni.removeStorageSync(`${db}-${key}`)
	        return { flag: true, data: key, msg: `${key} 移除成功` }
	      } catch(err) {
	        return { flag: false, data: key, msg: err }
	      }
	    } else {
	      return { flag: false, data: key, msg: `${key} 不存在, 移除失败` }
	    }
	  }
	},
	// 查询获取 db 所有 item
	async getAll (db) {
	  const res = await this.getAllDB(db)
	  if (res.data.length > 0) {
	    let arr = []
	    for (const i of res.data) {
	      const data = await this.get(db, i)
	      arr.push(data.data)
	    }
	    return { flag: true, data: arr, msg: '已获取所有数据' }
	  } else {
	    return res
	  }
	},
	// 查询获取单个 item
	async get (db, key) {
	  try {
	    const res = uni.getStorageSync(`${db}-${key}`)
	    if (res) {
	      return { flag: true, data: {...res}, msg: `查询到 ${key} 值的数据` }
	    }
	    return { flag: false, data: null, msg: `没有查询到 ${key} 值的数据` }
	  } catch (err) {
	    return { flag: false, data: null, msg: {...err} }
	  }
	},
}
export default db
