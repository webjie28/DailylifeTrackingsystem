<script setup>
import { ref } from 'vue'
const query = ref('')
const sources = [
 {name:'Project Gutenberg',label:'CLASSICS & LITERATURE',description:'Explore free ebooks, classic novels, poetry, and historical works.',url:'https://www.gutenberg.org/',icon:'▤'},
 {name:'OpenStax',label:'TEXTBOOKS & REFERENCE',description:'Read free, peer-reviewed textbooks across math, science, business, and more.',url:'https://openstax.org/subjects',icon:'▥'},
 {name:'Khan Academy',label:'LEARN & PRACTICE',description:'Explore lessons and practice across math, science, computing, and more.',url:'https://www.khanacademy.org/',icon:'✦'},
]
</script>
<template><section class="learning-resources"><div class="resource-heading"><div><small>A WORLD OF IDEAS, WITHIN REACH</small><h2>Find your next great read.</h2><p>Explore trusted libraries and learning platforms. Links open the official website in a new tab.</p></div><span class="resource-book" aria-hidden="true">▤</span></div><form class="resource-search" :action="'https://www.gutenberg.org/ebooks/search/'" method="get" target="_blank"><label for="external-book-query">Search Project Gutenberg</label><div><input id="external-book-query" name="query" v-model="query" placeholder="Book title, author, or subject…" required><button type="submit">Find books ↗</button></div></form><div class="resource-grid"><a v-for="source in sources" :key="source.name" :href="source.url" target="_blank" rel="noopener noreferrer"><span class="resource-icon">{{ source.icon }}</span><small>{{ source.label }}</small><h3>{{ source.name }} <span>↗</span></h3><p>{{ source.description }}</p><strong>Explore library</strong></a></div><p class="resource-note">Reading on an external website does not automatically sync to your Study Space. Use the library below for in-app reading sessions.</p></section></template>
