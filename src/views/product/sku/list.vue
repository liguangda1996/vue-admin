<template>
  <div>
    <el-card style="margin-top:20px">
      <el-table :data="attrList" border resizable="false" stripe>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="tmName" label="名称" width="150"></el-table-column>
        <el-table-column label="描述" width="150"></el-table-column>
        <el-table-column label="默认图片" width="150"></el-table-column>
        <el-table-column label="重量(KG)" width="150"></el-table-column>
        <el-table-column label="价格(元)" width="150"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="warning" icon="el-icon-edit">修改</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        class="trademark-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :current-page="page"
        :page-size="limit"
        layout="prev, pager, next, jumper, sizes, total"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SKuList",
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0
    };
  }
};
</script>

<style lang="sass" scoped>
.trademark-img
  width: 80px
.trademark-pagination
  text-align: right
/deep/.el-pagination__sizes
  margin-left: 200px
</style>
