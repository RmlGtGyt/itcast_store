<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>修改用户信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!--添加用户 -->
    <form>
      <div class="demo-input-suffix">
        用户名称：
        <el-input
          clearable
          autofocus
          :disabled="true"
          v-model="formData.username"
          class="userInput">
        </el-input>
      </div>
      <div class="demo-input-suffix">
        用户邮箱：
        <el-input
          clearable
          email
          type="email"
          v-model="formData.email"
          class="userInput">
        </el-input>
      </div>
      <div class="demo-input-suffix">
        用户电话：
        <el-input
          clearable
          type="tel"
          v-model="formData.mobile"
          class="userInput">
        </el-input>
      </div>
      <el-button type="success" class="addButton" @click="handleEdit(formData.id)">确认修改</el-button>
      <el-button type="primary" class="addButton" @click="handleCancel">取消</el-button>
    </form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: '',
        email: '',
        mobile: ''
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 发送请求根据路由中的id获取编辑用户的数据
    async loadData() {
      // 获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中发送token
      this.$http.defaults.headers.common['Authorization'] = token;
      // 获取当前路由中发送过来的id
      const id = this.$route.params.id;
      // 根据id查询数据
      const res = await this.$http.get(`users/${id}`);
      const data = res.data;
      const {meta: {msg, status}} = data;
      if (status === 200) {
        // 数据查询成功，将值赋给formData
        this.formData = data.data;
      } else {
        console.log(msg);
      }
    },
    // 点击确认修改按钮，处理修改请求
    async handleEdit(id) {
      // 获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中发送token
      this.$http.defaults.headers.common['Authorization'] = token;
      // 发送请求，处理修改
      const res = await this.$http.put(`users/${id}`, this.formData);
      const data = res.data;
      const {meta: {msg, status}} = data;
      if (status === 200) {
        this.$router.push('/users');
        this.$message.success('用户信息修改成功');
      } else {
        console.log(msg);
      }
    },
    // 点击取消按钮是，跳转到users页面
    handleCancel() {
      this.$router.push('/users');
    }
  }
};
</script>

<style lang="">
.userInput {
  width: 300px;
  margin-top: 20px;
}
.addButton {
  margin: 20px 0 0 100px;
}
</style>
