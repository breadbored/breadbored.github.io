(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[980],{7995:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/archive/[slug]",function(){return a(9284)}])},9105:function(e,t,a){"use strict";var s=a(5893),n=a(6967),r=a(3282),l=a(7294),i=a(8442),c=a(8579);function d(e,t){return"string"==typeof t||"number"==typeof t||"bigint"==typeof t?e+t:l.isValidElement(t)?l.Children.toArray(t.props.children).reduce(d,e):e}function o(e){return t=>{var a=l.Children.toArray(t.children).reduce(d,"").toLowerCase().replace(/\W/g,"-");return l.createElement("h"+e,{id:a},t.children)}}let h=e=>t=>{var a,n;let{href:r,children:l}=t;if(r&&(null===(a=r.match(/^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/gi))||void 0===a?void 0:a.length)>0){let t=e.find(e=>(null==e?void 0:e.url)===r);if(t)return(0,s.jsx)(i.default,{post:{message:"Post fetched successfully",data:t,lastUpdated:new Date().toISOString()}})}if(l&&l.match&&(null===(n=l.match(/^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/gi))||void 0===n?void 0:n.length)>0){let t=e.find(e=>(null==e?void 0:e.url)===l);if(t)return(0,s.jsx)(i.default,{post:{message:"Post fetched successfully",data:t,lastUpdated:new Date().toISOString()}})}return t.children};t.Z=e=>{let{post:t}=e,[a,i]=(0,l.useState)(!1),d=new Date(t.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});return(0,l.useEffect)(()=>{i(!0),c.Z.highlightAll()},[]),(0,s.jsxs)("article",{className:"max-w-2xl mx-auto px-4",children:[(0,s.jsx)("h1",{className:"text-4xl font-bold mb-4",children:t.title}),(0,s.jsx)("div",{className:"mb-8 text-gray-600",children:d}),(0,s.jsx)("div",{className:"prose max-w-none",children:a?(0,s.jsx)(n.U,{children:t.content,components:{h1:o(1),h2:o(2),h3:o(3),h4:o(4),h5:o(5),h6:o(6),p:h(t.skeets)},rehypePlugins:[r.Z]}):(0,s.jsx)(n.U,{children:t.content,components:{h1:o(1),h2:o(2),h3:o(3),h4:o(4),h5:o(5),h6:o(6),p:h(t.skeets)}})})]})}},9284:function(e,t,a){"use strict";a.r(t),a.d(t,{__N_SSG:function(){return n}});var s=a(9105),n=!0;t.default=s.Z},8442:function(e,t,a){"use strict";a.r(t),a.d(t,{__N_SSG:function(){return i},default:function(){return d},isBlueSkyLink:function(){return c}});var s=a(5893),n=e=>{let{name:t,title:a,alt_text:n="",extra_classes:r="",icon_size:l=16,style:i={},svg_style:c={},vote:d,use_classes:o="",onKeyPress:h,onClick:u}=e,m=0,p=0;return"number"==typeof l?(m=l,p=l):(m=l.width,p=l.height),(0,s.jsx)(s.Fragment,{children:(0,s.jsxs)("span",{className:"icon".concat(d?"-vote":""," ").concat(r),style:i,title:a,onKeyPress:h,onClick:u,children:[""!=n?(0,s.jsx)("img",{src:"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E",alt:n,className:"icon__alt","aria-hidden":"true",width:"0",height:"0"}):(0,s.jsx)(s.Fragment,{}),(0,s.jsx)("svg",{width:m,height:p,style:c,children:(0,s.jsx)("use",{xlinkHref:"".concat("/assets/icons.svg","#").concat(t),className:o})})]})})};let r=e=>{"number"==typeof e&&(e=new Date(1e3*e));let t="".concat(e.getMonth()+1).padStart(2,"0"),a="".concat(e.getDate()).padStart(2,"0"),s=e.getFullYear();return"".concat(a,".").concat(t,".").concat(s)},l=e=>{"number"==typeof e&&(e=new Date(1e3*e));let t="0".concat(e.getMinutes()).slice(-2);return"".concat(e.getHours(),":").concat(t)};var i=!0;let c=e=>e.includes("bsky.app")&&e.match(/^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/);var d=e=>{var t,a;let{post:i}=e,c=new Date(i.data?i.data.createdAt:0),d="https://bsky.app/profile/".concat(null===(t=i.data)||void 0===t?void 0:t.author.displayName,".").concat(null===(a=i.data)||void 0===a?void 0:a.author.handle);return(0,s.jsx)(s.Fragment,{children:i&&i.data&&(0,s.jsxs)("div",{className:"bsky",children:[(0,s.jsxs)("div",{className:"bsky-header",children:[(0,s.jsx)("div",{className:"bsky-avatar",children:(0,s.jsx)("img",{src:i.data.author.avatar,alt:"avatar",className:"profile-image-m"})}),(0,s.jsx)("div",{className:"bsky-author",children:(0,s.jsxs)("a",{href:d,className:"bsky-author-link",target:"_blank",children:[(0,s.jsx)("span",{className:"bsky-author-display-name",children:i.data.author.displayName}),(0,s.jsx)("br",{}),(0,s.jsx)("span",{className:"bsky-author-handle",children:i.data.author.handle})]})})]}),(0,s.jsxs)("div",{className:"bsky-content",children:[(0,s.jsx)("p",{className:"bsky-text",style:{whiteSpace:"pre-wrap",textAlign:"left"},children:i.data.text}),(0,s.jsx)("div",{className:"bsky-images",children:i.data.embed&&i.data.embed.images&&i.data.embed.images.map((e,t)=>(0,s.jsx)("img",{src:e.image_url,alt:e.alt,className:"bsky-image"},"bsky-image-".concat(t)))})]}),(0,s.jsxs)("div",{className:"bsky-footer",children:[(0,s.jsxs)("div",{className:"bsky-date",children:[r(c)," ",l(c)]}),(0,s.jsx)("div",{className:"bsky-icon",children:(0,s.jsx)(n,{name:"blue-sky",extra_classes:"no-invert",alt_text:"Blue Sky Logo",icon_size:20})})]})]},i.data.uri)})}}},function(e){e.O(0,[811,888,774,179],function(){return e(e.s=7995)}),_N_E=e.O()}]);