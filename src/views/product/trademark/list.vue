<template>
  <div>
    <el-button type="primary" class="el-icon-plus">添加</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="trademard-table"
      
    >
      <el-table-column prop="id" label="序号" width="80" align="center"> </el-table-column>
      <el-table-column prop="name" label="品牌名称">
      </el-table-column>
      <el-table-column prop="logo" label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logo" alt="" class="trademark-img" />
          <div slot="reference" class="name-wrapper"></div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template>
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, scope.row)"
            class="el-icon-edit"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            class="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
      <el-pagination 
        layout="  prev, pager, next, jumper"
        :total="30"
        class="pagination"
      >
      </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "nike",
          logo:
            "https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1819216937,2118754409&fm=26&gp=0.jpg",
        },
      ],
    };
  },
};
</script>
<style lang="sass">
.trademard-table
  margin: 20px 0
.trademark-img
  width: 90px
.pagination
  text-align: right
.pagination .el-pagination__jump
    margin-left: 500px
</style>