import { Language } from '../types';

export interface TranslationDict {
  appName: string;
  tagline: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  selectLanguage: string;
  continueBtn: string;
  saveBtn: string;
  cancelBtn: string;
  closeBtn: string;
  backBtn: string;
  editBtn: string;
  submitBtn: string;
  refreshBtn: string;
  completedBtn: string;
  pendingBtn: string;
  viewAllBtn: string;
  markReviewedBtn: string;
  listenBtn: string;
  stopAudioBtn: string;
  readAloudBtn: string;

  // Nav
  navHome: string;
  navFarm: string;
  navAsk: string;
  navPlan: string;
  navMore: string;

  // Header
  onlineStatus: string;
  offlineStatus: string;
  textSizeTooltip: string;
  alertsTooltip: string;

  // Onboarding
  onboardingTitle: string;
  onboardingSubtitle: string;
  fieldFarmerName: string;
  fieldFarmerNamePlaceholder: string;
  fieldState: string;
  fieldDistrict: string;
  fieldVillage: string;
  fieldVillagePlaceholder: string;
  fieldFarmSize: string;
  fieldFarmSizeUnit: string;
  fieldCurrentCrop: string;
  fieldWaterSource: string;
  fieldSoilType: string;
  skipStep: string;
  stepIndicator: string;
  finishOnboarding: string;

  // Home Dashboard
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  weatherCardTitle: string;
  rainProbLabel: string;
  humidityLabel: string;
  tempLabel: string;
  currentCropTitle: string;
  stageLabel: string;
  plantedOnLabel: string;
  cropHealthCardTitle: string;
  cropHealthCardDesc: string;
  soilCardTitle: string;
  soilCardDesc: string;
  tasksCardTitle: string;
  noTasksToday: string;
  mandiCardTitle: string;
  modalPriceLabel: string;
  askBannerTitle: string;
  askBannerPlaceholder: string;
  askMicButton: string;
  askSendButton: string;

  // My Farm
  myFarmTitle: string;
  myFarmSubtitle: string;
  addPlotBtn: string;
  plotLabel: string;
  growthStageTitle: string;
  soilTestHistory: string;
  cropHealthHistory: string;
  activityHistory: string;
  noPlotsYet: string;

  // Weather Screen
  weatherScreenTitle: string;
  forecast7Days: string;
  sprayAdvisoryTitle: string;
  spraySafeMsg: string;
  sprayUnsafeMsg: string;
  irrigationCheckTitle: string;
  dataSourceLabel: string;
  liveWeatherBadge: string;
  demoWeatherBadge: string;

  // Crop Health Screen
  cropHealthTitle: string;
  cropHealthSubtitle: string;
  selectCropLabel: string;
  uploadLeafPhoto: string;
  cameraCapture: string;
  analyzingLeaf: string;
  diagnosedIssueTitle: string;
  confidenceScoreTitle: string;
  visualSymptomsTitle: string;
  contributingFactorsTitle: string;
  nextChecksTitle: string;
  culturalPreventionTitle: string;
  safetyWarningTitle: string;
  expertConsultAdvised: string;
  takeAnotherPhoto: string;
  sampleLeavesLabel: string;

  // Crop Planning Screen
  cropPlanningTitle: string;
  cropPlanningSubtitle: string;
  selectSeason: string;
  seasonKharif: string;
  seasonRabi: string;
  seasonSummer: string;
  soilTypeLabel: string;
  waterAvailabilityLabel: string;
  findSuitableCropsBtn: string;
  suitableCropsTitle: string;
  cropDurationLabel: string;
  waterRequirementLabel: string;
  keyRisksLabel: string;
  marketOutlookLabel: string;
  riskDisclaimer: string;

  // Soil Screen
  soilScreenTitle: string;
  soilScreenSubtitle: string;
  soilPhLabel: string;
  nitrogenLabel: string;
  phosphorusLabel: string;
  potassiumLabel: string;
  organicCarbonLabel: string;
  evaluateSoilBtn: string;
  phMeaningTitle: string;
  nutrientGuidanceTitle: string;
  organicManureAdvice: string;
  soilHealthCardNotice: string;

  // Market Screen
  marketScreenTitle: string;
  marketScreenSubtitle: string;
  filterByCrop: string;
  filterByState: string;
  filterByDistrict: string;
  minPriceLabel: string;
  maxPriceLabel: string;
  observedOnLabel: string;
  arrivalsLabel: string;
  mandiSourceNotice: string;
  noMarketData: string;

  // Farm Plan Screen
  farmPlanTitle: string;
  farmPlanSubtitle: string;
  stageBeforePlanting: string;
  stageEarlyGrowth: string;
  stageDevelopment: string;
  stageFlowering: string;
  stageProtection: string;
  stageHarvestPrep: string;
  stageAfterHarvest: string;
  allStages: string;
  markDone: string;
  reschedule: string;
  addObservation: string;
  reminderNotice: string;

  // Ask AI Screen
  askAiTitle: string;
  askAiSubtitle: string;
  listeningNow: string;
  speakNowPrompt: string;
  tapToSpeak: string;
  sampleQuestionsTitle: string;
  sampleQ1: string;
  sampleQ2: string;
  sampleQ3: string;
  sampleQ4: string;
  masterAgentOrchestrating: string;
  agentsActiveBadge: string;
  sec1Understood: string;
  sec2InfoShows: string;
  sec3NextSteps: string;
  sec4WhyMatters: string;
  sec5Caution: string;

  // Settings & More
  settingsTitle: string;
  farmerProfileSection: string;
  languageSection: string;
  textSizeSection: string;
  voiceReadoutSection: string;
  voiceReadoutDesc: string;
  offlineSupportSection: string;
  offlineSupportDesc: string;
  privacySection: string;
  privacyDesc: string;
  deleteDataBtn: string;
  helplineTitle: string;
  kisanCallCentre: string;
  aboutTitle: string;
  aboutText: string;
}

