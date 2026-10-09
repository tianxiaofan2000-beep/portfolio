/* ============================================================
 * main.js —— 全站共享交互脚本
 * 被 index.html / works.html / about.html / contact.html 共同引用。
 * 采用"守卫式"写法：页面里没有某个元素时，对应的功能自动跳过，
 * 因此同一个脚本可以安全地在四个页面复用，不需要为每个页面单独写 JS。
 * ============================================================ */

(function () {
  'use strict';

  /* 一个帮助函数：让 HTML 转义，避免把用户输入直接插入页面造成 XSS 隐患 */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- 1. 顶栏：滚动时加阴影 ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ---------- 2. 移动端菜单开关 ---------- */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isHidden);
      /* 同时切换汉堡按钮的打开/关闭图标（用 aria-expanded 记录状态，利于无障碍） */
      var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
    });
    /* 点菜单里的链接后自动收起菜单 */
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 3. 滚动显现动画（轻量，用 IntersectionObserver） ---------- */
  /* 页面里凡是带 data-reveal 的元素，进入视口时淡入上滑显现 */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    /* 先判断用户是否设置了"减弱动态效果"（系统无障碍设置），尊重它 */
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      /* 减弱模式下直接全部显现，不做动画 */
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            /* 显现一次后停止观察，避免重复触发 */
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------- 4. 页脚年份 ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- 5. Toast 提示（页面右上角的临时小提示） ---------- */
  function showToast(message, type) {
    type = type || 'success';
    var container = document.querySelector('[data-toast-container]');
    if (!container) { return; }
    var toast = document.createElement('div');
    /* 不同状态用不同配色：success 绿色，info 蓝色 */
    var colorClass = type === 'info' ? 'bg-primary-light' : 'bg-green-600';
    toast.className = 'toast-item rounded-lg px-4 py-3 text-sm text-white shadow-lg ' + colorClass;
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    container.appendChild(toast);
    /* 3 秒后自动消失 */
    setTimeout(function () {
      if (toast.parentNode) { toast.parentNode.removeChild(toast); }
    }, 3000);
  }
  /* 暴露为全局方法，方便页内 <button onclick> 调用 */
  window.showToast = showToast;

  /* ---------- 6. 作品案例页：分类筛选 + 详情弹窗 ---------- */
  var filterBtns = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && cards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        /* 切换筛选按钮的高亮样式 */
        filterBtns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('bg-primary', on);
          b.classList.toggle('text-white', on);
          b.classList.toggle('border-primary', on);
          b.classList.toggle('text-primary', !on);
        });
        /* 逐张卡片决定显示还是隐藏 */
        cards.forEach(function (card) {
          var cat = card.getAttribute('data-category');
          var show = filter === 'all' || filter === cat;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }

  /* 作品详情弹窗：点击"查看详情"时从卡片上的 data-* 读取内容填入弹窗 */
  var detailButtons = document.querySelectorAll('[data-open-detail]');
  var modal = document.querySelector('[data-modal]');
  var modalOverlay = document.querySelector('[data-modal-overlay]');
  var modalClose = document.querySelector('[data-modal-close]');

  if (detailButtons.length && modal) {
    var titleEl = modal.querySelector('[data-modal-title]');
    var imageEl = modal.querySelector('[data-modal-image]');
    var categoryEl = modal.querySelector('[data-modal-category]');
    var descEl = modal.querySelector('[data-modal-desc]');
    var tagsEl = modal.querySelector('[data-modal-tags]');

    function openModal(btn) {
      /* 从触发按钮所属的卡片上读取数据 */
      var card = btn.closest('[data-category]');
      if (!card) { return; }
      titleEl.textContent = card.getAttribute('data-title');
      imageEl.src = card.getAttribute('data-image');
      imageEl.alt = card.getAttribute('data-title');
      categoryEl.textContent = card.getAttribute('data-category-text');
      descEl.textContent = card.getAttribute('data-desc');
      /* 标签是逗号分隔的字符串，拆成一个个小标签 */
      var tags = (card.getAttribute('data-tags') || '').split(',').filter(Boolean);
      tagsEl.innerHTML = tags.map(function (t) {
        return '<span class="rounded-full bg-mist px-3 py-1 text-xs text-slate-600">' + escapeHtml(t.trim()) + '</span>';
      }).join('');
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden'); /* 弹窗打开时禁止页面滚动 */
    }

    function closeModal() {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    detailButtons.forEach(function (btn) {
      btn.addEventListener('click', function () { openModal(btn); });
    });
    modalClose.addEventListener('click', closeModal);
    /* 点击灰色遮罩也关闭 */
    modalOverlay.addEventListener('click', closeModal);
    /* Esc 键关闭 */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(); }
    });
  }

  /* ---------- 7. 联系表单（仅前端，不真正提交） ---------- */
  var contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault(); /* 阻止真实提交 */
      var name = contactForm.querySelector('[name="name"]').value.trim();
      var email = contactForm.querySelector('[name="email"]').value.trim();
      var message = contactForm.querySelector('[name="message"]').value.trim();

      /* 简单的前端校验 */
      if (!name) { showToast('请填写您的称呼', 'info'); return; }
      if (!email) { showToast('请填写您的邮箱', 'info'); return; }
      /* 用正则粗略判断邮箱格式 */
      var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailReg.test(email)) { showToast('邮箱格式似乎不正确', 'info'); return; }
      if (!message) { showToast('请填写您的留言内容', 'info'); return; }

      /* 到这一步说明校验通过。因为是纯前端演示站，这里只提示，不发送数据 */
      showToast('已收到您的留言（演示站，数据未上传）');
      contactForm.reset();
    });
  }

})();
