<template>
    <div class="pagination-container">
        <div class="pagination-controls">
            <button class="pagination-btn disabled" id="first-page" title="首页" @click="handleClick(1)"
                :disabled="current === 1">
                首页
            </button>
            <button class="pagination-btn" id="prev-page" title="上一页" @click="handleClick(current - 1)"
                :disabled="current === 1">
                上一页
            </button>

            <div class="pagination-page" :class="current === n ? 'active' : ''" v-for="(n, i) in PagesArr" :key="i"
                @click="handleClick(n)">
                <span>{{ n }}</span>
            </div>

            <button class="pagination-btn" id="next-page" title="下一页" @click="handleClick(current + 1)"
                :disabled="current === totalPage">
                下一页
            </button>
            <button class="pagination-btn" id="last-page" title="尾页" @click="handleClick(totalPage)"
                :disabled="current === totalPage">尾页</button>

            <span class="pagination-info" style="margin-left: 15px"></span>
        </div>

        <div class="pagination-info">
            共{{ totalPage }} 页/每页 <select id="itemsPerPage" v-model="itemsPerPage" @change="handlePageSizeChange">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="custom">自定义</option>
            </select>
            <input v-if="showCustomInput" type="number" v-model="customPageSize" @input="handleCustomInput" min="1"
                placeholder="输入自定义条数">
            条
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            itemsPerPage: '10', // 默认选择10条
            customPageSize: '', // 自定义输入的值
            showCustomInput: false, // 是否显示自定义输入框
        }
    },
    props: {
        total: {
            type: Number,
            required: true
        },
        current: {
            type: Number,
            // default: 1
        },
        visiblePages: {
            type: Number,
            default: 8
        }
    },
    computed: {
        // 计算最终有效的每页条数
        effectivePageSize() {
            return this.showCustomInput ? this.customPageSize : this.itemsPerPage
        },
        totalPage() {
            return Math.ceil(this.total / this.effectivePageSize)
        },
        minPage() {
            let min = this.current - Math.floor(this.visiblePages / 2);
            if (min < 1) {
                min = 1
            };
            return min;
        },
        maxPage() {
            let max = this.minPage + this.visiblePages - 1;
            if (max > this.totalPage) {
                max = this.totalPage;
            }
            return max;
        },
        PagesArr() {
            let arr = []
            for (let i = this.minPage; i <= this.maxPage; i++) {
                arr.push(i)
            }

            return arr;
        }
    },

    methods: {
        handlePageSizeChange() {
            if (this.itemsPerPage === 'custom') {
                this.showCustomInput = true
                // 可以在这里设置一个默认的自定义值
                this.customPageSize = this.customPageSize || '10'
            } else {
                this.showCustomInput = false
                // 触发数据更新
                this.$emit('page-size-change', this.itemsPerPage)
            }
        },
        handleCustomInput() {
            // 确保输入的是正整数
            if (this.customPageSize < 1) {
                this.customPageSize = 1
            }
            // 触发数据更新
            this.$emit('page-size-change', this.customPageSize)
        },
        handleClick(newPage) {
            if (newPage < 1) newPage = 1
            if (newPage > this.totalPage) newPage = this.totalPage;

            this.$emit("handlePaginationClick", newPage);
        }
    },

}
</script>

<style lang="less" scoped>
@import "~@/styles/var.less";

.pagination-container {
    font-family: "Arial", sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
    position: relative;
    overflow: hidden;

    /* 为容器添加背景图以展示毛玻璃效果 */
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("https://picsum.photos/1200/300?blur");
        background-size: cover;
        background-position: center;
        filter: blur(3px);
        z-index: 0;
        opacity: 0.7;
    }
}




.pagination-info,
.pagination-controls {
    position: relative;
    z-index: 1;
}

.pagination-info {
    color: #333;
    font-size: 14px;
    font-weight: 500;
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
}

.pagination-controls {
    display: flex;
    align-items: center;
}

.pagination-btn {
    padding: 8px 12px;
    margin: 0 5px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.7);
    color: #007bff;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    backdrop-filter: blur(5px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    // 鼠标悬停按钮样式
    // 未禁用时
    &:hover:not(:disabled) {
        background-color: @primary;
        color: #fff;
        border-color: @primary;
    }

    &:hover:disabled {
        background-color: @warn;
        color: #fff;
        border-color: @warn;
        cursor: not-allowed;
    }

    // 禁用按钮样式
    &:disabled {
        color: #aaa;
        background-color: rgba(230, 230, 230, 0.7);
        border-color: rgba(200, 200, 200, 0.5);
        cursor: not-allowed;
    }
}


.pagination-page {
    position: relative;
    width: 36px;
    height: 36px;
    margin: 0 3px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: #333;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    backdrop-filter: blur(8px);
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    span {
        position: relative;
        z-index: 1;
        text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
        transition: all 0.3s ease;
    }

    &.active {
        background-color: rgba(100, 149, 237, 0.5);
        color: #fff;
    }

    /* 毛玻璃背景图效果 */
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: var(--bg-image);
        background-size: cover;
        background-position: center;
        filter: blur(5px);
        z-index: -1;
        opacity: 0.6;
        transition: all 0.4s ease;
    }

    /* 悬停效果 - 旋转放大并显示清晰背景 */
    &:hover {
        transform: scale(1.2) rotate(15deg);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        background-color: rgba(255, 255, 255, 0.3);
    }

    /* 选中状态效果 - 高亮显示 */
    &:active {
        transform: scale(1.3) rotate(0deg);
        background-color: rgba(0, 123, 255, 0.8);
        color: #fff;
        border-color: rgba(0, 123, 255, 0.9);
        box-shadow: 0 0 25px rgba(0, 123, 255, 0.6);
        z-index: 2;

        &::before {
            filter: blur(0);
            opacity: 1;
        }
    }
}


.pagination-page .pagination-page:hover::before {
    filter: blur(2px);
    opacity: 0.9;
}






/* 鼠标点击时的动画效果 */
.pagination-page:active {
    transform: scale(1.15) rotate(5deg);
    transition: all 0.1s ease;
}

.pagination-ellipsis {
    padding: 8px 12px;
    margin: 0 3px;
    color: #555;
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
}

.page-size-selector {
    margin-left: 15px;
    padding: 8px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.7);
    color: #333;
    font-size: 14px;
    backdrop-filter: blur(5px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 为下拉箭头添加样式 */
.page-size-selector {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 12px;
    padding-right: 30px;
}
</style>