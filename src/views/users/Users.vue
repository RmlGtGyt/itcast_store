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
      <el-input placeholder="请输入内容" v-model="userSearchValue" class="searchInput">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchValue(userSearchValue)"></el-button>
      </el-input>
      <!-- 添加按钮 -->
      <el-button type="success" @click="loadAdd">添加用户</el-button>
      <el-button type="success" @click="dialogFormVisible = true">添加用户（弹出框）</el-button>
    </div>

    <!-- 添加新用户 -->
    <el-dialog @closed="closeClear" title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="formData" :label-width="formLabelWidth" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.mobile" auto-complete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddDialog">确 定</el-button>
      </div>
    </el-dialog>

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
          <!-- 编辑的两种方式：弹出层和新建页面 -->
          <!-- <el-button plain type="primary" icon="el-icon-edit" size="mini" @click="loadEditNew(scope.row.id)"></el-button> -->
          <!-- 弹出框的方式 -->
          <el-button plain type="primary" icon="el-icon-edit" size="mini" @click="loadEdit(scope.row)"></el-button>
          <el-button plain type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row.id)"></el-button>
          <el-button plain type="success" icon="el-icon-check" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出层编辑用户信息 -->
    <el-dialog title="编辑用户" :visible.sync="rolesFormVisible">
      <el-form :model="formData" :label-width="formLabelWidth">
        <el-form-item label="当前用户">
          {{ formData.username }}
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleEditDialog">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleEdit" @closed="closeClear">
      <el-form :model="formData" :label-width="formLabelWidth">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleEditDialog">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 3, 4, 5]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
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
      // 数据总条数
      total: 1,
      // 每页显示的数据
      pagesize: 4,
      // 当前显示的页码
      currentPage: 1,
      // 用户输入的内容
      userSearchValue: '',
      // 弹出框显示状态初始值
      dialogFormVisible: false,
      // 编辑用户信息弹出层显示状态的初始值
      dialogFormVisibleEdit: false,
      // 弹出框的高度
      formLabelWidth: '80px',
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 8, message: '长度在 6 到 8 位之间', trigger: 'blur' }
        ]
      }
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

      const res = await this.$http.get(`users?pagenum=${this.currentPage}&pagesize=${this.pagesize}&query=${this.userSearchValue}`);

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
        console.log(this.list);
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
    // 点击编辑按钮，跳转到编辑页面(新建页面方式添加)
    loadEditNew(id) {
      this.$router.push(`/users/edit/${id}`);
    },
    // 弹出层方式编辑用户信息
    loadEdit(user) {
      this.dialogFormVisibleEdit = true;
      // 将用户原本的信息渲染到对应的文本框
      this.formData = user;
    },
    // 点击编辑确定按钮，修改用户信息
    async handleEditDialog() {
      console.log(this.formData);
      // 发送请求，修改用户数据
      const res = await this.$http.put(`users/${this.formData.id}`, {
        email: this.formData.email,
        mobile: this.formData.mobile
      });
      const data = res.data;
      const {meta: {msg, status}} = data;
      if (status === 200) {
        // 提示成功
        this.$message.success('用户数据修改成功');
        // 关闭弹出层
        this.dialogFormVisibleEdit = false;
        // 重新渲染页面
        this.loadData();
      } else {
        this.$message.error(msg);
      }
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
      const {meta: {msg, status}} = data;
      if (status === 200) {
        this.$message.success('用户状态修改成功');
        // 刷新页面
        this.loadData();
      } else {
        this.$message.error(msg);
      }
    },
    // 当点击删除按钮时，发送请求删除数据
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 获取token
        const token = sessionStorage.getItem('token');
        // 在请求头中设置token
        this.$http.defaults.headers.common['Authorization'] = token;
        // 发送请求删除数据
        const res = await this.$http.delete(`users/${id}`);

        const data = res.data;
        const {meta: {msg, status}} = data;
        if (status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 刷新页面
          this.currentPage = 1;
          this.loadData();
        } else {
          this.$message.error(msg);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loadData();
    },
    // 搜索事件
    handleSearchValue(userSearchValue) {
      this.userSearchValue = userSearchValue;
      this.loadData();
    },
    // 弹出层方式添加新用户
    async handleAddDialog() {
      // 发送添加请求
      const res = await this.$http.post('users', this.formData);
      const data = res.data;
      const {meta: {msg, status}} = data;
      // 判断添加状态
      if (status === 201) {
        this.$message.success('用户数据添加成功');
        // 关闭添加框弹出层
        this.dialogFormVisible = false;
        // 重新渲染页面
        this.loadData();
      } else {
        this.$message.error(msg);
      }
    },
    // 设置清空表单数据的函数
    closeClear() {
      for (let key in this.formData) {
        this.formData[key] = '';
      }
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
