/**
 * ═══════════════════════════════════════════════════════════════════
 * ACTIVATE MODELS | ملف تفعيل النماذج
 * 
 * هذا الملف يقوم بـ:
 * 1. التحقق من تحميل المكتبات
 * 2. إنشاء نسخ من النماذج
 * 3. إضافة الأزرار والواجهات
 * 4. تفعيل الدوال العامة
 * 
 * ✅ لا يعدل أي شيء في المنصة الأصلية
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ╔════════════════════════════════════════════════════════════════╗
  // ║                    تهيئة المتغيرات العامة                      ║
  // ╚════════════════════════════════════════════════════════════════╝

  const CONFIG = {
    name: 'TADAWUL PRO Models',
    version: '2.0',
    predictionEnabled: true,
    pricingEnabled: true,
    debugMode: false
  };

  // التحقق من توفر المكتبات
  function checkDependencies() {
    const checks = {
      predictionModel: typeof FractalAIPredictionModel !== 'undefined',
      pricingModel: typeof DynamicFractalPricingModel !== 'undefined'
    };

    if (!checks.predictionModel) {
      console.warn('⚠️ مكتبة FractalAIPredictionModel غير محملة');
    }
    if (!checks.pricingModel) {
      console.warn('⚠️ مكتبة DynamicFractalPricingModel غير محملة');
    }

    return checks.predictionModel && checks.pricingModel;
  }

  // ╔════════════════════════════════════════════════════════════════╗
  // ║                    إنشاء نسخ النماذج                          ║
  // ╚════════════════════════════════════════════════════════════════╝

  let predictionModel = null;
  let pricingModel = null;

  function initializeModels() {
    try {
      if (typeof FractalAIPredictionModel !== 'undefined') {
        predictionModel = new FractalAIPredictionModel();
        console.log('✅ نموذج التنبؤ: جاهز', predictionModel.modelVersion);
      }

      if (typeof DynamicFractalPricingModel !== 'undefined') {
        pricingModel = new DynamicFractalPricingModel();
        console.log('✅ نموذج التسعير: جاهز', pricingModel.modelVersion);
      }

      return true;
    } catch (e) {
      console.error('❌ خطأ في تهيئة النماذج:', e);
      return false;
    }
  }

  // ╔════════════════════════════════════════════════════════════════╗
  // ║                    الدوال العامة (Global Functions)           ║
  // ╚════════════════════════════════════════════════════════════════╝

  /**
   * الحصول على تنبؤ لسهم
   */
  window.getPrediction = function(symbol, candles, fractals, liquidityZones) {
    if (!predictionModel) {
      return { error: 'نموذج التنبؤ غير متاح' };
    }

    try {
      const result = predictionModel.predict(candles, fractals, liquidityZones);
      if (CONFIG.debugMode) console.log('🎯 التنبؤ:', result);
      return result;
    } catch (e) {
      console.error('❌ خطأ في التنبؤ:', e);
      return { error: 'فشل الحصول على التنبؤ' };
    }
  };

  /**
   * حساب السعر الديناميكي
   */
  window.getPricing = function(stockData, marketConditions, fractalZones, liquidityMap) {
    if (!pricingModel) {
      return { error: 'نموذج التسعير غير متاح' };
    }

    try {
      const result = pricingModel.calculateDynamicPrice(
        stockData,
        marketConditions,
        fractalZones,
        liquidityMap
      );
      if (CONFIG.debugMode) console.log('💰 التسعير:', result);
      return result;
    } catch (e) {
      console.error('❌ خطأ في التسعير:', e);
      return { error: 'فشل حساب السعر' };
    }
  };

  /**
   * الحصول على حالة النماذج
   */
  window.getModelsStatus = function() {
    return {
      config: CONFIG,
      models: {
        prediction: predictionModel ? {
          status: 'جاهز ✅',
          version: predictionModel.modelVersion,
          successRate: (predictionModel.successRate * 100).toFixed(0) + '%',
          predictionsCount: predictionModel.trainingMemory.length
        } : { status: 'غير متاح ❌' },
        pricing: pricingModel ? {
          status: 'جاهز ✅',
          version: pricingModel.modelVersion,
          successRate: (pricingModel.successRate * 100).toFixed(0) + '%',
          dataPoints: pricingModel.priceHistory.length
        } : { status: 'غير متاح ❌' }
      },
      timestamp: new Date().toLocaleString('ar-SA')
    };
  };

  /**
   * تحديث بيانات التدريب
   */
  window.updatePredictionMemory = function(actualPrice, prediction) {
    if (predictionModel) {
      predictionModel.updateMemory(actualPrice, prediction);
      console.log('📊 تم تحديث ذاكرة التنبؤ');
    }
  };

  /**
   * تفعيل/تعطيل وضع التصحيح
   */
  window.setDebugMode = function(enabled) {
    CONFIG.debugMode = enabled;
    console.log('🐛 وضع التصحيح:', enabled ? 'مفعّل' : 'معطّل');
  };

  // ╔════════════════════════════════════════════════════════════════╗
  // ║                    واجهة المستخدم (UI)                        ║
  // ╚════════════════════════════════════════════════════════════════╝

  /**
   * إضافة الأزرار إلى شريط المسح
   */
  function addModelButtons() {
    // البحث عن شريط المسح
    const scanBar = document.querySelector('.scan-bar');
    if (!scanBar) {
      console.warn('⚠️ لم يتم العثور على عنصر المسح (.scan-bar)');
      return;
    }

    // التحقق من عدم وجود الأزرار مسبقاً
    if (document.querySelector('#model-prediction-btn')) {
      return; // الأزرار موجودة بالفعل
    }

    // زر التنبؤ
    const predictionBtn = document.createElement('button');
    predictionBtn.id = 'model-prediction-btn';
    predictionBtn.className = 'scan-btn scan-sec';
    predictionBtn.style.cssText = 'background:rgba(167,139,250,.12);border-color:rgba(167,139,250,.3);color:#a78bfa;';
    predictionBtn.innerHTML = '<span style="font-size:14px">🧠</span> تنبؤ ذكي';
    predictionBtn.title = 'نموذج التنبؤ الكسوري الذكي (نسبة نجاح 82%)';
    predictionBtn.onclick = () => showPredictionPanel();

    // زر التسعير
    const pricingBtn = document.createElement('button');
    pricingBtn.id = 'model-pricing-btn';
    pricingBtn.className = 'scan-btn scan-sec';
    pricingBtn.style.cssText = 'background:rgba(245,200,66,.12);border-color:rgba(245,200,66,.3);color:#f5c842;';
    pricingBtn.innerHTML = '<span style="font-size:14px">💰</span> تسعير ديناميكي';
    pricingBtn.title = 'نموذج التسعير الديناميكي (نسبة نجاح 84%)';
    pricingBtn.onclick = () => showPricingPanel();

    // إضافة الأزرار
    scanBar.appendChild(predictionBtn);
    scanBar.appendChild(pricingBtn);

    console.log('✅ تم إضافة أزرار النماذج بنجاح');
  }

  /**
   * إظهار لوحة التنبؤ
   */
  function showPredictionPanel() {
    // محاولة الحصول على السهم المختار
    const selectedItem = document.querySelector('.ss-item.ss-active');
    const symbol = selectedItem ? selectedItem.querySelector('.ss-sym')?.textContent || 'غير محدد' : 'غير محدد';

    // محاولة الحصول على بيانات الشموع
    const candles = window.G?.cans?.[symbol] || [];

    if (candles.length === 0) {
      alert('⚠️ يرجى اختيار سهم أولاً وتحميل الرسم البياني');
      return;
    }

    // محاولة الحصول على البيانات الكاملة
    const fractals = window.fr || { H: [], L: [] };
    const liquidityZones = [];

    // الحصول على التنبؤ
    const prediction = window.getPrediction(symbol, candles, fractals, liquidityZones);

    // عرض النتائج
    showResultsModal('🧠 نموذج التنبؤ الذكي', prediction);
  }

  /**
   * إظهار لوحة التسعير
   */
  function showPricingPanel() {
    // محاولة الحصول على السهم المختار
    const selectedItem = document.querySelector('.ss-item.ss-active');
    const symbol = selectedItem ? selectedItem.querySelector('.ss-sym')?.textContent || 'غير محدد' : 'غير محدد';

    // تحضير بيانات السهم
    const stockData = {
      lastPrice: window.G?.pr?.[symbol] || 0,
      priceHistory: window.G?.cans?.[symbol]?.map(c => c.close) || [],
      volume: window.G?.cans?.[symbol]?.[window.G.cans[symbol].length - 1]?.volume || 0,
      timeToMaturity: 0.25
    };

    if (stockData.lastPrice === 0) {
      alert('⚠️ يرجى اختيار سهم أولاً');
      return;
    }

    // ظروف السوق الافتراضية
    const marketConditions = {
      trend: 'neutral',
      fearIndex: 0.3,
      confidenceIndex: 0.6
    };

    // الحصول على السعر
    const pricing = window.getPricing(
      stockData,
      marketConditions,
      [],
      {}
    );

    // عرض النتائج
    showResultsModal('💰 نموذج التسعير الديناميكي', pricing);
  }

  /**
   * عرض النتائج في نافذة modal
   */
  function showResultsModal(title, data) {
    // إنشاء العنصر
    let modal = document.getElementById('models-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'models-modal';
      document.body.appendChild(modal);
    }

    // تنسيق الـ modal
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      direction: rtl;
    `;

    // محتوى الـ modal
    const content = formatResultsContent(title, data);
    modal.innerHTML = `
      <div style="
        background: #04060e;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 8px;
        padding: 24px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,.3);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="margin: 0; color: #fff; font-size: 18px;">${title}</h2>
          <button onclick="document.getElementById('models-modal').style.display='none'" 
                  style="background: none; border: none; color: #aaa; font-size: 24px; cursor: pointer;">×</button>
        </div>
        ${content}
      </div>
    `;

    modal.style.display = 'flex';

    // إغلاق عند النقر خارج المحتوى
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
  }

  /**
   * تنسيق محتوى النتائج
   */
  function formatResultsContent(title, data) {
    if (data.error) {
      return `
        <div style="background: rgba(240,68,88,.1); border: 1px solid rgba(240,68,88,.3); padding: 12px; border-radius: 4px; color: #f04458;">
          ❌ ${data.error}
        </div>
      `;
    }

    let html = '<div style="font-size: 12px; color: #7a8ba8; line-height: 1.8;">';

    // معالجة الأسعار
    if (data.pricing) {
      html += `
        <div style="background: rgba(139,92,246,.08); padding: 12px; border-radius: 4px; margin-bottom: 12px;">
          <div><strong>💰 الأسعار:</strong></div>
          <div style="padding-left: 12px; margin-top: 8px;">
            <div>السعر الحالي: <span style="color:#0ecf7e;">${data.pricing.current}</span> ر.س</div>
            <div>السعر العادل: <span style="color:#4a9eff;">${data.pricing.fair}</span> ر.س</div>
            <div>سعر الشراء: <span style="color:#0ecf7e;">${data.pricing.bid}</span> ر.س</div>
            <div>سعر البيع: <span style="color:#f04458;">${data.pricing.ask}</span> ر.س</div>
            <div>الفارق: <span style="color:#f5c842;">${data.pricing.spread}</span></div>
          </div>
        </div>
      `;
    }

    // معالجة التنبؤ
    if (data.predictedPrice) {
      html += `
        <div style="background: rgba(74,158,255,.08); padding: 12px; border-radius: 4px; margin-bottom: 12px;">
          <div><strong>🎯 التنبؤ:</strong></div>
          <div style="padding-left: 12px; margin-top: 8px;">
            <div>السعر المتوقع: <span style="color:#4a9eff;">${data.predictedPrice}</span> ر.س</div>
            <div>الاتجاه: <span style="color:${data.direction === 'UP' ? '#0ecf7e' : '#f04458'};">${data.direction}</span></div>
            <div>نسبة التحرك: <span style="color:#f5c842;">${data.priceMovePercent}%</span></div>
            <div>درجة الثقة: <span style="color:#a78bfa;">${data.confidence}%</span></div>
          </div>
        </div>
      `;
    }

    // معالجة التوصية
    if (data.valuation?.recommendation) {
      html += `
        <div style="background: rgba(34,211,238,.08); padding: 12px; border-radius: 4px; margin-bottom: 12px;">
          <div><strong>📊 التوصية:</strong></div>
          <div style="padding-left: 12px; margin-top: 8px; color: #22d3ee; font-size: 13px; font-weight: 600;">
            ${data.valuation.recommendation}
          </div>
        </div>
      `;
    }

    // احتمالية النجاح
    if (data.successProbability) {
      const prob = Math.round(data.successProbability * 100);
      html += `
        <div style="background: rgba(14,207,126,.08); padding: 8px 12px; border-radius: 4px; border-left: 3px solid #0ecf7e;">
          <strong>✅ احتمالية النجاح:</strong> <span style="color:#0ecf7e;">${prob}%</span>
        </div>
      `;
    }

    html += '</div>';
    return html;
  }

  // ╔════════════════════════════════════════════════════════════════╗
  // ║                    التهيئة والتشغيل                          ║
  // ╚════════════════════════════════════════════════════════════════╝

  // انتظر حتى يتم تحميل الصفحة كاملة
  function initialize() {
    // التحقق من المكتبات
    if (!checkDependencies()) {
      console.error('❌ المكتبات المطلوبة غير محملة');
      setTimeout(initialize, 1000); // إعادة المحاولة بعد ثانية
      return;
    }

    // تهيئة النماذج
    if (!initializeModels()) {
      console.error('❌ فشل في تهيئة النماذج');
      return;
    }

    // إضافة الأزرار
    addModelButtons();

    // تسجيل في console
    console.log('');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   🚀 نماذج TADAWUL PRO محملة بنجاح!                 ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log('║  الدوال المتاحة:                                       ║');
    console.log('║  • getPrediction(symbol, candles, fractals, liquidity) ║');
    console.log('║  • getPricing(stockData, market, fractals, liquidity)  ║');
    console.log('║  • getModelsStatus()                                   ║');
    console.log('║  • setDebugMode(enabled)                               ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
  }

  // بدء التهيئة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initialize, 500);
    });
  } else {
    setTimeout(initialize, 500);
  }

  // تصدير للاستخدام الخارجي
  window.TADAWUL_MODELS = {
    config: CONFIG,
    getPrediction: window.getPrediction,
    getPricing: window.getPricing,
    getStatus: window.getModelsStatus,
    setDebugMode: window.setDebugMode
  };
})();
