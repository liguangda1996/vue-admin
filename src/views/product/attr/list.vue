<template>
  <div>
    <el-card>
      <Category :disabled="!isShow" />
    </el-card>
    <!-- 添加属性 -->
    <el-card v-show="isShow" style="margin-top:20px">
      <!-- 属性列表 -->
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttr"
        :disabled="!category.category3Id"
      >添加属性</el-button>
      <el-table :data="attrList" border style="width: 100%;margin-top:20px">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              v-for="attrName in row.attrValueList"
              :key="attrName.id"
              style="margin-left:5px"
            >{{ attrName.valueName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-slot="{row}" label="操作" width="150px">
          <!-- 编辑属性按钮 -->
          <el-button type="warning" @click="updateAttr(row)" icon="el-icon-edit" size="mini"></el-button>
          <!-- 删除属性按钮 -->
          <el-popconfirm :title="`确定删除 ${row.attrName} 吗`" @onConfirm="delAttrValue(row.id)">
            <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
          </el-popconfirm>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改属性 -->
    <el-card v-show="!isShow" style="margin-top:20px">
      <el-form inline :model="attr">
        <el-form-item label="属性名" prop="attrName">
          <el-input inline v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>

      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttrValue"
        :disabled="!attr.attrName"
      >添加属性值</el-button>
      <el-table :data="attr.attrValueList" border style="width: 100%;margin:20px 0">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              @blur="editComplete(row, $index)"
              @keyup.enter.native="editComplete(row, $index)"
              ref="input"
              size="mini"
            ></el-input>
            <span v-else @click="edit(row)" style="display:block; width:100%">{{row.valueName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-slot="{row, $index}">
          <el-popconfirm
            :title="`确定删除 ${row.valueName} 吗`"
            @onConfirm="attr.attrValueList.splice($index, 1)"
          >
            <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
          </el-popconfirm>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        @click="save"
        :disabled="!attr.attrName || attr.attrValueList.length === 0"
      >保存</el-button>
      <el-button @click="isShow = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "@/components/Category";

export default {
  name: "AttrList",
  data() {
    return {
      attrList: [],
      attr: {
        attrName: "",
        attrValueList: []
        /* categoryId: "", // 当前第3级分类ID
        categoryLevel: 3 // 分类级别 */
      },
      isShow: true,
      category: {
        category1Id: "", // 1级id
        category2Id: "",
        category3Id: ""
      }
    };
  },
  methods: {
    // 切换id时清空数据
    clearattrList() {
      this.attrList = [];
      this.category.category3Id = "";
    },
    // 删除属性
    async delAttrValue(id) {
      const result = await this.$API.attrs.delAttrInfo(id);
      this.$message.success(result.message || "删除属性成功");
      this.getAttrList(this.category);
    },
    // 判断输入框中是否为空，为空就删除
    editComplete(row, index) {
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    // 添加属性值/修改标签 （点击保存按钮触发）
    async save() {
      if (this.attr.attrValueList.length === 0) {
        this.$message.warning("至少指定一个属性值名称");
        return;
      }
      const result = await this.$API.attrs.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.$message.success("更新属性成功");
        this.isShow = true; // 切回属性列表
        this.getAttrList(this.category);
      } else {
        this.$message.error(result.message);
      }
    },
    // 添加属性按钮 事件
    addAttr() {
      // 重置数据
      this.attr = {
        attrName: "", // 属性名
        attrValueList: [], // 属性值列表
        categoryId: this.category.category3Id, // 当前第3级分类ID
        categoryLevel: 3 // 分类级别
      };
      /* this.attr.attrName = "";
      this.attr.attrValueList =[];
      this.attr.categoryId= this.category.category3Id;
      this.attr.categoryLevel=3; */
      this.isShow = false;
    },
    // 添加属性值
    addAttrValue() {
      this.attr.attrValueList.push({ edit: true }); // 当有了edit 为true才会有输入框
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 是否选中了修改属性 （添加一个edit属性来控制输入框的显示）
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        //虽然添加了属性，渲染是异步的，所以要等渲染完成有了DOM结构，聚焦才有用。 要让edit有了才行
        this.$refs.input.focus();
      });
    },
    // 修改属性（修改按钮触发）
    updateAttr(row) {
      this.isShow = false;
      // 防止row变化时修改原数据（直接修改了原数据，就渲染到了页面上）
      // this.attr = { ...row };
      // 深度克隆 防止对象中的对象还存在引用关系
      this.attr = JSON.parse(JSON.stringify(row));
    },
    // 得到对应的属性列表
    async getAttrList(category) {
      this.category = category;
      this.attr.categoryId = category.category3Id; // 把三级id 给到 attr里面的id
      const result = await this.$API.attrs.getAttrInfoList(category);
      if (result.code === 200) {
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    }
  },
  mounted() {
    this.$bus.$on("change", this.getAttrList);
    this.$bus.$on("clear", this.clearattrList);
  },
  beforeDestroy() {
    // 通常情况下：清除绑定的全局事件
    this.$bus.$off("change", this.getAttrList);
    this.$bus.$off("clear", this.clearattrList);
  },
  components: {
    Category
  }
};
</script>
