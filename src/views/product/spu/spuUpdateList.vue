<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form label-width="80px" :rules="rules" ref="ruleForm" :model="spu">
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
        <el-form-item label="SPU图片" prop="imageList">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            :file-list="imageChange"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :on-preview="handlePicrureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
        <!--
        prop="saleAttrId" 将来作为表单校验
       -->
        <el-form-item label="销售属性值" prop="sale">
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            v-model="spu.sale"
          >
            <!--  -->
            <el-option
              v-for="sale in filterSaleAttrList"
              :key="sale.id"
              :label="sale.name"
              :value="`${sale.name}-${sale.id}`"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="!spu.sale"
            @click="addSaleAttr"
            >添加销售属性</el-button
          >
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
                  v-for="(attrVal, index) in row.spuSaleAttrValueList"
                  :key="attrVal.id"
                  closable
                  @close="handleClose(row, index)"
                  >{{ attrVal.saleAttrValueName }}</el-tag
                >
                <el-input
                  v-model="addAttrValue"
                  v-if="row.edit"
                  @blur="editCompleted(row)"
                  @keyup.enter.native="editCompleted(row)"
                  autofocus
                  ref="input"
                  style="width: 100px"
                ></el-input>
                <!-- <el-button
                  class="el-icon-plus"
                  v-else
                  @click="edit(row)"
                  size="mini"
                  >添加
                </el-button> -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="edit(row)"
                  >+ 添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template v-slot="{ $index }">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delAttrList($index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
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
  },
  data() {
    return {
      spu: this.item,
      trademarkList: [], // 所有品牌数据
      imageList: [], //所有图片列表
      previewImgUrl: "", //商品图片地址
      visible: false, //图片对话框显示或隐藏
      saleAttrList: [], // 所有销售属性列表
      spuSaleAttrList: [], //当前spu销售属性列表
      addAttrValue: "", // 添加属性值
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称" }],
        tmId: [{ required: true, message: "请选择品牌" }],
        description: [{ required: true, message: "请输入SPU描述" }],
        imageList: [{ required: true, validator: this.imageListVlidator }],
        sale: [{ required: true, validator: this.saleValidator }],
      },
    };
  },
  computed: {
    imageChange() {
      return this.imageList.map((img) => {
        return {
          // id: img.id,
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        );
      });
    },
  },
  /* 
    category3Id: 61
    description: "迪迦爸爸妈妈"
    id: 2274
    spuImageList: null
    spuName: "我是迪迦爸爸"
    spuSaleAttrList: null
    tmId: 250
  */
  methods: {
    // 取消
    cancel() {
      console.log(this.spu);
      this.$emit("showList", this.spu.category3Id);
    },
    // 保存
    save() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          console.log("保存成功");
          // 手机数据
          const spu = {
            ...this.spu,
            spuImageList: this.imageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };
          console.log(spu);
          // 发送请求
          const result = await this.$API.spu.updateSpu(spu);
          if (result.code === 200) {
            this.$emit("showList", this.spu.category3Id);
          }
        }
      });
    },
    // 销售属性自定义验证
    saleValidator(rule, value, callback) {
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error("请至少选择一种销售属性"));
        return;
      }
      const isNotOk = this.spuSaleAttrList.some(
        (item) => item.spuSaleAttrValueList.length === 0
      );
      console.log(isNotOk)
      if (isNotOk) {
        callback(new Error("请添加至少一种销售属性值"));
        return;
      }
      callback();
    },
    // 上传图片自定义验证
    imageListVlidator(rule, value, callback) {
      if (this.imageList.length > 0) {
        callback();
        return;
      }
      callback(new Error("请至少上传一张图片"));
    },
    // 删除销售属性列表
    delAttrList(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    // 删除属性值
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 添加销售属性值
    editCompleted(row, index) {
      if (this.addAttrValue) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.addAttrValue,
          spuId: row.spuId,
        });
        // 添加完成数据清空
        this.addAttrValue = "";
      }
      row.edit = false;
    },

    // 获取焦点
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 添加销售属性
    addSaleAttr() {
      const { sale, id } = this.spu;
      const [saleAttrName, baseSaleAttrId] = sale.split("-");
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuId: id,
        spuSaleAttrList: [],
      });
      this.spu.sale = "";
    },

    // 上传图片
    // // 文件上传成功时的钩子
    handleAvatarSuccess(res, file) {
      this.imageList.push({
        uid: file.uid,
        imgName: file.name,
        imgUrl: res.data,
        spuId: this.spu.id,
      });
    },
    //  上传文件之前的钩子
    beforeAvatarUpload(file) {
      const { type } = file;
      // 定义可上传图片的格式
      const imgType = ["image/jpeg", "image/jpg", "image/png"];
      // 判断传入的图片文件是否符合设定格式
      const imageType = imgType.indexOf(type) > -1;
      // 图片大小不能大于50kb
      const isLimit = file.size / 1024 < 200;
      if (!imageType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLimit) {
        this.$message.error("上传头像图片大小不能超过 50KB!");
      }
      return imageType && isLimit;
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.imageList = this.imageList.filter((img) => img.imgUrl !== file.url);
    },
    // 处理图片预览
    handlePicrureCardPreview(file) {
      this.previewImgUrl = file.url;
      this.visible = true;
    },
    // 获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
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
      if (result.code === 200) {
        this.$message.success("获取所有图片数据成功");
        // 处理数据
        this.imageList = result.data;
        // this.imageList = result.data.map((img) => {
        //   return {
        //     id: img.id,
        //     name: img.imgName,
        //     url: img.imgUrl,
        //   };
        // });
      } else {
        this.$message.error("获取所有图片数据失败");
      }
    },
    // 获取所有销售属性
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
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
