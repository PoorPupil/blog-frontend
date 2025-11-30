import axios from 'axios'

// 1. 创建 axios 实例
const request = axios.create({
    // 注意：这里先写 /api，后面我们在 vite.config.ts 里做反向代理解决跨域
    baseURL: '/api', 
    timeout: 5000
})

// 2. 请求拦截器 (相当于后端的 Filter)
request.interceptors.request.use(config => {
    // 将来在这里统一加 Token：config.headers['Authorization'] = token
    return config
})

// 3. 响应拦截器 (相当于后端的 GlobalExceptionHandler)
request.interceptors.response.use(
    response => {
        // 后端返回的 Result 数据
        const res = response.data
        if (res.code === 200) {
            return res.data // 直接要把数据剥离出来，少写一层 .data
        } else {
            // 这里可以统一弹窗提示错误
            console.error(res.message)
            return Promise.reject(new Error(res.message))
        }
    },
    error => {
        console.error('请求出错', error)
        return Promise.reject(error)
    }
)

export default request