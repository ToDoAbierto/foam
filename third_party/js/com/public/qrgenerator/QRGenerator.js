/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http:www.apache.org/licenses/LICENSE-2.0
 */

CLASS({
    name: 'QRGenerator',
    package: 'com.public.qrgenerator',

    documentation: function() {/*
      Repackaging of a public domain QR Generator.

Quick overview: QR code composed of 2D array of modules (a rectangular
area that conveys one bit of information); some modules are fixed to help
the recognition of the code, and remaining data modules are further divided
into 8-bit code words which are augumented by Reed-Solomon error correcting
codes (ECC). There could be multiple ECCs, in the case the code is so large
that it is helpful to split the raw data into several chunks.

The number of modules is determined by the code's "version", ranging from 1
(21x21) to 40 (177x177). How many ECC bits are used is determined by the
ECC level (L/M/Q/H). The number and size (and thus the order of generator
polynomial) of ECCs depend to the version and ECC level.


 the public interface is trivial; the options available are as follows:

 - version: an integer in [1,40]. when omitted (or -1) the smallest possible
   version is chosen.
 - mode: one of 'numeric', 'alphanumeric', 'octet'. when omitted the smallest
   possible mode is chosen.
 - ecclevel: one of 'L', 'M', 'Q', 'H'. defaults to 'L'.
 - mask: an integer in [0,7]. when omitted (or -1) the best mask is chosen.

 for generate{HTML,PNG}:

 - modulesize: a number. this is a size of each modules in pixels, and
   defaults to 5px.
 - margin: a number. this is a size of margin in *modules*, and defaults to
   4 (white modules). the specficiation mandates the margin no less than 4
   modules, so it is better not to alter this value unless you know what
   you're doing.

    */},

    properties: [
      {
        name: 'qrcode',
        lazyFactory: function() {
          var QRCode;
          !function(){for(var VERSIONS=[null,[[10,7,17,13],[1,1,1,1],[]],[[16,10,28,22],[1,1,1,1],[4,16]],[[26,15,22,18],[1,1,2,2],[4,20]],[[18,20,16,26],[2,1,4,2],[4,24]],[[24,26,22,18],[2,1,4,4],[4,28]],[[16,18,28,24],[4,2,4,4],[4,32]],[[18,20,26,18],[4,2,5,6],[4,20,36]],[[22,24,26,22],[4,2,6,6],[4,22,40]],[[22,30,24,20],[5,2,8,8],[4,24,44]],[[26,18,28,24],[5,4,8,8],[4,26,48]],[[30,20,24,28],[5,4,11,8],[4,28,52]],[[22,24,28,26],[8,4,11,10],[4,30,56]],[[22,26,22,24],[9,4,16,12],[4,32,60]],[[24,30,24,20],[9,4,16,16],[4,24,44,64]],[[24,22,24,30],[10,6,18,12],[4,24,46,68]],[[28,24,30,24],[10,6,16,17],[4,24,48,72]],[[28,28,28,28],[11,6,19,16],[4,28,52,76]],[[26,30,28,28],[13,6,21,18],[4,28,54,80]],[[26,28,26,26],[14,7,25,21],[4,28,56,84]],[[26,28,28,30],[16,8,25,20],[4,32,60,88]],[[26,28,30,28],[17,8,25,23],[4,26,48,70,92]],[[28,28,24,30],[17,9,34,23],[4,24,48,72,96]],[[28,30,30,30],[18,9,30,25],[4,28,52,76,100]],[[28,30,30,30],[20,10,32,27],[4,26,52,78,104]],[[28,26,30,30],[21,12,35,29],[4,30,56,82,108]],[[28,28,30,28],[23,12,37,34],[4,28,56,84,112]],[[28,30,30,30],[25,12,40,34],[4,32,60,88,116]],[[28,30,30,30],[26,13,42,35],[4,24,48,72,96,120]],[[28,30,30,30],[28,14,45,38],[4,28,52,76,100,124]],[[28,30,30,30],[29,15,48,40],[4,24,50,76,102,128]],[[28,30,30,30],[31,16,51,43],[4,28,54,80,106,132]],[[28,30,30,30],[33,17,54,45],[4,32,58,84,110,136]],[[28,30,30,30],[35,18,57,48],[4,28,56,84,112,140]],[[28,30,30,30],[37,19,60,51],[4,32,60,88,116,144]],[[28,30,30,30],[38,19,63,53],[4,28,52,76,100,124,148]],[[28,30,30,30],[40,20,66,56],[4,22,48,74,100,126,152]],[[28,30,30,30],[43,21,70,59],[4,26,52,78,104,130,156]],[[28,30,30,30],[45,22,74,62],[4,30,56,82,108,134,160]],[[28,30,30,30],[47,24,77,65],[4,24,52,80,108,136,164]],[[28,30,30,30],[49,25,81,68],[4,28,56,84,112,140,168]]],MODE_TERMINATOR=0,MODE_NUMERIC=1,MODE_ALPHANUMERIC=2,MODE_OCTET=4,MODE_KANJI=8,NUMERIC_REGEXP=/^\d*$/,ALPHANUMERIC_REGEXP=/^[A-Za-z0-9 $%*+\-./:]*$/,ALPHANUMERIC_OUT_REGEXP=/^[A-Z0-9 $%*+\-./:]*$/,ECCLEVEL_L=1,ECCLEVEL_M=0,ECCLEVEL_Q=3,ECCLEVEL_H=2,GF256_MAP=[],GF256_INVMAP=[-1],i=0,v=1;255>i;++i)GF256_MAP.push(v),GF256_INVMAP[v]=i,v=2*v^(v>=128?285:0);for(var GF256_GENPOLY=[[]],i=0;30>i;++i){for(var prevpoly=GF256_GENPOLY[i],poly=[],j=0;i>=j;++j){var a=i>j?GF256_MAP[prevpoly[j]]:0,b=GF256_MAP[(i+(prevpoly[j-1]||0))%255];poly.push(GF256_INVMAP[a^b])}GF256_GENPOLY.push(poly)}for(var ALPHANUMERIC_MAP={},i=0;45>i;++i)ALPHANUMERIC_MAP["0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".charAt(i)]=i;var MASKFUNCS=[function(i,j){return(i+j)%2==0},function(i){return i%2==0},function(i,j){return j%3==0},function(i,j){return(i+j)%3==0},function(i,j){return((i/2|0)+(j/3|0))%2==0},function(i,j){return i*j%2+i*j%3==0},function(i,j){return(i*j%2+i*j%3)%2==0},function(i,j){return((i+j)%2+i*j%3)%2==0}],needsverinfo=function(ver){return ver>6},getsizebyver=function(ver){return 4*ver+17},nfullbits=function(ver){var v=VERSIONS[ver],nbits=16*ver*ver+128*ver+64;return needsverinfo(ver)&&(nbits-=36),v[2].length&&(nbits-=25*v[2].length*v[2].length-10*v[2].length-55),nbits},ndatabits=function(ver,ecclevel){var nbits=-8&nfullbits(ver),v=VERSIONS[ver];return nbits-=8*v[0][ecclevel]*v[1][ecclevel]},ndatalenbits=function(ver,mode){switch(mode){case MODE_NUMERIC:return 10>ver?10:27>ver?12:14;case MODE_ALPHANUMERIC:return 10>ver?9:27>ver?11:13;case MODE_OCTET:return 10>ver?8:16;case MODE_KANJI:return 10>ver?8:27>ver?10:12}},getmaxdatalen=function(ver,mode,ecclevel){var nbits=ndatabits(ver,ecclevel)-4-ndatalenbits(ver,mode);switch(mode){case MODE_NUMERIC:return 3*(nbits/10|0)+(4>nbits%10?0:7>nbits%10?1:2);case MODE_ALPHANUMERIC:return 2*(nbits/11|0)+(6>nbits%11?0:1);case MODE_OCTET:return nbits/8|0;case MODE_KANJI:return nbits/13|0}},validatedata=function(mode,data){switch(mode){case MODE_NUMERIC:return data.match(NUMERIC_REGEXP)?data:null;case MODE_ALPHANUMERIC:return data.match(ALPHANUMERIC_REGEXP)?data.toUpperCase():null;case MODE_OCTET:if("string"==typeof data){for(var newdata=[],i=0;i<data.length;++i){var ch=data.charCodeAt(i);128>ch?newdata.push(ch):2048>ch?newdata.push(192|ch>>6,128|63&ch):65536>ch?newdata.push(224|ch>>12,128|ch>>6&63,128|63&ch):newdata.push(240|ch>>18,128|ch>>12&63,128|ch>>6&63,128|63&ch)}return newdata}return data}},encode=function(ver,mode,data,maxbuflen){var buf=[],bits=0,remaining=8,datalen=data.length,pack=function(x,n){if(n>=remaining){for(buf.push(bits|x>>(n-=remaining));n>=8;)buf.push(x>>(n-=8)&255);bits=0,remaining=8}n>0&&(bits|=(x&(1<<n)-1)<<(remaining-=n))},nlenbits=ndatalenbits(ver,mode);switch(pack(mode,4),pack(datalen,nlenbits),mode){case MODE_NUMERIC:for(var i=2;datalen>i;i+=3)pack(parseInt(data.substring(i-2,i+1),10),10);pack(parseInt(data.substring(i-2),10),[0,4,7][datalen%3]);break;case MODE_ALPHANUMERIC:for(var i=1;datalen>i;i+=2)pack(45*ALPHANUMERIC_MAP[data.charAt(i-1)]+ALPHANUMERIC_MAP[data.charAt(i)],11);datalen%2==1&&pack(ALPHANUMERIC_MAP[data.charAt(i-1)],6);break;case MODE_OCTET:for(var i=0;datalen>i;++i)pack(data[i],8)}for(pack(MODE_TERMINATOR,4),8>remaining&&buf.push(bits);buf.length+1<maxbuflen;)buf.push(236,17);return buf.length<maxbuflen&&buf.push(236),buf},calculateecc=function(poly,genpoly){for(var modulus=poly.slice(0),polylen=poly.length,genpolylen=genpoly.length,i=0;genpolylen>i;++i)modulus.push(0);for(var i=0;polylen>i;){var quotient=GF256_INVMAP[modulus[i++]];if(quotient>=0)for(var j=0;genpolylen>j;++j)modulus[i+j]^=GF256_MAP[(quotient+genpoly[j])%255]}return modulus.slice(polylen)},augumenteccs=function(poly,nblocks,genpoly){for(var subsizes=[],subsize=poly.length/nblocks|0,subsize0=0,pivot=nblocks-poly.length%nblocks,i=0;pivot>i;++i)subsizes.push(subsize0),subsize0+=subsize;for(var i=pivot;nblocks>i;++i)subsizes.push(subsize0),subsize0+=subsize+1;subsizes.push(subsize0);for(var eccs=[],i=0;nblocks>i;++i)eccs.push(calculateecc(poly.slice(subsizes[i],subsizes[i+1]),genpoly));for(var result=[],nitemsperblock=poly.length/nblocks|0,i=0;nitemsperblock>i;++i)for(var j=0;nblocks>j;++j)result.push(poly[subsizes[j]+i]);for(var j=pivot;nblocks>j;++j)result.push(poly[subsizes[j+1]-1]);for(var i=0;i<genpoly.length;++i)for(var j=0;nblocks>j;++j)result.push(eccs[j][i]);return result},augumentbch=function(poly,p,genpoly,q){for(var modulus=poly<<q,i=p-1;i>=0;--i)modulus>>q+i&1&&(modulus^=genpoly<<i);return poly<<q|modulus},makebasematrix=function(ver){for(var v=VERSIONS[ver],n=getsizebyver(ver),matrix=[],reserved=[],i=0;n>i;++i)matrix.push([]),reserved.push([]);var blit=function(y,x,h,w,bits){for(var i=0;h>i;++i)for(var j=0;w>j;++j)matrix[y+i][x+j]=bits[i]>>j&1,reserved[y+i][x+j]=1};blit(0,0,9,9,[127,65,93,93,93,65,383,0,64]),blit(n-8,0,8,9,[256,127,65,93,93,93,65,127]),blit(0,n-8,9,8,[254,130,186,186,186,130,254,0,0]);for(var i=9;n-8>i;++i)matrix[6][i]=matrix[i][6]=1&~i,reserved[6][i]=reserved[i][6]=1;for(var aligns=v[2],m=aligns.length,i=0;m>i;++i)for(var minj=0==i||i==m-1?1:0,maxj=0==i?m-1:m,j=minj;maxj>j;++j)blit(aligns[i],aligns[j],5,5,[31,17,21,17,31]);if(needsverinfo(ver))for(var code=augumentbch(ver,6,7973,12),k=0,i=0;6>i;++i)for(var j=0;3>j;++j)matrix[i][n-11+j]=matrix[n-11+j][i]=code>>k++&1,reserved[i][n-11+j]=reserved[n-11+j][i]=1;return{matrix:matrix,reserved:reserved}},putdata=function(matrix,reserved,buf){for(var n=matrix.length,k=0,dir=-1,i=n-1;i>=0;i-=2){6==i&&--i;for(var jj=0>dir?n-1:0,j=0;n>j;++j){for(var ii=i;ii>i-2;--ii)reserved[jj][ii]||(matrix[jj][ii]=buf[k>>3]>>(7&~k)&1,++k);jj+=dir}dir=-dir}return matrix},maskdata=function(matrix,reserved,mask){for(var maskf=MASKFUNCS[mask],n=matrix.length,i=0;n>i;++i)for(var j=0;n>j;++j)reserved[i][j]||(matrix[i][j]^=maskf(i,j));return matrix},putformatinfo=function(matrix,reserved,ecclevel,mask){for(var n=matrix.length,code=21522^augumentbch(ecclevel<<3|mask,5,1335,10),i=0;15>i;++i){var r=[0,1,2,3,4,5,7,8,n-7,n-6,n-5,n-4,n-3,n-2,n-1][i],c=[n-1,n-2,n-3,n-4,n-5,n-6,n-7,n-8,7,5,4,3,2,1,0][i];matrix[r][8]=matrix[8][c]=code>>i&1}return matrix},evaluatematrix=function(matrix){for(var PENALTY_CONSECUTIVE=3,PENALTY_TWOBYTWO=3,PENALTY_FINDERLIKE=40,PENALTY_DENSITY=10,evaluategroup=function(groups){for(var score=0,i=0;i<groups.length;++i)groups[i]>=5&&(score+=PENALTY_CONSECUTIVE+(groups[i]-5));for(var i=5;i<groups.length;i+=2){var p=groups[i];groups[i-1]==p&&groups[i-2]==3*p&&groups[i-3]==p&&groups[i-4]==p&&(groups[i-5]>=4*p||groups[i+1]>=4*p)&&(score+=PENALTY_FINDERLIKE)}return score},n=matrix.length,score=0,nblacks=0,i=0;n>i;++i){var groups,row=matrix[i];groups=[0];for(var j=0;n>j;){var k;for(k=0;n>j&&row[j];++k)++j;for(groups.push(k),k=0;n>j&&!row[j];++k)++j;groups.push(k)}score+=evaluategroup(groups),groups=[0];for(var j=0;n>j;){var k;for(k=0;n>j&&matrix[j][i];++k)++j;for(groups.push(k),k=0;n>j&&!matrix[j][i];++k)++j;groups.push(k)}score+=evaluategroup(groups);var nextrow=matrix[i+1]||[];nblacks+=row[0];for(var j=1;n>j;++j){var p=row[j];nblacks+=p,row[j-1]==p&&nextrow[j]===p&&nextrow[j-1]===p&&(score+=PENALTY_TWOBYTWO)}}return score+=PENALTY_DENSITY*(Math.abs(nblacks/n/n-.5)/.05|0)},generate=function(data,ver,mode,ecclevel,mask){var v=VERSIONS[ver],buf=encode(ver,mode,data,ndatabits(ver,ecclevel)>>3);buf=augumenteccs(buf,v[1][ecclevel],GF256_GENPOLY[v[0][ecclevel]]);var result=makebasematrix(ver),matrix=result.matrix,reserved=result.reserved;if(putdata(matrix,reserved,buf),0>mask){maskdata(matrix,reserved,0),putformatinfo(matrix,reserved,ecclevel,0);var bestmask=0,bestscore=evaluatematrix(matrix);for(maskdata(matrix,reserved,0),mask=1;8>mask;++mask){maskdata(matrix,reserved,mask),putformatinfo(matrix,reserved,ecclevel,mask);var score=evaluatematrix(matrix);bestscore>score&&(bestscore=score,bestmask=mask),maskdata(matrix,reserved,mask)}mask=bestmask}return maskdata(matrix,reserved,mask),putformatinfo(matrix,reserved,ecclevel,mask),matrix};QRCode={generate:function(data,options){var MODES={numeric:MODE_NUMERIC,alphanumeric:MODE_ALPHANUMERIC,octet:MODE_OCTET},ECCLEVELS={L:ECCLEVEL_L,M:ECCLEVEL_M,Q:ECCLEVEL_Q,H:ECCLEVEL_H};options=options||{};var ver=options.version||-1,ecclevel=ECCLEVELS[(options.ecclevel||"L").toUpperCase()],mode=options.mode?MODES[options.mode.toLowerCase()]:-1,mask="mask"in options?options.mask:-1;if(0>mode)mode="string"==typeof data?data.match(NUMERIC_REGEXP)?MODE_NUMERIC:data.match(ALPHANUMERIC_OUT_REGEXP)?MODE_ALPHANUMERIC:MODE_OCTET:MODE_OCTET;else if(mode!=MODE_NUMERIC&&mode!=MODE_ALPHANUMERIC&&mode!=MODE_OCTET)throw"invalid or unsupported mode";if(data=validatedata(mode,data),null===data)throw"invalid data format";if(0>ecclevel||ecclevel>3)throw"invalid ECC level";if(0>ver){for(ver=1;40>=ver&&!(data.length<=getmaxdatalen(ver,mode,ecclevel));++ver);if(ver>40)throw"too large data"}else if(1>ver||ver>40)throw"invalid version";if(-1!=mask&&(0>mask||mask>8))throw"invalid mask";return generate(data,ver,mode,ecclevel,mask)},generateHTML:function(data,options){options=options||{};for(var matrix=QRCode.generate(data,options),modsize=Math.max(options.modulesize||5,.5),margin=Math.max(null!==options.margin?options.margin:4,0),e=document.createElement("div"),n=matrix.length,html=['<table border="0" cellspacing="0" cellpadding="0" style="border:'+modsize*margin+'px solid #fff;background:#fff">'],i=0;n>i;++i){html.push("<tr>");for(var j=0;n>j;++j)html.push('<td style="width:'+modsize+"px;height:"+modsize+"px"+(matrix[i][j]?";background:#000":"")+'"></td>');html.push("</tr>")}return e.className="qrcode",e.innerHTML=html.join("")+"</table>",e},generateSVG:function(data,options){options=options||{};var matrix=QRCode.generate(data,options),n=matrix.length,modsize=Math.max(options.modulesize||5,.5),margin=Math.max(options.margin?options.margin:4,0),size=modsize*(n+2*margin),common=' class= "fg" width="'+modsize+'" height="'+modsize+'"/>',e=document.createElementNS("http:www.w3.org/2000/svg","svg");e.setAttribute("viewBox","0 0 "+size+" "+size),e.setAttribute("style","shape-rendering:crispEdges");for(var svg=["<style scoped>.bg{fill:#FFF}.fg{fill:#000}</style>",'<rect class="bg" x="0" y="0"','width="'+size+'" height="'+size+'"/>'],yo=margin*modsize,y=0;n>y;++y){for(var xo=margin*modsize,x=0;n>x;++x)matrix[y][x]&&svg.push('<rect x="'+xo+'" y="'+yo+'"',common),xo+=modsize;yo+=modsize}return e.innerHTML=svg.join(""),e},generatePNG:function(data,options){options=options||{};var context,matrix=QRCode.generate(data,options),modsize=Math.max(options.modulesize||5,.5),margin=Math.max(options.margin?options.margin:4,0),n=matrix.length,size=modsize*(n+2*margin),canvas=document.createElement("canvas");if(canvas.width=canvas.height=size,context=canvas.getContext("2d"),!context)throw"canvas support is needed for PNG output";context.fillStyle="#fff",context.fillRect(0,0,size,size),context.fillStyle="#000";for(var i=0;n>i;++i)for(var j=0;n>j;++j)matrix[i][j]&&context.fillRect(modsize*(margin+j),modsize*(margin+i),modsize,modsize);return canvas.toDataURL()}}}();
          return QRCode;
        }
      }
    ],
});
