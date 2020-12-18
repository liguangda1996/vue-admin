<template>
  <div>
    <el-card style="margin-top:20px">
      <el-form :model="spu" label-width="80px" ref="spuForm" :rules="rules">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="spuId">
          <el-select v-model="spu.tmId" placeholder="请选择品牌">
            <el-option v-for="tm in trademarkList" :key="tm.id" :label="tm.tmName" :value="tm.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
          <el-input type="textarea" v-model="spu.description" placeholder="SPU描述"></el-input>
        </el-form-item>
        <el-form-item prop="imgList">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="formatImgList"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
          <el-dialog :visible.sync="visible">
            <img width="100%" :src="preImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性" prop="attr">
          <el-select :placeholder="`还有${filterBaseSaleAttrList.length}个未选择`" v-model="spu.attr">
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
            :disabled="!spu.attr"
            @click="addspuSaleAttr"
          >添加销售属性</el-button>

          <el-table :data="spuSaleAttrList" border style="width: 100%;margin-top:20px">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="saleAttrName" label="属性名称" width="150"></el-table-column>
            <el-table-column label="属性值列表">
              <template slot-scope="{row,$index}">
                <el-tag
                  v-for="(attrVal, index) in row.spuSaleAttrValueList"
                  :key="attrVal.id"
                  closable
                  :disable-transitions="false"
                  @close="delTag(index, row)"
                  style="margin-left:5px"
                >{{ attrVal.saleAttrValueName }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.edit"
                  v-model="inputValue"
                  ref="input"
                  size="small"
                  @blur="editComplete(row, $index)"
                  @keyup.enter.native="editComplete(row, $index)"
                  style="width:100px"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="edit(row)">+ 添加</el-button>
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
          <el-button type="primary" @click="updateSpu">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { category } from "../../../api";
export default {
  name: "SpuUpdateList",
  props: {
    spuInfo: Object
    // categoryId: Object,
  },
  data() {
    return {
      attrList: [],
      spu: this.spuInfo,
      // category3Id: this.categoryId.category3Id,
      visible: false,
      preImageUrl: "",
      inputVisible: false,
      inputValue: "",
      trademarkList: [], // 获取全部品牌信息
      spuImageList: [], // 获取对应商品图片
      spuSaleAttrList: [], //商品所有销售属性
      baseSaleAttrList: [], // 获取对应品牌得基本属性
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称名称" }],
        spuId: [{ message: "请输入品牌名称" }],
        description: [{ required: true, message: "请输入品牌描述" }],
        imgList: [{ validator: this.imgListValidate, required: true }],
        attr: [{ validator: this.attrValidate, required: true }]
      }
    };
  },
  computed: {
    // 格式化图片数据
    formatImgList() {
      return this.spuImageList.map(img => {
        return {
          // 一上来请求回来的数据只有id
          // 新添加的数据不能设置id（由后台设置），所以写的是uid,组件file或fileList中有
          // 总之，id一定由后台服务器生成
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl
        };
      });
    },
    // 过滤销售属性baseSaleAttrList
    filterBaseSaleAttrList() {
      return this.baseSaleAttrList.filter(base => {
        return !this.spuSaleAttrList.find(
          spu => spu.baseSaleAttrId === base.id
        );
      });
    }
  },
  methods: {
    // 图片列表校验
    imgListValidate(rule, value, callback) {
      if (this.spuImageList.length > 0) {
        callback();
      }
      callback(new Error("请至少上传一张图片"));
    },
    // 属性校验
    attrValidate(rule, value, callback) {
      // 至少添加一项销售属性
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error("请至少添加一项销售属性"));
        return;
      }
      // 至少输入一个属性值
      const check = this.spuSaleAttrList.some(
        item => item.spuSaleAttrValueList.length === 0
      );
      if (check) {
        callback(new Error("请至少输入一个属性值"));
        return;
      }

      callback();
    },
    // 更新属性 或添加
    updateSpu() {
      this.$refs.spuForm.validate(async valid => {
        if (valid) {
          const spu = {
            ...this.spu,
            spuImageList: this.spuImageList,
            spuSaleAttrList: this.spuSaleAttrList
          };
          let result;
          if (this.spu.id) {
            // 更新有id
            result = await this.$API.spu.updateSpuInfo(spu);
          } else {
            result = await this.$API.spu.saveSpuInfo(spu);
          }

          if (result.code === 200) {
            this.$message.success("更新属性成功");
            this.cancel(); // 跳回SPU列表
          } else {
            this.$message.error("更新属性失败");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      //
    },
    // 是否选中了修改属性 （添加一个edit属性来控制输入框的显示）
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        //虽然添加了属性，渲染是异步的，所以要等渲染完成有了DOM结构，聚焦才有用。 要让edit有了才行
        this.$refs.input.focus();
      });
    },
    // 判断输入框中是否为空，为空就删除
    editComplete(row, index) {
      if (this.inputValue) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.inputValue,
          spuId: row.spuId
        });
        this.inputValue = ""; // 输入完成后清空内容
      }
      row.edit = false;
    },
    // 商品LOGO上传前检验
    beforeAvatarUpload(file) {
      const imgTypes = ["image/jpeg", "image/png", "image/jpg"];
      // 检测文件类型
      const isTypes = imgTypes.indexOf(file.type) > -1;
      const isLimit = file.size / 1024 < 50;

      if (!isTypes) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLimit) {
        this.$message.error("上传头像图片大小不能超过 50kB!");
      }
      return isTypes && isLimit;
    },
    // 处理标签点击删除按钮
    delTag(index, row) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 添加销售属性按钮事件
    addspuSaleAttr() {
      // 选中的销售属性
      const { attr, id } = this.spu;
      const [baseSaleAttrId, saleAttrName] = attr.split(":");
      const spuSaleValue = {
        baseSaleAttrId: +baseSaleAttrId, // baseSaleAttrId结构后是字符串，所以要转成数字，不然上面的计算属性监测不到
        saleAttrName,
        spuId: id,
        spuSaleAttrValueList: [] // 用来保存对应的标签
      };
      this.spuSaleAttrList.push(spuSaleValue);
      // 删除收集的attrIdName
      this.spu.attr = "";
    },
    // 商品图片上传成功的回调
    handleAvatarSuccess(res, file) {
      // console.log(res,file,fileList); // 图片地址
      this.spuImageList.push({
        uid: file.uid,
        imgName: file.name, // 文件名称
        imgUrl: res.data, // 图片地址
        spuId: this.spu.id // SPU id
      });
      /* this.spuImageList = fileList; */
    },
    // 处理图片列表删除
    handleRemove(file, fileList) {
      //console.log(file, fileList);
      this.spuImageList = this.spuImageList.filter(
        img => img.imgName !== file.name
      );
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.preImageUrl = file.url;
      this.visible = true;
    },
    // 取消按钮事件 （跳回SPU列表）
    cancel() {
      this.$emit("isShowlist");
      this.$nextTick(() => {
        /* const  category3Id  = this.spu;
        this.$bus.$emit("change", category3Id); */
        this.$bus.$emit("change", {
          category1Id: this.spu.category1Id,
          category2Id: this.spu.category2Id,
          category3Id: this.spu.category3Id });
      });
    },
    // 获取全部品牌信息
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        //this.$message.success("品牌加载完成");
        this.trademarkList = result.data;
      }
    },
    // 获取对应品牌的图片列表
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        //this.$message.success("品牌图片加载完成");
        this.spuImageList = result.data;
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
    // 获取对应品牌得基本属性
    async getBaseSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList();
      if (result.code === 200) {
        //this.$message.success("品牌图片加载完成");
        this.baseSaleAttrList = result.data;
      }
    }
  },

  mounted() {
    this.getTrademarkList();
    this.getBaseSaleAttrList();
    if (this.spu.id) {
      this.getSpuImageList();
      this.getSpuSaleAttrList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
