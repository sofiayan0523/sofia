export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'travel' | 'ai-tools' | 'thoughts';
  coverImage: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "kyoto-spring-2024",
    title: "春日京都：尋找被遺忘的小巷",
    excerpt: "在人群擁擠的清水寺背後，有一條通往時光深處的石板路。這次旅行教會我的，是放慢腳步的藝術。",
    content: `
# 春日京都：尋找被遺忘的小巷

在人群擁擠的清水寺背後，有一條通往時光深處的石板路。這次旅行教會我的，是放慢腳步的藝術。

## 第一天：抵達

從台北飛往關西機場只需要兩個小時。但當我踏出車站，走進京都的街道時，彷彿跨越了一整個世紀。

空氣中飄著淡淡的抹茶香，混合著木質建築特有的溫潤氣息。我選擇住在東山區的一間町家民宿，這是一棟有著百年歷史的傳統建築。

## 意外的發現

第二天清晨，我決定放棄地圖，單純跟著直覺走。繞過清水寺的人潮，我發現了一條鋪滿青苔的石階。

石階的盡頭是一座小神社，沒有遊客，只有一位老婆婆在安靜地打掃落葉。她看見我，微笑著點了點頭，繼續她的工作。

這一刻的寧靜，成為了這趟旅程最珍貴的記憶。

## 旅行心得

- 有時候最美的風景，就在熱門景點的轉角處
- 早起是旅行的秘密武器
- 學會用眼睛記錄，而不只是相機
    `,
    category: "travel",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    date: "2024-03-15",
    readTime: "5 min",
    tags: ["日本", "京都", "慢旅行"]
  },
  {
    id: "cursor-ai-workflow",
    title: "我如何用 Cursor AI 重新定義寫程式的方式",
    excerpt: "從懷疑到驚豔：一個非工程師背景的人，如何透過 AI 工具實現技術自由。",
    content: `
# 我如何用 Cursor AI 重新定義寫程式的方式

作為一個行銷背景的人，寫程式曾經是我最大的恐懼。但 Cursor AI 改變了這一切。

## 為什麼選擇 Cursor？

市面上有很多 AI 程式助手，但 Cursor 的整合體驗讓我印象深刻。它不只是一個 chatbot，而是真正理解你的 codebase。

## 我的工作流程

1. **描述需求**：用自然語言說明我想要什麼
2. **審核建議**：仔細閱讀 AI 的程式碼建議
3. **迭代優化**：透過對話持續改進

## 實際案例

上週我需要建立一個數據儀表板。過去這可能需要外包給工程師，花費數萬元和數週時間。

使用 Cursor，我在三個小時內完成了：
- 資料視覺化圖表
- 篩選功能
- 響應式設計

## 給初學者的建議

- 不要害怕嘗試
- 先從小專案開始
- 學會問對問題比學語法更重要
    `,
    category: "ai-tools",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    date: "2024-03-10",
    readTime: "4 min",
    tags: ["AI", "Cursor", "生產力"]
  },
  {
    id: "lisbon-solo-travel",
    title: "里斯本獨旅手記：在七座山丘上找回自己",
    excerpt: "當你獨自坐在貝倫塔旁的咖啡館，聽著 Fado 音樂，你會明白為什麼葡萄牙人說 'Saudade' 是無法翻譯的。",
    content: `
# 里斯本獨旅手記：在七座山丘上找回自己

里斯本是一座建在七座山丘上的城市。每一次爬坡都讓你喘息，但每一個轉角的風景都值得那份疲憊。

## Saudade 的真正含義

葡萄牙語中有一個詞叫 Saudade，大致翻譯是「對不再擁有之物的深切懷念」。在里斯本的第三天，我終於懂了。

## 必訪之處

- **阿爾法瑪區**：迷宮般的巷弄，最原汁原味的里斯本
- **LX Factory**：舊工廠改建的文創園區
- **28號電車**：雖然觀光，但確實美

## 獨旅的意義

一個人旅行最珍貴的不是自由，而是與自己對話的機會。
    `,
    category: "travel",
    coverImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800",
    date: "2024-02-28",
    readTime: "6 min",
    tags: ["葡萄牙", "里斯本", "獨旅"]
  },
  {
    id: "claude-ai-writing",
    title: "用 Claude AI 提升寫作效率的 5 個技巧",
    excerpt: "AI 不會取代作家，但會使用 AI 的作家會取代不會的。這是我學到的五個實用技巧。",
    content: `
# 用 Claude AI 提升寫作效率的 5 個技巧

寫作是我工作的核心，而 Claude 成為了我最信任的寫作夥伴。

## 技巧一：結構化提示

不要只說「幫我寫一篇文章」，而是提供：
- 目標讀者
- 文章風格
- 關鍵論點

## 技巧二：迭代對話

把 AI 當作編輯，不斷要求它優化特定段落。

## 技巧三：多角度審視

請 AI 從不同讀者角度評論你的文章。

## 技巧四：翻譯與在地化

Claude 的多語言能力非常強大。

## 技巧五：保持人性

AI 是工具，最終的判斷權在你手中。
    `,
    category: "ai-tools",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    date: "2024-02-20",
    readTime: "4 min",
    tags: ["AI", "Claude", "寫作"]
  }
];

export const categories = [
  { id: 'all', name: '全部文章', nameEn: 'All' },
  { id: 'travel', name: '旅行手記', nameEn: 'Travel' },
  { id: 'ai-tools', name: 'AI 工具', nameEn: 'AI Tools' },
  { id: 'thoughts', name: '隨想', nameEn: 'Thoughts' },
];
