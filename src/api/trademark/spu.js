// /admin/product

import request from '@/utils/request'

const api_name = '/admin/product'

export default {

    //获取分页列表
    getSpuList({ category3Id, page, limit }) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: "GET",
            params: {
                category3Id
            }
        });
    },

    // 获取所有销售属性列表
    getSaleAttrList() {
        return request({
            url: `${api_name}/baseSaleAttrList`,
            method: "GET"
        });
    },

    // 删除SPU
    delSpu(spuId) {
        return request({
            url: `${api_name}/deleteSpu/${spuId}`,
            method: "DELETE"
        });
    },

    // 保存SPU
    addSpu(spu) {
        return request({
            url: `${api_name}/saveSpuInfo`,
            method: "POST",
            data: spu
        });
    },

    // 修改SPU
    updateSpu(spu) {
        return request({
            url: `${api_name}/updateSpuInfo`,
            method: "POST",
            data: spu
        });
    },

    // 获取所有品牌数据
    getTrademarkList() {
        return request({
            url: `${api_name}/baseTrademark/getTrademarkList`,
            method: "GET",
        });
    },

    // 获取spu图片列表
    spuImageList(spuId) {
        return request({
            url: `${api_name}/spuImageList/${spuId}`,
            method: "GET",
        });
    },
    
    // 获取spu的销售列表
    getSpuSaleAttrList(spuId) {
        return request({
            url: `${api_name}/spuSaleAttrList/${spuId}`,
            method: "GET",
        });
    },
    
}

