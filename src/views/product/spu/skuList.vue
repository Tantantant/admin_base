<template>
  <el-card>
    <el-form label-width="100px" :model="spu" :rules="rules" ref="spuForm">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input-number
          v-model="price"
          align="left"
          style="width: 300px"
          placeholder="请输入价格"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number
          v-model="weight"
          style="width: 300px"
          placeholder="请输入重量"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="请输入规格描述"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          class="skulist-select-container"
          v-for="attr in attrList"
          :key="attr.id"
        >
          <span>{{ attr.attrName }}</span>
          <el-select
            placeholder="请选择"
            v-for="attrValue in attr.attrValueList"
            :key="attrValue.id"
          >
            <el-option>{{ attrValue.valueName }}</el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div
          class="skulist-select-container"
          v-for="saleList in spuSaleAttrList"
          :key="saleList.id"
        >
          <span>{{ saleList.saleAttrName }}</span>
          <el-select
            placeholder="请选择"
            v-for="sale in saleList.spuSaleAttrValueList"
            :key="sale.id"
          >
            <el-option>{{ sale.saleAttrValueName }}</el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          ref="multipleTable"
          border
          :data="imageList"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px 0"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" prop="isCheck">
          </el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }"
              ><img :src="row.imgUrl" :alt="row.imgName" style="width: 100px"
            /></template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button type="primary" size="mini">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {mapState} from 'vuex'
export default {
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem,
      rules: {},
      imageList: [],
      spuSaleAttrList: [],
      attrList: [],
      price: 1,
      weight: 1,
    };
  },
    computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    handleSelectionChange() {},
    // 获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("获取所有图片成功~");
        // 处理数据
        // [{imgName: '', imgUrl: ''}]
        // [{name: '', url: ''}]
        this.imageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取SPU销售属性列表成功~");
        // 处理数据
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有平台属性列表
    async getAttrList() {
      const result = await this.$API.attrs.getAttrList(this.category);
      if (result.code === 200) {
        this.$message.success("获取所有平台属性列表成功~");
        // 处理数据
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getAttrList();
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left

.skulist-select-container
  display: inline-block
  margin-right: 20px
</style>
