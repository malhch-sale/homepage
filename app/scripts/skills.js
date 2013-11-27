require(['d3'], function(d3) {
    var containerHeight = 600,
        container = d3.select(d3.select('#skills').node().parentNode).append('div')
            .style('height', containerHeight + 'px')
            .style('overflow', 'hidden'),
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


    d3.json('http://localhost/api/articles/tags', function fn(res) {
        if (res === null) return;

        // 手动指定固定于中心点的 Skills 节点
        var width = canvasWidth,
            height = canvasHeight,
            links = [],
            nodes = [{
                name: 'Skill',
                displayName: '',
                links: [],
                categories: {
                    Skill: 1
                },
                fixed: true,
                x: width / 2,
                y: height / 2,
                radius: 40,
                charge: -800
            }];
        parseNodesAndLinks(res, nodes, links);
        prepareNodesAndLinks(nodes, links);

        force = d3.layout.force()
            .size([width, height])
            .nodes(nodes).links(links)
        /*.gravity(0)
            .friction(0.9)*/
        .linkStrength(10)
            .linkDistance(100)
            .charge(function(node) {
                return -400;
            });

        var glinks = svg.selectAll('.link').data(force.links())
            .enter().append('line').attr('class', 'link');

        var gnodes = svg.selectAll('.node').data(force.nodes())
            .enter().append('g').attr('class', 'node');
        gnodes.append('circle');
        gnodes.append('text').text(function fn(node) {
            return node.name;
        }).attr('transform', function fn() {
            return 'scale(0.5)';
        }).attr('dx', function fn(node) {
            return -d3.select(this).node().getBBox().width / 2;
        }).attr('dy', function fn(node) {
            return d3.select(this).node().getBBox().height / 2;
        })

        force.start()
            .on('tick', function(options) {
                svg.selectAll('.node').each(function fn(node) {
                    var g = d3.select(this).attr("transform", translate);

                    g.select('circle').attr('r', g.select('text').node().getBBox().width / 4 + 5);
                });
            })
            .on('end', function() {
                svg.selectAll('.link').each(function fn(link) {
                    d3.select(this).attr({
                        x1: link.source.x,
                        y1: link.source.y,
                        x2: link.target.x,
                        y2: link.target.y
                    });
                });
            });

        function translate(node) {
            return "translate(" + node.px + "," + node.py + ")";
        }
    });

    function parseNodesAndLinks(res, nodes, links) {
        var parent, group, name, title, link, pnode, cnode, names, path, category, map = {};

        // 给预先设置的节点一个机会
        nodes.forEach(function(node) {
            map[node.name] = node;
        });
        /**
         * 从原始数据组织 nodes 和 links
         * res is like ["CKEditor|Showcase - My Journal", ...]
         */
        res.forEach(function fn(row) {
            parent = group = category = '';
            names = [];
            row.split('|').forEach(function(tag, i) {
                if (!group || tag.match(/^Showcase/)) {
                    return group = tag;
                }
                category = category || group;
                group === 'Knowledge' && (group = 'Skill');
                names.push(name = (title = tag).replace(/^.* - /g, ''));
                path = names.join('->');

                // 创建虚拟的节点
                (cnode = map[path]) || nodes.push(cnode = map[path] = {
                    name: name,
                    level: i,
                    categories: {},
                    links: []
                });
                cnode.categories[category] = 1;

                if (parent) {
                    map[parent].categories[category] = 1;
                    if (parent !== name && !map[parent + '--' + name]) {
                        link = map[parent + '--' + name] = {
                            source: map[parent],
                            target: cnode
                        };
                        links.push(link);
                        map[parent].links.push(link);
                        cnode.links.push(link);
                    }
                } else {
                    // 这里只为第一层赋予 group 值
                    cnode.group = group.toLowerCase();
                    // 把第一级非 Showcase 都认定为基本 Skills，所以此处创建它们与 Skills 结点的连线
                    if (map[group]) {
                        map[group].categories[category] = 1;
                        if (!map[group + '--' + name]) {
                            links.push(link = map[group + '--' + name] = {
                                source: map[group],
                                target: cnode
                            });
                            map[group].links.push(link);
                            cnode.links.push(link);
                        }
                    } else {
                        cnode.group = 'Skill';
                    }
                }
                parent = names.join('->');
            });

            // 最后一个 name 对应的是 title
            cnode.title = title;
        });
    }

    function prepareNodesAndLinks(nodes, links) {
        /**
         * 统一定制各个参数
         */
        links.forEach(function fn(link) {
            if (link.source.name === 'Skill') {
                link.strength = 0.5;
                link.distance = 120;
            } else if (link.source.group === 'skill') {
                link.strength = 1;
                link.distance = 40;
            }

            link.strength = link.strength || 0.5;
            link.distance = link.distance || 20;
            link.class = link.class || 'link';
        });
        nodes.forEach(function fn(node) {
            node.class = ['node'];
            node.title && node.class.push('real');

            if (node.group === 'skill') {
                node.charge = -500;
                node.class.push('skill');
            } else if (node.group === 'combine') {
                node.class.push('combine');
            }
            node.class = node.class.join(' ');
            node.charge = node.charge || -50;
        });
    }
});