/* ============================================
   BTEC Jordan — Main JavaScript
   app.js
   ============================================ */

/* ─── Page Navigation ─── */

const PAGE_INDEX = {
  home: 0, specs: 1, pros: 2, quiz: 3,
  choice: 4, story: 5, compare: 6, campaign: 7
};

function showPage(id) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show selected page
  const target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');

  // Update nav active state
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
  const navBtn = document.querySelectorAll('.nav-links button')[PAGE_INDEX[id]];
  if (navBtn) navBtn.classList.add('active');

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-initialize quiz when navigating to it
  if (id === 'quiz') initQuiz();
}

/* ─── Quiz ─── */

const questions = [
  {
    q: 'كيف تفضل تتعلم موضوع جديد؟',
    opts: [
      'أجرب وأطبق بنفسي 🔧',
      'أقرأ وأحفظ من الكتاب 📖',
      'أشاهد فيديوهات وشرح 🎥',
      'أتعلم مع مجموعة 👥'
    ],
    scores: [3, 0, 2, 1]
  },
  {
    q: 'ماذا تفضل في مشاريع المدرسة؟',
    opts: [
      'مشاريع جماعية وعمل فريق 🤝',
      'بحث فردي وكتابة مقال 📝',
      'تصميم وإبداع 🎨',
      'عروض تقديمية 🎤'
    ],
    scores: [2, 0, 3, 2]
  },
  {
    q: 'كيف تشعر تجاه الامتحانات النهائية؟',
    opts: [
      'أتوتر كثيراً وأصعب عليي 😰',
      'لا أحبها لكن أتعامل معها 😐',
      'أحبها وهي تُظهر قدراتي ✅',
      'ما فرق معي كثير 🤷'
    ],
    scores: [3, 2, 0, 1]
  },
  {
    q: 'ما هدفك بعد الثانوية؟',
    opts: [
      'العمل مباشرة أو مشروع خاص 🚀',
      'جامعة أردنية حكومية 🏛️',
      'الدراسة في الخارج ✈️',
      'لسا ما قررت 🤔'
    ],
    scores: [3, 0, 3, 1]
  },
  {
    q: 'ما وصف شخصيتك الأقرب؟',
    opts: [
      'مبدع ومحب للتجريب ✨',
      'منظم ومحب للهيكل والوضوح 📋',
      'اجتماعي وقائد 🌟',
      'هادئ وتحليلي 🔍'
    ],
    scores: [3, 0, 2, 1]
  }
];

let currentQ   = 0;
let totalScore = 0;
let answers    = [];

function initQuiz() {
  currentQ   = 0;
  totalScore = 0;
  answers    = [];
  renderQuestion();
}

function renderQuestion() {
  const q        = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  const bar = document.getElementById('progressBar');
  if (bar) bar.style.width = progress + '%';

  const content = document.getElementById('quizContent');
  if (!content) return;

  content.innerHTML = `
    <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
      سؤال ${currentQ + 1} من ${questions.length}
    </div>
    <div class="quiz-q">${q.q}</div>
    <div class="quiz-options">
      ${q.opts.map((o, i) => `
        <button class="quiz-option" onclick="selectOpt(${i})">${o}</button>
      `).join('')}
    </div>
    <div class="quiz-nav">
      <button
        onclick="goBack()"
        style="background:none;border:1px solid #d1d5db;border-radius:8px;padding:0.5rem 1rem;
               font-family:Cairo,sans-serif;cursor:pointer;color:var(--text-muted);"
        ${currentQ === 0 ? 'disabled' : ''}
      >← رجوع</button>
      <span></span>
    </div>
  `;
}

