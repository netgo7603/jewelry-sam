/**
 * Cloudflare Worker API & AI RAG Multi-Session Live Chat Engine for Jewelry SAM
 */

const DEFAULT_POSTS = [
  {
    id: 1,
    title: "[종로 주얼리] 24K 순금 골드바 선물 및 현명한 투자 노하우",
    category: "골드바 투자",
    author: "대표 이효진",
    date: "2026-08-10",
    image: "images/gold_bar.png",
    excerpt: "순도 99.9% 순금 골드바를 구매할 때 반드시 확인해야 할 정품 인증서와 종로 주얼리 샘만의 차별화된 세공 보증 노하우를 공개합니다.",
    content: "<p>금은 대표적인 자산 보존 수단이자 소중한 분께 마음을 전하는 가장 가치 있는 선물입니다. 종로 주얼리 샘에서는 순도 99.9% 홀마크 감정원 인증 순금 골드바만을 엄선하여 제공합니다.</p><br><h4>골드바 구매 시 꼭 체크해야 할 3가지</h4><ol style=\"margin-left: 1.5rem; margin-top: 0.5rem; line-height: 1.8;\"><li><strong>순도 99.9% 정품 보증서 발급 여부</strong>: 국가 공인 감정원의 각인이 찍혀 있는지 확인하세요.</li><li><strong>지급 보증 및 중량 정확성</strong>: 정확한 g(그램) 단위 중량 체크가 필수입니다.</li><li><strong>전문 상담과 신뢰도</strong>: 서울 종로구 종로 183 효성주얼리시티 1층 1083호 주얼리 샘 매장에서 1:1 맞춤 상담을 받으실 수 있습니다.</li></ol>"
  },
  {
    id: 2,
    title: "[커플링 선택 가이드] 영원한 약속을 담은 종로 커플링 세트 추천",
    category: "커플링 가이드",
    author: "대표 이효진",
    date: "2026-08-08",
    image: "images/couple_ring_set.png",
    excerpt: "서로의 손끝에서 빛나는 두 사람만의 커플링. 두께, 디자인, 이니셜 각인 서비스까지 세심하게 살펴드리는 맞춤 커플링 가이드입니다.",
    content: "<p>연인 및 부부의 소중한 기념일을 빛내줄 커플링 세트는 착용감과 디자인의 우아함이 가장 중요합니다.</p><br><p>주얼리 샘에서는 심플한 데일리 디자인부터 럭셔리한 인그레이빙 커플링까지 다양하게 구비하고 있으며, <strong>무료 이니셜 각인 서비스</strong>를 함께 제공해 드립니다.</p>"
  },
  {
    id: 3,
    title: "[귀여운 순금 선물] 캐릭터 골드바 컬렉션 출시 및 선물 추천",
    category: "주얼리 팁",
    author: "대표 이효진",
    date: "2026-08-05",
    image: "images/character_gold_bar.png",
    excerpt: "돌잔치 선물, 생일 선물, 기념일 선물로 큰 사랑을 받고 있는 주얼리 샘의 귀여운 십이지신 & 캐릭터 순금 골드바 시리즈를 소개합니다.",
    content: "<p>딱딱한 골드바 대신 한층 더 사랑스럽고 의미 있는 선물을 찾으신다면 주얼리 샘의 <strong>캐릭터 골드바 컬렉션</strong>을 추천합니다.</p><br><p>아기 돌반지 대체 선물이나 특별한 기념일 선물로 인기가 높으며, 99.9% 순금으로 제작되어 소장 가치와 미소까지 선사합니다.</p>"
  },
  {
    id: 4,
    title: "[다이아몬드 가이드] 영롱하게 빛나는 우신·GIA 다이아몬드 선택 노하우",
    category: "다이아몬드",
    author: "상담원",
    date: "2026-08-03",
    image: "images/earrings.png",
    excerpt: "다이아몬드 구매 시 필수 체크 요소인 4C(Carat, Cut, Color, Clarity) 기준과 우신·GIA 정품 감정서 확인법을 안내해 드립니다.",
    content: "<p>영원한 빛을 자랑하는 다이아몬드는 공인 감정원의 정식 감정서가 핵심입니다. 주얼리 샘에서는 우신, GIA 정품 감정 다이아만을 정직하게 제공합니다.</p>"
  },
  {
    id: 5,
    title: "[데일리 주얼리] 18K·14K 럭셔리 귀걸이 & 목걸이 레이어링 스타일링 팁",
    category: "스타일 가이드",
    author: "상담원",
    date: "2026-08-01",
    image: "images/necklace.png",
    excerpt: "일상룩에 고급스러움을 더해주는 18K/14K 드롭 귀걸이와 로즈골드 펜던트 목걸이 레이어링 조합 팁을 소개합니다.",
    content: "<p>은은한 클래식 감성의 18K 목걸이와 귀걸이는 과하지 않은 차분한 화려함을 완성해 줍니다.</p>"
  }
];

