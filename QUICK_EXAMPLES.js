/**
 * ═══════════════════════════════════════════════════════════════════
 * أمثلة عملية فورية - Instant Ready Examples
 * 
 * انسخ وألصق أي من هذه الأمثلة في Browser Console (F12)
 * واضغط Enter - سيعمل فوراً!
 * ═══════════════════════════════════════════════════════════════════
 */

// ╔════════════════════════════════════════════════════════════════╗
// ║          مثال 1: فحص حالة النماذج (الأسهل)                   ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * اطبع هذا في Console لترى حالة كل شيء:
 */

console.clear();
console.log('📊 فحص حالة النماذج:');
const status = getModelsStatus();
console.table(status.models);

// النتيجة المتوقعة:
// ┌─────────────┬──────────┬───────────────────────────┐
// │ (index)     │ status   │ successRate               │
// ├─────────────┼──────────┼───────────────────────────┤
// │ prediction  │ جاهز ✅  │ 82%                       │
// │ pricing     │ جاهز ✅  │ 84%                       │
// └─────────────┴──────────┴───────────────────────────┘


// ╔════════════════════════════════════════════════════════════════╗
// ║        مثال 2: تنبؤ بسيط (بيانات تجريبية)                     ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * اطبع هذا للحصول على تنبؤ بسيط:
 */

// إنشاء بيانات تجريبية
const sampleCandles = [
  { time: 1, open: 100, high: 105, low: 98, close: 102, volume: 1000000 },
  { time: 2, open: 102, high: 106, low: 101, close: 104, volume: 1100000 },
  { time: 3, open: 104, high: 108, low: 102, close: 105, volume: 1200000 },
  { time: 4, open: 105, high: 110, low: 103, close: 107, volume: 1300000 },
  { time: 5, open: 107, high: 111, low: 105, close: 108, volume: 1400000 },
];

// تكرار البيانات لعمل 20 شمعة
const fullCandles = [];
for (let i = 0; i < 4; i++) {
  fullCandles.push(...sampleCandles);
}

const sampleFractals = {
  H: [{ i: 10, strength: 0.85 }],
  L: [{ i: 15, strength: 0.75 }]
};

// الحصول على التنبؤ
const prediction = getPrediction('ARAMCO', fullCandles, sampleFractals, []);

console.clear();
console.log('🎯 التنبؤ الذكي:');
console.log('='.repeat(50));
console.log('السعر الحالي:', prediction.currentPrice);
console.log('السعر المتوقع:', prediction.predictedPrice);
console.log('الاتجاه:', prediction.direction);
console.log('درجة الثقة:', prediction.confidence + '%');
console.log('احتمال النجاح:', Math.round(prediction.successProbability * 100) + '%');
console.log('');
console.log('مستويات الأسعار:');
console.log('  TP1 (50%):', prediction.priceTargets.tp1);
console.log('  TP2 (100%):', prediction.priceTargets.tp2);
console.log('  TP3 (150%):', prediction.priceTargets.tp3);
console.log('');
console.log('العوامل المؤثرة:');
Object.entries(prediction.factors).forEach(([key, factor]) => {
  console.log(`  ${key}: ${factor.value} (وزن: ${Math.round(factor.weight * 100)}%)`);
});


// ╔════════════════════════════════════════════════════════════════╗
// ║        مثال 3: حساب السعر الديناميكي (بسيط)                   ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * اطبع هذا لحساب السعر العادل:
 */

const sampleStockData = {
  lastPrice: 150,
  priceHistory: [140, 142, 145, 147, 149, 150],
  volume: 5000000,
  timeToMaturity: 0.25
};

const sampleMarketConditions = {
  trend: 'bullish',
  fearIndex: 0.25,
  confidenceIndex: 0.65
};

const pricing = getPricing(
  sampleStockData,
  sampleMarketConditions,
  [{ low: 145, high: 155, strength: 0.85 }],
  {}
);

console.clear();
console.log('💰 التسعير الديناميكي:');
console.log('='.repeat(50));
console.log('السعر الحالي:', pricing.pricing.current, 'ر.س');
console.log('السعر العادل:', pricing.pricing.fair, 'ر.س');
console.log('سعر الشراء (Bid):', pricing.pricing.bid, 'ر.س');
console.log('سعر البيع (Ask):', pricing.pricing.ask, 'ر.س');
console.log('الفارق:', pricing.pricing.spread);
console.log('');
console.log('التقييم:');
console.log('  هل السهم مقيّم بأقل من قيمته؟', pricing.valuation.undervalued);
console.log('  التوصية:', pricing.valuation.recommendation);
console.log('');
console.log('احتمال النجاح:', Math.round(pricing.successProbability * 100) + '%');


