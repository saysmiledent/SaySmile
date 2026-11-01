// Evidence-based articles (ru / fa / en). Shared parts (slug, date, references) live once;
// each language has its own title, text and keywords. References were checked in PubMed.
import type { Locale } from '../i18n';
import type { LibEntry } from './library-ui';

export interface ArticleRef { text: string; doi: string; pmid: string }
export interface ArticleText {
  title: string; description: string; lead: string; key: string[];
  sections: { h: string; p: string[] }[]; keywords: string[];
}
// `lib` is set for plain-language retellings of published papers (the research library), not for the doctor's own articles.
export interface Article { slug: string; iso: string; minutes: number; refs: ArticleRef[]; text: Record<Locale, ArticleText>; lib?: LibEntry }

const lamont: ArticleRef = {
  text: 'Lamont T, Worthington HV, Clarkson JE, Beirne PV. Routine scale and polish for periodontal health in adults. Cochrane Database Syst Rev. 2018;12:CD004625.',
  doi: '10.1002/14651858.CD004625.pub5', pmid: '30590875',
};
const miao: ArticleRef = {
  text: 'Miao C, Yang X, Wong MC, et al. Rubber dam isolation for restorative treatment in dental patients. Cochrane Database Syst Rev. 2021;5:CD009858.',
  doi: '10.1002/14651858.CD009858.pub3', pmid: '33998662',
};
const schwendicke: ArticleRef = {
  text: 'Schwendicke F, Walsh T, Lamont T, et al. Interventions for treating cavitated or dentine carious lesions. Cochrane Database Syst Rev. 2021;7:CD013039.',
  doi: '10.1002/14651858.CD013039.pub2', pmid: '34280957',
};
const fraser: ArticleRef = {
  text: 'Fraser J, MacInnes A. Which caries removal method to select? Evid Based Dent. 2024;25(1):29-30.',
  doi: '10.1038/s41432-024-00973-0', pmid: '38253747',
};
const eachempati: ArticleRef = {
  text: 'Eachempati P, Kumbargere Nagraj S, Kiran Kumar Krishanappa S, et al. Home-based chemically-induced whitening (bleaching) of teeth in adults. Cochrane Database Syst Rev. 2018;12:CD006202.',
  doi: '10.1002/14651858.CD006202.pub2', pmid: '30562408',
};

