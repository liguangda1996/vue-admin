<template>
  <div>
    <el-card style="margin-top:20px">
      <el-table :data="skuList" border resizable="false" stripe>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="skuName" label="名称" width="150"></el-table-column>
        <el-table-column prop="skuDesc" label="描述" width="150"></el-table-column>
        <el-table-column prop="skuDefaultImg" label="默认图片" width="150">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:80px" alt />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)" width="150"></el-table-column>
        <el-table-column prop="price" label="价格(元)" width="80"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <template>
              <el-button
                v-if="row.isSale === 1"
                type="success"
                icon="el-icon-bottom"
                size="mini"
                title="下架"
                @click="unlodeSku(row)"
              ></el-button>
              <el-button
                v-else
                type="info"
                icon="el-icon-top"
                size="mini"
                title="上架"
                @click="upload(row)"
              ></el-button>
            </template>
            <el-button type="primary" icon="el-icon-edit" size="mini" title="修改SPU"></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              title="查看详情"
              @click="skuDrawer(row)"
            ></el-button>

            <el-popconfirm :title="`确定删除 ${row.skuName} 吗`" @onConfirm="delSku(row)">
              <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-drawer :visible.sync="drawer" :with-header="false" size="50%">
        <el-row>
          <el-col :span="6">名称</el-col>
          <el-col :span="12">{{skuInfo.skuName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述</el-col>
          <el-col :span="12">{{skuInfo.skuDesc}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格</el-col>
          <el-col :span="12">{{skuInfo.price}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性</el-col>
          <el-col :span="12">
            <el-tag
              v-for="skuAttr in skuInfo.skuAttrValueList"
              :key="skuAttr.id"
            >{{skuAttr.valueId}}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">销售属性</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片</el-col>
          <el-carousel trigger="click" height="400px" indicator-position="none">
            <el-carousel-item
              v-for="img in skuInfo.skuImageList"
              :key="img.id"
              indicator-position="none"
            >
              <img :src="img.imgUrl" alt style="width:400px;height:400px" />
            </el-carousel-item>
          </el-carousel>
        </el-row>
      </el-drawer>

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
import { toObject } from "element-ui/lib/utils/util";
export default {
  name: "SKuList",
  data() {
    return {
      skuList: [],
      page: 1,
      limit: 5,
      total: 0,
      drawer: false,
      skuInfo: {},

    };
  },
  methods: {
    // 获取SKU信息列表
    async getPageList(page, limit) {
      const result = await this.$API.sku.getPageList(page, limit);
      if (result.code === 200) {
        this.$message.success("SKU信息获取成功");
        this.skuList = result.data.records;
        this.page = result.data.current;
        this.limit = result.data.size;
        this.total = result.data.total;
      } else {
        this.$message.error("SKU信息获取失败");
      }
    },
    handleSizeChange(limit) {
      this.getPageList(1, limit);
    },
    handleCurrentChange(page) {
      this.getPageList(page, this.limit);
    },
    // 删除sku
    async delSku(row) {
      const result = await this.$API.sku.delSku(row.id);
      this.$message.success("信息删除成功");
      this.getPageList(this.page, this.limit);
    },
    // sku详情功能
    async skuDrawer(row) {
      const result = await this.$API.sku.getSkuIdInfo(row.id);
      this.skuInfo = result.data;
      this.drawer = true;
    },
    // 下架功能按钮
    async unlodeSku(row) {
      const result = await this.$API.sku.cancelSale(row.id);
      row.isSale = 0;
      this.$message.warning("商品下架成功！")
    },
    // 上架功能按钮
    async upload(row) {
      const result = await this.$API.sku.onSale(row.id)
      row.isSale = 1;
      this.$message.success("商品上架成功！")
    }
  },
  mounted() {
    this.getPageList(this.page, this.limit);
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

.el-carousel__item h3
  color: #475669
  font-size: 14px
  opacity: 0.75
  line-height: 150px
  margin: 0

.el-carousel__item:nth-child(2n)
  background-color: #99a9bf

.el-carousel__item:nth-child(2n+1)
  background-color: #d3dce6
.el-row
  margin: 15px 65px
  font-size: 20px
  font-weight: 700
.el-carousel
  width: 400px
</style>
