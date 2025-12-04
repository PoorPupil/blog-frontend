<template>
    <div>
        <div class="list-container">
            <div v-for="item in list" :key="item.id" class="card-box" @mousemove="onMove" @mouseleave="onLeave">
                <div class="card">
                    <div class="shine"></div>
                    <div class="title">{{ item.title }}</div>
                    <div class="meta">{{ formatDate(item.updatedAt) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type ArticleItem = {
    id: number;
    title: string;
    updatedAt: string
}

const list = ref<ArticleItem[]>([])

function mockData(count: number): ArticleItem[] {
    const now = Date.now()
    return Array.from({ length: count }, (_, i) => {
        const offsetDays = Math.floor(Math.random() * 30)
        const updatedAt = new Date(now - offsetDays * 86400000).toISOString()
        return { id: i + 1, title: `文章 ${i + 1}`, updatedAt }
    })
}

function formatDate(iso: string) {
    const d = new Date(iso)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${y}-${m}-${day} ${hh}:${mm}`
}

list.value = mockData(10)

function onMove(e: MouseEvent) {
    const box = e.currentTarget as HTMLElement
    const rect = box.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = -((y - rect.height / 2) / rect.height) * 20
    const rotateY = ((x - rect.width / 2) / rect.width) * 20
    box.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    const shine = box.querySelector('.shine') as HTMLElement | null
    if (shine) {
        const per = Math.max(0, Math.min(100, (x / rect.width) * 100))
        shine.style.setProperty('--per', per + '%')
    }
}

function onLeave(e: MouseEvent) {
    const box = e.currentTarget as HTMLElement
    box.style.transform = 'rotateX(0) rotateY(0)'
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

.list-container {
    --card-w: 300px;
    --card-h: 160px;
    --radius: 20px;
    --neon: #00F2EA;
    --neon2: #FF26A0;
    --shadow: 0 8px 32px rgba(0, 242, 234, .28);
    min-height: 100vh;
    background: radial-gradient(circle at 50% 50%, #101010 0%, #000 100%);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    place-items: center;
    gap: 24px;
    padding: 48px;
    perspective: 1000px;
    font-family: 'Poppins', sans-serif;
}

.card-box {
    width: var(--card-w);
    height: var(--card-h);
    position: relative;
    transform-style: preserve-3d;
    transition: transform .6s cubic-bezier(.25, .46, .45, .94);
    will-change: transform;
}

.card {
    position: absolute;
    inset: 0;
    border-radius: var(--radius);
    background: rgba(255, 255, 255, .06);
    border: 1px solid rgba(255, 255, 255, .08);
    backdrop-filter: blur(24px);
    box-shadow: var(--shadow);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    padding: 16px;
}

.card::before {
    content: "";
    position: absolute;
    inset: -40px;
    background:
        radial-gradient(60% 60% at 30% 30%, var(--neon) 0%, transparent 100%),
        radial-gradient(50% 50% at 70% 80%, var(--neon2) 0%, transparent 100%);
    filter: blur(40px);
    z-index: -1;
    opacity: .7;
}

.shine {
    position: absolute;
    inset: 0;
    border-radius: var(--radius);
    background: linear-gradient(115deg,
            transparent 0%,
            rgba(255, 255, 255, .5) var(--per, 30%),
            transparent 60%);
    mix-blend-mode: color-dodge;
    pointer-events: none;
    opacity: .6;
}

.title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
}

.meta {
    font-size: 12px;
    color: rgba(255, 255, 255, .75);
}
</style>
