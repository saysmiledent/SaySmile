import json,sys,re
S='/tmp/claude-0/-home-claude/bbd28d26-13fb-5ce6-bd5a-562c8f9e28ca/scratchpad'
pool=json.load(open(f'{S}/pool.json'))
for p in sys.argv[1:]:
    x=pool[p]; a=x['abstract'] or ''
    parts=[t.strip() for t in re.split(r'\n\n',a) if t.strip()]
    keep=parts if len(a)<1700 else [parts[0][:300]]+parts[-2:]
    print('##',p,x['title'][:110]); print(' | '.join(k[:620] for k in keep)); print()
