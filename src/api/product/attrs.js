
import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
 获取商品属性一级分页列表
 */
  getCategory1() {
    return request({
      url: `${api_name}/getCategory1`,
      method: 'GET',
    })
  },
  /*
获取商品属性二级分页列表
*/
  getCategory2(getcategory1Id) {
    return request({
      url: `${api_name}/getCategory2/${getcategory1Id}`,
      method: 'GET',
    })
  },
  /*
获取商品属性三级级分页列表
*/
  getCategory3(getcategory2Id) {
    return request({
      url: `${api_name}/getCategory3/${getcategory2Id}`,
      method: 'GET',
    })
  },
  /*
 获取商品对应属性列表
 */
  getAttrInfoList({ category1Id, category2Id, category3Id }) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: 'GET',
    })
  },
  /*
添加商品属性
*/
  saveAttrInfo(attr) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: 'POST',
      data:attr,
    })
  },
  /*
 删除商品属性
 */
  delAttrInfo(attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method: 'DELETE',
    })
  },

}
