<template>
  <div>
    <el-button type="primary" class="el-icon-plus"> 添加SPU</el-button>
    <el-table v-loading="loading" border :data="spuList" style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot="{ row, $index }">
          <el-button type="primary" icon="el-icon-plus" size="mini"></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$emit('showUpdateList', row)"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delSpu(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      @size-change="getTrademarkList(page, limit)"
      @current-change="getTrademarkList(page, limit)"
      :current-page.sync="page"
      :page-size.sync="limit"
      :page-sizes="[3, 6, 9]"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
      class="pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "SpuShowList",
  data() {
    return {
      spuList: [],
      page: 1,
      limit: 6,
      total: 0,
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      loading: false,
    };
  },
  methods: {
    // 删除SPU
    async delSpu(row, index) {
      console.log(row);
      const { id } = row;
      if (confirm("Are You Sure?")) {
        const result = await this.$API.spu.delSpu(id);
         console.log(result)
        this.spuList.splice(index, 1);
      }
    },
    //   分页器
    async getTrademarkList(page, limit) {
      this.loading = true;
      const result = await this.$API.trademark.getTrademarkList(page, limit);
      if (result.code === 200) {
        // this.$message.success("获取品牌列表成功");
        this.trademarkList = result.data.records;
        this.total = result.data.total; // 总数
        this.getShowList(page, limit);
      } else {
        this.$message.error("获取品牌列表失败");
      }
      this.loading = false;
    },
    // 获取分页展示列表
    async getShowList(page, limit) {
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      });
      if (result.code === 200) {
        this.$message.success("获取spu分页列表成功");
        this.spuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error("获取spu分页列表失败");
      }
    },
    // 处理category的change
    handleCatetoryChange(category) {
      // 触发事件 会将分类id传递过来
      this.category = category;
      this.getShowList(this.page, this.limit);
    },
    // 清空数据
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.limit = 6;
      this.total = 0;
      this.category.category3Id = "";
    },
  },
  mounted() {
    // 获取spu分页列表
    this.$bus.$on("change", this.handleCatetoryChange);
    this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    //   清除绑定的全局事件
    this.$bus.$off("change", this.handleCatetoryChange);
    this.$bus.$off("clearList", this.clearList);
  },
};
</script>

<style lang="less" scoped>
</style>
