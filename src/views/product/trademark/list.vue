<template>
  <div>
    <el-button type="primary" class="el-icon-plus" @click="add">
      添加</el-button
    >
    <el-table
      v-loading="loading"
      :data="trademarkList"
      border
      style="width: 100%"
      class="trademard-table"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column prop="logo" label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="" class="trademark-img" />
          <div slot="reference" class="name-wrapper"></div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="warning"
            class="el-icon-edit"
            @click="update(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            class="el-icon-delete"
            >删除</el-button
          >
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

    <!-- 添加数据  对话框-->
    <el-dialog
      :title="`${!ruleForm.id ? '添加品牌' : '修改品牌'}`"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <!-- :before-close="handleClose" -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- 表单验证 -->
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="ruleForm.tmName" style="width: 450px"></el-input>
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="ruleForm.logoUrl"
              :src="ruleForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      trademarkList: [],
      total: 0,
      limit: 3,
      page: 1,
      dialogVisible: false, // 添加数据弹出框
      loading: false, // 加载
      ruleForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
      },
    };
  },
  methods: {
    // handleSizeChange() {
    //   this.getTrademarkList(page, this.limit);
    // }, // pageSize 改变时会触发	每页条数
    // handleCurrentChange() {
    //   this.getTrademarkList(this.page,limit)
    // }, // currentPage 改变时会触发	当前页
    async getTrademarkList(page, limit) {
      this.loading = true
      const result = await this.$API.trademark.getTrademarkList(page, limit);
      if (result.code === 200) {
        this.$message.success("获取品牌列表成功");
        this.limit = result.data.size; // 每页显示条数
        this.page = result.data.current; // 当前页码
        this.trademarkList = result.data.records;
        this.total = result.data.total; // 总数
        this.loading = false
      } else {
        this.$message.error("获取品牌列表失败");
      }
    },

    // 上传图片
    // 文件上传成功时的钩子
    handleAvatarSuccess(res) {
      const { data } = res;
      // this.logoUrl = URL.createObjectURL(file.raw);
      this.ruleForm.logoUrl = data;
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

    // 提交表单的方法
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { ruleForm } = this;
          // 将拿到id强制转换成boolean值
          const isUpdate = !!ruleForm.id;
          // console.log(isUpdate)
          if (isUpdate) {
            const item = this.trademarkList.find(
              (item) => item.id === ruleForm.id
            );
            // console.log(this.trademarkList.tmName)
            // console.log(this.trademarkList.logoUrl)
            if (
              item.tmName === ruleForm.tmName &&
              item.logoUrl === ruleForm.logoUrl
            ) {
              console.log("相同");
              this.$message.warning("不能修改相同的数据");
              return;
            }
          }
          let result;
          if (isUpdate) {
            result = await this.$API.trademark.updateTrademarkList(ruleForm);
            console.log("修改");
          } else {
            result = await this.$API.trademark.addTrademarkList(ruleForm);
            console.log("添加");
          }
          // console.log(result)
          if (result.code === 200) {
            // const result = await this.$API.trademark.addTrademarkList(
            //   this.ruleForm
            // );
            this.dialogVisible = false;
            this.$message.success(`${isUpdate ? "修改" : "添加"}数据成功`);
          } else {
            this.$message.error("添加数据失败");
          }
        }
      });
    },
    // 添加
    add() {
      this.dialogVisible = true;
      this.ruleForm = {
        tmName: "",
        logoUrl: "",
      };
      // 清空错误提示
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
    },
    // 删除
    handleDelete(value) {
      const { id } = value;

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;
          this.trademarkList = this.trademarkList.filter((item) => {
            item.id === id;
          });
          await this.$API.trademark.delTrademarkList(id);
          await this.getTrademarkList(this.page, this.limit);
          this.loading = false;
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 修改
    update(row) {
      this.dialogVisible = true;
      this.ruleForm = { ...row };
      // 清空错误提示
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
    },
  },
  mounted() {
    this.getTrademarkList(this.page, this.limit);
  },
};
</script>
<style lang="sass" >
.trademard-table
  margin: 20px 0
.trademark-img
  width: 100px
.pagination
  text-align: right
.pagination .el-pagination__jump
  margin-right: 350px

.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

.avatar-uploader .el-upload:hover
  border-color: #409EFF

.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

.avatar
  width: 178px
  height: 178px
  display: block
</style>