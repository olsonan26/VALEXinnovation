import {identityFor,compareIdentities} from './lib/compatibility.js';
import {validatedIdentity} from './lib/assets/chart-engine.js';

export class ProfileInputError extends Error{
  constructor(message,field){super(message);this.name='ProfileInputError';this.field=field;}
}
function personFrom(input,id){
  const full=String(input.fullName||'').trim(),called=String(input.calledName||'').trim()||full;
  const validName=value=>value.length>=2&&value.length<=100&&/^[a-z]+(?:[\s-]+[a-z]+)*$/i.test(value);
  if(!validName(full))throw new ProfileInputError('Enter a full birth name using A–Z letters, spaces or hyphens.',id+'-name');
  if(!validName(called))throw new ProfileInputError('Enter an everyday name using A–Z letters, spaces or hyphens.',id+'-called');
  const iso=String(input.birthdate||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))throw new ProfileInputError('Choose a complete birthdate.',id+'-dob');
  const [year,month,day]=iso.split('-');
  const person={id,FullName:full,CalledName:called,txtBirthdate:`${day}-${month}-${year}`};
  try{validatedIdentity(person);}catch{throw new ProfileInputError('Enter a valid birthdate that is not in the future.',id+'-dob');}
  return person;
}
export function comparePair(first,second){
  const a=personFrom(first,'a'),b=personFrom(second,'b');
  const comparison=compareIdentities(identityFor(a),identityFor(b));
  return {names:{a:a.CalledName,b:b.CalledName},profiles:{a:a.FullName,b:b.FullName},version:comparison.version,
    forward:{whole:comparison.forward.nameCentered.whole,called:comparison.forward.nameCentered.called,overall:comparison.forward.overall},
    reverse:{whole:comparison.reverse.nameCentered.whole,called:comparison.reverse.nameCentered.called,overall:comparison.reverse.overall}};
}
