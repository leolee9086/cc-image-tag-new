<template>
  <div>
    <el-row> </el-row>
  </div>
</template>
<script>
module.exports = {
  name: "cc-card",
  props: ["卡片数据"],
  data() {
    return {
      name: "",
      subtype: "",
      markdown: "",
      预览html: "",
    };
  },
};
</script>
