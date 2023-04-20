<template>
  <div class="body">
    <ul class="tags">
      <li @click="golist" v-bind:class="{ active: box1 }">列表</li>
      <li @click="setting" v-bind:class="{ active: box2 }">设置</li>
      <!-- <template>
        <div class="right content-inputs">
          <vs-input autocomplete="off" v-model="keyword" placeholder="搜索..." v-on:input="filteredList" />
        </div>
      </template> -->
    </ul>
    <div class="tabcontent" v-show="box1">
      <div class="textarea-wrap" :class="{ isActive: isActive }">
        <textarea placeholder="开始编辑..." v-model="textarea"></textarea>
        <div class="btn">
          <button @click="setNote" v-show="common">记下</button>
          <button @click="cancelEdit" v-show="editCommon">取消编辑</button>
          <button @click="saveEditNote()" v-show="editCommon">记下</button>
        </div>
      </div>
      <!-- 搜索关键词 -->
      <div class="tags" v-show="showkeyword">Keyword:
        <a @click="clearKeyword">{{ keyword }}</a>
      </div>

      <!-- 数据输出列表 -->
      <div class="list">
        <div class="item" v-for="(item, index) in list" :key="index" :data-id="item.id">
          <div class="date">{{ formatDate(item.createdTs) }}</div>
          <div @dblclick="goEditItem($event)">
            <vue-simple-markdown :source="item.content"></vue-simple-markdown>
          </div>
          <span class="deleteNote" @click="deleteNote($event)">delete!</span>
        </div>
      </div>
      <p v-show="listerr">请配置参数！</p>
    </div>
    <div class="tabcontent setting" v-show="box2">
      <div class="item">
        <span>网址: </span>
        <input placeholder="https://memos.com" type="text" v-model="site" />
      </div>
      <!-- <div class="item">
        <span>openId: </span>
        <input placeholder="abc-abc-123" type="text" v-model="openId" />
      </div> -->
      <div class="item">
        <span>username: </span>
        <input type="text" v-model="username" />
      </div>
      <div class="item">
        <span>password: </span>
        <input type="password" v-model="password" />
      </div>
      <button @click="Login" class="save" v-show="logintoIn">登录</button>
      <button @click="LoginOut" class="save" v-show="logintoOut">注销登录</button>
      <div class="about">
        <p>基于 <a href="https://github.com/usememos/memos" target="_blank">Memos</a> 的 chrome 扩展，热爱生活，热爱开源，我是子舒。</p>
        <p>
          扩展 Github:
          <a href="https://github.com/lovezsh/chrome-plugin-memos"
            target="_blank">https://github.com/lovezsh/chrome-plugin-memos</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "./app.scss";
