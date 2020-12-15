<template>
  <div>
    <!-- 三级分类 -->
    <Category :disabled="!isShowList"/>
    <!-- SPU信息列表 -->
    <SpuShowList v-if="isShowList" @isShowUpdateList="isShowUpdateList" />
    <!-- 添加spu 信息表格 -->
    <SpuUpdateList v-else @isShowlist="isShowlist" :spuInfo="spuInfo"  />
      <!-- sku信息表格 -->
    <SkuUpdateList />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SkuUpdateList from "./skuUpdateList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      isShowSku:false,
      spuInfo: {},
      // categoryId:{},
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SkuUpdateList
  },
  methods: {
    isShowUpdateList(row) {
      this.isShowList = false;
      this.spuInfo = { ...row };
    },
    isShowlist() {
      this.isShowList = true;
    },
    isShowSkuList() {
      this.isShowSku = true
    }
  },
  mounted() {}
};
</script>

<style lang="sass" scoped>
</style>
