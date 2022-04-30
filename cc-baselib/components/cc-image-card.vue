<template>
    <vue-draggable-resizable 
    :grid="[20,20]"
    
    :min-width="100" 
    :min-height="100"
    class-name-handle="my-handle-class"
    >
        <el-image 
        :src="src" 
        :fit="填充方式"
        >
        </el-image>
        <el-popover trigger="click" placement="right">
            <span
                slot="reference"
                class="el-icon-edit"
                style="position: absolute; left: 30px; top: 10px; z-index: 251"
            ></span>
            <el-select size="nimi" v-model="填充方式">
                <el-option v-for="item in 填充方式对照" :lable="item.lable" :value="item.value"></el-option>
            </el-select>
        </el-popover>
    </vue-draggable-resizable>
</template>

<script>
module.exports = {
    name: "cc-iamge-card",
    props: ["src", "resize"],

    data() {
        return {
            正在编辑:false,
            填充方式: "none",
            填充方式对照: [
                { "label": "拉伸", "value": "fill" },
                { "label": "保持高宽比缩放", "value": "contain" },
                { "label": "填充并裁剪", "value": "cover" },
                { "label": "缩放", "value": "scale-down" },
                { "label": "原始尺寸", "value": "none" }
            ]
        }
    },
}
</script>
<style scoped>
.el-image {
    width: 100%;
    height: 100%;
}

.my-handle-class {
    position: absolute;
    background-color: lightskyblue;
    border: 1px solid black;
    border-radius: 50%;
    height: 10px;
    width: 10px;
    box-model: border-box;
    -webkit-transition: all 300ms linear;
    -ms-transition: all 300ms linear;
    transition: all 300ms linear;
}

.my-handle-class-tl {
  top: -14px;
  left: -14px;
  cursor: nw-resize;
}

.my-handle-class-tm {
  top: -14px;
  left: 50%;
  margin-left: -7px;
  cursor: n-resize;
}

.my-handle-class-tr {
  top: -14px;
  right: -14px;
  cursor: ne-resize;
}

.my-handle-class-ml {
  top: 50%;
  margin-top: -7px;
  left: -14px;
  cursor: w-resize;
}

.my-handle-class-mr {
  top: 50%;
  margin-top: -7px;
  right: -14px;
  cursor: e-resize;
}

.my-handle-class-bl {
  bottom: -14px;
  left: -14px;
  cursor: sw-resize;
}

.my-handle-class-bm {
  bottom: -14px;
  left: 50%;
  margin-left: -7px;
  cursor: s-resize;
}

.my-handle-class-br {
  bottom: -14px;
  right: -14px;
  cursor: se-resize;
}

.my-handle-class-tl:hover,
.my-handle-class-tr:hover,
.my-handle-class-bl:hover,
.my-handle-class-br:hover {
    background-color: lightyellow;
    transform: scale(1.4);
}
</style>