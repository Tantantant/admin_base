<template>
  <div>
    <el-card class="box-card">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="序号" width="80"> </el-table-column>
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="address" label="描述"> </el-table-column>
        <el-table-column prop="address" label="默认图片" width="148">
        </el-table-column>
        <el-table-column prop="address" label="重量(KG)"> </el-table-column>
        <el-table-column prop="address" label="价格(元)" width="80">
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template>
            <el-button size="mini" type="success" class="el-icon-bottom"></el-button>
            <el-button size="mini" type="primary" class="el-icon-edit"></el-button>
            <el-button size="mini" type="info" class="el-icon-info"></el-button>
            <el-button size="mini" type="danger" class="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      class="pagination"
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "SkuList",
  data() {
    return {
      tableData: [],
      total: 0, // 总数
      page: 1, // 页码
      limit: 3, // 每页条数
    };
  },
  methods: {
    // async getPageList(page, limit) {
    //   this.loading = true;
    //   const result = await this.$API.trademark.getPageList(page, limit);
    //   if (result.code === 200) {
    //     this.$message.success("获取品牌分页列表成功");
    //     this.limit = result.data.size; // 代表每页显示的条数
    //     this.page = result.data.current; // 代表当前页码
    //     this.trademarkList = result.data.records;
    //     this.total = result.data.total; // 总数
    //   } else {
    //     this.$message.error("获取品牌分页列表失败");
    //   }
    //   this.loading = false;
    // },
  },
  mounted() {
    // this.getPageList(this.page, this.limit);
  },
};
</script>
