<template>
  <div>
    <el-card style="margin-top:20px">
      <el-form :model="spu" label-width="80px">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="spu.tmId" placeholder="请选择品牌">
            <el-option v-for="tm in trademarkList" :key="tm.id" :label="tm.tmName" :value="tm.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
          <el-input type="textarea" v-model="spu.description" placeholder="SPU描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="spuImageList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="visible">
            <img width="100%" :src="preImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select :placeholder="`还有${filterBaseSaleAttrList.length}个未选择`" v-model="attrIdName">
            <el-option
              v-for="attr in filterBaseSaleAttrList"
              :key="attr.id"
              :label="attr.name"
              :value="attr.id + ':' + attr.name"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            class="el-icon-plus"
            :disabled="!attrIdName"
            @click="addspuSaleAttr"
          >添加销售属性</el-button>
        </el-form-item>
        <el-form-item>
          <el-table :data="spuSaleAttrList" border style="width: 100%;margin-top:20px">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="saleAttrName" label="属性名称" width="150"></el-table-column>
            <el-table-column label="属性值列表">
              <template slot-scope="{row}">
                <el-tag
                  v-for="attrVal in row.spuSaleAttrValueList"
                  :key="attrVal.id"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                  style="margin-left:5px"
                >{{ attrVal.saleAttrValueName }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>

            </el-table-column>
            <el-table-column v-slot="{row,$index}" label="操作" width="150px">
              <!-- 删除属性按钮 -->
              <el-popconfirm
                :title="`确定删除 ${row.attrName} 吗`"
                @onConfirm="spuSaleAttrList.splice($index, 1)"
              >
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuUpdateList",
  props: {
    spuInfo: Object
  },
  data() {
    return {
      attrList: [],
      spu: this.spuInfo,
      visible: false,
      preImageUrl: "",
      inputVisible:false,
      inputValue:'',
      trademarkList: [], // 获取全部品牌信息
      spuImageList: [], // 获取对应商品图片
      spuSaleAttrList: [], //商品所有销售属性
      baseSaleAttrList: [], // 获取对应品牌得基本属性
      attrIdName: "" // 用来收集销售属性的name和id
    };
  },
  computed: {
    filterBaseSaleAttrList() {
      return this.baseSaleAttrList.filter(base => {
        return !this.spuSaleAttrList.find(
          spu => spu.baseSaleAttrId === base.id
        );
      });
    }
  },
  methods: {
      // 处理标签点击删除按钮
      handleClose(tag) {
        this.row.spuSaleAttrValueList.splice(this.row.spuSaleAttrValueList.indexOf(tag), 1);
      },
    // 添加销售属性按钮事件
    addspuSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdName.split(":");
      const spuSaleValue = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [] // 用来保存对应的标签
      };
      this.spuSaleAttrList.push(spuSaleValue);
      // 删除收集的attrIdName
      this.attrIdName = "";
    },
    // 处理删除
    handleRemove(file, fileList) {
      this.spuImageList = this.spuImageList.filter(img => img.id !== file.id);
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.preImageUrl = file.url;
      this.visible = true;
    },
    handleRemove() {},
    // 取消按钮事件
    cancel() {
      this.$emit("isShowlist");
    },
    // 获取全部品牌信息
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("品牌加载完成");
        this.trademarkList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取对应品牌的图片列表
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("品牌图片加载完成");
        this.spuImageList = result.data.map(img => {
          return {
            id: img.id,
            name: img.imgName,
            url: img.imgUrl
          };
        });
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有销售属性
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("品牌图片加载完成");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取对应品牌得基本属性
    async getBaseSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList();
      if (result.code === 200) {
        this.$message.success("品牌图片加载完成");
        this.baseSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    }
  },

  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getBaseSaleAttrList();
  }
};
</script>

<style lang="less" scoped>
</style>
