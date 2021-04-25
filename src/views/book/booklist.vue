<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="书名"
        style="width: 200px"
        clearable
        class="filter-item"
        @keyup.enter.native="handleList"
        @clear="handleList"
        @blur="handleList"
      />
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width: 200px;margin-left: 5px"
        clearable
        class="filter-item"
        @keyup.enter.native="handleList"
        @clear="handleList"
        @blur="handleList"
      />
      <el-select
        v-model="listQuery.category"
        style="width: 200px;margin-left: 5px"
        clearable
        class="filter-item"
        @change="handleList"
      >
        <el-option
          ref="category"
          v-for="item in listQuery.options"
          :key="item.categoryText"
          :label="item.categoryText"
          :value="item.categoryText">
        </el-option>
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleList"
        style="margin-left: 10px"
      >
        查询
      </el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      v-loading="isloading"
      :default-sort="defaultsort"
    >
      <!-- 复制粘贴的 -->
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />
      <el-table-column label="书名" width="150" align="center">
        <template slot-scope="{ row: { title }}">
          <span v-html="title" />
        </template>
      </el-table-column>
      <el-table-column label="作者" width="150" align="center">
        <template slot-scope="{ row: { author }}">
          <span v-html="author" />
        </template>
      </el-table-column>
      <el-table-column label="出版社" prop="publisher" width="150" align="center" />
      <el-table-column label="分类" prop="categoryText" width="100" align="center" />
      <el-table-column label="语言" prop="language" align="center" width="100"/>
      <el-table-column v-if="showCover" label="封面图片" width="150" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.cover" target="_blank">
            <img
              :src="scope.row.cover"
              style="width:120px;height:180px"
            >
          </a>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="fileName" width="100" align="center" />
      <el-table-column label="文件路径" width="100" align="center">
        <template slot-scope="{ row: { filePath }}">
          <span>{{ filePath | valueFilter }}</span>   <!--  | valueFilter  -->
        </template>
      </el-table-column>
      <el-table-column label="封面路径" width="100" align="center">
        <template slot-scope="{ row: { coverPath }}">
          <span>{{ coverPath | valueFilter }}</span>   <!--  | valueFilter  -->
        </template>
      </el-table-column>
      <el-table-column label="解压路径" width="100" align="center">
        <template slot-scope="{ row: { unzipPath }}">
          <span>{{ unzipPath | valueFilter }}</span>  <!--  | valueFilter  -->
        </template>
      </el-table-column>

      <el-table-column label="上传人" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDt | valueTime | valueFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="{ row }">
<!--          <PreviewDialog title="电子书信息" :data="row">-->
<!--            <el-button type="text" icon="el-icon-view" />-->
<!--          </PreviewDialog>-->
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button type="text" icon="el-icon-delete" style="color:#f56c6c" @click="handleDelete(row)" />
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      v-if="pageshow"
      :current-page.sync="listQuery.page"
      :page-sizes="[20, 30, 40]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
  import pagination from '../../components/Pagination';
  import waves from "../../directive/waves/waves";
  import {postCategory,postBookList,deleteBook} from "../../api/upload";
  import {parseTime} from "../../utils";

  export default {
      name: "booklist",
      data(){
        return {
          total:400,
          currentPage4:1,
          listQuery:{
            options:[],
            page:1,
            pageSize:20,
            order:'ascending'
          },
          list:[],
          showCover:false,
          isloading:true,
          total:0,
          pageshow:false,
          defaultsort:null
        }
      },
    mounted() {
      this.listQuery.page = 1
      this.pageshow = false
      this.parseQuery()
      postCategory(this.listQuery).then(res=>{
        this.listQuery.options = res.msg
      })
      this.getBookList()
      this.$nextTick(() => {
        this.pageshow = true
      })
      // this.$nextTick(function () {
      //   this.listQuery.page = this.$route.query.page
      // });
    },
    components:{
        pagination
    },
    directives:{
      waves
    },
    methods:{
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.listQuery.pageSize = val
        this.handleList(false)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.listQuery.page = val
        this.handleList(false)
      },
      sortChange(data){
        console.log('data',data)
        this.listQuery.order = data.order
        this.handleList()
      },
      async handleList(change){
        console.log('change',JSON.stringify(typeof change))
        if(change){
          console.log('进来了')
          this.listQuery.page = 1
        }
        await this.getBookList()
        console.log('total',this.total)
        // if(this.currentPage4 ==1 ){
        //   this.listQuery.page = 1
        // }
        // this.currentPage4 = this.listQuery.page
        this.$router.push({
          path:'/book/list',
          query:this.listQuery
        })

      },
      parseQuery(){
        let query = this.$route.query
        const listQuery = {
          page:1,
          pageSize:20,
          order:'ascending'
        }
        if(query){
          query.page && (query.page = +query.page)
          query.pageSize && (query.pageSize = +query.pageSize)
        }
        this.listQuery = Object.assign(listQuery,query)
        console.log(query.order)
        console.log(listQuery.order)
        this.defaultsort = {
          prop: "id",
          order: listQuery.order == "ascending" ? "ascending" : "descending"
        }
        console.log(this.listQuery)
      },
      getBookList(){
        postBookList(this.listQuery).then(res=>{
          function HighLight(value){
            return `<span style="color: gold;font-size: 14px">${value}</span>`
          }
          console.log(res)
          this.list = res.msg.list
          this.total = res.msg.count
          // console.log('count',res.msg.count)
          this.isloading = false
          let title = this.listQuery.title
          let author = this.listQuery.author
          // this.ListQuery.title && (this.list.titleWarpper = getHighLighTitle(this.ListQuery.title,''))
          if(title!==undefined){
            this.list.forEach(function (item) {
              item.title = item.title.replace(new RegExp(title,'ig'),HighLight(title))
              // console.log(item)
            })
          }
          if(author!==undefined){
            this.list.forEach(function (item) {
              item.author = item.author.replace(new RegExp(author,'ig'),HighLight(author))
              // console.log(item)
            })
          }
          console.log('图书列表',res.msg)
          console.log('thisListQuery',this.listQuery)
          console.log('category',this.listQuery.options)
        })

      },
      handleUpdate(row){
        console.log(row)
        this.$router.push('/book/edit/' + row.fileName)
      },
      handleDelete(row){
        console.log('delete',row)
        deleteBook(row.fileName).then(res=>{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          });
          this.handleList()
        })
      }
    },
    filters:{
      valueFilter(value){
        return value || '无'
      },
      valueTime(value){
        return parseTime(value,'{y}-{m}-{d} {h}:{i}:{s}')
      }
    },
    beforeRouteUpdate(to,from,next){
      let query = Object.assign({},from.query)
      let newquery = Object.assign({},to.query)
      if(JSON.stringify(query)!==JSON.stringify(newquery)){
        this.getBookList()
      }
      next()
    }
  }
</script>

<style scoped>

</style>
