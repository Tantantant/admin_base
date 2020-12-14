<template>
  <div>
    <Category />
    <el-card class="box-card" style="margin: 20px 0">
      <SpuShowList v-if="isShowList"/>
      <SpuUpdataList v-else/>
      <!--  -->
    </el-card>
  </div>
</template>

<script>
import Category from "../../../components/category/catetory";
import SpuUpdataList from "./spuUpdateList";
import SpuShowList from "./spuShowList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowList:true
    };
  },
  components: {
    Category,
    SpuUpdataList,
    SpuShowList,
  },
};
</script>
