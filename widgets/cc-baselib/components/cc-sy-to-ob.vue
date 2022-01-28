<template>
    <el-button 
    size="mini"
    @click="copytoob(syhtml)"
    icon="el-icon-document-copy" 
    round
    >
    导出到obsidian(预览模式下点击按钮后复制)
    </el-button>            
</template>
<script>
module.exports = {
    props:['syhtml'],
    model:{
        props:"markdown",
        event:"change"
    },
    data() {
        return {
            finalhtml:this.syhtml,
            blockinfor:{},
            docHtml:{},
            docHtmlleng:0,
            embedblocks:[],
        }
    },
    methods: {
        copytoob:async  function(syhtml){
            console.log(this.syhtml)
            let 当前文档背景图 = this.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .protyle-background")
            let 当前文档id = 当前文档背景图.getAttribute("data-node-id")
            await this.获取文档完整内容(当前文档id)
            let 当前预览html= this.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
         //   let 当前文档html= this.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) [data-doc-type='NodeDocument']")
            当前预览html.innerHTML = this.docHtml
            console.log(当前预览html)
            this.转化html()
            },
        去除icon: function(){
            let 当前预览html= this.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
            let icons =  当前预览html.querySelectorAll(".protyle-attr,.protyle-action")
            icons.forEach(el=>el.remove())
        },
        去除memo等: function(){
            let 当前预览html= this.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
            let blockcontents =  当前预览html.querySelectorAll("[spellcheck='false']")
            blockcontents.forEach(el=>el.outerHTML=el.innerHTML)
            console.log("去除meomo成功")
        },
        转化代码块:function(){
            let that =this
            let 当前预览html= that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
            while (当前预览html.querySelectorAll("div.code-block").length!=0){checkcode()}
            function checkcode(){
            当前预览html= that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
            el = 当前预览html.querySelector("div.code-block")
            let replaceel = document.createElement("div")
            let replaceli = document.createElement("div")

            replaceli.setAttribute("id",el.getAttribute("data-node-id"))
            replaceel.appendChild(replaceli)
            console.log(el.firstChild)
            let lan = el.querySelector('span')
            console.log(lan)
            replaceli.innerHTML = `<p>\`\`\`${el.querySelector('.protyle-action__language').innerHTML}</p>
            <p>${el.textContent.replace(el.querySelector('.protyle-action__language').innerHTML,"")}</p><p>\`\`\`</div>
            <p>^${el.getAttribute("data-node-id")}</p><p>%%memo:${el.getAttribute("memo")},name:${el.getAttribute("name")},alias:${el.getAttribute("alias")}%%</p>`
            console.log(replaceel.innerHTML)
            el.outerHTML= replaceel.innerHTML
            console.log("转化代码块成功")
            }
        },
        转化列表:function(){
            let that =this
            let 当前预览html= that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
            let types = [{"subtype":"u","tag":"ul"},{"subtype":"o","tag":"ol"},{"subtype":"t","tag":"ul"}]
            for(i in types){
            aaa(types[i])
            }
            function aaa(item){
            let el = 当前预览html.querySelector("div.list[data-subtype='"+item["subtype"]+"']")
            console.log(item)
            while (当前预览html.querySelectorAll("div.list[data-subtype='"+item["subtype"]+"']").length!=0){checkul(),console.log(当前预览html.querySelectorAll("div.list[data-subtype='"+item["subtype"]+"']").length)}
            function checkul(){
            当前预览html= that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
            el = 当前预览html.querySelector("div.list[data-subtype='"+item["subtype"]+"']")
            let replaceel = document.createElement("div")
            let replaceli = document.createElement(item["tag"])
            replaceli.setAttribute("id",el.getAttribute("data-node-id"))
            replaceel.appendChild(replaceli)
            console.log(el.firstChild)
            replaceel.firstChild.innerHTML = el.innerHTML
            console.log(replaceel.innerHTML)
            el.outerHTML= replaceel.innerHTML
            console.log("转化无序列表成功")
            }
            while (当前预览html.querySelectorAll(item["tag"]+"[id] div.li").length!=0){checkuli(),console.log(当前预览html.querySelectorAll("div.list[data-subtype='u'] .li").length)}
            function checkuli(){
             当前预览html= that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")

            el = 当前预览html.querySelector(item["tag"]+"[id] div.li")
            let replaceel = document.createElement("div")
            let replaceli = document.createElement("li")
            replaceli.setAttribute("id",el.getAttribute("data-node-id"))

            replaceel.appendChild(replaceli)
            console.log(el.firstChild)
            if (item["subtype"]='t'){
                el.firstChild.innerHTML=" [ ] " + el.firstChild.innerHTML
                }
            replaceel.firstChild.innerHTML = el.innerHTML
            
            console.log(replaceel.innerHTML)
            
            
            el.outerHTML= replaceel.innerHTML
            }
            console.log(`转化${item["tag"]}列表成功`)
            }
        },
        转化嵌入块:async function(){
            let that = this
            let 当前预览html= that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
            let 嵌入块列表 = 当前预览html.querySelectorAll('div[data-type="NodeBlockQueryEmbed"]')
            let 嵌入块 = 嵌入块列表[0]
            console.log(嵌入块)

            while(嵌入块列表.length!=0){await checkembed(),console.log(嵌入块列表.length)}
            
          async function checkembed(){
                 当前预览html= that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
                  嵌入块列表 = 当前预览html.querySelectorAll('div[data-type="NodeBlockQueryEmbed"]')
                let 嵌入块 = 嵌入块列表[0]
                console.log(嵌入块)
                if(嵌入块){
                嵌入块.outerHTML= await that.获取嵌入(嵌入块.getAttribute("data-content"))}
            }
        },
        获取嵌入:async function(sql){
            let that =this
            let  jsondatas = {"stmt":sql,"excludeIDs":[]}
            await axios({
                        method:'POST',
                        url:'http://'+vm.hosturl + '/api/search/searchEmbedBlock',
                        headers:{'Authorization': 'Token '+ that.apitoken },
                        data:(jsondatas)
                        }).then(result =>{
                         blockinfor1 =  result["data"]["data"]["blocks"]
                         console.log(result["data"]["data"],result["data"]["data"]["blocks"])
                        if (blockinfor1){
                        that.embedblocks = blockinfor1}
                        })
            let content = ""
            that.embedblocks.forEach(el=>content = content + el.content)
            return content
        },          
        转化加粗:function (){
             let 当前预览html= this.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
            let strongs = 当前预览html.querySelectorAll("strong")
            if(strongs.length>0)
            {
                strongs.forEach(el=>
                {   
                  
                    let outerHTML = el.outerHTML.replace(/strong/,"<span>strong</span>")
                    el.outerHTML = outerHTML+"<span><</span>/strong>"
                })
            }
        },
        转化块引链接:async function(){
            let that = this
            let 当前预览html= that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")

            let links =  当前预览html.querySelectorAll('span[data-type="block-ref"]')
            if(links.length>0)
                {   aaa(links)
                    async function aaa(links) 
                   { links.forEach(element => {
                   let elhref ="siyuan://blocks/"+ element.getAttribute("data-id")
                    
                   let realhref = ""
                   if (elhref.slice(0,9)=="siyuan://"){
                    bbb()
                    async function bbb(){   
                    let id = elhref.replace(/siyuan\:\/\/blocks\//g,"")
                    await that.查找链接类型(id)
                    console.log('aaa',that.blockinfor)
                    let linkinfor =that.blockinfor
                    let hpath = linkinfor['hpath']
                    let index = hpath.lastIndexOf("\/");  

                    let docname  = hpath.substring(index + 1, hpath.length);

                    if (linkinfor["type"]=='d'){obhref =  linkinfor["content"]} 
                    else if(linkinfor["type"]=='h')  {obhref = docname+"#"+linkinfor["content"]}
                    else {obhref = docname+"#^"+id}                   
                    if (obhref!=""&& obhref){
                       console.log(obhref)
                 //  element.setAttribute("data-href",obhref)
                 ///  element.setAttribute("class","internal-link")
                  // element.setAttribute("target","_blank")
                  //  element.setAttribute("rel","noopener")
                  //  element.setAttribute('href',obhref)
               //   obhref = obhref.replace(/ /g,'%20')
         
               ////   obhref = obhref.replace(/\?/g,'%3F')
                ///  obhref = obhref.replace(/\%/g,'%25')
                //  obhref = obhref.replace(/\&/g,'%26')
                    element.outerHTML=`[[${obhref}|${element.innerHTML}]]`+`%%[${linkinfor["content"]}](${elhref})%%`


                   i=i+1
                   }}}
                });}
           
            }
        },
        转化普通超链接(){
            let that = this
            let 当前预览html= that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")

            let links =  当前预览html.querySelectorAll('span[data-type="a"]')
            if(links.length>0){
                links.forEach(element=>{
                element.outerHTML=`[${element.innerHTML}](${element.getAttribute("data-href")})`
            })
            }
        },
        转化普通块(){
            let that = this
            let 当前预览html= that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")

            let blocks =  当前预览html.querySelectorAll('div.p,div.h1,div.h2,div.h3,div.h4,div.h4,div.h5,div.h6')

            if(blocks.length>0){
                blocks.forEach(element=>{
                element.innerHTML=`${element.innerHTML}<p>^${element.getAttribute("data-node-id")}</p><p>%%memo:${element.getAttribute("memo")},name:${element.getAttribute("name")},alias:${element.getAttribute("alias")}%%</p>`
            })
            }

        },
        转化html:async function(){
             await this.转化嵌入块()
             this.转化代码块()
             this.去除icon()
             this.去除memo等()
             this.转化列表()
             this.转化加粗()
             await this.转化块引链接()
             this.转化普通超链接()
             this.转化普通块()
             let 当前预览html = this.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
     
        },
        查找链接类型:async  function(id){
              let that = this
              console.log("linkid",id)
              let sql语句 = "select * from blocks where id ='"+id+"'"
               let jsondatas =  {"stmt": sql语句} 
             function aa(){
             return axios({
                        method:'POST',
                        url:'http://'+vm.hosturl + '/api/query/sql',
                        headers:{'Authorization': 'Token '+ that.apitoken },
                        data:(jsondatas)
                        }).then(result =>{
                         blockinfor1 =  result.data["data"][0]
                        if (blockinfor1){
                        return blockinfor1}
                        })}
              await  axios.all([aa()])
                .then(axios.spread((blockinfor)=>{
                    that.blockinfor = blockinfor
                    console.log('bbb',that.blockinfor)
                     return that.blockinfor

                }))

             },
        获取文档完整内容:async function(id){
            let that = this
            jsondatas = {"id":id,"k":"",mode:0,size:36}
            that.docHtmlleng = 0
            await axios({
                 method:'POST',
                        url:'http://'+vm.hosturl + '/api/filetree/getDoc',
                        headers:{'Authorization': 'Token '+ that.apitoken },
                        data:(jsondatas)
                        }).then(result=>{
                            that.docHtmlleng = result.data["data"]['blockCount']
                        })

            jsondatas["size"]=that.docHtmlleng*6
            await axios({
                 method:'POST',
                        url:'http://'+vm.hosturl + '/api/filetree/getDoc',
                        headers:{'Authorization': 'Token '+ that.apitoken },
                        data:(jsondatas)
                        }).then(result=>{
                            that.docHtml = result.data["data"]['content']
                        })

            }
    
    },
    
}

</script>
 
<style>


</style>