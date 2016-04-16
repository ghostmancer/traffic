var visualizer = {
    width: view.size.width,
    height: view.size.height,
    paths: [],
    points: [],
    polys: [],
    drawnPolys: []
}

init();

function init() {
    generatePoints();
    /*createPaths();
    renderPaths();*/
    createPolys();
    renderPolys();
}

function scramblePoints() {
    // scramble existing points
    for(var i = 0; i < visualizer.points.length; i++) {
        visualizer.points[i].position.x = random(0, visualizer.width);
        visualizer.points[i].position.y = random(0, visualizer.height);
    }
}

function generatePoints() {
    // generate random points across canvas
    for(var i = 0; i < 20; i++) {
        var newPoint = {
            position: new Point(random(0, visualizer.width), random(0, visualizer.height)),
            paths: []
        }
        visualizer.points.push(newPoint);
    }
}

function createPolys() {
    // create polygons connecting points to nearby points
    for(var i = 0; i < visualizer.points.length; i++) {
        var currPoint = visualizer.points[i];
        var nearestArray = getNearestPoints(currPoint);
        var newPoly = {
            color: '',
            points: []
        };

        for(var j = 0; j < 4; j++) {
            var nearestPoint = nearestArray[j];
            newPoly.points.push(nearestPoint.position);
        }

        var r = random(0, 255);
        var g = random(0, 255);
        var b = random(0, 255);
        newPoly.color = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.3)';

        visualizer.polys.push(newPoly);
    }
}

function renderPolys() {
    for(var i = 0; i < visualizer.polys.length; i++) {
        var newPath = new Path(visualizer.polys[i].points);
        newPath.closed = true;
        newPath.fillColor = visualizer.polys[i].color;
        drawnPolys.push(newPath);
    }
}

function createPaths() {
    // create paths connecting points to nearby points
    for(var i = 0; i < visualizer.points.length; i++) {
        var currPoint = visualizer.points[i];
        var nearestArray = getNearestPoints(currPoint);
        for(var j = 0; j < 4; j++) {
            var nearestPoint = nearestArray[j];
            var newPath = {
                points: [
                    currPoint,
                    nearestPoint
                ]
            }
            addPathToPoint(currPoint, nearestPoint, newPath);
        }
    }
}

function renderPaths() {
    // paint paths onto canvas
    for(var i = 0; i < visualizer.paths.length; i++) {
        var currPath = visualizer.paths[i];
        var newPath = new Path.Line(currPath.points[0].position, currPath.points[1].position);
        newPath.strokeColor = 'black';
    }
}

function addPathToPoint(pointA, pointB, path) {
    // add a path to the points it connects to, but only if the path is new
    function checkIfPathExists(point, path) {
        for(var i = 0; i < point.paths.length; i++) {
            if(point.paths[i] == path) {
                return true;
            }
        }
        return false;
    }

    if(checkIfPathExists(pointA, path) || checkIfPathExists(pointB, path)) {
        return;
    }

    visualizer.paths.push(path);
    pointA.paths.push(path);
    pointB.paths.push(path);
}

function getNearestPoints(point) {
    // returns sorted array of nearest points
    var distances = [];
    var sortedArray = [];

    for(var i = 0; i < visualizer.points.length; i++) {
        if(visualizer.points[i] != point) {
            distances.push({
                point: visualizer.points[i],
                distance: point.position.getDistance(visualizer.points[i].position)
            });
        }
    }

    distances.sort(function(a, b) {
        return a.distance - b.distance;
    });

    for(var i = 0; i < distances.length; i++) {
        sortedArray.push(distances[i].point);
    }

    return sortedArray;
}

function onKeyDown(event) {
    if(event.key == 'space') {
        scramblePoints();
    }
}

function onFrame(event) {
    //for(var i = 0; i < visualizer.drawnPolys.length)
}

function random(min, max) {
    // generate random integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