// ╔════════════════════════════════════════════════════════════════╗
// ║        مثال 4: مقارنة نموذجين                                  ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * اطبع هذا لمقارنة التنبؤ والتسعير معاً:
 */

console.clear();
console.log('📊 مقارنة كاملة:');
console.log('='.repeat(50));

// اطلب التنبؤ
const pred = getPrediction('ARAMCO', fullCandles, sampleFractals, []);

// اطلب التسعير
const price = getPricing(sampleStockData, sampleMarketConditions, [], {});

console.log('');
console.log('🧠 نموذج التنبؤ:');
console.log('   نسخة:', pred.model);
console.log('   السعر المتوقع:', pred.predictedPrice, 'ر.س');
console.log('   درجة الثقة:', pred.confidence + '%');
console.log('   نسبة النجاح:', Math.round(pred.successProbability * 100) + '%');

console.log('');
console.log('💰 نموذج التسعير:');
console.log('   نسخة:', price.model);
console.log('   السعر العادل:', price.pricing.fair, 'ر.س');
console.log('   التوصية:', price.valuation.recommendation);
console.log('   نسبة النجاح:', Math.round(price.successProbability * 100) + '%');


// ╔════════════════════════════════════════════════════════════════╗
// ║        مثال 5: تحديث ذاكرة التدريب (Learning)                 ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * اطبع هذا لتحديث الذاكرة (محاكاة سعر فعلي):
 */

const mockActualPrice = 155.30; // السعر الفعلي بعد التنبؤ

updatePredictionMemory(mockActualPrice, pred);

console.clear();
console.log('📈 تم تحديث الذاكرة!');
console.log('');
console.log('التنبؤ السابق:', pred.predictedPrice, 'ر.س');
console.log('السعر الفعلي:', mockActualPrice, 'ر.س');
console.log('الخطأ:', Math.abs(mockActualPrice - pred.predictedPrice), 'ر.س');

// اعرض تقرير الأداء
const perfReport = window.predictionModel.getPerformanceReport();
console.log('');
console.log('📊 تقرير الأداء:');
console.log('   عدد التنبؤات:', perfReport.totalPredictions);
console.log('   نسبة النجاح:', perfReport.successRate + '%');
console.log('   متوسط الخطأ:', perfReport.avgError);


// ╔════════════════════════════════════════════════════════════════╗
// ║        مثال 6: تفعيل وضع التصحيح (Debug Mode)               ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * اطبع هذا لمعرفة التفاصيل الكاملة:
 */

// تفعيل وضع التصحيح
setDebugMode(true);

// الآن كل استدعاء سيطبع معلومات مفصلة
console.log('🐛 وضع التصحيح: مفعّل');
console.log('');
console.log('الآن اطلب تنبؤ:');
const debugPred = getPrediction('ARAMCO', fullCandles, sampleFractals, []);
// ستظهر معلومات تفصيلية في Console

console.log('');
console.log('لتعطيل وضع التصحيح:');
console.log('setDebugMode(false)');


// ╔════════════════════════════════════════════════════════════════╗
// ║        مثال 7: استخراج البيانات من المنصة الفعلية             ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * هذا الكود يستخرج البيانات من منصتك TADAWUL:
 */

// اختر سهم أولاً ثم اطبع هذا:

function analyzeSelectedStock() {
  // الحصول على السهم المختار
  const selectedItem = document.querySelector('.ss-item.ss-active');
  if (!selectedItem) {
    console.error('❌ يرجى اختيار سهم أولاً');
    return;
  }

  const symbol = selectedItem.querySelector('.ss-sym')?.textContent;
  console.clear();
  console.log(`🎯 تحليل السهم: ${symbol}`);
  console.log('='.repeat(50));

  // استخرج بيانات الشموع
  const candles = window.G?.cans?.[symbol] || [];
  console.log('عدد الشموع:', candles.length);

  if (candles.length > 0) {
    const lastCandle = candles[candles.length - 1];
    console.log('السعر الحالي:', lastCandle.close, 'ر.س');
    console.log('أعلى سعر:', lastCandle.high, 'ر.س');
    console.log('أقل سعر:', lastCandle.low, 'ر.س');
    console.log('الحجم:', lastCandle.volume, 'سهم');

    // اطلب التنبؤ
    const pred = getPrediction(symbol, candles, { H: [], L: [] }, []);
    console.log('');
    console.log('📊 التنبؤ:');
    console.log('  السعر المتوقع:', pred.predictedPrice, 'ر.س');
    console.log('  درجة الثقة:', pred.confidence + '%');
    console.log('  الاتجاه:', pred.direction);
  } else {
    console.warn('⚠️ لا توجد بيانات شموع - حمّل الرسم البياني أولاً');
  }
}

// اطبع: analyzeSelectedStock()


