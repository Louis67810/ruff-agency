import { fw, close } from '../../outils/fw.mjs';
import { C, rect, text, info } from '../../outils/kit.mjs';
const back='5408:11212', front='5408:11222', hand='5406:10864';
await fw('rotate_nodes',{nodeIds:[back],rotation:0});
await fw('resize_nodes',{nodeIds:[back],width:250,height:300});
await fw('set_position',{nodeId:back,x:52,y:330});
await fw('rotate_nodes',{nodeIds:[back],rotation:6});
await fw('resize_nodes',{nodeIds:[front],width:290,height:310});
await fw('set_position',{nodeId:front,x:212,y:300});
// bas de carte : bouton de l'étape 1 (faux CTA), fondu par le dégradé
await rect(front,{x:20,y:240,w:250,h:40,r:10,fill:C.blue,name:'Continuer'});
await text(front,'Continuer',{x:110,y:251,size:14,family:'Inter',style:'Semi Bold',color:C.white,ls:0});
await rect(back,{x:18,y:182,w:214,h:30,r:8,fill:{r:0.965,g:0.965,b:0.965},stroke:{color:C.greyLine}});
await text(back,'Entreprise',{x:30,y:190,size:11.5,family:'Inter',style:'Medium',color:C.greyText,ls:0});
await fw('reorder_nodes',{nodeIds:[front],index:1});
await fw('set_position',{nodeId:hand,x:400,y:322});
const k = await fw('get_design_context',{nodeId:'5406:10808',detail:'minimal',depth:1});
console.log(k.nodes[0].children.map(c=>c.name).join(' | '));
close();
