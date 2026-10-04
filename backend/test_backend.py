import os
import sys

# Ensure root is in PYTHONPATH
sys.path.insert(0, os.path.abspath("."))

from backend.app.database import SessionLocal, engine, Base
from backend.app.models import Scheme, User
from backend.app.seed_data import seed_database
from backend.app.schemas import UserProfileInput
from backend.app.ai_matcher import rank_and_explain_schemes

def test_seed_is_idempotent():
    print("Testing idempotent database seeding...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        seed_database(db)
        print("Seed ran twice without duplicate-key errors.")
    finally:
        db.close()


def run_tests():
    print("Initializing SQLite database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Running database seed...")
        seed_database(db)

        scheme_count = db.query(Scheme).count()
        print(f"Total schemes in DB: {scheme_count}")
        assert scheme_count == 100, f"Expected 100 schemes, got {scheme_count}"

        print("Testing SIH Demo Profile matching...")
        demo_profile = UserProfileInput(
            name="Demo User",
            age=28,
            gender="Male",
            mobile="9876543210",
            state="Tamil Nadu",
            district="Namakkal",
            social_category="SC",
            annual_family_income=250000.0,
            location_type="Rural",
            education_level="10th Pass",
            occupation="Entrepreneur",
            business_status="New / Proposed",
            business_type="Manufacturing",
            project_category="Tailoring / Garments",
            project_description="Small tailoring business and custom garment stitching unit with motorized sewing machines.",
            estimated_project_cost=300000.0,
            loan_requirement=250000.0,
            purpose_of_funding="Machinery / Equipment",
            is_disabled=False,
            is_minority=False,
            is_women_entrepreneur=False,
            is_artisan=True,
            is_student=False
        )

        all_schemes = db.query(Scheme).all()
        ranked = rank_and_explain_schemes(demo_profile, all_schemes)
        print(f"Total ranked results: {len(ranked)}")

        top_3 = ranked[:3]
        print("\n=== TOP 3 MATCHED SCHEMES FOR DEMO USER ===")
        for i, res in enumerate(top_3, 1):
            s = res["scheme"]
            print(f"{i}. {s.official_scheme_name}")
            print(f"   Score: {res['match_score']}% | Status: {res['eligibility_status']}")
            print(f"   Why it matches: {res['why_it_matches'][:2]}")
            print(f"   Missing/Reqs: {res['potential_missing_requirements'][:1]}")

        # Check that Tamil Nadu AABCS or PMEGP or MUDRA or NSFDC is near top
        top_scheme_ids = [r["scheme"].scheme_id for r in ranked[:5]]
        print(f"Top 5 Scheme IDs: {top_scheme_ids}")
        assert any(sid in top_scheme_ids for sid in ["TN-AABCS-MSME-25", "PMEGP-KVIC-01", "PM-VISHWAKARMA-05", "NSFDC-MCF-07", "PMMY-MUDRA-03"]), "Expected top matching schemes"

        print("\nAll backend validation tests passed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    test_seed_is_idempotent()
    run_tests()
