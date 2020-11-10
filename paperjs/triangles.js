/* * This file assumes browser executed paperjs
 *
 * * * * * * * * * * * * * * * * * * * * * * * */

const Vector2 = (x, y) => [x, y]

const center = ([x0, y0], [w, h]) => {
  return Vector2(x0 + (w)/2, y0 + (h/2))
}

const triangle = ([x, y], o) => {

}

const homotopy = ([x0, x1], [t0, t1], fn, x) => {
  const p = fn(x)

  return x0 * ((t1 - p)/ (t1-t0)) +  x1 * ((p - t0)/ (t1-t0))
}

const pointHomotopy = (p1, p2, fnx, fny, t) => {
  with (paper) {

    return p1.multiply(( (p1j
    return new Point(
      homotopy(
        [p1.x, p2.x],
        [0, 1],
        fnx,
        t
      ), homotopy(
        [p1.y, p2.y],
        [0, 1],
        fny,
        t
      )
    )
  }
}

function makeCircle(center) {

  with(paper){
    const path = new Path.Circle({
      center,
      radius: 30,
    })

    path.center = center

    path.animate = ({count}) => {
      const point1 = new Point(0,0)
      const point2 = new Point(
        homotopy(
          [view.bounds.x, 0],
          [-1, 1],
          (x) => {
            return Math.sin(x*.2)
          },
          count
        ),
        0
      )

      path.position = path.center.add(point2)
    }

    return path
  }
}


function makeIntersection(center) {
  with (paper) {
    const { x, y , width, height } = view.bounds

    return [
      new Point(
        homotopy(
          [x, x + width],
          [0, 1],
          () => Math.random()
        ), homotopy(
          [y, y + height],
          [0, 1],
          () => Math.random()
        )
      ), new Point(
        homotopy(
          [x, x + width],
          [0, 1],
          () => Math.random()
        ), homotopy(
          [y, y + height],
          [0, 1],
          () => Math.random()
        ))
    ].map(
      point => new Path.Line({
        from: center.add(point),
        to:  center.add(point).transform(
          new Matrix(-1, 0, 0, -1, 0, 0)
        ),
        strokeColor: 'black'
      })
    )
  }
}


window.onload = function() {
  console.log('hello')

  paper.setup('triangles')

  with (paper) {
    const { _width, _height } = view.viewSize
    // Define a random point in the view, which we will be moving
    // the text item towards.
    // // {x: 50, y: 25} and a size of {width: 50, height: 50}
    view.center = new Point(0, 0)

    const bg = new Shape.Rectangle({
      rectangle: view.bounds,
      fillColor: 'rgba(79, 86, 168, .3)'
    })

    const c2 = makeCircle(new Point(10,10))
    const c1 = makeCircle(new Point(0,0))
    c2.fillColor = 'rgba(79,86, 168, .5)'
    c1.fillColor = 'hsl(235deg, 36%, 46%)'
    const c3 = makeCircle(new Point(0, 0))
    c3.set({radius: 10})
    c3.fillColor = 'red'


    const intersection = makeIntersection(view.center)

    view.onMouseMove = ({point}) => {
      c2.position = point
      c1.position = point.transform(new Matrix(-1,0,0,-1,0,0))
    }

    view.onFrame = ({count}) => {
      c3.position = pointHomotopy(
        c1.position, c2.position,
        t => (Math.sin(t * .2) + 1)/2 ,
        t => -(Math.sin(t * .2) + 1)/2 ,
        count
      )
    }
  }

}
