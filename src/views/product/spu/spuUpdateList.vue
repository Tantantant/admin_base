<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form label-width="80px" :model="spu">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input
            placeholder="请输入SPU名称"
            v-model="spu.spuName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="tmId">
          <el-select v-model="spu.tmId" placeholder="请选择品牌">
            <el-option
              v-for="tm in trademarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
          <el-input
            type="textarea"
            placeholder="请输入SPU描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            :file-List="imageList"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :on-preview="handlePicrureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
        <!--
        prop="saleAttrId" 将来作为表单校验
       -->
        <el-form-item label="销售属性值" prop="saleAttrId">
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            v-model="spu.saleAttrId"
          >
            <!--  -->
            <el-option
              v-for="sale in filterSaleAttrList"
              :key="sale.id"
              :label="sale.tmName"
              :value="sale.id"
            ></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
          <el-table
            :data="spuSaleAttrList"
            border
            style="width: 100%; margin: 20px 0"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名称" width="150">
            </el-table-column>

            <el-table-column label="属性值列表">
              <template v-slot="{ row }">
                <el-tag
                  style="margin-right: 5px"
                  v-for="attrVal in row.spuSaleAttrValueList"
                  :key="attrVal.id"
                  >{{ attrVal.saleAttrValueName }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template>
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>

      <el-dialog :visible.sync="visible">
        <img width="100%" :src="previewImgUrl" alt="img" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuUpdateList",
  props: {
    item: Object,
    trademarkList: [], // 所有品牌数据
    imageList: [], //所有图片列表
    previewImgUrl: "", //商品图片地址
    visible: false, //图片对话框显示或隐藏
    saleAttrList: [], // 所有销售属性列表
    spuSaleAttrList: [], //当前spu销售属性列表
  },
  data() {
    return {
      spu: this.item,
    };
  },
  computed: {
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        );
      });
    },
  },
  methods: {
    // 删除图片
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.imageList = this.imageList.filter((img) => img.id !== file.id);
    },
    // 处理图片预览
    handlePicrureCardPreview(file) {
      this.previewImgUrl = file.url;
      this.visible = true;
    },
    // 获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      console.log(result);
      if (result.code === 200) {
        this.$message.success("获取所有数据成功");
        this.trademarkList = result.data;
      } else {
        this.$message.error("获取所有数据失败");
      }
    },
    // 获取图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.spuImageList(id);
      console.log(result);
      if (result.code === 200) {
        this.$message.success("获取所有图片数据成功");
        // 处理数据
        this.imageList = result.data.map((img) => {
          return {
            id: img.id,
            name: img.imgName,
            url: img.imgUrl,
          };
        });
      } else {
        this.$message.error("获取所有图片数据失败");
      }
    },
    // 获取所有销售属性
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      console.log(result);
      if (result.code === 200) {
        this.$message.success("获取所有销售数据成功");
        this.saleAttrList = result.data;
      } else {
        this.$message.error("获取所有销售数据失败");
      }
    },
    // 获取spu销售属性
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      console.log(result);
      if (result.code === 200) {
        this.$message.success("获取SPU销售数据成功");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error("获取SPU销售数据失败");
      }
    },
  },
  async mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSaleAttrList();
    this.getSpuSaleAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>