export const translations: Record<Language, TranslationDict> = {
  // ================= TELUGU (తెలుగు) =================
  te: {
    appName: "క్షేత్రమైండ్ AI",
    tagline: "ఒకే పొలం. అనుసంధానిత జ్ఞానం.",
    welcomeTitle: "నమస్కారం రైతు సోదరులారా",
    welcomeSubtitle: "మీ పొలానికి సంబంధించిన వాతావరణం, పంట రక్షణ, నేల ఆరోగ్యం మరియు మార్కెట్ ధరల సమాహారం.",
    selectLanguage: "మీ అనుకూల భాషను ఎంచుకోండి",
    continueBtn: "ముందుకు సాగండి",
    saveBtn: "భద్రపరచండి",
    cancelBtn: "రద్దు చేయండి",
    closeBtn: "మూసివేయండి",
    backBtn: "వెనుకకు",
    editBtn: "సవరించండి",
    submitBtn: "సమర్పించండి",
    refreshBtn: "తాజాకరించండి",
    completedBtn: "పూర్తయింది",
    pendingBtn: "పెండింగ్",
    viewAllBtn: "అన్నీ చూడండి",
    markReviewedBtn: "చూశాను",
    listenBtn: "వినండి",
    stopAudioBtn: "ఆపండి",
    readAloudBtn: "చదివి వినిపించండి",

    navHome: "హోమ్",
    navFarm: "నా పొలం",
    navAsk: "AI ని అడగండి",
    navPlan: "పంట ప్రణాళిక",
    navMore: "మరిన్ని",

    onlineStatus: "ఆన్‌లైన్ అనుసంధానంలో ఉంది",
    offlineStatus: "ఆఫ్‌లైన్ మోడ్ (సేవ్ చేసిన సమాచారం)",
    textSizeTooltip: "అక్షరాల పరిమాణం మార్చండి",
    alertsTooltip: "పొలం హెచ్చరికలు",

    onboardingTitle: "రైతు వివరాల నమోదు",
    onboardingSubtitle: "మీ పొలానికి సరైన సలహాలు అందించడానికి ఈ ప్రాథమిక వివరాలు ఇవ్వండి.",
    fieldFarmerName: "రైతు పేరు",
    fieldFarmerNamePlaceholder: "ఉదా: రమేష్ రావు",
    fieldState: "రాష్ట్రం",
    fieldDistrict: "జిల్లా",
    fieldVillage: "గ్రామం / మండలం",
    fieldVillagePlaceholder: "ఉదా: నర్సంపేట",
    fieldFarmSize: "పొలం విస్తీర్ణం",
    fieldFarmSizeUnit: "కొలత ప్రమాణం",
    fieldCurrentCrop: "ప్రస్తుత పంట",
    fieldWaterSource: "నీటి వనరు",
    fieldSoilType: "నేల రకం",
    skipStep: "తెలియదు / దాటవేయండి",
    stepIndicator: "దశ",
    finishOnboarding: "వివరాలు పూర్తి చేయండి",

    greetingMorning: "శుభోదయం",
    greetingAfternoon: "శుభ మధ్యాహ్నం",
    greetingEvening: "శుభ సాయంత్రం",
    weatherCardTitle: "నేటి వాతావరణం",
    rainProbLabel: "వర్ష సంభావ్యత",
    humidityLabel: "గాలిలో తేమ",
    tempLabel: "ఉష్ణోగ్రత",
    currentCropTitle: "నా ప్రస్తుత పంట",
    stageLabel: "పంట దశ",
    plantedOnLabel: "నాటిన తేదీ",
    cropHealthCardTitle: "ఆకు తెగుళ్ల తనిఖీ",
    cropHealthCardDesc: "ఆకు ఫోటో తీసి తెగులును సులభంగా గుర్తించండి.",
    soilCardTitle: "నేల & ఎరువుల మార్గదర్శి",
    soilCardDesc: "నేల పరీక్ష ఆధారంగా సమతుల్య పోషకాలు.",
    tasksCardTitle: "నేటి వ్యవసాయ పనులు",
    noTasksToday: "నేటికి ఏ పనులూ పెండింగ్‌లో లేవు. మంచిది!",
    mandiCardTitle: "సమీప మార్కెట్ ధరలు (మండి)",
    modalPriceLabel: "సగటు ధర",
    askBannerTitle: "క్షేత్రమైండ్ AI ని నేరుగా అడగండి",
    askBannerPlaceholder: "వర్షం పడుతుందా? నా మిరప ఆకులకు ఏమైంది?...",
    askMicButton: "మాట్లాడండి",
    askSendButton: "పంపండి",

    myFarmTitle: "నా పొలం వివరాలు",
    myFarmSubtitle: "మీ అన్ని మడులు, పంటలు మరియు కార్యకలాపాల సమగ్ర సమాచారం.",
    addPlotBtn: "+ కొత్త చేను జోడించండి",
    plotLabel: "చేను / మడి",
    growthStageTitle: "పంట పెరుగుదల ప్రయాణం",
    soilTestHistory: "నేల పరీక్ష నివేదికలు",
    cropHealthHistory: "గత ఆరోగ్య పరిశీలనలు",
    activityHistory: "పూర్తయిన పనుల చరిత్ర",
    noPlotsYet: "ఇంకా చేను వివరాలు నమోదు చేయలేదు.",

    weatherScreenTitle: "వాతావరణ సమాచారం & సలహాలు",
    forecast7Days: "రాబోయే 7 రోజుల వాతావరణ అంచనా",
    sprayAdvisoryTitle: "మందుల పిచికారీ సూచన",
    spraySafeMsg: "వర్ష సూచన తక్కువగా ఉంది. నేడు పిచికారీ చేయడానికి అనుకూలం.",
    sprayUnsafeMsg: "రాబోయే 24 గంటల్లో వర్షం కురిసే అవకాశం ఉంది. మందుల పిచికారీని వాయిదా వేయండి.",
    irrigationCheckTitle: "నీటి తడుల నిర్వహణ",
    dataSourceLabel: "డేటా వనరు",
    liveWeatherBadge: "ప్రత్యక్ష వాతావరణం (Live)",
    demoWeatherBadge: "నమూనా వాతావరణం (Demo)",

    cropHealthTitle: "పంట ఆరోగ్య నిపుణుడు",
    cropHealthSubtitle: "బాధిత ఆకు ఫోటో తీయండి — లక్షణాలు మరియు నివారణ పద్ధతులు తెలుసుకోండి.",
    selectCropLabel: "పంటను ఎంచుకోండి",
    uploadLeafPhoto: "ఆకు ఫోటోను అప్‌లోడ్ చేయండి",
    cameraCapture: "కెమెరాతో ఫోటో తీయండి",
    analyzingLeaf: "ఆకు లక్షణాలను విశ్లేషిస్తోంది...",
    diagnosedIssueTitle: "గుర్తించిన తెగులు / సమస్య",
    confidenceScoreTitle: "నిర్ధారణ విశ్వసనీయత",
    visualSymptomsTitle: "ప్రధాన కనిపించే లక్షణాలు",
    contributingFactorsTitle: "తెగులు రావడానికి కారణాలు",
    nextChecksTitle: "మీరు తనిఖీ చేయవలసిన అంశాలు",
    culturalPreventionTitle: "సహజ నివారణ పద్ధతులు",
    safetyWarningTitle: "ముఖ్యమైన రక్షణ జాగ్రత్త",
    expertConsultAdvised: "తీవ్రత ఎక్కువగా ఉంటే స్థానిక వ్యవసాయ విస్తరణ అధికారి (KVK) ని సంప్రదించండి.",
    takeAnotherPhoto: "మరొక ఫోటో తీయండి",
    sampleLeavesLabel: "నమూనా ఆకులతో పరీక్షించండి",

    cropPlanningTitle: "పంట ప్రణాళిక సహాయకుడు",
    cropPlanningSubtitle: "మీ నేల, నీటి వసతి మరియు కాలానికి తగిన పంటలను ఎంపిక చేసుకోండి.",
    selectSeason: "సాగు కాలం",
    seasonKharif: "ఖరీఫ్ (వానకాలం)",
    seasonRabi: "రబీ (యాసంగి)",
    seasonSummer: "జైద్ (వేసవి కాలం)",
    soilTypeLabel: "భూమి రకం",
    waterAvailabilityLabel: "నీటి లభ్యత",
    findSuitableCropsBtn: "అనుకూల పంటలను చూడండి",
    suitableCropsTitle: "మీ పొలానికి అనుకూలమైన పంటలు",
    cropDurationLabel: "పంట కాలపరిమితి",
    waterRequirementLabel: "నీటి అవసరం",
    keyRisksLabel: "ప్రధాన నష్టభయాలు & జాగ్రత్తలు",
    marketOutlookLabel: "మార్కెట్ గిరాకీ అంచనా",
    riskDisclaimer: "గమనిక: పంట దిగుబడి వాతావరణ పరిస్థితులు మరియు సరైన సస్యరక్షణపై ఆధారపడి ఉంటుంది. ఎటువంటి లాభ హామీలు ఇవ్వబడవు.",

    soilScreenTitle: "నేల పరీక్ష & పోషక మార్గదర్శి",
    soilScreenSubtitle: "మీ భూమి సారాన్ని సులభమైన తెలుగులో అర్థం చేసుకోండి.",
    soilPhLabel: "నేల pH విలువ",
    nitrogenLabel: "నత్రజని (Nitrogen - N)",
    phosphorusLabel: "భాస్వరం (Phosphorus - P)",
    potassiumLabel: "పొటాషియం (Potash - K)",
    organicCarbonLabel: "సేంద్రీయ కర్బనం (Organic Carbon %)",
    evaluateSoilBtn: "నేల ఆరోగ్యాన్ని విశ్లేషించండి",
    phMeaningTitle: "మీ నేల స్వభావం ఏమి చెబుతోంది?",
    nutrientGuidanceTitle: "సిఫార్సు చేయబడిన పోషక నిర్వహణ",
    organicManureAdvice: "పశువుల ఎరువు / సేంద్రీయ ఎరువుల వినియోగం",
    soilHealthCardNotice: "మీ అధికారిక సాయిల్ హెల్త్ కార్డు ఆధారంగా మోతాదులను నిర్ణయించండి.",

    marketScreenTitle: "మార్కెట్ ధరల సమాచారం (మండి)",
    marketScreenSubtitle: "అధికారిక Agmarknet వ్యవసాయ మార్కెట్ యార్డ్ ధరలు.",
    filterByCrop: "పంట",
    filterByState: "రాష్ట్రం",
    filterByDistrict: "జిల్లా / మండి",
    minPriceLabel: "కనిష్ట ధర",
    maxPriceLabel: "గరిష్ట ధర",
    observedOnLabel: "తేదీ",
    arrivalsLabel: "మొత్తం రాబడులు",
    mandiSourceNotice: "వనరు: Agmarknet, వ్యవసాయ మంత్రిత్వ శాఖ, భారత ప్రభుత్వం. నాణ్యతను బట్టి ధరలలో తేడాలు ఉండవచ్చు.",
    noMarketData: "ఈ ఎంపికకు సంబంధించి ధరల సమాచారం లభ్యం కాలేదు.",

    farmPlanTitle: "పంట దశల కార్యాచరణ ప్రణాళిక",
    farmPlanSubtitle: "విత్తనం నాటినప్పటి నుండి పంట కోత వరకు క్రమబద్ధమైన వ్యవసాయ పనులు.",
    stageBeforePlanting: "నాటడానికి ముందు",
    stageEarlyGrowth: "ప్రారంభ పెరుగుదల",
    stageDevelopment: "శాకీయ పెరుగుదల",
    stageFlowering: "పూత & కాయ దశ",
    stageProtection: "సస్యరక్షణ",
    stageHarvestPrep: "కోతకు సన్నద్ధత",
    stageAfterHarvest: "కోత తర్వాతి పనులు",
    allStages: "అన్ని దశలు",
    markDone: "పూర్తయినట్లు గుర్తించండి",
    reschedule: "తేదీ మార్చండి",
    addObservation: "గమనికలు చేర్చండి",
    reminderNotice: "పని సమయానికి గుర్తు చేయబడుతుంది.",

    askAiTitle: "క్షేత్రమైండ్ సహాయకుడు",
    askAiSubtitle: "మీ భాషలోనే మాట్లాడండి లేదా టైప్ చేయండి — మాస్టర్ ఏజెంట్ సరైన సలహాను సమకూరుస్తుంది.",
    listeningNow: "మీరు మాట్లాడేది వింటున్నాను...",
    speakNowPrompt: "ఇప్పుడు మీ ప్రశ్నను స్పష్టంగా చెప్పండి...",
    tapToSpeak: "మాట్లాడటానికి నొక్కండి",
    sampleQuestionsTitle: "ఈ విధమైన ప్రశ్నలు అడగవచ్చు:",
    sampleQ1: "నేడు వర్షం పడుతుందా?",
    sampleQ2: "మిరప ఆకులు ముడుచుకుపోతున్నాయి, ఏం చేయాలి?",
    sampleQ3: "ఈ రోజు వరంగల్ మార్కెట్లో మిరప ధర ఎంత?",
    sampleQ4: "నేడు పొలంలో ఏ పనులు తనిఖీ చేయాలి?",
    masterAgentOrchestrating: "మాస్టర్ ఏజెంట్ ప్రత్యేక ఏజెంట్లను సమన్వయం చేస్తోంది...",
    agentsActiveBadge: "క్రియాశీల ఏజెంట్లు",
    sec1Understood: "1. ఏమి అర్థమైంది",
    sec2InfoShows: "2. లభ్యమైన సమాచారం ఏమి చూపుతోంది",
    sec3NextSteps: "3. మీరు తదుపరి ఏమి చేయవచ్చు",
    sec4WhyMatters: "4. ఇది ఎందుకు ముఖ్యం",
    sec5Caution: "5. ముఖ్యమైన జాగ్రత్త",

    settingsTitle: "సెట్టింగులు & సహాయం",
    farmerProfileSection: "రైతు ప్రొఫైల్",
    languageSection: "భాష మార్పు",
    textSizeSection: "అక్షరాల పరిమాణం (Text Size)",
    voiceReadoutSection: "వాయిస్ రీడ్-అవుట్ (సమాధానాలు చదివి వినిపించు)",
    voiceReadoutDesc: "రైతుకు సహాయంగా స్క్రీన్ సమాధానాలను స్వరం ద్వారా వినిపిస్తుంది.",
    offlineSupportSection: "ఆఫ్‌లైన్ నిల్వ & సింక్",
    offlineSupportDesc: "నెట్‌వర్క్ లేకపోయినా మునుపటి సమాచారం మరియు పనులు అందుబాటులో ఉంటాయి.",
    privacySection: "డేటా గోప్యత",
    privacyDesc: "మీ పొలం మరియు వ్యక్తిగత డేటా ఎవరితోనూ పంచుకోబడదు.",
    deleteDataBtn: "పొలం డేటాను తొలగించండి",
    helplineTitle: "రైతు సహాయ కేంద్రం (Kisan Call Centre)",
    kisanCallCentre: "ఉచిత టోల్ ఫ్రీ నెంబర్: 1800-180-1551",
    aboutTitle: "క్షేత్రమైండ్ AI గురించి",
    aboutText: "చిన్న మరియు సన్నకారు రైతుల కోసం రూపొందించబడిన భారతీయ మల్టీ-ఏజెంట్ అగ్రికల్చర్ ప్లాట్‌ఫామ్."
  },

  // ================= ENGLISH =================
  en: {
    appName: "KshetraMind AI",
    tagline: "One Farm. Connected Intelligence.",
    welcomeTitle: "Welcome, Respected Farmer",
    welcomeSubtitle: "Connected intelligence for your weather, crop protection, soil health, and market prices.",
    selectLanguage: "Choose your preferred language",
    continueBtn: "Continue",
    saveBtn: "Save",
    cancelBtn: "Cancel",
    closeBtn: "Close",
    backBtn: "Back",
    editBtn: "Edit",
    submitBtn: "Submit",
    refreshBtn: "Refresh",
    completedBtn: "Completed",
    pendingBtn: "Pending",
    viewAllBtn: "View All",
    markReviewedBtn: "Reviewed",
    listenBtn: "Listen",
    stopAudioBtn: "Stop",
    readAloudBtn: "Read Aloud",

    navHome: "Home",
    navFarm: "My Farm",
    navAsk: "Ask AI",
    navPlan: "Farm Plan",
    navMore: "More",

    onlineStatus: "Connected Online",
    offlineStatus: "Offline Mode (Saved Data)",
    textSizeTooltip: "Adjust Text Size",
    alertsTooltip: "Farm Alerts",

    onboardingTitle: "Farmer Registration",
    onboardingSubtitle: "Help us personalize farming assistance for your field.",
    fieldFarmerName: "Farmer Name",
    fieldFarmerNamePlaceholder: "e.g. Ramesh Rao",
    fieldState: "State",
    fieldDistrict: "District",
    fieldVillage: "Village / Locality",
    fieldVillagePlaceholder: "e.g. Narsampet",
    fieldFarmSize: "Farm Size",
    fieldFarmSizeUnit: "Measurement Unit",
    fieldCurrentCrop: "Current Crop",
    fieldWaterSource: "Water Source",
    fieldSoilType: "Soil Type",
    skipStep: "Don't know / Skip",
    stepIndicator: "Step",
    finishOnboarding: "Finish Registration",

    greetingMorning: "Good Morning",
    greetingAfternoon: "Good Afternoon",
    greetingEvening: "Good Evening",
    weatherCardTitle: "Today's Weather",
    rainProbLabel: "Rain Probability",
    humidityLabel: "Humidity",
    tempLabel: "Temperature",
    currentCropTitle: "My Current Crop",
    stageLabel: "Growth Stage",
    plantedOnLabel: "Planting Date",
    cropHealthCardTitle: "Leaf Health Check",
    cropHealthCardDesc: "Take a photo of a leaf to check for visible pests or diseases.",
    soilCardTitle: "Soil & Nutrient Guidance",
    soilCardDesc: "Balanced fertilization based on your soil test parameters.",
    tasksCardTitle: "Today's Farm Tasks",
    noTasksToday: "No pending tasks for today. Well done!",
    mandiCardTitle: "Nearby Market Prices",
    modalPriceLabel: "Modal Price",
    askBannerTitle: "Ask KshetraMind AI",
    askBannerPlaceholder: "Will it rain today? What is happening to my crops?...",
    askMicButton: "Speak",
    askSendButton: "Send",

    myFarmTitle: "My Farm Profile",
    myFarmSubtitle: "Shared agricultural memory across all your plots and activities.",
    addPlotBtn: "+ Add New Plot",
    plotLabel: "Plot / Field",
    growthStageTitle: "Crop Growth Journey",
    soilTestHistory: "Soil Test Records",
    cropHealthHistory: "Previous Health Assessments",
    activityHistory: "Completed Activity History",
    noPlotsYet: "No plots added yet. Click above to add your first plot.",

    weatherScreenTitle: "Weather Agent & Advisories",
    forecast7Days: "Upcoming 7-Day Weather Forecast",
    sprayAdvisoryTitle: "Spray Window Advisory",
    spraySafeMsg: "Low rain probability today. Safe window for foliar spraying.",
    sprayUnsafeMsg: "Rain expected within 24 hours. Postpone chemical sprays to prevent wash-off.",
    irrigationCheckTitle: "Irrigation Scheduling",
    dataSourceLabel: "Data Source",
    liveWeatherBadge: "Live Weather (Connected)",
    demoWeatherBadge: "Sample Weather (Demonstration)",

    cropHealthTitle: "Crop Health Agent",
    cropHealthSubtitle: "Upload or capture a leaf photo for symptom diagnosis and cultural guidance.",
    selectCropLabel: "Select Crop",
    uploadLeafPhoto: "Upload Leaf Photo",
    cameraCapture: "Take Photo with Camera",
    analyzingLeaf: "Analyzing leaf visual features...",
    diagnosedIssueTitle: "Diagnosed Issue / Disease",
    confidenceScoreTitle: "Confidence Score",
    visualSymptomsTitle: "Primary Visual Symptoms",
    contributingFactorsTitle: "Contributing Environmental Factors",
    nextChecksTitle: "What You Should Inspect Next",
    culturalPreventionTitle: "Cultural & Preventive Measures",
    safetyWarningTitle: "Agricultural Safety Warning",
    expertConsultAdvised: "Consult your local Krishi Vigyan Kendra (KVK) officer for high-risk issues.",
    takeAnotherPhoto: "Take Another Photo",
    sampleLeavesLabel: "Try with Sample Leaf Photos",

    cropPlanningTitle: "Crop Planning Agent",
    cropPlanningSubtitle: "Evaluate crop suitability against your location, season, soil, and water.",
    selectSeason: "Cropping Season",
    seasonKharif: "Kharif (Monsoon)",
    seasonRabi: "Rabi (Winter)",
    seasonSummer: "Zaid (Summer)",
    soilTypeLabel: "Soil Type",
    waterAvailabilityLabel: "Water Availability",
    findSuitableCropsBtn: "Find Suitable Crops",
    suitableCropsTitle: "Agronomically Suitable Crops",
    cropDurationLabel: "Crop Duration",
    waterRequirementLabel: "Water Requirement",
    keyRisksLabel: "Key Risks & Disclosures",
    marketOutlookLabel: "Market Demand Context",
    riskDisclaimer: "Disclaimer: Crop yield depends on actual seasonal weather and pest pressure. No financial returns or yields are guaranteed.",

    soilScreenTitle: "Soil & Nutrient Agent",
    soilScreenSubtitle: "Understand what your laboratory soil test numbers mean in plain language.",
    soilPhLabel: "Soil pH Level",
    nitrogenLabel: "Nitrogen (N)",
    phosphorusLabel: "Phosphorus (P)",
    potassiumLabel: "Potassium (K)",
    organicCarbonLabel: "Organic Carbon (%)",
    evaluateSoilBtn: "Evaluate Soil Health",
    phMeaningTitle: "What Does Your Soil pH Mean?",
    nutrientGuidanceTitle: "Recommended Balanced Stewardship",
    organicManureAdvice: "Organic Manure & Humus Guidance",
    soilHealthCardNotice: "Always cross-check specific fertilizer doses with your official Soil Health Card.",

    marketScreenTitle: "Market Intelligence Agent",
    marketScreenSubtitle: "Official wholesale APMC mandi observations and arrival trends.",
    filterByCrop: "Commodity",
    filterByState: "State",
    filterByDistrict: "District / Market",
    minPriceLabel: "Min Price",
    maxPriceLabel: "Max Price",
    observedOnLabel: "Date of Record",
    arrivalsLabel: "Arrivals",
    mandiSourceNotice: "Source: Agmarknet (Directorate of Marketing & Inspection, Ministry of Agriculture). Actual selling price depends on moisture and quality grades.",
    noMarketData: "No price records found for this specific filter.",

    farmPlanTitle: "Farm Planning Agent (Crop Stages)",
    farmPlanSubtitle: "Milestone-driven crop activity schedule from land prep to harvest.",
    stageBeforePlanting: "Before Planting",
    stageEarlyGrowth: "Early Growth",
    stageDevelopment: "Vegetative Growth",
    stageFlowering: "Flowering & Fruiting",
    stageProtection: "Crop Protection",
    stageHarvestPrep: "Harvest Preparation",
    stageAfterHarvest: "Post-Harvest / Storage",
    allStages: "All Crop Stages",
    markDone: "Mark Complete",
    reschedule: "Reschedule",
    addObservation: "Add Observation",
    reminderNotice: "Reminders will trigger based on crop milestone dates.",

    askAiTitle: "Ask KshetraMind AI",
    askAiSubtitle: "Speak or type in your language. The Master Agent coordinates specialized agents.",
    listeningNow: "Listening to your voice...",
    speakNowPrompt: "Speak your question clearly now...",
    tapToSpeak: "Tap to Speak",
    sampleQuestionsTitle: "Suggested Questions:",
    sampleQ1: "Will it rain today?",
    sampleQ2: "Why are my chilli leaves curling?",
    sampleQ3: "What is today's mandi price for chilli?",
    sampleQ4: "What farm tasks should I complete today?",
    masterAgentOrchestrating: "Master Agent is coordinating specialized agents...",
    agentsActiveBadge: "Active Agents",
    sec1Understood: "1. What I Understood",
    sec2InfoShows: "2. What Available Information Shows",
    sec3NextSteps: "3. What You Can Check or Do Next",
    sec4WhyMatters: "4. Why This Matters",
    sec5Caution: "5. Important Caution",

    settingsTitle: "Settings & Support",
    farmerProfileSection: "Farmer Profile",
    languageSection: "App Language",
    textSizeSection: "Text Size",
    voiceReadoutSection: "Voice Read-Aloud",
    voiceReadoutDesc: "Automatically reads aloud assistant recommendations for easier listening.",
    offlineSupportSection: "Offline Access & Cache",
    offlineSupportDesc: "Previously viewed guidance and farm records remain accessible without internet.",
    privacySection: "Data Privacy Guarantee",
    privacyDesc: "Your farm records and photos are securely saved and never sold to third parties.",
    deleteDataBtn: "Delete Farm Profile & Reset",
    helplineTitle: "Kisan Call Centre Helpline",
    kisanCallCentre: "Toll-Free Helpline: 1800-180-1551",
    aboutTitle: "About KshetraMind AI",
    aboutText: "An agentic multi-agent agriculture intelligence platform built for Indian smallholders."
  },

  // ================= HINDI (हिन्दी) =================
  hi: {
    appName: "क्षेत्रमाइंड AI",
    tagline: "एक खेत. जुड़ा हुआ ज्ञान.",
    welcomeTitle: "नमस्ते किसान भाई",
    welcomeSubtitle: "मौसम, फसल सुरक्षा, मिट्टी स्वास्थ्य और मंडी भाव की संपूर्ण जानकारी एक जगह।",
    selectLanguage: "अपनी पसंदीदा भाषा चुनें",
    continueBtn: "आगे बढ़ें",
    saveBtn: "सुरक्षित करें",
    cancelBtn: "रद्द करें",
    closeBtn: "बंद करें",
    backBtn: "पीछे जाएं",
    editBtn: "संपादित करें",
    submitBtn: "जमा करें",
    refreshBtn: "ताज़ा करें",
    completedBtn: "पूर्ण",
    pendingBtn: "लंबित",
    viewAllBtn: "सभी देखें",
    markReviewedBtn: "देख लिया",
    listenBtn: "सुनें",
    stopAudioBtn: "रोकें",
    readAloudBtn: "बोलकर सुनाएं",

    navHome: "होम",
    navFarm: "मेरा खेत",
    navAsk: "AI से पूछें",
    navPlan: "फसल योजना",
    navMore: "अधिक",

    onlineStatus: "ऑनलाइन जुड़ा हुआ है",
    offlineStatus: "ऑफ़लाइन मोड (सहेजी गई जानकारी)",
    textSizeTooltip: "अक्षरों का आकार बदलें",
    alertsTooltip: "खेत की चेतावनियां",

    onboardingTitle: "किसान पंजीकरण",
    onboardingSubtitle: "अपने खेत के लिए सटीक सलाह पाने हेतु यह सामान्य जानकारी दर्ज करें।",
    fieldFarmerName: "किसान का नाम",
    fieldFarmerNamePlaceholder: "उदा: रमेश राव",
    fieldState: "राज्य",
    fieldDistrict: "जिला",
    fieldVillage: "गांव / कस्बा",
    fieldVillagePlaceholder: "उदा: नरसंपेट",
    fieldFarmSize: "खेत का आकार",
    fieldFarmSizeUnit: "इकाई",
    fieldCurrentCrop: "वर्तमान फसल",
    fieldWaterSource: "सिंचाई का साधन",
    fieldSoilType: "मिट्टी का प्रकार",
    skipStep: "पता नहीं / छोड़ें",
    stepIndicator: "चरण",
    finishOnboarding: "पंजीकरण पूरा करें",

    greetingMorning: "सुप्रभात",
    greetingAfternoon: "शुभ दोपहर",
    greetingEvening: "शुभ संध्या",
    weatherCardTitle: "आज का मौसम",
    rainProbLabel: "वर्षा की संभावना",
    humidityLabel: "हवा में नमी",
    tempLabel: "तापमान",
    currentCropTitle: "मेरी वर्तमान फसल",
    stageLabel: "फसल का चरण",
    plantedOnLabel: "बुवाई की तारीख",
    cropHealthCardTitle: "पत्ती रोग जांच",
    cropHealthCardDesc: "पत्ती का फोटो खींचकर रोग और कीटों की पहचान करें।",
    soilCardTitle: "मृदा व पोषक तत्व मार्गदर्शन",
    soilCardDesc: "मिट्टी की जांच के आधार पर संतुलित खाद सलाह।",
    tasksCardTitle: "आज के कृषि कार्य",
    noTasksToday: "आज कोई लंबित कार्य नहीं है। बहुत बढ़िया!",
    mandiCardTitle: "नजदीकी मंडी भाव",
    modalPriceLabel: "मॉडल भाव",
    askBannerTitle: "क्षेत्रमाइंड AI से सीधे पूछें",
    askBannerPlaceholder: "क्या आज बारिश होगी? मेरी फसल को क्या हुआ है?...",
    askMicButton: "बोलें",
    askSendButton: "भेजें",

    myFarmTitle: "मेरे खेत का विवरण",
    myFarmSubtitle: "आपके सभी खेतों, फसलों और कृषि कार्यों का साझा रिकॉर्ड।",
    addPlotBtn: "+ नया खेत जोड़ें",
    plotLabel: "खेत / क्यारी",
    growthStageTitle: "फसल विकास यात्रा",
    soilTestHistory: "मिट्टी जांच रिकॉर्ड",
    cropHealthHistory: "पिछली रोग जांचें",
    activityHistory: "पूरे किए गए कार्यों का इतिहास",
    noPlotsYet: "अभी तक कोई खेत नहीं जोड़ा गया। ऊपर दिए बटन से जोड़ें।",

    weatherScreenTitle: "मौसम एजेंट व कृषि सलाह",
    forecast7Days: "आगामी 7 दिनों का मौसम पूर्वानुमान",
    sprayAdvisoryTitle: "छिड़काव के लिए सलाह",
    spraySafeMsg: "वर्षा की संभावना कम है। आज कीटनाशक या खाद छिड़काव के लिए अनुकूल समय है।",
    sprayUnsafeMsg: "अगले 24 घंटों में बारिश का अनुमान है। दवा धुलने से बचाने हेतु छिड़काव टालें।",
    irrigationCheckTitle: "सिंचाई की योजना",
    dataSourceLabel: "डेटा स्रोत",
    liveWeatherBadge: "लाइव मौसम (Connected)",
    demoWeatherBadge: "नमूना मौसम (Demo)",

    cropHealthTitle: "फसल स्वास्थ्य एजेंट",
    cropHealthSubtitle: "पत्ती का फोटो लें और रोग के लक्षण व प्राकृतिक रोकथाम के उपाय जानें।",
    selectCropLabel: "फसल चुनें",
    uploadLeafPhoto: "पत्ती का फोटो अपलोड करें",
    cameraCapture: "कैमरे से फोटो लें",
    analyzingLeaf: "पत्ती के लक्षणों का विश्लेषण जारी है...",
    diagnosedIssueTitle: "पहचाना गया रोग / समस्या",
    confidenceScoreTitle: "विश्वास स्कोर",
    visualSymptomsTitle: "मुख्य दृश्य लक्षण",
    contributingFactorsTitle: "रोग फैलने के कारण",
    nextChecksTitle: "आपको खेत में क्या जांचना चाहिए",
    culturalPreventionTitle: "प्राकृतिक रोकथाम के तरीके",
    safetyWarningTitle: "महत्वपूर्ण सुरक्षा चेतावनी",
    expertConsultAdvised: "गंभीर समस्या होने पर नजदीकी कृषि विज्ञान केंद्र (KVK) के विशेषज्ञ से सलाह लें।",
    takeAnotherPhoto: "दूसरा फोटो लें",
    sampleLeavesLabel: "नमूना पत्तियों से जांचें",

    cropPlanningTitle: "फसल योजना एजेंट",
    cropPlanningSubtitle: "मौसम, मिट्टी और पानी की उपलब्धता के आधार पर उपयुक्त फसल चुनें।",
    selectSeason: "फसल का मौसम",
    seasonKharif: "खरीफ (मानसून)",
    seasonRabi: "रबी (सर्दियां)",
    seasonSummer: "जायद (गर्मी)",
    soilTypeLabel: "मिट्टी का प्रकार",
    waterAvailabilityLabel: "पानी की उपलब्धता",
    findSuitableCropsBtn: "उपयुक्त फसलें देखें",
    suitableCropsTitle: "आपके खेत के लिए अनुशंसित फसलें",
    cropDurationLabel: "फसल की अवधि",
    waterRequirementLabel: "पानी की आवश्यकता",
    keyRisksLabel: "प्रमुख जोखिम और सावधानियां",
    marketOutlookLabel: "बाजार मांग का दृष्टिकोण",
    riskDisclaimer: "सूचना: फसल की उपज मौसम और उचित देखभाल पर निर्भर करती है। किसी लाभ की गारंटी नहीं दी जाती।",

    soilScreenTitle: "मृदा व पोषक तत्व एजेंट",
    soilScreenSubtitle: "मिट्टी परीक्षण की रिपोर्ट को सरल हिंदी में समझें।",
    soilPhLabel: "मिट्टी का pH मान",
    nitrogenLabel: "नाइट्रोजन (N)",
    phosphorusLabel: "फॉस्फोरस (P)",
    potassiumLabel: "पोटाश (K)",
    organicCarbonLabel: "जैविक कार्बन (%)",
    evaluateSoilBtn: "मिट्टी के स्वास्थ्य का मूल्यांकन करें",
    phMeaningTitle: "आपकी मिट्टी का pH क्या दर्शाता है?",
    nutrientGuidanceTitle: "संतुलित खाद व पोषक तत्व प्रबंधन",
    organicManureAdvice: "गोबर खाद और वर्मीकम्पोस्ट सलाह",
    soilHealthCardNotice: "विशिष्ट उर्वरक मात्रा के लिए अपने सॉयल हेल्थ कार्ड का उपयोग करें।",

    marketScreenTitle: "मंडी भाव सूचना एजेंट",
    marketScreenSubtitle: "आधिकारिक Agmarknet मंडियों के दैनिक थोक भाव।",
    filterByCrop: "फसल",
    filterByState: "राज्य",
    filterByDistrict: "जिला / मंडी",
    minPriceLabel: "न्यूनतम भाव",
    maxPriceLabel: "अधिकतम भाव",
    observedOnLabel: "दिनांक",
    arrivalsLabel: "कुल आवक",
    mandiSourceNotice: "स्रोत: Agmarknet (कृषि मंत्रालय, भारत सरकार)। वास्तविक बिक्री मूल्य फसल की गुणवत्ता और नमी पर निर्भर करता है।",
    noMarketData: "इस चयन के लिए कोई भाव उपलब्ध नहीं है।",

    farmPlanTitle: "फसल चरण कार्य योजना",
    farmPlanSubtitle: "खेत की तैयारी से लेकर कटाई तक चरणबद्ध कृषि कार्य।",
    stageBeforePlanting: "बुवाई से पहले",
    stageEarlyGrowth: "शुरुआती बढ़वार",
    stageDevelopment: "वानस्पतिक वृद्धि",
    stageFlowering: "फूल व फल का समय",
    stageProtection: "फसल सुरक्षा",
    stageHarvestPrep: "कटाई की तैयारी",
    stageAfterHarvest: "कटाई के बाद / भंडारण",
    allStages: "सभी चरण",
    markDone: "पूर्ण चिह्नित करें",
    reschedule: "तारीख बदलें",
    addObservation: "टिप्पणी जोड़ें",
    reminderNotice: "कार्य के समय आपको सूचित किया जाएगा।",

    askAiTitle: "क्षेत्रमाइंड AI सहायक",
    askAiSubtitle: "बोलकर या लिखकर प्रश्न पूछें — मास्टर एजेंट सभी विशेषज्ञों से उत्तर समन्वित करता है।",
    listeningNow: "आपकी आवाज सुन रहा हूँ...",
    speakNowPrompt: "अब अपना प्रश्न साफ आवाज में बोलें...",
    tapToSpeak: "बोलने के लिए दबाएं",
    sampleQuestionsTitle: "आप इस तरह के प्रश्न पूछ सकते हैं:",
    sampleQ1: "क्या आज बारिश होगी?",
    sampleQ2: "मिर्च की पत्तियां क्यों मुड़ रही हैं?",
    sampleQ3: "आज मंडी में मिर्च का भाव क्या है?",
    sampleQ4: "आज खेत में मुझे क्या काम करना चाहिए?",
    masterAgentOrchestrating: "मास्टर एजेंट सभी संबंधित एजेंटों से जानकारी जुटा रहा है...",
    agentsActiveBadge: "सक्रिय एजेंट",
    sec1Understood: "1. मुझे क्या समझ आया",
    sec2InfoShows: "2. उपलब्ध जानकारी क्या बताती है",
    sec3NextSteps: "3. आप आगे क्या जांच या कर सकते हैं",
    sec4WhyMatters: "4. यह क्यों महत्वपूर्ण है",
    sec5Caution: "5. महत्वपूर्ण सावधानी",

    settingsTitle: "सेटिंग्स व सहायता",
    farmerProfileSection: "किसान प्रोफ़ाइल",
    languageSection: "ऐप की भाषा",
    textSizeSection: "अक्षरों का आकार",
    voiceReadoutSection: "आवाज में पढ़कर सुनाएं (Voice Read-Aloud)",
    voiceReadoutDesc: "किसान की सुविधा के लिए उत्तरों को आवाज में पढ़कर सुनाया जाता है।",
    offlineSupportSection: "ऑफ़लाइन पहुंच",
    offlineSupportDesc: "इंटरनेट न होने पर भी पहले से देखी गई जानकारी और कार्य उपलब्ध रहेंगे।",
    privacySection: "डेटा गोपनीयता",
    privacyDesc: "आपके खेत की जानकारी सुरक्षित है और किसी तीसरे पक्ष को नहीं बेची जाती।",
    deleteDataBtn: "प्रोफ़ाइल डेटा मिटाएं",
    helplineTitle: "किसान कॉल सेंटर हेल्पलाइन",
    kisanCallCentre: "टोल फ्री नंबर: 1800-180-1551",
    aboutTitle: "क्षेत्रमाइंड AI के बारे में",
    aboutText: "भारतीय किसानों के लिए निर्मित बहु-एजेंट स्वायत्त कृषि प्लेटफॉर्म।"
  },

  // ================= KANNADA (ಕನ್ನಡ) =================
  kn: {
    appName: "ಕ್ಷೇತ್ರಮೈಂಡ್ AI",
    tagline: "ಒಂದೇ ಹೊಲ. ಸಂಪರ್ಕಿತ ಜ್ಞಾನ.",
    welcomeTitle: "ರೈತ ಬಾಂಧವರಿಗೆ ನಮಸ್ಕಾರ",
    welcomeSubtitle: "ನಿಮ್ಮ ಹೊಲಕ್ಕೆ ಹವಾಮಾನ, ಬೆಳೆ ರಕ್ಷಣೆ, ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ದರಗಳ ಸಮಗ್ರ ಮಾರ್ಗದರ್ಶಿ.",
    selectLanguage: "ನಿಮ್ಮ ಆಯ್ಕೆಯ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
    continueBtn: "ಮುಂದೆ ಸಾಗಿ",
    saveBtn: "ಉಳಿಸಿ",
    cancelBtn: "ರದ್ದುಮಾಡಿ",
    closeBtn: "ಮುಚ್ಚಿ",
    backBtn: "ಹಿಂದಕ್ಕೆ",
    editBtn: "ತಿದ್ದಿ",
    submitBtn: "ಸಲ್ಲಿಸಿ",
    refreshBtn: "ತಾಜಾಗೊಳಿಸಿ",
    completedBtn: "ಪೂರ್ಣಗೊಂಡಿದೆ",
    pendingBtn: "ಬಾಕಿ ಇದೆ",
    viewAllBtn: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
    markReviewedBtn: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    listenBtn: "ಕೇಳಿ",
    stopAudioBtn: "ನಿಲ್ಲಿಸಿ",
    readAloudBtn: "ಓದಿ ಕೇಳಿಸಿ",

    navHome: "ಹೋಮ್",
    navFarm: "ನನ್ನ ಹೊಲ",
    navAsk: "AI ಅನ್ನು ಕೇಳಿ",
    navPlan: "ಕೃಷಿ ಯೋಜನೆ",
    navMore: "ಇನ್ನಷ್ಟು",

    onlineStatus: "ಆನ್‌ಲೈನ್ ಸಂಪರ್ಕದಲ್ಲಿದೆ",
    offlineStatus: "ಆಫ್‌ಲೈನ್ ಮೋಡ್ (ಉಳಿಸಿದ ಮಾಹಿತಿ)",
    textSizeTooltip: "ಅಕ್ಷರದ ಗಾತ್ರ ಬದಲಾಯಿಸಿ",
    alertsTooltip: "ಹೊಲದ ಎಚ್ಚರಿಕೆಗಳು",

    onboardingTitle: "ರೈತರ ನೋಂದಣಿ",
    onboardingSubtitle: "ನಿಮ್ಮ ಹೊಲಕ್ಕೆ ನಿಖರ ಸಲಹೆ ನೀಡಲು ಈ ಸಾಮಾನ್ಯ ವಿವರಗಳನ್ನು ನೀಡಿ.",
    fieldFarmerName: "ರೈತರ ಹೆಸರು",
    fieldFarmerNamePlaceholder: "ಉದಾ: ರಮೇಶ್ ರಾವ್",
    fieldState: "ರಾಜ್ಯ",
    fieldDistrict: "ಜಿಲ್ಲೆ",
    fieldVillage: "ಗ್ರಾಮ / ತಾಲೂಕು",
    fieldVillagePlaceholder: "ಉದಾ: ನರಸಂಪೇಟೆ",
    fieldFarmSize: "ಹೊಲದ ವಿಸ್ತೀರ್ಣ",
    fieldFarmSizeUnit: "ಪ್ರಮಾಣ",
    fieldCurrentCrop: "ಪ್ರಸ್ತುತ ಬೆಳೆ",
    fieldWaterSource: "ನೀರಿನ ಮೂಲ",
    fieldSoilType: "ಮಣ್ಣಿನ ವಿಧ",
    skipStep: "ಗೊತ್ತಿಲ್ಲ / ಬಿಟ್ಟುಬಿಡಿ",
    stepIndicator: "ಹಂತ",
    finishOnboarding: "ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ",

    greetingMorning: "ಶುಭೋದಯ",
    greetingAfternoon: "ಶುಭ ಮಧ್ಯಾಹ್ನ",
    greetingEvening: "ಶುಭ ಸಂಜೆ",
    weatherCardTitle: "ಇಂದಿನ ಹವಾಮಾನ",
    rainProbLabel: "ಮಳೆ ಸಂಭವನೀಯತೆ",
    humidityLabel: "ಗಾಳಿಯಲ್ಲಿ ತೇವಾಂಶ",
    tempLabel: "ತಾಪಮಾನ",
    currentCropTitle: "ನನ್ನ ಪ್ರಸ್ತುತ ಬೆಳೆ",
    stageLabel: "ಬೆಳೆಯ ಹಂತ",
    plantedOnLabel: "ಬಿತ್ತಿದ ದಿನಾಂಕ",
    cropHealthCardTitle: "ಎಲೆ ರೋಗ ತಪಾಸಣೆ",
    cropHealthCardDesc: "ಎಲೆಯ ಫೋಟೋ ತೆಗೆದು ರೋಗ ಅಥವಾ ಕೀಟಬಾಧೆಯನ್ನು ಸುಲಭವಾಗಿ ಗುರುತಿಸಿ.",
    soilCardTitle: "ಮಣ್ಣು ಮತ್ತು ಪೋಷಕಾಂಶ ಮಾರ್ಗದರ್ಶಿ",
    soilCardDesc: "ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಯ ಆಧಾರದ ಮೇಲೆ ಸಮತೋಲಿತ ಗೊಬ್ಬರ ನಿರ್ವಹಣೆ.",
    tasksCardTitle: "ಇಂದಿನ ಕೃಷಿ ಕಾರ್ಯಗಳು",
    noTasksToday: "ಇಂದು ಯಾವುದೇ ಬಾಕಿ ಕೆಲಸಗಳಿಲ್ಲ. ಉತ್ತಮ!",
    mandiCardTitle: "ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ",
    modalPriceLabel: "ಮಾದರಿ ಬೆಲೆ",
    askBannerTitle: "ಕ್ಷೇತ್ರಮೈಂಡ್ AI ಅನ್ನು ನೇರವಾಗಿ ಕೇಳಿ",
    askBannerPlaceholder: "ಇಂದು ಮಳೆ ಬರುತ್ತಾ? ಮೆಣಸಿನಕಾಯಿ ಬೆಳೆಗೆ ಏನಾಗಿದೆ?...",
    askMicButton: "ಮಾತನಾಡಿ",
    askSendButton: "ಕಳುಹಿಸಿ",

    myFarmTitle: "ನನ್ನ ಹೊಲದ ವಿವರಗಳು",
    myFarmSubtitle: "ನಿಮ್ಮ ಎಲ್ಲಾ ಜಮೀನುಗಳು, ಬೆಳೆಗಳು ಮತ್ತು ಕೃಷಿ ಕಾರ್ಯಗಳ ಸಮಗ್ರ ದಾಖಲೆ.",
    addPlotBtn: "+ ಹೊಸ ಜಮೀನು ಸೇರಿಸಿ",
    plotLabel: "ಜಮೀನು / ಮಡಿ",
    growthStageTitle: "ಬೆಳೆ ಬೆಳವಣಿಗೆಯ ಹಂತಗಳು",
    soilTestHistory: "ಮಣ್ಣು ಪರೀಕ್ಷೆ ವರದಿಗಳು",
    cropHealthHistory: "ಹಿಂದಿನ ರೋಗ ತಪಾಸಣೆಗಳು",
    activityHistory: "ಪೂರ್ಣಗೊಂಡ ಕಾರ್ಯಗಳ ಇತಿಹಾಸ",
    noPlotsYet: "ಇನ್ನೂ ಯಾವುದೇ ಜಮೀನು ಸೇರಿಸಲಾಗಿಲ್ಲ. ಮೇಲಿನ ಬಟನ್ ಒತ್ತಿ ಸೇರಿಸಿ.",

    weatherScreenTitle: "ಹವಾಮಾನ ಮಾಹಿತಿ ಮತ್ತು ಕೃಷಿ ಸಲಹೆಗಳು",
    forecast7Days: "ಮುಂದಿನ 7 ದಿನಗಳ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    sprayAdvisoryTitle: "ಔಷಧಿ ಸಿಂಪಡಣೆ ಸಲಹೆ",
    spraySafeMsg: "ಮಳೆಯ ಸಾಧ್ಯತೆ ಕಡಿಮೆಯಿದೆ. ಇಂದು ಸಿಂಪಡಣೆಗೆ ಸೂಕ್ತ ಸಮಯ.",
    sprayUnsafeMsg: "ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ಸಿಂಪಡಣೆಯನ್ನು ಮುಂದೂಡಿ.",
    irrigationCheckTitle: "ನೀರಾವರಿ ನಿರ್ವಹಣೆ",
    dataSourceLabel: "ಮಾಹಿತಿ ಮೂಲ",
    liveWeatherBadge: "ಲೈವ್ ಹವಾಮಾನ (Live)",
    demoWeatherBadge: "ಮಾದರಿ ಹವಾಮಾನ (Demo)",

    cropHealthTitle: "ಬೆಳೆ ಆರೋಗ್ಯ ತಜ್ಞ",
    cropHealthSubtitle: "ಎಲೆಯ ಫೋಟೋ ತೆಗೆದು ರೋಗದ ಲಕ್ಷಣಗಳು ಮತ್ತು ನೈಸರ್ಗಿಕ ತಡೆಗಟ್ಟುವಿಕೆ ಕ್ರಮ ತಿಳಿಯಿರಿ.",
    selectCropLabel: "ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    uploadLeafPhoto: "ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    cameraCapture: "ಕ್ಯಾಮೆರಾದಿಂದ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    analyzingLeaf: "ಎಲೆಯ ಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    diagnosedIssueTitle: "ಗುರುತಿಸಲಾದ ರೋಗ / ಸಮಸ್ಯೆ",
    confidenceScoreTitle: "ವಿಶ್ವಾಸಾರ್ಹತೆ",
    visualSymptomsTitle: "ಕಂಡುಬರುವ ಪ್ರಮುಖ ಲಕ್ಷಣಗಳು",
    contributingFactorsTitle: "ರೋಗಕ್ಕೆ ಕಾರಣಗಳು",
    nextChecksTitle: "ನೀವು ಹೊಲದಲ್ಲಿ ತಪಾಸಣೆ ಮಾಡಬೇಕಾದ ಅಂಶಗಳು",
    culturalPreventionTitle: "ನೈಸರ್ಗಿಕ ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು",
    safetyWarningTitle: "ಪ್ರಮುಖ ಸುರಕ್ಷತಾ ಮುನ್ನೆಚ್ಚರಿಕೆ",
    expertConsultAdvised: "ತೀವ್ರತೆ ಹೆಚ್ಚಿದ್ದರೆ ಸ್ಥಳೀಯ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ಸಂಪರ್ಕಿಸಿ.",
    takeAnotherPhoto: "ಮತ್ತೊಂದು ಫೋಟೋ ತೆಗೆಯಿರಿ",
    sampleLeavesLabel: "ಮಾದರಿ ಎಲೆಗಳೊಂದಿಗೆ ಪರೀಕ್ಷಿಸಿ",

    cropPlanningTitle: "ಬೆಳೆ ಯೋಜನೆ ಮಾರ್ಗದರ್ಶಿ",
    cropPlanningSubtitle: "ನಿಮ್ಮ ಮಣ್ಣು, ಹಂಗಾಮು ಮತ್ತು ನೀರಿನ ಲಭ್ಯತೆಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಗಳನ್ನು ಆರಿಸಿ.",
    selectSeason: "ಕೃಷಿ ಹಂಗಾಮು",
    seasonKharif: "ಮುಂಗಾರು (ಖಾರೀಫ್)",
    seasonRabi: "ಹಿಂಗಾರು (ರಬಿ)",
    seasonSummer: "ಬೇಸಿಗೆ (ಜೈದ್)",
    soilTypeLabel: "ಮಣ್ಣಿನ ವಿಧ",
    waterAvailabilityLabel: "ನೀರಿನ ಲಭ್ಯತೆ",
    findSuitableCropsBtn: "ಸೂಕ್ತ ಬೆಳೆಗಳನ್ನು ಹುಡುಕಿ",
    suitableCropsTitle: "ನಿಮ್ಮ ಜಮೀನಿಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಗಳು",
    cropDurationLabel: "ಬೆಳೆಯ ಅವಧಿ",
    waterRequirementLabel: "ನೀರಿನ ಅವಶ್ಯಕತೆ",
    keyRisksLabel: "ಪ್ರಮುಖ ಅಪಾಯಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು",
    marketOutlookLabel: "ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆಯ ಚಿತ್ರಣ",
    riskDisclaimer: "ಸೂಚನೆ: ಬೆಳೆ ಇಳುವರಿಯು ಹವಾಮಾನ ಮತ್ತು ಸೂಕ್ತ ನಿರ್ವಹಣೆಯ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿರುತ್ತದೆ. ಯಾವುದೇ ಲಾಭದ ಭರವಸೆ ನೀಡಲಾಗುವುದಿಲ್ಲ.",

    soilScreenTitle: "ಮಣ್ಣು ಮತ್ತು ಪೋಷಕಾಂಶ ಮಾರ್ಗದರ್ಶಿ",
    soilScreenSubtitle: "ಮಣ್ಣಿನ ಪರೀಕ್ಷಾ ವರದಿಯನ್ನು ಸರಳ ಕನ್ನಡದಲ್ಲಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",
    soilPhLabel: "ಮಣ್ಣಿನ pH ಮಟ್ಟ",
    nitrogenLabel: "ಸಾರಜನಕ (N)",
    phosphorusLabel: "ರಂಜಕ (P)",
    potassiumLabel: "ಪೊಟ್ಯಾಷ್ (K)",
    organicCarbonLabel: "ಸಾವಯವ ಇಂಗಾಲ (%)",
    evaluateSoilBtn: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ",
    phMeaningTitle: "ನಿಮ್ಮ ಮಣ್ಣಿನ pH ಏನು ಸೂಚಿಸುತ್ತದೆ?",
    nutrientGuidanceTitle: "ಸಮತೋಲಿತ ಪೋಷಕಾಂಶ ನಿರ್ವಹಣೆ",
    organicManureAdvice: "ಸಾವಯವ ಗೊಬ್ಬರ ಹಾಗೂ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರದ ಬಳಕೆ",
    soilHealthCardNotice: "ನಿಖರ ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣಕ್ಕೆ ನಿಮ್ಮ ಅಧಿಕೃತ ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ (SHC) ಬಳಸಿ.",

    marketScreenTitle: "ಮಾರುಕಟ್ಟೆ ದರಗಳ ಮಾಹಿತಿ",
    marketScreenSubtitle: "ಅಧಿಕೃತ Agmarknet ಕೃಷಿ ಮಾರುಕಟ್ಟೆಗಳ ದೈನಂದಿನ ಸಗಟು ಧಾರಣೆ.",
    filterByCrop: "ಬೆಳೆ",
    filterByState: "ರಾಜ್ಯ",
    filterByDistrict: "ಜಿಲ್ಲೆ / ಮಾರುಕಟ್ಟೆ",
    minPriceLabel: "ಕನಿಷ್ಠ ಬೆಲೆ",
    maxPriceLabel: "ಗರಿಷ್ಠ ಬೆಲೆ",
    observedOnLabel: "ದಿನಾಂಕ",
    arrivalsLabel: "ಒಟ್ಟು ಆವಕ",
    mandiSourceNotice: "ಮೂಲ: Agmarknet (ಕೃಷಿ ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರ). ಗುಣಮಟ್ಟಕ್ಕೆ ಅನುಗುಣವಾಗಿ ದರಗಳು ಬದಲಾಗಬಹುದು.",
    noMarketData: "ಈ ಆಯ್ಕೆಗೆ ಯಾವುದೇ ದರ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.",

    farmPlanTitle: "ಬೆಳೆ ಹಂತವಾರು ಕಾರ್ಯ ಯೋಜನೆ",
    farmPlanSubtitle: "ಬಿತ್ತನೆಯಿಂದ ಕೊಯ್ಲಿನವರೆಗೆ ಹಂತವಾರು ಕೃಷಿ ಚಟುವಟಿಕೆಗಳ ವೇಳಾಪಟ್ಟಿ.",
    stageBeforePlanting: "ಬಿತ್ತನೆಗೆ ಮುನ್ನ",
    stageEarlyGrowth: "ಆರಂಭಿಕ ಬೆಳವಣಿಗೆ",
    stageDevelopment: "ಸಸ್ಯ ಬೆಳವಣಿಗೆ",
    stageFlowering: "ಹೂವು & ಕಾಯಿ ಬಿಡುವಿಕೆ",
    stageProtection: "ಬೆಳೆ ರಕ್ಷಣೆ",
    stageHarvestPrep: "ಕೊಯ್ಲು ತಯಾರಿ",
    stageAfterHarvest: "ಕೊಯ್ಲಿನ ನಂತರ / ಶೇಖರಣೆ",
    allStages: "ಎಲ್ಲಾ ಹಂತಗಳು",
    markDone: "ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    reschedule: "ದಿನಾಂಕ ಬದಲಾಯಿಸಿ",
    addObservation: "ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ",
    reminderNotice: "ಕೆಲಸದ ಸಮಯಕ್ಕೆ ನೆನಪಿಸಲಾಗುತ್ತದೆ.",

    askAiTitle: "ಕ್ಷೇತ್ರಮೈಂಡ್ AI ಸಹಾಯಕ",
    askAiSubtitle: "ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ — ಮಾಸ್ಟರ್ ಏಜೆಂಟ್ ಸೂಕ್ತ ತಜ್ಞರಿಂದ ಸಮಾಧಾನ ನೀಡುತ್ತದೆ.",
    listeningNow: "ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    speakNowPrompt: "ಈಗ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ...",
    tapToSpeak: "ಮಾತನಾಡಲು ಒತ್ತಿ",
    sampleQuestionsTitle: "ನೀವು ಈ ರೀತಿಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು:",
    sampleQ1: "ಇಂದು ಮಳೆ ಬರುತ್ತದೆಯೇ?",
    sampleQ2: "ಮೆಣಸಿನ ಎಲೆಗಳು ಏಕೆ ಮುದುಡುತ್ತಿವೆ?",
    sampleQ3: "ಇಂದು ಮಂಡಿಯಲ್ಲಿ ಮೆಣಸಿನಕಾಯಿ ಬೆಲೆ ಎಷ್ಟು?",
    sampleQ4: "ಇಂದು ಹೊಲದಲ್ಲಿ ನಾನು ಯಾವ ಕೆಲಸ ಪರಿಶೀಲಿಸಬೇಕು?",
    masterAgentOrchestrating: "ಮಾಸ್ಟರ್ ಏಜೆಂಟ್ ಎಲ್ಲಾ ತಜ್ಞ ಏಜೆಂಟ್‌ಗಳನ್ನು ಸಂಯೋಜಿಸುತ್ತಿದೆ...",
    agentsActiveBadge: "ಸಕ್ರಿಯ ಏಜೆಂಟ್‌ಗಳು",
    sec1Understood: "1. ನನಗೆ ಏನು ಅರ್ಥವಾಯಿತು",
    sec2InfoShows: "2. ಲಭ್ಯವಿರುವ ಮಾಹಿತಿ ಏನು ತೋರಿಸುತ್ತದೆ",
    sec3NextSteps: "3. ನೀವು ಮುಂದೆ ಏನು ಪರಿಶೀಲಿಸಬಹುದು ಅಥವಾ ಮಾಡಬಹುದು",
    sec4WhyMatters: "4. ಇದು ಏಕೆ ಮುಖ್ಯ",
    sec5Caution: "5. ಪ್ರಮುಖ ಎಚ್ಚರಿಕೆ",

    settingsTitle: "ಸೆಟ್ಟಿಂಗ್ಸ್ & ಸಹಾಯ",
    farmerProfileSection: "ರೈತರ ಪ್ರೊಫೈಲ್",
    languageSection: "ಆ್ಯಪ್ ಭಾಷೆ",
    textSizeSection: "ಅಕ್ಷರದ ಗಾತ್ರ",
    voiceReadoutSection: "ಧ್ವನಿಯಲ್ಲಿ ಓದಿ ಕೇಳಿಸಿ (Voice Read-Aloud)",
    voiceReadoutDesc: "ರೈತರ ಸುಲಭ ಆಲಿಸುವಿಕೆಗಾಗಿ ಸಲಹೆಗಳನ್ನು ಧ್ವನಿ ಮೂಲಕ ಓದುತ್ತದೆ.",
    offlineSupportSection: "ಆಫ್‌ಲೈನ್ ಪ್ರವೇಶ",
    offlineSupportDesc: "ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದಿದ್ದರೂ ಹಿಂದಿನ ಮಾಹಿತಿ ಮತ್ತು ಕಾರ್ಯಗಳು ಲಭ್ಯವಿರುತ್ತವೆ.",
    privacySection: "ಮಾಹಿತಿ ಗೌಪ್ಯತೆ",
    privacyDesc: "ನಿಮ್ಮ ಹೊಲದ ಮಾಹಿತಿಯನ್ನು ರಕ್ಷಿಸಲಾಗಿದೆ ಮತ್ತು ಯಾವುದೇ ಮೂರನೇ ವ್ಯಕ್ತಿಗೆ ಹಂಚಿಕೊಳ್ಳುವುದಿಲ್ಲ.",
    deleteDataBtn: "ಪ್ರೊಫೈಲ್ ಡೇಟಾ ಅಳಿಸಿ",
    helplineTitle: "ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ ಸಹಾಯವಾಣಿ",
    kisanCallCentre: "ಟೋಲ್ ಫ್ರೀ ಸಂಖ್ಯೆ: 1800-180-1551",
    aboutTitle: "ಕ್ಷೇತ್ರಮೈಂಡ್ AI ಬಗ್ಗೆ",
    aboutText: "ಭಾರತೀಯ ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಬಹು-ಏಜೆಂಟ್ ಕೃಷಿ ವೇದಿಕೆ."
  }
};
