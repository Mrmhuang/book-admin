<template>
  <div class="detail">
    <el-form ref="postForm" :model="postForm" class="form-container" :rules="rules">
      <sticky :z-index="10" :class="'sub-navbar '+ postForm.status">  <!-- 这里sub-navbar后面的空格很重要 -->
        <el-button v-if="!isEdit" @click.prevent.stop="showGuide">显示帮助</el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit ? '编辑电子书' : '新增电子书' }}
        </el-button>
      </sticky>
      <div class="detail-container">
        <el-row>
<!--          <Warning />-->
          <el-col :span="24">
            <!-- 编写具体表单控件 -->
            <EbookUpload @onSuccess="success" @onRemove="remove"></EbookUpload>
          </el-col>
          <el-col :span="24">
<!--            <el-col :span="24">-->
              <el-form-item style="margin-bottom: 40px;" prop="title">
                <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                  书名
                </MDinput>
              </el-form-item>
              <div>
                <el-row>
                  <el-col :span="12" class="form-item-author">
                    <el-form-item :label-width="labelWidth" label="作者：" prop="author">
                      <el-input
                        v-model="postForm.author"
                        placeholder="作者"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label-width="labelWidth" label="出版社：" prop="publisher">
                      <el-input
                        v-model="postForm.publisher"
                        placeholder="出版社"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label-width="labelWidth" label="语言：">
                      <el-input
                        v-model="postForm.language"
                        placeholder="语言"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label-width="labelWidth" label="根文件：">
                      <el-input
                        v-model="postForm.rootFile"
                        placeholder="根文件"
                        style="width: 100%"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label-width="labelWidth" label="文件路径：">
                      <el-input
                        v-model="postForm.filePath"
                        placeholder="文件路径"
                        style="width: 100%"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label-width="labelWidth" label="解压路径：">
                      <el-input
                        v-model="postForm.unzipPath"
                        placeholder="解压路径"
                        style="width: 100%"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label-width="labelWidth" label="封面路径：">
                      <el-input
                        v-model="postForm.coverPath"
                        placeholder="封面路径"
                        style="width: 100%"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label-width="labelWidth" label="文件名称：">
                      <el-input
                        v-model="postForm.fileName"
                        placeholder="文件名称"
                        style="width: 100%"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label-width="60px" label="封面：">
                      <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                        <img :src="postForm.cover" class="preview-img">
                      </a>
                      <span v-else>无</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label-width="60px" label="目录：">
                      <div
                        v-if="postForm.contents && postForm.contents.length > 0"
                        class="contents-wrapper"
                      >
                        <el-tree :data="contentsTree" @node-click="onContentClick" />
                      </div>
                      <span v-else>无</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
