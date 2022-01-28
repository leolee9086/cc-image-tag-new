<template>
  <div id="root">
    <el-row type="flex" id="font-size" :gutter="2" justify="space-between">
      <el-col
        :span="4"
        :style="'font-family:{{当前字体系列}}'"
        class="cc-font cc-toolbar-item"
      >
        <div class="font" :style="'font-family:' + 当前样式对象.fontFamily + ';'">
          <el-select
            v-model="当前样式对象.fontFamily"
            size="mini"
            filterable
            :style="'width: 100% !important;font-family:{{fontFamily}}'"
          >
            <el-option
              v-for="item in 系统字体列表"
              :key="item"
              :label="item"
              :value="item"
            >
              <span :style="'float: left;font-family:' + item + ';'">{{ item }}</span>
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="0.2"
        ><div class="cc-toolbar-divider" style="height: 28px"></div
      ></el-col>
      <el-col :span="2" class="cc-toolbar-item">
        <div style="min-width: 56px">
          <el-select
            v-model="当前字体大小"
            size="mini"
            :inline="true"
            style="max-width: 100%"
          >
            <el-option
              v-for="item in 字体大小序列"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="2" class="cc-toolbar-item">
        <div>
          <el-select
            v-model="当前文字大小单位"
            size="mini"
            :inline="true"
            style="max-width: 100%"
          >
            <el-option
              v-for="item in 文字大小单位对照"
              :value="item.value"
              :label="item.value"
            >
              <el-tooltip :content="item.label" placement="right">
                <div>{{ item.value }}</div>
              </el-tooltip>
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="1" class="cc-toolbar-item">
        <div class="cc-toolbar-item" v-on:click="字体减小()">A<sup>-</sup></div>
      </el-col>
      <el-col :span="1" class="cc-toolbar-item">
        <div class="cc-toolbar-item" v-on:click="字体增大()">A<sup>+</sup></div>
      </el-col>
      <el-col :span="3" class="cc-toolbar-item">
        <el-select
          v-model="当前样式对象['fontWeight']"
          size="mini"
          :inline="true"
          style="max-width: 100%"
        >
          <el-option v-for="item in 字体字重对照" :value="item.value" :label="item.value">
            <el-tooltip :content="item.label" placement="right">
              <div>{{ item.value }}</div>
            </el-tooltip>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="0.2"
        ><div class="cc-toolbar-divider" style="height: 28px"></div
      ></el-col>
      <el-col :span="1" class="cc-toolbar-item">
        <el-dropdown trigger="click">
          <div
            type="primary"
            :style="'text-decoration-line:underline; {{下划线线型}} {{下划线颜色}}'"
          >
            Aa<i class="el-icon-arrow-down el-icon--right" size="mini"></i>
          </div>
          <el-dropdown-menu slot="dropdown" style="padding: 10px">
            <el-dropdown-item v-for="item in 字体大小写对照">
              <div @click="当前样式对象.fontVariantCaps = item.value">
                {{ item.value }}
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="1" class="cc-toolbar-item">
        <el-dropdown trigger="click">
          <div
            type="primary"
            :style="'text-decoration-line:underline; {{下划线线型}} {{下划线颜色}}'"
          >
            A<i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown" style="padding: 10px">
            <el-dropdown-item>
              <el-checkbox v-model="当前文字上划线">上划线</el-checkbox>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-checkbox v-model="当前文字删除线">删除线</el-checkbox>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-checkbox v-model="当前文字下划线">下划线</el-checkbox>
            </el-dropdown-item>
            <div v-if="当前文字上划线 || 当前文字删除线 || 当前文字下划线">
              <el-divider class="cc-toolbar-divider-hori"></el-divider>
              <el-dropdown-item
                v-for="item in 文字装饰线型对照"
                @click="当前样式对象.textDecorationStyle = item.value"
              >
                <span
                  :style="
                    'text-decoration-line:underline; text-decoration-style:' +
                    item.value +
                    ';'
                  "
                  @click="当前样式对象.textDecorationStyle = item.value"
                >
                  &emsp;&emsp;&emsp;&emsp;{{ item.label }}&emsp;&emsp;&emsp;&emsp;
                </span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-divider class="cc-toolbar-divider-hori"></el-divider>
              </el-dropdown-item>
              <el-slider type="number" v-model="当前文字装饰线宽" size="mini"></el-slider>

              <el-popover trigger="hover" placement="right" width="500">
                <div
                  slot="reference"
                  :style="
                    'margin:0 24px;height:28px;background-color:' + 当前文字装饰线颜色
                  "
                ></div>
                <cc-color-pane
                  v-model="当前样式对象.textDecorationColor"
                  :自定义颜色数组="自定义颜色数组"
                ></cc-color-pane>
              </el-popover>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="0.2"
        ><div class="cc-toolbar-divider" style="height: 28px"></div
      ></el-col>

      <el-col :span="1" class="cc-toolbar-item">
        <el-popover trigger="click" width="500">
          <div
            slot="reference"
            :style="
              'color:' +
              当前样式对象.color +
              ';font-weight:bolder;text-decoration:underline 4px'
            "
          >
            A
          </div>
          <cc-color-pane
            v-model="当前样式对象.color"
            :自定义颜色数组="自定义颜色数组"
          ></cc-color-pane>
        </el-popover>
      </el-col>
      <el-col :span="1">
        <el-popover trigger="click" width="500">
          <div
            slot="reference"
            :style="
              'background-color:' +
              当前样式对象.backgroundColor +
              ';width:24px;height:24px;border:solid 1px;margin:2px'
            "
          ></div>
          <cc-color-pane
            v-model="当前样式对象.backgroundColor"
            :自定义颜色数组="自定义颜色数组"
          ></cc-color-pane>
        </el-popover>
      </el-col>
      <el-col :span="1" class="cc-toolbar-item">
        <el-dropdown trigger="click">
          <div
            type="primary"
            :style="`-webkit-text-stroke:1px black;color:rgba(0,0,0,0);font-size:larger`"
          >
            A<i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown" style="padding: 10px">
            <el-dropdown-item>
              <el-slider
                type="number"
                v-model="当前文字描边宽度"
                size="mini"
                :step="0.1"
                :max="10"
              ></el-slider>
              <el-select
                v-model="当前文字描边宽度单位"
                size="mini"
                :inline="true"
                style="max-width: 100%"
              >
                <el-option
                  v-for="item in 文字大小单位对照"
                  :value="item.value"
                  :label="item.value"
                >
                  <el-tooltip :content="item.label" placement="right">
                    <div>{{ item.value }}</div>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-popover trigger="hover" placement="right" width="500">
                <div
                  slot="reference"
                  :style="
                    'border:solid 1px;margin:5 24px;height:28px;background-color:' +
                    当前样式对象.webkitTextStrokeColor
                  "
                ></div>
                <cc-color-pane
                  v-model="当前样式对象.webkitTextStrokeColor"
                  :自定义颜色数组="自定义颜色数组"
                ></cc-color-pane>
              </el-popover>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="1">
        <el-popover trigger="click" placement="right" width="200">
          <div slot="reference" style="width: 28px; min-height: 100% !important">
            <i style="width: 100%; height: 100%" class="el-icon-picture"></i>
          </div>
          <cc-cssimage
            v-if="!当前样式对象['使用背景渐变']"
            v-model="当前样式对象.backgroundImage"
            :思源伺服ip="思源伺服ip"
            :apitoken="apitoken"
            :filetypes="['jpg', 'png', 'jpeg', 'svg']"
          ></cc-cssimage>

          <el-checkbox v-model="当前样式对象.使用背景渐变">使用渐变</el-checkbox>
          <el-checkbox v-model="当前样式对象.使用文字遮罩">使用文字遮罩</el-checkbox>
        </el-popover>
      </el-col>
    </el-row>
  </div>