export default {
  data() {
    return {
      box1: true,
      box2: false,
      // 配置
      site: "",
      openId: "",
      username: "",
      password: "",
      logintoIn: true,
      logintoOut: false,
      // 输出列表
      list: [],
      listerr: true,
      // 编辑框
      isActive: false,
      textarea: "",
      EditNoteId: "",
      common: true,
      editCommon: false,

      // 搜索
      keyword: '',
      showkeyword: false,
    };
  },
  methods: {
    // 登录请求
    async Login() {
      if (this.site && this.username && this.password) {
        axios
          .post(this.site + "/api/auth/signin", {
            username: this.username,
            password: this.password,
          })
          .then((response) => {
            // console.log(response.data.data);
            this.openId = response.data.data.openId;

            // 登录成功后把基本信息存在 localStorage
            localStorage.setItem("site", JSON.stringify(this.site));
            localStorage.setItem("openId", JSON.stringify(this.openId));
            localStorage.setItem("username", JSON.stringify(this.username));
            localStorage.setItem("password", JSON.stringify(this.password));

            this.logintoIn = false;
            this.logintoOut = true;
            const noti = this.$vs.notification({
              position: "top-center",
              color: "#000",
              duration: "2000",
              title: "😁登录成功",
            });

            this.getList();
            this.box1 = true;
            this.box2 = false;
          })
          .catch((error) => {
            console.error(error);
            const noti = this.$vs.notification({
              position: "top-center",
              color: "#000",
              duration: "2000",
              title: "😢登录失败，请检查信息！",
            });
          });
      } else {
        const noti = this.$vs.notification({
          position: "top-center",
          color: "#000",
          duration: "2000",
          title: "😢请填写完整的登录信息！",
        });
      }
    },
    // 注销登录
    async LoginOut() {
      axios
        .post(this.site + "/api/auth/signout")
        .then((response) => {
          console.log(response);
          this.username = "";
          this.password = "";

          // 清除缓存
          localStorage.clear();
          this.logintoIn = true;
          this.logintoOut = false;
          const noti = this.$vs.notification({
            position: "top-center",
            color: "#000",
            duration: "2000",
            title: "😊退出登录",
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 发布笔记
    async setNote() {
      if (this.textarea) {
        axios
          .post(this.site + "/api/memo", {
            content: this.textarea,
            visibility: "PRIVATE",
            resourceIdList: [],
          })
          .then((response) => {
            this.textarea = "";
            this.getList();
            const noti = this.$vs.notification({
              position: "top-center",
              color: "#000",
              duration: "1000",
              title: "😁发布成功！",
            });
          })
          .catch((error) => {
            console.error(error);
            const noti = this.$vs.notification({
              position: "top-center",
              color: "#000",
              duration: "1000",
              title: "😁配置错误，请重新检查！",
            });
          });
      } else {
        const noti = this.$vs.notification({
          position: "top-center",
          color: "#000",
          duration: "1000",
          title: "🫤留空不能成为笔记！",
        });
      }
    },
    // 获取数据列表
    async getList() {
      const loading = this.$vs.loading();
      axios
        .get(this.site + "/api/memo?openId=" + this.openId + "&rowStatus=NORMAL")
        .then((response) => {
          this.list = response.data.data;

          // 定义正则表达式，匹配#标签 内容格式的文本
          // const hashtagRegex = /#([\u4e00-\u9fa5\w]+)\s+([\u4e00-\u9fa5\w\s]+)/g;
          // // 循环遍历数组中的每个对象，对content属性进行替换
          // this.list.forEach((item) => {
          //   item.content = item.content.replace(hashtagRegex, "<a href='https://example.com/$1'>#$1</a>");
          //   // 将修改后的内容插入到item中
          //   console.log(item.content);
          // });
          // console.log(this.list);
          this.listerr = false;
          loading.close();
        })
        .catch((error) => {
          console.error(error);
          this.listerr = true;
        });
    },
    // 归档单篇笔记
    async deleteNote() {
      const id = event.currentTarget.parentNode.dataset.id;
      axios
        .patch(this.site + "/api/memo/" + id, {
          id: id,
          rowStatus: "ARCHIVED",
        })
        .then((response) => {
          this.getList();
          const noti = this.$vs.notification({
            position: "top-center",
            color: "#000",
            duration: "3000",
            title: "🐵删除成功！但处于归档状态，可在原网站中进行操作！",
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 双击笔记进入编辑状态
    async goEditItem() {
      const id = event.currentTarget.parentNode.dataset.id;
      this.EditNoteId = id;
      axios
        .get(this.site + "/api/memo/" + id)
        .then((response) => {
          this.isActive = true;
          this.textarea = response.data.data.content;
          this.editCommon = true;
          this.common = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 如果是历史笔记需要 PATCH
    async saveEditNote() {
      const loading = this.$vs.loading();
      axios
        .patch(this.site + "/api/memo/" + this.EditNoteId, {
          content: this.textarea,
          id: this.EditNoteId,
          resourceIdList: [],
          rowStatus: "NORMAL",
        })
        .then((response) => {
          this.isActive = false;
          this.getList();
          loading.close();
          this.textarea = "";

          this.editCommon = false;
          this.common = true;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 取消编辑
    cancelEdit() {
      this.isActive = false;
      this.textarea = "";
      this.editCommon = false;
      this.common = true;
    },
    // 搜索功能 -- 根据关键词生成列表
    filteredList() {
      if (this.keyword) {
        const keyword = this.keyword.trim().toLowerCase();
        if (!keyword) {
          return this.list;
        }
        const arr = this.list.filter(item => item.content.toLowerCase().includes(keyword));
        this.list = arr;
        this.showkeyword = true;
      } else {
        this.getList();
        this.showkeyword = false;
      }
    },
    // 清除搜索
    clearKeyword() {
      this.keyword = '';
      this.showkeyword = false;
      this.getList();
    },
    golist() {
      this.box1 = true;
      this.box2 = false;
    },
    setting() {
      this.box1 = false;
      this.box2 = true;
    },
  },
  mounted() {

    this.site = JSON.parse(localStorage.getItem("site"));
    this.username = JSON.parse(localStorage.getItem("username"));
    this.password = JSON.parse(localStorage.getItem("password"));

    // 在页面加载前判断是否存在登录信息
    if (this.site && this.username && this.password) {
      this.getList();
      this.logintoIn = false;
      this.logintoOut = true;
    }

  },
  computed: {
    formatDate() {
      return (timestamp) => {
        const date = new Date(timestamp * 1000); // 转换为毫秒
        return date.toLocaleString(); // 使用本地化的日期格式
      };
    },
  },
};
</script>
