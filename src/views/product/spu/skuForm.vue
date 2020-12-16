<template>
  <el-card>
    <div>
      <el-form :model="sku" label-width="80px">
        <el-form-item label="SPU 名称" prop="spuName">
          <span>{{sku.spuName}}</span>
        </el-form-item>
        <el-form-item label="SKU 名称">
          <el-input v-model="sku.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <el-input-number controls-position="right" :min="1" :max="10" v-model="sku.price"></el-input-number>
        </el-form-item>
        <el-form-item label="重量(千克)">
          <el-input-number controls-position="right" :min="1" v-model="sku.weight"></el-input-number>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input type="textarea" v-model="sku.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
          <el-form inline>
            <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
              <el-select placeholder="请输入" v-model="attr.attrValueId">
                <el-option
                  v-for="value in attr.attrValueList"
                  :key="value.id"
                  :label="value.valueName"
                  :value="attr.id + ':' + value.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>

        <el-form-item label="销售属性">
          <el-form inline>
            <el-form-item :label="sale.saleAttrName" v-for="sale in spuSaleAttrList" :key="sale.id">
              <el-select placeholder="请输入" v-model="sale.saleAttrValueId">
                <el-option
                  v-for="value in sale.spuSaleAttrValueList"
                  :key="value.id"
                  :label="value.saleAttrValueName"
                  :value="sale.id + ':' + value.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>

        <el-form-item label="图片列表">
          <el-table
            ref="multipleTable"
            tooltip-effect="dark"
            style="width: 100%"
            border
            :data="spuImageList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="图片">
              <template slot-scope="{row}">
                <img :src="row.imgUrl" alt style="width:100px;height:100px;" />
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="imgName"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row }">
                <el-tag type="success" v-if="row.isDefault==='1'">默认</el-tag>
                <el-button v-else type="primary" @click="setDefaultImg(row)">设为默认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveSpu">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "SkuForm",
  props: {
    spuItem: Object
  },
  data() {
    return {
      spu: this.spuItem,
      sku: {
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",
        //"category3Id": 0,
        // "tmId": 0 // 品牌id
        // spuId:"", // "id": 0,

        skuDefaultImg: null, // sku 默认图片
        skuImageList: [], // sku 图片列表
        skuAttrValueList: [], // 平台属性列表
        skuSaleAttrValueList: [] // 销售属性列表
      },
      attrInfoList: [], // 平台属性
      spuSaleAttrList: [], // 销售属性列表
      spuImageList: [], // 图片列表
      SelectionspuImageList: [] // 选中的图片列表
    };
  },
  methods: {
    // 获取平台属性
    async getAttrInfoList() {
      const { category1Id, category2Id, category3Id } = this.spu;
      const result = await this.$API.attrs.getAttrInfoList({
        category1Id,
        category2Id,
        category3Id
      });
      if (result.code === 200) {
        this.$message.success("平台属性成功");
        this.attrInfoList = result.data;
      }
    },
    // 获取所有销售属性
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.spuSaleAttrList = result.data;
      }
    },
    // 获取对应品牌的图片列表
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        //this.$message.success("品牌图片加载完成");
        this.spuImageList = result.data.map((img) => {
          img.isDefault = '0'; // 设置一个属性判断是否被选为默认
          return img;
        });
      }
    },
    // 取消按钮事件，返回列表，并请求列表信息
    cancel() {
      this.$emit("isShowSkuForm");
      this.$nextTick(() => {
        /* const  category3Id  = this.spu;
        this.$bus.$emit("change", category3Id); */
        this.$bus.$emit("change", { category3Id: this.spu.category3Id });
      });
    },
    async saveSpu() {

      const {
        sku,
        attrInfoList,
        spuSaleAttrList,
        SelectionspuImageList
      } = this;
      // 平台属性收集 attrValueId
      attrInfoList.forEach(attr => {
        if (attr.attrValueId) {
          // 判断选择框的值是否为空，不为空证明有值，就添加
          const [attrId, id] = attr.attrValueId.split(":");
          sku.skuAttrValueList.push({
            attrId, // 平台属性类名有唯一id
            id // 每个类名下对应的选项也有属性唯一id
          });
        }
      });

      // 销售属性收集 sale.saleAttrValueId 其中 saleAttrValueId的值是根据选择的数据来决定的，比如：选择不同的颜色，它就会对应选中的这个颜色的id
      spuSaleAttrList.forEach(sale => {
        if (sale.saleAttrValueId) {
          const [id, saleAttrValueId] = sale.saleAttrValueId.split(":");
          sku.skuSaleAttrValueList.push({
            id,
            saleAttrValueId
          });
        }
      });

      // 图片数据收集
      sku.skuImageList = SelectionspuImageList.map(img => {
        return {
          imgName: img.imgName,
          imgUrl: img.imgUrl,
          id: img.id,
          isDefault: img.isDefault
        };
      });

      await this.$API.spu.saveSkuInfo(sku);
      this.$message.success("保存SKU成功");
      this.cancel();
    },
    // 处理选择图片
    handleSelectionChange(val) {
      this.SelectionspuImageList = val;
    },
    // 处理图片设置默认
    setDefaultImg(row) {
      console.log(row);

      this.spuImageList.forEach(img => img.isDefault === "0");
      row.isDefault = "1";
      this.sku.skuDefaultImg = row.imgUrl;
    }
  },
  mounted() {
    this.getAttrInfoList();
    this.getSpuSaleAttrList();
    this.getSpuImageList();
  }
};
</script>

<style lang="less" scoped>
</style>