</template>
<script>
module.exports = {
  name: "cc-csscons-font",
  props: ["思源伺服ip", "apitoken", "样式对象", "自定义颜色数组"],
  components: componentsList,
  model: { event: "change", prop: "样式对象" },
  mounted() {
    this.获取系统字体列表();
    this.当前样式对象 = JSON.parse(JSON.stringify(this.样式对象));
    for (prop in this.样式对象) {
      this.当前样式对象[prop] = this.样式对象[prop];
      if (!this.当前样式对象[prop]) {
        this.$set(this.当前样式对象, prop, "");
      }
    }
  },
  data() {
    return {
      当前样式对象: "",

      当前字体系列: "var(--b3-font-family)",
      系统字体列表: ["Arial"],

      当前字体大小: 1,
      字体大小序列: [1, 2, 4, 8, 16, 24, 32, 64],

      当前文字大小单位: "em",
      文字大小单位对照: [
        { value: "em", label: "相对当前元素" },
        { value: "ex", label: "相对小写x" },
        { value: "ch", label: "指定数字0宽度" },
        { value: "rem", label: "相对根元素" },
        { value: "vw", label: "相对窗口宽度" },
        { value: "vh", label: "相对窗口高度" },
        { value: "vmin", label: "相对窗口高宽中较小值" },
        { value: "vmax", label: "相对窗口高度中较大值" },
        { value: "%", label: "百分比" },
        { value: "cm", label: "厘米" },
        { value: "mm", label: "毫米" },
        { value: "in", label: "英寸" },
        { value: "px", label: "像素" },
        { value: "pt", label: "磅" },
        { value: "pc", label: "派卡" },
        { value: "", label: "无单位" },
      ],

      字体大小写对照: [
        { value: "normal", label: "标准" },
        { value: "small-caps", label: "小型大写字母" },
        { value: "inherit", label: "继承" },
      ],

      字体字重对照: [
        { value: "normal", label: "标准" },
        { value: "bold", label: "粗体" },
        { value: "bolder", label: "更粗" },
        { value: "lighter", label: "更细" },
        { value: "100", label: "100" },
        { value: "200", label: "200" },
        { value: "300", label: "300" },
        { value: "400", label: "400" },
        { value: "500", label: "500" },
        { value: "600", label: "600" },
        { value: "700", label: "700" },
        { value: "800", label: "800" },
        { value: "900", label: "900" },
      ],

      当前文字颜色: "black",

      当前背景颜色: "",

      当前文字书写模式: "",

      当前文字书写方向: "",

      当前文字字符间距: "",

      当前文字行高: "",

      当前文字水平对齐: "",

      当前文字上划线: false,
      当前文字下划线: false,
      当前文字删除线: false,

      当前文字装饰线颜色: "red",

      当前文字装饰线型: "",

      当前文字装饰线宽: 1,
      当前文字装饰线宽单位: "px",

      当前文字垂直对齐: "",

      当前文字阴影样式: "",

      文字装饰线型对照: [
        { value: "solid", label: "实线" },
        { value: "double", label: "双线" },
        { value: "dashed", label: "虚线" },
        { value: "wavy", label: "波浪线" },
      ],

      //  自定义颜色数组:[],
      当前文字描边宽度: 0,
      当前文字描边宽度单位: "px",
      使用渐变: false,
    };
  },
  computed: {
    当前文字装饰线位置() {
      let 字符串 = "";
      if (this.当前文字上划线) {
        字符串 = 字符串 + "overline";
      }
      if (this.当前文字下划线) {
        字符串 = 字符串 + " underline";
      }
      if (this.当前文字删除线) {
        字符串 = 字符串 + " line-through";
      }
      return 字符串;
    },
  },
  watch: {
    当前文字描边宽度(val) {
      this.当前样式对象["webkitTextStrokeWidth"] = val + this.当前文字描边宽度单位;
    },
    当前文字描边宽度单位(val) {
      this.当前样式对象["webkitTextStrokeWidth"] = this.当前文字描边宽度 + val;
    },
    当前文字装饰线宽(val) {
      console.log(val);
      this.当前样式对象["textDecorationThickness"] = val + this.当前文字装饰线宽单位;
    },
    当前文字装饰线位置(val) {
      this.当前样式对象["textDecorationLine"] = val;
    },
    当前字体大小: {
      handler(val) {
        this.当前样式对象["fontSize"] = val + this.当前文字大小单位;
      },
    },
    当前文字大小单位: {
      handler(val) {
        this.当前样式对象["fontSize"] = this.当前字体大小 + val;
      },
    },
    样式对象: {
      handler(val) {
        for (prop in val) {
          if (this.当前样式对象[prop] != undefined) {
            this.当前样式对象[prop] = val[prop];
          }
        }
      },
      deep: true,
    },
    当前样式对象: {
      handler(val) {
        this.$emit("change", JSON.parse(JSON.stringify(val)));
      },
      deep: true,
    },
  },
  methods: {
    字体增大() {
      this.当前字体大小 = this.当前字体大小 + 1;
      if (this.字体大小序列.indexOf(this.当前字体大小) == -1) {
        this.字体大小序列.push(this.当前字体大小);
      }
    },
    字体减小() {
      if (this.当前字体大小 == 1) {
        return null;
      }
      this.当前字体大小 = this.当前字体大小 - 1;
      if (this.字体大小序列.indexOf(this.当前字体大小) == -1) {
        this.字体大小序列.push(this.当前字体大小);
      }
    },
    获取系统字体列表: function () {
      let that = this;
      axios({
        method: "POST",
        url: "http://" + that.思源伺服ip + "/api/system/getSysFonts",
        headers: { Authorization: "Token " + that.apitoken },
        data: {},
      }).then((result) => {
        // console.log(result.data.data)
        that.系统字体列表 = result.data.data;
      });
    },
  },
};
</script>
<style scoped>
.el-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0px !important;
  padding-right: 0px !important;
}

.cc-toolbar-group {
  display: flex;
  border-left: solid 1px gray;
  border-right: solid 1px gray;
  height: 28px;
}
.cc-toolbar-item,
.cc-toolbar-item div {
  min-height: 100%;
  align-self: center;
  height: 28px;
}
.el-input__inner {
  padding: 0 !important;
  border-radius: 1px;
}
.el-input-number [role="button"] {
  width: 1.2em;
}
.cc-toolbar-divider {
  border-left: solid 1px grey;
  margin-left: 1px;
}
.cc-toolbar-divider-hori {
  margin: 2px 0 !important;
}
.font input {
  font-family: inherit !important;
}
</style>
