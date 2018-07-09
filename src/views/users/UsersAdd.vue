<template>
   <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加用户</el-breadcrumb-item>
    </el-breadcrumb>

    <!--添加用户 -->
    <form>
      <div class="demo-input-suffix">
        用户名称：
        <el-input
          clearable
          autofocus
          placeholder="请输入用户名"
          v-model="formData.username"
          class="userInput">
        </el-input>
      </div>
      <div class="demo-input-suffix">
        登录密码：
        <el-input
          clearable
          placeholder="请输入密码"
          type="password"
          v-model="formData.password"
          class="userInput">
        </el-input>
      </div>
      <div class="demo-input-suffix">
        用户邮箱：
        <el-input
          clearable
          email
          placeholder="请输入邮箱"
          type="email"
          v-model="formData.email"
          class="userInput">
        </el-input>
      </div>
      <div class="demo-input-suffix">
        用户电话：
        <el-input
          clearable
          placeholder="请输入手机号"
          type="tel"
          v-model="formData.mobile"
          class="userInput">
        </el-input>
      </div>
      <el-button type="success" class="addButton" @click="handleAdd">确认添加</el-button>
    </form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // list: {
      //   username: '',
      //   password: '',
      //   email: '',
      //   mobile: ''
      // }
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    };
  },
  methods: {
    async handleAdd() {
      // 获取token
      const token = sessionStorage.getItem('token');
      if (!token) {
        this.$router.push({name: 'login'});
        // 提示信息
        this.$message.warning('您尚未登陆，请登录后再访问');
      };
      // 在请求头中设置token
      this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.post('users', this.formData);
      const data = res.data;
      const {meta: {msg, status}} = data;
      if (status === 201) {
        // 跳转到用户列表页
        this.$router.push('/users');
        // 提示添加成功
        this.$message.success('新用户添加成功');
      } else {
        this.$message.error(msg);
      };
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
