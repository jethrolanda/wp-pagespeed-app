import*as e from"@wordpress/interactivity";var t={d:(e,s)=>{for(var o in s)t.o(s,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:s[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};const s=(o={getContext:()=>e.getContext,getElement:()=>e.getElement,store:()=>e.store},r={},t.d(r,o),r);var o,r;async function a(e,t){try{const s=e.map((async e=>{const s=await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${e}&${t}&key=AIzaSyBEQiaTL4wMnMCQA2WABjuIAOXLaL5LUo0`).then((e=>e.json()));let o={url:e};return s?.lighthouseResult?.categories?.performance?.score&&(o={...o,performance:Math.round(100*s?.lighthouseResult?.categories?.performance?.score)}),s?.lighthouseResult?.categories?.accessibility?.score&&(o={...o,accessibility:Math.round(100*s?.lighthouseResult?.categories?.accessibility?.score)}),s?.lighthouseResult?.categories?.["best-practices"]?.score&&(o={...o,best_practices:Math.round(100*s?.lighthouseResult?.categories?.["best-practices"]?.score)}),s?.lighthouseResult?.categories?.seo?.score&&(o={...o,seo:Math.round(100*s?.lighthouseResult?.categories?.seo?.score)}),o}));return await Promise.all(s)}catch(e){console.log(e)}}async function c(e,t){try{const s=await fetch(`${e}wp-json/wp/v2/pages${t}`);if(!s.ok)throw new Error("Failed to fetch data");const o=(await s.json()).map((e=>e?.link));return{totalPages:s?.headers.get("x-wp-totalpages"),urls:o}}catch(e){console.error(e)}}const{state:n,callbacks:i}=(0,s.store)("pagespeed-app",{state:{performanceSorted:!1,accessibilitySorted:!1,bestPracticesSorted:!1,seoSorted:!1,get isNotEmpty(){return(0,s.getContext)().pagespeedResults.length>0},get isPerformanceSelected(){return(0,s.getContext)().category.includes("performance")},get isAccessibility(){return(0,s.getContext)().category.includes("accessibility")},get isBestPracticesSelected(){return(0,s.getContext)().category.includes("best-practices")},get isSeoSelected(){return(0,s.getContext)().category.includes("seo")},get progressPercentage(){const e=(0,s.getContext)(),t=Math.round(e.page/e.totalPages*100);return`${t<5?"5":t}%`},get getStatus(){const e=(0,s.getContext)();return`${e.page} out of ${e.totalPages}`}},actions:{submit:async()=>{const e=(0,s.getContext)();if(e.pagespeedResults=[],i.isUrlValid()){e.bgcolor="#fff",e.processing=!0,e.isDone=!1,e.submitBtnText="Processing...";try{for(;!e.isDone;){console.log(e.isDone,e.page);const t=`?page=${e.page}`,s=await c(e.url,t);e.totalPages=s?.totalPages,e.status=`Page ${e.page} out of ${e.totalPages}`;const o=`strategy=${e.device}&category=${e.category.join("&category=")}`,r=await a(s?.urls,o);e.pagespeedResults=[...e.pagespeedResults,...r],console.log(e.pagespeedResults),e.page<parseInt(e.totalPages)?e.page+=1:(e.isDone=!0,e.status="")}}catch(e){console.log(e),alert("Error: Make sure the site is powered by wordpress")}finally{e.processing=!1,e.submitBtnText="Submit",e.bgcolor=""}}else alert("Invalid URL")},downloadCSV:()=>{const e=(0,s.getContext)();e.pagespeedResults.length<=0&&alert("Please generate a report first.");const t=Object.keys(e.pagespeedResults[0]),o=[];o.push(t),e.pagespeedResults.forEach((e=>{o.push(Object.values(e))}));let r="";o.forEach((e=>{r+=e.join(",")+"\n"}));const a=new Blob([r],{type:"text/csv;charset=utf-8,"}),c=URL.createObjectURL(a),n=document.createElement("a");n.setAttribute("href",c),n.setAttribute("download",`Pagespeed report for ${i.getDomainNameFromUrl()} - ${(new Date).toLocaleString()}.csv`),n.click()}},callbacks:{setUrl:()=>{const e=(0,s.getContext)(),{ref:t}=(0,s.getElement)();e.url=t.value},setOptions:()=>{const e=(0,s.getContext)(),{post_types:t,category:o}=e,{ref:r}=(0,s.getElement)();switch(r.name){case"device":e.device=r.value;break;case"post_types":t.includes(r.value)?e.post_types.splice(t.indexOf(r.value),1):e.post_types.push(r.value);break;case"category":o.includes(r.value)?e.category.splice(o.indexOf(r.value),1):e.category.push(r.value)}},isUrlValid:()=>{try{const e=(0,s.getContext)();return new RegExp("^([a-zA-Z]+:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i").test(e.url)}catch(e){return!1}},getDomainNameFromUrl:()=>{const e=(0,s.getContext)();return new URL(e.url).host},sortPerformance:()=>{const e=(0,s.getContext)();e.pagespeedResults=e.pagespeedResults.sort(((e,t)=>n.performanceSorted?t?.performance-e?.performance:e?.performance-t?.performance)),n.performanceSorted=!n.performanceSorted},sortAccessibility:()=>{const e=(0,s.getContext)();e.pagespeedResults=e.pagespeedResults.sort(((e,t)=>n.accessibilitySorted?t?.accessibility-e?.accessibility:e?.accessibility-t?.accessibility)),n.accessibilitySorted=!n.accessibilitySorted},sortBestPractices:()=>{const e=(0,s.getContext)();e.pagespeedResults=e.pagespeedResults.sort(((e,t)=>n.bestPracticesSorted?t?.best_practices-e?.best_practices:e?.best_practices-t?.best_practices)),n.bestPracticesSorted=!n.bestPracticesSorted},sortSeo:()=>{const e=(0,s.getContext)();e.pagespeedResults=e.pagespeedResults.sort(((e,t)=>n.seoSorted?t?.seo-e?.seo:e?.seo-t?.seo)),n.seoSorted=!n.seoSorted}}});