function selectOpt(i) {
  // Highlight selection
  document.querySelectorAll('.quiz-option').forEach((b, j) => {
    b.classList.toggle('selected', j === i);
  });

  answers[currentQ] = i;

  // Move to next question after short delay
  setTimeout(() => {
    totalScore += questions[currentQ].scores[i];
    currentQ++;
    if (currentQ < questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }, 400);
}

function goBack() {
  if (currentQ > 0) {
    // Reverse the last score added
    totalScore -= questions[currentQ - 1].scores[answers[currentQ - 1]];
    currentQ--;
    renderQuestion();
  }
}

function showResult() {
  let result, badge, desc;

  if (totalScore >= 11) {
    result = '🎯 BTEC هو خيارك المثالي!';
    badge  = 'result-btec';
    desc   = 'شخصيتك العملية والإبداعية تتناسب تماماً مع نظام BTEC. ستجد نفسك تتألق في بيئة المشاريع والتعلم التطبيقي. استكشف التخصصات المتاحة واختار ما يناسب شغفك.';
  } else if (totalScore >= 6) {
    result = '⚖️ الخياران يناسبانك';
    badge  = 'result-either';
    desc   = 'أنت شخصية متوازنة يمكنها النجاح في كلا النظامين. الأهم أن تحدد هدفك الجامعي والمهني أولاً، ثم تختار النظام الذي يوصلك إليه بشكل أفضل.';
  } else {
    result = '📚 التعليم التقليدي يناسبك أكثر';
    badge  = 'result-trad';
    desc   = 'تفضل البنية الواضحة والهيكل المنظم، وهذا يناسب التعليم التقليدي. قد تجد صعوبة في الاستقلالية الكبيرة التي يتطلبها BTEC. لكن هذا لا يمنعك من استكشاف التخصصات المختلفة.';
  }

  const content = document.getElementById('quizContent');
  if (!content) return;

  content.innerHTML = `
    <div class="quiz-result">
      <div class="result-badge ${badge}">${result}</div>
      <p class="result-desc">${desc}</p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
        <button class="btn-primary" onclick="showPage('specs')">استكشف التخصصات ←</button>
        <button
          onclick="initQuiz()"
          style="background:none;border:2px solid var(--accent);color:var(--accent);
                 padding:0.85rem 2rem;border-radius:50px;font-family:Cairo,sans-serif;
                 font-weight:700;cursor:pointer;"
        >أعد الاختبار 🔄</button>
      </div>
    </div>
  `;
}

/* ─── Interactive Choice ─── */

const choiceResults = {
  practical: {
    title:   '🎯 BTEC مناسب جداً لك!',
    desc:    'طبيعتك العملية والتطبيقية هي بالضبط ما يبحث عنه BTEC. ستزدهر في بيئة المشاريع والتعلم الحقيقي.',
    btn:     'specs',
    btnText: 'تصفح التخصصات العملية ←'
  },
  theoretical: {
    title:   '📚 التعليم التقليدي أو BTEC بتخصصات نظرية',
    desc:    'محبوك للنظريات لا يمنعك من BTEC، لكن تأكد أن التخصص الذي تختاره يناسب طبيعتك التحليلية.',
    btn:     'compare',
    btnText: 'قارن الخيارين ←'
  },
  creative: {
    title:   '🎨 BTEC هو ملعبك!',
    desc:    'تخصصات الإبداع في BTEC — تصميم، إعلام، فنون — مصممة لأشخاص مثلك. ستجد بيئة تحتضن إبداعك.',
    btn:     'specs',
    btnText: 'اكتشف تخصصات الإبداع ←'
  },
  social: {
    title:   '🌟 BTEC يطلق قدراتك القيادية',
    desc:    'العمل الجماعي في BTEC سيجعلك في عنصرك. تخصصات إدارة الأعمال والإعلام ستناسبك كثيراً.',
    btn:     'specs',
    btnText: 'تصفح تخصصات القيادة ←'
  }
};

function choiceSelect(type) {
  const r = choiceResults[type];
  if (!r) return;

  const resultBox = document.getElementById('choiceResult');
  if (!resultBox) return;

  resultBox.style.display = 'block';
  resultBox.innerHTML = `
    <div style="background:rgba(255,255,255,0.12);border-radius:var(--radius);
                border:1px solid rgba(255,255,255,0.2);padding:2rem;text-align:center;">
      <h3 style="font-size:1.3rem;font-weight:800;margin-bottom:0.75rem;">${r.title}</h3>
      <p style="opacity:0.85;line-height:1.8;max-width:450px;margin:0 auto 1.5rem;">${r.desc}</p>
      <button class="btn-primary" onclick="showPage('${r.btn}')">${r.btnText}</button>
    </div>
  `;

  resultBox.scrollIntoView({ behavior: 'smooth' });
}

/* ─── Init on DOM ready ─── */
document.addEventListener('DOMContentLoaded', () => {
  initQuiz();
});
