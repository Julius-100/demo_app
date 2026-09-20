import { NutritionTopic } from '../types';

export const NUTRITION_TOPICS: NutritionTopic[] = [
  {
    id: 'protein',
    title: 'Protein',
    category: 'nutrient',
    shortExplanation: 'Essential macronutrient that serves as the building blocks for baby’s cells, organs, placenta, and expanding maternal tissue.',
    whyItMatters: 'During the second and third trimesters, maternal protein requirements increase by approximately 25 grams per day to support fetal tissue synthesis and increased maternal blood volume.',
    foodSources: [
      'Pasteurized eggs (well cooked)',
      'Cooked poultry (chicken, turkey)',
      'Lean beef and pork',
      'Low-mercury fish (salmon, canned light tuna, tilapia, cod)',
      'Lentils, chickpeas, black beans, edamame',
      'Pasteurized Greek yogurt, cottage cheese, milk',
      'Tofu, tempeh, seeds (chia, pumpkin, hemp), nuts',
    ],
    safetyNotes: 'Ensure all poultry, meats, and eggs are thoroughly cooked to safe internal temperatures (minimum 165°F / 74°C for poultry). Avoid raw or undercooked varieties.',
    citations: [
      {
        source: 'American College of Obstetricians and Gynecologists (ACOG)',
        reviewedDate: 'Updated 2024',
        urlOrDoc: 'ACOG Practice Advisory: Nutrition During Pregnancy',
      },
      {
        source: 'World Health Organization (WHO)',
        reviewedDate: 'Guidelines on Antenatal Care',
        urlOrDoc: 'WHO Recommendations on Maternal Nutrition',
      },
    ],
  },
  {
    id: 'folate',
    title: 'Folate & Folic Acid',
    category: 'nutrient',
    shortExplanation: 'A vital B-vitamin (B9) necessary for rapid cell division, DNA synthesis, and neural tube closure.',
    whyItMatters: 'Adequate folate before conception and during the first 12 weeks of pregnancy significantly reduces the risk of neural tube defects (such as spina bifida and anencephaly).',
    foodSources: [
      'Dark green leafy vegetables (spinach, kale, collard greens)',
      'Steamed asparagus and broccoli',
      'Fortified whole-grain cereals and breads',
      'Legumes (lentils, kidney beans, black-eyed peas)',
      'Citrus fruits (oranges, grapefruits) and avocados',
    ],
    safetyNotes: 'Dietary folate comes from foods, while folic acid is the synthetic form commonly found in fortified foods and prenatal vitamins. Health agencies typically recommend 400–600 mcg of folic acid daily from supplements or fortified sources.',
    citations: [
      {
        source: 'Centers for Disease Control and Prevention (CDC)',
        reviewedDate: 'Updated 2024',
        urlOrDoc: 'Folic Acid Recommendations Before and During Pregnancy',
      },
      {
        source: 'NHS (National Health Service, UK)',
        reviewedDate: 'Reviewed 2023',
        urlOrDoc: 'Vitamins, Supplements and Nutrition in Pregnancy',
      },
    ],
  },
  {
    id: 'iron',
    title: 'Iron',
    category: 'nutrient',
    shortExplanation: 'Essential mineral used to produce hemoglobin, the protein in red blood cells that carries oxygen to your tissues and your baby.',
    whyItMatters: 'Maternal blood volume expands by 40–50% during pregnancy. Sufficient iron helps prevent maternal anemia, extreme fatigue, and supports fetal brain oxygenation.',
    foodSources: [
      'Lean red meats, poultry, and canned light tuna (heme iron — easily absorbed)',
      'Cooked spinach, Swiss chard, and beet greens (non-heme iron)',
      'Lentils, kidney beans, and fortified breakfast cereals',
      'Pumpkin seeds, quinoa, and dried apricots',
    ],
    safetyNotes: 'Pair non-heme plant iron with vitamin C (such as bell peppers or citrus) to boost absorption. Avoid taking iron supplements with calcium, tea, or coffee, as they inhibit iron uptake. Take only doses prescribed or advised by your healthcare provider.',
    citations: [
      {
        source: 'World Health Organization (WHO)',
        reviewedDate: '2023 Guidelines',
        urlOrDoc: 'Daily Iron and Folic Acid Supplementation in Pregnant Women',
      },
      {
        source: 'ACOG',
        reviewedDate: '2023 Clinical Consensus',
        urlOrDoc: 'Anemia in Pregnancy Clinical Guidelines',
      },
    ],
  },
  {
    id: 'calcium',
    title: 'Calcium',
    category: 'nutrient',
    shortExplanation: 'Crucial mineral required for developing your baby’s bones, teeth, heart rhythm, nerve transmission, and muscle function.',
    whyItMatters: 'If dietary calcium is insufficient, the growing baby will draw calcium from maternal bone reserves. Most pregnant women need approximately 1,000 mg daily.',
    foodSources: [
      'Pasteurized cow’s milk, kefir, and yogurt',
      'Pasteurized hard cheeses (cheddar, parmesan, Swiss)',
      'Fortified plant milks (almond, oat, soy) and fortified orange juice',
      'Calcium-set tofu and cooked bok choy, kale, and broccoli',
      'Canned sardines or salmon with soft bones',
    ],
    safetyNotes: 'Ensure all soft dairy products (feta, brie, camembert, queso fresco) clearly specify "Made with Pasteurized Milk" on the label to prevent listeriosis.',
    citations: [
      {
        source: 'National Institutes of Health (NIH) Office of Dietary Supplements',
        reviewedDate: 'Updated 2024',
        urlOrDoc: 'Calcium Dietary Fact Sheet for Health Professionals',
      },
      {
        source: 'ACOG',
        reviewedDate: 'FAQ001: Nutrition During Pregnancy',
        urlOrDoc: 'ACOG Patient Education',
      },
    ],
  },
  {
    id: 'vitamin_d',
    title: 'Vitamin D',
    category: 'nutrient',
    shortExplanation: 'Fat-soluble vitamin that works alongside calcium to build strong bones and teeth, and supports healthy immune regulation.',
    whyItMatters: 'Vitamin D deficiency is common and can affect maternal bone density and infant skeletal calcification.',
    foodSources: [
      'Fortified cow’s milk and fortified plant alternatives',
      'Fatty fish (salmon, sardines, trout)',
      'Egg yolks from pasteurized eggs',
      'Fortified cereals and pure sunlight exposure (in moderation)',
    ],
    safetyNotes: 'High-dose single-vitamin megadoses should be avoided unless specifically prescribed and monitored by your healthcare provider.',
    citations: [
      {
        source: 'ACOG',
        reviewedDate: 'Committee Opinion No. 495',
        urlOrDoc: 'Vitamin D: Screening and Supplementation During Pregnancy',
      },
    ],
  },
  {
    id: 'omega3',
    title: 'Omega-3 Fatty Acids (DHA & EPA)',
    category: 'nutrient',
    shortExplanation: 'Essential polyunsaturated fats, especially Docosahexaenoic Acid (DHA), which forms key structural components of the fetal brain and retina.',
    whyItMatters: 'The fetal brain undergoes rapid neurological growth during the second and third trimesters, requiring steady maternal supply of DHA.',
    foodSources: [
      'Low-mercury cooked fish (wild salmon, sardines, rainbow trout, Atlantic mackerel)',
      'Ground flaxseeds and chia seeds (ALA form)',
      'Walnuts and pasteurized DHA-enriched eggs',
      'Algae-based DHA oils (great plant-based option)',
    ],
    safetyNotes: 'Choose fish categorized by the FDA/EPA as "Best Choices" low in environmental mercury. Avoid predatory fish such as shark, swordfish, king mackerel, and tilefish.',
    citations: [
      {
        source: 'U.S. FDA & EPA Joint Guidance',
        reviewedDate: 'Advice About Eating Fish: For Those Who Might Become or Are Pregnant',
        urlOrDoc: 'FDA Fish Advice 2023',
      },
    ],
  },
  {
    id: 'fiber',
    title: 'Dietary Fiber',
    category: 'nutrient',
    shortExplanation: 'Indigestible plant carbohydrates that regulate digestion, steady blood sugar, and promote a healthy gut microbiome.',
    whyItMatters: 'Pregnancy hormones slow bowel motility, and prenatal iron can exacerbate constipation. Fiber (both soluble and insoluble) prevents constipation and reduces hemorrhoid risk.',
    foodSources: [
      'Whole oats, barley, quinoa, and brown rice',
      'Apples, pears (with skin washed), berries, and prunes',
      'Legumes (beans, split peas, chickpeas)',
      'Cruciferous and leafy vegetables',
    ],
    safetyNotes: 'Increase fiber intake gradually and drink plenty of water alongside to prevent gas, bloating, or worsening constipation.',
    citations: [
      {
        source: 'NHS',
        reviewedDate: 'Reviewed 2023',
        urlOrDoc: 'Healthy Diet in Pregnancy Guide',
      },
    ],
  },
  {
    id: 'hydration',
    title: 'Hydration & Fluids',
    category: 'nutrient',
    shortExplanation: 'Water forms the basis of amniotic fluid, aids increased maternal plasma circulation, delivers nutrients, and flushes renal waste.',
    whyItMatters: 'Mild dehydration can trigger Braxton Hicks uterine contractions, dizziness, headaches, and worsen constipation.',
    foodSources: [
      'Plain filtered water',
      'Water infused with fresh cucumber, mint, or lemon slices',
      'Broths and vegetable soups',
      'Cucumbers, watermelon, celery, and oranges',
      'Pasteurized milk or fortified plant milk',
    ],
    safetyNotes: 'Avoid unpasteurized juices or ciders. Limit sweetened sodas and high-caffeine energy drinks. Check herbal teas with your doctor (some herbs like pennyroyal, blue cohosh, or excess licorice are contraindicated).',
    citations: [
      {
        source: 'ACOG',
        reviewedDate: 'Nutrition and Hydration During Pregnancy',
        urlOrDoc: 'ACOG Patient Clinical FAQs',
      },
    ],
  },
  {
    id: 'food_safety_core',
    title: 'Food Safety & Hygiene',
    category: 'food_safety',
    shortExplanation: 'Maternal immune adaptation during pregnancy makes both mother and baby more vulnerable to foodborne microorganisms such as Listeria, Salmonella, and Toxoplasma.',
    whyItMatters: 'Foodborne infections can cross the placenta, leading to serious fetal complications, premature delivery, or miscarriage even if maternal symptoms feel mild.',
    foodSources: [
      'Wash all fruits and raw vegetables vigorously under clean running water',
      'Use separate cutting boards for raw meats and ready-to-eat produce',
      'Cook foods to safe internal temperatures: poultry to 165°F (74°C), ground meats to 160°F (71°C)',
      'Refrigerate perishable leftovers within 2 hours at or below 40°F (4°C)',
      'Reheat refrigerated leftovers until steaming hot (165°F / 74°C)',
    ],
    safetyNotes: 'Always wash hands with warm soapy water for 20 seconds before food prep and after handling raw meats, pets, or soil (gardening).',
    citations: [
      {
        source: 'CDC (Centers for Disease Control and Prevention)',
        reviewedDate: 'Foods to Avoid or Prepare with Care in Pregnancy (2024)',
        urlOrDoc: 'CDC Food Safety for Pregnant Women',
      },
      {
        source: 'FDA (Food and Drug Administration)',
        reviewedDate: 'Food Safety for Moms-to-Be',
        urlOrDoc: 'FDA Maternal Safety Guidelines',
      },
    ],
  },
  {
    id: 'foods_to_avoid',
    title: 'Foods & Beverages to Limit or Avoid',
    category: 'foods_to_limit',
    shortExplanation: 'Certain foods carry disproportionate risks of chemical contaminants (mercury) or bacterial contamination (Listeria, Salmonella, Toxoplasma).',
    whyItMatters: 'Preventing ingestion of these items is one of the most effective ways to protect the pregnancy from preventable infections.',
    foodSources: [
      '❌ Unpasteurized milk, cheese, juices, or ciders (check labels for "Pasteurized")',
      '❌ Raw or undercooked meat, poultry, or seafood (e.g., sushi with raw fish, rare steak, carpaccio)',
      '❌ High-mercury fish: Shark, Swordfish, King Mackerel, Bigeye Tuna, Tilefish, Marlin',
      '❌ Deli meats, hot dogs, and dry fermented sausages (unless reheated until steaming hot to 165°F)',
      '❌ Raw or runny eggs (unpasteurized eggnog, homemade hollandaise, cookie dough)',
      '❌ Raw sprouts (alfalfa, clover, radish, mung bean) due to bacterial contamination risk inside seeds',
      '❌ Alcohol: No known safe level of alcohol consumption has been established in pregnancy',
      '⚠️ Caffeine: Moderate intake to no more than 200 mg/day (approx. one 12 oz mug of coffee)',
    ],
    safetyNotes: 'When dining out, request meats well-done, ask if dressings use pasteurized eggs, and choose freshly cooked, piping-hot dishes.',
    citations: [
      {
        source: 'ACOG',
        reviewedDate: 'Practice Advisory: Nutrition and Food Safety in Pregnancy',
        urlOrDoc: 'ACOG Food Safety Guidelines',
      },
      {
        source: 'CDC',
        reviewedDate: 'Listeria and Pregnancy Prevention Guide 2024',
        urlOrDoc: 'CDC Listeria Guidance',
      },
    ],
  },
];

export const DAILY_WELLNESS_MESSAGES = [
  "Remember to stay hydrated and include a variety of nutrient-rich foods throughout the day.",
  "Small, frequent meals can help maintain steady energy levels and ease digestive comfort.",
  "Gentle daily movement, such as walking or prenatal stretching, can support circulation and relaxation.",
  "Rest when your body asks for it—growing a human uses significant physical and metabolic energy.",
  "Pairing plant-based iron sources with citrus or vitamin C helps your body absorb the iron more efficiently.",
  "Sipping cool water with a slice of lemon or cucumber can make staying hydrated feel refreshing.",
  "Listen to your body’s signals and take comfortable posture breaks if you sit or stand for long periods.",
  "Take time for a few slow, calming breaths today. Your mental wellness is an integral part of pregnancy health.",
];