<!--            </el-col>-->
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
  import EbookUpload from '../../components/EbookUpload/index'
  import Sticky from '../../components/Sticky/index'
  import MDinput from '../../components/MDinput/index'
  import {postEdit, postEpub ,editEpub} from "../../api/upload";


  const defaultPostForm = {
    status:'draft',
    author: '',
    cover: '',
    coverPath: '',
    fileName: '',
    filePath: '',
    language: '',
    publisher: '',
    rootFile: '',
    title: '',
    unzipPath: '',
    contents:[],
    contentsTree:[],
    unzipUrl:''
  }

  export default {
    data() {
      var checkInfo = (rule,value,callback)=>{
        if(value==''){
          callback(new Error('值不能为空'))
        }else{
          callback()
        }
      }
      var checkAuthor = (rule,value,callback)=>{
        if(value.length<5){
          callback(new Error('作者名不能小于5个字'))
        }else{
          callback()
        }
      }
      return {
        isCollapse: false,
        loading: false,
        labelWidth: '100px',
        postForm:{
          status:'draft',
          author: '',
          cover: '',
          coverPath: '',
          fileName: '',
          filePath: '',
          language: '',
          publisher: '',
          rootFile: '',
          title: '',
          unzipPath: '',
          contents:[],
          contentsTree:[],
          unzipUrl:''
        },
        rules:{
          title:[{validator:checkInfo}],
          author:[{validator:checkAuthor}],
          publisher:[{validator:checkInfo}]
        }
      }
    },
    created() {
      if(this.isEdit){
        console.log(this.$route.params.fileName)
        const fileName = this.$route.params.fileName;
        postEdit(fileName).then(result=>{
          console.log(result)
          this.postForm.title = result.data.title
          this.postForm.author = result.data.author
          this.postForm.publisher = result.data.publisher
          this.postForm.language = result.data.language
          this.postForm.rootFile = result.data.rootFile
          this.postForm.filePath = result.data.filePath
          this.postForm.unzipPath = result.data.unzipPath
          this.postForm.unzipUrl = result.data.unzipUrl
          this.postForm.coverPath = result.data.coverPath
          this.postForm.fileName = result.data.fileName
          this.postForm.cover = result.data.cover
          this.postForm.contents = result.data.contents || null
          this.contentsTree = result.data.contents || []

          this.$message({
            type:'success',
            message:'成功获取书籍'
          })

        }).catch((e)=>{
          // this.$message({
          //   type:'error',
          //   message:'查找书本信息失败(您可能没有上传此书)'
          // })
        })
        console.log('postEdit',this.postForm)
      }
    },
    components:{
      Sticky,
      EbookUpload,
      MDinput
    },
    methods: {
      onContentClick(data){
        // console.log(data)
        window.open(data.text)
      },
      showGuide(){
        alert('帮助显示了出来')
      },
      submitForm(){
        this.loading = true
        setTimeout(()=>{
          this.loading = false
        },200)
        this.$refs.postForm.validate((valid,field)=>{
          console.log(valid,field)
          if(valid){
            const somePostForm = Object.assign({},this.postForm)
            delete somePostForm.contentsTree
            if(!this.isEdit){
              postEpub(somePostForm).then(result=>{
                console.log(result)
                this.postForm = {
                  status:'draft',
                  author: '',
                  cover: '',
                  coverPath: '',
                  fileName: '',
                  filePath: '',
                  language: '',
                  publisher: '',
                  rootFile: '',
                  title: '',
                  unzipPath: '',
                  contents:[],
                  contentsTree:[],
                  unzipUrl:''
                }
                this.$refs.postForm.resetFields()
                this.$message({
                  type:'success',
                  message:'上传数据库成功'
                })
              })
            }else{
              editEpub(somePostForm).then(result=>{
                this.$message({
                  type:'success',
                  message:'编辑数据库成功'
                })
              }).catch((error)=>{
                throw error
              })
            }
          }else{
            this.$message({
              type:'error',
              message:'表单信息不符合要求'
            })
          }
        })
      },
      success(response){
        console.log('出发了事件')
        console.log(response)
        this.postForm.title = response.title
        this.postForm.author = response.author
        this.postForm.publisher = response.publisher
        this.postForm.language = response.language
        this.postForm.rootFile = response.rootFile
        this.postForm.filePath = response.filePath
        this.postForm.unzipPath = response.unzipPath
        this.postForm.unzipUrl = response.unzipUrl
        this.postForm.coverPath = response.coverPath
        this.postForm.fileName = response.fileName
        this.postForm.cover = response.cover
        this.postForm.contents = response.result.chapters
        this.contentsTree = response.result.chapterTree
        console.log(this.postForm)
      },
      remove(){
        this.postForm = Object.assign({},defaultPostForm)
        this.$refs.postForm.resetFields()
      }
    },
    props:{
      isEdit:{
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../src/styles/index.scss";
  .detail {
    position: relative;
    .detail-container {
      padding: 40px 45px 20px 50px;
      .preview-img {
        width: 200px;
        height: 270px;
      }
      .contents-wrapper {
        padding: 5px 0;
      }
    }
  }
</style>
