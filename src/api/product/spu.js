
import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
 获取spu对应三级分类信息列表
 */
  getSpuList({ page, limit, category3Id }) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'GET',
      params: {
        category3Id
      }
    })
  },
  /*
添加商品属性
*/
  saveSpuInfo(attr) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: 'POST',
      data: attr,
    })
  },
   /*
更新商品属性
*/
updateSpuInfo(attr) {
  return request({
    url: `${api_name}/saveAttrInfo`,
    method: 'POST',
    data: attr,
  })
},
  /*
 删除商品属性
 */
  delSpuInfo(spuId) {
    return request({
      url: `${api_name}/deleteAttr/${spuId}`,
      method: 'DELETE',
    })
  },
   /*
 获取所有品牌列表
 */
getTrademarkList() {
  return request({
    url: `${api_name}/baseTrademark/getTrademarkList`,
    method: 'GET',
  })
},
  /*
 获取对应品牌的图片列表
 */
getSpuImageList(spuId) {
  return request({
    url: `${api_name}/spuImageList/${spuId}`,
    method: 'GET',
  })
},

 /*
 获取对应品牌的所有在售属性列表
 */
getSpuSaleAttrList(spuId) {
  return request({
    url: `${api_name}/spuSaleAttrList/${spuId}`,
    method: 'GET',
  })
},

/*
 获取对应品牌基本属性列表
 */
getBaseSaleAttrList() {
  return request({
    url: `${api_name}/baseSaleAttrList`,
    method: 'GET',
  })
},


}
