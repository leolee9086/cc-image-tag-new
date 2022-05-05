<template>
  <div
    id="app"
    :style="`width: ${窗口大小.width}px; 
        height:${窗口大小.height}px;
        cursor:${光标形状};`"
    @mouseup="结束拖拽($event)"
    @mousedown="开始拖拽($event)"
  >
    <div>
      <cc-layers-toolbar
        class="layer"
        :窗口大小="窗口大小"
        :思源伺服ip="思源伺服ip"
        :卡片数组="卡片数组"
        :链接数组="链接数组"
      ></cc-layers-toolbar>

      <cc-layers-tooltip
        class="layer"
        :窗口大小="窗口大小"
        :当前鼠标坐标="当前鼠标坐标"
      ></cc-layers-tooltip>
    </div>
    <cc-layers-cards
      class="layer"
      v-on:paste="黏贴内容($event)"
      :窗口大小="窗口大小"
      :当前鼠标坐标="当前鼠标坐标"
      :卡片数组="卡片数组"
      :链接数组="链接数组"
      :画布原点="画布原点"
    ></cc-layers-cards>
    <cc-layers-konva-graph
      class="layer"
      :当前鼠标坐标="当前鼠标坐标"
      :窗口大小="窗口大小"
      :画布原点="画布原点"
      :卡片数组="卡片数组"
      :链接数组="链接数组"
    >
    </cc-layers-konva-graph>
    <cc-layers-background class="layer" :窗口大小="窗口大小"> </cc-layers-background>
    <el-dialog title="请求工作空间" :visible.sync="dialogVisible" width="30%">
      <span>请求本地文件夹:{{ this.工作空间句柄.name }}访问授权</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="请求工作空间()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
module.exports = {
  name: "app",
  mounted: function () {
    this.思源伺服ip = window.location.host;
    this.加载数据();
    this.初始窗口大小 = { H: window.innerHeight, W: window.innerWidth };
    this.挂载全局事件();
    this.$事件总线.$on("添加卡片", ($event) => this.判断id并添加($event));
    this.$事件总线.$on("添加链接", ($event) => this.判断id并添加($event));
    this.主界面 = window.parent.document;
    if (this.$挂件模式()) {
      this.挂件自身元素 = self.frameElement.parentElement.parentElement;
    }
    this.检查更新();
    this.开始获取数据();
    this.获取工作空间();
  },
  data() {
    return {
      画板列表: [],
      书签列表: "",
      新属性: { type: "原始文本", name: "newattr", label: "newattr", value: "default" },
      属性类型: ["图片", "文本", "块链接", "超链接", "原始文本", "附件"],
      数据源id: "",
      窗口大小: { width: 10000, height: 10000 },
      主界面: {},
      挂件自身元素: "",
      思源伺服ip: "",
      当前鼠标坐标: { x: "", y: "" },
      当前窗口状态: "",
      卡片数组: [],
      链接数组: [],
      数据时间戳: "",
      画布原点: { x: 0, y: 0 },
      dialogVisible: false,
      工作空间句柄: {},
      左键拖拽中: false,
      光标形状: "auto",
    };
  },
  watch: {
    数据源id: async function (val, oldval) {
      //  console.log("new", val, "old", oldval);
      if (val != oldval && val && oldval) {
        this.初始化(val);
      }
    },
  },

  methods: {
    检查更新: async function () {
      let url1 = "widget.json";
      let 本地版本信息 = await axios.get(url1);
      console.log(本地版本信息.data);
      本地版本信息 = 本地版本信息.data;
      let 集市挂件数据 = await 获取集市挂件数据(window.location.host, "", {});
      console.log(集市挂件数据.data);

      let 集市版本信息 = {};
      集市挂件数据.data.packages.forEach((package) => {
        package.name == "cc-image-tag-new" ? (集市版本信息 = package) : null;
      });
      if (集市版本信息.version !== 本地版本信息.version) {
        alert("有新版本发布,请检查集市更新");
      }
    },
    获取工作空间: async function () {
      if (window.isSecureContext) {
        let 句柄对象 = await this.$画板元数据库.workspace.get(00000);
        this.工作空间句柄 = 句柄对象.value;
        if (this.工作空间句柄) {
          let Permission = await this.工作空间句柄.queryPermission({
            mode: "readwrite",
          });
          if (Permission === "granted") {
            this.$事件总线.$emit("设定工作空间", this.工作空间句柄, false);
          } else {
            this.dialogVisible = true;
          }
        }
      }
    },
    async 请求工作空间() {
      let Permission = await this.工作空间句柄.requestPermission({ mode: "readwrite" });
      if (Permission) {
        this.$事件总线.$emit("设定工作空间", this.工作空间句柄, false);
        this.批量保存卡片文件();
        this.dialogVisible = false;
      }
    },
    async 批量保存卡片文件() {
      let 画板命名 = (await this.$数据库.metadata.get("name")).value;
      this.$当前窗口状态.画板命名 = 画板命名;
      let 卡片数组 = await this.$数据库.cards.toArray();
      let 链接数组 = await this.$数据库.links.toArray();
      let 完全数组 = 卡片数组.concat(链接数组);
      for (let i = 0, len = 完全数组.length; i < len; i++) {
        this.$事件总线.$emit("保存数据", 完全数组[i]);
      }
    },
    开始获取数据: function () {
      liveQuery(() => this.$数据库.cards.toArray()).subscribe({
        next: async (result) => {
          this.卡片数组 = result;
          this.$当前窗口状态.卡片数组 = this.卡片数组;
          this.$当前窗口状态.当前窗口状态提示 = "同步数据于:" + this.$生成毫秒时间戳();
        },
      });
      liveQuery(() => this.$数据库.links.toArray()).subscribe({
        next: async (result) => {
          this.链接数组 = result;
          this.$当前窗口状态.链接数据 = this.链接数组;
          this.$当前窗口状态.当前窗口状态提示 = "同步数据于:" + this.$生成毫秒时间戳();
        },
      });
      liveQuery(() => this.$数据库.linkpresets.toArray()).subscribe({
        next: async (result) => {
          this.$当前窗口状态.链接预设数据 = result;
          this.$当前窗口状态.当前窗口状态提示 = "同步数据于:" + this.$生成毫秒时间戳();
        },
      });
      liveQuery(() => this.$数据库.cardpresets.toArray()).subscribe({
        next: async (result) => {
          this.$当前窗口状态.卡片预设数据 = result;
          this.$当前窗口状态.当前窗口状态提示 = "同步数据于:" + this.$生成毫秒时间戳();
        },
      });
    },
    加载数据: async function () {
      let that = this;
      let baseid = this.$baseid;
      await this.从思源块加载数据(baseid);
      try {
        that.背景色 = (await that.$数据库.metadata.get("backgroundColor")).value;
      } catch (e) {
        that.背景色 = "var(--b3-theme-background)";
        that.$数据库.metadata.put({ key: "customcolors", value: [] });
      }
    },
    从思源块加载数据: async function (id) {
      let that = this;
      let filepath = `assets/data-${id}.cccards`;

      if (this.$挂件模式()) {
        this.挂件自身元素 = window.frameElement.parentElement.parentElement;
        filepath =
          this.挂件自身元素.getAttribute("data-assets") ||
          this.挂件自身元素.getAttribute("custom-data-assets") ||
          `assets/data-${this.挂件自身元素.getAttribute("data-node-id")}.cccards`;
      }
      if (id == "20131111000000-lpanybz" || !id) {
        filepath = "./widgets/cc-image-tag-new/help.cccards";
        this.$数据库.cards.clear();
        this.$数据库.links.clear();
        this.$数据库.metadata.clear();
        this.$数据库.cardpresets.clear();
        this.$数据库.linkpresets.clear();
      }
      let url = this.思源伺服ip
        ? `http://${this.思源伺服ip}/${filepath}`
        : `localhost:6806/${filepath}`;
      console.log(url);
      let 文件数据 = {};
      try {
        await axios.get(url).then((res) => {
          文件数据 = res.data;
          if (文件数据["cardarray"]) {
            try {
              this.图片缩放倍数 = parseFloat(文件数据.resize).toFixed(2);
            } catch (e) {
              console.log(e);
            }
          }
        });
      } catch (e) {
        console.log("主工具栏数据加载错误", e);

        alert("文件不存在,将在附件中新建文件");
        this.$事件总线.$emit("上传当前画板文件数据到思源");
      }
      if (文件数据) {
        let 卡片数组 = 文件数据["cards"];
        let 链接数组 = 文件数据["links"];
        let metadata = 文件数据["metadata"];
        let 卡片预设 = 文件数据["cardpresets"];
        let 链接预设 = 文件数据["linkpresets"];
        if (卡片数组) {
          for (let i = 0, len = 卡片数组.length; i < len; i++) {
            await this.$数据库.cards.put(卡片数组[i]);
          }
        }
        if (链接数组) {
          for (let i = 0, len = 链接数组.length; i < len; i++) {
            await this.$数据库.links.put(链接数组[i]);
          }
        }
        if (metadata) {
          for (let i = 0, len = metadata.length; i < len; i++) {
            await this.$数据库.metadata.put(metadata[i]);
          }
        }
        if (卡片预设) {
          for (let i = 0, len = 卡片预设.length; i < len; i++) {
            await this.$数据库.cardpresets.put(卡片预设[i]);
          }
        }
        if (链接预设) {
          for (let i = 0, len = 链接预设.length; i < len; i++) {
            await this.$数据库.linkpresets.put(链接预设[i]);
          }
        }
      }
      //     console.log("加载完成");
    },
    挂载全局事件() {
      window.addEventListener("mousewheel", this.计算坐标, { passive: false });
      window.addEventListener("mousemove", this.计算坐标, { passive: false });
      window.addEventListener("scroll", this.计算坐标);
      window.addEventListener("keydown", this.$快捷键处理器);
    },
    判断id并添加(数据) {
      this.$事件总线.$emit("保存数据", 数据);

      let 数据类型 = 数据.type;
      let 数据列表 = [];
      数据类型 == "card" ? (数据列表 = this.卡片数组) : (数据列表 = this.链接数组);
      let flag = true;
      for (let i = 0; i < 数据列表.length; i++) {
        数据列表[i]["id"] == 数据.id ? (flag = false) : null;
      }
      flag ? 数据列表.push(数据) : null;
    },
    判断消息: async function (消息) {
      if (消息.data.数据时间戳 <= this.数据时间戳) {
        return null;
      }
      消息.data.卡片数组 ? (this.卡片数组 = 消息.data.卡片数组) : null;
      消息.data.链接数组 ? (this.链接数组 = 消息.data.链接数组) : null;
      消息.data.数据时间戳 ? (this.数据时间戳 = 消息.data.数据时间戳) : null;
    },
    以属性查找对象(集合, 属性名, 属性值) {
      let obj = null;
      集合.forEach((card) => {
        if (card) {
          if (card[属性名] == 属性值) {
            obj = card;
          }
        }
      });
      return obj;
    },

    开始拖拽($event) {
      // console.log($event);
      if (!$event.target.classList.contains("layer")) {
        return null;
      }

      $event.button == 0 ? (this.左键拖拽中 = true) : null;
    },
    结束拖拽($event) {
      // console.log($event);
      this.光标形状 = "auto";

      this.左键拖拽中 = false;
    },
    计算坐标($event) {
      if ($event.altKey && $event.wheelDelta) {
        $event.preventDefault();
        delta = $event.wheelDelta / 120;
        let 当前屏幕中心x = window.pageXOffset + $event.clientX;
        let 当前屏幕中心y = window.pageYOffset + $event.clientY;
        let 窗口缩放倍数 = this.$当前窗口状态.缩放倍数;
        let 旧窗口缩放倍数 = 窗口缩放倍数 + 0;
        窗口缩放倍数 > 1 ? (窗口缩放倍数 += delta / 5) : (窗口缩放倍数 += delta / 50);
        窗口缩放倍数 > 10 ? (窗口缩放倍数 = 10) : null;
        窗口缩放倍数 < 0.01 ? (窗口缩放倍数 = 0.01) : null;

        let id = "";
        if (this.$当前窗口状态.current_cardid || this.$当前窗口状态.current_linkid) {
          id = this.$当前窗口状态.current_cardid || this.$当前窗口状态.current_linkid;
        }

        id
          ? this.$事件总线.$emit("定位至卡片", id)
          : window.scrollTo(
              (当前屏幕中心x * 窗口缩放倍数) / 旧窗口缩放倍数 - $event.clientX,
              (当前屏幕中心y * 窗口缩放倍数) / 旧窗口缩放倍数 - $event.clientY
            );
        this.$事件总线.$emit("窗口缩放", 窗口缩放倍数 > 0 ? 窗口缩放倍数 : 0.01);
      }
      if (this.左键拖拽中) {
        $event.preventDefault();
        this.光标形状 = "grabbing";
        let 拖拽x = $event.clientX - this.当前鼠标坐标.x;
        let 拖拽y = $event.clientY - this.当前鼠标坐标.y;
        if (window.pageXOffset - 拖拽x && window.pageYOffset - 拖拽y) {
          if (Math.abs(拖拽x) < 100 && Math.abs(拖拽y) < 100) {
            window.scrollTo(window.pageXOffset - 拖拽x, window.pageYOffset - 拖拽y);
          }
        }
      }

      this.当前鼠标坐标.x = $event.clientX;
      this.当前鼠标坐标.y = $event.clientY;
      this.保存计数器 = this.保存计数器 + 1;
      if (this.保存计数器 >= 100) {
        this.保存计数器 = 1;
      }
      let 窗口大小 = { width: 0, height: 0 };
      if ($event.clientX) {
        窗口大小 = {
          width: window.pageXOffset + $event.clientX + window.innerWidth,
          height: window.pageYOffset + $event.clientY + window.innerHeight,
        };
      }
      let flag = false;
      this.窗口大小.width < 窗口大小.width ? (flag = true) : null;
      this.窗口大小.height < 窗口大小.height ? (flag = true) : null;
      if (flag) {
        this.窗口大小.width = 窗口大小.width + 10000;
        this.窗口大小.height = 窗口大小.height + 10000;
      }
      this.画布原点 = { x: window.pageXOffset, y: window.pageYOffset };
    },
    保存数据: async function () {
      this.$事件总线.$emit("上传数据到思源", this.数据源id);
    },
    打开新窗口() {
      let 链接 = `http://${this.思源伺服ip}/widgets/cc-image-tag/?baseid=${this.$baseid}`;
      this.$窗口内打开超链接(链接);
    },
  },
};
</script>
