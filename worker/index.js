/**
 * Cloudflare Worker API & AI RAG Multi-Session Live Chat Engine for Jewelry SAM
 * Pure 100% Cloudflare KV Database Mode
 */

const DEFAULT_JEWELRY_SAM_KB = [
  {
    id: 1,
    category: "위치/연락처",
    keywords: ["위치", "주소", "찾아가는", "어디", "연락처", "전화번호", "종로"],
    answer: "💎 **주얼리 샘 매장 위치 & 연락처**\n📍 **주소**: 서울특별시 종로구 종로 183 (인의동, 효성주얼리시티) 1층 83호\n🚇 **지하철**: 종로5가역 1번 출구 또는 종로3가역 11번 출구에서 도보로 가깝습니다.\n📞 **대표 전화**: 010-7448-7478"
  },
  {
    id: 2,
    category: "영업시간",
    keywords: ["영업시간", "시간", "휴무", "휴무일", "몇시", "열어"],
    answer: "🕒 **매장 영업시간 안내**\n• **운영시간**: 매일 오전 10:30 ~ 오후 8:00\n• **정기 휴무**: 매월 첫째 주 & 셋째 주 월요일 (효성주얼리시티 휴무일) 및 명절(설, 추석) 당일입니다."
  },
  {
    id: 3,
    category: "주차",
    keywords: ["주차", "주차장", "차량", "무료주차"],
    answer: "🚗 **주차 지원 안내**\n효성주얼리시티 건물 지하 주차장을 편리하게 이용하실 수 있습니다.\n매장에 방문하여 상담받으시거나 구매하시는 모든 고객님께 **무료 주차권**을 발급해 드립니다!"
  },
  {
    id: 4,
    category: "시세",
    keywords: ["시세", "금시세", "오늘", "가격", "18k", "14k", "24k", "순금"],
    answer: "💵 **금 시세 안내**\n금 시세는 당일 국내외 시세 변동에 따라 매일 바뀝니다.\n실시간 정확한 24K 순금 / 18K / 14K 매입 및 판매 시세는 대표 전화 **010-7448-7478**로 문의하시면 바로 안내해 드립니다."
  },
  {
    id: 5,
    category: "골드바",
    keywords: ["골드바", "중량", "돈", "g", "100g", "1kg", "돈수"],
    answer: "🏆 **24K 정품 순금 골드바 안내**\n국가 공인 감정원 정품 인증서가 동봉된 순도 99.9% 골드바를 미니 1g, 3.75g(1돈)부터 10g, 37.5g(10돈), 100g, 1kg 등 다양하게 제공하고 있습니다."
  },
  {
    id: 6,
    category: "매입/보상교환",
    keywords: ["매입", "보상", "보상판매", "교환", "돌반지", "이빨금", "치금", "은", "주물금", "금뱃지", "뱃지", "골프공", "악세사리", "악세서리", "14k", "18k", "24k", "10k", "덩어리금", "중고금", "순금아닌금"],
    answer: "♻️ **귀금속 최고가 매입 & 보상교환**\n보유하고 계신 24K 순금, 18K, 14K, 10K, 금 악세사리, 금 뱃지, 순금 골프공, 주물금(덩어리금), 치금(이빨금), 돌반지, 은 수저/실버바를 당일 최고가 시세로 빠르고 정확하게 매입해 드리며, 최저 수수료 조건으로 새 주얼리 보상교환도 가능합니다."
  },
  {
    id: 7,
    category: "제작기간",
    keywords: ["제작기간", "기간", "얼마나", "오래", "예물", "주문"],
    answer: "💍 **커플링 및 주문 제작 기간**\n주문 제작 상품은 보통 7일 ~ 14일(약 1~2주) 정도 소요됩니다.\n급하신 분들을 위한 당일 즉시 출고 가능 디자인도 다수 보유하고 있습니다."
  },
  {
    id: 8,
    category: "수리/AS",
    keywords: ["수리", "as", "사이즈", "늘림", "줄임", "변색", "도금"],
    answer: "🛠️ **제품 수리(A/S) 및 사이즈 조절**\n주얼리 샘 구매 제품은 물론 타사 구매 제품도 늘림/줄임, 폴리싱, 재도금, 스톤 세팅 수리가 가능합니다. 제품 사진을 010-7448-7478 로 보내주시면 미리 견적 상담이 가능합니다."
  },
  {
    id: 9,
    category: "다이아몬드",
    keywords: ["다이아", "우신", "gia", "감정서"],
    answer: "💎 **정품 다이아몬드 & 감정서**\n우신(WOOSIN), GIA 등 공인 감정원의 정식 감정서가 포함된 정품 다이아몬드만을 엄선하여 세팅해 드립니다."
  },
  {
    id: 10,
    category: "배송",
    keywords: ["택배", "배송", "지방"],
    answer: "📦 **우체국 안심택배 배송 서비스**\n귀금속 전용 안전 우체국 안심택배(보안 보험 가입 배송)를 이용해 전국 어디나 안심 직배송해 드립니다."
  },
  {
    id: 11,
    category: "돌반지/돌선물",
    keywords: ["돌반지", "돌선물", "첫돌", "백일반지", "돌팔찌", "반돈", "한돈", "1돈", "아기반지"],
    answer: "👶 **순금 돌반지 & 돌선물 안내**\n• **종류**: 24K 순금 돌반지 (반돈 1.875g, 1돈 3.75g), 순금 돌팔찌, 캐릭터 돌반지, 왕관 돌반지, 이니셜 각인 돌반지\n• **보증**: 국가 공인 감정원 정품 24K 순도 99.9% 보증서 동봉\n• **혜택**: 예쁜 고급 케이스 무료 선물 포장 & 이니셜 각인 무료 서비스"
  },
  {
    id: 12,
    category: "주물금/치금/악세사리 매입",
    keywords: ["주물금", "치금", "이빨금", "금뱃지", "뱃지", "골프공", "금골프공", "금악세사리", "금악세서리", "14k매입", "18k매입", "순금아닌금", "잡금", "덩어리금"],
    answer: "💰 **주물금 · 치금 · 금 뱃지 · 금 악세사리 전문 매입**\n• **매입 대상**: 24K 순금, 18K·14K·10K 금 악세사리(반지, 목걸이, 팔찌, 펜던트), 기업/단체 금 뱃지, 순금 골프공, 주물금(덩어리금), 치금(크라운, 금이빨), 순금이 아닌 잡금, 925은/실버바\n• **매입 방법**: 당일 종로 최상위 국전 시세 기준 최고가 측정 후 현장에서 즉시 계좌 입금해 드립니다."
  }
];

