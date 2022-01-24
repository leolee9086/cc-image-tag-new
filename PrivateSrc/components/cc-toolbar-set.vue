<template>
  <el-drawer :modal="false" title="画板设置" size="100%" :visible="显示" :show-close="false">
    <el-row>
      <el-col :span="24">
        <el-input v-model="当前画板命名" size="mini">
          <span slot="prepend">画板命名</span>
        </el-input>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="20" type="flex" justify="space-around">
      <el-col :span="8">
        <el-upload
          class="upload-demo"
          accept=".cctag"
          :http-request="导入旧版JSON数据"
          :action="`http://${思源伺服ip}/api/asset/upload`"
          :headers="{ Authorization: 'Token' + apitoken }"
          :flile-list="JSON文件列表"
          :multiple="false"
        >
          <el-button area-label="导入文件" slot="trigger" size="mini" class="el-icon-upload">导入旧版文件</el-button>
        </el-upload>
      </el-col>
      <el-col :span="8">
        <el-upload
          class="upload-demo"
          accept=".cccards"
          :http-request="覆盖导入JSON数据"
          :action="`http://${思源伺服ip}/api/asset/upload`"
          :headers="{ Authorization: 'Token' + apitoken }"
          :flile-list="JSON文件列表"
          :multiple="false"
        >
          <el-button area-label="导入文件" slot="trigger" size="mini" class="el-icon-upload">导入文件</el-button>
        </el-upload>
      </el-col>
      <el-col :span="8">
        <el-upload
          class="upload-demo"
          accept=".cccards"
          :http-request="覆盖导入mardown数据"
          :action="`http://${思源伺服ip}/api/asset/upload`"
          :headers="{ Authorization: 'Token' + apitoken }"
          :flile-list="JSON文件列表"
          :multiple="false"
        >
          <el-button area-label="导入文件" slot="trigger" size="mini" class="el-icon-upload">导入markdown</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <cc-background-setter></cc-background-setter>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12">
        <el-switch
          size="mini"
          @change="$当前窗口状态.showname = $event"
          v-model="折叠时显示名称"
          active-text="折叠卡片时显示名称"
        ></el-switch>
      </el-col>
      <el-tooltip content="折叠时是否显示名称">
        <el-switch
          area-label="折叠时是否显示名称"
          @change="$当前窗口状态.showsubtype = $event"
          size="mini"
          v-model="折叠时显示类别"
          active-text="折叠卡片时显示类别"
        ></el-switch>
      </el-tooltip>
    </el-row>
    <el-switch
      area-label="折叠时是否显示名称"
      @change="$当前窗口状态.showmarkdown = $event"
      size="mini"
      v-model="优先显示markdown"
      active-text="优先显示markdown"
    ></el-switch>
    <el-switch
      area-label="链接是否默认显示标记"
      @change="$当前窗口状态.showmarkdown = $event"
      size="mini"
      v-model="是否默认显示链接标记"
      active-text="是否默认显示链接标记"
    ></el-switch>
  </el-drawer>
</template>
<script>
module.exports = {
  name: "cc-toolbar-set",
  props: ["显示"],
  data() {
    return {
      当前画板命名: "",
      JSON文件列表: [],
      思源伺服ip: "",
      apitoken: "",
      折叠时显示名称: true,
      折叠时显示类别: true,
      优先显示markdown: false,
      是否默认显示链接标记: true,
    };
  },
  async mounted() {
    await this.加载数据()
  },
  methods: {
    加载数据: async function () {
      let that =this
      try {
        that.当前画板命名 = (await that.$数据库.metadata.get("name")).value;
      } catch (e) {
        that.当前画板命名 = "未命名";
        that.$数据库.metadata.put({ key: "name", value: "未命名" });
      }
      that.画板列表 = await that.$画板元数据库.boards.toArray();

    },
    导入旧版JSON数据() { },
    覆盖导入JSON数据() { },
    覆盖导入mardown数据() { },
  },
  watch:{
    是否默认显示链接标记(val){
      this.$当前窗口状态.show_tag_by_default = val?true:false
    },
    是否默认优先显示markdown(val){
      this.$当前窗口状态.show_markdown_by_default = val?true:false
    }
  }
};
</script>
<style></style>
