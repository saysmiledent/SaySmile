import json,sys,re
import os
S = os.path.dirname(os.path.abspath(__file__))
pool=json.load(open(f'{S}/pool.json'))
for p in sys.argv[1:]:
    x=pool[p]; a=x['abstract'] or ''
    parts=[t.strip() for t in re.split(r'\n\n',a) if t.strip()]
    keep=parts if len(a)<1700 else [parts[0][:300]]+parts[-2:]
    print('##',p,x['title'][:110]); print(' | '.join(k[:620] for k in keep)); print()
