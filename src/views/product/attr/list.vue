<template>
  <div>
    <Catetory @change="getAttrList" />
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

      <el-button type="primary" class="el-icon-plus"> 添加属性</el-button>
      <el-table
        border
        :data="attr.attrValueList"
        style="width: 100%"
        class="attrList_table"
      >
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{row}">
            <span>{{row.valueName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
    </el-card>
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
      },
    };
  },
  methods: {
    update(attr) {
      // ...attr  防止attr发生变化时修改原数据
      this.attr = { ...attr };
      this.isShowAttr = false
    },
    getAttrList(attrList) {
      this.attrList = attrList;
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