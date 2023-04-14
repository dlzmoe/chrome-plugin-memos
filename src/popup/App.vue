<template>
  <div class="body">
    <ul class="tags">
      <li @click="golist" v-bind:class="{ active: box1 }">列表</li>
      <li @click="setting" v-bind:class="{ active: box2 }">设置</li>
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
        <span>网址：</span>
        <input placeholder="https://memos.com" type="text" v-model="site" />
      </div>
      <div class="item">
        <span>ID：</span>
        <input placeholder="abc-abc-123" type="text" v-model="openId" />
      </div>
      <button @click="save" class="save">保存</button>
      <div class="about">
        <p>热爱生活，热爱开源，我是子舒。</p>
        <p>Github: <a href="https://github.com/lovezsh/chrome-plugin-memos">https://github.com/lovezsh/chrome-plugin-memos</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import './app.scss';
export default {
  data() {
    return {
      box1: true,
      box2: false,
      // 配置
      site: "",
      openId: "",
      // 输出列表
      list: [],
      listerr: true,
      // 编辑框
      isActive: false,
      textarea: "",
      EditNoteId: '',
      common: true,
      editCommon: false,
    };
  },
  methods: {
    // 发布笔记
    setNote() {
      if (this.textarea != '') {
        axios
          .post(this.site + "/api/memo", {
            content: this.textarea,
            visibility: "PRIVATE",
            resourceIdList: [],
          })
          .then((response) => {
            this.textarea = '';
            this.getList();
          })
          .catch((error) => {
            console.error(error);
          });

      } else {
        alert('禁止留空');
      }

    },
    // 获取数据列表
    getList() {
      const loading = this.$vs.loading();
      axios
        .get(this.site + "/api/memo?openId=" + this.openId + '&rowStatus=NORMAL')
        .then((response) => {
          this.list = response.data.data;
          this.listerr = false;
          loading.close();
        })
        .catch((error) => {
          console.error(error);
          this.listerr = true;
        });
    },
    // 归档单篇笔记
    deleteNote() {
      const id = event.currentTarget.parentNode.dataset.id;
      axios.patch(this.site + "/api/memo/" + id, {
        id: id,
        rowStatus: "ARCHIVED",
      })
        .then(response => {
          this.getList();
        })
        .catch(error => {
          console.error(error);
        });
    },
    // 双击笔记进入编辑状态
    goEditItem() {
      const id = event.currentTarget.parentNode.dataset.id;
      this.EditNoteId = id;
      axios.get(this.site + "/api/memo/" + id)
        .then(response => {
          this.isActive = true;
          this.textarea = response.data.data.content;
          this.editCommon = true;
          this.common = false;
        })
        .catch(error => {
          console.error(error);
        });

    },
    // 如果是历史笔记需要 PATCH 
    saveEditNote() {
      const loading = this.$vs.loading();
      axios.patch(this.site + "/api/memo/" + this.EditNoteId, {
        content: this.textarea,
        id: this.EditNoteId,
        resourceIdList: [],
        rowStatus: "NORMAL",
      })
        .then(response => {
          this.isActive = false;
          this.getList();
          loading.close();
          this.textarea = '';

          this.editCommon = false;
          this.common = true;
        })
        .catch(error => {
          console.error(error);
        });
    },
    // 取消编辑
    cancelEdit() {
      this.isActive = false;
      this.textarea = '';
      this.editCommon = false;
      this.common = true;
    },
    golist() {
      this.box1 = true;
      this.box2 = false;
    },
    setting() {
      this.box1 = false;
      this.box2 = true;
    },
    save() {
      localStorage.setItem("site", JSON.stringify(this.site));
      localStorage.setItem("openId", JSON.stringify(this.openId));
      this.openNotification();

      this.getList();
      this.box1 = true;
      this.box2 = false;
    },
    openNotification(position = null) {
      const noti = this.$vs.notification({
        position: 'top-center',
        color: '#000',
        duration: '1000',
        title: '保存成功！',
      })
    }
  },
  mounted() {
    this.site = JSON.parse(localStorage.getItem("site"));
    this.openId = JSON.parse(localStorage.getItem("openId"));
    if (this.site && this.openId) {
      this.getList();
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
