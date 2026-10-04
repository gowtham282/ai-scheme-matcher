export type Language = 'en' | 'ta' | 'hi';

export interface Translations {
  portalTitle: string;
  portalSubtitle: string;
  findMySchemes: string;
  exploreAllSchemes: string;
  smartMatcher: string;
  eligibilityChecker: string;
  partnerFinder: string;
  applicationTracking: string;
  requiredDocuments: string;
  howToApply: string;
  savedSchemes: string;
  adminDashboard: string;
  sourcesVerification: string;
  verifiedSchemesCount: string;
  sihDemoMode: string;
  sihDemoDesc: string;
  loadDemoProfile: string;
  whyThisMatches: string;
  officialSource: string;
  viewGuidelines: string;
  applyOnOfficialPortal: string;
  trackOnOfficialPortal: string;
  externalGovernmentPortal: string;
  matchScore: string;
  matchScoreNotice: string;
  disclaimerText: string;
  officialEligibilityInfo: string;
  easyExplanation: string;
  potentialMissing: string;
  contactHelpline: string;
  lastVerified: string;
  home: string;
  about: string;
  privacyPolicy: string;
  termsDisclaimer: string;
  login: string;
  logout: string;
  demoCitizen: string;
  adminLogin: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    portalTitle: "AI-Powered Government Scheme Matching Platform",
    portalSubtitle: "Personalized scheme discovery, eligibility guidance and application support for marginalized entrepreneurs — all in one place.",
    findMySchemes: "Find My Schemes",
    exploreAllSchemes: "Explore All 100 Verified Schemes",
    smartMatcher: "Smart Scheme Matcher",
    eligibilityChecker: "Eligibility Checker",
    partnerFinder: "Channel Partner Finder",
    applicationTracking: "Application Tracking",
    requiredDocuments: "Required Documents",
    howToApply: "How to Apply",
    savedSchemes: "Saved Schemes",
    adminDashboard: "Government / Admin Portal",
    sourcesVerification: "Sources & Verification",
    verifiedSchemesCount: "100 Actively Verified Schemes",
    sihDemoMode: "AI Assistant Mode",
    sihDemoDesc: "Instant 1-Click AI scheme assessment: SC Tailoring Entrepreneur in Namakkal, Tamil Nadu.",
    loadDemoProfile: "Load Demo Profile (SC / Namakkal, TN / Tailoring)",
    whyThisMatches: "Why This Scheme Matches",
    officialSource: "Official Government Source",
    viewGuidelines: "View Official Guidelines (PDF)",
    applyOnOfficialPortal: "Apply on Official Portal",
    trackOnOfficialPortal: "Track on Official Portal",
    externalGovernmentPortal: "External Government Portal (No Fake Real-time Tracking)",
    matchScore: "AI Compatibility Match",
    matchScoreNotice: "Match score indicates profile compatibility. Final eligibility and approval are determined by the concerned government department/channel partner.",
    disclaimerText: "Recommendations are informational and based on official scheme information available at the time of verification. Always verify current eligibility on the official portal before applying.",
    officialEligibilityInfo: "Official Eligibility Information",
    easyExplanation: "Easy Explanation & Next Steps",
    potentialMissing: "Potential Missing Requirements / Certificates",
    contactHelpline: "Official Scheme Helpline",
    lastVerified: "Last Verified Date",
    home: "Home",
    about: "About Platform",
    privacyPolicy: "Privacy Policy",
    termsDisclaimer: "Terms & Disclaimer",
    login: "Citizen Login",
    logout: "Sign Out",
    demoCitizen: "Demo Citizen",
    adminLogin: "Nodal Officer / Admin"
  },
  ta: {
    portalTitle: "அரசு நலத்திட்டங்கள் கண்டறியும் செயற்கை நுண்ணறிவு தளம்",
    portalSubtitle: "விளிம்புநிலை தொழில்முனைவோருக்கான தனிப்பயனாக்கப்பட்ட திட்டக் கண்டறிதல், தகுதி வழிகாட்டல் மற்றும் அதிகாரப்பூர்வ விண்ணப்ப ஆதரவு.",
    findMySchemes: "எனக்கான திட்டங்களைக் கண்டறிக",
    exploreAllSchemes: "100 சரிபார்க்கப்பட்ட திட்டங்களை காண்க",
    smartMatcher: "ஸ்மார்ட் திட்ட பொருத்தம்",
    eligibilityChecker: "தகுதி சரிபார்ப்பாளர்",
    partnerFinder: "அங்கீகரிக்கப்பட்ட கூட்டாளர் தேடல்",
    applicationTracking: "விண்ணப்ப கண்காணிப்பு",
    requiredDocuments: "தேவையான ஆவணங்கள்",
    howToApply: "விண்ணப்பிப்பது எப்படி",
    savedSchemes: "சேமிக்கப்பட்ட திட்டங்கள்",
    adminDashboard: "நிர்வாக / அரசு அதிகாரி தளம்",
    sourcesVerification: "அதிகாரப்பூர்வ ஆதாரங்கள் & சரிபார்ப்பு",
    verifiedSchemesCount: "100 சரிபார்க்கப்பட்ட நேரடித் திட்டங்கள்",
    sihDemoMode: "AI உதவியாளர் முறை (AI Assistant Mode)",
    sihDemoDesc: "உடனடி AI திட்ட மதிப்பீடு: நாமக்கல், தமிழ்நாடு தையல் தொழில்முனைவோர் (SC).",
    loadDemoProfile: "மாதிரி விண்ணப்பதாரரை ஏற்றுக (SC / நாமக்கல் / தையல்)",
    whyThisMatches: "இத்திட்டம் ஏன் பொருந்துகிறது?",
    officialSource: "அதிகாரப்பூர்வ அரசு ஆதாரம்",
    viewGuidelines: "அரசு வழிகாட்டுதலை காண்க (PDF)",
    applyOnOfficialPortal: "அதிகாரப்பூர்வ இணையதளத்தில் விண்ணப்பிக்கவும்",
    trackOnOfficialPortal: "அதிகாரப்பூர்வ தளத்தில் கண்காணிக்கவும்",
    externalGovernmentPortal: "வெளிப்புற அரசு தளம் (போலி கண்காணிப்பு இல்லை)",
    matchScore: "பொருத்த மதிப்பீடு",
    matchScoreNotice: "பொருத்த மதிப்பெண் சுயவிவர இணக்கத்தன்மையை மட்டுமே குறிக்கிறது. இறுதி ஒப்புதலை சம்பந்தப்பட்ட அரசு துறையே தீர்மானிக்கிறது.",
    disclaimerText: "பரிந்துரைகள் வழிகாட்டுதலுக்கு மட்டுமே. விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ போர்ட்டலில் சரிபார்க்கவும்.",
    officialEligibilityInfo: "அதிகாரப்பூர்வ தகுதி விதிகள்",
    easyExplanation: "எளிமையான விளக்கம் & அடுத்த கட்டங்கள்",
    potentialMissing: "தேவைப்படும் சான்றிதழ்கள் / ஆவணங்கள்",
    contactHelpline: "அரசு உதவி எண்",
    lastVerified: "கடைசியாக சரிபார்க்கப்பட்ட தேதி",
    home: "முகப்பு",
    about: "எங்களை பற்றி",
    privacyPolicy: "தனியுரிமைக் கொள்கை",
    termsDisclaimer: "விதிமுறைகள் & பொறுப்புத்துறப்பு",
    login: "உள்நுழைக",
    logout: "வெளியேறு",
    demoCitizen: "மாதிரி பயனர்",
    adminLogin: "அரசு அதிகாரி"
  },
  hi: {
    portalTitle: "एआई-संचालित सरकारी योजना मिलान एवं अनुशंसा मंच",
    portalSubtitle: "वंचित एवं हाशिए के उद्यमियों के लिए व्यक्तिगत योजना खोज, पात्रता मार्गदर्शन और आधिकारिक आवेदन सहायता।",
    findMySchemes: "मेरी योजनाएं खोजें",
    exploreAllSchemes: "सभी 100 सत्यापित योजनाएं देखें",
    smartMatcher: "स्मार्ट योजना मैचर",
    eligibilityChecker: "पात्रता चेकर",
    partnerFinder: "अधिकृत चैनल पार्टनर खोजें",
    applicationTracking: "आवेदन ट्रैकिंग",
    requiredDocuments: "आवश्यक दस्तावेज़",
    howToApply: "आवेदन कैसे करें",
    savedSchemes: "सहेजी गई योजनाएं",
    adminDashboard: "प्रशासनिक / नोडल अधिकारी पोर्टल",
    sourcesVerification: "आधिकारिक स्रोत एवं सत्यापन",
    verifiedSchemesCount: "100 सत्यापित सरकारी योजनाएं",
    sihDemoMode: "AI सहायक मोड (AI Assistant Mode)",
    sihDemoDesc: "त्वरित एआई योजना मूल्यांकन: नामक्कल, तमिलनाडु में सिलाई उद्यमी (एससी)।",
    loadDemoProfile: "डेमो प्रोफाइल लोड करें (SC / नामक्कल / सिलाई)",
    whyThisMatches: "यह योजना आपके लिए क्यों उपयुक्त है?",
    officialSource: "आधिकारिक सरकारी स्रोत",
    viewGuidelines: "आधिकारिक दिशानिर्देश देखें (PDF)",
    applyOnOfficialPortal: "आधिकारिक पोर्टल पर आवेदन करें",
    trackOnOfficialPortal: "आधिकारिक पोर्टल पर ट्रैक करें",
    externalGovernmentPortal: "बाहरी सरकारी पोर्टल (कोई फर्जी ट्रैकिंग नहीं)",
    matchScore: "एआई अनुकूलता स्कोर",
    matchScoreNotice: "मैच स्कोर प्रोफ़ाइल संगतता को दर्शाता है। अंतिम पात्रता और ऋण स्वीकृति संबंधित विभाग/बैंक द्वारा तय की जाती है।",
    disclaimerText: "सिफारिशें केवल सूचनात्मक हैं। आवेदन करने से पहले हमेशा आधिकारिक पोर्टल पर वर्तमान नियमों की पुष्टि करें।",
    officialEligibilityInfo: "आधिकारिक कानूनी पात्रता नियम",
    easyExplanation: "सरल व्याख्या और अगले कदम",
    potentialMissing: "आवश्यक प्रमाण पत्र एवं दस्तावेज़",
    contactHelpline: "आधिकारिक हेल्पलाइन",
    lastVerified: "सत्यापन की अंतिम तिथि",
    home: "मुख्य पृष्ठ",
    about: "मंच के बारे में",
    privacyPolicy: "गोपनीयता नीति",
    termsDisclaimer: "नियम एवं अस्वीकरण",
    login: "नागरिक लॉगिन",
    logout: "लॉगआउट",
    demoCitizen: "डेमो नागरिक",
    adminLogin: "नोडल अधिकारी"
  }
};
