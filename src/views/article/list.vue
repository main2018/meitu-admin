<template>
  <div class="app-container">
    <div class="article-list-header">
      <el-select v-model="currentType" placeholder="请选择">
        <el-option
          v-for="item in selectTypeData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <el-table v-loading="listLoading" :data="tabelData" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        width="50"
      >
      </el-table-column>
      <!-- <el-table-column align="center" label="ID" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column width="120px" align="center" label="Author">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->

      <el-table-column class-name="status-col" :label="$t('article.status')" width="100">
        <template slot-scope="{row}">
          {{ row.status | statusFilter }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('article.title')">
        <template slot-scope="{row}">
          <router-link :to="'/article/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('article.actions')" width="120">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page-size="100" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
// import Pagination from '@/components/Pagination'
import { getTypes } from '@/api/types'
import { sortCompare } from '@/utils'

export default {
  name: 'ArticleList',
  // components: { Pagination },
  filters: {
    statusFilter(status) {
      return ['显示', '隐藏'][status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 100
      },
      types: [],
      currentType: ''
    }
  },
  computed: {
    selectTypeData() {
      const list = this.types.map(type => {
        return {
          value: type.category,
          label: type.name
        }
      })
      return [{ value: '', label: '全部' }, ...list]
    },
    tabelData() {
      if (!this.currentType) return this.list
      return this.list.filter(item => item.category === this.currentType)
    }
  },
  created() {
    this.getTypes()
    this.getList()
  },
  methods: {
    getTypes() {
      getTypes().then(res => {
        const _list = res && res.data || []
        this.types = _list.sort(sortCompare('order'))
      }).finally(() => { this.listLoading = false })
    },
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        // console.log('response', response)
        this.list = response.data || []
        this.total = this.list.length
      }).finally(() => { this.listLoading = false })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.article-list-header{
  padding: 20px 0;
}
</style>
