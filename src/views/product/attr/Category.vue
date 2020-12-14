<template>
  <div>
    <!-- 三级分类 -->

      <el-form inline :model="category" >
        <el-form-item label="一级分类">
          <el-select v-model="category.category1Id" @change="handleSelecet1" placeholder="请选择">
            <el-option v-for="c1 in category1List" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="category.category2Id" @change="handleSelecet2" placeholder="请选择">
            <el-option v-for="c2 in category2List" :label="c2.name" :key="c2.id" :value="c2.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="category.category3Id" @change="handleSelecet3" placeholder="请选择">
            <el-option v-for="c3 in category3List" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      category: {
        category1Id: "", // 1级id
        category2Id: "",
        category3Id: ""
      },
      category1List: [], // 1级数据
      category2List: [],
      category3List: []
    };
  },
  methods: {
    // 获取二级分类
    async handleSelecet1(category1Id) {
      this.category.category2Id = "";
      this.category.category3Id = "";
      this.category2List = [];
      this.category3List = [];
      //console.log(category1Id);
      const result = await this.$API.attrs.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    async handleSelecet2(category2Id) {
      this.category.category3Id = "";
      this.category3List = [];
      const result = await this.$API.attrs.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    async handleSelecet3(category3Id) {
      const category = {
        ...this.category,
        category3Id
      };
      // 子组件给父组件传递参数 自定义事件
        this.$emit("change", category);

    }
  },
  async mounted() {
    // 一级分类要上来就加载
    const result = await this.$API.attrs.getCategory1();
    if (result.code === 200) {
      this.category1List = result.data;
    } else {
      this.$message.error("数据请求失败");
    }
    console.log(result);
  }
};
</script>

<style lang="less" scoped>
</style>

