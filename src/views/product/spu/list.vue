<template>
  <div>
    <Category />
    <el-card class="box-card" style="margin: 20px 0">
      <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList" />
      <SpuUpdataList v-else :item="item" @showList="showList"/>
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
      isShowList: true,
      item: {},
    };
  },
  methods: {
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },
    showList(category3Id){
      console.log(category3Id)
      this.isShowList = true
      this.$nextTick(()=>{
        this.$bus.$emit('change',{category3Id})
      })
    }
  },
  components: {
    Category,
    SpuUpdataList,
    SpuShowList,
  },
};
</script>
