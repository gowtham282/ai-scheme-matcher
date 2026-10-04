"""
Update all 100 schemes in schemes_platform.db and seed files with direct application form URLs.
"""
try:
    from .database import SessionLocal
    from .models import Scheme
except (ImportError, ValueError):
    try:
        from app.database import SessionLocal
        from app.models import Scheme
    except ImportError:
        from backend.app.database import SessionLocal
        from backend.app.models import Scheme

DIRECT_APPLY_URLS = {
    "PMEGP-KVIC-01": ("https://www.kviconline.gov.in/pmegpep/pmegpweb/index.jsp", "KVIC PMEGP Direct Application Form"),
    "PMSVANIDHI-MOHUA-02": ("https://pmsvanidhi.mohua.gov.in/Schemes/ApplyLoan", "PM SVANidhi Direct Loan Application"),
    "PMMY-MUDRA-03": ("https://www.jansamarth.in/apply-loan?scheme=mudra", "JanSamarth Direct MUDRA Application"),
    "STANDUP-INDIA-04": ("https://www.standupmitra.in/Login/Register", "Stand-Up Mitra Direct Borrower Registration"),
    "PM-VISHWAKARMA-05": ("https://pmvishwakarma.gov.in/Home/HowToRegister", "PM Vishwakarma Direct Registration Form"),
    "NSFDC-TERMLOAN-06": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NSFDC Direct Registration"),
    "NSFDC-MCF-07": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NSFDC Direct Registration"),
    "NSFDC-MSY-08": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ Mahila Samridhi Direct Apply"),
    "NSTFDC-TERMLOAN-09": ("https://nstfdc.tribal.gov.in/portal/apply-online", "NSTFDC Direct Online Application"),
    "NSTFDC-AMSY-10": ("https://nstfdc.tribal.gov.in/portal/apply-online", "NSTFDC Direct Online Application"),
    "NBCFDC-TERMLOAN-11": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NBCFDC Direct Registration"),
    "NBCFDC-SWARNIMA-12": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ Swarnima Direct Registration"),
    "NMDFC-TERMLOAN-13": ("https://www.nmdfc.org/apply-online", "NMDFC Direct Application Portal"),
    "NMDFC-VIRASAT-14": ("https://www.nmdfc.org/apply-online", "NMDFC Virasat Direct Application"),
    "PMSURAJ-DOSJE-15": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ Direct Beneficiary Registration"),
    "CGTMSE-MSME-16": ("https://www.cgtmse.in/Default.aspx", "CGTMSE Member Lending Portal"),
    "PMFME-MOFPI-17": ("https://pmfme.mofpi.gov.in/pmfme/#/Login", "PMFME Direct Applicant Registration & Login"),
    "DAY-NRLM-MORD-18": ("https://nrlm.gov.in/", "DAY-NRLM National Portal"),
    "VCFSC-MOSJE-19": ("https://www.vcfsc.in/ApplyOnline.aspx", "VCF-SC Direct Entrepreneur Application"),
    "VCFBC-MOSJE-20": ("https://www.vcfbc.in/ApplyOnline.aspx", "VCF-OBC Direct Entrepreneur Application"),
    "ASIIM-IFCI-21": ("https://www.vcfsc.in/asiim/", "ASIIM Ambedkar Innovation Direct Portal"),
    "SAMARTH-TEXTILE-22": ("https://samarth-textiles.gov.in/candidate-registration", "SAMARTH Candidate Direct Registration"),
    "STREE-SHAKTI-23": ("https://www.jansamarth.in/apply-loan", "JanSamarth Women Business Credit"),
    "PMKVY-MSDE-24": ("https://www.skillindiadigital.gov.in/candidate-registration", "Skill India Digital Direct Registration"),
    "TN-AABCS-MSME-25": ("https://www.msmeonline.tn.gov.in/aabcs/new_applicant.php", "TN AABCS Direct New Applicant Form"),
    "SVEP-MORD-26": ("https://nrlm.gov.in/", "SVEP Village Enterprise Portal"),
    "AGY-MORD-27": ("https://aajeevika.gov.in/", "Aajeevika Rural Livelihoods Portal"),
    "MKSP-MORD-28": ("https://mksp.gov.in/", "MKSP Mahila Kisan Portal"),
    "KCC-ALLIED-29": ("https://www.jansamarth.in/apply-loan?scheme=kcc", "JanSamarth KCC Direct Apply"),
    "AIF-AGRI-30": ("https://agriinfra.dac.gov.in/Home/BeneficiaryRegistration", "AIF Direct Beneficiary Registration Form"),
    "SMAM-AGRI-31": ("https://agrimachinery.nic.in/Index/FarmerRegistration", "SMAM Direct Farmer Registration Form"),
    "PKVY-AGRI-32": ("https://www.jaivikkheti.in/Farmer/Registration", "Jaivik Kheti Direct Farmer Registration"),
    "PM-FME-MICRO-33": ("https://pmfme.mofpi.gov.in/pmfme/#/Login", "PMFME Direct Applicant Registration & Login"),
    "PMMSY-AQUA-34": ("https://pmmsy.dof.gov.in/applicant-registration", "PMMSY Direct Fisheries Applicant Registration"),
    "NLM-LIVESTOCK-35": ("https://nlm.udyamimitra.in/Login/Register", "NLM Direct Entrepreneur Registration"),
    "HONEY-KVIC-36": ("https://www.kviconline.gov.in/", "KVIC Honey Mission Portal"),
    "KUMBHAR-KVIC-37": ("https://www.kviconline.gov.in/", "KVIC Kumhar Sashaktikaran Portal"),
    "LEATHER-KVIC-38": ("https://www.kviconline.gov.in/", "KVIC Leather Artisans Portal"),
    "GVY-KVIC-39": ("https://www.kviconline.gov.in/", "KVIC Gramodyog Vikas Portal"),
    "SFURTI-MSME-40": ("https://sfurti.msme.gov.in/SFURTI/Home.aspx", "SFURTI Direct Application Portal"),
    "ASPIRE-MSME-41": ("https://aspire.msme.gov.in/ASPIRE/Home.aspx", "ASPIRE MSME Direct Portal"),
    "HWMUDRA-TEX-42": ("https://www.jansamarth.in/apply-loan?scheme=mudra", "JanSamarth Weavers Mudra Direct Apply"),
    "NHDP-WEAVERS-43": ("https://www.handlooms.nic.in/", "Handlooms National Portal"),
    "AHVY-CRAFTS-44": ("https://www.handicrafts.nic.in/", "Handicrafts Development Portal"),
    "MAHILA-COIR-45": ("https://coirservices.gov.in/", "Coir Board Direct Services Portal"),
    "CUY-COIR-46": ("https://coirservices.gov.in/", "Coir Udyami Direct Services Portal"),
    "SILK-SAMAGRA-47": ("https://csb.gov.in/", "Central Silk Board Portal"),
    "NSKFDC-GTL-48": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NSKFDC Direct Registration"),
    "NSKFDC-MSY-49": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NSKFDC Direct Registration"),
    "NSKFDC-SUY-50": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NSKFDC Direct Registration"),
    "NAMASTE-MSJE-51": ("https://namaste.gov.in/", "NAMASTE National Sanitation Portal"),
    "NSFDC-TL-52": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NSFDC Direct Registration"),
    "NSFDC-MCF-53": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NSFDC Direct Registration"),
    "NSFDC-MKY-54": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NSFDC Direct Registration"),
    "NSFDC-LVY-55": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NSFDC Direct Registration"),
    "NSTFDC-TL-56": ("https://nstfdc.tribal.gov.in/portal/apply-online", "NSTFDC Direct Online Application"),
    "NSTFDC-AMSY-57": ("https://nstfdc.tribal.gov.in/portal/apply-online", "NSTFDC Direct Online Application"),
    "NSTFDC-MCF-58": ("https://nstfdc.tribal.gov.in/portal/apply-online", "NSTFDC Direct Online Application"),
    "NSTFDC-ASRY-59": ("https://nstfdc.tribal.gov.in/portal/apply-online", "NSTFDC Direct Online Application"),
    "NBCFDC-GL-60": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NBCFDC Direct Registration"),
    "NBCFDC-SWARNIMA-61": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NBCFDC Direct Registration"),
    "NBCFDC-MCF-62": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NBCFDC Direct Registration"),
    "NBCFDC-SAKSHAM-63": ("https://www.pmsuraj.dosje.gov.in/beneficiary-registration", "PM-SURAJ NBCFDC Direct Registration"),
    "SEED-DNT-64": ("https://seed.dosje.gov.in/registration", "SEED DNT Direct Registration Form"),
    "PM-VIKAS-65": ("https://pmvikas.minorityaffairs.gov.in/artisan-registration", "PM-VIKAS Direct Artisan Registration"),
    "NMDFC-TL-66": ("https://www.nmdfc.org/apply-online", "NMDFC Direct Application Portal"),
    "NMDFC-VIRASAT-67": ("https://www.nmdfc.org/apply-online", "NMDFC Virasat Direct Application"),
    "NMDFC-MSY-68": ("https://www.nmdfc.org/apply-online", "NMDFC Direct Application Portal"),
    "PMJVK-MIN-69": ("https://minorityaffairs.gov.in/", "Ministry of Minority Affairs Portal"),
    "UDYOGINI-WOMEN-70": ("https://sevasindhu.karnataka.gov.in/", "Seva Sindhu Direct Applicant Portal"),
    "ANNAPURNA-WOMEN-71": ("https://www.jansamarth.in/apply-loan", "JanSamarth Direct Food Enterprise Apply"),
    "CENT-KALYANI-72": ("https://www.jansamarth.in/apply-loan", "JanSamarth Women Business Credit"),
    "MAHILA-UDYAM-73": ("https://www.sidbi.in/", "SIDBI Women Direct Credit Portal"),
    "STREE-SHAKTI-74": ("https://www.jansamarth.in/apply-loan", "JanSamarth Women Business Credit"),
    "DENA-SHAKTI-75": ("https://www.jansamarth.in/apply-loan", "JanSamarth Women Business Credit"),
    "BMB-LOAN-76": ("https://www.jansamarth.in/apply-loan", "JanSamarth Women Business Credit"),
    "MUDRA-TARUN-77": ("https://www.jansamarth.in/apply-loan?scheme=mudra", "JanSamarth Direct MUDRA Tarun Apply"),
    "CIF-NRLM-78": ("https://aajeevika.gov.in/", "Aajeevika Community Investment Portal"),
    "PMSVANIDHI-T3-79": ("https://pmsvanidhi.mohua.gov.in/Schemes/ApplyLoan", "PM SVANidhi Tranche 3 Direct Loan Apply"),
    "PMSVANIDHI-T2-80": ("https://pmsvanidhi.mohua.gov.in/Schemes/ApplyLoan", "PM SVANidhi Tranche 2 Direct Loan Apply"),
    "PMSVANIDHI-T1-81": ("https://pmsvanidhi.mohua.gov.in/Schemes/ApplyLoan", "PM SVANidhi Tranche 1 Direct Loan Apply"),
    "PMKSY-APC-82": ("https://www.mofpi.gov.in/", "MoFPI Agro Processing Cluster Portal"),
    "PMKSY-CEFPPC-83": ("https://www.mofpi.gov.in/", "MoFPI Creation of Processing Portal"),
    "AHIDF-DAIRY-84": ("https://ahidf.udyamimitra.in/Login/Register", "AHIDF Direct Entrepreneur Registration"),
    "PMMSY-DEEPSEA-85": ("https://pmmsy.dof.gov.in/applicant-registration", "PMMSY Direct Deep Sea Fishing Registration"),
    "PMMSY-ORNAMENTAL-86": ("https://pmmsy.dof.gov.in/applicant-registration", "PMMSY Direct Ornamental Fisheries Registration"),
    "RKVY-RAFTAAR-87": ("https://rkvy.nic.in/", "RKVY-RAFTAAR Portal"),
    "OPERATION-GREENS-88": ("https://www.mofpi.gov.in/", "Operation Greens MoFPI Portal"),
    "TN-NEEDS-89": ("https://www.msmeonline.tn.gov.in/needs/new_applicant.php", "TN NEEDS Direct New Applicant Form"),
    "TN-UYEGP-90": ("https://www.msmeonline.tn.gov.in/uyegp/new_applicant.php", "TN UYEGP Direct New Applicant Form"),
    "TN-TAHDCO-FAST-91": ("https://app.tahdco.tn.gov.in/", "TAHDCO Direct Beneficiary Online Portal"),
    "TN-TAHDCO-PETROL-92": ("https://app.tahdco.tn.gov.in/", "TAHDCO Direct Beneficiary Online Portal"),
    "TN-AABCS-93": ("https://www.msmeonline.tn.gov.in/aabcs/new_applicant.php", "TN AABCS Direct New Applicant Form"),
    "UP-MMYSY-94": ("https://diupmsme.upsdc.gov.in/registration/mmysy", "UP MMYSY Direct Applicant Registration"),
    "MH-CMEGP-95": ("https://maha-cmegp.gov.in/applicant-registration", "Maharashtra CMEGP Direct Applicant Registration"),
    "STATE-RGUMY-96": ("https://udyamregistration.gov.in/Udyam_Registration.aspx", "Udyam Direct MSME Registration"),
    "ASSAM-MMUA-97": ("https://asrlms.assam.gov.in/", "ASRLMS Mukhyamantri Udyamita Portal"),
    "WB-BANGLASHREE-98": ("https://shilpasathi.wb.gov.in/user-registration", "Silpa Sathi Direct Enterprise Registration"),
    "ODISHA-MSHAKTI-99": ("https://missionshakti.odisha.gov.in/", "Mission Shakti Odisha Portal"),
    "TS-DALIT-BANDHU-100": ("https://dalitbandhu.telangana.gov.in/", "Telangana Dalit Bandhu Portal")
}

def update_db():
    db = SessionLocal()
    updated_count = 0
    try:
        schemes = db.query(Scheme).all()
        for s in schemes:
            if s.scheme_id in DIRECT_APPLY_URLS:
                url, portal_name = DIRECT_APPLY_URLS[s.scheme_id]
                s.official_application_portal = url
                s.application_portal_name = portal_name
                updated_count += 1
        db.commit()
        print(f"Successfully updated {updated_count} schemes with Direct Apply URLs in SQLite database.")
    except Exception as e:
        db.rollback()
        print(f"Error updating DB: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    update_db()
