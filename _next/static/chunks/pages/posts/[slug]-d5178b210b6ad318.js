(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[922],{592:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/posts/[slug]",function(){return a(5394)}])},9105:function(e,t,a){"use strict";var n=a(5838),s=a(6439),r=a(5893),i=a(1794),c=a(3282),l=a(7294),o=a(8442),d=a(8579),h=a(9008),m=a.n(h),u=a(2710);function g(e,t){return"string"==typeof t||"number"==typeof t||"bigint"==typeof t?e+t:l.isValidElement(t)?l.Children.toArray(t.props.children).reduce(g,e):e}function p(e){return t=>{var a=l.Children.toArray(t.children).reduce(g,"").toLowerCase().replace(/\W/g,"-");return l.createElement("h"+e,{id:a},t.children)}}let x=e=>t=>{var a,i;let{href:c,children:l}=t;if(c&&(null===(a=c.match(/^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/gi))||void 0===a?void 0:a.length)>0){let t=e.find(e=>(null==e?void 0:e.url)===c);if(t)return(0,r.jsx)(o.default,{post:{message:"Post fetched successfully",data:t,lastUpdated:new Date().toISOString()}})}if(l&&l.match&&(null===(i=l.match(/^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/gi))||void 0===i?void 0:i.length)>0){let t=e.find(e=>(null==e?void 0:e.url)===l);if(t)return(0,r.jsx)(o.default,{post:{message:"Post fetched successfully",data:t,lastUpdated:new Date().toISOString()}})}return(0,r.jsx)("p",(0,s._)((0,n._)({},t),{children:t.children}))};t.Z=e=>{let{post:t}=e,[a,n]=(0,l.useState)(!1),s=new Date(t.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});return(0,l.useEffect)(()=>{n(!0),d.Z.highlightAll()},[]),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(m(),{children:[(0,r.jsxs)("title",{children:[t.title," - bread.codes"]}),(0,r.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),(0,r.jsx)("meta",{name:"theme-color",content:"#333333"}),(0,r.jsx)("meta",{name:"title",content:"bread.codes"}),(0,r.jsx)("meta",{name:"author",content:"BreadCodes"}),(0,r.jsx)("meta",{name:"description",content:t.excerpt}),(0,r.jsx)("meta",{name:"keywords",content:(t.categories&&t.categories.length>0?t.categories.join(", ")+", ":"")+"bread.codes, breadcodes, breadbored, bread bored, bread, bored, brad, code, codes, programming, web development, software engineering, software, engineering, web, development, blog, tech, technology, computer, science, computer science, game boy, gameboy, game boy advance, GBA, gameboy advance, hacking, reverse engineering, reverse, engineering, pokemon, pokemon hacking, pokemon reverse engineering, nintendo hacking, nintendo reverse engineering, nintendo, gamefreak, game freak"}),(0,r.jsx)("meta",{name:"google-adsense-account",content:"ca-pub-8749505090904262"})]}),(0,r.jsxs)("article",{className:"max-w-2xl mx-auto px-4",children:[(0,r.jsx)("h1",{className:"text-4xl font-bold mb-4",children:t.title}),(0,r.jsx)("div",{className:"mb-8 text-gray-600",children:s}),(0,r.jsx)("div",{className:"prose max-w-none",children:a?(0,r.jsx)(i.U,{remarkPlugins:[u.Z],children:t.content,components:{h1:p(1),h2:p(2),h3:p(3),h4:p(4),h5:p(5),h6:p(6),p:x(t.skeets)},rehypePlugins:[c.Z]}):(0,r.jsx)(i.U,{remarkPlugins:[u.Z],children:t.content,components:{h1:p(1),h2:p(2),h3:p(3),h4:p(4),h5:p(5),h6:p(6),p:x(t.skeets)}})})]})]})}},8442:function(e,t,a){"use strict";a.r(t),a.d(t,{__N_SSG:function(){return c},default:function(){return o},isBlueSkyLink:function(){return l}});var n=a(5893),s=e=>{let{name:t,title:a,alt_text:s="",extra_classes:r="",icon_size:i=16,style:c={},svg_style:l={},vote:o,use_classes:d="",onKeyPress:h,onClick:m}=e,u=0,g=0;return"number"==typeof i?(u=i,g=i):(u=i.width,g=i.height),(0,n.jsx)(n.Fragment,{children:(0,n.jsxs)("span",{className:"icon".concat(o?"-vote":""," ").concat(r),style:c,title:a,onKeyPress:h,onClick:m,children:[""!=s?(0,n.jsx)("img",{src:"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E",alt:s,className:"icon__alt","aria-hidden":"true",width:"0",height:"0"}):(0,n.jsx)(n.Fragment,{}),(0,n.jsx)("svg",{width:u,height:g,style:l,children:(0,n.jsx)("use",{xlinkHref:"".concat("/assets/icons.svg","#").concat(t),className:d})})]})})};let r=e=>{"number"==typeof e&&(e=new Date(1e3*e));let t="".concat(e.getMonth()+1).padStart(2,"0"),a="".concat(e.getDate()).padStart(2,"0"),n=e.getFullYear();return"".concat(a,".").concat(t,".").concat(n)},i=e=>{"number"==typeof e&&(e=new Date(1e3*e));let t="0".concat(e.getMinutes()).slice(-2);return"".concat(e.getHours(),":").concat(t)};var c=!0;let l=e=>e.includes("bsky.app")&&e.match(/^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/);var o=e=>{var t,a;let{post:c}=e,l=new Date(c.data?c.data.createdAt:0),o="https://bsky.app/profile/".concat(null===(t=c.data)||void 0===t?void 0:t.author.displayName,".").concat(null===(a=c.data)||void 0===a?void 0:a.author.handle);return(0,n.jsx)(n.Fragment,{children:c&&c.data&&(0,n.jsxs)("div",{className:"bsky",children:[(0,n.jsxs)("div",{className:"bsky-header",children:[(0,n.jsx)("div",{className:"bsky-avatar",children:(0,n.jsx)("img",{src:c.data.author.avatar,alt:"avatar",className:"profile-image-m"})}),(0,n.jsx)("div",{className:"bsky-author",children:(0,n.jsxs)("a",{href:o,className:"bsky-author-link",target:"_blank",children:[(0,n.jsx)("span",{className:"bsky-author-display-name",children:c.data.author.displayName}),(0,n.jsx)("br",{}),(0,n.jsx)("span",{className:"bsky-author-handle",children:c.data.author.handle})]})})]}),(0,n.jsxs)("div",{className:"bsky-content",children:[(0,n.jsx)("p",{className:"bsky-text",style:{whiteSpace:"pre-wrap",textAlign:"left"},children:c.data.text}),(0,n.jsx)("div",{className:"bsky-images",children:c.data.embed&&c.data.embed.images&&c.data.embed.images.map((e,t)=>(0,n.jsx)("img",{src:e.image_url,alt:e.alt,className:"bsky-image"},"bsky-image-".concat(t)))})]}),(0,n.jsxs)("div",{className:"bsky-footer",children:[(0,n.jsxs)("div",{className:"bsky-date",children:[r(l)," ",i(l)]}),(0,n.jsx)("div",{className:"bsky-icon",children:(0,n.jsx)(s,{name:"blue-sky",extra_classes:"no-invert",alt_text:"Blue Sky Logo",icon_size:20})})]})]},c.data.uri)})}},5394:function(e,t,a){"use strict";a.r(t),a.d(t,{__N_SSG:function(){return s}});var n=a(9105),s=!0;t.default=n.Z}},function(e){e.O(0,[385,888,774,179],function(){return e(e.s=592)}),_N_E=e.O()}]);