export const articles: Article[] = [
  /* ------------------------------------------------------------------ hygiene */
  {
    slug: 'professional-hygiene', iso: '2026-10-31', minutes: 4, refs: [lamont],
    text: {
      ru: {
        title: 'Профессиональная гигиена полости рта: что входит и как часто делать',
        description: 'Что делает врач на профессиональной гигиене (ультразвук, AIRFLOW, полировка), зачем она нужна и как часто её проходить, с опорой на Cochrane-обзор.',
        lead: 'Профессиональная гигиена: это не отбеливание и не «просто чистка»: врач убирает то, что зубная щётка убрать не может, и показывает, как сохранить результат дома.',
        key: [
          'Ультразвук удаляет зубной камень, AIRFLOW: мягкий налёт и пигмент, полировка делает поверхность гладкой.',
          'Чаще всего процедуру повторяют раз в 6–12 месяцев; точный интервал определяется на осмотре.',
          'Cochrane-обзор: плановая чистка у здоровых взрослых немного уменьшает зубной камень, но заметной разницы по воспалению дёсен за 2–3 года не нашли.',
        ],
        sections: [
          { h: 'Что входит в процедуру', p: ['Сначала врач осматривает полость рта и оценивает состояние дёсен. Ультразвук удаляет твёрдые отложения: зубной камень, не повреждая эмаль. AIRFLOW снимает мягкий налёт и пигмент в труднодоступных местах. В конце поверхность полируют: гладкая эмаль медленнее собирает налёт. Завершает визит индивидуальный план домашнего ухода.'] },
          { h: 'Зачем это нужно', p: ['Бактериальный налёт: главный фактор развития кариеса и воспаления дёсен. Зубной камень удерживает налёт на зубе и под десной, и щёткой его не убрать. Если дёсны воспалены из-за налёта и камня, после чистки воспаление и кровоточивость, как правило, уменьшаются, а зубы возвращают естественный цвет, если его скрывал пигмент.'] },
          { h: 'Что говорят исследования', p: ['Cochrane-обзор 2018 года (Lamont и соавт.) оценил плановую чистку и полировку у взрослых без тяжёлого пародонтита: в анализ вошли два исследования, 1711 участников, наблюдение 2–3 года. Регулярная чистка немного уменьшала количество зубного камня (раз в полгода, чуть сильнее, чем раз в год), но существенной разницы по воспалению дёсен и глубине пародонтальных карманов между группами не нашли. Клиническая значимость уменьшения камня остаётся неясной. Участники, которым проводили чистку, чаще оценивали свою полость рта как более чистую.', 'Важно: обзор не отвечает на вопрос о людях с брекетами, имплантатами, пародонтитом или повышенным риском кариеса. Для них график определяет врач по результатам осмотра.'] },
          { h: 'Как часто проходить', p: ['Чаще всего достаточно раза в 6–12 месяцев. Чаще врач может рекомендовать при брекетах, имплантатах, курении, быстром образовании налёта и заболеваниях дёсен. Лучший ориентир: осмотр: после него вы получаете индивидуальный интервал.'] },
        ],
        keywords: ['профессиональная гигиена полости рта', 'чистка зубов у стоматолога', 'удаление зубного камня', 'AIRFLOW', 'стоматолог Санкт-Петербург'],
      },
      fa: {
        title: 'جرم‌گیری و بهداشت حرفه‌ای دهان: چه کارهایی انجام می‌شود و هر چند وقت یک‌بار؟',
        description: 'دندانپزشک در جرم‌گیری حرفه‌ای (اولتراسوند، ایرفلو، پولیش) چه می‌کند، چرا لازم است و هر چند وقت یک‌بار باید انجام شود؛ بر پایه‌ی مرور Cochrane.',
        lead: 'جرم‌گیری حرفه‌ای سفید کردن دندان نیست و فقط «تمیز کردن» هم نیست: دندانپزشک چیزهایی را برمی‌دارد که مسواک نمی‌تواند و نشان می‌دهد چطور نتیجه را در خانه حفظ کنید.',
        key: [
          'اولتراسوند جرم سخت را برمی‌دارد، ایرفلو پلاک نرم و لک را و پولیش سطح دندان را صاف می‌کند.',
          'معمولاً این کار هر ۶ تا ۱۲ ماه تکرار می‌شود؛ فاصله‌ی دقیق در معاینه تعیین می‌شود.',
          'مرور Cochrane: جرم‌گیری برنامه‌ریزی‌شده در بزرگسالان سالم جرم را کمی کم می‌کند، اما در ۲ تا ۳ سال تفاوت چشمگیری در التهاب لثه دیده نشد.',
        ],
        sections: [
          { h: 'چه کارهایی انجام می‌شود', p: ['ابتدا دندانپزشک دهان را معاینه می‌کند و وضعیت لثه را می‌سنجد. اولتراسوند رسوب سخت یعنی جرم را بدون آسیب به مینا برمی‌دارد. ایرفلو پلاک نرم و لک را از نقاطی که دسترسی به آن‌ها سخت است پاک می‌کند. در پایان سطح دندان پولیش می‌شود؛ مینای صاف دیرتر پلاک جمع می‌کند. جلسه با یک برنامه‌ی مراقبت خانگی متناسب با شما تمام می‌شود.'] },
          { h: 'چرا لازم است', p: ['پلاک باکتریایی مهم‌ترین عامل پوسیدگی و التهاب لثه است. جرم، پلاک را روی دندان و زیر لثه نگه می‌دارد و با مسواک پاک نمی‌شود. اگر لثه به‌خاطر پلاک و جرم ملتهب باشد، پس از جرم‌گیری معمولاً التهاب و خون‌ریزی کمتر می‌شود و اگر لک رنگ دندان را پوشانده باشد، رنگ طبیعی برمی‌گردد.'] },
          { h: 'پژوهش‌ها چه می‌گویند', p: ['مرور Cochrane در سال ۲۰۱۸ (Lamont و همکاران) جرم‌گیری و پولیش برنامه‌ریزی‌شده را در بزرگسالانِ بدون پریودنتیت شدید بررسی کرد: دو مطالعه با ۱۷۱۱ شرکت‌کننده و پیگیری ۲ تا ۳ ساله. جرم‌گیری منظم مقدار جرم را کمی کم می‌کرد (هر شش ماه کمی بیشتر از هر دوازده ماه)، اما بین گروه‌ها تفاوت مهمی در التهاب لثه و عمق پاکت‌های لثه‌ای پیدا نشد. اهمیت بالینی این کاهش جرم هنوز روشن نیست. کسانی که جرم‌گیری شده بودند بیشتر دهان خود را تمیزتر ارزیابی می‌کردند.', 'نکته‌ی مهم: این مرور درباره‌ی افراد دارای ارتودنسی، ایمپلنت، پریودنتیت یا خطر بالای پوسیدگی پاسخی نمی‌دهد. برای آن‌ها برنامه را دندانپزشک پس از معاینه تعیین می‌کند.'] },
          { h: 'هر چند وقت یک‌بار', p: ['در بیشتر موارد هر ۶ تا ۱۲ ماه کافی است. در ارتودنسی، ایمپلنت، سیگار کشیدن، تشکیل سریع پلاک و بیماری‌های لثه ممکن است دندانپزشک فاصله‌ی کوتاه‌تری پیشنهاد کند. بهترین راهنما معاینه است: پس از آن فاصله‌ی مناسب خودتان را می‌دانید.'] },
        ],
        keywords: ['جرم‌گیری دندان', 'بهداشت حرفه‌ای دهان', 'دندانپزشک در سن‌پترزبورگ', 'ایرفلو', 'پلاک دندان'],
      },
      en: {
        title: 'Professional dental hygiene: what it includes and how often to have it',
        description: 'What the dentist does during professional hygiene (ultrasound, AIRFLOW, polishing), why it matters and how often to have it, based on a Cochrane review.',
        lead: 'Professional hygiene is not whitening and not just a “clean”: the dentist removes what a toothbrush cannot and shows you how to keep the result at home.',
        key: [
          'Ultrasound removes tartar, AIRFLOW removes soft plaque and stains, polishing leaves a smooth surface.',
          'It is usually repeated every 6–12 months; the exact interval is set at the examination.',
          'Cochrane review: routine scaling and polishing in healthy adults slightly reduces calculus, but no clear difference in gum inflammation was found over 2–3 years.',
        ],
        sections: [
          { h: 'What the procedure includes', p: ['First the dentist examines your mouth and assesses the gums. Ultrasound removes hard deposits (tartar) without damaging the enamel. AIRFLOW removes soft plaque and stains in hard-to-reach places. Finally the surface is polished: smooth enamel collects plaque more slowly. The visit ends with a personal home-care plan.'] },
          { h: 'Why it matters', p: ['Bacterial plaque is the main driver of cavities and gum inflammation. Tartar holds plaque against the tooth and under the gum, and a toothbrush cannot remove it. If the gums are inflamed because of plaque and tartar, inflammation and bleeding usually decrease after cleaning, and teeth regain their natural colour if stains were hiding it.'] },
          { h: 'What the research says', p: ['A 2018 Cochrane review (Lamont et al.) assessed routine scaling and polishing in adults without severe periodontitis: two studies, 1,711 participants, 2–3 years of follow-up. Regular cleaning slightly reduced calculus (six-monthly a little more than 12-monthly), but no meaningful difference in gum inflammation or probing depths was found between groups. The clinical importance of the calculus reduction is unclear. Participants who received cleaning were more likely to rate their mouth as cleaner.', 'Note: the review does not answer the question for people with braces, implants, periodontitis or a high cavity risk. For them the dentist sets the schedule after an examination.'] },
          { h: 'How often to have it', p: ['Every 6–12 months is enough for most people. The dentist may suggest it more often with braces, implants, smoking, fast plaque build-up or gum disease. The best guide is an examination, after which you get your own interval.'] },
        ],
        keywords: ['professional dental hygiene', 'dental cleaning', 'tartar removal', 'AIRFLOW', 'dentist St. Petersburg'],
      },
    },
  },
  /* ------------------------------------------------------------------ rubber dam */
  {
    slug: 'rubber-dam', iso: '2026-10-31', minutes: 4, refs: [miao],
    text: {
      ru: {
        title: 'Коффердам: зачем изолировать зуб при лечении',
        description: 'Что такое коффердам, как он помогает при лечении кариеса и реставрации зубов, что показывает Cochrane-обзор и какие у него ограничения.',
        lead: 'Тонкая резиновая завеса на зубе выглядит необычно, но решает практическую задачу: держит зуб сухим и чистым на время работы.',
        key: [
          'Коффердам изолирует зуб от слюны, влаги и бактерий, для адгезивных материалов сухое поле принципиально.',
          'Он защищает дёсны и полость рта от материалов и жидкостей, а пациента, от случайного попадания мелких предметов.',
          'Cochrane-обзор 2021 года: через 6 месяцев пломбы под коффердамом, вероятно, выходят из строя реже, чем при ватных валиках, но достоверность доказательств низкая.',
        ],
        sections: [
          { h: 'Что это такое', p: ['Коффердам: тонкая эластичная завеса (латексная или нелатексная), которую надевают на один или несколько зубов и фиксируют специальной скобой. Остальная полость рта остаётся «за завесой».'] },
          { h: 'Зачем он нужен', p: ['Современные композитные материалы приклеиваются к зубу, а клеевое соединение плохо работает во влажной среде. Слюна и дыхание: источники влаги и бактерий, поэтому контроль влаги важен для успеха реставрации. Дополнительно коффердам отодвигает язык и щёки, защищает мягкие ткани и не даёт материалам и жидкостям попасть на дёсны и в рот.'] },
          { h: 'Что показывают исследования', p: ['Cochrane-обзор 2021 года (Miao и соавт.) включил шесть исследований с участием 1342 человек; все исследования имели высокий риск смещения. Через 6 месяцев пломбы при изоляции коффердамом, вероятно, чаще сохранялись, чем при использовании ватных валиков (низкая достоверность доказательств). На более поздних сроках данные очень неопределённы. Авторы подчёркивают, что нужны качественные исследования для разных видов реставраций.', 'Вывод честный: коффердам: разумная часть аккуратного протокола, но не гарантия на всю жизнь.'] },
          { h: 'Это неудобно?', p: ['Установка занимает несколько минут, лечение проходит под местной анестезией. Если что-то мешает, дайте знак: сделаем паузу. Заранее сообщите об аллергии на латекс: в таких случаях используют нелатексные завесы.'] },
        ],
        keywords: ['коффердам', 'лечение кариеса под коффердамом', 'изоляция зуба', 'пломба', 'стоматолог СПб'],
      },
      fa: {
        title: 'رابردم (کوفردام): چرا هنگام درمان دندان را ایزوله می‌کنیم',
        description: 'رابردم چیست، چطور به درمان پوسیدگی و ترمیم دندان کمک می‌کند، مرور Cochrane چه می‌گوید و محدودیت‌هایش چیست.',
        lead: 'ورقه‌ی نازک لاستیکی روی دندان عجیب به نظر می‌رسد، اما کارش کاملاً عملی است: دندان را در طول کار خشک و تمیز نگه می‌دارد.',
        key: [
          'رابردم دندان را از بزاق، رطوبت و باکتری جدا می‌کند؛ برای مواد چسبنده، میدان خشک اهمیت اساسی دارد.',
          'لثه و دهان را از مواد و مایعات محافظت می‌کند و جلوی ورود تصادفی ابزار کوچک به دهان بیمار را می‌گیرد.',
          'مرور Cochrane در ۲۰۲۱: پس از ۶ ماه، ترمیم‌های انجام‌شده با رابردم احتمالاً کمتر از ترمیم‌های با پنبه‌ی رول از کار می‌افتند، اما اطمینان شواهد پایین است.',
        ],
        sections: [
          { h: 'رابردم چیست', p: ['رابردم ورقه‌ی نازک و کشسان (لاتکس یا بدون لاتکس) است که روی یک یا چند دندان کشیده می‌شود و با یک گیره‌ی مخصوص ثابت می‌ماند. بقیه‌ی دهان «پشت ورقه» می‌ماند.'] },
          { h: 'چرا لازم است', p: ['مواد کامپوزیت مدرن به دندان می‌چسبند و چسب در محیط مرطوب خوب عمل نمی‌کند. بزاق و نفس منبع رطوبت و باکتری‌اند، پس کنترل رطوبت برای موفقیت ترمیم مهم است. رابردم همچنین زبان و گونه را کنار می‌زند، بافت نرم را محافظت می‌کند و نمی‌گذارد مواد و مایعات روی لثه یا داخل دهان بریزند.'] },
          { h: 'پژوهش‌ها چه می‌گویند', p: ['مرور Cochrane در سال ۲۰۲۱ (Miao و همکاران) شش مطالعه با ۱۳۴۲ شرکت‌کننده را بررسی کرد؛ همه‌ی مطالعات خطر سوگیری بالایی داشتند. پس از ۶ ماه، ترمیم‌ها با رابردم احتمالاً بیشتر از ترمیم‌ها با پنبه‌ی رول سالم می‌ماندند (شواهد با اطمینان پایین). در زمان‌های بعدی داده‌ها بسیار نامطمئن است. نویسندگان تأکید می‌کنند به پژوهش‌های باکیفیت برای انواع ترمیم نیاز است.', 'نتیجه‌ی صادقانه: رابردم بخش معقولی از یک پروتکل دقیق است، اما تضمین مادام‌العمر نیست.'] },
          { h: 'آیا ناراحت‌کننده است', p: ['گذاشتن آن چند دقیقه طول می‌کشد و درمان با بی‌حسی موضعی انجام می‌شود. اگر چیزی اذیتتان کرد علامت بدهید تا مکث کنیم. حساسیت به لاتکس را از قبل بگویید؛ در این صورت از ورقه‌ی بدون لاتکس استفاده می‌شود.'] },
        ],
        keywords: ['رابردم', 'درمان پوسیدگی با رابردم', 'ایزولاسیون دندان', 'ترمیم دندان', 'دندانپزشک سن‌پترزبورگ'],
      },
      en: {
        title: 'The rubber dam: why the tooth is isolated during treatment',
        description: 'What a rubber dam is, how it helps in cavity treatment and tooth restoration, what the Cochrane review shows and what its limits are.',
        lead: 'A thin rubber sheet on the tooth looks unusual, but it does a practical job: it keeps the tooth dry and clean while the dentist works.',
        key: [
          'The rubber dam isolates the tooth from saliva, moisture and bacteria; a dry field is essential for adhesive materials.',
          'It protects the gums and mouth from materials and liquids, and the patient from accidentally swallowing small instruments.',
          'A 2021 Cochrane review: after 6 months, fillings placed under a rubber dam probably fail less often than with cotton rolls, but the certainty of the evidence is low.',
        ],
        sections: [
          { h: 'What it is', p: ['A rubber dam is a thin elastic sheet (latex or non-latex) placed over one or several teeth and held by a small clamp. The rest of the mouth stays “behind the sheet”.'] },
          { h: 'Why it is used', p: ['Modern composite materials bond to the tooth, and the bond works poorly in a wet environment. Saliva and breath bring moisture and bacteria, so moisture control matters for a successful restoration. The dam also holds back the tongue and cheeks, protects soft tissue and keeps materials and liquids off the gums and out of the mouth.'] },
          { h: 'What the research says', p: ['A 2021 Cochrane review (Miao et al.) included six studies with 1,342 participants; all had a high risk of bias. After 6 months, fillings placed with a rubber dam probably survived more often than those placed with cotton rolls (low-certainty evidence). At later time points the data are very uncertain. The authors stress the need for high-quality studies across restoration types.', 'An honest conclusion: the rubber dam is a sensible part of a careful protocol, not a lifetime guarantee.'] },
          { h: 'Is it uncomfortable?', p: ['Placement takes a few minutes and treatment is done under local anesthesia. If anything bothers you, give a sign and we pause. Tell the dentist about a latex allergy beforehand: non-latex sheets are used in such cases.'] },
        ],
        keywords: ['rubber dam', 'cavity treatment under rubber dam', 'tooth isolation', 'dental filling', 'dentist St. Petersburg'],
      },
    },
  },
  /* ------------------------------------------------------------------ caries */
  {
    slug: 'caries-treatment', iso: '2026-10-31', minutes: 5, refs: [fraser, schwendicke],
    text: {
      ru: {
        title: 'Лечение кариеса: как работает бережный подход',
        description: 'Как проходит лечение кариеса, что значит минимально инвазивный подход и что говорят Cochrane-обзор и клинические данные о способах удаления поражённых тканей.',
        lead: 'Кариес: это постепенная потеря минералов эмалью и дентином. Чем раньше он замечен, тем меньше приходится удалять.',
        key: [
          'Кариес развивается под действием кислот, которые вырабатывают бактерии зубного налёта.',
          'Минимально инвазивное лечение сохраняет как можно больше собственных тканей зуба.',
          'При глубоких полостях селективное удаление поражённого дентина в первые 1,5 года реже приводит к вскрытию пульпы; к 5 годам результаты сопоставимы с неселективным.',
        ],
        sections: [
          { h: 'Как развивается кариес', p: ['Бактерии налёта перерабатывают сахара в кислоты, а кислоты растворяют минералы эмали. На раннем этапе процесс обратим: помогают гигиена, средства с фтором и контроль сахара. Если полость уже образовалась, нужна пломба.'] },
          { h: 'Этапы лечения', p: ['Осмотр и выбор тактики. Изоляция зуба коффердамом. Удаление поражённых тканей и подготовка полости. Восстановление формы зуба современными адгезивными материалами. Полировка для эстетики и долговечности.'] },
          { h: 'Что значит «бережно»', p: ['Задача: убрать только то, что действительно поражено, и сохранить здоровую ткань. В глубокой полости полное удаление размягчённого дентина может привести к вскрытию пульпы. Систематический обзор, разобранный в Evidence-Based Dentistry (Fraser, MacInnes, 2024), показывает: селективное удаление: лучший вариант в краткосрочной перспективе (около 1,5 лет), прежде всего из-за меньшего риска вскрытия пульпы; к 5 годам результаты уже не отличались от неселективного удаления.'] },
          { h: 'Что говорит Cochrane', p: ['Cochrane-обзор 2021 года (Schwendicke и соавт.) сравнил стратегии лечения кавитированных и дентинных кариозных поражений. Для большинства сравнений достоверность доказательств оценена как низкая или очень низкая из-за небольших выборок и риска смещения, поэтому выбор метода зависит от конкретного зуба и клинической ситуации.'] },
          { h: 'Больно ли и сколько стоит', p: ['Лечение проводится под местной анестезией, а при дискомфорте мы делаем паузу. Стоимость начинается от 7 000 ₽ и зависит от количества поверхностей и сложности случая; точная цена называется после осмотра.'] },
        ],
        keywords: ['лечение кариеса', 'минимально инвазивное лечение', 'пломба', 'кариес зубов', 'стоматолог терапевт СПб'],
      },
      fa: {
        title: 'درمان پوسیدگی: رویکرد محافظه‌کارانه چگونه کار می‌کند',
        description: 'درمان پوسیدگی چگونه انجام می‌شود، رویکرد کم‌تهاجمی یعنی چه و مرور Cochrane و داده‌های بالینی درباره‌ی روش‌های برداشتن بافت آسیب‌دیده چه می‌گویند.',
        lead: 'پوسیدگی از دست رفتن تدریجی مواد معدنی مینا و عاج است. هرچه زودتر دیده شود، کمتر باید برداشت.',
        key: [
          'پوسیدگی زیر تأثیر اسیدهایی ایجاد می‌شود که باکتری‌های پلاک دندان تولید می‌کنند.',
          'درمان کم‌تهاجمی تا جای ممکن بافت سالم دندان را حفظ می‌کند.',
          'در حفره‌های عمیق، برداشتن انتخابی عاج آسیب‌دیده در ۱٫۵ سال اول کمتر به باز شدن پالپ می‌انجامد؛ در ۵ سال نتیجه با برداشتن غیرانتخابی قابل مقایسه است.',
        ],
        sections: [
          { h: 'پوسیدگی چگونه پیش می‌رود', p: ['باکتری‌های پلاک قندها را به اسید تبدیل می‌کنند و اسید مواد معدنی مینا را حل می‌کند. در مرحله‌ی اولیه این روند برگشت‌پذیر است: بهداشت، مواد فلوراید‌دار و کنترل قند کمک می‌کنند. اگر حفره تشکیل شده باشد، ترمیم لازم است.'] },
          { h: 'مراحل درمان', p: ['معاینه و انتخاب روش. ایزوله کردن دندان با رابردم. برداشتن بافت آسیب‌دیده و آماده‌سازی حفره. بازسازی شکل دندان با مواد چسبنده‌ی مدرن. پولیش برای زیبایی و ماندگاری.'] },
          { h: '«محافظه‌کارانه» یعنی چه', p: ['هدف این است که فقط بافتِ واقعاً آسیب‌دیده برداشته شود و بافت سالم بماند. در حفره‌ی عمیق، برداشتن کامل عاج نرم‌شده ممکن است پالپ را باز کند. مرور سیستماتیکی که در Evidence-Based Dentistry (Fraser و MacInnes، ۲۰۲۴) بررسی شده نشان می‌دهد: برداشتن انتخابی در کوتاه‌مدت (حدود ۱٫۵ سال) بهترین گزینه است، عمدتاً به‌دلیل خطر کمتر باز شدن پالپ؛ در ۵ سال نتایج با برداشتن غیرانتخابی تفاوتی نداشت.'] },
          { h: 'Cochrane چه می‌گوید', p: ['مرور Cochrane در سال ۲۰۲۱ (Schwendicke و همکاران) راهبردهای درمان ضایعات پوسیدگی حفره‌دار و عاجی را مقایسه کرد. برای بیشتر مقایسه‌ها اطمینان شواهد به‌دلیل کوچک بودن نمونه‌ها و خطر سوگیری پایین یا بسیار پایین ارزیابی شد؛ بنابراین انتخاب روش به دندان و وضعیت بالینی بستگی دارد.'] },
          { h: 'درد و هزینه', p: ['درمان با بی‌حسی موضعی انجام می‌شود و اگر ناراحت بودید مکث می‌کنیم. هزینه از ۷٬۰۰۰ روبل شروع می‌شود و به تعداد سطوح و پیچیدگی بستگی دارد؛ مبلغ دقیق پس از معاینه گفته می‌شود.'] },
        ],
        keywords: ['درمان پوسیدگی', 'درمان کم‌تهاجمی', 'ترمیم دندان', 'پوسیدگی دندان', 'دندانپزشک ترمیمی سن‌پترزبورگ'],
      },
      en: {
        title: 'Cavity treatment: how a gentle approach works',
        description: 'How cavity treatment goes, what minimally invasive means, and what a Cochrane review and clinical data say about ways to remove decayed tissue.',
        lead: 'Tooth decay is a gradual loss of minerals from enamel and dentine. The earlier it is noticed, the less has to be removed.',
        key: [
          'Decay develops under the action of acids produced by bacteria in plaque.',
          'Minimally invasive treatment keeps as much of the natural tooth as possible.',
          'In deep cavities, selective removal of decayed dentine is less likely to expose the pulp in the first 1.5 years; by 5 years results are similar to non-selective removal.',
        ],
        sections: [
          { h: 'How decay develops', p: ['Plaque bacteria turn sugars into acids, and the acids dissolve enamel minerals. At an early stage the process is reversible: hygiene, fluoride products and sugar control help. Once a cavity has formed, a filling is needed.'] },
          { h: 'Treatment steps', p: ['Examination and choice of approach. Isolating the tooth with a rubber dam. Removing decayed tissue and preparing the cavity. Rebuilding the tooth with modern adhesive materials. Polishing for aesthetics and durability.'] },
          { h: 'What “gentle” means', p: ['The aim is to remove only what is truly affected and to keep healthy tissue. In a deep cavity, removing all softened dentine can expose the pulp. A systematic review discussed in Evidence-Based Dentistry (Fraser, MacInnes, 2024) found that selective removal is the best option in the short term (about 1.5 years), mainly because of the lower risk of pulp exposure; at 5 years results were similar to non-selective removal.'] },
          { h: 'What Cochrane says', p: ['A 2021 Cochrane review (Schwendicke et al.) compared strategies for treating cavitated or dentine carious lesions. For most comparisons the certainty of evidence was rated low or very low because of small samples and risk of bias, so the choice of method depends on the particular tooth and clinical situation.'] },
          { h: 'Does it hurt, and what does it cost', p: ['Treatment is done under local anesthesia, and we pause if you feel discomfort. The cost starts from 7,000 RUB and depends on the number of surfaces and complexity; the exact price is given after the examination.'] },
        ],
        keywords: ['cavity treatment', 'minimally invasive dentistry', 'dental filling', 'tooth decay', 'dentist St. Petersburg'],
      },
    },
  },
  /* ------------------------------------------------------------------ whitening */
  {
    slug: 'teeth-whitening', iso: '2026-10-31', minutes: 4, refs: [eachempati],
    text: {
      ru: {
        title: 'Отбеливание зубов: что важно знать до процедуры',
        description: 'Кому подходит отбеливание, какие бывают побочные эффекты и что показывает Cochrane-обзор об эффективности домашних систем.',
        lead: 'Отбеливание меняет цвет собственных тканей зуба, но не заменяет лечение: сначала: осмотр.',
        key: [
          'Перед отбеливанием нужен осмотр: кариес и воспаление дёсен лечат заранее.',
          'Самые частые побочные эффекты: чувствительность зубов и раздражение слизистой; в обзорах они в основном лёгкие и временные.',
          'Пломбы, виниры и коронки не отбеливаются, поэтому их цвет после процедуры может отличаться от цвета зубов.',
        ],
        sections: [
          { h: 'Как это работает', p: ['Отбеливающие средства на основе перекиси (водорода или карбамида) окисляют пигмент внутри эмали и дентина. Результат зависит от исходного цвета зубов, концентрации средства и протокола.'] },
          { h: 'Нужна ли подготовка', p: ['Отбеливание подходит не всем: у него есть противопоказания. Обычно перед процедурой лечат кариес и воспаление дёсен, а за 1–2 недели рекомендуют профессиональную гигиену, чтобы убрать налёт и камень и получить ровный результат. Окончательное решение принимает врач на осмотре.'] },
          { h: 'Что показывают исследования', p: ['Cochrane-обзор 2018 года (Eachempati и соавт.) оценил домашние отбеливающие системы у взрослых: 71 исследование. По сравнению с плацебо средства отбеливали зубы на коротких сроках (от 2 недель до 6 месяцев), но достоверность доказательств низкая или очень низкая; сделать вывод, какой состав, концентрация или режим лучше, нельзя. Самые частые побочные эффекты: чувствительность зубов и раздражение слизистой, чаще при более высоких концентрациях, но лёгкие и временные.'] },
          { h: 'Что учесть', p: ['Результат индивидуален. Пломбы, виниры и коронки при отбеливании не меняют цвет, поэтому, если они есть в зоне улыбки, план согласуют заранее. Стоимость отбеливания: 20 000 ₽.'] },
        ],
        keywords: ['отбеливание зубов', 'безопасное отбеливание', 'чувствительность зубов', 'отбеливание СПб', 'стоматолог'],
      },
      fa: {
        title: 'سفید کردن دندان: آنچه پیش از شروع باید بدانید',
        description: 'سفید کردن دندان برای چه کسانی مناسب است، چه عوارضی دارد و مرور Cochrane درباره‌ی اثربخشی روش‌های خانگی چه می‌گوید.',
        lead: 'سفید کردن، رنگ بافت خود دندان را تغییر می‌دهد، اما جای درمان را نمی‌گیرد: اول معاینه.',
        key: [
          'پیش از سفید کردن معاینه لازم است: پوسیدگی و التهاب لثه از قبل درمان می‌شوند.',
          'شایع‌ترین عوارض حساسیت دندان و تحریک مخاط است؛ در مرورها بیشتر خفیف و گذرا بوده‌اند.',
          'ترمیم‌ها، ونیرها و روکش‌ها سفید نمی‌شوند؛ پس رنگ آن‌ها بعد از کار ممکن است با دندان‌ها فرق کند.',
        ],
        sections: [
          { h: 'چگونه عمل می‌کند', p: ['مواد سفیدکننده‌ی پایه‌ی پراکسید (هیدروژن یا کاربامید) رنگدانه را درون مینا و عاج اکسید می‌کنند. نتیجه به رنگ اولیه‌ی دندان، غلظت ماده و پروتکل بستگی دارد.'] },
          { h: 'آیا آماده‌سازی لازم است', p: ['سفید کردن برای همه مناسب نیست و موارد منع دارد. معمولاً پیش از آن پوسیدگی و التهاب لثه درمان می‌شود و یک تا دو هفته قبل جرم‌گیری حرفه‌ای پیشنهاد می‌شود تا پلاک و جرم برداشته شود و نتیجه یکنواخت باشد. تصمیم نهایی با دندانپزشک در معاینه است.'] },
          { h: 'پژوهش‌ها چه می‌گویند', p: ['مرور Cochrane در سال ۲۰۱۸ (Eachempati و همکاران) سیستم‌های سفیدکننده‌ی خانگی را در بزرگسالان بررسی کرد: ۷۱ مطالعه. در مقایسه با دارونما، این مواد در کوتاه‌مدت (۲ هفته تا ۶ ماه) دندان را سفیدتر کردند، اما اطمینان شواهد پایین یا بسیار پایین است؛ نمی‌توان گفت کدام ترکیب، غلظت یا برنامه بهتر است. شایع‌ترین عوارض حساسیت دندان و تحریک مخاط بود که در غلظت‌های بالاتر بیشتر دیده شد، اما خفیف و گذرا بود.'] },
          { h: 'نکاتی که باید در نظر گرفت', p: ['نتیجه برای هر فرد متفاوت است. ترمیم‌ها، ونیرها و روکش‌ها با سفید کردن تغییر رنگ نمی‌دهند؛ پس اگر در ناحیه‌ی لبخند باشند، برنامه از قبل هماهنگ می‌شود. هزینه‌ی سفید کردن ۲۰٬۰۰۰ روبل است.'] },
        ],
        keywords: ['سفید کردن دندان', 'بلیچینگ دندان', 'حساسیت دندان', 'دندانپزشک سن‌پترزبورگ', 'مراقبت از دندان'],
      },
      en: {
        title: 'Teeth whitening: what to know before the procedure',
        description: 'Who whitening suits, what side effects there are and what a Cochrane review shows about home-based systems.',
        lead: 'Whitening changes the colour of the tooth’s own tissue, but it does not replace treatment: an examination comes first.',
        key: [
          'An examination is needed first: cavities and gum inflammation are treated beforehand.',
          'The most common side effects are tooth sensitivity and mucosal irritation; in reviews they were mostly mild and temporary.',
          'Fillings, veneers and crowns do not whiten, so their colour after the procedure may differ from the teeth.',
        ],
        sections: [
          { h: 'How it works', p: ['Whitening products based on peroxide (hydrogen or carbamide) oxidise pigment inside enamel and dentine. The result depends on the starting colour, the product concentration and the protocol.'] },
          { h: 'Is preparation needed', p: ['Whitening is not for everyone: it has contraindications. Cavities and gum inflammation are usually treated first, and professional hygiene 1–2 weeks before removes plaque and tartar for an even result. The dentist makes the final decision at the examination.'] },
          { h: 'What the research says', p: ['A 2018 Cochrane review (Eachempati et al.) assessed home-based whitening systems in adults: 71 trials. Compared with placebo, the products whitened teeth over short periods (2 weeks to 6 months), but the certainty of evidence is low or very low; no conclusion can be drawn about which composition, concentration or schedule is best. The most common side effects were tooth sensitivity and mucosal irritation, more frequent at higher concentrations, but mild and temporary.'] },
          { h: 'What to keep in mind', p: ['Results are individual. Fillings, veneers and crowns do not change colour with whitening, so if they are in the smile zone the plan is agreed in advance. Whitening costs 20,000 RUB.'] },
        ],
        keywords: ['teeth whitening', 'safe whitening', 'tooth sensitivity', 'whitening St. Petersburg', 'dentist'],
      },
    },
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
