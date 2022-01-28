
Vue.prototype.$挂件模式 =  ()=>{
    if (window==window.parent){
        return false
    }
    else {
        return true
    }
}
Vue.prototype.$html转义 = function(原始字符串){
    let 临时元素 = document.createElement("div"); 
    临时元素.innerHTML = 原始字符串; 
    let output = 临时元素.innerText || 临时元素.textContent; 
    临时元素 = null; 
    return output; 
}
Vue.prototype.$获取事件目标块id=function(event){
    let that = this
    let 当前块id = ""
    console.log(event.target)
    let targetel = event.target.parentElement
    if (!targetel.getAttribute("data-node-id")){targetel= targetel.parentElement}
    
    let tempid =  targetel.getAttribute("data-node-id")
    if (tempid && tempid != that.tempid ){
        当前块id = tempid
    }
    return 当前块id
}
Vue.prototype.$解析块属性 =async function (属性名,原始属性值){
           转义属性值 = Vue.prototype.$html转义(原始属性值)
           that.当前块属性[item] = 原始属性值
           let 解析属性值 = null
           try {
               解析属性值 = JSON.parse(原始属性值)
               if (解析属性值.label==""||!解析属性值.label){解析属性值.label=item.slice(7,0)}
               if (解析属性值.label&&解析属性值.value&&解析属性值.type){解析属性值={'label':解析属性值.label,'value':解析属性值.value,'type':解析属性值.type}}
               else if (解析属性值.label&&解析属性值.value){解析属性值={'label':解析属性值.label,'value':解析属性值.value,'type':"rawstring"}}
               else if (解析属性值.label&&解析属性值.type){解析属性值={'label':解析属性值.label,'value':"",'type':解析属性值.type}}
               else{解析属性值={'label':item.slice(7,0),'value':原始属性值,'type':'rawstring'}}
              }
           catch(e){解析属性值= {'label':item.slice(7,0),'value':原始属性值,'type':'rawstring'}}
           if (解析属性值.type=="块链接"||解析属性值.type=="block-link"){
               解析属性值.target = await 获取思源块链接锚文本(that.思源伺服ip,this.apitoken,解析属性值["value"])
           }
           return 解析属性值
}
Vue.prototype.$获取思源主界面主题=function(主界面){
    主题元素 = 主界面.querySelector('#themeDefaultStyle')
    let 复制主题元素 =  window.document.querySelector('#themeDefaultStyle')
    
    if(!复制主题元素){
        let 临时主题元素  = document.createElement("link")
        临时主题元素.setAttribute("id","themeDefaultStyle")
        let head =  document.querySelector("head")
        head.appendChild(临时主题元素)
        复制主题元素= 临时主题元素
    }
    复制主题元素.setAttribute('rel',主题元素.getAttribute('rel'))
    复制主题元素.setAttribute('type',主题元素.getAttribute('type'))
    复制主题元素.setAttribute('href',主题元素.getAttribute('href'))
    console.log(复制主题元素)
}

Vue.prototype.$以开头标记请求思源代码块数组=async function(字符串){
    let that = this
    let sql =  `select * from blocks where type = "c" and content like "${字符串}%"`
    let 块列表 = ""
    块列表= await 以sql向思源请求块数据(that.思源伺服ip,that.apitoken,sql)
    return 块列表
}
Vue.prototype.$设定对象属性=async function(对象,属性名,属性值){
    let that =this
    if(对象["属性名"]){
        对象["属性名"]=属性值
    }
    else{
        that.$set(对象,属性名,属性值)
    }
}
Vue.prototype.$以id数组通过sql形式获取思源块信息数组=async function(id数组){
    let that =this 
    let 查询条件数组 = [] 
    id数组.forEach(id=>
        查询条件数组.push(`id = "${id}"`)
    )
    let 查询sql = that.$通过条件数组构建sql字符串(查询条件数组,"or")
    let 块数组= await 以sql向思源请求块数据(that.思源伺服ip,that.apitoken,查询sql)
    return 块数组
},

Vue.prototype.$通过条件数组构建sql字符串=function(查询条件数组,连接谓词){
    let 最终字符串 = ''
    for (i=0;i<查询条件数组.length;i++){
        let 查询条件= 查询条件数组[i]
        if (i<查询条件数组.length-1){
            最终字符串 =" "+ 最终字符串 + 查询条件 + " "+连接谓词+" "
        }
        else{最终字符串=" "+ 最终字符串 + 查询条件 + " "}
    }
    console.log(最终字符串)
    最终字符串 = "select * from blocks where "+最终字符串
    return 最终字符串
}

Vue.prototype.$挂件自身元素=function(){
    try{
    return window.frameElement.parentElement.parentElement}
    catch(e){return null}
},

