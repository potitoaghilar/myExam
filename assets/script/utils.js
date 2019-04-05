
let swap = (o,r={})=> Object.keys(o).map(x=>r[o[x]]=x)&&r;
