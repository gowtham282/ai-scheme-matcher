import math
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import Scheme
from .eligibility_engine import evaluate_scheme_eligibility

def compute_nlp_semantic_similarity(user_text: str, scheme_texts: List[str]) -> List[float]:
    """
    Computes vector space semantic similarity between user's business project description
    and government scheme profiles using TF-IDF and Cosine Similarity.
    """
    if not user_text or not scheme_texts:
        return [0.0] * len(scheme_texts)
    
    try:
        corpus = [user_text] + scheme_texts
        vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            token_pattern=r"(?u)\b\w+\b"
        )
        tfidf_matrix = vectorizer.fit_transform(corpus)
        user_vector = tfidf_matrix[0:1]
        scheme_vectors = tfidf_matrix[1:]
        similarities = cosine_similarity(user_vector, scheme_vectors)[0]
        return [float(s) for s in similarities]
    except Exception:
        # Graceful fallback keyword overlap
        u_words = set(user_text.lower().split())
        scores = []
        for st in scheme_texts:
            s_words = set(st.lower().split())
            intersection = len(u_words.intersection(s_words))
            scores.append(min(1.0, intersection / max(1, len(u_words) * 0.4)))
        return scores

def rank_and_explain_schemes(profile: Any, schemes: List[Scheme]) -> List[Dict[str, Any]]:
    """
    Hybrid recommendation engine:
    1. Evaluates authoritative deterministic eligibility rules.
    2. Runs NLP semantic matching on free-text project description and target activities.
    3. Calculates multi-factor weighted match score (0-100).
    4. Generates transparent explainability citations.
    """
    user_project_text = (
        f"{getattr(profile, 'project_category', '')} "
        f"{getattr(profile, 'project_description', '')} "
        f"{getattr(profile, 'business_type', '')} "
        f"{getattr(profile, 'occupation', '')} "
        f"{getattr(profile, 'purpose_of_funding', '')}"
    )

    scheme_texts = [
        f"{s.official_scheme_name} {s.short_description} {s.target_beneficiaries} "
        f"{s.business_type} {s.project_type} {s.benefits} {s.occupation_eligibility}"
        for s in schemes
    ]

    semantic_scores = compute_nlp_semantic_similarity(user_project_text, scheme_texts)

    results = []

    u_category = getattr(profile, "social_category", "General").upper()
    u_gender = getattr(profile, "gender", "Male").lower()
    u_state = getattr(profile, "state", "").lower()
    u_pcat = getattr(profile, "project_category", "").lower()
    u_pdesc = getattr(profile, "project_description", "").lower()
    is_artisan = getattr(profile, "is_artisan", False) or "tailor" in u_pcat or "tailor" in u_pdesc
    is_women = getattr(profile, "is_women_entrepreneur", False) or u_gender == "female"

    for idx, scheme in enumerate(schemes):
        status, why_it_matches, potential_missing, factor_checks = evaluate_scheme_eligibility(profile, scheme)
        sem_score = semantic_scores[idx]

        # Base score from deterministic factor checks
        base_rule_score = sum(f["score"] for f in factor_checks)  # Up to 70 pts
        
        # Semantic project fit contribution (up to 25 pts)
        project_semantic_pts = min(25.0, sem_score * 35.0)
        
        # Priority boost for marginalized domain alignment (up to 5 pts)
        priority_boost = 0.0
        
        # 1. State + Category specific champion scheme boost (e.g. TN AABCS for SC in TN)
        if "tamil nadu" in scheme.location_eligibility.lower() and "tamil nadu" in u_state and u_category in ["SC", "ST"]:
            priority_boost += 5.0
            why_it_matches.insert(0, "[Priority State Match] Exclusive Tamil Nadu SC/ST Business Champions Scheme with 35% Capital Subsidy.")

        # 2. Artisan trade match (e.g. Tailoring / PM Vishwakarma)
        if is_artisan and ("vishwakarma" in scheme.scheme_id.lower() or "samarth" in scheme.scheme_id.lower() or "artisan" in scheme.target_beneficiaries.lower()):
            priority_boost += 5.0
            why_it_matches.insert(0, "[Direct Trade Alignment] Tailoring / Garment craft is specifically supported with toolkits and specialized credit.")

        # 3. Scheduled Caste dedicated corporation match (NSFDC, VCF-SC)
        if u_category == "SC" and "nsfdc" in scheme.scheme_id.lower():
            priority_boost += 4.0
            why_it_matches.insert(0, "[Apex Corporation Match] Dedicated financial assistance from National Scheduled Castes Finance & Dev Corp.")

        # 4. Women entrepreneur scheme match
        if is_women and ("mahila" in scheme.official_scheme_name.lower() or "stree" in scheme.scheme_id.lower() or "swarnima" in scheme.scheme_id.lower()):
            priority_boost += 5.0
            why_it_matches.insert(0, "[Women Empowerment Match] Exclusive interest concessions and relaxed conditions for women entrepreneurs.")

        raw_score = base_rule_score + project_semantic_pts + priority_boost

        # Normalization and Rule Authoritative Invariance:
        # Match score must NEVER mask an ineligible rule failure!
        if status == "NOT_ELIGIBLE":
            final_score = int(min(35, raw_score * 0.4))
        elif status == "CONDITIONALLY_ELIGIBLE":
            final_score = int(min(74, max(50, raw_score * 0.85)))
        else: # ELIGIBLE
            final_score = int(min(98, max(75, raw_score)))

        # Format score breakdown
        breakdown = factor_checks.copy()
        breakdown.append({
            "factor_name": "Project Description Semantic Alignment (NLP)",
            "status": "PASS" if sem_score > 0.15 else "PARTIAL",
            "score": round(project_semantic_pts, 1),
            "max_score": 25.0,
            "comment": f"AI Semantic similarity rating: {round(sem_score * 100, 1)}% based on project activity keywords."
        })

        if priority_boost > 0:
            breakdown.append({
                "factor_name": "Target Group Priority Alignment",
                "status": "PASS",
                "score": round(priority_boost, 1),
                "max_score": 5.0,
                "comment": "Bonus weighting applied for marginalized group policy priority."
            })

        # Required documents extracted
        doc_names = [d.strip() for d in scheme.required_documents.split(",") if d.strip()]

        # Recommended partners
        partner_summaries = []
        for p in scheme.partners:
            if p.is_authorized:
                partner_summaries.append({
                    "id": p.id,
                    "name": p.name,
                    "partner_type": p.partner_type,
                    "state": p.state,
                    "district": p.district,
                    "contact_phone": p.contact_phone,
                    "website": p.website,
                    "is_authorized": p.is_authorized
                })

        results.append({
            "scheme": scheme,
            "match_score": final_score,
            "eligibility_status": status,
            "why_it_matches": why_it_matches[:6],
            "potential_missing_requirements": potential_missing,
            "required_documents": doc_names,
            "score_breakdown": breakdown,
            "recommended_channel_partners": partner_summaries
        })

    # Sort results:
    # 1. Status: ELIGIBLE > CONDITIONALLY_ELIGIBLE > NOT_ELIGIBLE
    # 2. Match Score descending
    status_order = {"ELIGIBLE": 0, "CONDITIONALLY_ELIGIBLE": 1, "NOT_ELIGIBLE": 2}
    results.sort(key=lambda r: (status_order[r["eligibility_status"]], -r["match_score"]))

    return results
