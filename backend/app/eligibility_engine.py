from typing import Dict, Any, List, Tuple
from .models import Scheme

def evaluate_scheme_eligibility(profile: Any, scheme: Scheme) -> Tuple[str, List[str], List[str], List[Dict[str, Any]]]:
    """
    Deterministic rule-based eligibility evaluation engine.
    Checks hard government conditions (Category, Age, Income, Location, Gender, Project Cost).
    
    Returns:
    - status: "ELIGIBLE", "CONDITIONALLY_ELIGIBLE", "NOT_ELIGIBLE"
    - why_it_matches: List of validated affirmative reasons
    - potential_missing: List of caveats / required statutory certifications
    - factor_checks: Detailed factor validation breakdown
    """
    why_it_matches: List[str] = []
    potential_missing: List[str] = []
    factor_checks: List[Dict[str, Any]] = []

    is_eligible = True
    conditional = False

    # Extract user profile attributes
    u_category = getattr(profile, "social_category", "General")
    u_age = getattr(profile, "age", 25)
    u_income = getattr(profile, "annual_family_income", 0.0)
    u_gender = getattr(profile, "gender", "Male")
    u_state = getattr(profile, "state", "")
    u_loc_type = getattr(profile, "location_type", "Rural")
    u_cost = getattr(profile, "estimated_project_cost", 0.0)
    u_loan = getattr(profile, "loan_requirement", 0.0)
    u_btype = getattr(profile, "business_type", "Manufacturing")
    u_pcat = getattr(profile, "project_category", "")
    u_pdesc = getattr(profile, "project_description", "")
    is_women = getattr(profile, "is_women_entrepreneur", False) or u_gender.lower() == "female"
    is_artisan = getattr(profile, "is_artisan", False) or "tailor" in u_pcat.lower() or "tailor" in u_pdesc.lower()
    is_minority = getattr(profile, "is_minority", False) or u_category.lower() == "minority"
    is_student = getattr(profile, "is_student", False)

    # 1. Social Category Verification
    scheme_cats = [c.strip().upper() for c in scheme.eligible_categories.split(",") if c.strip()]
    u_cat_upper = u_category.strip().upper()

    if "ALL" in scheme_cats or u_cat_upper in scheme_cats:
        why_it_matches.append(f"Your social category ({u_category}) satisfies official scheme eligibility.")
        factor_checks.append({
            "factor_name": "Social Category",
            "status": "PASS",
            "score": 20.0,
            "max_score": 20.0,
            "comment": f"Applicant belongs to {u_category}, which is explicitly covered by this scheme."
        })
        if u_cat_upper in ["SC", "ST", "OBC"]:
            potential_missing.append(f"Must produce valid {u_category} Community Certificate issued by competent Revenue Authority (Tahsildar).")
    elif is_women and "WOMEN" in scheme.target_beneficiaries.upper():
        why_it_matches.append("Applicant qualifies under the Women Entrepreneur criterion.")
        factor_checks.append({
            "factor_name": "Social Category / Beneficiary Focus",
            "status": "PASS",
            "score": 20.0,
            "max_score": 20.0,
            "comment": "Eligible under priority Women Entrepreneur mandate."
        })
    else:
        is_eligible = False
        factor_checks.append({
            "factor_name": "Social Category",
            "status": "FAIL",
            "score": 0.0,
            "max_score": 20.0,
            "comment": f"Scheme requires category in [{', '.join(scheme_cats)}], but profile is {u_category}."
        })

    # 2. Gender Eligibility Check
    if scheme.gender_eligibility == "Female Only":
        if u_gender.lower() == "female" or is_women:
            why_it_matches.append("Meets the designated women-only entrepreneurship requirement.")
            factor_checks.append({
                "factor_name": "Gender Eligibility",
                "status": "PASS",
                "score": 10.0,
                "max_score": 10.0,
                "comment": "Female applicant meets exclusive women beneficiary mandate."
            })
        else:
            is_eligible = False
            factor_checks.append({
                "factor_name": "Gender Eligibility",
                "status": "FAIL",
                "score": 0.0,
                "max_score": 10.0,
                "comment": "Scheme is strictly reserved for women entrepreneurs."
            })
    else:
        factor_checks.append({
            "factor_name": "Gender Eligibility",
            "status": "PASS",
            "score": 10.0,
            "max_score": 10.0,
            "comment": "Open to all genders (Male, Female, Not Prefer to say)."
        })

    # 3. Age Eligibility Check
    if scheme.minimum_age <= u_age <= scheme.maximum_age:
        why_it_matches.append(f"Your age ({u_age} years) is within the eligible age bracket ({scheme.minimum_age} to {scheme.maximum_age} years).")
        factor_checks.append({
            "factor_name": "Age Eligibility",
            "status": "PASS",
            "score": 10.0,
            "max_score": 10.0,
            "comment": f"Age {u_age} complies with official age bounds."
        })
    else:
        is_eligible = False
        factor_checks.append({
            "factor_name": "Age Eligibility",
            "status": "FAIL",
            "score": 0.0,
            "max_score": 10.0,
            "comment": f"Age {u_age} outside allowable range {scheme.minimum_age}-{scheme.maximum_age}."
        })

    # 4. Income Ceiling Check
    if scheme.income_limit is None or scheme.income_limit <= 0:
        why_it_matches.append("No restrictive income ceiling applies under official scheme guidelines.")
        factor_checks.append({
            "factor_name": "Annual Family Income",
            "status": "PASS",
            "score": 15.0,
            "max_score": 15.0,
            "comment": "Open income criterion (no maximum income ceiling)."
        })
    elif u_income <= scheme.income_limit:
        why_it_matches.append(f"Your annual family income (₹{u_income:,.0f}) is within the scheme ceiling of ₹{scheme.income_limit:,.0f}.")
        factor_checks.append({
            "factor_name": "Annual Family Income",
            "status": "PASS",
            "score": 15.0,
            "max_score": 15.0,
            "comment": f"Annual income ₹{u_income:,.0f} complies with ceiling ₹{scheme.income_limit:,.0f}."
        })
        potential_missing.append("Current Income Certificate from Revenue Department required as proof.")
    else:
        is_eligible = False
        factor_checks.append({
            "factor_name": "Annual Family Income",
            "status": "FAIL",
            "score": 0.0,
            "max_score": 15.0,
            "comment": f"Annual income ₹{u_income:,.0f} exceeds scheme ceiling of ₹{scheme.income_limit:,.0f}."
        })

    # 5. Geographic Location / State Check
    if scheme.location_eligibility == "Pan-India":
        why_it_matches.append("Scheme is nationally available across all Indian States and Union Territories.")
        factor_checks.append({
            "factor_name": "Geographic Location",
            "status": "PASS",
            "score": 10.0,
            "max_score": 10.0,
            "comment": "Pan-India coverage."
        })
    elif scheme.location_eligibility.lower() in u_state.lower() or u_state.lower() in scheme.location_eligibility.lower():
        why_it_matches.append(f"Applicant resides in {u_state}, the target state for this specialized scheme.")
        factor_checks.append({
            "factor_name": "Geographic Location",
            "status": "PASS",
            "score": 10.0,
            "max_score": 10.0,
            "comment": f"State {u_state} matches state-specific scheme jurisdiction."
        })
    else:
        is_eligible = False
        factor_checks.append({
            "factor_name": "Geographic Location",
            "status": "FAIL",
            "score": 0.0,
            "max_score": 10.0,
            "comment": f"Scheme is restricted to {scheme.location_eligibility}, but profile state is {u_state}."
        })

    # 6. Rural / Urban Check
    if scheme.rural_urban_eligibility == "Both":
        factor_checks.append({
            "factor_name": "Location Type (Rural/Urban)",
            "status": "PASS",
            "score": 5.0,
            "max_score": 5.0,
            "comment": "Applicable in both rural and urban areas."
        })
    elif scheme.rural_urban_eligibility.lower() == u_loc_type.lower():
        why_it_matches.append(f"Location type ({u_loc_type}) matches scheme focus area.")
        factor_checks.append({
            "factor_name": "Location Type (Rural/Urban)",
            "status": "PASS",
            "score": 5.0,
            "max_score": 5.0,
            "comment": f"{u_loc_type} area eligible."
        })
    else:
        # Partial match if semi-urban
        conditional = True
        factor_checks.append({
            "factor_name": "Location Type (Rural/Urban)",
            "status": "PARTIAL",
            "score": 2.5,
            "max_score": 5.0,
            "comment": f"Scheme targets {scheme.rural_urban_eligibility} areas."
        })

    # 7. Project Cost Compatibility Check
    if u_cost <= scheme.project_cost_limit:
        why_it_matches.append(f"Estimated project cost of ₹{u_cost:,.0f} falls within the upper ceiling of ₹{scheme.project_cost_limit:,.0f}.")
        factor_checks.append({
            "factor_name": "Project Cost Range",
            "status": "PASS",
            "score": 10.0,
            "max_score": 10.0,
            "comment": f"Project cost ₹{u_cost:,.0f} is within limit ₹{scheme.project_cost_limit:,.0f}."
        })
    else:
        # Project cost exceeds ceiling
        conditional = True
        factor_checks.append({
            "factor_name": "Project Cost Range",
            "status": "PARTIAL",
            "score": 4.0,
            "max_score": 10.0,
            "comment": f"Project cost ₹{u_cost:,.0f} exceeds max supported cost ₹{scheme.project_cost_limit:,.0f}."
        })

    # 8. Business Activity Fit
    btype_words = [w.lower() for w in scheme.business_type.replace("/", ",").split(",") if w.strip()]
    if "all" in btype_words or any(w in u_btype.lower() for w in btype_words):
        why_it_matches.append(f"Your business type ({u_btype}) is actively supported under eligible project activities.")
        factor_checks.append({
            "factor_name": "Business Sector Fit",
            "status": "PASS",
            "score": 10.0,
            "max_score": 10.0,
            "comment": f"{u_btype} is an eligible business activity."
        })
    else:
        conditional = True
        factor_checks.append({
            "factor_name": "Business Sector Fit",
            "status": "PARTIAL",
            "score": 5.0,
            "max_score": 10.0,
            "comment": f"Requires business type in [{scheme.business_type}], user declared {u_btype}."
        })

    # Add DPR / Project Report caveat if missing
    if u_cost >= 100000:
        potential_missing.append("Detailed Project Report (DPR) with machine quotations and financial projections needed.")

    # Determine status
    if not is_eligible:
        status = "NOT_ELIGIBLE"
    elif conditional:
        status = "CONDITIONALLY_ELIGIBLE"
    else:
        status = "ELIGIBLE"

    return status, why_it_matches, potential_missing, factor_checks
