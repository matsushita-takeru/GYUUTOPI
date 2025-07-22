// DOM要素の取得
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const sortSelect = document.querySelector('.sort-select');
const quickViewButtons = document.querySelectorAll('.quick-view-btn');
const modal = document.getElementById('quickViewModal');
const closeBtn = document.querySelector('.close-btn');
const ctaButton = document.querySelector('.cta-button');
const logoTitle = document.getElementById('logo-title');

// 初期の商品順序を保存
let originalOrder = [];

// ページロード時に初期順序を保存
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
    originalOrder = Array.from(productGrid.children);
});

// ロゴタイトルクリック時に初期の並びに戻す
logoTitle.addEventListener('click', () => {
    const productGrid = document.querySelector('.product-grid');
    
    // 初期順序に戻す
    originalOrder.forEach(card => {
        productGrid.appendChild(card);
    });
    
    // フィルターを「すべて」に戻す
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');
    
    // ソートセレクトを初期値に戻す
    sortSelect.value = 'default';
    
    // すべての商品を表示
    productCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // ページの最上部にスムーススクロール
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
});

// フィルター機能
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // アクティブボタンの切り替え
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // 商品カードのフィルタリング
        productCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                // アニメーション効果
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ソート機能
sortSelect.addEventListener('change', (e) => {
    const sortValue = e.target.value;
    const productGrid = document.querySelector('.product-grid');
    const cards = Array.from(productCards);
    
    if (sortValue === 'default') {
        // 初期順序に戻す
        originalOrder.forEach(card => {
            productGrid.appendChild(card);
        });
        return;
    }
    
    cards.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.product-price').textContent.replace(/[^\d]/g, ''));
        const priceB = parseInt(b.querySelector('.product-price').textContent.replace(/[^\d]/g, ''));
        
        switch (sortValue) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'new':
                // 新着順（この例では元の順序を維持）
                return 0;
            default:
                return 0;
        }
    });
    
    // ソートされたカードを再配置
    cards.forEach(card => productGrid.appendChild(card));
});

// クイックビュー機能
quickViewButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const productCard = button.closest('.product-card');
        const title = productCard.querySelector('.product-title').textContent;
        const color = productCard.querySelector('.product-color').textContent;
        const price = productCard.querySelector('.product-price').textContent;
        const img = productCard.querySelector('.product-img');
        
        // モーダルに情報を設定
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalColor').textContent = color;
        document.getElementById('modalPrice').textContent = price;
        document.getElementById('modalImage').src = img.src;
        document.getElementById('modalImage').alt = img.alt;
        
        // モーダルを表示
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// モーダルを閉じる
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// CTAボタンの機能
ctaButton.addEventListener('click', () => {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
});

// スムーススクロール（ナビゲーション）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// カートに追加機能
document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
    const size = document.getElementById('modalSizeSelect').value;
    const title = document.getElementById('modalTitle').textContent;
    
    // カート追加のアニメーション
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = '追加中...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = '追加完了！';
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            closeModal();
        }, 1000);
    }, 1000);
    
    // 実際のカート機能をここに実装
    console.log(`商品「${title}」（サイズ: ${size}）をカートに追加しました`);
});

// 検索機能（基本的な実装）
document.querySelector('.search-btn').addEventListener('click', () => {
    const searchTerm = prompt('商品名を入力してください:');
    if (searchTerm) {
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const isMatch = title.includes(searchTerm.toLowerCase());
            
            card.style.display = isMatch ? 'block' : 'none';
        });
        
        // 検索結果が0の場合のメッセージ
        const visibleCards = Array.from(productCards).filter(card => 
            card.style.display !== 'none'
        );
        
        if (visibleCards.length === 0) {
            alert('該当する商品が見つかりませんでした。');
            // 全ての商品を再表示
            productCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    }
});

// ページロード時のアニメーション
window.addEventListener('load', () => {
    // ヒーローセクションのアニメーション
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'all 0.8s ease';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 100);
    
    // 商品カードの順次アニメーション
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
});

// スクロール時のヘッダー効果
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 下にスクロール時はヘッダーを隠す
        header.style.transform = 'translateY(-100%)';
    } else {
        // 上にスクロール時はヘッダーを表示
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// 商品カードのホバー効果の強化
productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'all 0.3s ease';
    });
});

// レスポンシブ対応：モバイルメニュー（基本的な実装）
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        // モバイルメニューの実装をここに追加
        console.log('モバイル表示');
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu(); // 初期実行
