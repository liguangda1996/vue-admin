
import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark";

export default {
  /*
 获取商品品牌分页列表
 */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'GET',
    })
  },
  /*
 新增商品品牌
 */
  addTrateMark(data) {
    return request({
      url: `${api_name}/save`,
      method: 'POST',
      data,
    })
  },
  /*
 修改商品品牌
 */
  updateTrateMark(data) {
    return request({
      url: `${api_name}/update`,
      method: 'PUT',
      data,
    })
  },
  /*
删除商品品牌
*/
  delTrateMark(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'DELETE',
    })
  },

}