const DEFAULT_JEWELRY_SAM_GALLERY = [
  {
    id: 1,
    name: "순금 골드바",
    category: "goldbar",
    tag: "Best Seller",
    image: "images/gold_bar.png",
    description: "순도 99.9% 프리미엄 골드바. 선물용·투자용 최적의 순금 제품",
    featured: true
  },
  {
    id: 2,
    name: "캐릭터 골드바",
    category: "character",
    tag: "인기",
    image: "images/character_gold_bar.png",
    description: "귀여운 캐릭터 디자인의 미니 골드바",
    featured: false
  },
  {
    id: 3,
    name: "커플링 세트",
    category: "ring",
    tag: "추천",
    image: "images/couple_ring_set.png",
    description: "영원한 사랑의 약속, 이니셜 각인 가능",
    featured: false
  },
  {
    id: 4,
    name: "귀걸이 컬렉션",
    category: "earring",
    tag: "",
    image: "images/earrings.png",
    description: "섬세한 디테일의 프리미엄 귀걸이",
    featured: false
  },
  {
    id: 5,
    name: "목걸이 컬렉션",
    category: "necklace",
    tag: "",
    image: "images/necklace.png",
    description: "고급스러운 체인과 정교한 펜던트",
    featured: false
  },
  {
    id: 6,
    name: "팔찌 컬렉션",
    category: "bracelet",
    tag: "",
    image: "images/bracelet.png",
    description: "손목을 우아하게 감싸는 골드 팔찌",
    featured: false
  },
  {
    id: 7,
    name: "순금 돌반지 컬렉션",
    category: "dolring",
    tag: "첫돌 선물",
    image: "images/dolring.png",
    description: "첫돌·백일 기념 24K 순금 돌반지 & 돌팔찌. 반돈·1돈 정품 보증",
    featured: true
  }
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json; charset=utf-8",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Serve static website assets (HTML, CSS, JS) for non-API routes
    const isApiOrR2 = url.pathname.startsWith("/api/") || url.pathname.startsWith("/r2/");
    if (!isApiOrR2 && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    const pathname = url.pathname.replace(/\/$/, "");

    try {
      async function getActiveKB() {
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_kb");
          if (stored) return JSON.parse(stored);
        }
        return DEFAULT_JEWELRY_SAM_KB;
      }

      async function getActiveGallery() {
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_gallery");
          if (stored) {
            try { return JSON.parse(stored); } catch(e) {}
          }
        }
        return DEFAULT_JEWELRY_SAM_GALLERY;
      }

      // Send Telegram notification when customer requests live chat or sends message
      async function sendTelegramNotification(chatData, env) {
        let botToken = env.TELEGRAM_BOT_TOKEN;
        let chatId = env.TELEGRAM_CHAT_ID || "55662020";

        if (env.SAM_KV) {
          const cfg = await env.SAM_KV.get("jewelry_sam_telegram_cfg");
          if (cfg) {
            try {
              const parsed = JSON.parse(cfg);
              botToken = botToken || parsed.botToken;
              chatId = parsed.chatId || chatId;
            } catch(e) {}
          }
        }

        if (!botToken || !chatId) return;

        const text = `🔔 [주얼리 샘 1:1 고객 상담 요청]\n\n👤 고객: ${chatData.userId || '방문 고객'}\n💬 내용: ${chatData.text}\n⏰ 시간: ${chatData.time || new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' })}\n\n👉 관리자 센터: https://sam.lymin80.shop/admin.html`;

        try {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: text,
              parse_mode: 'HTML'
            })
          });
        } catch(e) {
          console.log('Telegram Alert Error:', e.message);
        }
      }

      // Pure 100% KV Database Fetch for Posts
      async function getKvPosts() {
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_posts");
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) {
                return parsed;
              }
            } catch(e) {}
          }
        }
        return [];
      }
      if (url.pathname === "/api/chat" && request.method === "POST") {
        const { message } = await request.json();
        const userMsg = (message || "").toLowerCase().trim();
        const activeKB = await getActiveKB();

        let matchedAnswer = null;
        for (const item of activeKB) {
          if (item.keywords && item.keywords.some((kw) => userMsg.includes(kw.toLowerCase()))) {
            matchedAnswer = item.answer;
            break;
          }
        }

        if (!matchedAnswer) {
          matchedAnswer = `💎안녕하세요! 종로 프리미엄 **주얼리 샘**입니다.\n\n"골드바 시세", "매장 위치", "영업시간", "커플링 수공예", "무료 주차" 등을 편하게 물어보세요!\n\n📞 **즉시 유선 상담**: 010-7448-7478 (대표 이효진)`;
        }

        return new Response(
          JSON.stringify({
            reply: matchedAnswer,
            timestamp: new Date().toISOString(),
            source: "JewelrySAM_VectorDB"
          }),
          { headers: corsHeaders }
        );
      }

      // 2. GET/POST Knowledge Base for Admin (GET, POST /api/kb)
      if (url.pathname === "/api/kb" && request.method === "GET") {
        const kbList = await getActiveKB();
        return new Response(JSON.stringify(kbList), { headers: corsHeaders });
      }

      if (url.pathname === "/api/kb" && request.method === "POST") {
        const newKbList = await request.json();
        if (env.SAM_KV) {
          await env.SAM_KV.put("jewelry_sam_kb", JSON.stringify(newKbList));
        }
        return new Response(JSON.stringify({ success: true, kb: newKbList }), { headers: corsHeaders });
      }

      // 2-1. GET/POST Gallery for Admin & Main Site (GET, POST /api/gallery)
      if (url.pathname === "/api/gallery" && request.method === "GET") {
        const galleryList = await getActiveGallery();
        return new Response(JSON.stringify(galleryList), { headers: corsHeaders });
      }

      if (url.pathname === "/api/gallery" && request.method === "POST") {
        const newGallery = await request.json();
        if (env.SAM_KV) {
          await env.SAM_KV.put("jewelry_sam_gallery", JSON.stringify(newGallery));
        }
        return new Response(JSON.stringify({ success: true, gallery: newGallery }), { headers: corsHeaders });
      }

      // 3. GET Sessions List for Admin (GET /api/live-chat/sessions)
      if (url.pathname === "/api/live-chat/sessions" && request.method === "GET") {
        let messages = [];
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_live_chat");
          if (stored) {
            messages = JSON.parse(stored).filter(m => Date.now() - (m.id || 0) < 24 * 60 * 60 * 1000);
          }
        }

        const sessionMap = {};
        messages.forEach(m => {
          const sid = m.sessionId || 'default';
          if (!sessionMap[sid]) {
            sessionMap[sid] = {
              sessionId: sid,
              userId: m.userId || '방문 고객',
              lastText: m.text,
              lastTime: m.time,
              unread: 0,
              isLive: m.isLiveMode || m.isAgentRequest || m.isAdmin
            };
          } else {
            sessionMap[sid].lastText = m.text;
            sessionMap[sid].lastTime = m.time;
            if (m.isLiveMode || m.isAgentRequest || m.isAdmin) {
              sessionMap[sid].isLive = true;
            }
          }
        });

        const sessions = Object.values(sessionMap).filter(s => s.isLive).reverse();
        return new Response(JSON.stringify(sessions), { headers: corsHeaders });
      }

      // 3-1. DELETE old chatbot-only data from KV (/api/live-chat/purge)
      if (url.pathname === "/api/live-chat/purge" && request.method === "POST") {
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_live_chat");
          if (stored) {
            const all = JSON.parse(stored);
            // Keep only messages that belong to real 1:1 sessions (have isLiveMode, isAgentRequest, or isAdmin flag)
            const cleaned = all.filter(m => m.isLiveMode || m.isAgentRequest || m.isAdmin || m.isEnd);
            await env.SAM_KV.put("jewelry_sam_live_chat", JSON.stringify(cleaned));
            return new Response(JSON.stringify({ success: true, before: all.length, after: cleaned.length }), { headers: corsHeaders });
          }
        }
        return new Response(JSON.stringify({ success: true, before: 0, after: 0 }), { headers: corsHeaders });
      }

      // 4. GET/POST Live Chat Messages (/api/live-chat)
      if (url.pathname === "/api/live-chat" && request.method === "GET") {
        const targetSessionId = url.searchParams.get("sessionId");
        let messages = [];
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_live_chat");
          if (stored) {
            messages = JSON.parse(stored).filter(m => Date.now() - (m.id || 0) < 24 * 60 * 60 * 1000);
          }
        }

        if (targetSessionId) {
          messages = messages.filter(m => (m.sessionId || 'default') === targetSessionId);
        }

        return new Response(JSON.stringify(messages), { headers: corsHeaders });
      }

      if (url.pathname === "/api/live-chat" && request.method === "POST") {
        const chatData = await request.json();
        
        // Ignore messages from cached clients that are purely chatbot interactions
        if (!chatData.isAdmin && !chatData.isAgentRequest && !chatData.isLiveMode) {
          return new Response(JSON.stringify({ success: true, ignored: true }), { headers: corsHeaders });
        }

        let messages = [];
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_live_chat");
          if (stored) {
            messages = JSON.parse(stored).filter(m => Date.now() - (m.id || 0) < 24 * 60 * 60 * 1000);
          }
        }

        chatData.id = Date.now();
        chatData.time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' });
        if (!chatData.sessionId) {
          chatData.sessionId = 'default';
        }
        messages.push(chatData);
        
        // BUG FIX: Actually save the updated messages array back to KV database!
        if (env.SAM_KV) {
          await env.SAM_KV.put("jewelry_sam_live_chat", JSON.stringify(messages));
        }

        // Only send telegram notification on initial 1:1 agent connection request
        if (!chatData.isAdmin && chatData.isAgentRequest) {
          ctx.waitUntil(sendTelegramNotification(chatData, env));
        }

        return new Response(JSON.stringify({ success: true, messages }), { headers: corsHeaders });
      }

      // 4-1. Telegram Notification Config API (GET/POST /api/telegram-config)
      if (url.pathname === "/api/telegram-config" && request.method === "GET") {
        let cfg = { botToken: env.TELEGRAM_BOT_TOKEN || "", chatId: env.TELEGRAM_CHAT_ID || "55662020" };
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_telegram_cfg");
          if (stored) {
            try { cfg = { ...cfg, ...JSON.parse(stored) }; } catch(e) {}
          }
        }
        if (!cfg.chatId) cfg.chatId = "55662020";
        return new Response(JSON.stringify(cfg), { headers: corsHeaders });
      }

      if (url.pathname === "/api/telegram-config" && request.method === "POST") {
        const { botToken, chatId, test } = await request.json();
        const cfgObj = { botToken: botToken || "", chatId: chatId || "" };
        
        if (env.SAM_KV) {
          await env.SAM_KV.put("jewelry_sam_telegram_cfg", JSON.stringify(cfgObj));
        }

        if (test) {
          await sendTelegramNotification({
            userId: '시스템 테스트',
            text: '🎉 종로 주얼리 샘 텔레그램 알림 봇 연동에 성공했습니다!',
            time: new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' })
          }, env);
        }

        return new Response(JSON.stringify({ success: true, config: cfgObj }), { headers: corsHeaders });
      }

      // 5. Cloudflare R2 Upload (POST /api/upload)
      if (url.pathname === "/api/upload" && request.method === "POST") {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
          return new Response(JSON.stringify({ error: "No file provided" }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const ext = file.name.split(".").pop() || "png";
        const filename = `jewelry_sam_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

        if (env.SAM_R2_BUCKET) {
          await env.SAM_R2_BUCKET.put(filename, file.stream(), {
            httpMetadata: { contentType: file.type || "image/png" },
          });
        }

        const r2PublicDomain = env.R2_PUBLIC_DOMAIN || "https://jewelry-sam-api.lymin80.workers.dev/r2";
        const imageUrl = `${r2PublicDomain}/${filename}`;

        return new Response(
          JSON.stringify({ success: true, url: imageUrl, filename }),
          { headers: corsHeaders }
        );
      }

      // 5-1. Get R2 File Stream (GET /r2/:filename)
      if (url.pathname.startsWith("/r2/") && request.method === "GET") {
        const filename = url.pathname.replace("/r2/", "");
        if (env.SAM_R2_BUCKET) {
          const object = await env.SAM_R2_BUCKET.get(filename);
          if (object) {
            const headers = new Headers();
            const ext = filename.split('.').pop().toLowerCase();
            let mime = "image/png";
            if (ext === "jpg" || ext === "jpeg") mime = "image/jpeg";
            else if (ext === "webp") mime = "image/webp";
            else if (ext === "gif") mime = "image/gif";
            else if (ext === "svg") mime = "image/svg+xml";

            headers.set("Content-Type", object.httpMetadata?.contentType || mime);
            headers.set("Content-Disposition", "inline");
            headers.set("Access-Control-Allow-Origin", "*");
            headers.set("Cache-Control", "public, max-age=31536000");
            return new Response(object.body, { headers });
          }
        }
        return new Response("File not found", { status: 404 });
      }

      // 6. GET Posts List (Pure KV DB 100%)
      if (pathname === "/api/posts" && request.method === "GET") {
        let posts = await getKvPosts();
        posts = posts.map(p => {
          if (p.image && p.image.includes("documind-backend.lymin80.workers.dev")) {
            p.image = p.image.replace("documind-backend.lymin80.workers.dev", "jewelry-sam-api.lymin80.workers.dev");
          }
          return p;
        });
        return new Response(JSON.stringify(posts), { headers: corsHeaders });
      }

      // 7. Save / Update Posts (Pure KV DB 100%)
      if (pathname === "/api/posts" && request.method === "POST") {
        const postData = await request.json();
        let posts = await getKvPosts();

        if (postData.id) {
          const idx = posts.findIndex((p) => String(p.id) === String(postData.id));
          if (idx !== -1) {
            posts[idx] = { ...posts[idx], ...postData };
          } else {
            posts.unshift(postData);
          }
        } else {
          postData.id = Date.now();
          posts.unshift(postData);
        }

        if (env.SAM_KV) {
          await env.SAM_KV.put("jewelry_sam_posts", JSON.stringify(posts));
        }

        return new Response(
          JSON.stringify({ success: true, post: postData, posts }),
          { headers: corsHeaders }
        );
      }

      // 8. Delete Post (Pure KV DB 100%)
      if (pathname.startsWith("/api/posts/") && request.method === "DELETE") {
        const targetId = pathname.replace("/api/posts/", "");
        let posts = await getKvPosts();
        posts = posts.filter((p) => String(p.id) !== String(targetId));

        if (env.SAM_KV) {
          await env.SAM_KV.put("jewelry_sam_posts", JSON.stringify(posts));
        }

        return new Response(JSON.stringify({ success: true, posts }), {
          headers: corsHeaders,
        });
      }

      if (env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};
