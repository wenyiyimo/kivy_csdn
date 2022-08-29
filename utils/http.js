import request from "./request.js";
let http = {
	// 网络请求
	async get(url, data = {}) {
		return new Promise((resolve, reject) => {
			request({
				url: url,
				method: 'get',
				params: data
			}).then(res => {
				resolve(res)
			}).catch(err => {
				reject(err);
			})
		});

	},
	async post(url, data) {
		return new Promise((resolve, reject) => {
			request({
					url: url,
					method: 'post',
					data: data
				})
				.then((response) => {
					resolve(response);
				})
				.catch((err) => {
					reject(err);
				});
		});
	},
	async delete(data) {
		return new Promise((resolve, reject) => {
			request({
					url: '/deleteCacheJsonFile',
					method: 'delete',
					data: data
				})
				.then((response) => {
					resolve(response);
				})
				.catch((err) => {
					reject(err);
				});
		});
	},
};
export default http;
