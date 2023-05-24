(()=>{"use strict";var e={980:function(e,t){var n,s=this&&this.__classPrivateFieldGet||function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};Object.defineProperty(t,"__esModule",{value:!0}),t.IconUI=void 0;const i="kukai-icon";t.IconUI=class{constructor(){n.set(this,(()=>document.getElementById(i)))}async init(e,t){var r;if(this.isInit)throw new Error("Kukai-Embed Already Present");{let a=document.createElement("button");a.id=i;let o=document.createElement("img");o.style.width="60px",o.style.height="60px",o.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEhQTFRF0dH/amn+urn/o6L+8/P/U1L+9PP/Xl3+mJf+3dz/gYD+3Nz/xcX/jIz+jIv+o6P/dXT+urr/xsX/6Oj/r67/////R0b+////pIBhiAAAABh0Uk5T//////////////////////////////8AzRMu6gAAAaZJREFUeNqsl9uSgyAMhgNyUNS2eyB9/zddXHW1QAKW/ccrhm8MSUgCPAkpkN2vJChqD2RBOVs8yc5SVcLgMCMHFbC0SMjKAgwCGQlgYNVjQb2i4FFgUWLMw5PGCukpB0uslEzhavZE7/CEFzS9wqO+AuvxDCuBlyTUCe7xovoDBrws+IMTox/Rin3EPhE7HEdJD94P59037/0tE68Fju9RH/b6/pX1Jr5jK5ycGJbN8Mp6nzl1+BwPu5VNfuEWWCELC/PLmjQTVIAlC9NscBk8Zw5mWJwDbBl4CRrFBn+DQhpm2XBoABousAggafiDZ1FCR8Irm+TloY6GN9YPb8CH7i2wF2/B5pM1nIWN0F+c4R0ZqjVGjjNckkmyxZczHMj03HLDGtpwxV+MvSZlDbelKxk0UIbPxWIQyjCVKrJchhC/CcNVRQFEbbIV0FWV3j3Yj1zpTfwdw1vg77min7gs7hgofLxytJu40WmIehXeTLwi6BYrYtfquG/C/zT3trGiaaBpG6Xahri28bFtcG0bmduG9bZnQuMDpfFp1Pgoq38O/ggwACoyIQpeKqtUAAAAAElFTkSuQmCC",a.innerHTML=o.outerHTML,t?a.className=t:(a.style.width="60px",a.style.height="60px",a.style.bottom="40px",a.style.left="40px",a.style.position="fixed",a.style.borderRadius="50px",a.style.boxShadow="2px 2px 3px #999",a.style.padding="0",a.style.border="0"),a.style.zIndex="99998",a.style.display="none",document.body.appendChild(a),null===(r=s(this,n).call(this))||void 0===r||r.addEventListener("click",e)}}get isInit(){return!!s(this,n).call(this)}deinit(){const e=s(this,n).call(this);e&&document.body.removeChild(e)}show(){const e=s(this,n).call(this);e&&(e.style.display="block")}hide(){const e=s(this,n).call(this);e&&(e.style.display="none")}},n=new WeakMap},771:function(e,t,n){var s,i,r=this&&this.__classPrivateFieldSet||function(e,t,n){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,n),n},a=this&&this.__classPrivateFieldGet||function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};Object.defineProperty(t,"__esModule",{value:!0}),t.IFrameKukai=void 0;const o=n(308),l="kukai-iframe";t.IFrameKukai=class{constructor(e){s.set(this,void 0),i.set(this,(()=>document.getElementById(l))),r(this,s,e)}show(){const e=a(this,i).call(this);e&&(e.style.display="block")}hide(){const e=a(this,i).call(this);e&&(e.style.display="none")}isHidden(){const e=a(this,i).call(this);return"none"===(null==e?void 0:e.style.display)}toCard(){const e=a(this,i).call(this);e&&(e.style.position="fixed",e.style.top="",e.style.bottom="70px",e.style.left="70px",e.style.borderRadius="10px",e.style.border="0",e.style.width="400px",e.style.height="200px")}isCard(){const e=a(this,i).call(this);return"10px"===(null==e?void 0:e.style.borderRadius)}toFullScreen(){const e=a(this,i).call(this);e&&(e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.borderRadius="0px",e.style.border="0",e.style.width="100%",e.style.height="100%")}async init(e){if(a(this,i).call(this))throw new Error("Kukai-Embed Already Present");{let t=document.createElement("iframe");const n=e?`?instanceId=${e}`:"";t.src=a(this,s)+"/embedded"+n,t.id=l,t.style.zIndex="99999",t.style.display="none",t.sandbox.add("allow-scripts"),t.sandbox.add("allow-same-origin"),t.sandbox.add("allow-popups"),t.sandbox.add("allow-forms");const{promise:i,deferred:r}=o.defer();try{return t.addEventListener("load",(()=>r.resolve())),document.body.appendChild(t),await i.then((()=>this.toFullScreen()))}catch(e){throw r.reject(e),e}}}get isInit(){return!!a(this,i).call(this)}deinit(){const e=a(this,i).call(this);e&&document.body.removeChild(e)}request(e){var t,n;null===(n=null===(t=a(this,i).call(this))||void 0===t?void 0:t.contentWindow)||void 0===n||n.postMessage(JSON.stringify(e),a(this,s)?a(this,s):"*")}},s=new WeakMap,i=new WeakMap},257:function(e,t,n){var s,i,r,a,o=this&&this.__createBinding||(Object.create?function(e,t,n,s){void 0===s&&(s=n),Object.defineProperty(e,s,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,s){void 0===s&&(s=n),e[s]=t[n]}),l=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||Object.prototype.hasOwnProperty.call(t,n)||o(t,e,n)},c=this&&this.__classPrivateFieldSet||function(e,t,n){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,n),n},h=this&&this.__classPrivateFieldGet||function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};Object.defineProperty(t,"__esModule",{value:!0}),t.KukaiEmbed=t.Networks=void 0;const d=n(272);Object.defineProperty(t,"Networks",{enumerable:!0,get:function(){return d.Networks}});const u=n(308),p=n(771),E=n(980),w=n(163);l(n(272),t);const R="kukai-embed-instance-id";t.KukaiEmbed=class{constructor(e={}){s.set(this,void 0),i.set(this,void 0),r.set(this,null),a.set(this,null);const t={net:d.Networks.mainnet,icon:!1,enableLogging:void 0!==e.net&&e.net!==d.Networks.mainnet,...e},n=u.networkToSrc(t.net),o=new p.IFrameKukai(n);c(this,s,o),c(this,i,new w.KukaiMessaging(o,n,t.enableLogging)),t.icon&&c(this,r,new E.IconUI)}async init(){var e;if(this.initialized)throw new Error("Kukai-Embed Already Present");const t=window.sessionStorage.getItem(R)||void 0;let n=async e=>{let n=h(this,i).init(window);return h(this,s).init(t),await n};if(t){const i=window.sessionStorage.getItem(t);i?(await n(),c(this,a,JSON.parse(i)),h(this,s).toCard(),h(this,s).hide(),null===(e=h(this,r))||void 0===e||e.init((()=>this.toggle())).then((()=>{var e;return null===(e=h(this,r))||void 0===e?void 0:e.show()}))):await n()}else await n()}get initialized(){return h(this,s).isInit&&h(this,i).isInit}deinit(){var e;h(this,i).deinit(),h(this,s).deinit(),null===(e=h(this,r))||void 0===e||e.deinit()}get user(){return h(this,a)}async login(e={}){var t;if(!this.initialized)throw new Error("Cannot login: Embed Uninitialized");if(null===(t=this.user)||void 0===t?void 0:t.pk)throw new Error("Already logged in");if(!this.user&&"high"===(null==e?void 0:e.customPrio)){let t=JSON.parse(JSON.stringify(e));t.customPrio=d.LoginPrio.Low;const n=await this.login(t);if(null==n?void 0:n.pk)return n}return h(this,s).toFullScreen(),h(this,s).show(),await h(this,i).login(e).then((({pk:t,pkh:n,userData:o,instanceId:l})=>{var d;return window.sessionStorage.setItem(R,l),window.sessionStorage.setItem(l,JSON.stringify({pk:t,pkh:n,userData:o})),null===(d=h(this,r))||void 0===d||d.init((()=>this.toggle())).then((()=>{var e;return null===(e=h(this,r))||void 0===e?void 0:e.show()})),c(this,a,{pk:t,pkh:n,userData:o}),e.customSpinnerDismissal?{...h(this,a),dismissCallback:async()=>await h(this,i).dismiss().finally((()=>{h(this,s).hide(),h(this,s).toCard()}))}:h(this,a)})).catch((t=>{throw e.customSpinnerDismissal=!1,t})).finally((()=>{e.customSpinnerDismissal||(h(this,s).hide(),h(this,s).toCard())}))}async logout(){if(!this.initialized)throw new Error("Cannot logout: Embed Uninitialized");return h(this,s).isCard()&&!h(this,s).isHidden()&&await h(this,i).card(!1),await h(this,i).logout().then((e=>{var t,n;try{const e=window.sessionStorage.getItem(R)||void 0;e&&window.sessionStorage.removeItem(e)}catch(e){}window.sessionStorage.removeItem(R),h(this,s).hide(),null===(t=h(this,r))||void 0===t||t.hide(),null===(n=h(this,r))||void 0===n||n.deinit(),c(this,a,null)})).finally((()=>h(this,s).hide()))}async send(e,t){if(!this.initialized)throw new Error("Cannot send: Embed Uninitialized");return(null==t?void 0:t.silent)||(h(this,s).isCard()&&!h(this,s).isHidden()&&await h(this,i).card(!1),h(this,s).toFullScreen(),h(this,s).show()),await h(this,i).operation(e,t).then((e=>e.opHash)).finally((()=>{(null==t?void 0:t.silent)||(h(this,s).toCard(),h(this,s).hide())}))}async trackOperation(e){if(!this.initialized)throw new Error("Cannot track: Embed Uninitialized");return await h(this,i).track(e)}async signExpr(e,t){if(!this.initialized)throw new Error("Cannot sign: Embed Uninitialized");return h(this,s).isCard()&&!h(this,s).isHidden()&&await h(this,i).card(!1),h(this,s).toFullScreen(),h(this,s).show(),await h(this,i).signExpr(e,t).then((e=>e.signature)).finally((()=>{h(this,s).hide(),h(this,s).toCard()}))}async authenticate(e,t){if(!this.initialized)throw new Error("Cannot authenticate: Embed Uninitialized");return await h(this,i).authenticate(e,t).then((({message:e,signature:t})=>({message:e,signature:t})))}async toggle(){h(this,s).isHidden()?(h(this,s).toCard(),h(this,s).show(),h(this,i).card(!0)):await h(this,i).card(!1).then((()=>{h(this,s).hide()}))}},s=new WeakMap,i=new WeakMap,r=new WeakMap,a=new WeakMap},163:function(e,t,n){var s,i,r,a,o,l,c,h,d,u,p,E,w,R,T,_,A,y,g,N=this&&this.__classPrivateFieldSet||function(e,t,n){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,n),n},O=this&&this.__classPrivateFieldGet||function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};Object.defineProperty(t,"__esModule",{value:!0}),t.KukaiMessaging=void 0;const f=n(272),S=n(308);class m{constructor(e){s.set(this,{}),i.set(this,void 0),N(this,i,e)}async listen(e){const{promise:t,deferred:n}=S.defer();return O(this,s)[e]=n,await t}handle(e){var t;const n=O(this,i).call(this,e);null===(t=O(this,s)[n])||void 0===t||t.resolve(e),delete O(this,s)[n]}}s=new WeakMap,i=new WeakMap;class k{constructor(){r.set(this,[])}async listen(){const{promise:e,deferred:t}=S.defer();return O(this,r).push(t),await e}get length(){return O(this,r).length}handle(e){var t;null===(t=O(this,r).shift())||void 0===t||t.resolve(e)}}r=new WeakMap;class v{constructor(){a.set(this,null)}async listen(){if(O(this,a))throw new Error("OCCUPIED");{const{promise:e,deferred:t}=S.defer();return N(this,a,t),await e}}handle(e){var t;null===(t=O(this,a))||void 0===t||t.resolve(e),N(this,a,null)}}a=new WeakMap;class P{constructor(e,t){o.set(this,void 0),l.set(this,void 0),c.set(this,new v),h.set(this,new k),d.set(this,new k),u.set(this,new v),p.set(this,new m((e=>e.opHash))),E.set(this,new k),w.set(this,new k),R.set(this,new k),T.set(this,new k),_.set(this,(e=>{switch(e.type){case f.ResponseTypes.cardResponse:O(this,h).handle(e);break;case f.ResponseTypes.loginResponse:O(this,d).handle(e);break;case f.ResponseTypes.operationResponse:O(this,u).handle(e);break;case f.ResponseTypes.trackResponse:O(this,p).handle(e);break;case f.ResponseTypes.logoutResponse:O(this,E).handle(e);break;case f.ResponseTypes.signExprResponse:O(this,w).handle(e);break;case f.ResponseTypes.authResponse:O(this,R).handle(e);break;case f.ResponseTypes.initComplete:O(this,c).handle(e);break;case f.ResponseTypes.dismissResponse:O(this,T).handle(e)}})),N(this,o,e),N(this,l,t)}async init(){return await O(this,c).listen()}async login(){return await O(this,d).listen()}async operation(){return await O(this,u).listen()}async track(e){return await O(this,p).listen(e)}async logout(){return await O(this,E).listen()}async signExpr(){return await O(this,w).listen()}async auth(){return await O(this,R).listen()}async card(){return await O(this,h).listen()}async dismiss(){return await O(this,T).listen()}handleEvent(e){if("message"===e.type&&e.origin===O(this,o)){O(this,l)&&console.log(`Received ${e.data} from ${e.origin}`);const t=JSON.parse(e.data);O(this,_).call(this,t)}else console.warn(e.origin)}}o=new WeakMap,l=new WeakMap,c=new WeakMap,h=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,E=new WeakMap,w=new WeakMap,R=new WeakMap,T=new WeakMap,_=new WeakMap,t.KukaiMessaging=class{constructor(e,t,n){A.set(this,void 0),y.set(this,void 0),g.set(this,null),N(this,y,e),N(this,A,new P(t,n))}async init(e){if(O(this,g))throw new Error("Already Initialized");return N(this,g,e),e.addEventListener("message",O(this,A)),await O(this,A).init().then((e=>{if(e.failed)throw new Error("Init Failed: "+e.error)}))}get isInit(){return!!O(this,g)}deinit(){O(this,g)&&(O(this,g).removeEventListener("message",O(this,A)),N(this,g,null))}async card(e){return O(this,y).request({type:f.RequestTypes.cardRequest,show:e}),await O(this,A).card().then((e=>{if(e.failed)throw new Error("Card Failed: "+e.error)}))}async login(e){return O(this,y).request({type:f.RequestTypes.loginRequest,config:e}),await O(this,A).login().then((e=>{if(e.failed)throw new Error("Login Failed: "+e.error);return e}))}async operation(e,t){return O(this,y).request({type:f.RequestTypes.operationRequest,operations:e,ui:t}),await O(this,A).operation().then((e=>{if(e.failed)throw new Error("Operation Failed: "+e.error);return e})).catch((e=>{throw"OCCUPIED"===e.message?new Error("Cannot send: Operation in progress"):e}))}async track(e){return O(this,y).request({type:f.RequestTypes.trackRequest,opHash:e}),await O(this,A).track(e).then((e=>{if(e.failed)throw new Error("Track Failed: "+e.error);return e}))}async logout(){return O(this,y).request({type:f.RequestTypes.logoutRequest}),await O(this,A).logout().then((e=>{if(e.failed)throw new Error("Logout Failed: "+e.error);return e}))}async signExpr(e,t){return O(this,y).request({type:f.RequestTypes.signExprRequest,expr:e,ui:t}),await O(this,A).signExpr().then((e=>{if(e.failed)throw new Error("Signing Failed: "+e.error);return e}))}async authenticate(e,t){return O(this,y).request({type:f.RequestTypes.authRequest,id:e,nonce:t}),await O(this,A).auth().then((e=>{if(e.failed)throw new Error("Auth Failed: "+e.error);return e}))}async dismiss(){return O(this,y).request({type:f.RequestTypes.dismissRequest}),await O(this,A).dismiss().then((e=>{if(e.failed)throw new Error("Dismiss Failed: "+e.error)}))}},A=new WeakMap,y=new WeakMap,g=new WeakMap},272:(e,t)=>{var n,s,i,r,a;Object.defineProperty(t,"__esModule",{value:!0}),t.ResponseTypes=t.RequestTypes=t.LoginPrio=t.TypeOfLogin=t.Networks=void 0,(a=t.Networks||(t.Networks={})).mainnet="mainnet",a.ghostnet="ghostnet",a.ithacanet="ithacanet",a.jakartanet="jakartanet",a.kathmandu="kathmandu",a.dev="dev",a.local="local",(r=t.TypeOfLogin||(t.TypeOfLogin={})).Google="google",r.Reddit="reddit",r.Twitter="twitter",r.Facebook="facebook",(i=t.LoginPrio||(t.LoginPrio={})).LowFast="low_always_skip_key",i.Low="low",i.High="high",(s=t.RequestTypes||(t.RequestTypes={})).loginRequest="login_request",s.operationRequest="operation_request",s.trackRequest="track_request",s.logoutRequest="logout_request",s.signExprRequest="sign_expr_request",s.authRequest="authentication_request",s.cardRequest="card_request",s.dismissRequest="dismiss_request",(n=t.ResponseTypes||(t.ResponseTypes={})).initComplete="init_complete",n.loginResponse="login_response",n.operationResponse="operation_response",n.trackResponse="track_response",n.logoutResponse="logout_response",n.signExprResponse="sign_expr_response",n.authResponse="authentication_response",n.cardResponse="card_response",n.dismissResponse="dismiss_response"},308:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.networkToSrc=t.defer=void 0;const s=n(272);t.defer=()=>{let e={resolve:e=>{},reject:e=>{}};const t=new Promise(((t,n)=>{e={resolve:t,reject:n}}));return{deferred:e,promise:t}},t.networkToSrc=e=>{switch(e){case s.Networks.mainnet:return"https://wallet.kukai.app";case s.Networks.ghostnet:return"https://ghostnet.kukai.app";case s.Networks.ithacanet:return"https://ithacanet.kukai.app";case s.Networks.jakartanet:return"https://jakartanet.kukai.app";case s.Networks.kathmandu:return"https://kathmandu.kukai.app";case s.Networks.dev:return"https://ichabod-dev.kukai.app";case s.Networks.local:return"http://localhost:4200";default:return e}}}},t={};function n(s){var i=t[s];if(void 0!==i)return i.exports;var r=t[s]={exports:{}};return e[s].call(r.exports,r,r.exports,n),r.exports}(()=>{var e,t,s,i,r,a,o,l,c,h,d,u,p,E=n(257);!function(e){e.BlockchainRequest="blockchain_request",e.PermissionRequest="permission_request",e.SignPayloadRequest="sign_payload_request",e.OperationRequest="operation_request",e.BroadcastRequest="broadcast_request",e.BlockchainResponse="blockchain_response",e.PermissionResponse="permission_response",e.SignPayloadResponse="sign_payload_response",e.OperationResponse="operation_response",e.BroadcastResponse="broadcast_response",e.Acknowledge="acknowledge",e.Disconnect="disconnect",e.Error="error"}(e||(e={})),function(e){e.SIGN="sign",e.OPERATION_REQUEST="operation_request",e.ENCRYPT="encrypt",e.NOTIFICATION="notification",e.THRESHOLD="threshold"}(t||(t={})),function(e){e.MAINNET="mainnet",e.GHOSTNET="ghostnet",e.MONDAYNET="mondaynet",e.DAILYNET="dailynet",e.DELPHINET="delphinet",e.EDONET="edonet",e.FLORENCENET="florencenet",e.GRANADANET="granadanet",e.HANGZHOUNET="hangzhounet",e.ITHACANET="ithacanet",e.JAKARTANET="jakartanet",e.KATHMANDUNET="kathmandunet",e.LIMANET="limanet",e.MUMBAINET="mumbainet",e.NAIROBINET="nairobinet",e.CUSTOM="custom"}(s||(s={})),function(e){e.ENDORSEMENT="endorsement",e.SEED_NONCE_REVELATION="seed_nonce_revelation",e.DOUBLE_ENDORSEMENT_EVIDENCE="double_endorsement_evidence",e.DOUBLE_BAKING_EVIDENCE="double_baking_evidence",e.ACTIVATE_ACCOUNT="activate_account",e.PROPOSALS="proposals",e.BALLOT="ballot",e.REVEAL="reveal",e.TRANSACTION="transaction",e.ORIGINATION="origination",e.DELEGATION="delegation"}(i||(i={})),function(e){e.WEBSITE="website",e.EXTENSION="extension",e.P2P="p2p",e.WALLETCONNECT="walletconnect"}(r||(r={})),function(e){e.BACKGROUND="toBackground",e.PAGE="toPage",e.EXTENSION="toExtension"}(a||(a={})),function(e){e.BROADCAST_ERROR="BROADCAST_ERROR",e.NETWORK_NOT_SUPPORTED="NETWORK_NOT_SUPPORTED",e.NO_ADDRESS_ERROR="NO_ADDRESS_ERROR",e.NO_PRIVATE_KEY_FOUND_ERROR="NO_PRIVATE_KEY_FOUND_ERROR",e.NOT_GRANTED_ERROR="NOT_GRANTED_ERROR",e.PARAMETERS_INVALID_ERROR="PARAMETERS_INVALID_ERROR",e.TOO_MANY_OPERATIONS="TOO_MANY_OPERATIONS",e.TRANSACTION_INVALID_ERROR="TRANSACTION_INVALID_ERROR",e.SIGNATURE_TYPE_NOT_SUPPORTED="SIGNATURE_TYPE_NOT_SUPPORTED",e.ABORTED_ERROR="ABORTED_ERROR",e.UNKNOWN_ERROR="UNKNOWN_ERROR"}(o||(o={})),function(e){e.NOT_CONNECTED="NOT_CONNECTED",e.CONNECTING="CONNECTING",e.CONNECTED="CONNECTED"}(l||(l={})),function(e){e.CHROME_MESSAGE="chrome_message",e.WALLETCONNECT="walletconnect",e.POST_MESSAGE="post_message",e.LEDGER="ledger",e.P2P="p2p"}(c||(c={})),function(e){e.TRANSPORT_P2P_PEERS_DAPP="beacon:communication-peers-dapp",e.TRANSPORT_P2P_PEERS_WALLET="beacon:communication-peers-wallet",e.TRANSPORT_POSTMESSAGE_PEERS_DAPP="beacon:postmessage-peers-dapp",e.TRANSPORT_POSTMESSAGE_PEERS_WALLET="beacon:postmessage-peers-wallet",e.TRANSPORT_WALLETCONNECT_PEERS_DAPP="beacon:walletconnect-peers-dapp",e.LAST_SELECTED_WALLET="beacon:last-selected-wallet",e.ACCOUNTS="beacon:accounts",e.ACTIVE_ACCOUNT="beacon:active-account",e.PUSH_TOKENS="beacon:push-tokens",e.BEACON_SDK_SECRET_SEED="beacon:sdk-secret-seed",e.APP_METADATA_LIST="beacon:app-metadata-list",e.PERMISSION_LIST="beacon:permissions",e.BEACON_SDK_VERSION="beacon:sdk_version",e.MATRIX_PRESERVED_STATE="beacon:sdk-matrix-preserved-state",e.MATRIX_PEER_ROOM_IDS="beacon:matrix-peer-rooms",e.MATRIX_SELECTED_NODE="beacon:matrix-selected-node",e.MULTI_NODE_SETUP_DONE="beacon:multi-node-setup"}(h||(h={})),h.TRANSPORT_P2P_PEERS_DAPP,h.TRANSPORT_P2P_PEERS_WALLET,h.TRANSPORT_POSTMESSAGE_PEERS_DAPP,h.TRANSPORT_POSTMESSAGE_PEERS_WALLET,h.TRANSPORT_WALLETCONNECT_PEERS_DAPP,h.LAST_SELECTED_WALLET,h.ACCOUNTS,h.ACTIVE_ACCOUNT,h.PUSH_TOKENS,h.BEACON_SDK_SECRET_SEED,h.APP_METADATA_LIST,h.PERMISSION_LIST,h.BEACON_SDK_VERSION,h.MATRIX_PRESERVED_STATE,h.MATRIX_PEER_ROOM_IDS,h.MATRIX_SELECTED_NODE,h.MULTI_NODE_SETUP_DONE,function(e){e.RAW="raw",e.OPERATION="operation",e.MICHELINE="micheline"}(d||(d={})),function(e){e.LIGHT="light",e.DARK="dark"}(u||(u={})),function(e){e.EUROPE_EAST="europe-east",e.EUROPE_WEST="europe-west",e.NORTH_AMERICA_EAST="north-america-east",e.NORTH_AMERICA_WEST="north-america-west",e.CENTRAL_AMERICA="central-america",e.SOUTH_AMERICA="south-america",e.ASIA_EAST="asia-east",e.ASIA_WEST="asia-west",e.AFRICA="africa",e.AUSTRALIA="australia"}(p||(p={}));var w,R=function(e,t,n,s){return new(n||(n=Promise))((function(i,r){function a(e){try{l(s.next(e))}catch(e){r(e)}}function o(e){try{l(s.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,o)}l((s=s.apply(e,t||[])).next())}))},T=function(e,t){var n,s,i,r,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return r={next:o(0),throw:o(1),return:o(2)},"function"==typeof Symbol&&(r[Symbol.iterator]=function(){return this}),r;function o(o){return function(l){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;r&&(r=0,o[0]&&(a=0)),a;)try{if(n=1,s&&(i=2&o[0]?s.return:o[0]?s.throw||((i=s.return)&&i.call(s),0):s.next)&&!(i=i.call(s,o[1])).done)return i;switch(s=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,s=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!((i=(i=a.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],s=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,l])}}};function _(e,t){var n={publicKey:t,address:e};window.unityInstance.SendMessage("UnityBeacon","OnAccountConnected",JSON.stringify(n))}window.ConnectAccount=function(){return R(this,void 0,void 0,(function(){var e;return T(this,(function(t){switch(t.label){case 0:return null===w.user?[3,1]:(console.log("user already logged in, pkh IS ".concat(w.user.pkh)),_(w.user.pkh,w.user.pk),[3,4]);case 1:return t.trys.push([1,3,,4]),[4,w.login()];case 2:return t.sent(),_(w.user.pkh,w.user.pk),[3,4];case 3:return e=t.sent(),n=e,console.error("error during permission request",n),window.unityInstance.SendMessage("UnityBeacon","OnAccountFailedToConnect",JSON.stringify(n)),[3,4];case 4:return[2]}var n}))}))},window.SetNetwork=function(e,t){return R(this,void 0,void 0,(function(){return T(this,(function(t){switch(t.label){case 0:return(null==w?void 0:w.initialized)?[2]:[4,(w=new E.KukaiEmbed({net:e})).init()];case 1:return t.sent(),[2]}}))}))},window.GetActiveAccountAddress=function(){return w.user.pkh},window.SendContract=function(e,t,n,s){return R(this,void 0,void 0,(function(){var r,a,o;return T(this,(function(l){switch(l.label){case 0:r=[{kind:i.TRANSACTION,amount:t,destination:e,parameters:{entrypoint:n,value:JSON.parse(s)}}],l.label=1;case 1:return l.trys.push([1,3,,4]),[4,w.send(r)];case 2:return a=l.sent(),window.unityInstance.SendMessage("UnityBeacon","OnContractCallCompleted",JSON.stringify(a)),[3,4];case 3:return o=l.sent(),window.unityInstance.SendMessage("UnityBeacon","OnContractCallFailed",JSON.stringify(o)),[3,4];case 4:return[2]}}))}))},window.SignPayload=function(e,t){return R(this,void 0,void 0,(function(){var e;return T(this,(function(n){switch(n.label){case 0:return[4,w.signExpr(t)];case 1:return e=n.sent(),window.unityInstance.SendMessage("UnityBeacon","OnPayloadSigned",JSON.stringify(e)),[2]}}))}))}})()})();