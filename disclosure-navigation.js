// A direct link to supporting material should open the material it points to.
export function revealLinkedDetails(doc,hash){
 if(!hash||hash==='#')return null;
 let id;try{id=decodeURIComponent(hash.slice(1));}catch{return null;}
 const target=doc.getElementById(id);if(!target)return null;
 for(let node=target;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
 const reading=target.querySelector('details.supporting-reading,details.research-reading');if(reading)reading.open=true;
 return target;
}
