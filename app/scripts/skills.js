require(['d3', 'tagsdata', 'config'], function(d3, tagsdata, config) {
    var section = d3.select(d3.select('#skills').node().parentNode),
        containerHeight = 700,
        container = d3.select('.section.skills .canvas')
            .style('height', containerHeight + 'px')
            .style('overflow', 'hidden')
            .style('border', '1px solid silver'),
        containerWidth = container.node().getBoundingClientRect().width,
        canvasWidth = containerWidth + 200,
        canvasHeight = containerHeight + 300,
        canvas = container.append('div'),
        svg = canvas.append('svg')
            .attr('width', canvasWidth).attr('height', canvasHeight)
            .style({
                left: -(canvasWidth - containerWidth) / 2 + 'px',
                top: -(canvasHeight - containerHeight) / 2 + 'px',
                position: 'relative'
            });

    /**
     * 点击 svg 中的节点，在 fancybox 中显示文章内容
     */
    svg
        .on('click', function showSkill() {
            var node, $node = $(d3.event.target).closest('.node');
            if ($node.length && (node = d3.select($node[0]).data()[0]) && node.title) {
                d3.json(config.urls.articleBlob(node.title), function fn(res) {
                    if (res === null) return;

                    require(['fancybox'], function(fancybox) {
                        fancybox(res.content, {
                            title: res.title,
                            margin: [50, 50, 50, 50]
                        });
                    });
                });
            }
        })
        .on('mousemove', function fn() {
            var m = d3.mouse(this),
                mx = m[0],
                my = m[1],
                r = 100;

            svg.selectAll('.node').attr('transform', function fn(node) {
                var dx = node.x - mx,
                    dy = node.y - my,
                    d = Math.sqrt(dx * dx + dy * dy),
                    k = d / r,
                    theta = Math.atan2(dy, dx),
                    scale = 1;
                if (k < 1) {
                    node.tx = mx + r * Math.cos(theta) * (k < 0.2 ? 3 * k : Math.sqrt(1 - (1 - k) * (1 - k)));
                    node.ty = my + r * Math.sin(theta) * (k < 0.2 ? 3 * k : Math.sqrt(1 - (1 - k) * (1 - k)));
                    scale = 0.5 + 1.5 * Math.cos(k * Math.PI / 2);
                } else {
                    node.tx = node.x;
                    node.ty = node.y;
                }
                return "translate(" + node.tx + "," + node.ty + ") scale(" + scale + ")";
            });
            svg.selectAll('.link').each(function fn(link) {
                d3.select(this).attr({
                    x1: link.source.tx,
                    y1: link.source.ty,
                    x2: link.target.tx,
                    y2: link.target.ty
                });
            });
        });

    /**
     * 鼠标移动特效
     */
    (function() {
        var idle = true,
            z = 4,
            cx = containerWidth / 2,
            cy = containerHeight / 2,
            df, cf = [canvasWidth / 2, canvasHeight / 2],
            style = document.body.style,
            transform = ("webkitTransform" in style ? "-webkit-" //
                : "MozTransform" in style ? "-moz-" //
                : "msTransform" in style ? "-ms-" //
                : "OTransform" in style ? "-o-" : "") + "transform",
            enableMoveNodes = true,
            returnToCenter = false;

        function moveCanvas(mx, my) {
            df = [Math.round((mx - cx) / z) * z + cx, Math.round((my - cy) / z) * z + cy];

            if (idle) {
                d3.timer(function() {
                    idle = Math.abs(df[0] - cf[0]) < .5 && Math.abs(df[1] - cf[1]) < .5
                    if (idle) {
                        cf = df;
                    } else {
                        cf[0] += (df[0] - cf[0]) * .14;
                        cf[1] += (df[1] - cf[1]) * .14;
                    }
                    x = (cx - cf[0]) / z, y = (cy - cf[1]) / z;
                    canvas.style(transform, "translate(" + x + "px," + y + "px)");
                    return idle;
                });
            }
        }

        function moveNodes(mx, my) {
            return;
            var dx = mx / containerWidth - 0.5, // -0.5 ~ 0.5
                dy = my / containerHeight - 0.5;
            svg.selectAll('.node').attr('transform', function fn(node) {
                /*var rx = node.x - cf[0],
                    ry = node.y - cf[1],
                    r = Math.sqrt(rx * rx + ry * ry) * 0.75,
                    l = node.level || 0,
                    d = l == 1 ? 100 : l == 2 ? 150 : l == 3 ? 100 : 0;
                node.tx = node.x - cf[0] / Math.max(cf[0] / 2, r) * d * dx;
                node.ty = node.y - cf[1] / Math.max(cf[1] / 2, r) * d * dy;
                return "translate(" + node.tx + "," + node.ty + ")";*/
                var dx = node.x - mx,
                    dy = node.y - my,
                    d = Math.sqrt(dx * dx + dy * dy),
                    scale = 1;
                if (d < r) {
                    node.tx = mx + dx * rr;
                    node.ty = mx + dy * rr;
                    scale = rr - d / r;
                } else {
                    node.tx = node.x;
                    node.ty = node.y;
                }
                return "translate(" + node.tx + "," + node.ty + ") scale(" + scale + ")";
            });
            svg.selectAll('.link').each(function fn(link) {
                d3.select(this).attr({
                    x1: link.source.tx,
                    y1: link.source.ty,
                    x2: link.target.tx,
                    y2: link.target.ty
                });
            });
        }

        container
            .on('mouseout', function() {
                returnToCenter && moveCanvas(cx, cy);
                enableMoveNodes && moveNodes(cx, cy);
            })
            .on('mousemove', function() {
                var m = d3.mouse(this);
                moveCanvas(m[0], m[1]);
                enableMoveNodes && moveNodes(m[0], m[1]);
            });
    })();

    tagsdata(function fn(res) {
        parseShowcases(res);
        section.select('.loading').attr('class', 'ng-hide');

        // 手动指定固定于中心点的 Skills 节点
        var width = canvasWidth,
            height = canvasHeight,
            links = [],
            nodes = [{
                name: 'Skill',
                displayName: '',
                links: [],
                categories: {},
                fixed: true,
                x: width / 2,
                y: height / 2,
                radius: 40,
                charge: -300
            }];
        parseNodesAndLinks(res, nodes, links);
        prepareNodesAndLinks(nodes, links);

        /**
         * 配置 force
         */
        var force = d3.layout.force().size([width, height]).gravity(0.05)
            .nodes(nodesFilter(nodes)).links(linksFilter(links))
            .linkStrength(function fn(link) {
                return link.strength;
            }).linkDistance(function fn(link) {
                return link.distance;
            }).charge(function fn(node) {
                return node.charge;
            });
        drawNodesAndLinks(force);

        /**
         * 动画设计
         */
        force.start().on('tick', function(options) {
            // 每次 tick 都要重新把所有节点四分化
            var q = d3.geom.quadtree(force.nodes());
            force.nodes().forEach(function(node) {
                q.visit(collide(node, options.alpha));
            });

            // 避免挤出画面
            var alpha = 0.1; //options.alpha;
            force.nodes().forEach(function(node) {
                var d = 50;
                node.x < d && (node.x += (d - node.x) * alpha);
                node.x > width - d && (node.x += (width - d - node.x) * alpha);
                node.y < d && (node.y += (d - node.y) * alpha);
                node.y > height - d && (node.y += (height - d - node.y) * alpha);
            });

            // 画节点
            svg.selectAll('.node').each(function fn(node) {
                d3.select(this).attr("transform", "translate(" + node.x + "," + node.y + ")");

                if (node.group === 'skill') {
                    var dx = node.x - width / 2,
                        dy = node.y - height / 2,
                        a = Math.atan2(dx, dy),
                        // here because the bug for can't selecting foreignObject
                        f = this.childNodes[1];
                    f.setAttribute('x', node.width / node.scale * (dx > 0 ? -1 : 0) + (dx > 0 ? -5 : 5))
                    f.setAttribute('y', node.height / node.scale * (dy > 0 ? -1 : 0));
                } else if (node.name !== 'Skill') {
                    var link = node.links[0],
                        dx = link.target.x - link.source.x,
                        dy = link.target.y - link.source.y,
                        f = this.childNodes[1];
                    f.setAttribute('x', node.width / node.scale * (dx > 0 ? 0 : -1) + (dx > 0 ? 3 : -3))
                    f.setAttribute('y', node.height / node.scale * (dy > 0 ? 0 : -1));
                }
            });

            // 画连线
            svg.selectAll('.link').each(function fn(link) {
                d3.select(this).attr({
                    x1: link.source.x,
                    y1: link.source.y,
                    x2: link.target.x,
                    y2: link.target.y
                });
            });
        });

        $('.skills :checkbox').change(function(event) {
            force.nodes(nodesFilter(nodes)).links(linksFilter(links));
            drawNodesAndLinks(force);
            force.start();
        });

        function parseShowcases(res) {
            var m, container = section.select('.side-nav')
                    .style('position', 'absolute')
                    .style('z-index', '10')
                    .style('padding-left', '15px');
            res.forEach(function(row, i) {
                if (m = row.match(/^Showcase\|(?:http:)?\/\/.*\|(.*)$/)) {
                    container.append('li').append('label')
                        .attr('class', 'radius secondary label').html(m[1].replace(/^.*? - /, ''))
                        .style('cursor', 'pointer')
                        .on('mouseover', highlightShowcase)
                        .on('click', showSnapshot);
                    delete res[i];
                }
            });
        }

        function highlightShowcase() {
            section.selectAll('.side-nav label').each(function() {
                d3.select(this).attr('class', 'radius secondary label');
            });

            var caseName = d3.select(this).attr('class', 'radius label').html();
            svg.selectAll('.node.hl').each(function fn(node) {
                d3.select(this).attr('class', 'node');
            });
            svg.selectAll('.node').each(function fn(node) {
                if (node.categories[caseName]) {
                    d3.select(this).attr('class', 'node hl');
                }
            });
        }

        function showSnapshot() {
            document.dispatchEvent(new CustomEvent('showcaseSelected', {
                detail: d3.select(this).html()
            }));
        }
    }, function() {
        section.select('.loading')
            .attr('class', 'text-center alert-box warning')
            .html('No response from server');
    });

    function nodesFilter(nodes) {
        var checked = [];
        $('.skills :checkbox').each(function fn(index, el) {
            el.checked && checked.push(el.name);
        });
        return nodes.filter(function(node) {
            return checked.some(function fn(category) {
                return node.categories && node.categories[category];
            });
        });
    }

    function linksFilter(links) {
        var checked = [];
        $('.skills :checkbox').each(function fn(index, el) {
            el.checked && checked.push(el.name);
        });
        return links.filter(function(link) {
            return checked.some(function fn(category) {
                var s = link.source.categories,
                    t = link.target.categories;
                return s && s[category] && t && t[category];
            });
        });
    }

    function parseNodesAndLinks(res, nodes, links) {
        var map = {};

        // 给预先设置的节点一个机会
        nodes.forEach(function(node) {
            map[node.name] = node;
        });
        /**
         * 从原始数据组织 nodes 和 links
         */
        res.forEach(function fn(row) {
            // row is considered as "category|nodeA|nodeB|...|title"
            var node, level = 0,
                path = '',
                parts = row.split('|'),
                title = parts.pop().replace(/^.*? - /g, ''),
                category = parts.shift();

            if (category == 'Showcase') {
                makeNode('|' + parts.join('|'), parts.pop(), title);
            } else {
                node = makeNode(nodes[0] && nodes[0].name || '', 'Root', category, level++);
                parts.forEach(function(name) {
                    makeLink(node, node = makeNode(path += '|' + name, name, category, level++));
                });
                makeLink(node, makeNode(path + '|' + title, title, category, level++));
            }
        });

        return;

        function makeNode(path, name, category, level) {
            var node = map[path];
            if (!node) {
                nodes.push(map[path] = node = {
                    name: name,
                    categories: {},
                    links: [],
                    group: level == 1 ? 'skill' : ''
                });
            }
            node.categories[category] = 1;
            return node;
        }

        function makeLink(pnode, cnode) {
            var key = pnode.name + '<-->' + cnode.name;
            if (!map[key]) {
                links.push(link = map[key] = {
                    source: pnode,
                    target: cnode
                });
                pnode.links.push(link);
                cnode.links.push(link);
            }
        }
    }

    function prepareNodesAndLinks(nodes, links) {
        /**
         * 统一定制各个参数
         */
        links.forEach(function fn(link) {
            if (link.source.name === 'Skill') {
                link.strength = 1;
                link.distance = 80;
            } else if (link.source.group === 'skill') {
                link.strength = 1;
                link.distance = 40;
            }

            link.strength = link.strength || 2;
            link.distance = link.distance || 20;
            link.class = link.class || 'link';
        });
        nodes.forEach(function fn(node) {
            node.class = ['node'];
            node.title && node.class.push('real');

            if (node.group === 'skill') {
                node.charge = -1000;
                node.class.push('skill');
            } else if (node.group === 'combine') {
                node.class.push('combine');
            }
            node.class = node.class.join(' ');
            node.charge = node.charge || -300;
        });
    }

    function drawNodesAndLinks(force) {
        var gnodes = svg.selectAll('.node').data(force.nodes());

        // 这两行没用，加上反而无法正常显示内容
        //.attr('requiredExtensions', "http://www.w3.org/1999/xhtml")
        //.append('xhtml:body').attr('xmlns', "http://www.w3.org/1999/xhtml")
        var enter = gnodes.enter().append('g');
        enter.append('circle');
        enter.append('foreignObject').append('xhtml:a');
        gnodes.exit().remove();

        gnodes.each(function(node) {
            d3.select(this).attr('class', node.class);
            d3.select(this.childNodes[0]).attr('r', node.links.length + 1);
            var w, h, rw, rh, scale = 0.75,
                f = this.childNodes[1],
                a = f.childNodes[0];
            a.textContent = typeof node.displayName === 'undefined' ? node.name : node.displayName;
            rw = (w = a.offsetWidth) * scale, rh = (h = a.offsetHeight) * scale;
            f.setAttribute('width', w);
            f.setAttribute('height', h);
            f.setAttribute('x', 3);
            f.setAttribute('y', 0);
            f.setAttribute('transform', 'scale(' + scale + ')');

            node.width = rw, node.height = rh, node.scale = scale;
            //g.append('ellipse').attr('rx', rw).attr('ry', rw / 5).style('fill', 'none');
        });
        //gnodes.call(force.drag)

        var glinks = svg.selectAll('.link').data(force.links());
        glinks.enter().append('line').attr('class', function fn(link) {
            return link.class;
        });
        glinks.exit().remove();
    }

    function collide(node, alpha) {
        var flattening = 4;
        var r = node.width + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r / flattening,
            ny2 = node.y + r / flattening;
        return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    // 此处对 y 进行加倍，逻辑是：对于指定的 x，本来在 y=sqrt(r*r-x*x) 处满足条件 l < r 时
                    // **就**触发碰撞，可是现在 y 在本身的 1/flattening 处才要触发，所以。。。
                    l = Math.sqrt(x * x + y * y * flattening * flattening),
                    r = node.width + quad.point.width;
                if (l < r) {
                    l = (l - r) / l * 0.5 * alpha;
                    x *= l;
                    y *= l;
                    node.x -= x;
                    node.y -= y;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }
});