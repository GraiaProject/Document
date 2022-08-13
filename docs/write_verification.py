CONST_GOOGLE = "googlee43679ed2f47a9c8.html"

import mkdocs_gen_files

with mkdocs_gen_files.open(CONST_GOOGLE, "w") as f:
    f.write(f"google-site-verification: {CONST_GOOGLE}")