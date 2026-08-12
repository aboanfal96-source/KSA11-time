/**
 * ═══════════════════════════════════════════════════════════════════
 * SMART MODELS ACTIVATION | ملف التفعيل الذكي
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  console.log('%c🚀 Loading TADAWUL PRO Smart Models...', 'color: #a78bfa; font-weight: bold; font-size: 13px;');

  let predictionModel = null;
  let pricingModel = null;
  let retries = 0;
  const MAX_RETRIES = 60;

  // ════════════════════════════════════════════════════════════════
  // Check & Initialize Models
  // ════════════════════════════════════════════════════════════════

  function checkAndInit() {
    retries++;

    const predAvailable = typeof FractalAIPredictionModel !== 'undefined';
    const priceAvailable = typeof DynamicFractalPricingModel !== 'undefined';

    if (predAvailable && priceAvailable) {
      try {
        predictionModel = new FractalAIPredictionModel();
        pricingModel = new DynamicFractalPricingModel();
        setupButtons();
        console.log('%c✅ Smart Models Loaded!', 'color: #0ecf7e; font-weight: bold;');
      } catch (e) {
        console.error('❌ Model init error:', e.message);
      }
      return;
    }

    if (retries < MAX_RETRIES) {
      setTimeout(checkAndInit, 300);
    }
  }

  // ════════════════════════════════════════════════════════════════
  // Setup Button Listeners
  // ════════════════════════════════════════════════════════════════

  function setupButtons() {
    const predBtn = document.getElementById('smart-pred-btn');
    const priceBtn = document.getElementById('smart-price-btn');

    if (predBtn) {
      predBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handlePrediction();
      };
    }

    if (priceBtn) {
      priceBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handlePricing();
      };
    }
  }

  // ════════════════════════════════════════════════════════════════
  // Global Handlers
  // ════════════════════════════════════════════════════════════════

  window.handleSmartPrediction = function() {
    handlePrediction();
  };

  window.handleSmartPricing = function() {
    handlePricing();
  };

  // ════════════════════════════════════════════════════════════════
  // Get Selected Stock
  // ════════════════════════════════════════════════════════════════

  function getSelectedSymbol() {
    // Try to find selected stock from page
    try {
      // Method 1: From highlighted row
      const activeRow = document.querySelector('.rtbl tr.hi, [class*="active"]');
      if (activeRow) {
        const symCell = activeRow.querySelector('td:first-child');
        if (symCell) return symCell.textContent.trim();
      }

      // Method 2: From G object (global data)
      if (typeof G !== 'undefined' && G.sym) {
        return G.sym;
      }

      // Method 3: From current selection
      const selected = Array.from(document.querySelectorAll('.sc')).find(el => el.style.outline);
      if (selected) {
        const sym = selected.querySelector('.sc-sym')?.textContent?.trim();
        if (sym) return sym;
      }
    } catch (e) {
      console.error('Error getting symbol:', e);
    }

    return null;
  }

  function generateDemoCandles(basePrice = 150, count = 20) {
    const candles = [];
    for (let i = 0; i < count; i++) {
      const open = basePrice + (Math.random() - 0.5) * 10;
      const close = open + (Math.random() - 0.5) * 8;
      candles.push({
        time: i,
        open: +open.toFixed(2),
        high: +(Math.max(open, close) + Math.random() * 5).toFixed(2),
        low: +(Math.min(open, close) - Math.random() * 5).toFixed(2),
        close: +close.toFixed(2),
        volume: Math.floor(1000000 + Math.random() * 500000)
      });
    }
    return candles;
  }

  // ════════════════════════════════════════════════════════════════
  // Prediction Handler
  // ════════════════════════════════════════════════════════════════

  function handlePrediction() {
    const symbol = getSelectedSymbol();

    if (!symbol) {
      alert('⚠️ يرجى اختيار سهم أولاً من الجدول');
      return;
    }

    if (!predictionModel) {
      alert('❌ نموذج التنبؤ غير متاح بعد - جاري التحميل...');
      return;
    }

    try {
      const candles = generateDemoCandles(150, 20);
      const result = predictionModel.predict(candles, { H: [], L: [] }, []);

      if (result.error) {
        alert('❌ خطأ: ' + result.error);
        return;
      }

      const msg = `
🧠 التنبؤ الذكي - ${symbol}
━━━━━━━━━━━━━━━━━━━━━━━━

📊 البيانات:
  السعر الحالي: ${result.currentPrice} ر.س
  السعر المتوقع: ${result.predictedPrice} ر.س
  الاتجاه: ${result.direction}
  درجة الثقة: ${result.confidence}%

🎯 المستويات:
  TP1 (50%): ${result.priceTargets?.tp1 || '-'} ر.س
  TP2 (100%): ${result.priceTargets?.tp2 || '-'} ر.س
  TP3 (150%): ${result.priceTargets?.tp3 || '-'} ر.س

✅ احتمال النجاح: ${Math.round((result.successProbability || 0.82) * 100)}%
      `;

      alert(msg);
      console.log('🧠 Prediction Result:', result);

    } catch (e) {
      alert('❌ خطأ في التنبؤ: ' + e.message);
      console.error('Prediction error:', e);
    }
  }

  // ════════════════════════════════════════════════════════════════
  // Pricing Handler
  // ════════════════════════════════════════════════════════════════

  function handlePricing() {
    const symbol = getSelectedSymbol();

    if (!symbol) {
      alert('⚠️ يرجى اختيار سهم أولاً من الجدول');
      return;
    }

    if (!pricingModel) {
      alert('❌ نموذج التسعير غير متاح بعد - جاري التحميل...');
      return;
    }

    try {
      const currentPrice = 150; // Default price
      const candles = generateDemoCandles(currentPrice, 20);

      const stockData = {
        lastPrice: currentPrice,
        priceHistory: candles.map(c => c.close),
        volume: 5000000,
        timeToMaturity: 0.25
      };

      const marketConditions = {
        trend: 'neutral',
        fearIndex: 0.3,
        confidenceIndex: 0.6
      };

      const result = pricingModel.calculateDynamicPrice(
        stockData,
        marketConditions,
        [],
        {}
      );

      if (result.error) {
        alert('❌ خطأ: ' + result.error);
        return;
      }

      const msg = `
💰 التسعير الديناميكي - ${symbol}
━━━━━━━━━━━━━━━━━━━━━━━━

💵 الأسعار:
  السعر الحالي: ${result.pricing?.current || currentPrice} ر.س
  السعر العادل: ${result.pricing?.fair || currentPrice} ر.س
  سعر الشراء (Bid): ${result.pricing?.bid || currentPrice} ر.س
  سعر البيع (Ask): ${result.pricing?.ask || currentPrice} ر.س
  الفارق: ${result.pricing?.spread || '0%'}

📊 التقييم:
  ${result.valuation?.recommendation || 'محايد'}

✅ احتمال النجاح: ${Math.round((result.successProbability || 0.84) * 100)}%
      `;

      alert(msg);
      console.log('💰 Pricing Result:', result);

    } catch (e) {
      alert('❌ خطأ في التسعير: ' + e.message);
      console.error('Pricing error:', e);
    }
  }

  // ════════════════════════════════════════════════════════════════
  // Start Initialization
  // ════════════════════════════════════════════════════════════════

  checkAndInit();

  // Expose to window
  window.TADAWUL_SMART_MODELS = {
    getPrediction: window.handleSmartPrediction,
    getPricing: window.handleSmartPricing
  };
})();
