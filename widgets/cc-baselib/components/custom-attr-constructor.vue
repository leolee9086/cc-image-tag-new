<template>
  <el-popover
    placement="right"
    title="选择属性值"
    width="400"
    trigger="click"
    @show="判断是否原始属性()"
    @hide="返回属性对象()"
  >
    <el-link slot="reference" style="font-size: large; color: gray"
      >+ <span style="font-size: large; color: gray">添加属性</span></el-link
    >
    <el-select v-model="新属性类型" size="mini">
      <el-option v-for="item in 属性类型" :laebl="item" :value="item"> </el-option>
    </el-select>
    <el-input v-model="新属性名" @input="校验属性名(新属性名)">
      <template slot="prepend">新属性名</template>
    </el-input>
    <el-input v-model="属性标签" :disabled="新属性类型 == '原始文本'" @change="">
      <template slot="prepend">属性标签</template>
    </el-input>

    <el-input v-model="新属性值">
      <template slot="prepend">新属性值</template>
    </el-input>
    <div v-if="新属性类型 == '附件'">
      <el-input v-model="搜索关键词" size="mini">
        <template slot="prepend">搜索</template>
      </el-input>
      <cc-assets-selector
        v-model="新属性值"
        :k="搜索关键词"
        :apitoken="apitoken"
        :思源伺服ip="思源伺服ip"
      >
      </cc-assets-selector>
    </div>
  </el-popover>
</template>
<script>
module.exports = {
  name: "custom-attr-constructor",
  props: ["新属性", "属性类型", "已有属性列表", "思源伺服ip", "apitoken"],
  components: componentsList,
  model: {
    event: "hide",
    prop: "新属性",
  },
  mounted() {
    this.新属性值 = this.新属性["value"]; //.slice(0)
    this.新属性名 = this.新属性["name"]; //.slice(0)
    this.属性标签 = this.新属性["label"]; //.slice(0)
    this.新属性类型 = this.新属性["type"]; //.slice(0)
  },
  data() {
    return {
      搜索关键词: "",
      新属性值: "",
      新属性名: "",
      属性标签: "",
      新属性类型: "",
    };
  },
  methods: {
    校验属性名(属性名) {
      属性名 = 属性名.replace(/[^\a-\z\A-\Z0-9]/g, "");
      this.新属性名 = 属性名;
      //   console.log(属性名)
    },
    返回属性对象() {
      let realvalue = {
        name: this.新属性名,
        value: this.新属性值,
        label: this.属性标签,
        type: this.新属性类型,
      };
      //    console.log("aaaa",realvalue)
      this.$emit("hide", JSON.parse(JSON.stringify(realvalue)));
    },
    判断是否原始属性() {
      //    console.log(this.已有属性列表)
      if (this.已有属性列表["custom-" + this.新属性名]) {
        this.新属性名 = this.新属性名 + "new";
      }
      if (this.新属性类型 == "原始文本") {
        this.属性标签 = this.新属性名;
      }
    },
  },
};
</script>
