import request from "@/utils/request";
const api_name = "/admin/product";
export default {
  // 获取SKU所有信息列表
  getPageList(page, limit) {
    return request({
      url: `${api_name}/list/${page}/${limit}`,
      method: "GET"
    })
  },
  // 获取当前id的sku信息
  getSkuIdInfo(skuId) {
    return request({
      url: `${api_name}/getSkuById/${skuId}`,
      method: "GET",
    })
  },
  // 删除sku
  delSku(skuId) {
    return request({
      url: `${api_name}/deleteSku/${skuId}`,
      method: "DELETE",
    })
  },
  // 上架功能
  onSale(skuId) {
    return request({
      url: `${api_name}/onSale/${skuId}`,
      method: "GET"
    })
  },
  // 下架功能
  cancelSale(skuId) {
    return request({
      url: `${api_name}/cancelSale/${skuId}`,
      method: "GET",
    })
  }
}