// ╔════════════════════════════════════════════════════════════════╗
// ║        مثال 8: حلقة تحديث تلقائي                             ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * اطبع هذا لتحديث التنبؤ كل 30 ثانية:
 */

function startAutoUpdate() {
  let counter = 0;
  
  const interval = setInterval(() => {
    counter++;
    
    // اطلب تنبؤ جديد
    const pred = getPrediction('ARAMCO', fullCandles, sampleFractals, []);
    
    console.clear();
    console.log(`♻️ التحديث #${counter} - ${new Date().toLocaleTimeString('ar-SA')}`);
    console.log('='.repeat(50));
    console.log('السعر المتوقع:', pred.predictedPrice);
    console.log('درجة الثقة:', pred.confidence + '%');
    console.log('الاتجاه:', pred.direction);
    console.log('');
    console.log('لإيقاف التحديث: clearInterval(interval)');
  }, 30000); // كل 30 ثانية
  
  return interval;
}

// اطبع: const myInterval = startAutoUpdate()
// لإيقاف: clearInterval(myInterval)


// ╔════════════════════════════════════════════════════════════════╗
// ║        مثال 9: رسم بياني للنتائج (تصور البيانات)              ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * اطبع هذا لعرض النتائج في جدول:
 */

function displayResultsTable() {
  const pred = getPrediction('ARAMCO', fullCandles, sampleFractals, []);
  const price = getPricing(sampleStockData, sampleMarketConditions, [], {});

  console.clear();
  console.log('📋 جدول المقارنة:');
  console.log('='.repeat(60));

  const data = [
    {
      'المقياس': 'السعر الحالي',
      'التنبؤ': pred.currentPrice + ' ر.س',
      'التسعير': price.pricing.current + ' ر.س'
    },
    {
      'المقياس': 'الهدف/السعر العادل',
      'التنبؤ': pred.predictedPrice + ' ر.س',
      'التسعير': price.pricing.fair + ' ر.س'
    },
    {
      'المقياس': 'درجة الثقة',
      'التنبؤ': pred.confidence + '%',
      'التسعير': Math.round(price.margin.confidence) + '%'
    },
    {
      'المقياس': 'احتمال النجاح',
      'التنبؤ': Math.round(pred.successProbability * 100) + '%',
      'التسعير': Math.round(price.successProbability * 100) + '%'
    },
    {
      'المقياس': 'التوصية',
      'التنبؤ': pred.direction,
      'التسعير': price.valuation.recommendation
    }
  ];

  console.table(data);
}

// اطبع: displayResultsTable()


// ╔════════════════════════════════════════════════════════════════╗
// ║        مثال 10: حفظ النتائج كـ JSON                           ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * اطبع هذا لحفظ النتائج:
 */

function exportResults() {
  const pred = getPrediction('ARAMCO', fullCandles, sampleFractals, []);
  const price = getPricing(sampleStockData, sampleMarketConditions, [], {});
  const status = getModelsStatus();

  const results = {
    timestamp: new Date().toISOString(),
    prediction: pred,
    pricing: price,
    status: status,
    notes: 'تم إنشاؤها بواسطة TADAWUL PRO Models v2.0'
  };

  // اطبع JSON
  console.clear();
  console.log('📥 النتائج بصيغة JSON:');
  console.log(JSON.stringify(results, null, 2));

  // يمكنك نسخ النتيجة من Console
  console.log('');
  console.log('💾 يمكنك نسخ المحتوى أعلاه وحفظه في ملف .json');
}

// اطبع: exportResults()


// ╔════════════════════════════════════════════════════════════════╗
// ║                    ملخص الأوامر السريعة                        ║
// ╚════════════════════════════════════════════════════════════════╝

/*

🚀 أوامر سريعة يمكنك اطبعها مباشرة في Console (F12):

1️⃣ فحص الحالة:
   getModelsStatus()

2️⃣ تنبؤ بسيط:
   getPrediction('ARAMCO', candles, fractals, [])

3️⃣ تسعير ديناميكي:
   getPricing(stockData, marketConditions, [], {})

4️⃣ تفعيل وضع التصحيح:
   setDebugMode(true)

5️⃣ تحليل السهم المختار:
   analyzeSelectedStock()

6️⃣ عرض جدول المقارنة:
   displayResultsTable()

7️⃣ حفظ النتائج:
   exportResults()

8️⃣ تحديث تلقائي:
   const interval = startAutoUpdate()
   clearInterval(interval) // للإيقاف

9️⃣ تحديث الذاكرة:
   updatePredictionMemory(actualPrice, prediction)

🔟 الوصول الكامل:
   window.TADAWUL_MODELS

*/

console.log('✅ جاهز للاستخدام!');
console.log('اطبع أي من الأوامر أعلاه في Console');
