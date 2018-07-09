<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" class="searchInput" clearable>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <!-- 添加按钮 -->
      <el-button type="success" @click="loadAdd">添加用户</el-button>
    </div>

    <!-- 列表详情 -->
    <el-table
      v-loading="loading"
      :data="list"
      border
      stripe
      style="width: 100%">
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="创建日期">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleState(scope.row.id, scope.row.mg_state)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button plain type="primary" icon="el-icon-edit" size="mini" @click="loadEdit(scope.row.id)"></el-button>
          <el-button plain type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row.id)"></el-button>
          <el-button plain type="success" icon="el-icon-check" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      :current-page="currentPage"
      :page-size="pagesize"
      layout="prev, pager, next, jumper, total, slot"
      prev-text="上一页"
      next-text="下一页"
      @current-change="handleCurrent"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 用户列表数据
      list: [],
      loading: true,
      value1: true,
      value2: true,
      total: '',
      pagesize: 10,
      currentPage: '',
      AllCommodityList: ''
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 发送给请求，获取用户列表数据
    async loadData() {
      // 发送异步之前
      this.loading = true;

      // 发送请求之前获取token
      const token = sessionStorage.getItem('token');
      if (!token) {
        this.$router.push({name: 'login'});
        this.$message.warning('您尚未登录，请登陆后再访问');
      }
      // 在请求头设置token
      this.$http.defaults.headers.common['Authorization'] = token;

      const res = await this.$http.get(`users?pagenum=1&pagesize=${this.pagesize}`);

      // 异步请求结束
      this.loading = false;

      // 获取相应数据
      const data = res.data;
      // 获取meta中的msg  status
      const { meta: {msg, status} } = data;
      if (status === 200) {
        const { data: {users, total} } = data;
        // 将用户的值赋值给list
        this.list = users;
        // 为state赋值
        this.state = users.mg_state;
        // 将total赋值给分页标签
        this.total = total;
      } else {
        this.$message.error(msg);
      }
    },
    // 点击添加按钮，跳转页面
    loadAdd() {
      this.$router.push('/users/add');
    },
    // 点击编辑按钮，跳转到编辑页面
    loadEdit(id) {
      this.$router.push(`/users/edit/${id}`);
    },
    // 点击状态按钮，修改显示状态
    async handleState(id, state) {
      // 获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中设置token
      this.$http.defaults.headers.common['Authorization'] = token;

      // // 发送请求，获取数据
      const res = await this.$http.put(`users/${id}/state/${state}`);
      const data = res.data;
      const { meta: {msg, status}} = data;
      if (status === 200) {
        this.$message.success('用户状态修改成功');
        // 刷新页面
        this.loadData();
      } else {
        console.log(msg);
      }
    },
    // 当点击删除按钮时，发送请求删除数据
    async handleDelete(id) {
      // 获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中设置token
      this.$http.defaults.headers.common['Authorization'] = token;
      // 发送请求删除数据
      const res = await this.$http.delete(`users/${id}`);

      const data = res.data;
      const { meta: {msg, status}} = data;
      if (status === 200) {
        this.$message.success('用户删除成功');
        // 刷新页面
        this.loadData();
      } else {
        console.log(msg);
      }
    },
    // 当前页码发生改变时触发
    handleCurrent(val) {
      // 获取当前页码
      const currentPage = val;
      console.log(currentPage);
    }
  }
};
</script>

<style lang="">
  .searchInput {
    width: 300px;
  }
  .box-card {
    height: 100%;
  }
</style>
