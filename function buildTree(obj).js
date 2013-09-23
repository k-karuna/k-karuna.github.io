   function buildTree(obj) {
                        for(var key in obj) if(obj.hasOwnProperty(key)) {
                            if(obj[key].hasOwnProperty('length')) {
                                var str = obj[key][2];
                                var pos = 0;
                                var dot_arr = [];
                                while(true) {
                                    if(str.indexOf('.', pos) == -1) {
                                        break;
                                    }
                                    else {
                                        dot_arr.push(str.indexOf('.', pos));
                                        pos = str.indexOf('.', pos) + 1;
                                    }
                                }
                                if(dot_arr.length == 0) {
                                    var ext = 'other';
                                }
                                else {
                                    ext = str.slice(dot_arr.pop() + 1, str.length);
                                    ext = ext.toLowerCase();
                                }
                                while (key in tree.leafs) {
                                    key += Math.random();
                                }
                                tree.leafs[key] = {
                                    'ext' : ext
                                }

                            }
                            else {
                                var oldKey = key;
                                while (key in tree.leafs) {
                                    key += Math.random();
                                }
                                tree.leafs[key] = {
                                    'ext' : 'f'
                                }
                                buildTree(obj[oldKey]);
                            }
                        }

                    }