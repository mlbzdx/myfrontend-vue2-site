<template>
    <!-- 只有总页数大于1时才显示 -->
    <div class="pager-container" v-if="totalPages > 1">
        <a @click="handleClick(1)" :class="{ disabled: current === 1 }">
            |&lt;&lt;
        </a>
        <a @click="handleClick(current - 1)" :class="{ disabled: current === 1 }">
            &lt;&lt;
        </a>
        <a @click="handleClick(n)" v-for="(n, i) in visiblePageNumbers" :key="i" :class="{ active: n === current }">
            {{ n }}
        </a>

        <a @click="handleClick(current + 1)" :class="{ disabled: current === totalPages }">
            &gt;&gt;
        </a>
        <a @click="handleClick(totalPages)" :class="{ disabled: current === totalPages }">
            &gt;&gt;|
        </a>
    </div>
</template>

<script>
export default {
    props: {
        total: {
            type: Number,
            default: 0
        },
        limit: {
            type: Number,
            default: 10
        },
        visiblePages: {
            type: Number,
            default: 8,
        },
        current: {
            type: Number,
            default: 1
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.total / this.limit)
        },
        minPage() {
            let min = this.current - Math.floor(this.visiblePages / 2);
            if (min < 1) {
                min = 1
            }
            return min;
        },
        maxPage() {
            let max = this.minPage + this.visiblePages - 1;
            if (max > this.totalPages) {
                max = this.totalPages;
            }
            return max;
        },
        visiblePageNumbers() {
            let numbers = []
            for (let i = this.minPage; i <= this.maxPage; i++) {
                numbers.push(i)
            }
            return numbers;
        }
    },
    methods: {
        handleClick(newPage) {
            if (newPage < 1) {
                newPage = 1
            };
            if (newPage > this.totalPages) {
                newPage = this.totalPages
            };
            if (newPage === this.current) {
                return;
            };
            this.$emit("pageChange", newPage);
        }
    }
}
</script>

<style lang="less" scoped>
@import "~@/styles/var.less";

.pager-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;

    a {
        color: @primary;
        margin: 0 6px;
        cursor: pointer;

        &.disabled {
            color: @lightWords;
            cursor: not-allowed;
        }

        &.active {
            color: @words;
            font-weight: bold;
            cursor: text;
        }
    }
}
</style>
