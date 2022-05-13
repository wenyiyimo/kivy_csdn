const ajax = {
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
	}
}
export default ajax
