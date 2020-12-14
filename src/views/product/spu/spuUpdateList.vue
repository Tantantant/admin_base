<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form label-width="80px" :model="spu">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input placeholder="请输入SPU名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="tmId">
          <el-select placeholder="请选择品牌">
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
          <el-input type="textarea" placeholder="请输入SPU描述"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            :action="`${$BASE_API}/admin/product/fileUpload`"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
        <!--
        prop="saleAttrId" 将来作为表单校验
       -->
        <el-form-item label="销售属性" prop="saleAttrId">
          <el-select>
            <!-- :placeholder="`还剩${filterSaleAttrList.length}个未选择`" -->
            <el-option></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
          <el-table border style="width: 100%; margin: 20px 0">
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
              <template>
                <el-tag style="margin-right: 5px">1111</el-tag>
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

      <el-dialog>
        <img width="100%" alt="img" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuUpdateList",
  data() {
    return {
      spu: [],
    };
  },
};
</script>

<style lang="less" scoped>
</style>
