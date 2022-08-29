import axios from 'axios'

export default function request(config, BaseURLConfig = {
	url: "http://10.160.210.171:5050"
}) {
	// 1. 创建 axios的实例
	const instance = axios.create({
		// baseURL: "http://10.160.210.171:5050",
		// baseURL: "http://127.0.0.1:5050",
		baseURL: BaseURLConfig.url,
		timeout: 1000 * 60 * 20
	})
	// 2. 请求拦截
	instance.interceptors.request.use(
		config => {
			return config;
		}, err => {
			console.log(err);
		}
	)
	// 3.响应拦截
	instance.interceptors.response.use(
		res => {
			return res.data
		}, err => {
			console.log(err);
		}
	)
	// 发送真正的网络请求
	return instance(config);
}
