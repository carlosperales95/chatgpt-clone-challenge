<template>
  <div class="flex flex-col h-screen bg-gray-900">
    <!-- Header -->
    <div class="bg-black border-b px-6 py-4 shadow-sm">
      <h1 class="text-xl font-semibold text-gray-100">
        Chat Gepetto
      </h1>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      <div v-if="messages.length === 0" class="text-center text-gray-500 mt-20">
        <p class="text-lg">
          Start a conversation
        </p>
        <p class="text-sm mt-2">
          Type a message below to begin.
        </p>
      </div>
      
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
      >
        <div
          :class="[
            'max-w-3xl rounded-2xl px-4 py-3',
            msg.role === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border border-gray-200'
          ]"
        >
          <p class="whitespace-pre-wrap">
            {{ msg.content }}
          </p>
        </div>
      </div>
      
      <div v-if="loading" class="flex justify-start">
        <div class="bg-white border border-gray-200 rounded-2xl px-4 py-3">
          <div class="flex space-x-2">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- User input section -->
    <div class="bg-black border-t px-6 py-4">
      <div class="max-w-4xl mx-auto flex gap-3">
        <textarea
          v-model="input"
          @keypress.enter="!loading && sendMessage()"
          type="text"
          placeholder="Type your message..."
          :disabled="loading"
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="sendMessage"
          :disabled="loading || !input.trim()"
          class="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-800 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <PaperAirplaneIcon class="w-8 w8" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { PaperAirplaneIcon } from '@heroicons/vue/16/solid';

// The array of the whole conversation
const messages = ref([]);
// User inpuit text
const input = ref('');
const loading = ref(false);

const recordMessage = (message) => {
  if(!message) return;
  messages.value.push(message);
}

const sendMessage = async () => {
  if (!input.value.trim()) return;

  const userMessage = { role: 'user', content: input.value };
  messages.value.push(userMessage);
  input.value = '';
  loading.value = true;

  // Send to node backend and parse res
  try {
    const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.value.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })
    });
    
    const data = await res.json();
    recordMessage({
      role: 'assistant',
      content: data.content[0]?.text
    });
  }
  catch(err) {
    console.error('Error:', err);
    recordMessage({
      role: 'assistant',
      content: 'Error processing request'
    });
  }
  finally {
    loading.value = false;
  }
};
</script>