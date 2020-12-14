<template>
  <div>
    <!-- 三级分类 -->
    <el-card>
      <el-form :inline="true" :model="category">
        <el-form-item label="一级分类">
          <el-select v-model="category.category1Id" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="category.category2Id" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="category.category3Id" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 添加SPU -->
    <el-card style="margin-top:20px" >
      <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
      <el-table :data="attrList" border style="width: 100%;margin-top:20px">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="tmName" label="SPU名称" ></el-table-column>
        <el-table-column label="SPU描述"></el-table-column>
        <el-table-column label="操作" >
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
  name: "SpuList",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: ""
      },
      attrList: [],
      page: 1,
      limit: 5,
      total: 0
    };
  },
  methods:{
    handleSizeChange(){},
    handleCurrentChange(){}
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
