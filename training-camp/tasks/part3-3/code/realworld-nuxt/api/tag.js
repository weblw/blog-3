import request from '@/utils/request'

// 获取标签列表
export function getTags () {
    return request({
        method: 'GET',
        url: '/api/tags'
    })
}


