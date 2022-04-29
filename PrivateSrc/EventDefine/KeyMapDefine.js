const that = Vue.prototype
const 清理选择 = function(event){
    that.$事件总线.$emit("结束连接")
    that.$事件总线.$emit("清理选择")
    that.$事件总线.$emit("清理选集")
    that.$事件总线.$emit("结束绘制")
}
const 打开帮助 =  function(event){
    event.preventDefault();
    that.$窗口内打开超链接(`/widgets/cc-image-tag-new/`);
}

that.$快捷键触发器={
    escape:清理选择,
    f1:打开帮助
}

that.$键位数组 = []

that.$快捷键处理器 = function($event){
    let 键位数组 = that.$键位数组
    let 按键名 = $event.key.toLowerCase()
    let 键位字符串 = ""
    if(键位数组.length>0){
        if(键位数组.indexOf(按键名) >= 0) {
            return
        }
    }
    键位数组.push(按键名)
    键位字符串= 键位数组.join('+')
    //console.log(键位字符串)
    that.$键位数组=[]
    let 处理函数 = that.$快捷键触发器[键位字符串]
    处理函数?处理函数($event):null
}
