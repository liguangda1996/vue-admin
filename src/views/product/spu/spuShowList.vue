<template>
  <div>
    <el-card style="margin-top:20px">
      <el-button type="primary" icon="el-icon-plus" @click="addSPU" :disabled="isAddSpu">添加SPU</el-button>
      <el-table :data="spuList" border v-loading="loading" style="width: 100%;margin-top:20px">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="spuName" label="SPU名称"></el-table-column>
        <el-table-column label="SPU描述" prop="description"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              title="添加SKU"
              @click="$emit('isShowSkuForm',{...row, ...category})"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="$emit('isShowUpdateList',row)"
              title="修改SPU"
            ></el-button>
            <el-button type="info" icon="el-icon-info" size="mini" title="查看所有SKU"></el-button>
            <el-popconfirm :title="`确定删除 ${row.spuName} 吗`" @onConfirm="delSpu(row)">
              <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference" ></el-button>
            </el-popconfirm>
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
  name: "SpuShowList",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: ""
      },
      spuList: [],
      page: 1,
      limit: 5,
      total: 0,
      loading: false,
      isAddSpu: true
    };
  },
  methods: {
    handleSizeChange(limit) {
      this.getPageList(1, limit); // 每次改变数据条数，就回到第一页
    },
    handleCurrentChange(page) {
      this.getPageList(page, this.limit);
    },
    // 获取SPU列表
    async getPageList(page, limit) {
      //this.loading = true;
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id
      });
      console.log(result);

      if (result.code === 200) {
        this.loading = true;
        this.$message.success("SPU数据列表请求成功");
        this.spuList = result.data.records;
        this.page = result.data.current;
        this.total = result.data.total;
        this.limit = result.data.size;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    // 处理三级分类选择
    handleCategoryChange(category) {
      this.category = category;
      this.getPageList(this.page, this.limit);
      this.isAddSpu = false; // 获取SPU页面，让其可以点击
    },
    // 添加SPU按钮事件
    addSPU() {
      this.$emit("isShowUpdateList", this.category);
    },
    // 删除按钮功能
    delSpu(row) {
      this.$API.spu.deleteSpu(row.id);
      this.getPageList(this.page,this.limit);
    }
  },
  mounted() {
    this.$bus.$on("change", this.handleCategoryChange);
  },
  beforeDestroy() {
    this.$bus.$off("change", this.handleCategoryChange);
  }
};
</script>

<style lang="sass" scoped>
.trademark-img
  width: 80px
</style>
