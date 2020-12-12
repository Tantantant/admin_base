import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {
    /*
    获取商品属性分页列表
    */
    getTrademarkList(page, limit) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'GET',
        })
    },
    /*
    增加商品属性
    */
    addTrademarkList(data) {
        return request({
            url: `${api_name}/save`,
            method: 'POST',
            data
        })
    },
    /*
    修改商品属性
    */
    updateTrademarkList(data) {
        return request({
            url: `${api_name}/update`,
            method: 'PUT',
            data
        })
    },
    /*
    删除商品属性商品属性
    */
    delTrademarkList(id) {
        return request({
            url: `${api_name}/remove/${id}`,
            method: 'DELETE',
        })
    }
}