const DEFAULT_JEWELRY_SAM_KB = [
  {
    id: 1,
    category: "위치/연락처",
    keywords: ["위치", "주소", "찾아가는", "어디", "연락처", "전화번호", "종로"],
    answer: "💎 **주얼리 샘 매장 위치 & 연락처**\n📍 **주소**: 서울특별시 종로구 종로 183 (인의동, 효성주얼리시티) 1층 1083호\n🚇 **지하철**: 종로5가역 1번 출구 또는 종로3가역 11번 출구에서 도보로 가깝습니다.\n📞 **대표 전화**: 010-7448-7478"
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
    keywords: ["매입", "보상", "보상판매", "교환", "돌반지", "이빨금", "치금", "은"],
    answer: "♻️ **귀금속 최고가 매입 & 보상교환**\n보유하고 계신 순금, 18K, 14K, 치금(이빨금), 돌반지, 은 제품을 당일 최고가 시세로 매입해 드리며, 최저 수수료 조건으로 새 제품 보상교환도 가능합니다."
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
  }
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Content-Type": "application/json; charset=utf-8",
    };

    if (env.ASSETS && !url.pathname.startsWith("/api/")) {
      return await env.ASSETS.fetch(request);
    }

    try {
      async function getActiveKB() {
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_kb");
          if (stored) return JSON.parse(stored);
        }
        return DEFAULT_JEWELRY_SAM_KB;
      }

      async function getActivePosts() {
        let posts = [];
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_posts");
          if (stored) posts = JSON.parse(stored);
        }
        if (!posts || posts.length === 0) {
          posts = DEFAULT_POSTS;
        }
        return posts;
      }

      // 1. AI RAG Vector Chatbot API (POST /api/chat)
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

      // 3. GET Sessions List for Admin (GET /api/live-chat/sessions)
      if (url.pathname === "/api/live-chat/sessions" && request.method === "GET") {
        let messages = [];
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_live_chat");
          if (stored) messages = JSON.parse(stored);
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
              unread: 0
            };
          } else {
            sessionMap[sid].lastText = m.text;
            sessionMap[sid].lastTime = m.time;
          }
        });

        const sessions = Object.values(sessionMap).reverse();
        return new Response(JSON.stringify(sessions), { headers: corsHeaders });
      }

      // 4. GET/POST Live Chat Messages (/api/live-chat)
      if (url.pathname === "/api/live-chat" && request.method === "GET") {
        const targetSessionId = url.searchParams.get("sessionId");
        let messages = [];
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_live_chat");
          if (stored) messages = JSON.parse(stored);
        }

        if (targetSessionId) {
          messages = messages.filter(m => (m.sessionId || 'default') === targetSessionId);
        }

        return new Response(JSON.stringify(messages), { headers: corsHeaders });
      }

      if (url.pathname === "/api/live-chat" && request.method === "POST") {
        const chatData = await request.json();
        let messages = [];
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_live_chat");
          if (stored) messages = JSON.parse(stored);
        }

        chatData.id = Date.now();
        chatData.time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        if (!chatData.sessionId) {
          chatData.sessionId = 'default';
        }
        messages.push(chatData);

        if (env.SAM_KV) {
          await env.SAM_KV.put("jewelry_sam_live_chat", JSON.stringify(messages));
        }

        return new Response(JSON.stringify({ success: true, messages }), { headers: corsHeaders });
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

      // 6. GET Posts List (GET /api/posts)
      if (url.pathname === "/api/posts" && request.method === "GET") {
        const posts = await getActivePosts();
        return new Response(JSON.stringify(posts), { headers: corsHeaders });
      }

      // 7. Save / Update Posts (POST /api/posts)
      if (url.pathname === "/api/posts" && request.method === "POST") {
        const postData = await request.json();
        let posts = await getActivePosts();

        if (postData.id) {
          const idx = posts.findIndex((p) => p.id === postData.id);
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

      // 8. Delete Post (DELETE /api/posts/:id)
      if (url.pathname.startsWith("/api/posts/") && request.method === "DELETE") {
        const id = parseInt(url.pathname.replace("/api/posts/", ""));
        let posts = await getActivePosts();
        posts = posts.filter((p) => p.id !== id);

        if (env.SAM_KV) {
          await env.SAM_KV.put("jewelry_sam_posts", JSON.stringify(posts));
        }

        return new Response(JSON.stringify({ success: true, posts }), {
          headers: corsHeaders,
        });
      }

      return new Response(JSON.stringify({ message: "Jewelry SAM API Server" }), {
        headers: corsHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};
