/**
 * TRANG GIỚI THIỆU BẢN THÂN - SCRIPT.JS
 * Vanilla JavaScript thuần túy: Xử lý Theme, Menu, Typewriter, Bộ lọc dự án, Form liên hệ, v.v.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Quản lý Theme (Sáng / Tối)
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  
  // Kiểm tra lưu trữ trước đó hoặc cấu hình hệ thống
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
      themeToggleBtn.setAttribute('title', 'Chuyển sang chế độ sáng');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
      themeToggleBtn.setAttribute('title', 'Chuyển sang chế độ tối');
    }
    localStorage.setItem('theme', theme);
  }

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
      showToast(isDark ? 'Đã chuyển sang chế độ sáng' : 'Đã chuyển sang chế độ tối');
    });
  }

  // ==========================================
  // 2. Menu Điều hướng Mobile
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileMenuBtn.innerHTML = isOpen ? '✕' : '☰';
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Đóng khi click ngoài menu
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        mobileMenuBtn.innerHTML = '☰';
      }
    });
  }

  // ==========================================
  // 3. Hiệu ứng gõ chữ (Typewriter Effect)
  // ==========================================
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement) {
    const phrases = [
      'Frontend Developer',
      'Lập trình viên Web',
      'Đam mê UI/UX & Thiết kế',
      'Người giải quyết bài toán với Code'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseDelay = 1800;

    function typeWriter() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        charIndex--;
        typewriterElement.textContent = currentPhrase.substring(0, charIndex);
      } else {
        charIndex++;
        typewriterElement.textContent = currentPhrase.substring(0, charIndex);
      }

      let delta = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delta = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delta = 400;
      }

      setTimeout(typeWriter, delta);
    }

    typeWriter();
  }

  // ==========================================
  // 4. Theo dõi cuộn & Đánh dấu Menu đang active
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  // ==========================================
  // 5. Nút Quay lại đầu trang (Back to Top)
  // ==========================================
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 6. Hiệu ứng hiển thị thanh kỹ năng (Skill Progress)
  // ==========================================
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  let skillsAnimated = false;

  const skillsSection = document.getElementById('skills');
  if (skillsSection && 'IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level') || '80%';
            bar.style.width = level;
          });
          skillsAnimated = true;
        }
      });
    }, { threshold: 0.25 });

    skillsObserver.observe(skillsSection);
  } else {
    // Dự phòng khi không hỗ trợ Observer
    skillBars.forEach(bar => {
      bar.style.width = bar.getAttribute('data-level') || '80%';
    });
  }

  // ==========================================
  // 7. Tab Kinh nghiệm & Học vấn
  // ==========================================
  const expTabBtn = document.getElementById('expTabBtn');
  const eduTabBtn = document.getElementById('eduTabBtn');
  const expTimeline = document.getElementById('expTimeline');
  const eduTimeline = document.getElementById('eduTimeline');

  if (expTabBtn && eduTabBtn && expTimeline && eduTimeline) {
    expTabBtn.addEventListener('click', () => {
      expTabBtn.classList.add('active');
      eduTabBtn.classList.remove('active');
      expTimeline.style.display = 'block';
      eduTimeline.style.display = 'none';
    });

    eduTabBtn.addEventListener('click', () => {
      eduTabBtn.classList.add('active');
      expTabBtn.classList.remove('active');
      eduTimeline.style.display = 'block';
      expTimeline.style.display = 'none';
    });
  }

  // ==========================================
  // 8. Bộ lọc Dự án (Project Filtering)
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ==========================================
  // 9. Modal Chi tiết Dự án
  // ==========================================
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDescription = document.getElementById('modalDescription');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalTechStack = document.getElementById('modalTechStack');

  const projectData = {
    p1: {
      title: 'E-Commerce Website Mua Sắm Trực Tuyến',
      category: 'Web App',
      description: 'Hệ thống website thương mại điện tử hoàn chỉnh với giao diện giỏ hàng thời gian thực, bộ lọc thông minh nhiều tiêu chí, tìm kiếm nhanh và trang chi tiết sản phẩm tối ưu chuyển đổi.',
      features: [
        'Thiết kế Responsive 100% thân thiện với thiết bị di động',
        'Bộ lọc sản phẩm theo danh mục, mức giá và đánh giá',
        'Giỏ hàng lưu trữ bằng LocalStorage duy trì trạng thái phiên',
        'Giao diện thanh toán thân thiện với người dùng'
      ],
      tech: ['HTML5', 'CSS3 Flex/Grid', 'Vanilla JavaScript ES6', 'LocalStorage']
    },
    p2: {
      title: 'Ứng Dụng Quản Lý Công Việc (Task Kanban)',
      category: 'Web App',
      description: 'Bảng quản lý công việc phong cách Kanban trực quan với tính năng kéo thả (Drag & Drop), phân loại độ ưu tiên theo màu sắc, tìm kiếm và thống kê tiến độ hoàn thành.',
      features: [
        'Kéo thả thẻ nhiệm vụ mượt mà giữa các cột Todo, Doing, Done',
        'Phân loại mức độ khẩn cấp (Cao, Trung bình, Thấp)',
        'Thống kê phần trăm tiến độ tự động',
        'Hỗ trợ chế độ nền sáng và tối'
      ],
      tech: ['HTML5 Drag & Drop API', 'CSS Custom Properties', 'JavaScript', 'CSS Animations']
    },
    p3: {
      title: 'Dashboard Theo Dõi Chi Tiêu Cá Nhân',
      category: 'Giao diện UI',
      description: 'Giao diện bảng điều khiển tài chính cá nhân với biểu đồ trực quan, phân tích thu chi theo từng tháng và quản lý ngân sách tiết kiệm hiệu quả.',
      features: [
        'Biểu đồ thống kê tỷ lệ chi tiêu trực quan',
        'Thêm, sửa, xoá các khoản thu chi tức thì',
        'Tính toán số dư ròng và cảnh báo vượt hạn mức',
        'Xuất dữ liệu chi tiêu dưới dạng tệp đơn giản'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript ES6+', 'SVG Graphics']
    },
    p4: {
      title: 'Landing Page Giới Thiệu Sản Phẩm Công Nghệ',
      category: 'Landing Page',
      description: 'Trang đích (Landing Page) hiện đại cho thiết bị công nghệ mới, tập trung vào nghệ thuật thị giác, tốc độ tải trang cao và tỷ lệ chuyển đổi khách hàng.',
      features: [
        'Typography và layout chuẩn mực theo tỉ lệ vàng',
        'Hiệu ứng Scroll Reveal tinh tế và cuốn hút',
        'Bảng so sánh tính năng trực quan giữa các phiên bản',
        'Điểm Google PageSpeed Insights đạt 98+'
      ],
      tech: ['HTML5', 'CSS Modern Layouts', 'IntersectionObserver API']
    },
    p5: {
      title: 'Trang Thời Tiết Trực Quan Toàn Cầu',
      category: 'Web App',
      description: 'Ứng dụng tra cứu thông tin thời tiết thành phố với hình ảnh nền động thay đổi tương ứng theo tình trạng nắng, mưa, bão hoặc ban đêm.',
      features: [
        'Tra cứu thời tiết theo tên thành phố tức thì',
        'Dự báo thời tiết chi tiết 5 ngày tiếp theo',
        'Chỉ số chất lượng không khí (AQI), độ ẩm, tốc độ gió',
        'Chuyển đổi linh hoạt giữa °C và °F'
      ],
      tech: ['HTML5', 'CSS3', 'Async/Await JavaScript', 'REST API']
    },
    p6: {
      title: 'Bộ Giao Diện Thư Viện UI Tối Giản',
      category: 'Giao diện UI',
      description: 'Bộ sưu tập các thành phần UI thuần CSS như Buttons, Modals, Dropdowns, Tooltips, và Cards chuẩn Accessibility (A11y).',
      features: [
        'Không phụ thuộc bất kỳ thư viện ngoài nào (Zero Dependency)',
        'Đầy đủ trạng thái Hover, Focus-Visible, Active',
        'Mã nguồn sạch, dễ sao chép và tái sử dụng',
        'Hỗ trợ cấu trúc BEM rõ ràng'
      ],
      tech: ['HTML5 Semantics', 'CSS Variables', 'A11y Standards']
    }
  };

  const projectDetailBtns = document.querySelectorAll('.view-project-btn');
  projectDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-id');
      const data = projectData[projectId];

      if (data && projectModal) {
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalDescription.textContent = data.description;
        
        // Render features
        modalFeatures.innerHTML = data.features.map(f => `<li>✓ ${f}</li>`).join('');
        
        // Render tech tags
        modalTechStack.innerHTML = data.tech.map(t => `<span class="project-tag">${t}</span>`).join('');
        
        projectModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (projectModal) {
      projectModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeModal();
    }
  });

  // ==========================================
  // 10. Nút sao chép Email với Toast
  // ==========================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'contact@example.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Đã sao chép địa chỉ email vào bộ nhớ tạm!');
      }).catch(() => {
        showToast('Địa chỉ email: ' + email);
      });
    });
  }

  // ==========================================
  // 11. Xử lý Gửi Form Liên Hệ (Validation & Feedback)
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');
      const submitBtn = document.getElementById('contactSubmitBtn');

      let isValid = true;

      // Kiểm tra họ tên
      if (!nameInput.value.trim()) {
        showFieldError('nameError', 'Vui lòng nhập họ và tên');
        isValid = false;
      } else {
        hideFieldError('nameError');
      }

      // Kiểm tra email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        showFieldError('emailError', 'Vui lòng nhập email hợp lệ');
        isValid = false;
      } else {
        hideFieldError('emailError');
      }

      // Kiểm tra tin nhắn
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        showFieldError('messageError', 'Vui lòng nhập nội dung tin nhắn ít nhất 10 ký tự');
        isValid = false;
      } else {
        hideFieldError('messageError');
      }

      if (!isValid) return;

      // Trạng thái đang gửi
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Đang gửi thông tin...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công.');
      }, 900);
    });
  }

  function showFieldError(elementId, message) {
    const errElem = document.getElementById(elementId);
    if (errElem) {
      errElem.textContent = message;
      errElem.classList.add('visible');
    }
  }

  function hideFieldError(elementId) {
    const errElem = document.getElementById(elementId);
    if (errElem) {
      errElem.textContent = '';
      errElem.classList.remove('visible');
    }
  }

  // ==========================================
  // 12. Toast thông báo tiện ích
  // ==========================================
  const toastContainer = document.getElementById('toastContainer');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  function showToast(message) {
    if (!toastContainer || !toastMessage) return;

    toastMessage.textContent = message;
    toastContainer.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      toastContainer.classList.remove('show');
    }, 3200);
  }

  // Gán hàm showToast vào window để dễ gọi nếu cần
  window.showToast = showToast;
});