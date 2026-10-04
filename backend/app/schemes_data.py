# Authoritative database of 75 Additional Verified Government Schemes (Schemes 26 to 100)
# Modularized into part1, part2, and part3

from .schemes_part1 import SCHEMES_PART1
from .schemes_part2 import SCHEMES_PART2
from .schemes_part3 import SCHEMES_PART3

ADDITIONAL_75_SCHEMES = SCHEMES_PART1 + SCHEMES_PART2 + SCHEMES_PART3

assert len(ADDITIONAL_75_SCHEMES) == 75, f"Expected 75 schemes, got {len(ADDITIONAL_75_SCHEMES)}"