Vue.prototype.$以id获取块内容=async function(外部块数组,id){
    let sql = `select * from blocks where id = '${id}'`
    let res = await 以sql获取嵌入块内容(this.思源伺服ip,this.apitoken,外部块数组,sql)
    return res["data"]
}

Vue.prototype.$窗口内打开思源块=function (id){
    let 主界面= this.$root?this.$root.主界面||window.parent.document:window.parent.document
    if (this.$挂件模式()){
    let 虚拟链接 =  主界面.createElement("span")
    虚拟链接.setAttribute("data-type","block-ref")
    虚拟链接.setAttribute("data-id",id)
    let 临时目标 = 主界面.querySelector(".protyle-wysiwyg div[data-node-id] div[contenteditable]")
    临时目标.appendChild(虚拟链接)
    let 点击事件 =  主界面.createEvent('MouseEvents')
    点击事件.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    虚拟链接.dispatchEvent(点击事件);
    虚拟链接.remove()}
    else{
        主界面=window.document
        console.log(主界面)
        let 虚拟链接 = 主界面.createElement("a")
        虚拟链接.setAttribute("href",`siyuan://blocks/${id}`)
        document.body.appendChild(虚拟链接)
        let 点击事件 =  主界面.createEvent('MouseEvents')
        点击事件.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        虚拟链接.dispatchEvent(点击事件);
        虚拟链接.remove()
    }
}

Vue.prototype.$窗口内打开超链接=function (链接){
    let 主界面= {}
    if (this.$挂件模式()){
    console.log(链接)
    主界面=window.parent.document
    let 虚拟链接 =  主界面.createElement("span")
    虚拟链接.setAttribute("data-type","a")
    虚拟链接.setAttribute("data-href",链接)
    let 临时目标 = 主界面.querySelector(".protyle-wysiwyg div[data-node-id] div[contenteditable]")
    临时目标.appendChild(虚拟链接)
    let 点击事件 =  主界面.createEvent('MouseEvents')
    点击事件.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    虚拟链接.dispatchEvent(点击事件);
    虚拟链接.remove()}
    else{
        主界面=window.document
        console.log(主界面)
        let 虚拟链接 = 主界面.createElement("a")
        虚拟链接.setAttribute("href",链接)
        document.body.appendChild(虚拟链接)
        let 点击事件 =  主界面.createEvent('MouseEvents')
        点击事件.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        虚拟链接.dispatchEvent(点击事件);
        虚拟链接.remove()
    }
}

Vue.prototype.$节流执行=function (函数,执行间隔) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout);

        let callNow = !timeout;
        timeout = setTimeout(() => {
            timeout = null;
        }, 执行间隔)

        if (callNow) 函数.apply(context, args)
    }
}
Vue.prototype.$解析url=function(url){
    
        url = url || '';
        const queryObj = {};
        const reg = /[?&]([^=&#]+)=([^&#]*)/g;
        const queryArr = url.match(reg) || [];
        console.log(queryArr)
        for (const i in queryArr) {
            if (Object.hasOwnProperty.call(queryArr, i)) {
                const query = queryArr[i].split('=');
                const key = query[0].substr(1);
                const value = decodeURIComponent(query[1]);
                queryObj[key] ? queryObj[key] = [].concat(queryObj[key], value) : queryObj[key] = value;
            }
        }
        console.log(queryObj)
        return queryObj;
    
}
Vue.prototype.$获取书签列表=async function(){
    let that = this
    await axios({
        method:"post",
        url:'http://'+that.思源伺服ip + '/api/attr/getBookmarkLabels',
        headers:{'Authorization': 'Token '+ that.apitoken },
        data:({})
        }).then(
            result=>{
               /// console.log(result.data)
                that.书签列表 = result.data["data"]
            }
        )
        that.主界面= window.parent.document
}

Vue.prototype.$以id获取块内容=async function (id) {
    let 数据源id = this.挂件自身元素.getAttribute("data-node-id");
    let 临时属性数组 = await this.$以id数组通过sql形式获取思源块信息数组([
      数据源id,
    ]);
    let 挂件自身属性 = 临时属性数组[0];
    let 当前文档id = 挂件自身属性["root_id"];
    let 外部id数组 = [数据源id, 当前文档id];
    let 块内容 = await this.$以id获取块内容(外部id数组, id);
  }
  Vue.prototype.$解析思源ial=function(ial){
    let ial对象 = {};
    if (ial) {
      console.log(ial);

      ial = ial.replace(/" /g, '","').replace("{: ", '{"').replace(/="/g, '":"');
      console.log(ial);
      ial对象 = JSON.parse(ial);
    }
    return ial对象
  }

  Vue.prototype.$主界面=window.parent.document