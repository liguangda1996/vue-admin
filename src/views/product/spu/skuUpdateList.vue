<template>
  <div>
    <el-form :model="form" label-width="80px">
      <el-form-item label="SPU 名称">
        <span>xxx</span>
      </el-form-item>
      <el-form-item label="SKU 名称">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-select placeholder="请输入" label="屏幕尺寸">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        <el-select placeholder="请输入" label="价格">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        <el-select placeholder="请输入" label="家用电器">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select placeholder="请输入" label="选择颜色">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        <el-select placeholder="请输入" label="选择版本">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table ref="multipleTable" tooltip-effect="dark" style="width: 100%" border>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="图片">
            <template>
              <img src alt style="width:100px;height:100px;" />
            </template>
          </el-table-column>
          <el-table-column label="名称"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuUpdateList",
  data() {
    return {
      form: []
    };
  }
};
</script>

<style lang="less" scoped>
</style>
