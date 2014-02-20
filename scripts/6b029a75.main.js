define("config",function(){function a(a){for(var b,c,d,e=[],f=0,g=a.length;g>f;f++)b=a.charCodeAt(f),0==(128&b)?e.push(a[f]):192==(224&b)?(c=a.charCodeAt(++f),e.push(String.fromCharCode((31&b)<<6|63&c))):224==(240&b)&&(c=a.charCodeAt(++f),d=a.charCodeAt(++f),e.push(String.fromCharCode((15&b)<<12|(63&c)<<6|(63&d)<<0)));return e.join("")}var b="data",c="https://api.github.com/repos/mlhch/articles",d={articlesTags:c+"/git/refs/tags",recentArticles:c+"/git/refs/heads",articleBlob:function(a,c){return b+"/articles/blob/"+a+"/"+c},articleTree:function(a){return c+"/git/trees/"+a},thumbnail:function(a,c){return b+"/showcase/thumbnail/"+a+"/200@"+c+".png"},snapshot:function(a,c){return b+"/showcase/snapshot/"+a+"/"+c+".png"},showcase:function(a){return a}};return{utf8to16:a,urls:d,recentArticles:function(a,b){$.getJSON(d.recentArticles).done(a).fail(b)},articlesTags:function(b,c){$.getJSON(d.articlesTags).done(function(c){b(c.map(function(b){return b.ref.replace(/^refs\/tags\//,"").split(".").map(function(b){return a(atob(b))}).join("|")}))}).fail(c)},articleBlob:function(b,c,e,f){$.getJSON(d.articleTree(c)).done(function(c){$.getJSON(c.tree[0].url).done(function(c){e({title:b,content:a(atob(c.content.replace(/\n/g,"")))})}).fail(f)}).fail(f)}}}),require({waitSeconds:0,map:{"*":{css:"require-css/css.min"}},paths:{moment:"momentjs/moment",angular:"angular/angular.min",d3:"d3/d3.min"},shim:{angular:{exports:"angular"},d3:{exports:"d3"}},baseUrl:"bower_components"}),define("fancybox",["fancybox/source/jquery.fancybox.pack","css!fancybox/source/jquery.fancybox"],function(){return $.fancybox}),define("tagsdata",["config"],function(a){function b(){e.forEach(function(a){c?a[0](c):a[1]()})}var c,d,e=[];return function(f,g){"loaded"===d?c?f(c):g():(e.push([f,g]),d||(d="loading",a.articlesTags(function(a){d="loaded",c=a,b()},b)))}}),function(a){function b(b,d){function e(){for(var b,c,d,e,g=a(window).scrollTop(),j=a(window).height(),m=k.length-1;anchor=k[m];m--)if(!b&&(g>=anchor.offsetTop||0==m)){b=anchor,m<k.length-1&&(c=k[m+1]);break}if(location.hash!=="#"+b.id){h.onSectionChange&&h.onSectionChange(b.id);var n=b.id,o=a("#"+n);o.length&&o.attr("id",""),location.hash="#"+n,o.length&&o.attr("id",n)}d=i.find('a[href="#'+b.id+'"]'),e=c&&i.find('a[href="#'+c.id+'"]');var p,q,r,s=Math.max(0,b.offsetTop);0>g?(p=1+g/100,q=0,r=d.width()*p):g>document.body.offsetHeight-j?(p=(g-(document.body.offsetHeight-j))/100,q=d.width()*p,r=d.width()*(1-p)):c?(p=(g-s)/(c.offsetTop-Math.max(0,b.offsetTop)),q=(e.offset().left-d.offset().left)*p,r=d.width()+(e.width()-d.width())*p):(g-=81,q=0,r=d.width()),l.css({left:f(d)+q+"px",width:r+"px"})}function f(a){return a.offset().left+(a.outerWidth()-a.width())/2}function g(b){var c=a(b),d=c.offset().top,e=a(window).scrollTop();m&&clearInterval(m),m=setInterval(function(){e+=(d-e)/10,window.scrollTo(0,Math.round(e)),d==Math.round(e)&&(clearInterval(m),b.match(/^#.+$/)&&setTimeout(function(){window.location.hash=b},100))},10)}var h=a.extend({},c,d),i=a(b),j=i.find("a:first"),k=(i.find("a:last"),a(h.anchorSelector)),l=a('<div class="indicator"></div>').insertAfter(i);if(!(k.length<2)){l.css({top:i.offset().top+i.height()+"px",left:f(j)+"px",width:j.width()+"px"}),a(window).scroll(e),a(window).resize(e),i.find("a").click(function(a){g(this.hash),a.preventDefault()});var m;this.scrollTo=g}}a.fn.smooth=function(a){return new b(this[0],a)};var c={anchorSelector:".section .anchor"}}(jQuery),$(document).ready(function(){var a=$(".menu").smooth({onSectionChange:function(a){$(".menu").parent().find("select").val("#"+a)}});$(".menu").parent().find("select").change(function(){a.scrollTo(this.value)})}),require(["angular","moment","config"],function(a,b,c){a.element(document).ready(function(){a.module("app",[]).controller("MainCtrl",["$scope",function(a){function d(){a.recent=g.slice(e,e+f)}a.status="loading",a.statusClasses={failure:"alert-box warning",loading:"loading",success:"ng-hide"};var e=0,f=25,g=[];c.recentArticles(function(e){a.$apply(function(){a.status="success",g=e.map(function(a){var d=a.ref.match(/^refs\/heads\/(\d+)_(.+)$/);return d?{time:b(1e3*d[1]).fromNow(),title:c.utf8to16(atob(d[2])),sha:a.object.sha}:null}).filter(function(a){return!!a}).reverse(),d()})},function(){a.$apply(function(){a.status="failure",a.errMsg="No response from server"})}),a.isFirst=function(){return 0===e},a.isLast=function(){return e+f===g.length},a.recentGoPrev=function(){e=Math.max(0,e-f),d()},a.recentGoNext=function(){e=Math.min(g.length-f,e+f),d()},a.recentLoaded=function(){return g.length},a.showArticle=function(a){require(["fancybox"],function(b){b.showLoading(),c.articleBlob(a.title,a.sha,function(a){b(a.content,{title:a.title,margin:[50,50,50,50]})},function(){alert("Sorry, server no response")})})}}]),document.body.setAttribute("ng-controller","MainCtrl"),a.bootstrap(document.body,["app"])})}),require(["d3","tagsdata","config"],function(a,b,c){function d(a){var b=[];return $(".skills :checkbox").each(function(a,c){c.checked&&b.push(c.name)}),a.filter(function(a){return b.some(function(b){return a.categories&&a.categories[b]})})}function e(a){var b=[];return $(".skills :checkbox").each(function(a,c){c.checked&&b.push(c.name)}),a.filter(function(a){return b.some(function(b){var c=a.source.categories,d=a.target.categories;return c&&c[b]&&d&&d[b]})})}function f(a,b,c){function d(a,c,d,e){var g=f[a];return g||b.push(f[a]=g={name:c,categories:{},links:[],group:1==e?"skill":""}),g.categories[d]=1,g}function e(a,b){var d=a.name+"<-->"+b.name;f[d]||(c.push(link=f[d]={source:a,target:b}),a.links.push(link),b.links.push(link))}var f={};b.forEach(function(a){f[a.name]=a}),a.forEach(function(a){var c,f=0,g="",h=a.split("|"),i=h.pop().replace(/^.*? - /g,""),j=h.shift();"Showcase"==j?d("|"+h.join("|"),h.pop(),i):(c=d(b[0]&&b[0].name||"","Root",j,f++),h.forEach(function(a){e(c,c=d(g+="|"+a,a,j,f++))}),e(c,d(g+"|"+i,i,j,f++)))})}function g(a,b){b.forEach(function(a){"Skill"===a.source.name?(a.strength=1,a.distance=80):"skill"===a.source.group&&(a.strength=1,a.distance=40),a.strength=a.strength||2,a.distance=a.distance||20,a.class=a.class||"link"}),a.forEach(function(a){a.class=["node"],a.title&&a.class.push("real"),"skill"===a.group?(a.charge=-1e3,a.class.push("skill")):"combine"===a.group&&a.class.push("combine"),a.class=a.class.join(" "),a.charge=a.charge||-300})}function h(b){var c=q.selectAll(".node").data(b.nodes()),d=c.enter().append("g");d.append("circle"),d.append("foreignObject").append("xhtml:a"),c.exit().remove(),c.each(function(b){a.select(this).attr("class",b.class),a.select(this.childNodes[0]).attr("r",b.links.length+1);var c,d,e,f,g=.75,h=this.childNodes[1],i=h.childNodes[0];i.textContent="undefined"==typeof b.displayName?b.name:b.displayName,e=(c=i.offsetWidth)*g,f=(d=i.offsetHeight)*g,h.setAttribute("width",c),h.setAttribute("height",d),h.setAttribute("x",3),h.setAttribute("y",0),h.setAttribute("transform","scale("+g+")"),b.width=e,b.height=f,b.scale=g});var e=q.selectAll(".link").data(b.links());e.enter().append("line").attr("class",function(a){return a.class}),e.exit().remove()}function i(a,b){var c=4,d=a.width+16,e=a.x-d,f=a.x+d,g=a.y-d/c,h=a.y+d/c;return function(d,i,j,k,l){if(d.point&&d.point!==a){var m=a.x-d.point.x,n=a.y-d.point.y,o=Math.sqrt(m*m+n*n*c*c),p=a.width+d.point.width;p>o&&(o=(o-p)/o*.5*b,m*=o,n*=o,a.x-=m,a.y-=n,d.point.x+=m,d.point.y+=n)}return i>f||e>k||j>h||g>l}}var j=a.select(a.select("#skills").node().parentNode),k=700,l=a.select(".section.skills .canvas").style("height",k+"px").style("overflow","hidden").style("border","1px solid silver"),m=l.node().getBoundingClientRect().width,n=m+200,o=k+300,p=l.append("div"),q=p.append("svg").attr("width",n).attr("height",o).style({left:-(n-m)/2+"px",top:-(o-k)/2+"px",position:"relative"});q.on("click",function(){var b,d=$(a.event.target).closest(".node");d.length&&(b=a.select(d[0]).data()[0])&&b.title&&a.json(c.urls.articleBlob(b.title),function(a){null!==a&&require(["fancybox"],function(b){b(a.content,{title:a.title,margin:[50,50,50,50]})})})}).on("mousemove",function(){var b=a.mouse(this),c=b[0],d=b[1],e=100;q.selectAll(".node").attr("transform",function(a){var b=a.x-c,f=a.y-d,g=Math.sqrt(b*b+f*f),h=g/e,i=Math.atan2(f,b),j=1;return 1>h?(a.tx=c+e*Math.cos(i)*(.2>h?3*h:Math.sqrt(1-(1-h)*(1-h))),a.ty=d+e*Math.sin(i)*(.2>h?3*h:Math.sqrt(1-(1-h)*(1-h))),j=.5+1.5*Math.cos(h*Math.PI/2)):(a.tx=a.x,a.ty=a.y),"translate("+a.tx+","+a.ty+") scale("+j+")"}),q.selectAll(".link").each(function(b){a.select(this).attr({x1:b.source.tx,y1:b.source.ty,x2:b.target.tx,y2:b.target.ty})})}),function(){function b(b,c){d=[Math.round((b-g)/f)*f+g,Math.round((c-h)/f)*f+h],e&&a.timer(function(){return e=Math.abs(d[0]-i[0])<.5&&Math.abs(d[1]-i[1])<.5,e?i=d:(i[0]+=.14*(d[0]-i[0]),i[1]+=.14*(d[1]-i[1])),x=(g-i[0])/f,y=(h-i[1])/f,p.style(q,"translate("+x+"px,"+y+"px)"),e})}function c(a,b){return}var d,e=!0,f=4,g=m/2,h=k/2,i=[n/2,o/2],j=document.body.style,q=("webkitTransform"in j?"-webkit-":"MozTransform"in j?"-moz-":"msTransform"in j?"-ms-":"OTransform"in j?"-o-":"")+"transform",r=!0,s=!1;l.on("mouseout",function(){s&&b(g,h),r&&c(g,h)}).on("mousemove",function(){var d=a.mouse(this);b(d[0],d[1]),r&&c(d[0],d[1])})}(),b(function(b){function c(a){var b,c=j.select(".side-nav").style("position","absolute").style("z-index","10").style("padding-left","15px");a.forEach(function(d,e){(b=d.match(/^Showcase\|(?:http:)?\/\/.*\|(.*)$/))&&(c.append("li").append("label").attr("class","radius secondary label").html(b[1].replace(/^.*? - /,"")).style("cursor","pointer").on("mouseover",k).on("click",l),delete a[e])})}function k(){j.selectAll(".side-nav label").each(function(){a.select(this).attr("class","radius secondary label")});var b=a.select(this).attr("class","radius label").html();q.selectAll(".node.hl").each(function(){a.select(this).attr("class","node")}),q.selectAll(".node").each(function(c){c.categories[b]&&a.select(this).attr("class","node hl")})}function l(){document.dispatchEvent(new CustomEvent("showcaseSelected",{detail:a.select(this).html()}))}c(b),j.select(".loading").attr("class","ng-hide");var m=n,p=o,r=[],s=[{name:"Skill",displayName:"",links:[],categories:{},fixed:!0,x:m/2,y:p/2,radius:40,charge:-300}];f(b,s,r),g(s,r);var t=a.layout.force().size([m,p]).gravity(.05).nodes(d(s)).links(e(r)).linkStrength(function(a){return a.strength}).linkDistance(function(a){return a.distance}).charge(function(a){return a.charge});h(t),t.start().on("tick",function(b){var c=a.geom.quadtree(t.nodes());t.nodes().forEach(function(a){c.visit(i(a,b.alpha))});var d=.1;t.nodes().forEach(function(a){var b=50;a.x<b&&(a.x+=(b-a.x)*d),a.x>m-b&&(a.x+=(m-b-a.x)*d),a.y<b&&(a.y+=(b-a.y)*d),a.y>p-b&&(a.y+=(p-b-a.y)*d)}),q.selectAll(".node").each(function(b){if(a.select(this).attr("transform","translate("+b.x+","+b.y+")"),"skill"===b.group){var c=b.x-m/2,d=b.y-p/2,e=(Math.atan2(c,d),this.childNodes[1]);e.setAttribute("x",b.width/b.scale*(c>0?-1:0)+(c>0?-5:5)),e.setAttribute("y",b.height/b.scale*(d>0?-1:0))}else if("Skill"!==b.name){var f=b.links[0],c=f.target.x-f.source.x,d=f.target.y-f.source.y,e=this.childNodes[1];e.setAttribute("x",b.width/b.scale*(c>0?0:-1)+(c>0?3:-3)),e.setAttribute("y",b.height/b.scale*(d>0?0:-1))}}),q.selectAll(".link").each(function(b){a.select(this).attr({x1:b.source.x,y1:b.source.y,x2:b.target.x,y2:b.target.y})})}),$(".skills :checkbox").change(function(){t.nodes(d(s)).links(e(r)),h(t),t.start()})},function(){j.select(".loading").attr("class","text-center alert-box warning").html("No response from server")})}),function(a){function b(b,d,e){function f(a,b){F.width=a||G.width(),F.height=Math.max(b||F.height||0,F.itemHeight+20),G.css({width:F.width,height:F.height}),F.width=G.width(),F.hr=(F.width-F.itemWidth-20)/2,F.vr=(F.height-F.itemHeight-20)/2,h(O)}function g(b,c){a("<img/>").load(function(){var d,e,f=parseInt(a(this).attr("width")||a(this).prop("width")),g=parseInt(a(this).attr("height")||a(this).prop("height")),h=f/g;if(F.crop?c.css("background-image","url("+b+")"):(c.attr("src",b),c.css("background-image","none")),F.resize)if(F.maintainAspectRatio){var i=c.width()/c.height();i>h?(e=c.height(),d=g*h,c.data("w",c.data("w")*h)):(d=c.width(),e=d/h,c.data("h",c.data("h")/h))}else d=F.itemWidth,e=F.itemHeight;c.css({top:parseInt(c.css("top"))-(e-c.height())/2,left:parseInt(c.css("left"))-(d-c.width())/2,width:d+4,height:e+4})}).attr("src",b),h(O)}function h(b){var c=(b+90)*Math.PI/180,d=2*Math.PI/e.length;G.find(".carousel-item").each(function(b){var f=a(this),g=c-d*b,h=1-(1-F.scaleRatio)*(1-Math.sin(g))/2,i=f.data("w")*h,j=f.data("h")*h;f.css({width:i,height:j,left:Math.cos(g)*F.hr+F.width/2-i/2,top:Math.sin(g)*F.vr+F.height/2-j/2,"z-index":Math.floor(10*h*e.length)})}),F.scrollbar&&!N&&q(r())}function i(b){var c=2*Math.PI/e.length,d=c*(180/Math.PI)*b%360;O%=360,Math.abs(d-O)>180&&(d+=d>O?-360:360),d-O>180&&d>O&&(d-=360),s(),x=setInterval(function(){Math.abs(d-O)>.5?(O+=(d-O)*(F.scrollSpeed/100),h(O)):t()},30),a.isFunction(F.itemSelect)&&F.itemSelect.call(this,{type:"itemSelect",index:b,data:e[b]})}function j(){i(H==e.length-1?0:H+1)}function k(){i(0==H?e.length-1:H-1)}function l(){Q&&F.pauseAutoScrollIfTooltip||(F.autoScroll=!0,y=setTimeout(function(){"next"==F.autoScrollDirection?j():"previous"==F.autoScrollDirection&&k()},F.autoScrollDelay))}function m(){F.mouseScroll=!0,J=F.mouseScrollSpeed;var a,b,c=0,d=F.width,e=F.height,f=F.mouseScrollReverse?-1:1;z=setInterval(function(){a=G.offset().left,b=G.offset().top,D>a&&a+d>D&&E>b&&b+e>E?(c=f*(D-(a+F.width/2))*(J/1e3),O+=c,h(O)):Math.abs(c)>.1?(c*=F.mouseScrollEase/100,O+=c,h(O)):c=0},30)}function n(){function b(a){d=a.pageX,K||(s(),c())}function c(){K=!0,A=setInterval(function(){var a=d-f,b=(360*n*a/100/F.mouseDragSpeed+g-O)*(F.mouseDragEase/100);if((b>=0?b:-b)>.1){O+=b;var c=2*Math.PI/e.length;H=Math.round(O*Math.PI/180/c),h(O)}else t()},30)}var d=0,f=0;F.mouseDrag=!0;var g=0,i=G.offset(),j=i.top,k=i.left,l=k+F.width,m=j+F.height,n=F.mouseDragReverse?1:-1;a(document).bind("mousedown",function(c){D>k&&l>D&&E>j&&m>E&&(d=f=c.pageX,g=O,a(document).bind("mousemove",b))}),a(document).bind("mouseup",function(){a(document).unbind("mousemove",b)})}function o(){F.mouseWheel=!0;var a=0,b=F.mouseWheelReverse?-1:1;G.bind("mousewheel",function(c,d){c.preventDefault(),L||(s(),L=!0,a=O,B=setInterval(function(){Math.abs(a-O)>.5?(O+=(a-O)*(F.mouseWheelSpeed/100),H=Math.round(O/360*e.length),h(O)):t()},30)),a+=d*b*10})}function p(){function b(){m=D-g.offset().left-d,c()}function c(){m=Math.max(0,Math.min(l,m)),N&&i.css("left",m+"px"),n=m/l,M||(s(),M=!0,O%=360,C=setInterval(function(){Math.abs(r()-n)>.001?(O+=(n-r())*(F.scrollbarEase/100)*360,H=Math.round(O/360*e.length),h(O)):M&&t()},30))}var d,f=a('<div class="scrollbar"></div>').appendTo(G),g=a('<div class="track"></div>').appendTo(f),i=a('<div class="thumb"></div>').appendTo(g),j=a('<div class="left"></div>').appendTo(f),k=a('<div class="right"></div>').appendTo(f),l=g.width()-i.width(),m=0,n=0;f.css({top:F.height/2+F.vr,left:F.width/2-f.width()/2}),i.bind("mousedown",function(c){c.preventDefault(),d=D-i.offset().left,N=!0,a(document).bind("mousemove",b)}),a(document).bind("mouseup",function(){N&&(N=!1,a(document).unbind("mousemove",b))}),j.click(function(){m=i.offset().left-g.offset().left-F.arrowScrollAmount,c()}),k.click(function(){m=i.offset().left-g.offset().left+F.arrowScrollAmount,c()})}function q(a){var b=G.find(".scrollbar").find(".track"),c=b.find(".thumb");c.css("left",a*(parseInt(b.css("width"))-parseInt(c.css("width"))))}function r(){var a=O%360/360;return 0>a&&(a+=1),a}function s(){u(),P||(P=!0,a.isFunction(F.scrollStart)&&F.scrollStart.call(this))}function t(){u(),P&&(P=!1,a.isFunction(F.scrollComplete)&&F.scrollComplete.call(this)),F.mouseScroll&&m(),F.autoScroll&&l()}function u(){z&&clearInterval(z),A&&(K=!1,clearInterval(A)),B&&(L=!1,clearInterval(B)),C&&(M=!1,clearInterval(C)),x&&clearInterval(x),y&&clearTimeout(y)}function v(b){var c=e[b].tooltip;if(c){Q=!0;var d=G.find(".tooltip").css({display:"block",width:"auto",padding:"0px"});d.find("p").html(c),d.stop().animate({opacity:1},300);var f=(O+90)*Math.PI/180,g=2*Math.PI/e.length,h=f-g*b,i=d.outerWidth()/2*(-1-Math.cos(h)),j=0-d.outerHeight()-parseInt(d.css("marginBottom"));d.css({left:D-G.offset().left+i,top:E-G.offset().top+j}),a(document).bind("mousemove.tooltip",function(){d.css({left:D-G.offset().left+i,top:E-G.offset().top+j})}),y&&F.pauseAutoScrollIfTooltip&&clearTimeout(y)}}function w(){if(Q){Q=!1;var b=G.find(".tooltip");b.stop().animate({opacity:0},200,function(){a(document).unbind("mousemove.tooltip"),b.css("left",-9999)}),F.autoScroll&&F.pauseAutoScrollIfTooltip&&l()}}var x,y,z,A,B,C,D,E,F=a.extend({},c,d),G=a(b),H=0,I=[],J=F.mouseScrollSpeed,K=!1,L=!1,M=!1,N=!1,O=0,P=!1,Q=!1;G.addClass("carousel"),f(F.width,F.height),e.forEach(function(b,c){var d=a('<img class="carousel-item"/>').appendTo(G);I.push(d),d.css({width:F.itemWidth,height:F.itemHeight}).data({w:F.itemWidth,h:F.itemHeight,index:c,name:b.name}).addClass("out").bind({mouseover:function(){a(this).hasClass("out")&&a(this).removeClass("out").addClass("over"),F.tooltip&&v(c),F.mouseScroll&&(J=F.mouseScrollSpeedHover),a.isFunction(F.itemMouseOver)&&F.itemMouseOver.call(this,{type:"itemMouseOver",index:c,data:b})},mouseout:function(){a(this).hasClass("over")&&a(this).removeClass("over").addClass("out"),F.tooltip&&w(),F.mouseScroll&&(J=F.mouseScrollSpeed)},click:function(){G.find(".click").removeClass("click").addClass("out"),a(this).removeClass("over").addClass("click"),F.scrollOnClick&&i(c),a.isFunction(F.itemClick)&&F.itemClick.call(this,{type:"itemClick",index:c,data:b})}}),b.link&&d.css("cursor","pointer"),g(b.url,d)}),F.autoScroll&&l(),F.mouseScroll&&m(),F.mouseDrag&&n(),F.mouseWheel&&o(),F.scrollbar&&p(),F.tooltip&&a('<div class="tooltip"><p></p></div>').appendTo(G),a(document).bind("mousemove",function(a){D=a.pageX,E=a.pageY}),a(window).resize(function(){G.css("width","100%"),f()}),this.startAutoScroll=l,this.stopAutoScroll=function(){F.autoScroll=!1,clearTimeout(y)},this.startMouseScroll=m,this.stopMouseScroll=function(){F.mouseScroll=!1,clearInterval(z)},this.startMouseDrag=n,this.stopMouseDrag=function(){K=F.mouseDrag=!1,clearInterval(A)},this.startMouseWheel=o,this.stopMouseWheel=function(){L=F.mouseWheel=!1,clearInterval(B)},this.scrollToItem=i,this.scrollToNext=j,this.scrollToPrevious=k,this.isScrolling=function(){return P},this.updateSize=f}a.fn.carousel=function(a,c){return new b(this[0],a,c)};var c={width:"100%",height:100,itemWidth:100,itemHeight:100,hr:300,vr:20,resize:!0,maintainAspectRatio:!0,crop:!1,scaleRatio:.3,mouseScroll:!1,scrollOnClick:!0,mouseDrag:!1,scrollbar:!1,arrowScrollAmount:50,tooltip:!0,mouseScrollEase:90,mouseDragEase:10,scrollbarEase:10,scrollSpeed:10,mouseDragSpeed:20,mouseScrollSpeed:10,mouseScrollSpeedHover:3,mouseWheel:!1,mouseWheelSpeed:10,mouseScrollReverse:!1,mouseDragReverse:!1,mouseWheelReverse:!1,autoScroll:!1,autoScrollDirection:"next",autoScrollDelay:3e3,pauseAutoScrollIfTooltip:!0,linkTarget:"_blank",itemSelect:null,itemClick:null,itemMouseOver:null,scrollStart:null,scrollComplete:null}}(jQuery),require(["tagsdata","config"],function(a,b){var c=$("#showcase").parent(),d=c.find(".snapshot").bind("mousewheel",function(a){var b=a.originalEvent.wheelDelta;b>0&&600>=b&&0==this.scrollTop&&a.preventDefault(),0>b&&b>=-600&&this.scrollTop+this.offsetHeight==this.scrollHeight&&a.preventDefault()});a(function(a){c.find(".loading").attr("class","ng-hide");var e=a.filter(function(a){return a.match(/^Showcase\|(http:)?\/\//)}).map(function(a){var c=a.split("|"),d=c.pop().replace(/^.*? - /,""),e=c.length,f="http:"+c[1].replace(/^http:/,""),g=4==e?c[2]:"1200x900";return{link:b.urls.showcase(f),url:b.urls.thumbnail(btoa(f).replace(/\//g,"-"),g),snapshot:b.urls.snapshot(btoa(f).replace(/\//g,"-"),g),name:d,tooltip:d}}),f=$(".carousel"),g=f.carousel({height:500,scaleRatio:.6,itemWidth:150,itemHeight:150,mouseDrag:!0,itemClick:function(a){var b=a.data;d.is(":hidden")&&(d.show(),g.updateSize(f.width(),300)),d.find("img").attr("src",b.snapshot),d.find(".name").html(b.name),b.link&&d.find("a").attr("href",b.link)}},e);document.addEventListener("showcaseSelected",function(a){f.find("img").each(function(b,c){$(c).data().name===a.detail&&(location.hash="#showcase",c.click())})})},function(){c.find(".loading").attr("class","text-center alert-box warning").html("No response from server")})}),function(){var a=["http://ditu.google.cn/maps?f=q","&source=s_q&hl=en-US&geocode=","&q=%E6%B2%B3%E5%8D%97%E7%9C%81%E5%AE%89%E9%98%B3%E5%B8%82","&aq=&brcurrent=3,0x31508e64e5c642c1:0x951daa7c349f366f,1%3B5,0,0","&brv=25.1-b20b3018_4134eab6_98868b16_719d4a7b_295494d9","&sll=34.759666,113.752441&sspn=11.847635,16.567383","&t=m&g=%E6%B2%B3%E5%8D%97%E7%9C%81&ie=UTF8&hq=","&hnear=%E6%B2%B3%E5%8D%97%E7%9C%81%E5%AE%89%E9%98%B3%E5%B8%82","&ll=30,10&spn=106.729155,225&iwloc=near&output=embed"].join(""),b='<iframe width="100%" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>',c=$("#map");c.html(b.replace("><",' src="'+a+(c.width()>700?"&z=2":"&z=1")+'"><'))}();