(this["webpackJsonpcreate-react-app-with-typescript"]=this["webpackJsonpcreate-react-app-with-typescript"]||[]).push([[0],{13:function(e,t,r){e.exports={container:"Board_container__15NyP",row1:"Board_row1__1nHv1",row2:"Board_row2__TNkut",row3:"Board_row3__eGlZY"}},45:function(e,t,r){"use strict";r.r(t);var n=r(0),o=r.n(n),c=r(26),i=r.n(c),a=r(55),s=r(56),d=r(12),u=[{id:"1",name:"All",notes:"This is the root note",type:"folder",timelineOrderIndex:0},{id:"4",parentId:"2",name:"All",notes:"This is the root note",type:"todo",timelineOrderIndex:0},{id:"2",parentId:"1",name:"All",notes:"This is the root note",type:"todo",timelineOrderIndex:0}],j=r(24),l=r(25),p=r(2),h=function(){var e=o.a.createContext(void 0);return[function(){var t=o.a.useContext(e);if(!t)throw new Error("useGenericContext must be used within a Provider");return t},e.Provider]}(),b=Object(d.a)(h,2),O=b[0],v=b[1],x=function(e){var t=e.children,r=n.useState(u),o=Object(d.a)(r,2),c=o[0],i=(o[1],function(e){var t=Object(l.keyBy)(e.map((function(e){return Object(j.a)(Object(j.a)({},e),{},{children:[]})})),"id"),r=Object(l.cloneDeep)(t),n=[];return Object.values(r).forEach((function(e){e.parentId?r[e.parentId].children.push(e):n.push(e)})),{todoDict:t,todoTree:n[0]}}(c)),a=i.todoDict,s=i.todoTree;return Object(p.jsx)(v,{value:{todoDict:a,todoTree:s},children:t})},w=r(13),m=r.n(w),f=function(){var e=O().todoDict;return Object(p.jsxs)("div",{className:m.a.container,children:[Object(p.jsx)("div",{className:m.a.row1,children:Object.values(e).map((function(e){return e.id}))}),Object(p.jsx)("div",{className:m.a.row2}),Object(p.jsx)("div",{className:m.a.row3})]})},_=function(){return Object(p.jsx)(x,{children:Object(p.jsx)(f,{})})},y=r(29),I=Object(y.a)({});i.a.render(Object(p.jsxs)(s.a,{theme:I,children:[Object(p.jsx)(a.a,{}),Object(p.jsx)(_,{})]}),document.querySelector("#root"))}},[[45,1,2]]]);
//# sourceMappingURL=main.85dbe294.chunk.js.map