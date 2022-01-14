
import uni_request from '@/utils/uni_request/uni_request.js'

let baseurl;
let time_out = 5;
let headers = { 'x-custom-header': 'x-custom-header' }
const request = uni_request({ baseURL:baseurl,
	timeout: time_out, // 超时时间，单位毫秒。默认 60 秒
	header: headers, // 设置请求头，建议放在请求拦截器中
	statusCode: [200, 401],
	})

request.interceptors.response.use(async (response, ...args) => { // 响应拦截器
	// ...
	return response
})

request.onerror = (...args) => console.log(args) // 错误监听

export default request
