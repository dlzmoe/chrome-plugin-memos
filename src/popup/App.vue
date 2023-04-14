<template>
  <div class="body">
    <ul class="tags">
      <li @click="golist" v-bind:class="{ active: box1 }">列表</li>
      <li @click="setting" v-bind:class="{ active: box2 }">设置</li>
    </ul>
    <div class="tabcontent" v-show="box1">
      <div class="textarea-wrap">
        <textarea placeholder="开始编辑..." v-model="textarea"></textarea>
        <button @click="publish">发布笔记</button>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="date">{{ formatDate(item.createdTs) }}</div>
          <div class="content">
            <vue-simple-markdown :source="item.content"></vue-simple-markdown>
          </div>
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
      <br /><br />
      <p>目前版本仅可查看笔记信息，暂不可编辑，发布。</p>
      <p>开发者：子舒</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
      textarea: "",
    };
  },
  methods: {
    // 发布笔记
    setNote() {
      axios
        .post(this.site + "/api/memo", {
          content: this.textarea,
          visibility: "PRIVATE",
          resourceIdList: [],
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 获取数据
    getList() {
      axios
        .get(this.site + "/api/memo?openId=" + this.openId)
        .then((response) => {
          this.list = response.data.data;
          this.listerr = false;
          console.log(this.list);
        })
        .catch((error) => {
          console.error(error);
          this.listerr = true;
        });
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

      this.getList();
      this.box1 = true;
      this.box2 = false;
    },
    publish() {
      if (this.textarea != "") {
        this.setNote();
        this.getList();
      }
    },
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

<style lang="scss">
::-webkit-scrollbar {
  width: 4px;
  height: 5px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
}

::-webkit-scrollbar-thumb {
  border-radius: 0.8em;
  background-clip: padding-box;
}
body {
  width: 500px;
  height: 600px;
}
.body {
  min-height: 600px;
  background: #f3f3f3;
}
.tags {
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  margin-bottom: 0 !important;
  padding: 10px;
  background: #f3f3f3;
  z-index: 9;
  li {
    margin-right: 10px;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    user-select: none;

    &.active {
      background: #333;
      color: #fff;
    }
  }
}
.tabcontent {
  padding: 10px;
}
.list {
  .item {
    margin-bottom: 10px;
    max-width: 100%;
    padding: 15px;
    border-radius: 5px;
    background: #fff;
    box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.1);
    word-break: break-all;

    .date {
      font-size: 14px;
      color: #999;
    }
  }
}

.setting {
  font-size: 15px;
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    span {
      width: 50px;
    }
  }
  input {
    flex: 1;
    outline: none;
    border: 1px solid #999;
    border-radius: 4px;
    padding: 4px 10px;
    width: 100%;
  }

  .save {
    background: #333;
    outline: none;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: #fff;
    width: 100px;
    height: 30px;
    cursor: pointer;
    transition: all 0.1s linear;

    &:hover {
      opacity: 0.9;
    }
  }
}

.textarea-wrap {
  position: relative;
  margin-bottom: 10px;
  height: 100px;
  width: 100%;

  textarea {
    outline: none;
    border: 1px solid #dbdbdb;
    width: 100%;
    resize: none;
    height: 100%;
    border-radius: 4px;
    padding: 4px 8px;
  }

  button {
    position: absolute;
    bottom: 5px;
    right: 10px;
    background: #333;
    color: #fff;
    border-radius: 4px;
    padding: 2px 8px;
    cursor: pointer;
    user-select: none;
  }
}
</style>
