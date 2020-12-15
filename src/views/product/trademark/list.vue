<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    <el-dialog
      :title="`${tradeMarkForm.id ? '修改' :'添加' }品牌`"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <span>
        <el-form :model="tradeMarkForm" :rules="rules" ref="tradeMarkForm" label-width="100px">
          <el-form-item label="品牌名称" prop="tmName">
            <el-input v-model="tradeMarkForm.tmName"></el-input>
          </el-form-item>
          <el-form-item label="品牌LOGO" prop="logoUrl">
            <el-upload
              :action="`${$BASE_API}/admin/product/fileUpload`"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              class="avatar-uploader"
            >
              <img v-if="tradeMarkForm.logoUrl" :src="tradeMarkForm.logoUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span>只能上传jpg/png文件，且不超过50kb</span>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('tradeMarkForm')">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 品牌信息表格 -->
    <el-table
      :data="trademarkList.filter(data => !search || data.tmName.toLowerCase().includes(search.toLowerCase()))"
      v-loading="loading"
      border
      style="width: 100%;margin-top:20px"
    >
      <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" class="trademark-img" />
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button type="warning" icon="el-icon-edit" @click="update(scope.row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button>
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
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      trademarkList: [],
      page: 1,
      limit: 5,
      total: 0,
      dialogVisible: false, // 添加按钮 弹框使用的
      loading: false,
      tradeMarkForm: {
        tmName: "",
        logoUrl: ""
      },
      rules: {
        tmName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        logoUrl: [{ required: true, message: "请添加商品LOGO" }]
      },
      search: "" // 搜索数据
    };
  },
  methods: {
    // 获取商品品牌信息
    async getPageList(page, limit) {
      this.loading = true;
      const result = await this.$API.tratemark.getPageList(page, limit);
      if (result.code === 200) {
        this.$message.success("获取品牌分页列表成功");
        this.trademarkList = result.data.records;
        this.page = result.data.current; // 当前的页码
        this.limit = result.data.size; // 每页显示数据的条数
        this.total = result.data.total; // 总数据
      } else {
        this.$message.error("获取品牌分页列表失败");
      }
      this.loading = false;
    },
    handleSizeChange(limit) {
      this.getPageList(1, limit); // 每次改变数据条数，就回到第一页
    },
    handleCurrentChange(page) {
      this.getPageList(page, this.limit);
    },
    // 添加按钮
    add() {
      // 清空校验
      this.$refs.tradeMarkForm && this.$refs.tradeMarkForm.clearValidate();
      this.dialogVisible = true;
      this.tradeMarkForm = {
        tmName: "",
        logoUrl: ""
      }; //从修改 --> 到添加 要清空添加时的数据
    },
    // 商品LOGO上传成功的回调
    handleAvatarSuccess(res) {
      // console.log(res.data); // 图片地址
      this.tradeMarkForm.logoUrl = res.data;
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
    //提交表单 （提交按钮绑定的事件）
    submitForm(form) {
      // this.$API.tratemark.addTrateMark(data)
      this.$refs[form].validate(async valid => {
        if (valid) {
          //console.log(this.tradeMarkForm);
          const { tradeMarkForm, trademarkList } = this;
          const isUpdate = this.tradeMarkForm.id; // 看是否有id
          let result;
          if (isUpdate) {
            // 如果有商品id 那么就要执行修改请求 因为点击修改商品信息的按钮 能够获取到当前商品的id

            //console.log(result);
            const tm = trademarkList.find(tm => tm.id === tradeMarkForm.id);
            if (
              // 判断数据是否修改
              tm.tmName === tradeMarkForm.tmName &&
              tm.logoUrl === tradeMarkForm.logoUrl
            ) {
              this.$message.warning("不能提交未修改的数据");
              return;
            }
            result = await this.$API.tratemark.updateTrateMark(tradeMarkForm);
          } else {
            // 没有id就执行 添加请求 因为添加时并不需要商品id
            result = await this.$API.tratemark.addTrateMark(tradeMarkForm);
          }

          if (result.code === 200) {
            this.$message.success(`${isUpdate ? "修改" : "添加"}品牌数据成功`);
            this.dialogVisible = false; // 隐藏对话框
            this.getPageList(this.page, this.limit); // 请求加载新数据
          } else {
            return this.$message.error("添加失败");
          }
        }
      });
    },
    // 删除商品功能
    remove(id) {
      /* console.log("index",index); // index 为数组下标 row 里面是这一行的信息
      console.log("row",row); */

      this.$confirm("确认删除该商品吗?", "提示", {
        /* confirmButtonText: "确定",
        cancelButtonText: "取消", */
        type: "warning"
      })
        .then(async () => {
          await this.$API.tratemark.delTrateMark(id);
          await this.getPageList(this.page, this.limit); // 删除之后，更新页面数据
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改商品数据功能
    async update(row) {
      // 清空校验
      this.$refs.tradeMarkForm && this.$refs.tradeMarkForm.clearValidate();
      this.dialogVisible = true;
      /* this.tradeMarkForm.logoUrl = row.logoUrl; // 获取当前图片
      this.tradeMarkForm.tmName = row.tmName; // 获取当前的商品名称
      this.tradeMarkForm.id = row.id; */
      this.tradeMarkForm = { ...row }; // 不能直接this.tradeMarkForm = row，因为这样会让row直接等于this.tradeMarkForm 的引用地址，操作row时，原数据this.tradeMarkForm就会跟着变，造成页面改变
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
    margin-left: 170px

>>>.avatar-uploader .el-upload
    border: 1px dashed #d9d9d9
    border-radius: 6px
    cursor: pointer
    position: relative
    overflow: hidden
    &:hover
        border-color: #409EFF

>>>.avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center

>>>.avatar
    width: 178px
    height: 178px
    display: block
</style>
