<template>
  <div>
    <!-- sku信息表格 -->
    <skuForm v-if="isShowSku" :spuItem="spuItem" @isShowSkuForm="isShowSkuForm" />
    <div v-else>
      <!-- 三级分类 -->
      <Category :disabled="!isShowList" />
      <!-- SPU信息列表 -->
      <SpuShowList
        v-if="isShowList"
        @isShowUpdateList="isShowUpdateList"
        @isShowSkuForm="isShowSkuForm"
      />
      <!-- 添加spu 信息表格 -->
      <SpuUpdateList v-else @isShowlist="isShowlist" :spuInfo="spuInfo" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import skuForm from "./skuForm";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      isShowSku: false,
      spuInfo: {},
      spuItem: {}
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    skuForm
  },
  methods: {
    isShowUpdateList(row) {
      this.isShowList = false;
      this.spuInfo = { ...row };
    },
    isShowlist() {
      this.isShowList = true;
    },
    isShowSkuForm(row) {
      this.isShowSku = !this.isShowSku;
      this.spuItem = { ...row };
    }
  },
  mounted() {}
};
</script>

<style lang="sass" scoped>
</style>
