<template>
  <div>
    <Catetory @change="getAttrList" :disabled="!isShowAttr" />
    <el-card class="box-card" style="margin: 20px 0" v-show="isShowAttr">
      <el-button type="primary" class="el-icon-plus"> 添加属性</el-button>
      <el-table border :data="attrList" style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              type="info"
              v-for="valueList in row.attrValueList"
              :key="valueList.id"
              >{{ valueList.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改 -->
    <el-card class="box-card" style="margin: 20px 0" v-show="!isShowAttr">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" class="el-icon-plus" @click="addAttrValue">
        添加属性</el-button
      >
      <el-table
        border
        :data="attr.attrValueList"
        style="width: 100%"
        class="attrList_table"
      >
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <el-input
              v-if="row.edit"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
              v-model="row.valueName"
              autofocus
              ref="input"
              size="mini"
            ></el-input>
            <span
              v-else
              @click="edit(row)"
              style="width: 100%; display: block"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`确定删除${row.valueName}吗？`"
              @onConfirm="delAttr($index)"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="saveAttr">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-card>

    <!-- 添加 -->
    <!-- <el-card class="box-card" style="margin: 20px 0" v-show="!isShowAttr">
      <el-form inline>
        <el-form-item label="属性名ddd" prop="attrName">
          <el-input></el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" class="el-icon-plus" >
        添加</el-button
      >
      <el-table border style="width: 100%" class="attrList_table">
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column label="属性值名称"> </el-table-column>
        <el-table-column label="操作"> </el-table-column>
      </el-table>
    </el-card> -->
  </div>
</template>

<script>
import Catetory from "./catetory";
export default {
  name: "AttrList",
  data() {
    return {
      attrList: [],
      isShowAttr: true,
      attr: {
        attrName: "",
        attrValueList: [],
        edit: true,
      },
    };
  },
  methods: {
    // 添加属性
    // addattrs() {
    //   console.log(111)
    //   this.isShowAttr = false;
    // },
    // 取消
    cancel() {
      this.isShowAttr = true;
    },
    editCompleted(row, index) {
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        // this.$message.warning("请输入属性值名称");
        return;
      }
      row.edit = false;
    },
    // 删除
    delAttr(index) {
      this.attr.attrValueList.splice(index, 1);
    },
    // 保存
    async saveAttr() {
      const result = await this.$API.attrs.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.$message.success("更新数据成功");
        this.$API.attrs.saveAttrInfo(this.attr);
        this.isShowAttr = true;
        this.getAttrList(this.catetory);
      } else {
        this.$message.error(result.message);
      }
    },
    // 添加属性值
    addAttrValue() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
        this.isShowAttr = true
    },
    // 获取焦点
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 修改属性值
    update(attr) {
      // ...attr  防止attr发生变化时修改原数据
      // this.attr = { ...attr };
      // 深度克隆，防止对象中对象还存在引用关系
      this.attr = JSON.parse(JSON.stringify(attr));
      this.isShowAttr = false;
    },
    async getAttrList(catetory) {
      this.catetory = catetory;
      const result = await this.$API.attrs.getAttrList(catetory);
      if (result.code === 200) {
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },

  components: {
    Catetory,
  },
};
</script>

<style lang="sass" scope>
.attrList_table
  margin: 20px 0
</style>