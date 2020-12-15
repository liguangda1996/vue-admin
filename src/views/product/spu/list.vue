<template>
  <div>
    <!-- 三级分类 -->
    <Category />
    <!-- SPU信息列表 -->
    <SpuShowList v-if="isShowList" @isShowUpdateList="isShowUpdateList" />
    <!-- 添加spu 信息表格 -->
    <SpuUpdateList v-else @isShowlist="isShowlist" :spuInfo="spuInfo"/>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      spuInfo: {}
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList
  },
  methods: {
    isShowUpdateList(row) {
      this.isShowList = false;
      this.spuInfo = { ...row };
    },
    isShowlist() {
      this.isShowList = true;
    }
  },
  mounted() {}
};
</script>

<style lang="sass" scoped>
</style>
