/**
 * Jewelry SAM Native 24h AI & 1:1 Real-Time Live Chat Widget
 * Fully integrated for sam.lymin80.shop (No external script dependencies)
 */
(function () {
  if (window.JewelrySamWidgetLoaded) return;
  window.JewelrySamWidgetLoaded = true;

  const API_HOST = window.location.origin.includes('lymin80.shop') 
    ? window.location.origin 
    : 'https://jewelry-sam-api.lymin80.workers.dev';

  // 1. Host Container & Shadow DOM Creation for Style Isolation
  const container = document.createElement('div');
  container.id = 'sam-widget-root';
  document.body.appendChild(container);
  const shadow = container.attachShadow({ mode: 'open' });

  // 2. CSS Styles (Quiet Luxury Dark Gold Theme)
  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    
    .fab-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #C9A96E 0%, #A88B52 100%);
      color: #0C0A08;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 25px rgba(201, 169, 110, 0.4), 0 4px 10px rgba(0, 0, 0, 0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .fab-button:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 15px 30px rgba(201, 169, 110, 0.6);
    }
    .fab-icon { font-size: 26px; line-height: 1; }
    
    .chat-drawer {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 420px;
      max-width: calc(100vw - 32px);
      height: 600px;
      max-height: calc(100vh - 120px);
      background: #141110;
      border: 1px solid rgba(201, 169, 110, 0.25);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(201, 169, 110, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999998;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .chat-drawer.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }
    
    .chat-header {
      padding: 16px 20px;
      background: #1A1614;
      border-bottom: 1px solid rgba(201, 169, 110, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-info { display: flex; align-items: center; gap: 10px; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 8px #4ade80; }
    .header-title { color: #F5F0E8; font-weight: 600; font-size: 15px; }
    .close-btn { background: none; border: none; color: #9C9489; cursor: pointer; font-size: 22px; padding: 0; }
    .close-btn:hover { color: #F5F0E8; }
    
    .chat-messages {
      flex: 1;
      padding: 18px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: #0C0A08;
    }
    
    .msg {
      max-width: 88%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.7;
      word-break: break-word;
      white-space: pre-wrap !important;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    
    .msg-bot {
      align-self: flex-start;
      background: #1A1614;
      color: #F5F0E8;
      border-bottom-left-radius: 4px;
      border: 1px solid rgba(201, 169, 110, 0.15);
    }
    .msg-user {
      align-self: flex-end;
      background: linear-gradient(135deg, #C9A96E 0%, #A88B52 100%);
      color: #0C0A08;
      font-weight: 600;
      border-bottom-right-radius: 4px;
    }
    .msg-admin {
      align-self: flex-start;
      background: rgba(201, 169, 110, 0.15);
      color: #C9A96E;
      border: 1px solid rgba(201, 169, 110, 0.4);
      border-bottom-left-radius: 4px;
      font-weight: 600;
    }
    
    .agent-btn {
      align-self: center;
      background: rgba(201, 169, 110, 0.12);
      border: 1px solid rgba(201, 169, 110, 0.3);
      color: #C9A96E;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      margin: 4px 0;
      transition: all 0.2s ease;
    }
    .agent-btn:hover { background: rgba(201, 169, 110, 0.25); }

    .chat-input-area {
      padding: 14px 16px;
      background: #1A1614;
      border-top: 1px solid rgba(201, 169, 110, 0.2);
      display: flex;
      gap: 8px;
    }
    .chat-input {
      flex: 1;
      background: #0C0A08;
      border: 1px solid rgba(201, 169, 110, 0.2);
      border-radius: 20px;
      padding: 10px 16px;
      color: #F5F0E8;
      font-size: 14px;
      outline: none;
    }
    .chat-input:focus { border-color: #C9A96E; }
    .send-btn {
      background: linear-gradient(135deg, #C9A96E, #A88B52);
      color: #0C0A08;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  `;

  // 3. HTML Markup
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button class="fab-button" id="samFabBtn">
      <span class="fab-icon">💎</span>
    </button>
    
    <div class="chat-drawer" id="samChatDrawer">
      <div class="chat-header">
        <div class="header-info">
          <div class="status-dot"></div>
          <div>
            <div class="header-title">주얼리 샘 AI & 실시간 상담</div>
            <div style="font-size:11px; color:#9C9489;">서울 종로 효성주얼리시티 1083호</div>
          </div>
        </div>
        <button class="close-btn" id="samCloseBtn">&times;</button>
      </div>

      <div class="chat-messages" id="samMessages">
        <div class="msg msg-bot">💎 안녕하세요! 종로 프리미엄 주얼리 샘 24h AI 상담원입니다.<br><br>금시세, 순금 골드바, 커플링, 다이아몬드, 위치 및 무료 주차 안내 등 궁금한 내용을 물어보세요!</div>
        <button class="agent-btn" id="samAgentBtn">🧑‍💻 실시간 1:1 상담사 연결 요청하기</button>
      </div>

      <form class="chat-input-area" id="samChatForm">
        <input type="text" class="chat-input" id="samInput" placeholder="메시지를 입력하세요..." required>
        <button type="submit" class="send-btn">➔</button>
      </form>
    </div>
  `;

  shadow.appendChild(style);
  shadow.appendChild(wrapper);

  // 4. Element Selectors & Global Controller
  const fabBtn = shadow.getElementById('samFabBtn');
  const chatDrawer = shadow.getElementById('samChatDrawer');
  const closeBtn = shadow.getElementById('samCloseBtn');
  const messagesBox = shadow.getElementById('samMessages');
  const chatForm = shadow.getElementById('samChatForm');
  const chatInput = shadow.getElementById('samInput');
  const agentBtn = shadow.getElementById('samAgentBtn');

  let isChatOpen = false;
  let pollInterval = null;

  function toggleWidget(open) {
    isChatOpen = open !== undefined ? open : !isChatOpen;
    if (isChatOpen) {
      chatDrawer.classList.add('open');
      chatInput.focus();
      startLiveChatSync();
    } else {
      chatDrawer.classList.remove('open');
      if (pollInterval) clearInterval(pollInterval);
    }
  }

  fabBtn.onclick = () => toggleWidget();
  closeBtn.onclick = () => toggleWidget(false);

  // Expose global opener API
  window.DocuMindWidget = { open: () => toggleWidget(true) };
  window.JewelrySamWidget = { open: () => toggleWidget(true) };

  let isLiveMode = false;
  let currentSessionId = localStorage.getItem('sam_session_id');
  if (!currentSessionId) {
    currentSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    localStorage.setItem('sam_session_id', currentSessionId);
  }
  const currentUserId = '고객_' + currentSessionId.substring(currentSessionId.length - 4);

  // 5. Send Message Handler
  chatForm.onsubmit = async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    appendMsg(text, 'user');
    chatInput.value = '';

    // Always post user message to admin live chat queue with sessionId
    try {
      fetch(`${API_HOST}/api/live-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSessionId,
          isAdmin: false,
          userId: currentUserId,
          text: text
        })
      }).catch(() => {});
    } catch(e) {}

    // If in Live Mode, DO NOT invoke AI chatbot. Wait for admin response.
    if (isLiveMode) {
      return;
    }

    // Default Mode: Send to native AI Vector DB backend
    try {
      const resp = await fetch(`${API_HOST}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.reply && !isLiveMode) {
          appendMsg(data.reply, 'bot');
        }
      }
    } catch (err) {
      if (!isLiveMode) {
        appendMsg('💎 문의하신 내용을 접수 중입니다. 010-7448-7478 로 전화주시면 즉시 1:1 안내해 드립니다!', 'bot');
      }
    }
  };

  // 6. Connect to Live Agent (Switch to Live Mode)
  agentBtn.onclick = async () => {
    isLiveMode = true;
    appendMsg('🟢 **실시간 1:1 상담원(대표 이효진) 모드**로 전환되었습니다.\nAI 챗봇 응답이 정지되고 상담원이 직접 대화에 참여합니다.', 'bot');
    
    try {
      await fetch(`${API_HOST}/api/live-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSessionId,
          isAdmin: false,
          userId: currentUserId,
          text: '🧑‍💻 고객님이 실시간 1:1 상담원 연결을 요청하셨습니다.'
        })
      });
    } catch(e) {}
  };

  function appendMsg(text, type) {
    const div = document.createElement('div');
    div.className = `msg msg-${type}`;
    div.innerHTML = text;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  // 7. Live Sync Messages from Admin for THIS session
  function startLiveChatSync() {
    syncLiveMessages();
    if (!pollInterval) {
      pollInterval = setInterval(syncLiveMessages, 2000);
    }
  }

  async function syncLiveMessages() {
    try {
      const resp = await fetch(`${API_HOST}/api/live-chat?sessionId=${currentSessionId}`);
      if (resp.ok) {
        const messages = await resp.json();
        const adminMsgs = messages.filter(m => m.isAdmin);
        // If there are admin responses for THIS session, render them
        adminMsgs.forEach(m => {
          if (!shadow.getElementById(`admin-msg-${m.id}`)) {
            isLiveMode = true; // Auto enable live mode when admin responds
            const div = document.createElement('div');
            div.id = `admin-msg-${m.id}`;
            div.className = 'msg msg-admin';
            div.innerHTML = `👤 대표 이효진 (상담원):\n${m.text}`;
            messagesBox.appendChild(div);
            messagesBox.scrollTop = messagesBox.scrollHeight;
          }
        });
      }
    } catch(e) {}
  }
})();
